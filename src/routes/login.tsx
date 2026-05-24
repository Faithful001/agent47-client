import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { api } from "../lib/api";
import type { BaseResponse } from "../types";
import { useAuthStore } from "../store/auth";
import { Bug, Github, Loader2 } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, navigate]);

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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl border border-slate-100">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 shadow-sm">
            <Bug className="h-8 w-8 text-emerald-400" strokeWidth={2} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to your account to continue to Agent47
          </p>
        </div>

        <div className="mt-8">
          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="group relative flex w-full justify-center rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <div className="flex items-center gap-2">
              {isLoggingIn ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Github className="h-5 w-5" />
              )}
              Sign in with GitHub
            </div>
          </button>
          
          {loginError && (
            <div className="mt-4 rounded-md bg-red-50 p-3">
              <p className="text-sm text-red-500 text-center">{loginError}</p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
