import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { Heart, Minus, Plus, ShieldCheck, ShoppingCart, Star, Truck, Loader2, Check, ArrowLeft, Share2, MessageCircle } from "lucide-react";
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
  const router = useRouter();
  const { add, setQty: setCartQty, remove, cart, toggleWish, wishlist } = useStore();
  const [qty, setQty] = useState<number>(1);
  const [p, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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
      void navigate({ to: "/cart" });
    }
  };

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.history.back();
    } else {
      navigate({ to: "/" });
    }
  };

  const handleWhatsAppShare = () => {
    if (!p) return;
    const host = typeof window !== "undefined" && !window.location.origin.includes("localhost")
      ? window.location.origin
      : "https://jnsmali.netlify.app";
    const shareUrl = `${host}/product/${p.id}`;
    const mrpText = p.mrp && p.mrp > p.price ? ` (MRP: ₹${p.mrp}, ${Math.round((1 - p.price / p.mrp) * 100)}% OFF)` : "";
    const shareText = `Check out *${p.name}* on JNS MALI!\nPrice: ₹${p.price}${mrpText}\nUnit: ${p.unit || 'Piece'}\n\n👉 View product details:\n${shareUrl}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, "_blank");
  };

  if (isLoading) {
    return <div className="py-32 flex justify-center"><Loader2 className="size-10 animate-spin text-primary" /></div>;
  }

  if (!p) {
    return (
      <div className="py-32 text-center">
        <h2 className="text-xl font-bold">Product not found</h2>
        <Button onClick={() => navigate({ to: "/" })} className="mt-4 gap-2">
          <ArrowLeft className="size-4" /> Go back to home
        </Button>
      </div>
    );
  }

  // Combine primary image and additional gallery photos
  const galleryImages: string[] = [
    p.imageUrl || p.image,
    ...(Array.isArray(p.images) ? p.images : [])
  ].filter(Boolean);

  const currentDisplayImage = galleryImages[activeImageIndex] || galleryImages[0] || "/placeholder.png";

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      {/* Top Navigation & Back Button */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-bold text-foreground shadow-sm transition hover:bg-muted hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          <span>Back</span>
        </button>

        <nav className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5 truncate">
          <Link to="/" className="hover:text-primary transition">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-primary transition">Shop</Link>
          <span>/</span>
          <span className="font-semibold text-foreground truncate max-w-[200px]">{p.name}</span>
        </nav>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Photos & Gallery Column */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-white shadow-sm flex items-center justify-center p-3">
            <img
              src={currentDisplayImage}
              alt={p.name}
              className="max-h-[420px] sm:max-h-[480px] w-full object-contain transition duration-300"
              onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.png"; }}
            />
            {p.mrp && p.mrp > p.price && (
              <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-black text-white shadow-md">
                {Math.round((1 - p.price / p.mrp) * 100)}% OFF
              </span>
            )}
            {galleryImages.length > 1 && (
              <span className="absolute right-3 bottom-3 rounded-md bg-black/60 px-2 py-1 text-[11px] font-bold text-white backdrop-blur">
                {activeImageIndex + 1} / {galleryImages.length}
              </span>
            )}
          </div>

          {/* Thumbnails if multiple images exist */}
          {galleryImages.length > 1 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  More photos ({galleryImages.length})
                </span>
                <span className="text-[11px] text-muted-foreground">Tap photo to zoom view</span>
              </div>
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative shrink-0 size-16 sm:size-20 rounded-xl overflow-hidden border-2 bg-white transition ${
                      activeImageIndex === idx
                        ? "border-primary ring-2 ring-primary/20 shadow-md scale-105"
                        : "border-border opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="size-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Details Column */}
        <div className="lg:py-2">
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-primary">
              {p.category} · {p.isAvailable !== false ? "In Stock" : "Temporarily Out of Stock"}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleWhatsAppShare}
              className="gap-1.5 border-emerald-500/40 text-emerald-600 hover:bg-emerald-50 text-xs font-bold"
            >
              <MessageCircle className="size-4 fill-emerald-500 text-emerald-500" />
              <span>Share on WhatsApp</span>
            </Button>
          </div>

          <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-black text-foreground">{p.name}</h1>

          <div className="mt-3 flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-amber-700 font-bold border border-amber-200">
              <Star className="size-3.5 fill-amber-500 text-amber-500" />
              <span>{p.rating || 4.5}</span>
            </div>
            <span className="text-muted-foreground">{p.reviews || 28} verified reviews</span>
          </div>

          {/* Pricing with clear crossed-out MRP & Discount */}
          <div className="mt-5 rounded-xl border border-border/80 bg-card p-4 shadow-sm">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl sm:text-4xl font-black text-primary">
                {formatPrice(p.price)}
              </span>

              {p.mrp && p.mrp > p.price && (
                <>
                  <span className="text-lg sm:text-xl text-muted-foreground line-through font-semibold">
                    {formatPrice(p.mrp)}
                  </span>
                  <span className="rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-black text-emerald-700 border border-emerald-200">
                    Save {Math.round((1 - p.price / p.mrp) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <div className="mt-2 text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Price per {p.unit || "Piece"} {p.piecesPerUnit > 1 ? `(${p.piecesPerUnit} pieces per pack)` : ""}
            </div>
          </div>

          <p className="mt-5 leading-relaxed text-muted-foreground text-sm sm:text-base">
            {p.description || "High quality utility product designed for reliable everyday household use."}
          </p>

          {/* Quantity and Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex h-11 items-center rounded-lg border border-input bg-card shadow-sm">
              <Button variant="ghost" size="icon" onClick={handleDecrease} aria-label="Decrease quantity">
                <Minus className="size-4" />
              </Button>
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
                    setQty(0 as any);
                  }
                }}
                onBlur={(e) => {
                  const val = parseInt(e.target.value);
                  const finalQty = isNaN(val) || val < 1 ? 1 : val;
                  setQty(finalQty);
                  if (p && inCart) setCartQty(p.id, finalQty);
                }}
                className="w-12 text-center font-black bg-transparent border-none outline-none focus:ring-0 text-sm"
              />
              <Button variant="ghost" size="icon" onClick={handleIncrease} aria-label="Increase quantity">
                <Plus className="size-4" />
              </Button>
            </div>

            {inCart ? (
              <Button size="lg" className="flex-1 font-bold shadow-md" variant="secondary" asChild>
                <Link to="/cart">
                  <ShoppingCart className="mr-2 size-4" /> Go to Cart ({cart[p.id]} in cart)
                </Link>
              </Button>
            ) : (
              <Button size="lg" className="flex-1 font-bold shadow-md" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 size-4" /> Add to cart
              </Button>
            )}

            <Button
              variant="outline"
              size="icon"
              className="size-11 rounded-lg border-border"
              onClick={() => toggleWish(p.id)}
              aria-label="Save to Wishlist"
            >
              <Heart className={`size-5 ${wishlist.includes(p.id) ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
            </Button>
          </div>

          {/* WhatsApp Share Button */}
          <div className="mt-4">
            <button
              onClick={handleWhatsAppShare}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white py-3 px-4 font-bold text-sm shadow-sm transition active:scale-[0.99]"
            >
              <MessageCircle className="size-5 fill-white" />
              <span>Share on WhatsApp</span>
            </button>
          </div>

          {/* Guarantees */}
          <div className="mt-6 grid grid-cols-2 gap-3 rounded-xl border border-border/60 bg-muted/40 p-4 text-xs sm:text-sm">
            <span className="flex items-center gap-2 font-semibold">
              <Truck className="size-4 text-primary shrink-0" /> Fast delivery in 2–4 days
            </span>
            <span className="flex items-center gap-2 font-semibold">
              <ShieldCheck className="size-4 text-primary shrink-0" /> Verified quality product
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
