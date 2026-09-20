import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Check, MapPin, Truck, CreditCard, Loader2, Lock } from "lucide-react";
import { useUser, SignIn } from "@clerk/clerk-react";
import { formatPrice } from "@/lib/catalog";
import { useStore } from "@/components/store/store-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createOrderFn, syncUserFn } from "@/server-functions";

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
  const { cart, products, subtotal, clearCart } = useStore();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [pay, setPay] = useState("cod");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const [address, setAddress] = useState({
    fullName: user?.fullName ?? "",
    phone: user?.primaryPhoneNumber?.phoneNumber ?? "",
    address: "",
    city: "",
    postalCode: "",
  });

  const delivery = subtotal >= 499 ? 0 : 49;
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
    if (!address.fullName || !address.phone || !address.address || !address.city || !address.postalCode) {
      setError("Please fill in all address fields.");
      setStep(1);
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

      // Navigate to confirmation with order ID
      await navigate({ to: "/order-confirmation", search: { orderId: order._id } });
    } catch (e: any) {
      setError(e?.message ?? "Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  }

  const steps = [
    { n: 1, icon: MapPin, title: "Address" },
    { n: 2, icon: Truck, title: "Delivery" },
    { n: 3, icon: CreditCard, title: "Payment" },
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-4xl font-black">Checkout</h1>

      {/* Step indicator */}
      <div className="mt-6 grid grid-cols-3 gap-2">
        {steps.map(({ n, icon: Icon, title }) => (
          <div
            key={title}
            className={`flex items-center gap-2 border-b-4 pb-3 text-sm font-bold ${
              step >= n ? "border-primary text-primary" : "border-border text-muted-foreground"
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
                  placeholder="Ananya Sharma"
                  value={address.fullName}
                  onChange={(v) => setAddress((a) => ({ ...a, fullName: v }))}
                />
                <Field
                  label="Mobile number"
                  placeholder="98765 43210"
                  value={address.phone}
                  onChange={(v) => setAddress((a) => ({ ...a, phone: v }))}
                />
                <div className="sm:col-span-2">
                  <Field
                    label="Address (flat, building, street)"
                    placeholder="123, Sunrise Apartments, MG Road"
                    value={address.address}
                    onChange={(v) => setAddress((a) => ({ ...a, address: v }))}
                  />
                </div>
                <Field
                  label="City"
                  placeholder="Pune"
                  value={address.city}
                  onChange={(v) => setAddress((a) => ({ ...a, city: v }))}
                />
                <Field
                  label="PIN code"
                  placeholder="411001"
                  value={address.postalCode}
                  onChange={(v) => setAddress((a) => ({ ...a, postalCode: v }))}
                />
              </div>
              <Button
                size="lg"
                className="mt-6 w-full"
                onClick={() => {
                  if (!address.fullName || !address.phone || !address.address || !address.city || !address.postalCode) {
                    setError("Please fill in all fields.");
                    return;
                  }
                  setError("");
                  setStep(2);
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
                <b>{delivery === 0 ? "FREE" : "₹49"}</b>
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
                  { id: "upi", name: "UPI", sub: "Pay with any UPI app" },
                  { id: "card", name: "Credit / debit card", sub: "Visa, Mastercard and RuPay" },
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

        {/* Order summary sidebar */}
        <aside className="h-fit rounded-lg bg-muted p-5">
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
              <span>Delivery</span><b>{delivery === 0 ? "FREE" : "₹49"}</b>
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
