import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { ClerkProvider, useUser } from "@clerk/clerk-react";
import { useEffect, type ReactNode } from "react";
import { StoreProvider } from "@/components/store/store-context";
import { SiteShell } from "@/components/store/site-shell";
import { Capacitor } from "@capacitor/core";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

// @ts-ignore - TS expects bracket notation but Vite expects dot notation for replacement
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" },
      { title: "JNS MALI — Household Essentials" },
      { name: "description", content: "Affordable cleaning and household essentials for homes and shops across India. Best wholesaler for plastic and household products in Yeshwanthpura." },
      { name: "keywords", content: "jnsmali, jns-mali, jns mali, jnsmali wholesaler, jns-mali wholesaler, jns mali wholesaler, jnsmali plastic, jns-mali plastic, jns mali plastic, jnsmali products, jns-mali products, jns mali products, yeshwanthpura wholesaler, wholesaler jns mali" },
      { name: "author", content: "JNS MALI" },
      { property: "og:title", content: "JNS MALI — Household Essentials" },
      { property: "og:description", content: "Affordable cleaning and household essentials for homes and shops across India." },
      { property: "og:site_name", content: "JNS MALI" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/logo.jpeg" },
      { property: "og:image:alt", content: "JNS MALI Logo" },
      { property: "og:url", content: "https://jnsmali.netlify.app" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/logo.jpeg" },
      { name: "theme-color", content: "#16a34a" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/logo.jpeg", type: "image/jpeg" },
      { rel: "apple-touch-icon", href: "/logo.jpeg" },
      { rel: "shortcut icon", href: "/logo.jpeg" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "JNS MALI",
    "url": "https://jnsmali.netlify.app/"
  };

  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  const location = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = location.startsWith("/admin");

  useEffect(() => {
    // Check if it's the native app AND specifically the Admin APK
    const isNativeAdmin = Capacitor.isNativePlatform() && navigator.userAgent.includes("JNS_ADMIN");

    if (isNativeAdmin && location === "/") {
      router.navigate({ to: "/admin", replace: true });
    }
  }, [location, router]);

  // ── Android physical back-button handler ──────────────────────────────────
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let backButtonListener: any;

    import("@capacitor/app").then(({ App }) => {
      backButtonListener = App.addListener("backButton", () => {
        const currentPath = window.location.pathname;

        // Admin routes handling: return to dashboard or exit
        if (currentPath.startsWith("/admin")) {
          if (currentPath === "/admin" || currentPath === "/admin/") {
            if (window.confirm("Exit Admin Panel?")) {
              App.exitApp();
            }
          } else {
            // Coming back to dashboard from any admin subpage
            router.navigate({ to: "/admin" });
          }
          return;
        }

        // Store customer routes handling: return to home page or exit
        if (currentPath === "/" || currentPath === "") {
          if (window.confirm("Exit JNS MALI?")) {
            App.exitApp();
          }
        } else {
          // Coming back to home page from any store subpage
          router.navigate({ to: "/" });
        }
      });
    }).catch(() => {});

    return () => {
      backButtonListener?.remove();
    };
  }, [router]);
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        {/* Syncs every signed-in user to MongoDB — must be inside ClerkProvider */}
        <UserSyncer />
        {isAdmin ? (
          // Admin routes: no store shell, no header/footer, Clerk available
          <Outlet />
        ) : (
          // Store routes: full store layout
          <StoreProvider>
            <SiteShell>
              <Outlet />
            </SiteShell>
          </StoreProvider>
        )}
      </QueryClientProvider>
    </ClerkProvider>
  );
}

/** Syncs every signed-in user to MongoDB — runs once per sign-in. */
function UserSyncer() {
  const { isSignedIn, user } = useUser();
  useEffect(() => {
    if (!isSignedIn || !user) return;
    import("@/server-functions").then(({ upsertUserFn }) => {
      upsertUserFn({
        data: {
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress ?? "",
          firstName: user.firstName ?? "",
          lastName: user.lastName ?? "",
        },
      }).catch(() => {});
    });
  }, [isSignedIn, user?.id]);
  return null;
}
