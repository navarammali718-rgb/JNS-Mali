import { Heart, Plus, ShoppingCart, MessageCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { formatPrice } from "@/lib/catalog";
import { useStore } from "./store-context";
import { Button } from "@/components/ui/button";

export function ProductCard({ product }: { product: any }) {
  const { toggleWish, wishlist, cart } = useStore();
  const wished = wishlist.includes(product.id);
  const inCart = (cart[product.id] ?? 0) > 0;

  const imageUrl = product.imageUrl || product.image || "/placeholder.png";
  const price = product.price ?? 0;
  const mrp = product.mrp && product.mrp > price ? product.mrp : null;
  const discountPercent = mrp ? Math.round((1 - price / mrp) * 100) : 0;

  const handleWhatsAppShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const host = typeof window !== "undefined" && !window.location.origin.includes("localhost")
      ? window.location.origin
      : "https://jnsmali.netlify.app";
    const shareUrl = `${host}/product/${product.id}`;
    const mrpText = mrp ? ` (MRP: ₹${mrp}, ${discountPercent}% OFF)` : "";
    const shareText = `Check out *${product.name}* on JNS MALI!\nPrice: ₹${price}${mrpText}\nUnit: ${product.unit || 'Piece'}\n\n👉 View product here:\n${shareUrl}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-border/80 bg-card transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative overflow-hidden bg-white flex items-center justify-center p-2 border-b border-border/40">
        <Link to="/product/$id" params={{ id: product.id }} className="w-full flex items-center justify-center">
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            width={400}
            height={400}
            className="aspect-square w-full object-contain transition duration-300 group-hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.png"; }}
          />
        </Link>

        {/* Discount or Custom Badge */}
        {discountPercent > 0 ? (
          <span className="absolute left-2 top-2 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-black text-white shadow-sm">
            {discountPercent}% OFF
          </span>
        ) : product.badge ? (
          <span className="absolute left-2 top-2 rounded-sm bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
            {product.badge}
          </span>
        ) : null}

        {/* Action icons */}
        <div className="absolute right-2 top-2 flex flex-col gap-1.5">
          <Button
            variant="secondary"
            size="icon"
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            onClick={() => toggleWish(product.id)}
            className="size-7 rounded-full bg-white/90 shadow-sm backdrop-blur hover:bg-white"
          >
            <Heart className={`size-3.5 ${wished ? "fill-primary text-primary" : "text-slate-600"}`} />
          </Button>

          <Button
            variant="secondary"
            size="icon"
            aria-label="Share on WhatsApp"
            onClick={handleWhatsAppShare}
            className="size-7 rounded-full bg-white/90 shadow-sm backdrop-blur hover:bg-emerald-50 text-emerald-600"
          >
            <MessageCircle className="size-3.5 fill-emerald-500 text-emerald-500" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        {product.category && (
          <p className="text-[11px] font-bold uppercase tracking-wider text-primary truncate">{product.category}</p>
        )}

        <Link
          to="/product/$id"
          params={{ id: product.id }}
          className="mt-1 line-clamp-2 min-h-10 text-sm font-bold leading-5 text-foreground hover:text-primary transition"
        >
          {product.name}
        </Link>

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-base sm:text-lg font-black text-foreground">{formatPrice(price)}</span>
              {mrp && (
                <span className="text-xs text-muted-foreground line-through font-semibold decoration-red-500/70">
                  {formatPrice(mrp)}
                </span>
              )}
            </div>
            <div className="mt-0.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              / {product.unit || "Piece"} {product.piecesPerUnit > 1 ? `(${product.piecesPerUnit} pcs)` : ""}
            </div>
          </div>

          <Link to="/product/$id" params={{ id: product.id }}>
            <Button
              size="sm"
              variant={inCart ? "secondary" : "default"}
              aria-label={`View ${product.name}`}
              className="h-8 px-2.5 text-xs font-bold flex items-center gap-1 shadow-sm"
            >
              {inCart ? <ShoppingCart className="size-3" /> : <Plus className="size-3" />}
              <span className="hidden sm:inline">{inCart ? "In cart" : "Add"}</span>
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
