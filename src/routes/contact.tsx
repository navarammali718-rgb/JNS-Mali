import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle, Phone, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/components/store/store-context";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — JNS MALI" },
      { name: "description", content: "Get help with products, orders and wholesale shopping at JNS MALI." },
      { property: "og:title", content: "Contact Us — JNS MALI" },
      { property: "og:description", content: "Friendly help for household cleaning products, orders and wholesale enquiries." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { storefront } = useStore();
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orderNumber: "",
    message: "",
  });

  const phone = storefront?.contactPhone || "+91 98765 43210";
  const whatsapp = storefront?.whatsappNumber || storefront?.contactPhone || "+91 98765 43210";
  const email = storefront?.contactEmail || "contact@jnsmali.com";
  const address = storefront?.adminLocationAddress || "Yeshwanthpur, Bengaluru, Karnataka, India";
  const hours = storefront?.supportHours || "Mon–Sat, 9:00 AM – 8:00 PM";

  const cleanWaNumber = whatsapp.replace(/[^0-9]/g, "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      {/* Top Banner */}
      <div className="max-w-2xl">
        <p className="font-bold text-xs uppercase tracking-wider text-primary">We&apos;re Here To Help</p>
        <h1 className="mt-2 text-3xl sm:text-5xl font-black text-foreground">Contact &amp; Support</h1>
        <p className="mt-3 text-muted-foreground text-sm sm:text-base">
          Have a question about an order, wholesale inquiry, or bulk purchase? Reach out to us through any of our support channels below.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_1.4fr]">
        {/* Contact Channels List */}
        <div className="space-y-3.5">
          {/* Phone */}
          <a
            href={`tel:${phone}`}
            className="group flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition hover:border-primary/50 hover:shadow-sm"
          >
            <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition">
              <Phone className="size-5" />
            </div>
            <div className="min-w-0">
              <b className="block text-sm sm:text-base font-bold text-foreground">Phone Call</b>
              <p className="text-xs font-semibold text-primary mt-0.5">{phone}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{hours}</p>
            </div>
          </a>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${cleanWaNumber}?text=${encodeURIComponent("Hello JNS MALI team, I have an inquiry regarding your products/orders.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition hover:border-emerald-500/50 hover:shadow-sm"
          >
            <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
              <MessageCircle className="size-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <b className="block text-sm sm:text-base font-bold text-foreground">WhatsApp Chat</b>
                <span className="rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.2 text-[10px] font-bold border border-emerald-200">
                  Instant
                </span>
              </div>
              <p className="text-xs font-semibold text-emerald-600 mt-0.5">{whatsapp}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Quick order status &amp; product availability assistance</p>
            </div>
          </a>

          {/* Email */}
          <a
            href={`mailto:${email}`}
            className="group flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition hover:border-primary/50 hover:shadow-sm"
          >
            <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition">
              <Mail className="size-5" />
            </div>
            <div className="min-w-0">
              <b className="block text-sm sm:text-base font-bold text-foreground">Email Support</b>
              <p className="text-xs font-semibold text-primary mt-0.5">{email}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Replies within one business day</p>
            </div>
          </a>

          {/* Store / Dispatch Address */}
          <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-4">
            <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700">
              <MapPin className="size-5" />
            </div>
            <div className="min-w-0">
              <b className="block text-sm sm:text-base font-bold text-foreground">Store &amp; Dispatch Hub</b>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{address}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                Open in Google Maps ↗
              </a>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-4">
            <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700">
              <Clock className="size-5" />
            </div>
            <div className="min-w-0">
              <b className="block text-sm sm:text-base font-bold text-foreground">Business Hours</b>
              <p className="text-xs text-muted-foreground mt-0.5">{hours}</p>
              <p className="text-[11px] text-muted-foreground/80 mt-0.5">Closed on select national holidays</p>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-black text-foreground">Send us a Message</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Fill in your details and our team will get back to you promptly.
          </p>

          {sent ? (
            <div className="mt-8 rounded-xl bg-primary/10 border border-primary/20 p-6 text-center space-y-2 animate-in fade-in">
              <CheckCircle2 className="mx-auto size-12 text-primary" />
              <h3 className="text-lg font-bold text-foreground">Message Received!</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Thank you for getting in touch, <b className="text-foreground">{formData.name}</b>. Our customer support team has received your message and will respond shortly.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSent(false);
                  setFormData({ name: "", email: "", orderNumber: "", message: "" });
                }}
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-foreground">Your Name *</label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Anand Sharma"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground">Email Address *</label>
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                    placeholder="name@example.com"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground">Order Number (Optional)</label>
                <Input
                  value={formData.orderNumber}
                  onChange={(e) => setFormData((f) => ({ ...f, orderNumber: e.target.value }))}
                  placeholder="e.g. #ORD-12345"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground">How can we help? *</label>
                <Textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Tell us about your inquiry, wholesale requirement, or issue..."
                  className="mt-1 min-h-[120px]"
                />
              </div>

              <Button type="submit" className="w-full sm:w-auto font-bold gap-2">
                <Send className="size-4" />
                <span>Send Message</span>
              </Button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}