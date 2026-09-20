import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeIndianRupee, RotateCcw, ShieldCheck, Truck, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import hero from "@/assets/ghar-safai-hero.jpg";
import { ProductCard } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import { getProductsFn, getCategoriesFn, getStorefrontFn } from "@/server-functions";

export const Route=createFileRoute('/')({head:()=>({meta:[{title:'JNS MALI — Cleaning & Household Essentials'},{name:'description',content:'Shop affordable scrubbers, brushes, loofahs, camphor and household essentials with retail and wholesale pricing.'},{property:'og:title',content:'JNS MALI — Cleaning & Household Essentials'},{property:'og:description',content:'Everyday cleaning essentials at honest prices, delivered across India.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),component:Home});

function Home(){
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [storefront, setStorefront] = useState<any>({
    heroSubtitle: "Retail prices. Wholesale savings.",
    heroTitle: "Everyday essentials that work hard at home.",
    heroText: "From tough kitchen scrubbers to soft bath loofahs—stock your home or shop with dependable products at sensible prices."
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodData, catData, storeData] = await Promise.all([
          getProductsFn(),
          getCategoriesFn(),
          getStorefrontFn()
        ]);
        setProducts(prodData);
        setCategories(catData);
        if (storeData) setStorefront(storeData);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return <main><section className="bg-secondary/40"><div className="mx-auto grid max-w-7xl items-center gap-7 px-4 py-8 lg:grid-cols-[.9fr_1.1fr] lg:py-12"><div className="max-w-xl"><p className="mb-3 text-sm font-extrabold uppercase text-primary">{storefront.heroSubtitle}</p><h1 className="text-4xl font-black leading-[1.05] sm:text-5xl lg:text-6xl">{storefront.heroTitle}</h1><p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">{storefront.heroText}</p><div className="mt-7 flex flex-wrap gap-3"><Button asChild size="lg"><Link to="/shop">Shop all products <ArrowRight/></Link></Button><Button variant="outline" size="lg" onClick={(e) => e.preventDefault()}>Buy in bulk (Coming Soon)</Button></div><div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold"><span>✓ COD available</span><span>✓ GST invoice</span><span>✓ 7-day returns</span></div></div><div className="relative overflow-hidden rounded-lg bg-accent"><img src={storefront.heroImage || hero} alt="Colourful JNS MALI cleaning and household essentials" width={1600} height={1104} className="aspect-[4/3] w-full object-cover"/><div className="absolute bottom-3 left-3 rounded-md bg-background/95 px-4 py-3 shadow-lg"><p className="text-xs font-semibold text-muted-foreground">Combo offer</p><p className="font-black">Kitchen Starter Pack · ₹249</p></div></div></div></section>
<section className="border-y border-border bg-card"><div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-border px-4 md:grid-cols-4 md:divide-y-0">{[{icon:Truck,title:'Free delivery',sub:'Orders over ₹499'},{icon:ShieldCheck,title:'Quality checked',sub:'Useful, durable picks'},{icon:RotateCcw,title:'Easy returns',sub:'Within 7 days'},{icon:BadgeIndianRupee,title:'Better in bulk',sub:'Automatic tier prices'}].map(({icon:I,title,sub})=><div key={title} className="flex items-center gap-3 p-4"><I className="size-6 shrink-0 text-primary"/><div><b className="text-sm">{title}</b><p className="text-xs text-muted-foreground">{sub}</p></div></div>)}</div></section>
<section className="mx-auto max-w-7xl px-4 py-12"><div className="flex items-end justify-between"><div><p className="text-sm font-bold text-primary">Find it faster</p><h2 className="text-3xl font-black">Shop by category</h2></div><Button asChild variant="link"><Link to="/shop">View all <ArrowRight/></Link></Button></div><div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">{categories.map(c=><Link key={c.slug} to="/category/$slug" params={{slug:c.slug}} className="group overflow-hidden rounded-lg border border-border bg-card"><img src={c.image} alt={c.name} loading="lazy" width={1008} height={1008} className="aspect-[4/3] w-full object-cover transition group-hover:scale-[1.03]"/><div className="p-4"><h3 className="font-bold">{c.name}</h3><p className="text-xs text-muted-foreground">{c.blurb}</p></div></Link>)}</div></section>
<section className="bg-muted/60"><div className="mx-auto max-w-7xl px-4 py-12"><p className="text-sm font-bold text-primary">Customer favourites</p><div className="flex items-end justify-between"><h2 className="text-3xl font-black">Most reordered</h2><Link to="/shop" className="text-sm font-bold text-primary">See everything →</Link></div>
{isLoading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin size-8 text-primary" /></div> : <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">{products.slice(0,5).map(p=><ProductCard key={p._id || p.id} product={{...p, id: p._id || p.id}}/>)}</div>}
</div></section>
<section className="mx-auto max-w-7xl px-4 py-12"><div className="grid overflow-hidden rounded-lg bg-foreground text-background lg:grid-cols-2"><div className="p-7 sm:p-10"><p className="text-sm font-bold text-secondary">JNS MALI WHOLESALE</p><h2 className="mt-2 text-3xl font-black">Running a shop, hostel or office?</h2><p className="mt-3 max-w-lg text-sm leading-6 opacity-75">Add cartons or mixed cases, see your savings instantly and get a GST-ready order summary. No calls or bargaining required.</p><Button variant="secondary" size="lg" className="mt-6" onClick={(e) => e.preventDefault()}>Open bulk shopping (Coming Soon)</Button></div><div className="grid grid-cols-3 border-t border-background/15 lg:border-l lg:border-t-0">{[['12+','minimum pieces'],['Up to 25%','bulk savings'],['48 hrs','dispatch']].map(([a,b])=><div key={a} className="grid place-content-center border-r border-background/15 p-5 text-center last:border-r-0"><b className="text-2xl text-secondary">{a}</b><span className="text-xs opacity-65">{b}</span></div>)}</div></div></section></main>}
