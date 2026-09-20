import { Heart, Plus, ShoppingCart } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { formatPrice } from "@/lib/catalog";
import { useStore } from "./store-context";
import { Button } from "@/components/ui/button";

export function ProductCard({ product }: { product: any }) {
  const { add, toggleWish, wishlist, cart } = useStore();
  const wished = wishlist.includes(product.id);
  const inCart = (cart[product.id] ?? 0) > 0;

  const imageUrl = product.imageUrl || product.image || "/placeholder.png";
  const price = product.price ?? 0;
  const mrp = product.mrp && product.mrp > price ? product.mrp : null;

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-card transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative overflow-hidden bg-muted">
        <Link to="/product/$id" params={{ id: product.id }}>
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            width={400}
            height={400}
            className="aspect-square w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.png"; }}
          />
        </Link>
        {product.badge && (
          <span className="absolute left-2 top-2 rounded-sm bg-primary px-2 py-1 text-[11px] font-bold text-primary-foreground">
            {product.badge}
          </span>
        )}
        <Button
          variant="secondary"
          size="icon"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => toggleWish(product.id)}
          className="absolute right-2 top-2 rounded-full shadow-sm"
        >
          <Heart className={wished ? "fill-primary text-primary" : ""} />
        </Button>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        {product.pack && <p className="text-xs font-medium text-muted-foreground">{product.pack}</p>}
        <Link
          to="/product/$id"
          params={{ id: product.id }}
          className="mt-1 line-clamp-2 min-h-10 text-sm font-bold leading-5 text-foreground hover:text-primary"
        >
          {product.name}
        </Link>

        {product.category && (
          <p className="mt-1 text-xs text-muted-foreground capitalize">{product.category}</p>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div>
            <span className="text-lg font-extrabold">{formatPrice(price)}</span>
            {mrp && (
              <span className="ml-1 text-xs text-muted-foreground line-through">{formatPrice(mrp)}</span>
            )}
          </div>
          <Button
            size="sm"
            variant={inCart ? "secondary" : "default"}
            aria-label={`Add ${product.name} to cart`}
            onClick={() => add(product.id, 1)}
            className="flex items-center gap-1"
          >
            {inCart ? <ShoppingCart className="size-3.5" /> : <Plus className="size-3.5" />}
            <span className="hidden sm:inline">{inCart ? "In cart" : "Add"}</span>
          </Button>
        </div>
      </div>
    </article>
  );
}
