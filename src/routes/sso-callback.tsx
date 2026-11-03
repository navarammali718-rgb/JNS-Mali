import { createFileRoute } from "@tanstack/react-router";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/sso-callback")({
  component: SSOCallbackPage,
});

function SSOCallbackPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 gap-3">
      <Loader2 className="size-10 animate-spin text-primary" />
      <p className="text-sm font-bold text-slate-700">Signing you into Admin with Google...</p>
      <AuthenticateWithRedirectCallback
        signInForceRedirectUrl="/admin"
        signUpForceRedirectUrl="/admin"
        signInFallbackRedirectUrl="/admin"
        signUpFallbackRedirectUrl="/admin"
      />
    </div>
  );
}
