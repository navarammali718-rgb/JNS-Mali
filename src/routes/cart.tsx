import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/catalog";
import { useStore } from "@/components/store/store-context";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute('/cart')({
  head: () => ({
    meta: [
      { title: 'Shopping Cart — JNS MALI' },
      { name: 'description', content: 'Review your JNS MALI shopping cart.' },
      { property: 'og:title', content: 'Shopping Cart — JNS MALI' },
      { property: 'og:description', content: 'Review household essentials in your cart.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' }
    ]
  }),
  component: Cart
});

function Cart() {
  const { cart, setQty, subtotal, products, isProductsLoading, storefront } = useStore();
  const items = products.filter(p => cart[p.id]);
  const threshold = storefront?.freeDeliveryThreshold ?? 499;
  const baseDelivery = storefront?.deliveryFee ?? 49;
  const delivery = subtotal >= threshold ? 0 : baseDelivery;

  if (isProductsLoading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-32 flex justify-center">
        <Loader2 className="size-10 animate-spin text-primary" />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-4xl font-black">Your cart</h1>
      {items.length ? (
        <div className="mt-7 grid gap-7 lg:grid-cols-[1fr_360px]">
          <section className="space-y-3">
            {items.map(p => (
              <article key={p.id} className="grid grid-cols-[90px_minmax(0,1fr)_auto] gap-4 rounded-lg border border-border bg-card p-3">
                <img src={p.imageUrl || p.image} alt="" className="size-[90px] rounded-md object-cover" />
                <div className="min-w-0">
                  <Link to="/product/$id" params={{ id: p.id }} className="font-bold">{p.name}</Link>
                  <p className="text-xs text-muted-foreground">{p.unit || 'Piece'}{p.piecesPerUnit > 1 ? ` (${p.piecesPerUnit} pcs)` : ''}</p>
                  <div className="mt-3 flex w-fit items-center rounded-md border border-input">
                    <Button variant="ghost" size="icon" onClick={() => setQty(p.id, (cart[p.id] ?? 0) - 1)}><Minus /></Button>
                    <b className="w-7 text-center">{cart[p.id] ?? 0}</b>
                    <Button variant="ghost" size="icon" onClick={() => setQty(p.id, (cart[p.id] ?? 0) + 1)}><Plus /></Button>
                  </div>
                </div>
                <div className="text-right">
                  <b>{formatPrice(p.price * (cart[p.id] ?? 0))}</b>
                  <Button variant="ghost" size="icon" className="mt-5 text-destructive" onClick={() => setQty(p.id, 0)}><Trash2 /></Button>
                </div>
              </article>
            ))}
          </section>
          <aside className="h-fit rounded-lg border border-border bg-card p-5">
            <h2 className="text-xl font-black">Order summary</h2>
            <Row a="Subtotal" b={formatPrice(subtotal)} />
            <Row a="Delivery" b={delivery ? `₹${baseDelivery}+` : 'FREE'} />
            <div className="mt-4 flex justify-between border-t border-border pt-4 text-lg font-black">
              <span>Total</span>
              <span>{formatPrice(subtotal + delivery)}</span>
            </div>
            {subtotal < threshold && <p className="mt-3 rounded-md bg-secondary/60 p-3 text-xs font-semibold">Add {formatPrice(threshold - subtotal)} more for free delivery.</p>}
            <Button asChild size="lg" className="mt-5 w-full">
              <Link to="/checkout">Proceed to checkout</Link>
            </Button>
            <Link to="/shop" className="mt-3 block text-center text-sm font-bold text-primary">Continue shopping</Link>
          </aside>
        </div>
      ) : (
        <div className="mt-8 rounded-lg border border-dashed p-14 text-center">
          <ShoppingBag className="mx-auto size-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-bold">Your cart is empty</h2>
          <Button asChild className="mt-5">
            <Link to="/shop">Start shopping</Link>
          </Button>
        </div>
      )}
    </main>
  );
}

function Row({ a, b }: { a: string, b: string }) {
  return (
    <div className="mt-4 flex justify-between text-sm">
      <span className="text-muted-foreground">{a}</span>
      <b>{b}</b>
    </div>
  );
}
