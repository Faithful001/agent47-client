import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { api } from "../lib/api";
import { useAuthStore } from "../store/auth";
import { Bug, GitBranch, Shield, Zap, Github, Loader2, ArrowRight, Check } from "lucide-react";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const { data } = await api.get<{ url: string }>("/auth/login");
      window.location.href = data.url;
    } catch {
      setLoginError("Failed to start login. Please try again.");
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Bug className="h-5 w-5 text-slate-900" strokeWidth={2} />
            <span className="text-lg font-semibold tracking-tight text-slate-900">Agent47</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <a
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white no-underline transition hover:bg-slate-800"
              >
                Dashboard
                <ArrowRight className="h-4 w-4" />
              </a>
            ) : (
              <button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoggingIn ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Github className="h-4 w-4" />
                )}
                Sign in with GitHub
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32 lg:py-40">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-slate-600">Autonomous bug resolution</span>
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Bugs get fixed.
              <br />
              <span className="text-slate-400">You ship features.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-500">
              Agent47 monitors your repositories, detects issues, and autonomously generates
              verified fixes — so your team can focus on what matters.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="inline-flex cursor-pointer items-center gap-2.5 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoggingIn ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Github className="h-4 w-4" />
                )}
                Login with GitHub
              </button>
              <span className="text-sm text-slate-400">Free for open-source projects</span>
            </div>
            {loginError && <p className="mt-4 text-sm text-red-500">{loginError}</p>}
          </div>
        </div>
        {/* Subtle grid background */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage: "radial-gradient(circle, #e2e8f0 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, black, transparent)",
          }}
        />
      </section>

      {/* Features */}
      <section className="border-t border-slate-100 bg-slate-50/50">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="mb-12 max-w-xl">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
              How it works
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              From detection to deployment, fully automated.
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: GitBranch,
                title: "Repository Sync",
                desc: "Connect your GitHub repos in one click. Agent47 watches for new issues and failing tests.",
              },
              {
                icon: Bug,
                title: "Issue Detection",
                desc: "Intelligent triage identifies actionable bugs and prioritizes by severity and impact.",
              },
              {
                icon: Zap,
                title: "Autonomous Fixes",
                desc: "AI generates targeted patches, runs your test suite, and validates the fix before submission.",
              },
              {
                icon: Shield,
                title: "Verified PRs",
                desc: "Every fix is submitted as a pull request with full context, diffs, and test results.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl border border-slate-200 bg-white p-6 transition hover:border-slate-300"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                  <Icon className="h-5 w-5 text-slate-700" strokeWidth={1.8} />
                </div>
                <h3 className="mb-2 text-sm font-semibold text-slate-900">{title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof / stats */}
      <section className="border-t border-slate-100">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { value: "10k+", label: "Bugs resolved" },
              { value: "98%", label: "Fix accuracy" },
              { value: "<5min", label: "Avg. resolution time" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-bold text-slate-900">{value}</p>
                <p className="mt-1 text-sm text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-100 bg-slate-900">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Stop triaging. Start shipping.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-slate-400">
            Connect your repositories and let Agent47 handle the rest.
          </p>
          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoggingIn ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Github className="h-4 w-4" />
            )}
            Get Started
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Bug className="h-4 w-4" />
            <span>Agent47</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-300">
            <Check className="h-3 w-3" />
            <span>All systems operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
