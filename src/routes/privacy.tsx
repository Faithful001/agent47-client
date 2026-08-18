import { createFileRoute, Link } from "@tanstack/react-router";
import { Bug, ArrowLeft, ShieldCheck, Lock, Eye, Server, RefreshCw } from "lucide-react";
import { useAuthStore } from "../store/auth";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const effectiveDate = "February 18, 2026";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3 no-underline group">
            <img
              src="/agent47logo%20horizontal.png"
              alt="Agent47 Logo"
              className="h-8 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 no-underline transition hover:text-zinc-100 sm:text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            {isAuthenticated ? (
              <a
                href="/dashboard"
                className="ml-2 inline-flex items-center gap-2 rounded-lg bg-zinc-800 px-3.5 py-1.5 text-xs font-semibold text-zinc-100 no-underline transition hover:bg-zinc-700 sm:text-sm"
              >
                Dashboard
              </a>
            ) : (
              <Link
                to="/login"
                className="ml-2 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-950 no-underline transition hover:bg-zinc-200 sm:text-sm"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
        {/* Header Header */}
        <div className="mb-12 border-b border-zinc-800/80 pb-8">
          <h1 className="m-0 text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            Effective Date: <span className="text-zinc-200 font-medium">{effectiveDate}</span>
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-400">
            Agent47 (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to
            protecting your privacy and ensuring the security of your codebase and personal
            information. This Privacy Policy outlines how we collect, use, process, and protect your
            data when you use our autonomous AI code review platform.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-10 text-sm leading-relaxed text-zinc-300">
          {/* Section 1 */}
          <section className="rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-6 sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-zinc-200">
                <Eye className="h-4 w-4" />
              </div>
              <h2 className="m-0 text-lg font-semibold text-zinc-100">1. Information We Collect</h2>
            </div>
            <div className="space-y-3 pl-0 sm:pl-11 text-zinc-400">
              <p>
                To provide autonomous code review services, we collect and process specific types of
                information:
              </p>
              <ul className="list-disc space-y-2 pl-5 text-zinc-300">
                <li>
                  <strong className="text-zinc-200">GitHub Account Information:</strong> When you
                  sign in with GitHub OAuth, we receive your GitHub username, public profile info,
                  primary email address, and account avatar.
                </li>
                <li>
                  <strong className="text-zinc-200">Repository & Pull Request Metadata:</strong>{" "}
                  When you connect repositories, we process repository names, pull request diffs,
                  branch details, commit hashes, and commit messages required to perform automated
                  code analysis.
                </li>
                <li>
                  <strong className="text-zinc-200">Operational & Diagnostic Data:</strong> Log data
                  regarding API responses, review execution latency, error reports, and token usage
                  to ensure system stability and performance.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-6 sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-zinc-200">
                <Server className="h-4 w-4" />
              </div>
              <h2 className="m-0 text-lg font-semibold text-zinc-100">
                2. How We Use Your Information
              </h2>
            </div>
            <div className="space-y-3 pl-0 sm:pl-11 text-zinc-400">
              <p>We use the collected information solely for the following purposes:</p>
              <ul className="list-disc space-y-2 pl-5 text-zinc-300">
                <li>
                  Performing automated AI code reviews, identifying bugs, security vulnerabilities,
                  and code quality issues.
                </li>
                <li>
                  Posting contextual review comments and suggestions directly to your GitHub pull
                  requests.
                </li>
                <li>
                  Displaying code review statistics, history, and repository status in your Agent47
                  dashboard.
                </li>
                <li>
                  Authenticating your account and authorizing access to your connected GitHub
                  repositories.
                </li>
                <li>
                  Diagnosing technical issues, maintaining uptime, and optimizing analysis latency.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-6 sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-zinc-200">
                <Lock className="h-4 w-4" />
              </div>
              <h2 className="m-0 text-lg font-semibold text-zinc-100">
                3. Code Privacy & Data Protection
              </h2>
            </div>
            <div className="space-y-3 pl-0 sm:pl-11 text-zinc-400">
              <p className="text-zinc-300 font-medium">
                Your code belongs to you. We maintain strict safeguards over your codebase:
              </p>
              <ul className="list-disc space-y-2 pl-5 text-zinc-300">
                <li>
                  <strong className="text-zinc-200">No Model Training on Private Code:</strong> We
                  do not train foundation AI models on your private source code.
                </li>
                <li>
                  <strong className="text-zinc-200">Encryption:</strong> All data transmitted
                  between your browser, our servers, GitHub, and AI inference APIs is encrypted
                  using industry-standard TLS (HTTPS). Sensitive tokens are stored securely with
                  strong encryption.
                </li>
                <li>
                  <strong className="text-zinc-200">Ephemerality:</strong> Pull request diffs and
                  source code snippets are processed in real-time for code reviews and are not
                  permanently cached or sold to any third party.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-6 sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-zinc-200">
                <RefreshCw className="h-4 w-4" />
              </div>
              <h2 className="m-0 text-lg font-semibold text-zinc-100">
                4. Third-Party Services & Integrations
              </h2>
            </div>
            <div className="space-y-3 pl-0 sm:pl-11 text-zinc-400">
              <p>
                Agent47 interacts with trusted third-party providers strictly to provide our
                services:
              </p>
              <ul className="list-disc space-y-2 pl-5 text-zinc-300">
                <li>
                  <strong className="text-zinc-200">GitHub (GitHub API & Webhooks):</strong> To
                  receive pull request events and post review comments.
                </li>
                <li>
                  <strong className="text-zinc-200">AI Infrastructure Providers:</strong> Secure LLM
                  API endpoints used for synthesizing code feedback and detecting potential defects.
                </li>
                <li>
                  <strong className="text-zinc-200">Hosting & Database Infrastructure:</strong>{" "}
                  Secure cloud infrastructure to manage sessions and dashboard settings.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section className="rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-6 sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-zinc-200">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h2 className="m-0 text-lg font-semibold text-zinc-100">
                5. Your Rights & Data Deletion
              </h2>
            </div>
            <div className="space-y-3 pl-0 sm:pl-11 text-zinc-400">
              <p>You retain full control over your data:</p>
              <ul className="list-disc space-y-2 pl-5 text-zinc-300">
                <li>
                  You can disconnect any repository or revoke webhook access at any time through
                  your dashboard.
                </li>
                <li>
                  You can revoke Agent47 OAuth authorization directly in your GitHub account
                  settings.
                </li>
                <li>
                  You may request complete deletion of your account and associated review history by
                  reaching out to us.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section className="rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-6 sm:p-8">
            <h2 className="m-0 text-lg font-semibold text-zinc-100 mb-3">6. Contact & Updates</h2>
            <div className="space-y-3 text-zinc-400">
              <p>
                We may periodically update this Privacy Policy as new features are introduced. Any
                updates will be reflected on this page with an updated Effective Date.
              </p>
              <p>
                If you have questions or feedback regarding our privacy practices, please contact us
                or open an issue on our GitHub repository:
              </p>
              <a
                href="https://github.com/Faithful001/agent47"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-zinc-200 underline hover:text-white transition"
              >
                https://github.com/Faithful001/agent47
              </a>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950 py-10 mt-16">
        <div className="mx-auto max-w-5xl px-6">
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
                href="https://github.com/Faithful001/agent47"
                target="_blank"
                rel="noreferrer"
                className="no-underline transition hover:text-zinc-300"
              >
                GitHub
              </a>
              <Link
                to="/privacy"
                className="no-underline transition text-zinc-400 hover:text-zinc-200"
              >
                Privacy
              </Link>
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
    </div>
  );
}
