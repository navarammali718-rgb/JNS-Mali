import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useUser, useClerk, SignIn } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import PullToRefresh from 'react-simple-pull-to-refresh';
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingBag,
  Store,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";



const navItems = [
  { to: "/admin" as const, label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products" as const, label: "Products", icon: Package },
  { to: "/admin/categories" as const, label: "Categories", icon: Tag },
  { to: "/admin/orders" as const, label: "Orders", icon: ShoppingBag },
  { to: "/admin/storefront" as const, label: "Settings", icon: Store },
];

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [sideOpen, setSideOpen] = useState(false);
  const [adminEmails, setAdminEmails] = useState<string[]>([]);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function loadConfig() {
      try {
        const { getStorefrontFn } = await import("@/server-functions");
        const config = await getStorefrontFn();
        setAdminEmails(config.adminEmails || ["sanjayparihar0625@gmail.com"]);
      } catch (e) {
        setAdminEmails(["sanjayparihar0625@gmail.com"]);
      } finally {
        setCheckingAuth(false);
      }
    }
    loadConfig();
  }, []);

  if (!isLoaded || checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="size-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const PERMANENT_ADMINS = ["sanjayparihar0625@gmail.com", "navarammali718@gmail.com", "sanjay@san4u.in"];
  const isAdmin = isSignedIn && (adminEmails.includes(email) || PERMANENT_ADMINS.includes(email));

  if (!isSignedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-black text-slate-900">Admin Panel</h1>
            <p className="mt-2 text-slate-500">Sign in to access the dashboard</p>
          </div>
          <div className="overflow-hidden rounded-2xl bg-white p-6 shadow-2xl">
            <SignIn routing="virtual" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
        <div className="rounded-2xl bg-white p-10 shadow-2xl border border-slate-200">
          <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-red-500/10">
            <X className="size-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Access Denied</h1>
          <p className="mt-3 text-slate-500">
            You are signed in as <span className="font-semibold text-slate-700">{email}</span>.<br />
            Only the authorized admin can access this panel.
          </p>
          <Button
            className="mt-6"
            variant="outline"
            onClick={() => signOut(() => navigate({ to: "/" }))}
          >
            Sign out and go home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white border-r border-slate-200 shadow-sm transition-transform duration-200 lg:static lg:translate-x-0 ${sideOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
          <img src="/logo.jpeg" alt="Logo" className="size-9 rounded-lg object-cover bg-white shadow-sm" />
          <div>
            <p className="text-sm font-bold leading-none text-slate-900">JNS MALI</p>
            <p className="text-xs text-slate-500">Admin Panel</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto lg:hidden text-slate-500 hover:text-slate-900"
            onClick={() => setSideOpen(false)}
          >
            <X className="size-4" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          {navItems.map(({ to, label, icon: Icon, exact }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setSideOpen(false)}
              activeProps={{ className: "bg-primary/10 text-primary font-bold" }}
              activeOptions={{ exact: !!exact }}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <Icon className="size-4 shrink-0" />
              {label}
              <ChevronRight className="ml-auto size-3 opacity-30" />
            </Link>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-3">
          <div className="mb-3 flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2 border border-slate-100">
            <div className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-black text-primary">
              {(user?.firstName?.[0] ?? email[0] ?? "A").toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-slate-900">{user?.firstName ?? "Admin"}</p>
              <p className="truncate text-[10px] font-medium text-slate-500">{email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            size="sm"
            onClick={() => signOut(() => navigate({ to: "/" }))}
          >
            <LogOut className="mr-2 size-4" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Overlay */}
      {sideOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSideOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-slate-500 hover:text-slate-900"
            onClick={() => setSideOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <span className="font-bold text-slate-900">JNS MALI Admin</span>
          <span className="ml-auto text-xs text-slate-500">
            Signed in as <span className="text-slate-900 font-bold">{user?.firstName ?? email}</span>
          </span>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50">
          <PullToRefresh
            onRefresh={async () => {
              window.location.reload();
            }}
            pullingContent={<div className="text-center py-4 text-xs font-bold text-slate-500">Pull down to refresh</div>}
            refreshingContent={<div className="text-center py-4 text-xs font-bold text-primary">Refreshing...</div>}
            resistance={2}
          >
            <div className="p-4 sm:p-6 min-h-[calc(100vh-60px)]">
              <Outlet />
            </div>
          </PullToRefresh>
        </main>
      </div>
    </div>
  );
}
