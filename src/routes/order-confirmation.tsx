import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { Check, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

const schema = z.object({
  orderId: z.string().optional(),
});

export const Route = createFileRoute("/order-confirmation")({
  validateSearch: schema,
  head: () => ({
    meta: [
      { title: "Order Confirmed — JNS MALI" },
      { name: "description", content: "Your JNS MALI order is confirmed." },
      { property: "og:title", content: "Order Confirmed — JNS MALI" },
      { property: "og:description", content: "Your household essentials are on their way." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  const { orderId } = Route.useSearch();
  const shortId = orderId ? `#${orderId.slice(-8).toUpperCase()}` : "#—";

  return (
    <main className="mx-auto max-w-2xl px-4 py-16 text-center">
      <span className="mx-auto grid size-20 place-items-center rounded-full bg-primary text-primary-foreground">
        <Check className="size-10" />
      </span>
      <p className="mt-6 font-bold text-primary">ORDER {shortId}</p>
      <h1 className="mt-2 text-4xl font-black">Thank you! Your order is confirmed.</h1>
      <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
        We've received your order and will start packing it right away. You'll receive updates when it's shipped.
      </p>

      <div className="mt-8 rounded-lg border border-border bg-card p-5 text-left">
        <div className="flex gap-3">
          <Package className="text-primary shrink-0" />
          <div>
            <b>Order {shortId} confirmed</b>
            <p className="mt-1 text-sm text-muted-foreground">
              Your order is pending and will be prepared for dispatch soon. Estimated delivery: 2–4 business days.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-7 flex justify-center gap-3 flex-wrap">
        <Button asChild>
          <Link to="/orders">Track my orders</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/shop">Continue shopping</Link>
        </Button>
      </div>
    </main>
  );
}
