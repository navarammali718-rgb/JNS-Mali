import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, X, ImagePlus, Tag } from "lucide-react";
import {
  getCategoriesFn,
  createCategoryFn,
  updateCategoryFn,
  deleteCategoryFn,
  getCloudinarySignatureFn,
} from "@/server-functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
});

const EMPTY = { name: "", slug: "", blurb: "", image: "" };

function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function loadAll() {
    try {
      const cats = await getCategoriesFn();
      setCategories(cats.map((c: any) => ({ ...c, id: c._id || c.id })));
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

  function openEdit(c: any) {
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

  async function handleDelete(id: string) {
    if (!confirm("Delete this category?")) return;
    setDeleting(id);
    try {
      await deleteCategoryFn({ data: id });
      await loadAll();
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Categories</h1>
          <p className="mt-1 font-medium text-slate-500">{categories.length} categories</p>
        </div>
        <Button onClick={openAdd} className="gap-2">
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
          {categories.map((c) => (
            <div key={c.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition">
              {c.image ? (
                <img src={c.image} alt={c.name} className="aspect-[16/7] w-full object-cover" />
              ) : (
                <div className="aspect-[16/7] w-full bg-slate-50 grid place-items-center">
                  <Tag className="size-8 text-slate-400" />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-bold text-slate-900">{c.name}</h3>
                <p className="mt-1 text-xs font-medium text-slate-500">slug: {c.slug}</p>
                {c.blurb && <p className="mt-2 text-sm text-slate-600">{c.blurb}</p>}
                <div className="mt-4 flex justify-end gap-2">
                  <Button size="sm" variant="ghost" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100" onClick={() => openEdit(c)}>
                    <Pencil className="mr-1.5 size-3.5" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => handleDelete(c.id)}
                    disabled={deleting === c.id}
                  >
                    {deleting === c.id ? <Loader2 className="mr-1.5 size-3.5 animate-spin" /> : <Trash2 className="mr-1.5 size-3.5" />}
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
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
