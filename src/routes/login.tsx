import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { api } from "../lib/api";
import type { BaseResponse } from "../types";
import { useAuthStore } from "../store/auth";
import { Bug, Github, Loader2 } from "lucide-react";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    const state = useAuthStore.getState();
    if (state.isLoading) {
      await state.checkSession();
    }
    if (useAuthStore.getState().user) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const { data } = await api.get<BaseResponse<{ url: string }>>("/auth/login");
      window.location.href = data.data.url;
    } catch {
      setLoginError("Failed to start login. Please try again.");
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-zinc-950 px-4 overflow-hidden">
      {/* Background dot grid */}
      <div
        className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px]"
        style={{
          maskImage: "radial-gradient(circle 500px at center, black 40%, transparent 100%)",
        }}
      />

      {/* Floating subtle ambient glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.03]"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,1) 0%, transparent 70%)",
        }}
      />

      {/* Back to Home Link */}
      <Link
        to="/"
        className="absolute left-6 top-6 inline-flex items-center gap-2 text-xs font-medium text-zinc-500 no-underline transition hover:text-zinc-300"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Home
      </Link>

      <div className="relative z-10 w-full max-w-md space-y-8 rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-8 md:p-10 shadow-2xl backdrop-blur-md shadow-black/80">
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 shadow-inner">
            <Bug className="h-6 w-6 text-white" strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-zinc-400 font-sans">
            Sign in to your account to continue to Agent47
          </p>
        </div>

        <div className="mt-8">
          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="group relative flex w-full justify-center rounded-lg bg-white px-4 py-3 text-sm font-semibold text-zinc-950 no-underline transition hover:bg-zinc-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <div className="flex items-center gap-2.5">
              {isLoggingIn ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Github className="h-4 w-4" />
              )}
              Sign in with GitHub
            </div>
          </button>
          
          {loginError && (
            <div className="mt-4 rounded-lg border border-red-900 bg-red-950/20 p-3">
              <p className="text-xs text-red-400 text-center font-mono">{loginError}</p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-[11px] leading-relaxed text-zinc-550 font-sans">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
