import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, X, ImagePlus, Package } from "lucide-react";
import {
  getProductsFn,
  getCategoriesFn,
  createProductFn,
  updateProductFn,
  deleteProductFn,
  getCloudinarySignatureFn,
} from "@/server-functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/catalog";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

const EMPTY_FORM = {
  name: "",
  price: "",
  mrp: "",
  stock: "",
  category: "",
  description: "",
  imageUrl: "",
};

function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function loadAll() {
    try {
      const [prods, cats] = await Promise.all([getProductsFn(), getCategoriesFn()]);
      setProducts(prods.map((p: any) => ({ ...p, id: p._id || p.id })));
      setCategories(cats);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { loadAll(); }, []);

  function openAdd() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowModal(true);
  }

  function openEdit(p: any) {
    setEditId(p.id);
    setForm({
      name: p.name ?? "",
      price: String(p.price ?? ""),
      mrp: String(p.mrp ?? ""),
      stock: String(p.stock ?? ""),
      category: p.category ?? "",
      description: p.description ?? "",
      imageUrl: p.imageUrl ?? "",
    });
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
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (data.secure_url) {
        setForm((f) => ({ ...f, imageUrl: data.secure_url }));
      } else {
        setError("Image upload failed.");
      }
    } catch (e) {
      setError("Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!form.name.trim() || !form.price || !form.category.trim()) {
      setError("Name, price and category are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: form.name.trim(),
        price: parseFloat(form.price),
        mrp: form.mrp ? parseFloat(form.mrp) : undefined,
        stock: form.stock ? parseInt(form.stock) : 0,
        category: form.category.trim(),
        description: form.description.trim(),
        imageUrl: form.imageUrl.trim(),
      };
      if (editId) {
        await updateProductFn({ data: { id: editId, updates: payload } });
      } else {
        await createProductFn({ data: payload });
      }
      setShowModal(false);
      await loadAll();
    } catch (e: any) {
      setError(e?.message ?? "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    setDeleting(id);
    try {
      await deleteProductFn({ data: id });
      await loadAll();
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Products</h1>
          <p className="mt-1 text-slate-400">{products.length} products in your store</p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="size-4" /> Add product
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="size-10 animate-spin text-primary" />
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 py-20 text-center">
          <Package className="mx-auto mb-4 size-12 text-slate-600" />
          <p className="text-slate-400">No products yet. Add your first one!</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left text-slate-400">
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Stock</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt="" className="size-10 rounded-lg object-cover bg-slate-800 shrink-0" />
                        ) : (
                          <div className="size-10 rounded-lg bg-slate-800 shrink-0 grid place-items-center">
                            <Package className="size-5 text-slate-500" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-white max-w-[200px]">{p.name}</p>
                          {p.description && (
                            <p className="truncate text-xs text-slate-500 max-w-[200px]">{p.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300 capitalize">{p.category}</td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-white">{formatPrice(p.price)}</span>
                      {p.mrp > p.price && (
                        <span className="ml-2 text-xs text-slate-500 line-through">{formatPrice(p.mrp)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        p.stock > 10 ? "bg-emerald-500/20 text-emerald-400" :
                        p.stock > 0 ? "bg-amber-500/20 text-amber-400" :
                        "bg-red-500/20 text-red-400"
                      }`}>
                        {p.stock > 0 ? `${p.stock} left` : "Out of stock"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="icon" variant="ghost" className="size-8 text-slate-400 hover:text-white" onClick={() => openEdit(p)}>
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 text-red-500 hover:bg-red-500/10 hover:text-red-400"
                          onClick={() => handleDelete(p.id)}
                          disabled={deleting === p.id}
                        >
                          {deleting === p.id ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-y-auto max-h-full">
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <h2 className="text-xl font-black text-white">{editId ? "Edit Product" : "Add Product"}</h2>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" onClick={() => setShowModal(false)}>
                <X className="size-5" />
              </Button>
            </div>

            <div className="space-y-4 p-6">
              {error && (
                <div className="rounded-lg bg-red-500/20 px-4 py-3 text-sm text-red-400">{error}</div>
              )}

              {/* Image upload */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">Product Image</label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                />
                <div
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 p-6 transition hover:border-primary"
                  onClick={() => fileRef.current?.click()}
                >
                  {uploading ? (
                    <Loader2 className="size-8 animate-spin text-primary" />
                  ) : form.imageUrl ? (
                    <img src={form.imageUrl} alt="" className="size-24 rounded-lg object-cover" />
                  ) : (
                    <>
                      <ImagePlus className="size-8 text-slate-600" />
                      <p className="mt-2 text-sm text-slate-500">Click to upload image</p>
                    </>
                  )}
                </div>
                {form.imageUrl && (
                  <div className="mt-2 flex gap-2">
                    <Input
                      value={form.imageUrl}
                      onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                      placeholder="Or paste image URL"
                      className="bg-slate-800 border-slate-700 text-white text-xs"
                    />
                    <Button variant="ghost" size="icon" className="shrink-0 text-slate-400" onClick={() => setForm((f) => ({ ...f, imageUrl: "" }))}>
                      <X className="size-4" />
                    </Button>
                  </div>
                )}
                {!form.imageUrl && (
                  <Input
                    value={form.imageUrl}
                    onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                    placeholder="Or paste image URL directly"
                    className="mt-2 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold text-slate-300">Product Name *</label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Power Scrub Sponge"
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-300">Price (₹) *</label>
                  <Input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    placeholder="79"
                    min="0"
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-300">MRP (₹)</label>
                  <Input
                    type="number"
                    value={form.mrp}
                    onChange={(e) => setForm((f) => ({ ...f, mrp: e.target.value }))}
                    placeholder="110"
                    min="0"
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-300">Stock quantity *</label>
                  <Input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                    placeholder="50"
                    min="0"
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-300">Category *</label>
                  {categories.length > 0 ? (
                    <select
                      value={form.category}
                      onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                      className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
                    >
                      <option value="">Select category</option>
                      {categories.map((c: any) => (
                        <option key={c._id || c.id} value={c.slug || c.name}>{c.name}</option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      value={form.category}
                      onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                      placeholder="e.g. kitchen-cleaning"
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold text-slate-300">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Product description..."
                    rows={3}
                    className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="ghost" className="flex-1 text-slate-400" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleSave} disabled={saving}>
                  {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                  {editId ? "Save changes" : "Create product"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
