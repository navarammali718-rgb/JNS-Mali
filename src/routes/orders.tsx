import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useUser, SignIn } from "@clerk/clerk-react";
import { Check, Clock, PackageCheck, Truck, Loader2, Package, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserOrdersFn } from "@/server-functions";
import { formatPrice } from "@/lib/catalog";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "My Orders — JNS MALI" },
      { name: "description", content: "Track your JNS MALI orders." },
      { property: "og:title", content: "My Orders — JNS MALI" },
      { property: "og:description", content: "Follow your household essentials from packing to delivery." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

const STATUS_STEPS = [
  { key: "pending", icon: Clock, title: "Confirmed" },
  { key: "pending", icon: PackageCheck, title: "Packed" },
  { key: "shipped", icon: Truck, title: "Shipped" },
  { key: "delivered", icon: Check, title: "Delivered" },
];

const statusToStep: Record<string, number> = {
  pending: 1,
  shipped: 3,
  delivered: 4,
  cancelled: 0,
};

const statusColor: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

function Page() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn || !user) { setIsLoading(false); return; }
    async function load() {
      try {
        const data = await getUserOrdersFn({ data: { userId: user!.id } });
        setOrders(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [isSignedIn, user]);

  if (!isLoaded || isLoading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-32 flex justify-center">
        <Loader2 className="size-10 animate-spin text-primary" />
      </main>
    );
  }

  if (!isSignedIn) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-primary/10">
            <Lock className="size-6 text-primary" />
          </div>
          <h1 className="text-3xl font-black">Sign in to view orders</h1>
          <p className="mt-2 text-muted-foreground">Sign in with Google to see your order history.</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <SignIn routing="virtual" />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-4xl font-black">My Orders</h1>
      <p className="mt-2 text-muted-foreground">Signed in as {user?.primaryEmailAddress?.emailAddress}</p>

      {orders.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border py-20 text-center">
          <Package className="mx-auto mb-4 size-12 text-muted-foreground" />
          <h2 className="text-xl font-bold">No orders yet</h2>
          <p className="mt-2 text-muted-foreground">Your past orders will appear here.</p>
          <Button asChild className="mt-6">
            <Link to="/shop">Start shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-7 space-y-6">
          {orders.map((order) => {
            const step = statusToStep[order.status] ?? 1;
            const shortId = `#${order._id.slice(-8).toUpperCase()}`;
            const date = new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

            return (
              <article key={order._id} className="rounded-xl border border-border bg-card">
                <header className="flex flex-wrap justify-between gap-3 border-b border-border p-5">
                  <div>
                    <p className="text-xs text-muted-foreground">ORDER {shortId} · {date}</p>
                    <h2 className="mt-1 text-xl font-black">{order.shippingDetails?.city} delivery</h2>
                    <p className="text-sm text-muted-foreground">{order.items?.length} item{order.items?.length !== 1 ? "s" : ""} · {formatPrice(order.totalAmount)}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusColor[order.status] ?? "bg-muted text-muted-foreground"}`}>
                      {order.status}
                    </span>
                    <Button asChild variant="outline" size="sm">
                      <Link to="/shop">Buy again</Link>
                    </Button>
                  </div>
                </header>

                <div className="p-5">
                  {/* Progress bar */}
                  {order.status !== "cancelled" ? (
                    <div className="grid grid-cols-4 gap-1">
                      {STATUS_STEPS.map(({ icon: Icon, title }, i) => {
                        const done = step > i;
                        const active = step === i + 1;
                        return (
                          <div key={title} className="text-center">
                            <span className={`mx-auto grid size-9 place-items-center rounded-full ${done || active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                              <Icon className="size-4" />
                            </span>
                            <div className={`mt-2 h-1 ${done ? "bg-primary" : "bg-muted"}`} />
                            <p className="mt-2 text-xs font-bold">{title}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm font-semibold text-destructive">This order was cancelled.</p>
                  )}

                  {/* Items */}
                  <div className="mt-5 space-y-2">
                    {order.items?.map((item: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 rounded-lg bg-muted/60 px-3 py-2">
                        {item.image && (
                          <img src={item.image} alt="" className="size-10 rounded-md object-cover bg-muted shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-semibold">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                        </div>
                        <span className="text-sm font-bold shrink-0">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Shipping address */}
                  <p className="mt-4 rounded-md bg-accent/40 p-3 text-sm text-muted-foreground">
                    <b className="text-foreground">Shipping to:</b>{" "}
                    {order.shippingDetails?.address}, {order.shippingDetails?.city} — {order.shippingDetails?.postalCode}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
