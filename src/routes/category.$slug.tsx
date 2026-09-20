import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import { getProductsFn, getCategoriesFn } from "@/server-functions";

export const Route = createFileRoute('/category/$slug')({
  component: CategoryPage
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [prodData, catData] = await Promise.all([getProductsFn(), getCategoriesFn()]);
        const foundCategory = catData.find((c: any) => c.slug === slug);
        if (foundCategory) {
          setCategory(foundCategory);
        } else {
          setCategory({ name: slug, blurb: "", image: "" }); // Fallback
        }
        
        const filteredProducts = prodData
          .filter((p: any) => p.category === (foundCategory?.name || slug) || p.category?.toLowerCase() === slug.toLowerCase())
          .map((p: any) => ({ ...p, id: p._id || p.id }));
          
        setProducts(filteredProducts);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [slug]);

  if (isLoading) {
    return <div className="py-32 flex justify-center"><Loader2 className="size-10 animate-spin text-primary" /></div>;
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-5 text-sm font-semibold text-muted-foreground">
        <Link to="/shop" className="hover:text-primary">Shop</Link> / <span className="text-foreground">{category?.name}</span>
      </nav>
      <div className="flex flex-wrap items-end justify-between gap-4 rounded-xl bg-accent p-6 sm:p-10">
        <div className="max-w-xl">
          <h1 className="text-4xl font-black sm:text-5xl">{category?.name}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{category?.blurb}</p>
        </div>
        <img src={category?.image || ""} alt="" className="w-32 rounded-lg object-cover mix-blend-multiply opacity-50" />
      </div>
      <section className="mt-8">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <p className="font-bold">{products.length} products found</p>
          <Button asChild variant="outline" size="sm"><Link to="/shop">View all categories <ArrowRight/></Link></Button>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map(p => <ProductCard key={p.id} product={p}/>)}
        </div>
        {products.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            No products available in this category yet.
          </div>
        )}
      </section>
    </main>
  );
}
