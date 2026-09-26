import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Package, Tag, ShoppingBag, TrendingUp, Clock, CheckCircle, Loader2, ArrowRight } from "lucide-react";
import { getAdminProductsFn, getCategoriesFn, getAllOrdersFn, registerAdminFcmTokenFn } from "@/server-functions";
import { formatPrice } from "@/lib/catalog";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    revenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [products, categories, orders] = await Promise.all([
          getAdminProductsFn(),
          getCategoriesFn(),
          getAllOrdersFn(),
        ]);
        const revenue = orders.reduce((s: number, o: any) => s + (o.totalAmount ?? 0), 0);
        const pendingOrders = orders.filter((o: any) => o.status === "pending").length;
        const deliveredOrders = orders.filter((o: any) => o.status === "delivered").length;
        setStats({
          products: products.length,
          categories: categories.length,
          orders: orders.length,
          revenue,
          pendingOrders,
          deliveredOrders,
        });
        setRecentOrders(orders.slice(0, 5));
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    
    async function setupPush() {
      try {
        const { PushNotifications } = await import('@capacitor/push-notifications');
        const { Capacitor } = await import('@capacitor/core');
        
        if (Capacitor.isNativePlatform()) {
          let permStatus = await PushNotifications.checkPermissions();
          if (permStatus.receive === 'prompt') {
            permStatus = await PushNotifications.requestPermissions();
          }
          if (permStatus.receive !== 'granted') {
            throw new Error('User denied permissions!');
          }
          PushNotifications.addListener('registration', async (token) => {
            console.log("Got FCM token", token.value);
            await registerAdminFcmTokenFn({ data: { token: token.value } });
          });
          
          PushNotifications.addListener('pushNotificationReceived', () => {
            // When a notification is received while the app is open, instantly refresh data
            load();
          });
          
          await PushNotifications.register();
        }
      } catch (e) {
        console.error("Push setup failed", e);
      }
    }
    
    load();
    setupPush();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-10 animate-spin text-primary" />
      </div>
    );
  }

  const statCards = [
    { label: "Total Products", value: stats.products, icon: Package, color: "from-blue-500/20 to-blue-600/10", iconColor: "text-blue-400", link: "/admin/products" },
    { label: "Categories", value: stats.categories, icon: Tag, color: "from-purple-500/20 to-purple-600/10", iconColor: "text-purple-400", link: "/admin/categories" },
    { label: "Total Orders", value: stats.orders, icon: ShoppingBag, color: "from-emerald-500/20 to-emerald-600/10", iconColor: "text-emerald-400", link: "/admin/orders" },
    { label: "Revenue", value: formatPrice(stats.revenue), icon: TrendingUp, color: "from-amber-500/20 to-amber-600/10", iconColor: "text-amber-400", link: "/admin/orders" },
  ];

  const statusColor: Record<string, string> = {
    pending: "bg-amber-500/20 text-amber-400",
    shipped: "bg-blue-500/20 text-blue-400",
    delivered: "bg-emerald-500/20 text-emerald-400",
    cancelled: "bg-red-500/20 text-red-400",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Dashboard</h1>
        <p className="mt-1 font-medium text-slate-500">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, color, iconColor, link }) => (
          <Link
            key={label}
            to={link as any}
            className={`group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br ${color} border border-slate-100 shadow-sm p-4 transition hover:border-slate-300 hover:shadow-md bg-white`}
          >
            <div className={`mb-2 sm:mb-3 flex size-8 sm:size-10 items-center justify-center rounded-lg sm:rounded-xl bg-white shadow-sm ${iconColor}`}>
              <Icon className="size-4 sm:size-5" />
            </div>
            <p className="text-lg sm:text-2xl font-black text-slate-900">{value}</p>
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm font-semibold text-slate-500">{label}</p>
            <ArrowRight className="absolute right-3 top-3 sm:right-4 sm:top-4 size-3 sm:size-4 text-slate-300 transition group-hover:text-slate-600" />
          </Link>
        ))}
      </div>

      {/* Quick status */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-amber-50">
            <Clock className="size-5 text-amber-500" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{stats.pendingOrders}</p>
            <p className="text-sm font-medium text-slate-500">Pending orders</p>
          </div>
          <Link to="/admin/orders" className="ml-auto text-xs font-bold text-primary hover:underline">
            View →
          </Link>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-emerald-50">
            <CheckCircle className="size-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{stats.deliveredOrders}</p>
            <p className="text-sm font-medium text-slate-500">Delivered orders</p>
          </div>
          <Link to="/admin/orders" className="ml-auto text-xs font-bold text-primary hover:underline">
            View →
          </Link>
        </div>
      </div>

      {/* Recent orders */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-4">
          <h2 className="font-bold text-slate-900">Recent Orders</h2>
          <Link to="/admin/orders" className="text-xs font-bold text-primary hover:underline">
            View all →
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="py-10 text-center text-slate-500">No orders yet.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentOrders.map((order) => (
              <div key={order._id} className="flex flex-wrap items-center gap-3 px-5 py-3 hover:bg-slate-50 transition">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-900">
                    {order.shippingDetails?.fullName ?? "Unknown"}
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    {order.items?.length ?? 0} item{order.items?.length !== 1 ? "s" : ""} ·{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <span className="text-sm font-black text-slate-900">{formatPrice(order.totalAmount)}</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${
                    order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    order.status === 'packed' ? 'bg-indigo-100 text-indigo-700' :
                    order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-700'
                  }`}
                >
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
