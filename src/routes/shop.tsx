import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SlidersHorizontal, Loader2 } from "lucide-react";
import { z } from "zod";
import { ProductCard } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import { getProductsFn, getCategoriesFn } from "@/server-functions";

const schema=z.object({q:z.string().optional(),category:z.string().optional()});
export const Route=createFileRoute('/shop')({validateSearch:schema,head:()=>({meta:[{title:'Shop Household Products — JNS MALI'},{name:'description',content:'Browse affordable kitchen, bath, cleaning and home utility products.'},{property:'og:title',content:'Shop Household Products — JNS MALI'},{property:'og:description',content:'Browse practical home essentials at retail and wholesale prices.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'}]}),component:Shop});

function Shop() {
  const search = Route.useSearch();
  const [cat, setCat] = useState(search.category ?? 'all');
  const [sort, setSort] = useState('popular');
  const [under100, setUnder100] = useState(false);
  const [under250, setUnder250] = useState(false);
  const [inStock, setInStock] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [prodData, catData] = await Promise.all([getProductsFn(), getCategoriesFn()]);
        setProducts(prodData.map((p: any) => ({ ...p, id: p._id || p.id })));
        setCategories(catData.map((c: any) => ({ ...c, id: c._id || c.id })));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const list = useMemo(() => {
    let x = products.filter(p => {
      const matchCat = cat === 'all' || p.category === cat || p.category?.toLowerCase() === cat.toLowerCase();
      const matchQ = !search.q || p.name.toLowerCase().includes(search.q.toLowerCase());
      const match100 = !under100 || p.price < 100;
      const match250 = !under250 || (p.price >= 100 && p.price <= 250);
      const matchStock = !inStock || p.isAvailable !== false;
      
      // If both price filters are checked, OR them together, else AND them with rest
      let matchPrice = true;
      if (under100 && under250) {
        matchPrice = p.price <= 250;
      } else if (under100) {
        matchPrice = p.price < 100;
      } else if (under250) {
        matchPrice = p.price >= 100 && p.price <= 250;
      }

      return matchCat && matchQ && matchPrice && matchStock;
    });

    return [...x].sort((a, b) => 
      sort === 'low' ? a.price - b.price : 
      sort === 'high' ? b.price - a.price : 
      (b.rating || 0) - (a.rating || 0)
    );
  }, [cat, sort, search.q, products, under100, under250, inStock]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-primary">{search.q ? `Results for “${search.q}”` : 'Everyday essentials'}</p>
          <h1 className="text-4xl font-black">Shop all products</h1>
          <p className="mt-2 text-muted-foreground">{list.length} useful products, ready to dispatch.</p>
        </div>
        <label className="text-sm font-semibold">Sort by 
          <select value={sort} onChange={e => setSort(e.target.value)} className="ml-2 rounded-md border border-input bg-background px-3 py-2">
            <option value="popular">Popularity</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </label>
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-[220px_1fr] min-w-0">
        <aside className="min-w-0">
          <div className="mb-3 flex items-center gap-2 font-bold"><SlidersHorizontal className="size-4"/> Categories</div>
          <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col scrollbar-hide">
            {[{slug: 'all', name: 'All products'}, ...categories].map(c => 
              <Button key={c.slug} variant={cat === c.slug ? 'default' : 'outline'} className="justify-start shrink-0" onClick={() => setCat(c.slug)}>
                {c.name}
              </Button>
            )}
          </div>
          <div className="mt-7 hidden border-t border-border pt-5 lg:block">
            <b>Price</b>
            <label className="mt-3 block text-sm"><input type="checkbox" className="mr-2" checked={under100} onChange={e => setUnder100(e.target.checked)}/>Under ₹100</label>
            <label className="mt-2 block text-sm"><input type="checkbox" className="mr-2" checked={under250} onChange={e => setUnder250(e.target.checked)}/>₹100–₹250</label>
            <b className="mt-6 block">Availability</b>
            <label className="mt-3 block text-sm"><input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)} className="mr-2"/>Available only</label>
          </div>
        </aside>
        
        <section>
          {isLoading ? (
            <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary size-10" /></div>
          ) : list.length ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
              {list.map(p => <ProductCard key={p.id} product={p}/>)}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-12 text-center">
              <h2 className="text-xl font-bold">No matching products</h2>
              <p className="mt-2 text-muted-foreground">Try a broader search or another category.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
