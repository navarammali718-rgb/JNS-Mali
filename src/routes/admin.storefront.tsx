import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { Loader2, Save, ImagePlus, X, Search, MapPin, Maximize2, Minimize2 } from "lucide-react";

const MapPicker = lazy(() => import('@/components/MapPicker'));
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
    adminEmails: "",
    adminLocationLat: 13.0285,
    adminLocationLng: 77.5462,
    adminLocationAddress: "Yeshwanthpur, Bengaluru, Karnataka, India",
    deliveryRadiusKm: 10,
    deliveryFee: 40,
    deliveryFeePerKm: 0,
    freeDeliveryThreshold: 499,
    contactEmail: "contact@jnsmali.com",
    contactPhone: "+91 98765 43210",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const [mounted, setMounted] = useState(false);
  const [isChangingLocation, setIsChangingLocation] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    const delay = setTimeout(async () => {
      try {
        const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&limit=5`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.features || []);
        }
      } catch (e) {
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  const handleSearchMap = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setError("");
    try {
      const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&limit=1`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.features && data.features.length > 0) {
          const s = data.features[0];
          const lat = parseFloat(s.geometry.coordinates[1]);
          const lng = parseFloat(s.geometry.coordinates[0]);
          const p = s.properties;
          const label = [p.name, p.street, p.city, p.state, p.country].filter(Boolean).join(", ");
          setForm(f => ({ ...f, adminLocationLat: lat, adminLocationLng: lng, adminLocationAddress: label }));
          setSearchQuery(label);
        } else {
          setError("Location not found.");
        }
      }
    } catch {
      setError("Failed to search location.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleAutoDetect = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          if (!res.ok) throw new Error();
          const data = await res.json();
          setForm(f => ({ ...f, adminLocationLat: lat, adminLocationLng: lng, adminLocationAddress: data.display_name || f.adminLocationAddress }));
          if (data.display_name) setSearchQuery(data.display_name);
        } catch {
          setForm(f => ({ ...f, adminLocationLat: pos.coords.latitude, adminLocationLng: pos.coords.longitude }));
        } finally {
          setIsDetecting(false);
        }
      },
      () => {
        setError("Location permission denied.");
        setIsDetecting(false);
      },
      { enableHighAccuracy: true }
    );
  };

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
            adminEmails: data.adminEmails ? data.adminEmails.join(", ") : "",
            adminLocationLat: data.adminLocationLat ?? 13.0285,
            adminLocationLng: data.adminLocationLng ?? 77.5462,
            adminLocationAddress: data.adminLocationAddress ?? "Yeshwanthpur, Bengaluru, Karnataka, India",
            deliveryRadiusKm: data.deliveryRadiusKm ?? 10,
            deliveryFee: data.deliveryFee ?? 40,
            deliveryFeePerKm: data.deliveryFeePerKm ?? 0,
            freeDeliveryThreshold: data.freeDeliveryThreshold ?? 499,
            contactEmail: data.contactEmail ?? "contact@jnsmali.com",
            contactPhone: data.contactPhone ?? "+91 98765 43210",
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
      const payload = {
        ...form,
        adminEmails: form.adminEmails.split(",").map(s => s.trim()).filter(Boolean),
      };
      await updateStorefrontFn({ data: payload });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e: any) {
      setError(e?.message ?? "Save failed.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  }

  async function handleReset() {
    setForm(f => ({
      ...f,
      announcement: "Free delivery on orders over ₹499",
      heroSubtitle: "Retail prices. Wholesale savings.",
      heroTitle: "Everyday essentials that work hard at home.",
      heroText: "From tough kitchen scrubbers to soft bath loofahs—stock your home or shop with dependable products at sensible prices.",
      heroImage: "",
      contactEmail: "contact@jnsmali.com",
      contactPhone: "+91 98765 43210",
    }));
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Settings</h1>
          <p className="mt-1 font-medium text-slate-500">Manage your store configurations and appearance</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving} className="gap-2 w-full sm:w-auto">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>

      {error && <div className="rounded-xl bg-red-500/20 px-4 py-3 text-sm text-red-400">{error}</div>}
      {saved && <div className="rounded-xl bg-emerald-500/20 px-4 py-3 text-sm text-emerald-400">✓ Changes saved successfully!</div>}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Admin Access & Contact Info */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 lg:col-span-2">
          <h2 className="font-bold text-xl text-slate-900 border-b border-slate-100 pb-4 mb-4">Admin Access & Public Contact Info</h2>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Authorized Emails (Comma separated)</label>
              <textarea
                value={form.adminEmails}
                onChange={(e) => setForm((f) => ({ ...f, adminEmails: e.target.value }))}
                placeholder="admin1@gmail.com, admin2@gmail.com"
                rows={4}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">Contact Email (For Bills/Footer)</label>
                <Input
                  value={form.contactEmail}
                  onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))}
                  placeholder="contact@jnsmali.com"
                  className="bg-white border-slate-200 text-slate-900 shadow-sm"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">Contact Phone (For Bills/Footer)</label>
                <Input
                  value={form.contactPhone}
                  onChange={(e) => setForm((f) => ({ ...f, contactPhone: e.target.value }))}
                  placeholder="+91 98765 43210"
                  className="bg-white border-slate-200 text-slate-900 shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Settings */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900">Delivery Range Settings</h2>
            <Button variant="outline" size="sm" onClick={() => setIsChangingLocation(!isChangingLocation)}>
              {isChangingLocation ? "Cancel" : "Change Base Location"}
            </Button>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">Delivery Radius (km)</label>
              <Input
                type="number"
                value={form.deliveryRadiusKm}
                onChange={(e) => setForm((f) => ({ ...f, deliveryRadiusKm: parseFloat(e.target.value) || 0 }))}
                className="bg-white border-slate-200 text-slate-900 shadow-sm"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">Base Delivery Fee (₹)</label>
              <Input
                type="number"
                value={form.deliveryFee}
                onChange={(e) => setForm((f) => ({ ...f, deliveryFee: parseFloat(e.target.value) || 0 }))}
                className="bg-white border-slate-200 text-slate-900 shadow-sm"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">Extra Fee per km (₹)</label>
              <Input
                type="number"
                value={form.deliveryFeePerKm}
                onChange={(e) => setForm((f) => ({ ...f, deliveryFeePerKm: parseFloat(e.target.value) || 0 }))}
                className="bg-white border-slate-200 text-slate-900 shadow-sm"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">Free Delivery Above (₹)</label>
              <Input
                type="number"
                value={form.freeDeliveryThreshold}
                onChange={(e) => setForm((f) => ({ ...f, freeDeliveryThreshold: parseFloat(e.target.value) || 0 }))}
                className="bg-white border-slate-200 text-slate-900 shadow-sm"
              />
            </div>
          </div>

          {isChangingLocation && (
            <div className="mt-6 pt-6 border-t border-slate-100">
              <label className="block text-sm font-semibold mb-1 text-slate-700">
                Search Base Location
              </label>
              <div className="flex gap-2 relative mb-4">
                <Input
                  className="bg-white border-slate-200 text-slate-900 shadow-sm flex-1"
                  placeholder="e.g. Yeshwanthpur, Bangalore"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      setShowSuggestions(false);
                      handleSearchMap();
                    }
                  }}
                />
                <Button type="button" variant="secondary" onClick={() => { setShowSuggestions(false); handleSearchMap(); }} disabled={isSearching}>
                  {isSearching ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
                </Button>
                
                {/* Autocomplete Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-12 left-0 right-[4.5rem] z-[100] bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((s, i) => {
                      const p = s.properties;
                      const label = [p.name, p.street, p.city, p.state, p.country].filter(Boolean).join(", ");
                      return (
                        <button
                          key={i}
                          type="button"
                          className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 focus:bg-slate-50 truncate block text-slate-700"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            const lng = s.geometry.coordinates[0];
                            const lat = s.geometry.coordinates[1];
                            setSearchQuery(label);
                            setShowSuggestions(false);
                            setForm(f => ({ ...f, adminLocationLat: lat, adminLocationLng: lng, adminLocationAddress: label }));
                          }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-slate-700">Pin your base location</label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsMapFullscreen(prev => !prev)}>
                    {isMapFullscreen ? <Minimize2 className="size-3.5 mr-1" /> : <Maximize2 className="size-3.5 mr-1" />}
                    {isMapFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleAutoDetect} disabled={isDetecting}>
                    {isDetecting ? <Loader2 className="mr-2 size-3.5 animate-spin" /> : <MapPin className="mr-2 size-3.5" />}
                    {isDetecting ? "Detecting..." : "Auto Detect"}
                  </Button>
                </div>
              </div>
              
              <div className={`${isMapFullscreen ? "fixed inset-4 z-50 shadow-2xl rounded-xl h-[calc(100vh-2rem)]" : "h-[400px]"} w-full rounded-lg border border-slate-200 overflow-hidden relative bg-slate-50 transition-all duration-300`}>
                {mounted && (
                  <Suspense fallback={<div className="h-full w-full flex items-center justify-center text-sm font-medium text-slate-500">Loading map...</div>}>
                    <MapPicker 
                      position={form.adminLocationLat && form.adminLocationLng ? [form.adminLocationLat, form.adminLocationLng] : null} 
                      setPosition={(p) => setForm(f => ({ ...f, adminLocationLat: p[0], adminLocationLng: p[1] }))} 
                    />
                  </Suspense>
                )}
                {isMapFullscreen && (
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="absolute top-4 right-4 z-[400] shadow-md"
                    onClick={() => setIsMapFullscreen(false)}
                  >
                    <Minimize2 className="mr-2 size-4" /> Close Fullscreen
                  </Button>
                )}
              </div>
            </div>
          )}
          
          {!isChangingLocation && (
            <div className="mt-4 text-xs font-medium text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col gap-1">
              <div className="text-slate-800 text-sm">
                <span className="font-bold">Current Base Location: </span> 
                {form.adminLocationAddress}
              </div>
              <div>
                <span className="opacity-70">Coordinates: {form.adminLocationLat.toFixed(4)}, {form.adminLocationLng.toFixed(4)}</span>
              </div>
              <div className="mt-1">
                Customers outside {form.deliveryRadiusKm}km of this location will not be able to place an order.
              </div>
            </div>
          )}
        </div>

        {/* Storefront Appearance */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 lg:col-span-2 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <h2 className="font-bold text-xl text-slate-900">Storefront Appearance</h2>
            <Button variant="outline" size="sm" onClick={handleReset} disabled={saving}>
              Reset to Default
            </Button>
          </div>
          
          {/* Announcement bar */}
          <div>
            <h3 className="mb-4 font-bold text-slate-900">Announcement Bar</h3>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Announcement text</label>
            <Input
              value={form.announcement}
              onChange={(e) => setForm((f) => ({ ...f, announcement: e.target.value }))}
              placeholder="Free delivery on orders over ₹499"
              className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 shadow-sm"
            />
            {form.announcement && (
              <div className="mt-4 rounded-lg bg-primary px-3 py-2 text-center text-xs font-semibold text-primary-foreground">
                {form.announcement}
              </div>
            )}
          </div>

          <div className="grid gap-8 lg:grid-cols-2 border-t border-slate-100 pt-8">
            {/* Hero image */}
            <div>
              <h3 className="mb-4 font-bold text-slate-900">Hero Image</h3>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} />
              <div
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 hover:border-primary hover:bg-primary/5 transition"
                onClick={() => fileRef.current?.click()}
              >
                {uploading ? <Loader2 className="size-8 animate-spin text-primary" /> :
                  form.heroImage ? <img src={form.heroImage} alt="" className="h-32 w-full rounded-lg object-cover shadow-sm" /> :
                    <><ImagePlus className="size-8 text-slate-400" /><p className="mt-2 text-sm font-medium text-slate-500">Upload hero image</p></>}
              </div>
              <div className="mt-4 flex gap-2">
                <Input
                  value={form.heroImage}
                  onChange={(e) => setForm((f) => ({ ...f, heroImage: e.target.value }))}
                  placeholder="Or paste image URL"
                  className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 shadow-sm"
                />
                {form.heroImage && (
                  <Button variant="ghost" size="icon" className="shrink-0 text-slate-400 hover:text-slate-900 hover:bg-slate-100" onClick={() => setForm((f) => ({ ...f, heroImage: "" }))}>
                    <X className="size-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Hero content */}
            <div>
              <h3 className="mb-4 font-bold text-slate-900">Hero Content</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-700">Subtitle (tagline)</label>
                  <Input
                    value={form.heroSubtitle}
                    onChange={(e) => setForm((f) => ({ ...f, heroSubtitle: e.target.value }))}
                    placeholder="Retail prices. Wholesale savings."
                    className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 shadow-sm"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-700">Main headline</label>
                  <Input
                    value={form.heroTitle}
                    onChange={(e) => setForm((f) => ({ ...f, heroTitle: e.target.value }))}
                    placeholder="Everyday essentials that work hard at home."
                    className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 shadow-sm"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-700">Body text</label>
                  <textarea
                    value={form.heroText}
                    onChange={(e) => setForm((f) => ({ ...f, heroText: e.target.value }))}
                    placeholder="From tough kitchen scrubbers to soft bath loofahs..."
                    rows={3}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Preview */}
              {(form.heroTitle || form.heroSubtitle) && (
                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                  <p className="text-xs font-bold uppercase text-primary">{form.heroSubtitle}</p>
                  <h4 className="mt-2 text-xl font-black text-slate-900">{form.heroTitle}</h4>
                  <p className="mt-2 text-sm font-medium text-slate-600">{form.heroText}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button onClick={handleSave} disabled={saving} size="lg" className="gap-2 w-full sm:w-auto">
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {saving ? "Saving…" : "Save all changes"}
        </Button>
      </div>
    </div>
  );
}
