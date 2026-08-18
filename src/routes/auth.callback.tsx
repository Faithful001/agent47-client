import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "../store/auth";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();
  const checkSession = useAuthStore((s) => s.checkSession);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    const initAuth = async () => {
      if (token) {
        localStorage.setItem("auth_token", token);
      }
      await checkSession();
      navigate({ to: "/dashboard" } as any);
    };

    initAuth();
  }, [navigate, checkSession]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-100">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-inner">
          <img
            src="/agent47logo%20standalone.png"
            alt="Agent47 Logo"
            className="h-8 w-8 object-contain"
          />
        </div>
        <div className="mb-4 flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
          <span className="text-sm font-medium text-zinc-300">Completing sign-in...</span>
        </div>
        <p className="text-xs text-zinc-500">Redirecting to your dashboard</p>
      </div>
    </div>
  );
}
