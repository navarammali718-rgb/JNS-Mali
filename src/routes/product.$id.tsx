import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Heart, Minus, Plus, ShieldCheck, ShoppingCart, Star, Truck, Loader2, Check } from "lucide-react";
import { formatPrice } from "@/lib/catalog";
import { useStore } from "@/components/store/store-context";
import { Button } from "@/components/ui/button";
import { getProductByIdFn } from "@/server-functions";

export const Route = createFileRoute('/product/$id')({
  component: Product
});

function Product() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { add, setQty: setCartQty, remove, cart, toggleWish, wishlist } = useStore();
  const [qty, setQty] = useState<number>(1);
  const [p, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await getProductByIdFn({ data: id });
        if (data) {
          const prod = { ...data, id: data._id || data.id };
          setProduct(prod);
          // Initialise qty from existing cart
          const cartQty = cart[prod.id] ?? 0;
          setQty(cartQty > 0 ? cartQty : 1);
        } else {
          setProduct(null);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  const inCart = p ? (cart[p.id] ?? 0) > 0 : false;

  // Increase qty — immediately adds/updates cart
  const handleIncrease = () => {
    const newQty = qty + 1;
    setQty(newQty);
    if (p) setCartQty(p.id, newQty);
  };

  // Decrease qty — immediately updates/removes from cart
  const handleDecrease = () => {
    const newQty = Math.max(1, qty - 1);
    setQty(newQty);
    if (p) setCartQty(p.id, newQty);
  };

  // Explicit Add to Cart (for first-time add)
  const handleAddToCart = () => {
    if (p) {
      setCartQty(p.id, qty);
      // Navigate directly to cart
      void navigate({ to: "/cart" });
    }
  };

  if (isLoading) {
    return <div className="py-32 flex justify-center"><Loader2 className="size-10 animate-spin text-primary" /></div>;
  }

  if (!p) {
    return <div className="py-32 text-center text-xl font-bold">Product not found</div>;
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-5 text-sm text-muted-foreground">
        <Link to="/shop">Shop</Link> / {p.name}
      </nav>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-lg bg-muted">
          <img src={p.imageUrl || p.image} alt={p.name} width={1008} height={1008} className="aspect-square w-full object-cover" />
        </div>
        <div className="lg:py-4">
          <p className="text-sm font-bold uppercase text-primary">{p.category} · {p.isAvailable !== false ? "Available" : "Not Available"}</p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">{p.name}</h1>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <Star className="size-4 fill-rating text-rating" />
            <b>{p.rating || 4.5}</b>
            <span className="text-muted-foreground">{p.reviews || 24} verified ratings</span>
          </div>
          <div className="mt-5 flex items-end gap-3 flex-wrap">
            <div>
              <span className="text-3xl font-black">{formatPrice(p.price)}</span>
              {p.mrp && p.mrp > p.price && (
                <>
                  <span className="ml-2 text-muted-foreground line-through">{formatPrice(p.mrp)}</span>
                  <span className="ml-2 font-bold text-deal">Save {Math.round((1 - p.price / p.mrp) * 100)}%</span>
                </>
              )}
            </div>
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              / {p.unit || "Piece"} {p.piecesPerUnit > 1 ? `(${p.piecesPerUnit} pcs)` : ""}
            </div>
          </div>
          <p className="mt-5 leading-7 text-muted-foreground">{p.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex h-11 items-center rounded-md border border-input">
              <Button variant="ghost" size="icon" onClick={handleDecrease}><Minus /></Button>
              <input
                type="number"
                min="1"
                value={qty || ''}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) {
                    setQty(val);
                    if (p && inCart) setCartQty(p.id, val);
                  } else {
                    setQty(0 as any); // allow empty visually while typing
                  }
                }}
                onBlur={(e) => {
                  const val = parseInt(e.target.value);
                  const finalQty = isNaN(val) || val < 1 ? 1 : val;
                  setQty(finalQty);
                  if (p && inCart) setCartQty(p.id, finalQty);
                }}
                className="w-12 text-center font-bold bg-transparent border-none outline-none focus:ring-0"
                style={{ appearance: 'textfield', WebkitAppearance: 'none', MozAppearance: 'textfield' }}
              />
              <Button variant="ghost" size="icon" onClick={handleIncrease}><Plus /></Button>
            </div>
            {inCart ? (
              <Button
                size="lg"
                className="flex-1"
                variant="secondary"
                asChild
              >
                <Link to="/cart"><ShoppingCart className="mr-2 size-4" />Go to Cart ({cart[p.id]} in cart)</Link>
              </Button>
            ) : (
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
              >
                Add to cart
              </Button>
            )}
            <Button variant="outline" size="icon" className="size-11" onClick={() => toggleWish(p.id)}>
              <Heart className={wishlist.includes(p.id) ? 'fill-primary text-primary' : ''} />
            </Button>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <span className="flex gap-2"><Truck className="size-5 text-primary" />Delivery in 2–4 days</span>
            <span className="flex gap-2"><ShieldCheck className="size-5 text-primary" />7-day replacement</span>
          </div>
        </div>
      </div>
    </main>
  );
}
