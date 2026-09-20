import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useUser, useClerk } from "@clerk/clerk-react";
import { Heart, Menu, Package, Search, ShoppingCart, UserRound, X, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "./store-context";

const nav = [
  { label: "Home", to: "/" as const },
  { label: "Shop", to: "/shop" as const },
  { label: "About Us", to: "/about" as const },
  { label: "Contact Us", to: "/contact" as const },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const { cartCount, wishlist } = useStore();
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const [menu, setMenu] = useState(false);
  const [q, setQ] = useState("");
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { setMounted(true); }, []);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    void navigate({ to: "/shop", search: { q: q || undefined, category: undefined } });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Announcement bar */}
      <div className="bg-primary px-4 py-2 text-center text-xs font-semibold text-primary-foreground">
        Free delivery above ₹499 <span className="mx-2 opacity-60">•</span> COD available{" "}
        <span className="hidden sm:inline">
          <span className="mx-2 opacity-60">•</span> Extra savings on bulk orders
        </span>
      </div>

      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-3">
            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMenu(!menu)}
              aria-label="Toggle menu"
            >
              {menu ? <X /> : <Menu />}
            </Button>

            {/* Logo */}
            <Link to="/" className="hidden shrink-0 items-center gap-2 sm:flex">
              <span className="grid size-10 place-items-center rounded-lg bg-primary text-xl font-black text-primary-foreground">
                JM
              </span>
              <span>
                <b className="block text-xl leading-none">JNS MALI</b>
                <small className="text-[10px] font-bold uppercase text-muted-foreground">Har ghar ka saathi</small>
              </span>
            </Link>

            {/* Search */}
            <form onSubmit={search} className="mx-auto flex w-full max-w-2xl">
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search scrubbers, loofahs, brushes…"
                aria-label="Search products"
                className="h-11 rounded-r-none border-r-0 bg-muted/60"
              />
              <Button type="submit" className="h-11 rounded-l-none px-4" aria-label="Search">
                <Search />
              </Button>
            </form>

            {/* Nav icons */}
            <nav className="flex items-center justify-end gap-0.5">
              <Button asChild variant="ghost" size="icon">
                <Link to="/wishlist" aria-label={`Wishlist with ${wishlist.length} items`}>
                  <Heart />
                </Link>
              </Button>

              {/* Auth button */}
              {mounted && isSignedIn ? (
                <div className="relative hidden sm:block group">
                  <Button asChild variant="ghost" size="icon">
                    <Link to="/account" aria-label="Account">
                      {user?.imageUrl ? (
                        <img src={user.imageUrl} alt="" className="size-7 rounded-full object-cover" />
                      ) : (
                        <UserRound />
                      )}
                    </Link>
                  </Button>
                </div>
              ) : (
                <Button asChild variant="ghost" size="icon" className="hidden sm:inline-flex">
                  <Link to="/account" aria-label="Sign in">
                    <UserRound />
                  </Link>
                </Button>
              )}

              {/* Cart */}
              <Button asChild variant="secondary" className="relative px-3">
                <Link to="/cart">
                  <ShoppingCart />
                  <span className="hidden sm:inline">Cart</span>
                  {mounted && cartCount > 0 && (
                    <span className="grid size-5 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </Button>
            </nav>
          </div>

          {/* Desktop + mobile nav */}
          <nav
            className={`${menu ? "flex" : "hidden"} flex-col gap-1 border-t border-border py-3 lg:flex lg:flex-row lg:items-center lg:border-0 lg:py-0`}
          >
            {nav.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setMenu(false)}
                className="px-3 py-2 text-sm font-semibold text-foreground/80 hover:text-primary"
                activeProps={{ className: "text-primary" }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/orders"
              onClick={() => setMenu(false)}
              className="ml-auto flex items-center gap-2 px-3 py-2 text-sm font-semibold"
            >
              <Package className="size-4" />
              Track order
            </Link>

            {isSignedIn ? (
              <button
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground lg:hidden"
                onClick={() => { signOut(); setMenu(false); }}
              >
                <LogOut className="size-4" />
                Sign out
              </button>
            ) : (
              <Link
                to="/account"
                onClick={() => setMenu(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-primary lg:hidden"
              >
                <LogIn className="size-4" />
                Sign in
              </Link>
            )}
          </nav>
        </div>
      </header>

      {children}

      <Footer />

      {/* Mobile bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-border bg-background p-1 sm:hidden">
        <Link to="/" className="p-2 text-center text-xs font-semibold">Home</Link>
        <Link to="/shop" className="p-2 text-center text-xs font-semibold">Shop</Link>
        <Link to="/wishlist" className="p-2 text-center text-xs font-semibold">Wishlist</Link>
        <Link to="/cart" className="p-2 text-center text-xs font-semibold">
          Cart {mounted && cartCount > 0 && `(${cartCount})`}
        </Link>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-foreground text-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="sm:col-span-2">
          <b className="text-2xl">JNS MALI</b>
          <p className="mt-3 max-w-sm text-sm opacity-70">
            Dependable cleaning and household essentials at honest prices, delivered across India.
          </p>
          <p className="mt-4 text-sm font-semibold">UPI · Cards · Netbanking · COD</p>
        </div>
        <FooterGroup title="Shop" links={[["All products", "/shop"], ["Wishlist", "/wishlist"]]} />
        <FooterGroup title="Help" links={[["FAQs", "/faq"], ["Contact us", "/contact"], ["Track order", "/orders"]]} />
        <FooterGroup title="JNS MALI" links={[["About us", "/about"], ["Shipping", "/shipping"], ["Returns", "/returns"], ["Privacy", "/privacy"]]} />
      </div>
      <div className="border-t border-background/15 px-4 py-5 text-center text-xs opacity-60">
        © 2026 JNS MALI. All rights reserved.
      </div>
    </footer>
  );
}

function FooterGroup({ title, links }: { title: string; links: string[][] }) {
  return (
    <div>
      <h3 className="font-bold">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm opacity-70">
        {links.map(([l, to]) => (
          <li key={to}>
            <Link to={to as "/"}>{l}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
