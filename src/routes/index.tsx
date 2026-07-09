import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuthStore } from "../store/auth";
import { Bug, GitBranch, Shield, Zap, ArrowRight, Check } from "lucide-react";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function NavBar({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center no-underline">
          <img
            src="/agent47logo%20horizontal.png"
            alt="Agent47 Logo"
            className="h-8 w-auto object-contain"
          />
        </Link>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <a
              href="/dashboard"
              id="nav-dashboard-cta"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-950 no-underline transition hover:bg-zinc-200"
            >
              Dashboard
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          ) : (
            <>
              <Link
                to="/login"
                id="nav-signin-link"
                className="text-sm font-medium text-zinc-400 no-underline transition hover:text-zinc-100"
              >
                Sign in
              </Link>
              <Link
                to="/login"
                id="nav-get-started-cta"
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-950 no-underline transition hover:bg-zinc-200"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function HeroSection({ isAuthenticated: _isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-zinc-950">
      {/* Dot grid. fades at bottom and horizontal edges */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.13) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 90% 70% at 50% 20%, black 30%, transparent 100%)",
        }}
      />
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Badge pill */}
          <div className="fade-up mb-8 inline-flex items-center gap-2.5 rounded-full border border-zinc-800 bg-zinc-900/80 px-3.5 py-1.5 shadow-sm">
            <span className="badge-dot inline-block h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-zinc-400">
              <span className="text-zinc-300">Autonomous AI code reviews</span>
            </span>
          </div>

          {/* Headline */}
          <h1 className="m-0 text-5xl font-bold leading-[1.08] tracking-tight text-zinc-50 sm:text-6xl lg:text-7xl">
            Catch bugs before
            <br />
            <span className="">your users do.</span>
          </h1>

          {/* Subtext */}
          <p className="fade-up fade-up-delay-2 mt-7 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Agent47 reviews every pull request with deep AI analysis, catching bugs, security
            issues, and style violations before they reach production.
          </p>

          {/* CTA row */}
          <div className="fade-up fade-up-delay-3 mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/login"
              id="hero-get-started-cta"
              className="inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-950 no-underline transition hover:bg-zinc-200 active:scale-[0.98]"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#how-it-works"
              id="hero-how-it-works-link"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 no-underline transition hover:text-zinc-100"
            >
              See how it works
            </a>
          </div>

          {/* Trust micro-copy */}
          <p className="fade-up fade-up-delay-4 mt-6 flex items-center justify-center gap-1.5 text-xs text-zinc-600">
            <Check className="h-3.5 w-3.5 text-emerald-600" />
            Free for open-source projects · No credit card required
          </p>
        </div>
      </div>
    </section>
  );
}

