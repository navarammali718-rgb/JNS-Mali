import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Smartphone, ShieldCheck, CheckCircle2, ArrowRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/download")({
  head: () => ({
    meta: [
      { title: "Download JNS MALI Android App — Direct APK" },
      {
        name: "description",
        content:
          "Download the official JNS MALI Android application directly to your mobile phone for fast shopping, order tracking, and instant alerts.",
      },
      { property: "og:title", content: "Download JNS MALI Android App" },
      {
        property: "og:description",
        content: "Get the official JNS MALI Android App directly on your mobile.",
      },
    ],
  }),
  component: DownloadPage,
});

function DownloadPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero section */}
      <section className="bg-gradient-to-b from-emerald-950 via-primary/90 to-background text-white px-4 py-16 sm:py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mx-auto size-20 rounded-2xl bg-white p-2 shadow-2xl mb-6">
            <img src="/logo.jpeg" alt="JNS MALI" className="size-full rounded-xl object-cover" />
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur mb-4">
            <Smartphone className="size-3.5 text-emerald-300" /> Official Android Application
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Download JNS MALI for Android
          </h1>
          <p className="mt-4 text-base sm:text-lg text-white/85 max-w-xl mx-auto leading-relaxed">
            Get the full shopping experience right on your mobile. Faster loading, instant order notifications, and seamless reorders.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/JNS-MALI-Customer.apk"
              download="JNS-MALI-Customer.apk"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-xl bg-white px-8 py-4 text-base font-black text-emerald-950 shadow-2xl hover:bg-white/95 active:scale-95 transition"
            >
              <Download className="size-6 text-emerald-700" />
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold text-emerald-700 leading-none">Direct Download</div>
                <div className="text-base font-black">Download Android APK (v1.3)</div>
              </div>
            </a>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs text-white/75">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-emerald-400" /> 100% Safe & Virus Free
            </span>
            <span>•</span>
            <span>Version 1.3 (~16.5 MB)</span>
            <span>•</span>
            <span>Supports Android 6.0 and above</span>
          </div>
        </div>
      </section>

      {/* Why get the app */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-center text-2xl font-black mb-8">Why use the JNS MALI App?</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="size-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
              <CheckCircle2 className="size-6" />
            </div>
            <h3 className="font-bold text-base">Instant Order Updates</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Receive instant push notifications when your order is placed, packed, and out for delivery.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="size-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
              <Smartphone className="size-6" />
            </div>
            <h3 className="font-bold text-base">Smooth & Fast Browsing</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Enjoy a dedicated mobile interface with offline caching for rapid product searching and shopping.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="size-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
              <ShieldCheck className="size-6" />
            </div>
            <h3 className="font-bold text-base">Saved Addresses & 1-Tap Checkout</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Save multiple delivery addresses with pin-drop GPS location for seamless repeat orders.
            </p>
          </div>
        </div>
      </section>

      {/* How to install instructions */}
      <section className="bg-muted/50 border-y border-border py-12 px-4">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-2 justify-center mb-6">
            <HelpCircle className="size-5 text-primary" />
            <h2 className="text-xl sm:text-2xl font-black text-center">How to Install on Your Android Phone</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-4 rounded-xl bg-card border border-border p-4 shadow-sm">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-black text-sm">
                1
              </span>
              <div>
                <b className="text-sm">Download the APK file</b>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Tap the "Download Android APK" button above. Your phone browser (Chrome, Samsung Internet, etc.) will start downloading the file.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-xl bg-card border border-border p-4 shadow-sm">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-black text-sm">
                2
              </span>
              <div>
                <b className="text-sm">Open the downloaded APK</b>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Once downloaded, tap on the completed download notification or open the file from your phone's <b>Downloads</b> folder.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-xl bg-card border border-border p-4 shadow-sm">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-black text-sm">
                3
              </span>
              <div>
                <b className="text-sm">Allow installation if prompted</b>
                <p className="text-xs text-muted-foreground mt-0.5">
                  If your phone asks <i>"Allow from this source"</i> or warns about unknown apps, tap <b>Settings</b>, switch on <b>Allow from this source</b>, and tap <b>Install</b>.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="/JNS-MALI-Customer.apk"
              download="JNS-MALI-Customer.apk"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow hover:bg-primary/90 transition"
            >
              <Download className="size-4" />
              <span>Download JNS MALI APK Now</span>
            </a>
          </div>
        </div>
      </section>

      {/* Back to store */}
      <div className="py-8 text-center">
        <Button asChild variant="ghost">
          <Link to="/" className="gap-2">
            <span>Continue shopping on website</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </main>
  );
}
