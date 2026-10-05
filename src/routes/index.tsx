import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, BadgeIndianRupee, RotateCcw, ShieldCheck, Truck, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import hero from "@/assets/ghar-safai-hero.jpg";
import { ProductCard } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import { getCategoriesFn } from "@/server-functions";
import { useStore } from "@/components/store/store-context";

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'JNS MALI — Cleaning & Household Essentials' },
      { name: 'description', content: 'Shop affordable scrubbers, brushes, loofahs, camphor and household essentials with retail and wholesale pricing.' },
      { property: 'og:title', content: 'JNS MALI — Cleaning & Household Essentials' },
      { property: 'og:description', content: 'Everyday cleaning essentials at honest prices, delivered across India.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' }
    ]
  }),
  component: Home
});

function Home() {
  const { products, storefront, isProductsLoading } = useStore();
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);
  const bannerScrollRef = useRef<HTMLDivElement>(null);

  const heroImage = storefront?.heroImage || hero;
  const freeDelivery = storefront?.freeDeliveryThreshold ?? 499;

  // Active banners list from storefront DB, fallback to single hero
  const banners = storefront?.banners && storefront.banners.length > 0
    ? storefront.banners
    : [{
        imageUrl: heroImage,
        title: "Everyday Household & Cleaning Essentials",
        priceTag: "Starting ₹39",
        mrpTag: "Up to 40% OFF",
        productId: "",
        linkUrl: "/shop"
      }];

  useEffect(() => {
    async function loadData() {
      try {
        const catData = await getCategoriesFn();
        setCategories(catData);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Auto rotate banners if more than 1
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBannerIdx((prev) => {
        const next = (prev + 1) % banners.length;
        if (bannerScrollRef.current) {
          const width = bannerScrollRef.current.clientWidth;
          bannerScrollRef.current.scrollTo({ left: next * width, behavior: "smooth" });
        }
        return next;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [banners.length]);

  const scrollToBanner = (idx: number) => {
    setActiveBannerIdx(idx);
    if (bannerScrollRef.current) {
      const width = bannerScrollRef.current.clientWidth;
      bannerScrollRef.current.scrollTo({ left: idx * width, behavior: "smooth" });
    }
  };

  return (
    <main>
      {/* Front Store Banner Carousel with Price Tags (Requirement 3 & 5) */}
      <section className="bg-secondary/30 pt-3 pb-2 sm:py-6">
        <div className="mx-auto max-w-7xl px-4">
          <div className="relative group">
            <div
              ref={bannerScrollRef}
              onScroll={(e) => {
                const el = e.currentTarget;
                const idx = Math.round(el.scrollLeft / (el.clientWidth || 1));
                if (idx !== activeBannerIdx && idx >= 0 && idx < banners.length) {
                  setActiveBannerIdx(idx);
                }
              }}
              className="flex overflow-x-auto snap-x snap-mandatory rounded-2xl shadow-sm scrollbar-hide"
              style={{ scrollbarWidth: "none" }}
            >
              {banners.map((b: any, i: number) => {
                const bannerContent = (
                  <div className="relative min-w-full shrink-0 snap-center overflow-hidden rounded-2xl bg-slate-900 h-[190px] sm:h-[260px] md:h-[340px] lg:h-[420px]">
                    <img
                      src={b.imageUrl || heroImage}
                      alt={b.title || "Banner offer"}
                      className="size-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                      loading={i === 0 ? "eager" : "lazy"}
                    />

                    {/* Gradient Overlay for Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

                    {/* Aesthetic Floating Price Tag Box (Requirement 5) */}
                    <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 max-w-[90%] sm:max-w-md rounded-xl bg-black/60 backdrop-blur-md border border-white/20 p-2.5 sm:p-4 text-white shadow-xl transition hover:bg-black/70">
                      {b.title && (
                        <p className="font-black text-xs sm:text-base md:text-lg text-white leading-tight line-clamp-1 drop-shadow-sm">
                          {b.title}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {b.priceTag && (
                          <span className="rounded-md bg-primary px-2.5 py-0.5 text-xs sm:text-sm font-black text-white shadow-sm">
                            {b.priceTag}
                          </span>
                        )}
                        {b.mrpTag && (
                          <span className="text-xs sm:text-sm font-semibold text-white/75 line-through">
                            {b.mrpTag}
                          </span>
                        )}
                        <span className="inline-flex items-center text-[11px] sm:text-xs font-bold text-emerald-300 underline underline-offset-2 ml-1">
                          Shop Now →
                        </span>
                      </div>
                    </div>
                  </div>
                );

                if (b.productId) {
                  return (
                    <Link key={i} to="/product/$id" params={{ id: b.productId }} className="block min-w-full">
                      {bannerContent}
                    </Link>
                  );
                }

                if (b.linkUrl) {
                  return (
                    <Link key={i} to={b.linkUrl as any} className="block min-w-full">
                      {bannerContent}
                    </Link>
                  );
                }

                return (
                  <Link key={i} to="/shop" className="block min-w-full">
                    {bannerContent}
                  </Link>
                );
              })}
            </div>

            {/* Left / Right Carousel Controls */}
            {banners.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => scrollToBanner((activeBannerIdx - 1 + banners.length) % banners.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 grid size-9 place-items-center rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/70 transition opacity-0 group-hover:opacity-100 hidden sm:grid"
                  aria-label="Previous banner"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToBanner((activeBannerIdx + 1) % banners.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 grid size-9 place-items-center rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/70 transition opacity-0 group-hover:opacity-100 hidden sm:grid"
                  aria-label="Next banner"
                >
                  <ChevronRight className="size-5" />
                </button>

                {/* Dots indicator */}
                <div className="absolute bottom-2 right-4 sm:bottom-4 sm:right-6 flex items-center gap-1.5 z-10">
                  {banners.map((_: any, i: number) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => scrollToBanner(i)}
                      className={`h-2 rounded-full transition-all ${
                        activeBannerIdx === i ? "w-6 bg-primary" : "w-2 bg-white/60 hover:bg-white"
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

<section className="mx-auto max-w-7xl px-4 py-8 lg:py-12">
  <div className="flex items-end justify-between">
    <div>
      <p className="text-sm font-bold text-primary">Find it faster</p>
      <h2 className="text-2xl sm:text-3xl font-black">Shop by category</h2>
    </div>
    <Button asChild variant="link" className="px-0"><Link to="/shop">View all <ArrowRight className="ml-1 size-4"/></Link></Button>
  </div>
  <div className="mt-6 flex overflow-x-auto pb-4 gap-5 snap-x snap-mandatory lg:grid lg:grid-cols-4 lg:gap-4" style={{ scrollbarWidth: "none" }}>
    {categories.map(c=>
      <Link key={c.slug} to="/category/$slug" params={{slug:c.slug}} className="group shrink-0 w-[84px] lg:w-auto snap-start text-center lg:text-left lg:overflow-hidden lg:rounded-xl lg:border lg:border-border lg:bg-card lg:shadow-sm">
        <div className="mx-auto overflow-hidden rounded-full w-[72px] h-[72px] border-2 border-border/50 lg:w-full lg:h-auto lg:rounded-none lg:border-none">
          <img src={c.image} alt={c.name} loading="lazy" width={1008} height={1008} className="aspect-square lg:aspect-[4/3] w-full h-full object-cover transition group-hover:scale-[1.03]"/>
        </div>
        <div className="pt-2 lg:p-4">
          <h3 className="font-bold text-[11px] leading-tight lg:text-base">{c.name}</h3>
          <p className="hidden lg:block text-xs text-muted-foreground mt-1">{c.blurb}</p>
        </div>
      </Link>
    )}
  </div>
</section>
<section className="border-y border-border bg-card"><div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-border px-4 md:grid-cols-4 md:divide-y-0">{[{icon:Truck,title:'Free delivery',sub:`Orders over ₹${freeDelivery}`},{icon:ShieldCheck,title:'Quality checked',sub:'Useful, durable picks'},{icon:RotateCcw,title:'Easy returns',sub:'Within 7 days'},{icon:BadgeIndianRupee,title:'Better in bulk',sub:'Automatic tier prices'}].map(({icon:I,title,sub})=><div key={title} className="flex items-center gap-3 p-4"><I className="size-6 shrink-0 text-primary"/><div><b className="text-sm">{title}</b><p className="text-xs text-muted-foreground">{sub}</p></div></div>)}</div></section>
<section className="bg-muted/60"><div className="mx-auto max-w-7xl px-4 py-12"><p className="text-sm font-bold text-primary">Customer favourites</p><div className="flex items-end justify-between"><h2 className="text-3xl font-black">Most reordered</h2><Link to="/shop" className="text-sm font-bold text-primary">See everything →</Link></div>
{isLoading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin size-8 text-primary" /></div> : <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">{products.slice(0,5).map(p=><ProductCard key={p._id || p.id} product={{...p, id: p._id || p.id}}/>)}</div>}
        </div>
      </section>
    </main>
  );
}
