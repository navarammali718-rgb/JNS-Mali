import { createFileRoute, Link } from "@tanstack/react-router";
import { useUser, useClerk, SignIn } from "@clerk/clerk-react";
import { Heart, Package, ShoppingBag, UserRound, LogOut, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — JNS MALI" },
      { name: "description", content: "Manage your JNS MALI account and orders." },
      { property: "og:title", content: "My Account — JNS MALI" },
      { property: "og:description", content: "Manage orders, saved items and addresses." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

const links = [
  { icon: Package, title: "My orders", sub: "Track, return or buy again", to: "/orders" as const },
  { icon: Heart, title: "Wishlist", sub: "View your saved products", to: "/wishlist" as const },
  { icon: ShoppingBag, title: "Continue shopping", sub: "Browse our latest products", to: "/shop" as const },
];

function Page() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  if (!isLoaded) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-32 flex justify-center">
        <Loader2 className="size-10 animate-spin text-primary" />
      </main>
    );
  }

  if (!isSignedIn) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-primary/10">
            <Lock className="size-6 text-primary" />
          </div>
          <h1 className="text-3xl font-black">Sign in to your account</h1>
          <p className="mt-2 text-muted-foreground">Sign in with Google to manage your orders and wishlist.</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 flex justify-center">
          <SignIn routing="virtual" />
        </div>
      </main>
    );
  }

  const displayName = user.fullName || user.primaryEmailAddress?.emailAddress || "User";
  const email = user.primaryEmailAddress?.emailAddress ?? "—";
  const phone = user.primaryPhoneNumber?.phoneNumber ?? "Not provided";
  const initials = (user.firstName?.[0] ?? email[0] ?? "U").toUpperCase();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center gap-4">
        {user.imageUrl ? (
          <img src={user.imageUrl} alt={displayName} className="size-16 rounded-full object-cover ring-2 ring-primary/30" />
        ) : (
          <span className="grid size-14 place-items-center rounded-full bg-secondary text-xl font-black">
            {initials}
          </span>
        )}
        <div>
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="text-3xl font-black">{displayName}</h1>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {links.map(({ icon: Icon, title, sub, to }) => (
          <Link
            to={to}
            key={title}
            className="rounded-lg border border-border bg-card p-5 hover:border-primary transition"
          >
            <Icon className="text-primary" />
            <h2 className="mt-4 text-xl font-bold">{title}</h2>
            <p className="text-sm text-muted-foreground">{sub}</p>
          </Link>
        ))}
      </div>

      <section className="mt-8 rounded-lg border border-border bg-card p-5">
        <h2 className="text-xl font-black">Account details</h2>
        <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <span className="text-muted-foreground">Name</span>
            <b className="block">{displayName}</b>
          </div>
          <div>
            <span className="text-muted-foreground">Email</span>
            <b className="block">{email}</b>
          </div>
          <div>
            <span className="text-muted-foreground">Phone</span>
            <b className="block">{phone}</b>
          </div>
          <div>
            <span className="text-muted-foreground">Sign-in method</span>
            <b className="block capitalize">Google</b>
          </div>
        </div>
        <Button
          variant="outline"
          className="mt-6 gap-2 text-destructive hover:bg-destructive/10 hover:border-destructive"
          onClick={() => signOut()}
        >
          <LogOut className="size-4" />
          Sign out
        </Button>
      </section>
    </main>
  );
}
