import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Heart, Minus, Plus, ShieldCheck, Star, Truck, Loader2 } from "lucide-react";
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
  const { add, toggleWish, wishlist } = useStore();
  const [qty, setQty] = useState(1);
  const [p, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await getProductByIdFn({ data: id });
        if (data) {
          setProduct({ ...data, id: data._id || data.id });
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

  const handleAddToCart = () => {
    if (p) {
      add(p.id, qty);
      navigate({ to: "/cart" });
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
          <p className="text-sm font-bold uppercase text-primary">{p.category} · {p.stock} in stock</p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">{p.name}</h1>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <Star className="size-4 fill-rating text-rating" />
            <b>{p.rating || 4.5}</b>
            <span className="text-muted-foreground">{p.reviews || 24} verified ratings</span>
          </div>
          <div className="mt-5">
            <span className="text-3xl font-black">{formatPrice(p.price)}</span>
            {p.mrp && p.mrp > p.price && (
              <>
                <span className="ml-2 text-muted-foreground line-through">{formatPrice(p.mrp)}</span>
                <span className="ml-2 font-bold text-deal">Save {Math.round((1 - p.price / p.mrp) * 100)}%</span>
              </>
            )}
          </div>
          <p className="mt-5 leading-7 text-muted-foreground">{p.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex h-11 items-center rounded-md border border-input">
              <Button variant="ghost" size="icon" onClick={() => setQty(Math.max(1, qty - 1))}><Minus /></Button>
              <input type="number" value={qty} onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))} className="w-12 text-center font-bold bg-transparent border-none focus:outline-none" style={{ appearance: "textfield", MozAppearance: "textfield" } as any} min="1" />
              <Button variant="ghost" size="icon" onClick={() => setQty(qty + 1)}><Plus /></Button>
            </div>
            <Button size="lg" className="flex-1" onClick={handleAddToCart}>Add {qty} to cart</Button>
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
