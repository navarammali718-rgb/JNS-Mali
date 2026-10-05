import { useState, useEffect, lazy, Suspense } from "react";
import { createFileRoute, useNavigate, Link, useRouter } from "@tanstack/react-router";
import { Check, MapPin, Truck, CreditCard, Loader2, Lock, Search, Maximize2, Minimize2, ArrowLeft } from "lucide-react";
import { useUser, SignIn } from "@clerk/clerk-react";
import { formatPrice } from "@/lib/catalog";
import { useStore } from "@/components/store/store-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createOrderFn, syncUserFn, checkUserBlockedFn, upsertUserFn } from "@/server-functions";

const MapPicker = lazy(() => import('@/components/MapPicker'));

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Secure Checkout — JNS MALI" },
      { name: "description", content: "Complete your JNS MALI order." },
      { property: "og:title", content: "Secure Checkout — JNS MALI" },
      { property: "og:description", content: "Fast, simple checkout for household essentials." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { cart, products, subtotal, clearCart, storefront: contextStorefront } = useStore();
  const navigate = useNavigate();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [pay, setPay] = useState("cod");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);

  const [address, setAddress] = useState({
    fullName: user?.fullName ?? "",
    phone: user?.primaryPhoneNumber?.phoneNumber ?? "",
    address: "",
    city: "",
    postalCode: "",
    lat: null as number | null,
    lng: null as number | null,
  });

  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const storefront = contextStorefront;
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedReason, setBlockedReason] = useState("");
  
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => { 
    setMounted(true);
  }, []);

  // Upsert user to DB + check if blocked
  useEffect(() => {
    if (!isSignedIn || !user) return;
    const email = user.primaryEmailAddress?.emailAddress ?? "";
    upsertUserFn({ data: { clerkId: user.id, email, firstName: user.firstName ?? "", lastName: user.lastName ?? "" } }).catch(() => {});
    checkUserBlockedFn({ data: { clerkId: user.id } }).then(res => {
      setIsBlocked(res.isBlocked);
      setBlockedReason(res.reason ?? "");
    }).catch(() => {});
  }, [isSignedIn, user]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    const delay = setTimeout(async () => {
      try {
        const storeLat = storefront?.adminLocationLat || 13.0285;
        const storeLng = storefront?.adminLocationLng || 77.5462;
        // Bias search towards store location (Bangalore / Karnataka)
        const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&lat=${storeLat}&lon=${storeLng}&limit=8`);
        if (res.ok) {
          const data = await res.json();
          // Filter to Indian locations and prioritize Karnataka / Bangalore
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

        // Fallback directly to Nominatim restricted to India
        const nomRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=in&viewbox=77.3,13.2,77.8,12.8&limit=6&addressdetails=1`,
          { headers: { "Accept-Language": "en" } }
        );
        if (nomRes.ok) {
          const nomData = await nomRes.json();
          const mapped = nomData.map((item: any) => ({
            geometry: { coordinates: [parseFloat(item.lon), parseFloat(item.lat)] },
            properties: {
              name: item.name || item.display_name?.split(",")[0],
              street: item.address?.road || item.address?.suburb,
              city: item.address?.city || item.address?.town || item.address?.city_district || "Bengaluru",
              state: item.address?.state || "Karnataka",
              country: "India",
              postcode: item.address?.postcode || "",
            }
          }));
          setSuggestions(mapped);
        }
      } catch (e) {
        // ignore
      }
    }, 350);
    return () => clearTimeout(delay);
  }, [searchQuery, storefront]);

  function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  let calculatedDeliveryFee = storefront?.deliveryFee ?? 40;
  if (address.lat && address.lng && storefront?.adminLocationLat && storefront?.adminLocationLng) {
    const dist = getDistanceFromLatLonInKm(address.lat, address.lng, storefront.adminLocationLat, storefront.adminLocationLng);
    const perKmFee = storefront?.deliveryFeePerKm ?? 0;
    calculatedDeliveryFee += Math.round(dist * perKmFee);
  }

  const freeDeliveryThreshold = storefront?.freeDeliveryThreshold ?? 499;
  const delivery = subtotal >= freeDeliveryThreshold ? 0 : calculatedDeliveryFee;
  const total = subtotal + delivery;

  // Cart items with product details
  const cartItems = products
    .filter((p) => cart[p.id])
    .map((p) => ({
      productId: p.id,
      name: p.name,
      quantity: cart[p.id],
      price: p.price,
      image: p.imageUrl || p.image || "",
    }));

  if (!isLoaded) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-32 flex justify-center">
        <Loader2 className="size-10 animate-spin text-primary" />
      </main>
    );
  }

  // Require sign-in
  if (!isSignedIn) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-primary/10">
            <Lock className="size-6 text-primary" />
          </div>
          <h1 className="text-3xl font-black">Sign in to checkout</h1>
          <p className="mt-2 text-muted-foreground">
            You need to sign in with Google before placing an order.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <SignIn routing="virtual" />
        </div>
      </main>
    );
  }

  // Blocked user screen
  if (isBlocked) {
    return (
      <main className="mx-auto max-w-lg px-4 py-24 text-center">
        <div className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-red-100">
          <Lock className="size-7 text-red-600" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">Account Restricted</h1>
        <p className="mt-3 text-muted-foreground">
          Your account has been restricted from placing orders.
          {blockedReason ? ` Reason: ${blockedReason}.` : ""}
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          If you believe this is a mistake, please contact us:
        </p>
        {storefront?.contactPhone && (
          <a href={`tel:${storefront.contactPhone}`} className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2.5 text-sm font-bold text-primary hover:bg-primary/20 transition">
            📞 {storefront.contactPhone}
          </a>
        )}
        <div className="mt-6">
          <Button asChild variant="outline">
            <Link to="/">Go back home</Link>
          </Button>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h1 className="text-3xl font-black">Your cart is empty</h1>
        <Button asChild className="mt-6">
          <Link to="/shop">Start shopping</Link>
        </Button>
      </main>
    );
  }

  async function handlePlaceOrder() {
    if (!address.fullName || !address.phone || !address.address || !address.city || !address.postalCode || !address.lat || !address.lng) {
      setError("Please fill in all address fields and pin your location.");
      setStep(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!validateDeliveryLocation()) {
      setStep(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setPlacing(true);
    setError("");
    try {
      // Sync user to our DB first
      await syncUserFn({
        data: {
          clerkId: user!.id,
          email: user!.primaryEmailAddress?.emailAddress ?? "",
          ...(user!.firstName ? { firstName: user!.firstName } : {}),
          ...(user!.lastName ? { lastName: user!.lastName } : {}),
        },
      });

      // Create order
      const order = await createOrderFn({
        data: {
          userId: user!.id,
          items: cartItems,
          totalAmount: total,
          paymentMethod: pay.toUpperCase(),
          shippingDetails: address,
          status: "pending",
        },
      });

      // Clear cart on success
      clearCart();

      // Navigate to confirmation with order ID (replace so back doesn't go to empty checkout)
      await navigate({ to: "/order-confirmation", search: { orderId: order._id }, replace: true });
    } catch (e: any) {
      setError(e?.message ?? "Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  }

  // Extracts city + address from a Nominatim address object with wide fallback
  function extractFromNominatim(data: any) {
    const a = data.address || {};
    // City fallback chain — handles metros, towns, villages, suburbs
    const city =
      a.city || a.town || a.city_district || a.suburb ||
      a.county || a.state_district || a.state || "";
    // Build a readable street-level address instead of the long display_name
    const parts = [
      a.house_number,
      a.road || a.street || a.pedestrian || a.path,
      a.neighbourhood || a.quarter,
      a.suburb || a.city_district,
    ].filter(Boolean);
    const streetAddress = parts.length > 0 ? parts.join(", ") : (data.display_name || "");
    const postalCode = a.postcode || "";
    return { city, streetAddress, postalCode };
  }

  const handleAutoDetect = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setIsDetecting(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        // Set coordinates immediately so map pin moves right away
        setAddress(a => ({ ...a, lat, lng }));
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
            { headers: { "Accept-Language": "en" } }
          );
          if (!res.ok) throw new Error("Geocoding failed");
          const data = await res.json();
          const { city, streetAddress, postalCode } = extractFromNominatim(data);
          setAddress(a => ({
            ...a,
            lat,
            lng,
            address: streetAddress || a.address,
            city: city || a.city,
            postalCode: postalCode || a.postalCode,
          }));
        } catch {
          setError("Location found on map! Address fields could not be auto-filled — please enter them manually.");
        } finally {
          setIsDetecting(false);
        }
      },
      (err) => {
        setIsDetecting(false);
        if (err.code === 1) {
          setError("Location permission denied. Please allow location access in your device settings, then try again.");
        } else if (err.code === 3) {
          setError("Location detection timed out. Please tap the map or search your address manually.");
        } else {
          setError("Could not detect location. Please tap the map or search manually.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSearchMap = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setError("");
    try {
      const storeLat = storefront?.adminLocationLat || 13.0285;
      const storeLng = storefront?.adminLocationLng || 77.5462;
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
          setAddress(a => ({ ...a, lat, lng, address: label, city: p.city || a.city, postalCode: p.postcode || a.postalCode }));
          return;
        }
      }

      // Fallback directly to Nominatim restricted to India
      const nomRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=in&viewbox=77.3,13.2,77.8,12.8&limit=1&addressdetails=1`,
        { headers: { "Accept-Language": "en" } }
      );
      if (nomRes.ok) {
        const nomData = await nomRes.json();
        if (nomData && nomData.length > 0) {
          const item = nomData[0];
          const lat = parseFloat(item.lat);
          const lng = parseFloat(item.lon);
          const { city, streetAddress, postalCode } = extractFromNominatim(item);
          setAddress(a => ({ ...a, lat, lng, address: streetAddress || item.display_name, city: city || a.city, postalCode: postalCode || a.postalCode }));
          return;
        }
      }

      setError("Location not found in India. Please try another area or tap the map directly.");
    } catch {
      setError("Failed to search location.");
    } finally {
      setIsSearching(false);
    }
  };



  function validateDeliveryLocation(): boolean {
    if (!address.lat || !address.lng) {
      setError("Please pin your location on the map.");
      return false;
    }
    const adminLat = storefront?.adminLocationLat ?? 13.0285;
    const adminLng = storefront?.adminLocationLng ?? 77.5462;
    const maxRadius = storefront?.deliveryRadiusKm ?? 10;

    const dist = getDistanceFromLatLonInKm(address.lat, address.lng, adminLat, adminLng);
    if (dist > maxRadius) {
      setError(`Service not available in this location. We only deliver within ${maxRadius}km of our store. (You are ~${Math.round(dist)}km away)`);
      return false;
    }
    return true;
  }

  const handleMapClick = async (p: [number, number]) => {
    setAddress(a => ({ ...a, lat: p[0], lng: p[1] }));
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${p[0]}&lon=${p[1]}&addressdetails=1`,
        { headers: { "Accept-Language": "en" } }
      );
      if (res.ok) {
        const data = await res.json();
        const { city, streetAddress, postalCode } = extractFromNominatim(data);
        setAddress(a => ({
          ...a,
          address: streetAddress || a.address,
          city: city || a.city,
          postalCode: postalCode || a.postalCode,
        }));
      }
    } catch {
      // Ignore errors for pin drop — coordinates are already set
    }
  };

  const steps = [
    { n: 1, icon: MapPin, title: "Address" },
    { n: 2, icon: Truck, title: "Delivery" },
    { n: 3, icon: CreditCard, title: "Payment" },
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      {/* Back to Cart Button */}
      <div className="mb-4">
        <button
          onClick={() => {
            if (typeof window !== "undefined" && window.history.length > 1) {
              router.history.back();
            } else {
              navigate({ to: "/cart" });
            }
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-bold text-foreground shadow-sm transition hover:bg-muted hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Cart</span>
        </button>
      </div>

      <h1 className="text-3xl sm:text-4xl font-black">Checkout</h1>

      {/* Step indicator */}
      <div className="mt-6 grid grid-cols-3 gap-2">
        {steps.map(({ n, icon: Icon, title }) => (
          <div
            key={title}
            className={`flex items-center gap-2 border-b-4 pb-3 text-sm font-bold ${step >= n ? "border-primary text-primary" : "border-border text-muted-foreground"
              }`}
          >
            {step > n ? <Check className="size-4" /> : <Icon className="size-4" />}
            {title}
          </div>
        ))}
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <section className="rounded-lg border border-border bg-card p-5 sm:p-7">
          {/* Step 1 — Address */}
          {step === 1 && (
            <>
              <h2 className="text-2xl font-black">Delivery address</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Signed in as <span className="font-semibold text-foreground">{user?.primaryEmailAddress?.emailAddress}</span>
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field
                  label="Full name"
                  placeholder=""
                  value={address.fullName}
                  onChange={(v) => setAddress((a) => ({ ...a, fullName: v }))}
                />
                <Field
                  label="Mobile number"
                  placeholder=""
                  value={address.phone}
                  onChange={(v) => setAddress((a) => ({ ...a, phone: v }))}
                />
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold mb-1">
                    Search Location on Map (Bengaluru & Karnataka)
                  </label>
                  <div className="flex gap-2 relative">
                    <Input
                      className="h-11 flex-1"
                      placeholder="e.g. Yeshwanthpur, Malleshwaram, Bengaluru"
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
                    <Button type="button" variant="secondary" className="h-11 px-4" onClick={() => { setShowSuggestions(false); handleSearchMap(); }} disabled={isSearching}>
                      {isSearching ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
                    </Button>
                    
                    {/* Autocomplete Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute top-12 left-0 right-[4.5rem] z-[100] bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {suggestions.map((s, i) => {
                          const p = s.properties;
                          const label = [p.name, p.street, p.city, p.state, p.country].filter(Boolean).join(", ");
                          return (
                            <button
                              key={i}
                              type="button"
                              className="w-full text-left px-4 py-2 text-sm hover:bg-muted focus:bg-muted truncate block"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                const lng = s.geometry.coordinates[0];
                                const lat = s.geometry.coordinates[1];
                                setSearchQuery(label);
                                setShowSuggestions(false);
                                setAddress(a => ({ 
                                  ...a, 
                                  lat, 
                                  lng, 
                                  address: label, 
                                  city: p.city || a.city, 
                                  postalCode: p.postcode || a.postalCode 
                                }));
                              }}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
                <div className="sm:col-span-2 mt-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold">Pin your exact location *</label>
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
                  <div className={`${isMapFullscreen ? "fixed inset-4 z-50 shadow-2xl rounded-xl h-[calc(100vh-2rem)]" : "h-[400px]"} w-full rounded-lg border border-border overflow-hidden relative bg-muted transition-all duration-300`}>
                    {mounted && (
                      <Suspense fallback={<div className="h-full w-full flex items-center justify-center text-sm font-medium text-muted-foreground">Loading map...</div>}>
                        <MapPicker 
                          position={address.lat && address.lng ? [address.lat, address.lng] : null} 
                          setPosition={handleMapClick} 
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
                  {!address.lat && <p className="text-sm text-destructive mt-1 font-medium">Please tap on the map to pin your location.</p>}
                </div>
                <div className="sm:col-span-2">
                  <Field
                    label="Address (flat, building, street) - Auto-filled from Map"
                    placeholder="Drop a pin to auto-fill"
                    value={address.address}
                    onChange={(v) => setAddress((a) => ({ ...a, address: v }))}
                  />
                </div>
                <Field
                  label="City"
                  placeholder=""
                  value={address.city}
                  onChange={(v) => setAddress((a) => ({ ...a, city: v }))}
                />
                <Field
                  label="PIN code"
                  placeholder=""
                  value={address.postalCode}
                  onChange={(v) => setAddress((a) => ({ ...a, postalCode: v }))}
                />
              </div>
              <Button
                size="lg"
                className="mt-6 w-full"
                onClick={() => {
                  if (!address.fullName || !address.phone || !address.address || !address.city || !address.postalCode || !address.lat || !address.lng) {
                    setError("Please fill in all fields and pin your location on the map.");
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                  }

                  if (!validateDeliveryLocation()) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                  }

                  setError("");
                  setStep(2);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Continue to delivery
              </Button>
            </>
          )}

          {/* Step 2 — Delivery */}
          {step === 2 && (
            <>
              <h2 className="text-2xl font-black">Delivery method</h2>
              <label className="mt-5 flex cursor-pointer items-center justify-between rounded-lg border-2 border-primary bg-accent/30 p-4">
                <span>
                  <b>Standard delivery</b>
                  <small className="block text-muted-foreground">Arrives in 2–4 business days</small>
                </span>
                <b>{delivery === 0 ? "FREE" : `₹${calculatedDeliveryFee}`}</b>
              </label>
              <Button size="lg" className="mt-6 w-full" onClick={() => setStep(3)}>
                Continue to payment
              </Button>
            </>
          )}

          {/* Step 3 — Payment */}
          {step === 3 && (
            <>
              <h2 className="text-2xl font-black">Choose payment</h2>
              <div className="mt-5 space-y-3">
                {[
                  { id: "cod", name: "Cash on delivery", sub: "Pay when your order arrives" },
                ].map(({ id, name, sub }) => (
                  <label
                    key={id}
                    className={`flex cursor-pointer gap-3 rounded-lg border p-4 ${
                      pay === id ? "border-primary bg-accent/30" : "border-border"
                    }`}
                  >
                    <input type="radio" name="pay" checked={pay === id} onChange={() => setPay(id)} />
                    <span>
                      <b>{name}</b>
                      <small className="block text-muted-foreground">{sub}</small>
                    </span>
                  </label>
                ))}
              </div>
              <Button
                size="lg"
                className="mt-6 w-full"
                onClick={handlePlaceOrder}
                disabled={placing}
              >
                {placing ? (
                  <><Loader2 className="mr-2 size-4 animate-spin" />Placing order…</>
                ) : (
                  `Place order · ${formatPrice(total)}`
                )}
              </Button>
            </>
          )}
        </section>

        {/* Order summary sidebar — appears first on mobile, right on desktop */}
        <aside className="h-fit rounded-lg bg-muted p-5 order-first lg:order-last">
          <h2 className="font-black">Order summary</h2>
          <div className="mt-4 space-y-2">
            {cartItems.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span className="text-muted-foreground truncate mr-2">{item.name} × {item.quantity}</span>
                <b className="shrink-0">{formatPrice(item.price * (item.quantity ?? 1))}</b>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-border pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span><b>{formatPrice(subtotal)}</b>
            </div>
            <div className="flex justify-between text-sm">
              <span>Delivery</span><b>{delivery === 0 ? "FREE" : `₹${calculatedDeliveryFee}`}</b>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-border pt-4 text-xl font-black">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </aside>
      </div>
    </main>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <Input
        className="mt-1 h-11"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
