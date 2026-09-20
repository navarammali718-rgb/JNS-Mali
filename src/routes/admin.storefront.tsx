import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Loader2, Save, ImagePlus, X } from "lucide-react";
import { getStorefrontFn, updateStorefrontFn, getCloudinarySignatureFn } from "@/server-functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/storefront")({
  component: AdminStorefront,
});

function AdminStorefront() {
  const [form, setForm] = useState({
    announcement: "",
    heroSubtitle: "",
    heroTitle: "",
    heroText: "",
    heroImage: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getStorefrontFn();
        if (data) {
          setForm({
            announcement: data.announcement ?? "",
            heroSubtitle: data.heroSubtitle ?? "",
            heroTitle: data.heroTitle ?? "",
            heroText: data.heroText ?? "",
            heroImage: data.heroImage ?? "",
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

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
      if (data.secure_url) setForm((f) => ({ ...f, heroImage: data.secure_url }));
      else setError("Image upload failed.");
    } catch {
      setError("Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      await updateStorefrontFn({ data: form });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e?.message ?? "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Storefront Settings</h1>
          <p className="mt-1 text-slate-400">Edit the homepage hero and announcement bar</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>

      {error && <div className="rounded-xl bg-red-500/20 px-4 py-3 text-sm text-red-400">{error}</div>}
      {saved && <div className="rounded-xl bg-emerald-500/20 px-4 py-3 text-sm text-emerald-400">✓ Changes saved successfully!</div>}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Announcement bar */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-4 font-bold text-white">Announcement Bar</h2>
          <label className="block text-sm font-semibold text-slate-300 mb-1.5">Announcement text</label>
          <Input
            value={form.announcement}
            onChange={(e) => setForm((f) => ({ ...f, announcement: e.target.value }))}
            placeholder="Free delivery on orders over ₹499"
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
          />
          {form.announcement && (
            <div className="mt-4 rounded-lg bg-primary px-3 py-2 text-center text-xs font-semibold text-primary-foreground">
              {form.announcement}
            </div>
          )}
        </div>

        {/* Hero image */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-4 font-bold text-white">Hero Image</h2>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} />
          <div
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 p-6 hover:border-primary transition"
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? <Loader2 className="size-8 animate-spin text-primary" /> :
              form.heroImage ? <img src={form.heroImage} alt="" className="h-32 w-full rounded-lg object-cover" /> :
              <><ImagePlus className="size-8 text-slate-600" /><p className="mt-2 text-sm text-slate-500">Upload hero image</p></>}
          </div>
          <div className="mt-2 flex gap-2">
            <Input
              value={form.heroImage}
              onChange={(e) => setForm((f) => ({ ...f, heroImage: e.target.value }))}
              placeholder="Or paste image URL"
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />
            {form.heroImage && (
              <Button variant="ghost" size="icon" className="shrink-0 text-slate-400" onClick={() => setForm((f) => ({ ...f, heroImage: "" }))}>
                <X className="size-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Hero content */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2">
          <h2 className="mb-4 font-bold text-white">Hero Section</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-300">Subtitle (tagline)</label>
              <Input
                value={form.heroSubtitle}
                onChange={(e) => setForm((f) => ({ ...f, heroSubtitle: e.target.value }))}
                placeholder="Retail prices. Wholesale savings."
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-300">Main headline</label>
              <Input
                value={form.heroTitle}
                onChange={(e) => setForm((f) => ({ ...f, heroTitle: e.target.value }))}
                placeholder="Everyday essentials that work hard at home."
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-slate-300">Body text</label>
              <textarea
                value={form.heroText}
                onChange={(e) => setForm((f) => ({ ...f, heroText: e.target.value }))}
                placeholder="From tough kitchen scrubbers to soft bath loofahs—stock your home or shop with dependable products at sensible prices."
                rows={3}
                className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Preview */}
          {(form.heroTitle || form.heroSubtitle) && (
            <div className="mt-6 rounded-xl border border-slate-700 bg-slate-800 p-5">
              <p className="text-xs font-bold uppercase text-primary">{form.heroSubtitle}</p>
              <h3 className="mt-2 text-xl font-black text-white">{form.heroTitle}</h3>
              <p className="mt-2 text-sm text-slate-400">{form.heroText}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg" className="gap-2">
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {saving ? "Saving…" : "Save all changes"}
        </Button>
      </div>
    </div>
  );
}
