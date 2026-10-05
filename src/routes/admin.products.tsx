import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, X, ImagePlus, Package, Search, ArrowLeft, Percent } from "lucide-react";
import {
  getAdminProductsFn,
  getCategoriesFn,
  createProductFn,
  updateProductFn,
  deleteProductFn,
  getCloudinarySignatureFn,
} from "@/server-functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/catalog";

function UnitPicker({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  const [units, setUnits] = useState<string[]>([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("jns_units");
      if (stored) setUnits(JSON.parse(stored));
      else setUnits(["Piece", "Sheet", "Bundle", "Box"]);
    } catch {
      setUnits(["Piece", "Sheet", "Bundle", "Box"]);
    }
  }, []);

  function addUnit() {
    if (value && !units.includes(value)) {
      const newUnits = [...units, value];
      setUnits(newUnits);
      localStorage.setItem("jns_units", JSON.stringify(newUnits));
    }
  }

  return (
    <div className="relative">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setShow(true)}
        onBlur={() => {
          setTimeout(() => setShow(false), 200);
          addUnit();
        }}
        placeholder="e.g. Piece, Sheet, Bundle, Box"
        className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
      />
      {show && units.length > 0 && (
        <div className="absolute z-[100] mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg">
          {units.map((u) => (
            <div
              key={u}
              className="flex cursor-pointer items-center justify-between px-3 py-2 text-sm hover:bg-slate-50"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(u);
                setShow(false);
              }}
            >
              <span className="font-medium text-slate-700 w-full block">{u}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

const EMPTY_FORM = {
  name: "",
  price: "",
  mrp: "",
  discountPercent: "",
  isAvailable: true,
  category: "",
  description: "",
  imageUrl: "",
  images: [] as string[],
  unit: "Piece",
  piecesPerUnit: "1",
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
  const [extraUploading, setExtraUploading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAvail, setFilterAvail] = useState<"all" | "available" | "hidden">("all");
  const fileRef = useRef<HTMLInputElement>(null);
  const extraFileRef = useRef<HTMLInputElement>(null);

  async function loadAll() {
    try {
      const [prods, cats] = await Promise.all([getAdminProductsFn(), getCategoriesFn()]);
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
    const pMrp = p.mrp ? String(p.mrp) : "";
    const pPrice = p.price ? String(p.price) : "";
    let pDiscount = "";
    if (p.mrp && p.price && Number(p.mrp) > Number(p.price)) {
      pDiscount = String(Math.round((1 - Number(p.price) / Number(p.mrp)) * 100));
    }

    setForm({
      name: p.name ?? "",
      price: pPrice,
      mrp: pMrp,
      discountPercent: pDiscount,
      isAvailable: p.isAvailable !== false,
      category: p.category ?? "",
      description: p.description ?? "",
      imageUrl: p.imageUrl ?? "",
      images: Array.isArray(p.images) ? p.images : [],
      unit: p.unit ?? "Piece",
      piecesPerUnit: String(p.piecesPerUnit ?? "1"),
    });
    setError("");
    setShowModal(true);
  }

  // Handle MRP change: if discount is present, update price; otherwise if price present, update discount
  function handleMrpChange(val: string) {
    setForm(f => {
      const mrpNum = parseFloat(val);
      const discNum = parseFloat(f.discountPercent);
      const priceNum = parseFloat(f.price);

      let newPrice = f.price;
      if (!isNaN(mrpNum) && !isNaN(discNum) && discNum > 0 && discNum < 100) {
        newPrice = String(Math.round(mrpNum * (1 - discNum / 100)));
      } else if (!isNaN(mrpNum) && !isNaN(priceNum) && mrpNum > priceNum) {
        // keep price, compute discount
      }
      return { ...f, mrp: val, price: newPrice };
    });
  }

  // Handle Discount % change: auto update selling price
  function handleDiscountChange(val: string) {
    setForm(f => {
      const mrpNum = parseFloat(f.mrp);
      const discNum = parseFloat(val);
      let newPrice = f.price;
      if (!isNaN(mrpNum) && !isNaN(discNum) && discNum >= 0 && discNum <= 100) {
        newPrice = String(Math.round(mrpNum * (1 - discNum / 100)));
      }
      return { ...f, discountPercent: val, price: newPrice };
    });
  }

  // Handle Selling Price change: auto update discount % if MRP is set
  function handlePriceChange(val: string) {
    setForm(f => {
      const mrpNum = parseFloat(f.mrp);
      const priceNum = parseFloat(val);
      let newDisc = f.discountPercent;
      if (!isNaN(mrpNum) && !isNaN(priceNum) && mrpNum > priceNum) {
        newDisc = String(Math.round((1 - priceNum / mrpNum) * 100));
      }
      return { ...f, price: val, discountPercent: newDisc };
    });
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

  async function handleExtraImageUpload(file: File) {
    setExtraUploading(true);
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
        setForm((f) => ({ ...f, images: [...(f.images || []), data.secure_url] }));
      } else {
        setError("Extra image upload failed.");
      }
    } catch (e) {
      setError("Extra image upload failed.");
    } finally {
      setExtraUploading(false);
    }
  }

  function handleRemoveExtraImage(index: number) {
    setForm(f => ({
      ...f,
      images: (f.images || []).filter((_, i) => i !== index)
    }));
  }

  async function handleSave() {
    if (!form.name.trim() || !form.price || !form.category.trim()) {
      setError("Name, price and category are required.");
      document.getElementById('product-modal')?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setSaving(true);
    setError("");
    try {
      const parsedPrice = parseFloat(form.price);
      const parsedMrp = form.mrp ? parseFloat(form.mrp) : undefined;
      const parsedDiscount = parsedMrp && parsedPrice < parsedMrp
        ? Math.round((1 - parsedPrice / parsedMrp) * 100)
        : undefined;

      const payload = {
        name: form.name.trim(),
        price: parsedPrice,
        mrp: parsedMrp,
        discountPercent: parsedDiscount,
        isAvailable: form.isAvailable,
        category: form.category.trim(),
        description: form.description.trim(),
        imageUrl: form.imageUrl.trim(),
        images: (form.images || []).filter(img => img && img.trim().length > 0),
        unit: form.unit.trim() || "Piece",
        piecesPerUnit: parseInt(form.piecesPerUnit) || 1,
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
      document.getElementById('product-modal')?.scrollTo({ top: 0, behavior: 'smooth' });
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

  async function handleToggleAvailability(p: any) {
    try {
      await updateProductFn({ data: { id: p.id, updates: { isAvailable: p.isAvailable === false ? true : false } } });
      await loadAll();
    } catch (e) {
      console.error(e);
    }
  }

  // Filtered product list
  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
    const matchesAvail =
      filterAvail === "all" ||
      (filterAvail === "available" && p.isAvailable !== false) ||
      (filterAvail === "hidden" && p.isAvailable === false);
    return matchesSearch && matchesAvail;
  });

  return (
    <div className="space-y-6">
      <Link
        to="/admin"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
      >
        <ArrowLeft className="size-4" /> Back to Dashboard
      </Link>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Products</h1>
          <p className="mt-1 font-medium text-slate-500">
            {filteredProducts.length}{filteredProducts.length !== products.length ? ` of ${products.length}` : ""} products
          </p>
        </div>
        <Button onClick={openAdd} className="gap-2 self-start sm:self-auto">
          <Plus className="size-4" /> Add product
        </Button>
      </div>

      {/* Search & Filter bar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, category or description…"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <div className="flex gap-1 shrink-0">
          {(["all", "available", "hidden"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setFilterAvail(v)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize transition ${
                filterAvail === v
                  ? "bg-primary text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="size-10 animate-spin text-primary" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center shadow-sm">
          <Package className="mx-auto mb-4 size-12 text-slate-400" />
          <p className="font-medium text-slate-500">
            {products.length === 0 ? "No products yet. Add your first one!" : "No products match your search."}
          </p>
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="mt-3 text-sm font-bold text-primary hover:underline">
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Mobile View */}
          <div className="md:hidden divide-y divide-slate-100">
            {filteredProducts.map((p) => (
              <div key={p.id} className="p-4 flex flex-col gap-3">
                <div className="flex gap-3 items-start">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt="" className="size-12 rounded-lg object-cover bg-slate-100 shrink-0" />
                  ) : (
                    <div className="size-12 rounded-lg bg-slate-100 shrink-0 grid place-items-center">
                      <Package className="size-6 text-slate-400" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900 truncate">{p.name}</p>
                    <p className="text-xs font-medium text-slate-500 capitalize truncate">{p.category}</p>
                    <div className="mt-1 font-black text-slate-900 text-sm">
                      {formatPrice(p.price)}
                      <span className="text-xs font-semibold text-slate-500 ml-1">
                        / {p.unit ?? "Piece"} {p.piecesPerUnit && p.piecesPerUnit > 1 ? `(${p.piecesPerUnit} pcs)` : ""}
                      </span>
                    </div>
                    {p.mrp && p.mrp > p.price && (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs text-slate-400 line-through">{formatPrice(p.mrp)}</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                          {Math.round((1 - p.price / p.mrp) * 100)}% OFF
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">Status:</span>
                    <button
                      onClick={() => handleToggleAvailability(p)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                        p.isAvailable !== false ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`inline-block size-4 transform rounded-full bg-white transition-transform ${
                          p.isAvailable !== false ? "translate-x-4" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="size-8 text-slate-500" onClick={() => openEdit(p)}>
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 text-red-500"
                      onClick={() => handleDelete(p.id)}
                      disabled={deleting === p.id}
                    >
                      {deleting === p.id ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt="" className="size-10 rounded-lg object-cover bg-slate-100 shrink-0" />
                        ) : (
                          <div className="size-10 rounded-lg bg-slate-100 shrink-0 grid place-items-center">
                            <Package className="size-5 text-slate-400" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-bold text-slate-900 max-w-[200px]">{p.name}</p>
                          {p.description && (
                            <p className="truncate text-xs font-medium text-slate-500 max-w-[200px]">{p.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-600 capitalize">{p.category}</td>
                    <td className="px-4 py-3">
                      <div className="font-black text-slate-900">
                        {formatPrice(p.price)}
                        <span className="text-xs font-semibold text-slate-500 ml-1">
                          / {p.unit ?? "Piece"} {p.piecesPerUnit && p.piecesPerUnit > 1 ? `(${p.piecesPerUnit} pcs)` : ""}
                        </span>
                      </div>
                      {p.mrp && p.mrp > p.price && (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs text-slate-400 line-through">{formatPrice(p.mrp)}</span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1 py-0.5 rounded">
                            {Math.round((1 - p.price / p.mrp) * 100)}% OFF
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleAvailability(p)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                          p.isAvailable !== false ? "bg-emerald-500" : "bg-slate-300"
                        }`}
                        title={p.isAvailable !== false ? "Available" : "Hidden"}
                      >
                        <span
                          className={`inline-block size-4 transform rounded-full bg-white transition-transform ${
                            p.isAvailable !== false ? "translate-x-4" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="icon" variant="ghost" className="size-8 text-slate-500 hover:bg-slate-100 hover:text-slate-900" onClick={() => openEdit(p)}>
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 text-red-500 hover:bg-red-50 hover:text-red-600"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6 backdrop-blur-sm">
          <div id="product-modal" className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-y-auto max-h-full">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-xl font-black text-slate-900">{editId ? "Edit Product" : "Add Product"}</h2>
              <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900" onClick={() => setShowModal(false)}>
                <X className="size-5" />
              </Button>
            </div>

            <div className="space-y-4 p-6">
              {error && (
                <div className="rounded-lg bg-red-500/20 px-4 py-3 text-sm text-red-400">{error}</div>
              )}

              {/* Photo Dimensions Guidance Banner */}
              <div className="rounded-xl bg-amber-50 border border-amber-200/80 p-3 text-xs text-amber-900 flex items-start gap-2.5 shadow-sm">
                <span className="text-base leading-none shrink-0">📐</span>
                <div>
                  <p className="font-bold text-amber-950">Recommended Product Image Specs</p>
                  <p className="text-amber-800 mt-0.5 leading-relaxed">
                    Upload <strong>Square (1:1 ratio, 800×800 px)</strong> images on a clean background. This fits mobile screens properly and prevents photos from shrinking or distorting.
                  </p>
                </div>
              </div>

              {/* Main Image upload */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Primary Product Image</label>
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
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 transition hover:border-primary hover:bg-primary/5"
                  onClick={() => fileRef.current?.click()}
                >
                  {uploading ? (
                    <Loader2 className="size-8 animate-spin text-primary" />
                  ) : form.imageUrl ? (
                    <img src={form.imageUrl} alt="" className="size-24 rounded-lg object-contain shadow-sm bg-white p-1" />
                  ) : (
                    <>
                      <ImagePlus className="size-8 text-slate-400" />
                      <p className="mt-2 text-sm font-medium text-slate-500">Click to upload main image</p>
                    </>
                  )}
                </div>
                {form.imageUrl && (
                  <div className="mt-2 flex gap-2">
                    <Input
                      value={form.imageUrl}
                      onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                      placeholder="Or paste image URL"
                      className="bg-white border-slate-200 text-slate-900 text-xs"
                    />
                    <Button variant="ghost" size="icon" className="shrink-0 text-slate-400 hover:bg-slate-100 hover:text-slate-900" onClick={() => setForm((f) => ({ ...f, imageUrl: "" }))}>
                      <X className="size-4" />
                    </Button>
                  </div>
                )}
                {!form.imageUrl && (
                  <Input
                    value={form.imageUrl}
                    onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                    placeholder="Or paste image URL directly"
                    className="mt-2 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                  />
                )}
              </div>

              {/* Extra Photos Gallery */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <label className="block text-sm font-bold text-slate-800">Additional Gallery Photos</label>
                    <p className="text-xs text-slate-500">Customers can view more photos / angles on product page</p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => extraFileRef.current?.click()}
                    disabled={extraUploading}
                    className="gap-1.5 text-xs font-bold bg-white"
                  >
                    {extraUploading ? <Loader2 className="size-3.5 animate-spin" /> : <ImagePlus className="size-3.5" />}
                    Add Photo
                  </Button>
                </div>
                <input
                  ref={extraFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleExtraImageUpload(file);
                    e.target.value = "";
                  }}
                />
                {form.images && form.images.length > 0 ? (
                  <div className="grid grid-cols-4 gap-2.5 mt-3">
                    {form.images.map((img, idx) => (
                      <div key={idx} className="group relative aspect-square rounded-lg border border-slate-200 overflow-hidden bg-white shadow-xs">
                        <img src={img} alt={`Extra ${idx + 1}`} className="w-full h-full object-contain p-1" />
                        <button
                          type="button"
                          onClick={() => handleRemoveExtraImage(idx)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 transition"
                          title="Remove photo"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs italic text-slate-400 mt-1">No additional photos uploaded yet.</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-bold text-slate-700">Product Name *</label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Power Scrub Sponge"
                    className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                {/* Pricing: MRP, Discount, Selling Price */}
                <div className="sm:col-span-2 grid grid-cols-3 gap-3 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">Original MRP (₹)</label>
                    <Input
                      type="number"
                      value={form.mrp}
                      onChange={(e) => handleMrpChange(e.target.value)}
                      placeholder="e.g. 99"
                      min="0"
                      className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">Discount (%)</label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={form.discountPercent}
                        onChange={(e) => handleDiscountChange(e.target.value)}
                        placeholder="e.g. 20"
                        min="0"
                        max="99"
                        className="bg-white border-slate-200 text-slate-900 pr-7 placeholder:text-slate-400"
                      />
                      <Percent className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-900">Selling Price (₹) *</label>
                    <Input
                      type="number"
                      value={form.price}
                      onChange={(e) => handlePriceChange(e.target.value)}
                      placeholder="e.g. 79"
                      min="0"
                      className="bg-white border-primary/50 font-bold text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-700">Availability</label>
                  <div className="flex h-10 items-center gap-3 rounded-md border border-slate-200 bg-white px-3 shadow-sm">
                    <input
                      type="checkbox"
                      checked={form.isAvailable}
                      onChange={(e) => setForm((f) => ({ ...f, isAvailable: e.target.checked }))}
                      className="size-4"
                      id="availToggle"
                    />
                    <label htmlFor="availToggle" className="text-sm font-medium text-slate-700 select-none cursor-pointer">
                      {form.isAvailable ? "Available" : "Not available"}
                    </label>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-700">Category *</label>
                  {categories.length > 0 ? (
                    <select
                      value={form.category}
                      onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                      className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm"
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
                      className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                    />
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-700">Packaging Unit</label>
                  <UnitPicker
                    value={form.unit}
                    onChange={(v) => setForm((f) => ({ ...f, unit: v }))}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-700">Pieces per Unit</label>
                  <Input
                    type="number"
                    value={form.piecesPerUnit}
                    onChange={(e) => setForm((f) => ({ ...f, piecesPerUnit: e.target.value }))}
                    placeholder="1"
                    min="1"
                    className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-bold text-slate-700">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Product description..."
                    rows={3}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
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
