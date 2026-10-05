import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SlidersHorizontal, Loader2, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import { z } from "zod";
import { ProductCard } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import { useStore } from "@/components/store/store-context";
import { getCategoriesFn } from "@/server-functions";

const schema = z.object({ q: z.string().optional(), category: z.string().optional() });
export const Route = createFileRoute('/shop')({
  validateSearch: schema,
  head: () => ({ meta: [{ title: 'Shop Household Products — JNS MALI' }, { name: 'description', content: 'Browse affordable kitchen, bath, cleaning and home utility products.' }, { property: 'og:title', content: 'Shop Household Products — JNS MALI' }, { property: 'og:description', content: 'Browse practical home essentials at retail and wholesale prices.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }] }),
  component: Shop
});

function Shop() {
  const search = Route.useSearch();
  // Use products from StoreContext (already loaded) instead of fetching again
  const { products: allProducts, isProductsLoading } = useStore();
  const [cat, setCat] = useState(search.category ?? 'all');
  const [sort, setSort] = useState('popular');
  const [under100, setUnder100] = useState(false);
  const [under250, setUnder250] = useState(false);
  const [inStock, setInStock] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    getCategoriesFn().then(data => setCategories(data.map((c: any) => ({ ...c, id: c._id || c.id })))).catch(console.error);
  }, []);

  // Map products to include id field
  const products = useMemo(() => allProducts.map((p: any) => ({ ...p, id: p._id || p.id })), [allProducts]);

  const list = useMemo(() => {
    let x = products.filter(p => {
      const matchCat = cat === 'all' || p.category === cat || p.category?.toLowerCase() === cat.toLowerCase();
      const matchQ = !search.q || p.name.toLowerCase().includes(search.q.toLowerCase());
      const matchStock = !inStock || p.isAvailable !== false;

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

  const FilterControls = () => (
    <div className="space-y-4">
      <div>
        <b className="text-sm">Price range</b>
        <label className="mt-3 flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" className="rounded" checked={under100} onChange={e => setUnder100(e.target.checked)} />
          Under ₹100
        </label>
        <label className="mt-2 flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" className="rounded" checked={under250} onChange={e => setUnder250(e.target.checked)} />
          ₹100–₹250
        </label>
      </div>
      <div>
        <b className="text-sm">Availability</b>
        <label className="mt-3 flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" className="rounded" checked={inStock} onChange={e => setInStock(e.target.checked)} />
          Available only
        </label>
      </div>
    </div>
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition mb-4"
      >
        <ArrowLeft className="size-4" /> Back to Home
      </Link>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-primary">{search.q ? `Results for "${search.q}"` : 'Everyday essentials'}</p>
          <h1 className="text-3xl font-black sm:text-4xl">Shop all products</h1>
          <p className="mt-2 text-muted-foreground">{list.length} useful products, ready to dispatch.</p>
        </div>
        <label className="text-sm font-semibold">Sort by
          <select value={sort} onChange={e => setSort(e.target.value)} className="ml-2 rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="popular">Popularity</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </label>
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-[220px_1fr] min-w-0">
        <aside className="min-w-0">
          {/* Category pills */}
          <div className="mb-3 flex items-center gap-2 font-bold text-sm">
            <SlidersHorizontal className="size-4" /> Categories
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col scrollbar-hide">
            {[{ slug: 'all', name: 'All products' }, ...categories].map(c =>
              <Button key={c.slug} variant={cat === c.slug ? 'default' : 'outline'} size="sm" className="justify-start shrink-0 text-xs" onClick={() => setCat(c.slug)}>
                {c.name}
              </Button>
            )}
          </div>

          {/* Desktop filters */}
          <div className="mt-6 hidden border-t border-border pt-5 lg:block">
            <FilterControls />
          </div>

          {/* Mobile filter toggle */}
          <div className="mt-4 lg:hidden">
            <button
              className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <span className="flex items-center gap-2"><SlidersHorizontal className="size-4" /> Filters</span>
              {filtersOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </button>
            {filtersOpen && (
              <div className="mt-2 rounded-lg border border-border bg-card p-4">
                <FilterControls />
              </div>
            )}
          </div>
        </aside>

        <section>
          {isProductsLoading ? (
            <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary size-10" /></div>
          ) : list.length ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
              {list.map(p => <ProductCard key={p.id} product={p} />)}
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