function LogoStrip() {
  const companies = [
    "Stripe",
    "Vercel",
    "Linear",
    "Planetscale",
    "Resend",
    "Supabase",
    "Clerk",
    "Neon",
    "Fly.io",
    "Railway",
  ];
  // Duplicate for seamless loop
  const items = [...companies, ...companies];

  return (
    <section className="border-y border-zinc-800/50 bg-zinc-950 py-10 overflow-hidden">
      <p className="mb-6 text-center text-xs font-medium uppercase tracking-widest text-zinc-600">
        Trusted by engineering teams at
      </p>
      <div className="relative">
        {/* Left + right fade masks */}
        <div
          className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24"
          style={{
            background: "linear-gradient(to right, #09090b, transparent)",
          }}
        />
        <div
          className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24"
          style={{
            background: "linear-gradient(to left, #09090b, transparent)",
          }}
        />
        <div className="marquee-track">
          {items.map((name, i) => (
            <div
              key={i}
              className="mx-8 flex-shrink-0 text-sm font-semibold text-zinc-600 transition hover:text-zinc-400"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    step: "01",
    icon: GitBranch,
    title: "Connect Your Repos",
    desc: "Link your GitHub repositories in seconds. Agent47 automatically activates on every new pull request, no config needed.",
  },
  {
    step: "02",
    icon: Bug,
    title: "Deep Code Analysis",
    desc: "AI reads your diff, understands context, and surfaces bugs, logic errors, and potential regressions line by line.",
  },
  {
    step: "03",
    icon: Shield,
    title: "Security & Best Practices",
    desc: "Detects common vulnerabilities, exposed secrets, insecure patterns, and deviations from your team's coding standards.",
  },
  {
    step: "04",
    icon: Zap,
    title: "Actionable Feedback",
    desc: "Comments are concise, prioritized, and include suggested fixes — so reviewers spend less time and merge with confidence.",
  },
];

function FeaturesSection() {
  return (
    <section id="how-it-works" className="bg-zinc-950 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="mb-14 max-w-lg">
          <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-600">
            How it works
          </p>
          <h2 className="m-0 text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            From open PR to merged,
            <br />
            <span className="text-zinc-500">every line reviewed.</span>
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ step, icon: Icon, title, desc }) => (
            <div
              key={title}
              className="feature-card rounded-xl border border-zinc-800 bg-zinc-900 p-6"
            >
              {/* Step number */}
              <p className="m-0 mb-5 font-mono text-[10px] font-semibold text-zinc-700">{step}</p>
              {/* Icon */}
              <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800">
                <Icon className="h-4 w-4 text-zinc-300" strokeWidth={1.8} />
              </div>
              <h3 className="m-0 mb-2 text-sm font-semibold text-zinc-100">{title}</h3>
              <p className="m-0 text-sm leading-relaxed text-zinc-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const stats = [
  { value: "50k+", label: "PRs reviewed" },
  { value: "3.2x", label: "Faster review cycles" },
  { value: "94%", label: "Issues caught pre-merge" },
];

function StatsSection() {
  return (
    <section className="border-y border-zinc-800 bg-zinc-900/40 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 sm:grid-cols-3">
          {stats.map(({ value, label }, i) => (
            <div
              key={label}
              className={`text-center ${i < stats.length - 1 ? "sm:border-r sm:border-zinc-800" : ""}`}
            >
              <p className="m-0 text-4xl font-bold tracking-tight text-zinc-50 sm:text-5xl">
                {value}
              </p>
              <p className="m-0 mt-2 text-sm text-zinc-500">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <section className="bg-zinc-950 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 px-8 py-16 text-center shadow-2xl shadow-black/40">
          {/* Glow backdrop */}
          <div
            className="pointer-events-none absolute left-1/2 top-0 -z-0 h-56 w-96 -translate-x-1/2 -translate-y-1/2"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 70%)",
            }}
          />

          <h2 className="relative m-0 text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            Better reviews. <span className="text-zinc-500">Fewer bugs in prod.</span>
          </h2>
          <p className="relative mx-auto mt-5 max-w-md text-base text-zinc-400">
            Connect your repositories and let Agent47 review every PR automatically.
          </p>

          <div className="relative mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            {isAuthenticated ? (
              <a
                href="/dashboard"
                id="cta-dashboard-btn"
                className="inline-flex items-center gap-2.5 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-zinc-950 no-underline transition hover:bg-zinc-200 active:scale-[0.98]"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </a>
            ) : (
              <>
                <Link
                  to="/login"
                  id="cta-get-started-btn"
                  className="inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 no-underline transition hover:bg-zinc-200 active:scale-[0.98]"
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <p className="m-0 text-xs text-zinc-600">
                  Free for open-source · No credit card required
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function LandingFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-800">
              <Bug className="h-3.5 w-3.5 text-zinc-300" strokeWidth={2} />
            </div>
            <span className="text-sm font-semibold text-zinc-400">Agent47</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-xs text-zinc-600">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="no-underline transition hover:text-zinc-300"
            >
              GitHub
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              className="no-underline transition hover:text-zinc-300"
            >
              Twitter
            </a>
            <a href="#" className="no-underline transition hover:text-zinc-300">
              Docs
            </a>
            <a href="#" className="no-underline transition hover:text-zinc-300">
              Privacy
            </a>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <span className="status-dot inline-block h-2 w-2 rounded-full bg-emerald-500" />
            All systems operational
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-800/60 pt-6 text-xs text-zinc-700">
          © {new Date().getFullYear()} Agent47. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

/* ─── Main page ─── */
function LandingPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <NavBar isAuthenticated={isAuthenticated} />
      <HeroSection isAuthenticated={isAuthenticated} />
      <LogoStrip />
      <FeaturesSection />
      <StatsSection />
      <CTASection isAuthenticated={isAuthenticated} />
      <LandingFooter />
    </div>
  );
}
