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
  const { cartCount, wishlist, storefront } = useStore();
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
        {storefront?.announcement || "Free delivery on all orders"}
      </div>

      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-center justify-between gap-y-3 py-3 sm:grid sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-6">

            {/* Top row mobile: Hamburger + Logo + Icons */}
            <div className="flex w-full items-center justify-between sm:w-auto sm:justify-start sm:gap-4">
              <div className="flex items-center gap-2">
                {/* Mobile menu toggle */}
                <Button variant="ghost" size="icon" className="lg:hidden -ml-2" onClick={() => setMenu(!menu)} aria-label="Toggle menu">
                  {menu ? <X /> : <Menu />}
                </Button>

                {/* Logo */}
                <Link to="/" className="flex shrink-0 items-center gap-2">
                  <img src="/logo.jpeg" alt="JNS MALI Logo" className="size-9 rounded-lg object-cover sm:size-10 bg-white" />
                  <span className="hidden sm:block">
                    <b className="block text-xl leading-none">JNS MALI</b>
                    <small className="text-[10px] font-bold uppercase text-muted-foreground">Har ghar ka saathi</small>
                  </span>
                </Link>
              </div>

              {/* Mobile Icons */}
              <div className="flex items-center gap-1 sm:hidden -mr-2">
                <Button asChild variant="ghost" size="icon">
                  <Link to="/wishlist"><Heart className="size-5" /></Link>
                </Button>
                <Button asChild variant="ghost" size="icon" className="relative">
                  <Link to="/cart">
                    <ShoppingCart className="size-5" />
                    {mounted && cartCount > 0 && (
                      <span className="absolute right-0 top-0 grid size-4 place-items-center rounded-full bg-primary text-[9px] text-primary-foreground">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Search - Full width on mobile, middle column on desktop */}
            <form onSubmit={search} className="flex w-full order-last sm:order-none sm:mx-auto sm:max-w-2xl">
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search scrubbers, loofahs, brushes…"
                aria-label="Search products"
                className="h-10 rounded-r-none border-r-0 bg-muted/60 sm:h-11"
              />
              <Button type="submit" className="h-10 rounded-l-none px-4 sm:h-11" aria-label="Search">
                <Search className="size-4 sm:size-5" />
              </Button>
            </form>

            {/* Desktop Icons */}
            <nav className="hidden sm:flex items-center justify-end gap-1">
              <Button asChild variant="ghost" size="icon">
                <Link to="/wishlist" aria-label={`Wishlist with ${wishlist.length} items`}>
                  <Heart />
                </Link>
              </Button>

              {/* Auth button */}
              {mounted && isSignedIn ? (
                <div className="relative group">
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
                <Button asChild variant="ghost" size="icon">
                  <Link to="/account" aria-label="Sign in">
                    <UserRound />
                  </Link>
                </Button>
              )}

              {/* Cart */}
              <Button asChild variant="secondary" className="relative px-3 ml-1">
                <Link to="/cart">
                  <ShoppingCart className="mr-1.5 size-4" />
                  <span>Cart</span>
                  {mounted && cartCount > 0 && (
                    <span className="grid size-5 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground ml-2">
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
              className="lg:ml-auto flex items-center gap-2 px-3 py-2 text-sm font-semibold text-foreground/80 hover:text-primary"
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
      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-background p-1 sm:hidden">
        <Link to="/" className="p-2 text-center text-xs font-semibold text-foreground/80 hover:text-primary">Home</Link>
        <Link to="/shop" className="p-2 text-center text-xs font-semibold text-foreground/80 hover:text-primary">Shop</Link>
        <Link to="/orders" className="p-2 text-center text-xs font-semibold text-foreground/80 hover:text-primary">Orders</Link>
        <Link to="/wishlist" className="p-2 text-center text-xs font-semibold text-foreground/80 hover:text-primary">Wishlist</Link>
        <Link to="/cart" className="p-2 text-center text-xs font-semibold text-foreground/80 hover:text-primary">
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
