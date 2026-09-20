import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, ShoppingBag, ChevronDown, ChevronUp } from "lucide-react";
import { getAllOrdersFn, updateOrderStatusFn } from "@/server-functions";
import { formatPrice } from "@/lib/catalog";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

const STATUS_OPTIONS = ["pending", "shipped", "delivered", "cancelled"];

const statusColor: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  shipped: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  delivered: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  async function load() {
    try {
      const data = await getAllOrdersFn();
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleStatusChange(id: string, status: string) {
    setUpdatingId(id);
    try {
      await updateOrderStatusFn({ data: { id, status } });
      setOrders((prev) => prev.map((o) => o._id === id ? { ...o, status } : o));
    } finally {
      setUpdatingId(null);
    }
  }

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">Orders</h1>
        <p className="mt-1 text-slate-400">{orders.length} total orders</p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {["all", ...STATUS_OPTIONS].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition ${
              filter === s
                ? "bg-primary text-primary-foreground"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            {s}
            <span className="ml-1.5 opacity-70">
              ({s === "all" ? orders.length : orders.filter((o) => o.status === s).length})
            </span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="size-10 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 py-20 text-center">
          <ShoppingBag className="mx-auto mb-4 size-12 text-slate-600" />
          <p className="text-slate-400">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const isOpen = expanded === order._id;
            return (
              <div key={order._id} className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
                {/* Order header row */}
                <button
                  className="flex w-full flex-wrap items-center gap-3 px-5 py-4 text-left hover:bg-slate-800/50 transition"
                  onClick={() => setExpanded(isOpen ? null : order._id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono text-slate-500">#{order._id.slice(-8).toUpperCase()}</span>
                      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold capitalize ${statusColor[order.status] ?? "bg-slate-700 text-slate-300 border-slate-600"}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="mt-1 font-semibold text-white">{order.shippingDetails?.fullName ?? "—"}</p>
                    <p className="text-xs text-slate-400">
                      {order.shippingDetails?.phone} · {order.shippingDetails?.city} · {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-white">{formatPrice(order.totalAmount)}</p>
                    <p className="text-xs text-slate-400">{order.items?.length} item{order.items?.length !== 1 ? "s" : ""}</p>
                  </div>
                  {isOpen ? <ChevronUp className="size-4 text-slate-500 shrink-0" /> : <ChevronDown className="size-4 text-slate-500 shrink-0" />}
                </button>

                {/* Expanded details */}
                {isOpen && (
                  <div className="border-t border-slate-800 px-5 py-4 space-y-4">
                    {/* Items */}
                    <div>
                      <h3 className="mb-2 text-xs font-bold uppercase text-slate-500 tracking-wider">Items</h3>
                      <div className="space-y-2">
                        {order.items?.map((item: any, i: number) => (
                          <div key={i} className="flex items-center gap-3">
                            {item.image && <img src={item.image} alt="" className="size-10 rounded-lg object-cover bg-slate-800 shrink-0" />}
                            <div className="flex-1 min-w-0">
                              <p className="truncate text-sm font-semibold text-white">{item.name}</p>
                              <p className="text-xs text-slate-400">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                            </div>
                            <span className="text-sm font-bold text-white">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <h3 className="mb-2 text-xs font-bold uppercase text-slate-500 tracking-wider">Shipping Address</h3>
                      <p className="text-sm text-slate-300">
                        {order.shippingDetails?.address}, {order.shippingDetails?.city} — {order.shippingDetails?.postalCode}
                      </p>
                      <p className="text-sm text-slate-300">Phone: {order.shippingDetails?.phone}</p>
                    </div>

                    {/* Status change */}
                    <div>
                      <h3 className="mb-2 text-xs font-bold uppercase text-slate-500 tracking-wider">Update Status</h3>
                      <div className="flex flex-wrap gap-2">
                        {STATUS_OPTIONS.map((s) => (
                          <Button
                            key={s}
                            size="sm"
                            variant={order.status === s ? "default" : "outline"}
                            className={`capitalize border-slate-700 text-slate-300 hover:border-primary ${order.status === s ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
                            onClick={() => handleStatusChange(order._id, s)}
                            disabled={updatingId === order._id || order.status === s}
                          >
                            {updatingId === order._id && order.status !== s ? (
                              <Loader2 className="mr-1 size-3 animate-spin" />
                            ) : null}
                            {s}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
