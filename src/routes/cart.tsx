import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, Loader2, ArrowLeft } from "lucide-react";
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
  const baseDelivery = storefront?.deliveryFee ?? 40;
  const delivery = subtotal >= threshold ? 0 : baseDelivery;

  if (isProductsLoading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-32 flex justify-center">
        <Loader2 className="size-10 animate-spin text-primary" />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-3 sm:px-4 py-4 sm:py-8 pb-32 sm:pb-8 min-w-0 overflow-x-hidden">
      <Link
        to="/shop"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition mb-4"
      >
        <ArrowLeft className="size-4" /> Continue Shopping
      </Link>
      <h1 className="text-2xl sm:text-4xl font-black">Your cart</h1>
      {items.length ? (
        <div className="mt-5 sm:mt-7 grid gap-6 sm:gap-7 lg:grid-cols-[minmax(0,1fr)_360px] min-w-0">
          <section className="space-y-3 min-w-0">
            {items.map(p => (
              <article key={p.id} className="grid grid-cols-[72px_minmax(0,1fr)] sm:grid-cols-[90px_minmax(0,1fr)_auto] gap-3 sm:gap-4 rounded-xl border border-border bg-card p-3 sm:p-4 min-w-0">
                <img src={p.imageUrl || p.image} alt="" className="size-[72px] sm:size-[90px] rounded-lg object-cover bg-white" />
                <div className="min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <Link to="/product/$id" params={{ id: p.id }} className="font-bold text-sm sm:text-base line-clamp-2 hover:text-primary">{p.name}</Link>
                    <div className="text-right sm:hidden shrink-0">
                      <b className="text-sm font-black text-primary">{formatPrice(p.price * (cart[p.id] ?? 0))}</b>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.unit || 'Piece'}{p.piecesPerUnit > 1 ? ` (${p.piecesPerUnit} pcs)` : ''}</p>
                  <div className="mt-2.5 flex items-center justify-between sm:justify-start gap-2">
                    <div className="flex w-fit items-center rounded-lg border border-input bg-muted/40">
                      <Button variant="ghost" size="icon" className="size-8" onClick={() => setQty(p.id, (cart[p.id] ?? 0) - 1)}><Minus className="size-3.5" /></Button>
                      <input
                        type="number"
                        min="1"
                        value={cart[p.id] || ''}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val)) setQty(p.id, val);
                        }}
                        onBlur={(e) => {
                          const val = parseInt(e.target.value);
                          if (isNaN(val) || val < 1) setQty(p.id, 1);
                        }}
                        className="w-10 text-center font-bold bg-transparent border-none outline-none focus:ring-0 text-xs sm:text-sm"
                        style={{ appearance: 'textfield', WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                      />
                      <Button variant="ghost" size="icon" className="size-8" onClick={() => setQty(p.id, (cart[p.id] ?? 0) + 1)}><Plus className="size-3.5" /></Button>
                    </div>
                    <Button variant="ghost" size="icon" className="size-8 text-destructive sm:hidden" onClick={() => setQty(p.id, 0)}><Trash2 className="size-4" /></Button>
                  </div>
                </div>
                <div className="text-right hidden sm:block shrink-0">
                  <b className="text-base font-black">{formatPrice(p.price * (cart[p.id] ?? 0))}</b>
                  <Button variant="ghost" size="icon" className="mt-4 text-destructive hover:bg-destructive/10" onClick={() => setQty(p.id, 0)}><Trash2 className="size-4" /></Button>
                </div>
              </article>
            ))}
          </section>
          <aside className="h-fit rounded-xl border border-border bg-card p-4 sm:p-5 min-w-0">
            <h2 className="text-lg sm:text-xl font-black">Order summary</h2>
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

      {/* Mobile sticky checkout bar */}
      {items.length > 0 && (
        <div className="fixed inset-x-0 bottom-14 z-20 border-t border-border bg-background/95 backdrop-blur px-4 py-2.5 flex items-center justify-between gap-3 sm:hidden shadow-lg max-w-full">
          <div>
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-base font-black">{formatPrice(subtotal + delivery)}</p>
          </div>
          <Button asChild size="sm" className="flex-1">
            <Link to="/checkout">Proceed to checkout</Link>
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
