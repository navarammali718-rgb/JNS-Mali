import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, X, ImagePlus, Tag, ArrowLeft, Package, ExternalLink, Eye } from "lucide-react";
import {
  getCategoriesFn,
  createCategoryFn,
  updateCategoryFn,
  deleteCategoryFn,
  getCloudinarySignatureFn,
  getAdminProductsFn,
} from "@/server-functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/catalog";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
});

const EMPTY = { name: "", slug: "", blurb: "", image: "" };

function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function loadAll() {
    try {
      const [cats, prods] = await Promise.all([getCategoriesFn(), getAdminProductsFn()]);
      setCategories(cats.map((c: any) => ({ ...c, id: c._id || c.id })));
      setProducts(prods.map((p: any) => ({ ...p, id: p._id || p.id })));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { loadAll(); }, []);

  function slugify(name: string) {
    return name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  }

  function openAdd() {
    setEditId(null);
    setForm(EMPTY);
    setError("");
    setShowModal(true);
  }

  function openEdit(c: any, e: React.MouseEvent) {
    e.stopPropagation();
    setEditId(c.id);
    setForm({ name: c.name ?? "", slug: c.slug ?? "", blurb: c.blurb ?? "", image: c.image ?? "" });
    setError("");
    setShowModal(true);
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    try {
      const { timestamp, signature, cloudName, apiKey } = await getCloudinarySignatureFn();
      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", apiKey);
      fd.append("timestamp", String(timestamp));
      fd.append("signature", signature);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: fd });
      const data = await res.json();
      if (data.secure_url) setForm((f) => ({ ...f, image: data.secure_url }));
      else setError("Image upload failed.");
    } catch {
      setError("Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!form.name.trim()) { setError("Name is required."); document.getElementById('category-modal')?.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const slug = form.slug.trim() || slugify(form.name);
    setSaving(true);
    setError("");
    try {
      const payload = { name: form.name.trim(), slug, blurb: form.blurb.trim(), image: form.image.trim() };
      if (editId) {
        await updateCategoryFn({ data: { id: editId, updates: payload } });
      } else {
        await createCategoryFn({ data: payload });
      }
      setShowModal(false);
      await loadAll();
    } catch (e: any) {
      setError(e?.message ?? "Save failed.");
      document.getElementById('category-modal')?.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm("Delete this category?")) return;
    setDeleting(id);
    try {
      await deleteCategoryFn({ data: id });
      await loadAll();
    } finally {
      setDeleting(null);
    }
  }

  const getProductsForCategory = (cat: any) => {
    if (!cat) return [];
    return products.filter(p =>
      p.category?.toLowerCase() === cat.slug?.toLowerCase() ||
      p.category?.toLowerCase() === cat.name?.toLowerCase()
    );
  };

  const selectedCategoryProducts = selectedCategory ? getProductsForCategory(selectedCategory) : [];

  return (
    <div className="space-y-6">
      {/* Top Header with Back to Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-slate-900"
          >
            <ArrowLeft className="size-3.5" />
            <span>Dashboard</span>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Categories</h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500">
              {categories.length} categories · Click any category to view its products
            </p>
          </div>
        </div>
        <Button onClick={openAdd} className="gap-2 shadow-sm font-bold">
          <Plus className="size-4" /> Add category
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="size-10 animate-spin text-primary" />
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white shadow-sm py-20 text-center">
          <Tag className="mx-auto mb-4 size-12 text-slate-400" />
          <p className="font-medium text-slate-500">No categories yet. Add your first one!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => {
            const count = getProductsForCategory(c).length;
            return (
              <div
                key={c.id}
                onClick={() => setSelectedCategory(c)}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:border-primary/50 hover:shadow-md transition active:scale-[0.99]"
              >
                <div className="relative aspect-[16/8] w-full bg-slate-100 overflow-hidden flex items-center justify-center">
                  {c.image ? (
                    <img src={c.image} alt={c.name} className="size-full object-cover group-hover:scale-105 transition duration-300" />
                  ) : (
                    <Tag className="size-8 text-slate-400" />
                  )}
                  <span className="absolute top-2.5 right-2.5 rounded-full bg-black/60 backdrop-blur px-2.5 py-0.5 text-xs font-black text-white shadow-sm">
                    {count} {count === 1 ? "product" : "products"}
                  </span>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-primary transition">{c.name}</h3>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">slug: {c.slug}</p>
                    </div>
                    <span className="text-xs text-primary font-bold inline-flex items-center gap-1 group-hover:underline">
                      <Eye className="size-3.5" /> View
                    </span>
                  </div>

                  {c.blurb && <p className="mt-2 text-xs text-slate-600 line-clamp-2">{c.blurb}</p>}

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      Click to show products
                    </span>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 h-8 px-2 text-xs font-semibold"
                        onClick={(e) => openEdit(c, e)}
                      >
                        <Pencil className="mr-1 size-3" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:bg-red-50 hover:text-red-600 h-8 px-2 text-xs font-semibold"
                        onClick={(e) => handleDelete(c.id, e)}
                        disabled={deleting === c.id}
                      >
                        {deleting === c.id ? <Loader2 className="size-3 animate-spin" /> : <Trash2 className="size-3" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Products In Category Modal / Viewer (Requirement 4) */}
      {selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg overflow-hidden bg-slate-200 border border-slate-300">
                  {selectedCategory.image && <img src={selectedCategory.image} alt="" className="size-full object-cover" />}
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">{selectedCategory.name}</h2>
                  <p className="text-xs font-medium text-slate-500">
                    {selectedCategoryProducts.length} products listed in this category
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedCategory(null)}>
                <X className="size-5 text-slate-500" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedCategoryProducts.length === 0 ? (
                <div className="py-12 text-center">
                  <Package className="mx-auto size-12 text-slate-300" />
                  <p className="mt-3 text-sm font-semibold text-slate-600">No products in this category yet.</p>
                  <p className="text-xs text-slate-400 mt-1">Go to Products section to add items under this category.</p>
                  <Button asChild size="sm" className="mt-4 gap-1.5 font-bold">
                    <Link to="/admin/products">Go to Products</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {selectedCategoryProducts.map((p) => {
                    const discount = p.mrp && p.mrp > p.price ? Math.round((1 - p.price / p.mrp) * 100) : 0;
                    return (
                      <Link
                        key={p.id}
                        to="/product/$id"
                        params={{ id: p.id }}
                        className="group flex gap-3 rounded-xl border border-slate-200 p-3 bg-white shadow-sm items-center hover:border-primary/60 hover:shadow-md transition active:scale-[0.99] cursor-pointer"
                        title={`Click to view ${p.name}`}
                      >
                        <div className="size-16 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                          <img
                            src={p.imageUrl || p.image || "/placeholder.png"}
                            alt={p.name}
                            className="size-full object-contain p-1 group-hover:scale-105 transition"
                            onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.png"; }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-1">
                            <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition truncate">{p.name}</p>
                            <ExternalLink className="size-3.5 text-slate-400 group-hover:text-primary shrink-0 transition" />
                          </div>
                          <div className="flex items-baseline gap-1.5 mt-0.5">
                            <span className="text-sm font-black text-primary">{formatPrice(p.price)}</span>
                            {p.mrp && p.mrp > p.price && (
                              <span className="text-xs text-slate-400 line-through">{formatPrice(p.mrp)}</span>
                            )}
                            {discount > 0 && (
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                {discount}% off
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-[10px] text-slate-500 font-semibold">
                              {p.unit || "Piece"}
                            </span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                              p.isAvailable !== false ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                            }`}>
                              {p.isAvailable !== false ? "Available" : "Hidden"}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 p-4 bg-slate-50 flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={() => setSelectedCategory(null)}>
                Close
              </Button>
              <Button asChild size="sm" className="gap-1.5 font-bold">
                <Link to="/admin/products">
                  <span>Manage in Products Panel</span>
                  <ExternalLink className="size-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6 backdrop-blur-sm">
          <div id="category-modal" className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-y-auto max-h-full">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-xl font-black text-slate-900">{editId ? "Edit Category" : "Add Category"}</h2>
              <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100" onClick={() => setShowModal(false)}>
                <X className="size-5" />
              </Button>
            </div>

            <div className="space-y-4 p-6">
              {error && <div className="rounded-lg bg-red-500/20 px-4 py-3 text-sm text-red-400">{error}</div>}

              {/* Image */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Category Image</label>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} />
                <div className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 hover:border-primary hover:bg-primary/5 transition" onClick={() => fileRef.current?.click()}>
                  {uploading ? <Loader2 className="size-8 animate-spin text-primary" /> :
                    form.image ? <img src={form.image} alt="" className="size-20 rounded-lg object-cover shadow-sm" /> :
                    <><ImagePlus className="size-8 text-slate-400" /><p className="mt-2 text-sm font-medium text-slate-500">Upload image</p></>}
                </div>
                <Input value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} placeholder="Or paste image URL" className="mt-2 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 shadow-sm" />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">Name *</label>
                <Input
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm((f) => ({ ...f, name, slug: f.slug || slugify(name) }));
                  }}
                  placeholder="Kitchen Cleaning"
                  className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 shadow-sm"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">Slug</label>
                <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="kitchen-cleaning" className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 shadow-sm" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">Description (blurb)</label>
                <Input value={form.blurb} onChange={(e) => setForm((f) => ({ ...f, blurb: e.target.value }))} placeholder="Scrubbers, pads & brushes" className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 shadow-sm" />
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button className="flex-1" onClick={handleSave} disabled={saving}>
                  {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
                  {editId ? "Save changes" : "Create category"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
