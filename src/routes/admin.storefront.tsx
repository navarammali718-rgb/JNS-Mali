import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { Loader2, Save, ImagePlus, X, Search, MapPin, Maximize2, Minimize2, ArrowLeft, Plus, Trash2, Tag, ExternalLink } from "lucide-react";

const MapPicker = lazy(() => import('@/components/MapPicker'));
import { getStorefrontFn, updateStorefrontFn, getCloudinarySignatureFn, getAdminProductsFn } from "@/server-functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/storefront")({
  component: AdminStorefront,
});

interface StoreBanner {
  imageUrl: string;
  title: string;
  subtitle?: string;
  priceTag?: string;
  mrpTag?: string;
  productId?: string;
  linkUrl?: string;
}

function AdminStorefront() {
  const router = useRouter();
  const [form, setForm] = useState({
    announcement: "",
    heroImage: "",
    banners: [] as StoreBanner[],
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
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [bannerUploadingIdx, setBannerUploadingIdx] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const bannerFileRef = useRef<HTMLInputElement>(null);
  const [targetBannerIdx, setTargetBannerIdx] = useState<number | null>(null);

  const [mounted, setMounted] = useState(false);
  const [isChangingLocation, setIsChangingLocation] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // India & Bangalore biased suggestions
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    const delay = setTimeout(async () => {
      try {
        const storeLat = form.adminLocationLat || 13.0285;
        const storeLng = form.adminLocationLng || 77.5462;
        const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&lat=${storeLat}&lon=${storeLng}&limit=6`);
        if (res.ok) {
          const data = await res.json();
          const inFeatures = (data.features || []).filter((f: any) => {
            const country = (f.properties?.country || "").toLowerCase();
            const code = (f.properties?.countrycode || "").toUpperCase();
            return code === "IN" || country.includes("india") || (!country && !code);
          });
          if (inFeatures.length > 0) {
            setSuggestions(inFeatures);
            return;
          }
        }

        // Fallback to Nominatim restricted to India
        const nomRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=in&viewbox=77.3,13.2,77.8,12.8&limit=5&addressdetails=1`,
          { headers: { "Accept-Language": "en" } }
        );
        if (nomRes.ok) {
          const nomData = await nomRes.json();
          setSuggestions(nomData.map((item: any) => ({
            geometry: { coordinates: [parseFloat(item.lon), parseFloat(item.lat)] },
            properties: {
              name: item.name || item.display_name?.split(",")[0],
              street: item.address?.road || item.address?.suburb,
              city: item.address?.city || item.address?.town || "Bengaluru",
              state: item.address?.state || "Karnataka",
              country: "India",
              postcode: item.address?.postcode || "",
            }
          })));
        }
      } catch (e) {
      }
    }, 350);
    return () => clearTimeout(delay);
  }, [searchQuery, form.adminLocationLat, form.adminLocationLng]);

  const handleSearchMap = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setError("");
    try {
      const storeLat = form.adminLocationLat || 13.0285;
      const storeLng = form.adminLocationLng || 77.5462;
      const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&lat=${storeLat}&lon=${storeLng}&limit=5`);
      if (res.ok) {
        const data = await res.json();
        const inFeatures = (data.features || []).filter((f: any) => {
          const country = (f.properties?.country || "").toLowerCase();
          const code = (f.properties?.countrycode || "").toUpperCase();
          return code === "IN" || country.includes("india") || (!country && !code);
        });

        if (inFeatures.length > 0) {
          const s = inFeatures[0];
          const lat = parseFloat(s.geometry.coordinates[1]);
          const lng = parseFloat(s.geometry.coordinates[0]);
          const p = s.properties;
          const label = [p.name, p.street, p.city, p.state, p.country].filter(Boolean).join(", ");
          setForm(f => ({ ...f, adminLocationLat: lat, adminLocationLng: lng, adminLocationAddress: label }));
          setSearchQuery(label);
          return;
        }
      }

      const nomRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=in&viewbox=77.3,13.2,77.8,12.8&limit=1`,
        { headers: { "Accept-Language": "en" } }
      );
      if (nomRes.ok) {
        const nomData = await nomRes.json();
        if (nomData && nomData.length > 0) {
          const s = nomData[0];
          setForm(f => ({ ...f, adminLocationLat: parseFloat(s.lat), adminLocationLng: parseFloat(s.lon), adminLocationAddress: s.display_name }));
          setSearchQuery(s.display_name);
          return;
        }
      }

      setError("Location not found in India. Please tap on map directly.");
    } catch {
      setError("Failed to search location.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleAutoDetect = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm(f => ({
          ...f,
          adminLocationLat: pos.coords.latitude,
          adminLocationLng: pos.coords.longitude,
        }));
        setIsDetecting(false);
      },
      (err) => {
        console.error(err);
        setIsDetecting(false);
        alert("Failed to get current location. Please check location permissions.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    async function load() {
      try {
        const [data, prods] = await Promise.all([getStorefrontFn(), getAdminProductsFn()]);
        if (data) {
          // If banners array exists, use it. If not, seed with heroImage if available
          let initialBanners: StoreBanner[] = data.banners && data.banners.length > 0
            ? data.banners
            : data.heroImage ? [{ imageUrl: data.heroImage, title: "Special Deal", priceTag: "", mrpTag: "", productId: "", linkUrl: "" }] : [];

          setForm({
            announcement: data.announcement ?? "",
            heroImage: data.heroImage ?? "",
            banners: initialBanners,
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
        setProducts(prods.map((p: any) => ({ ...p, id: p._id || p.id })));
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  async function handleBannerUpload(file: File, index: number) {
    setBannerUploadingIdx(index);
    try {
      const { timestamp, signature, cloudName, apiKey } = await getCloudinarySignatureFn();
      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", apiKey);
      fd.append("timestamp", String(timestamp));
      fd.append("signature", signature);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: fd });
      const data = await res.json();
      if (data.secure_url) {
        setForm(f => {
          const updated = [...f.banners];
          if (!updated[index]) {
            updated[index] = { imageUrl: data.secure_url, title: "" };
          } else {
            updated[index].imageUrl = data.secure_url;
          }
          return {
            ...f,
            banners: updated,
            heroImage: index === 0 ? data.secure_url : f.heroImage || data.secure_url,
          };
        });
      } else {
        setError("Banner upload failed.");
      }
    } catch {
      setError("Banner upload failed.");
    } finally {
      setBannerUploadingIdx(null);
    }
  }

  function addBanner() {
    setForm(f => ({
      ...f,
      banners: [
        ...f.banners,
        { imageUrl: "", title: "", subtitle: "", priceTag: "", mrpTag: "", productId: "", linkUrl: "" }
      ]
    }));
  }

  function removeBanner(idx: number) {
    setForm(f => {
      const updated = f.banners.filter((_, i) => i !== idx);
      return {
        ...f,
        banners: updated,
        heroImage: updated[0]?.imageUrl || "",
      };
    });
  }

  function updateBannerField(idx: number, field: keyof StoreBanner, val: string) {
    setForm(f => {
      const updated = [...f.banners];
      if (updated[idx]) {
        updated[idx] = { ...updated[idx], [field]: val };

        if (field === "productId" && val) {
          const matchedProd = products.find(p => p.id === val);
          if (matchedProd) {
            if (!updated[idx].title) updated[idx].title = matchedProd.name;
            if (!updated[idx].priceTag) updated[idx].priceTag = `₹${matchedProd.price}`;
            if (!updated[idx].mrpTag && matchedProd.mrp) updated[idx].mrpTag = `₹${matchedProd.mrp}`;
            if (!updated[idx].imageUrl && (matchedProd.imageUrl || matchedProd.image)) {
              updated[idx].imageUrl = matchedProd.imageUrl || matchedProd.image;
            }
          }
        }
      }
      return {
        ...f,
        banners: updated,
        heroImage: idx === 0 && field === "imageUrl" ? val : f.heroImage,
      };
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
      const validBanners = form.banners.filter(b => b.imageUrl && b.imageUrl.trim().length > 0);
      const payload = {
        ...form,
        banners: validBanners,
        heroImage: validBanners[0]?.imageUrl || form.heroImage,
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
      heroImage: "",
      banners: [],
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

        {/* Store Banners & Carousel (Requirement 3 & 5) */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-black text-xl text-slate-900">Front Store Banners & Offers</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Add multiple promotional banners. They scroll horizontally on the website and take customers to the selected product when tapped.
              </p>
            </div>
            <Button onClick={addBanner} size="sm" className="gap-1.5 font-bold shadow-sm">
              <Plus className="size-4" /> Add New Banner
            </Button>
          </div>

          {/* Image Dimensions Guideline banner (Requirement 8) */}
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 text-xs text-blue-900 flex items-start gap-3">
            <span className="text-xl">📐</span>
            <div>
              <p className="font-bold text-sm">Recommended Banner Image Guidelines:</p>
              <ul className="mt-1 list-disc list-inside space-y-0.5 text-blue-800">
                <li>Ideal dimensions: <b>1200 x 500 px</b> (or roughly 16:7 / 2:1 aspect ratio).</li>
                <li>PNG, JPG, or WebP format (max 5MB).</li>
                <li>Keep important graphics and text towards the center so mobile screens display them cleanly without edge cutoff.</li>
              </ul>
            </div>
          </div>

          {/* Banners List */}
          {form.banners.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-slate-300 p-8 text-center bg-slate-50">
              <ImagePlus className="mx-auto size-10 text-slate-400" />
              <p className="mt-2 text-sm font-semibold text-slate-600">No custom banners added yet.</p>
              <p className="text-xs text-slate-400 mt-1">The website will use the default hero banner until you add one.</p>
              <Button onClick={addBanner} size="sm" variant="outline" className="mt-4 gap-1.5">
                <Plus className="size-3.5" /> Add First Banner
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {form.banners.map((b, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                    <span className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                      <span className="grid size-6 place-items-center rounded-full bg-primary text-white text-xs font-black">
                        {idx + 1}
                      </span>
                      Banner #{idx + 1} {idx === 0 && <span className="text-xs text-primary font-bold">(Main Banner)</span>}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBanner(idx)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 text-xs font-bold gap-1"
                    >
                      <Trash2 className="size-3.5" /> Remove
                    </Button>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                    {/* Image Preview & Upload */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Banner Image *</label>
                      <div className="relative aspect-[16/8] rounded-lg border border-slate-300 bg-white overflow-hidden flex items-center justify-center">
                        {b.imageUrl ? (
                          <img src={b.imageUrl} alt={b.title || "Banner"} className="size-full object-cover" />
                        ) : (
                          <div className="p-4 text-center">
                            <ImagePlus className="mx-auto size-8 text-slate-400" />
                            <p className="text-xs text-slate-500 font-medium mt-1">No image uploaded</p>
                          </div>
                        )}
                        {bannerUploadingIdx === idx && (
                          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                            <Loader2 className="size-6 animate-spin text-primary" />
                          </div>
                        )}
                      </div>

                      <div className="mt-2 flex gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          id={`banner-file-${idx}`}
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleBannerUpload(file, idx);
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full text-xs font-bold"
                          onClick={() => document.getElementById(`banner-file-${idx}`)?.click()}
                          disabled={bannerUploadingIdx === idx}
                        >
                          <ImagePlus className="size-3.5 mr-1" />
                          {b.imageUrl ? "Change Image" : "Upload Image"}
                        </Button>
                      </div>

                      <div className="mt-2">
                        <Input
                          value={b.imageUrl}
                          onChange={(e) => updateBannerField(idx, "imageUrl", e.target.value)}
                          placeholder="Or paste image URL"
                          className="bg-white text-xs h-8"
                        />
                      </div>
                    </div>

                    {/* Banner Configuration & Links */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Banner Title / Caption</label>
                        <Input
                          value={b.title}
                          onChange={(e) => updateBannerField(idx, "title", e.target.value)}
                          placeholder="e.g. Heavy Duty Steel Scrubbers — Super Value Pack"
                          className="bg-white font-medium"
                        />
                      </div>

                      {/* Linked Product Dropdown (Requirement 3) */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                          <ExternalLink className="size-3.5 text-primary" />
                          Link to Specific Product (Customer clicks banner to open)
                        </label>
                        <select
                          value={b.productId || ""}
                          onChange={(e) => updateBannerField(idx, "productId", e.target.value)}
                          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="">-- No specific product (Default Shop link) --</option>
                          {products.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.name} (₹{p.price} {p.mrp ? `| MRP: ₹${p.mrp}` : ""})
                            </option>
                          ))}
                        </select>
                        <p className="mt-1 text-[11px] text-slate-500">
                          When clicked on the home screen, customers will be taken directly to this product's page.
                        </p>
                      </div>

                      {/* Price Tag Box Settings (Requirement 5) */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                          <Tag className="size-3 text-emerald-600" />
                          Offer Price Tag (e.g. ₹45 only)
                        </label>
                        <Input
                          value={b.priceTag || ""}
                          onChange={(e) => updateBannerField(idx, "priceTag", e.target.value)}
                          placeholder="e.g. ₹45 or Starting ₹39"
                          className="bg-white font-bold text-emerald-700"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Original MRP Tag (Crossed out)
                        </label>
                        <Input
                          value={b.mrpTag || ""}
                          onChange={(e) => updateBannerField(idx, "mrpTag", e.target.value)}
                          placeholder="e.g. ₹60"
                          className="bg-white text-slate-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Announcement Bar */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 lg:col-span-2 space-y-4">
          <h2 className="font-bold text-xl text-slate-900 border-b border-slate-100 pb-3">Announcement Banner</h2>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Top Bar Announcement Text</label>
            <Input
              value={form.announcement}
              onChange={(e) => setForm((f) => ({ ...f, announcement: e.target.value }))}
              placeholder="Free delivery on orders over ₹499"
              className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 shadow-sm"
            />
            {form.announcement && (
              <div className="mt-3 rounded-lg bg-primary px-3 py-2 text-center text-xs font-bold text-primary-foreground">
                {form.announcement}
              </div>
            )}
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
