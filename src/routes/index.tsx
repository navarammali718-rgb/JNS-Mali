import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeIndianRupee, RotateCcw, ShieldCheck, Truck, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import hero from "@/assets/ghar-safai-hero.jpg";
import { ProductCard } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import { getCategoriesFn } from "@/server-functions";
import { useStore } from "@/components/store/store-context";

export const Route=createFileRoute('/')({head:()=>({meta:[{title:'JNS MALI — Cleaning & Household Essentials'},{name:'description',content:'Shop affordable scrubbers, brushes, loofahs, camphor and household essentials with retail and wholesale pricing.'},{property:'og:title',content:'JNS MALI — Cleaning & Household Essentials'},{property:'og:description',content:'Everyday cleaning essentials at honest prices, delivered across India.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),component:Home});

function Home(){
  const { products, storefront, isProductsLoading } = useStore();
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fallback defaults if the user cleared them in DB
  const heroImage = storefront?.heroImage || hero;
  const freeDelivery = storefront?.freeDeliveryThreshold ?? 499;

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

  return <main>
    <section className="bg-secondary/40 pt-4 pb-2 lg:py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="relative overflow-hidden rounded-xl bg-accent shadow-sm h-[180px] sm:h-[220px] lg:h-[400px]">
          <img src={heroImage} alt="Colourful JNS MALI cleaning and household essentials" width={1600} height={1104} className="h-full w-full object-cover"/>
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
</div></section>
</main>}
