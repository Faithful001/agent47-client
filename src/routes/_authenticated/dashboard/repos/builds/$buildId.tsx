import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "#/lib/api";
import type { BaseResponse } from "#/types";
import type { BuildDetail, BuildStatus, IssueSeverity, LogSection, IdentifiedIssue } from "#/types/repo.type";
import {
  ArrowLeft,
  GitBranch,
  GitCommit,
  User,
  Clock,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  Loader2,
  Timer,
  AlertTriangle,
  AlertCircle,
  Info,
  Sparkles,
  Github,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import DiffViewer from "#/components/ui/diff-viewer";
import BuildLogViewer from "#/components/ui/build-log-viewer";

export const Route = createFileRoute("/_authenticated/dashboard/repos/builds/$buildId")({
  component: BuildDetailPage,
});

// --- Mock data for development ---
const MOCK_BUILD: BuildDetail = {
  id: "build-001",
  repo_id: "repo-001",
  user_id: "user-001",
  commit_title: "fix: resolve null pointer in auth middleware",
  commit_description:
    "The authentication middleware was not properly handling expired tokens, causing a null pointer exception when the token payload was undefined. This fix adds proper null checks and returns a 401 response instead of crashing.",
  commit_sha: "a1b2c3d4e5f6789012345678901234567890abcd",
  branch: "main",
  pusher: "Faithful001",
  pusher_avatar: "",
  created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  status: "failed",
  duration_ms: 42300,
  total_additions: 47,
  total_deletions: 12,
  files_changed: [
    {
      filename: "src/middleware/auth.ts",
      status: "modified",
      additions: 18,
      deletions: 5,
      hunks: [
        {
          old_start: 12,
          old_count: 15,
          new_start: 12,
          new_count: 25,
          lines: [
            {
              type: "context",
              content: "import { verifyToken } from '../lib/jwt';",
              old_line_number: 12,
              new_line_number: 12,
            },
            {
              type: "context",
              content: "import { Request, Response, NextFunction } from 'express';",
              old_line_number: 13,
              new_line_number: 13,
            },
            { type: "context", content: "", old_line_number: 14, new_line_number: 14 },
            {
              type: "deletion",
              content:
                "export async function authMiddleware(req: Request, res: Response, next: NextFunction) {",
              old_line_number: 15,
            },
            {
              type: "addition",
              content: "export async function authMiddleware(",
              new_line_number: 15,
            },
            { type: "addition", content: "  req: Request,", new_line_number: 16 },
            { type: "addition", content: "  res: Response,", new_line_number: 17 },
            { type: "addition", content: "  next: NextFunction,", new_line_number: 18 },
            { type: "addition", content: ") {", new_line_number: 19 },
            {
              type: "context",
              content: "  const token = req.headers.authorization?.split(' ')[1];",
              old_line_number: 16,
              new_line_number: 20,
            },
            { type: "context", content: "", old_line_number: 17, new_line_number: 21 },
            {
              type: "deletion",
              content: "  const payload = verifyToken(token);",
              old_line_number: 18,
            },
            { type: "deletion", content: "  req.user = payload.userId;", old_line_number: 19 },
            { type: "addition", content: "  if (!token) {", new_line_number: 22 },
            {
              type: "addition",
              content: "    return res.status(401).json({ error: 'No token provided' });",
              new_line_number: 23,
            },
            { type: "addition", content: "  }", new_line_number: 24 },
            { type: "addition", content: "", new_line_number: 25 },
            { type: "addition", content: "  try {", new_line_number: 26 },
            {
              type: "addition",
              content: "    const payload = verifyToken(token);",
              new_line_number: 27,
            },
            { type: "addition", content: "    if (!payload?.userId) {", new_line_number: 28 },
            {
              type: "addition",
              content: "      return res.status(401).json({ error: 'Invalid token payload' });",
              new_line_number: 29,
            },
            { type: "addition", content: "    }", new_line_number: 30 },
            { type: "addition", content: "    req.user = payload.userId;", new_line_number: 31 },
            { type: "addition", content: "  } catch (err) {", new_line_number: 32 },
            {
              type: "addition",
              content: "    return res.status(401).json({ error: 'Token verification failed' });",
              new_line_number: 33,
            },
            { type: "addition", content: "  }", new_line_number: 34 },
            { type: "context", content: "", old_line_number: 20, new_line_number: 35 },
            { type: "context", content: "  next();", old_line_number: 21, new_line_number: 36 },
            { type: "context", content: "}", old_line_number: 22, new_line_number: 37 },
          ],
        },
      ],
    },
    {
      filename: "src/lib/jwt.ts",
      status: "modified",
      additions: 8,
      deletions: 3,
      hunks: [
        {
          old_start: 1,
          old_count: 10,
          new_start: 1,
          new_count: 15,
          lines: [
            {
              type: "context",
              content: "import jwt from 'jsonwebtoken';",
              old_line_number: 1,
              new_line_number: 1,
            },
            { type: "context", content: "", old_line_number: 2, new_line_number: 2 },
            {
              type: "deletion",
              content: "export function verifyToken(token: string) {",
              old_line_number: 3,
            },
            {
              type: "deletion",
              content: "  return jwt.verify(token, process.env.JWT_SECRET!);",
              old_line_number: 4,
            },
            {
              type: "addition",
              content: "export function verifyToken(token: string): { userId: string } | null {",
              new_line_number: 3,
            },
            { type: "addition", content: "  try {", new_line_number: 4 },
            {
              type: "addition",
              content: "    const decoded = jwt.verify(token, process.env.JWT_SECRET!);",
              new_line_number: 5,
            },
            {
              type: "addition",
              content:
                "    if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded) {",
              new_line_number: 6,
            },
            {
              type: "addition",
              content: "      return decoded as { userId: string };",
              new_line_number: 7,
            },
            { type: "addition", content: "    }", new_line_number: 8 },
            { type: "addition", content: "    return null;", new_line_number: 9 },
            { type: "addition", content: "  } catch {", new_line_number: 10 },
            { type: "addition", content: "    return null;", new_line_number: 11 },
            { type: "addition", content: "  }", new_line_number: 12 },
            { type: "context", content: "}", old_line_number: 5, new_line_number: 13 },
          ],
        },
      ],
    },
    {
      filename: "tests/middleware/auth.test.ts",
      status: "added",
      additions: 21,
      deletions: 0,
      hunks: [
        {
          old_start: 0,
          old_count: 0,
          new_start: 1,
          new_count: 21,
          lines: [
            {
              type: "addition",
              content: "import { describe, it, expect, vi } from 'vitest';",
              new_line_number: 1,
            },
            {
              type: "addition",
              content: "import { authMiddleware } from '../../src/middleware/auth';",
              new_line_number: 2,
            },
            { type: "addition", content: "", new_line_number: 3 },
            { type: "addition", content: "describe('authMiddleware', () => {", new_line_number: 4 },
            {
              type: "addition",
              content: "  it('should return 401 when no token is provided', async () => {",
              new_line_number: 5,
            },
            {
              type: "addition",
              content: "    const req = { headers: {} } as any;",
              new_line_number: 6,
            },
            {
              type: "addition",
              content:
                "    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;",
              new_line_number: 7,
            },
            { type: "addition", content: "    const next = vi.fn();", new_line_number: 8 },
            { type: "addition", content: "", new_line_number: 9 },
            {
              type: "addition",
              content: "    await authMiddleware(req, res, next);",
              new_line_number: 10,
            },
            { type: "addition", content: "", new_line_number: 11 },
            {
              type: "addition",
              content: "    expect(res.status).toHaveBeenCalledWith(401);",
              new_line_number: 12,
            },
            {
              type: "addition",
              content: "    expect(next).not.toHaveBeenCalled();",
              new_line_number: 13,
            },
            { type: "addition", content: "  });", new_line_number: 14 },
            { type: "addition", content: "", new_line_number: 15 },
            {
              type: "addition",
              content: "  it('should call next() with valid token', async () => {",
              new_line_number: 16,
            },
            { type: "addition", content: "    // ... test implementation", new_line_number: 17 },
            { type: "addition", content: "  });", new_line_number: 18 },
            { type: "addition", content: "});", new_line_number: 19 },
          ],
        },
      ],
    },
    {
      filename: "src/types/express.d.ts",
      status: "modified",
      additions: 0,
      deletions: 4,
      hunks: [
        {
          old_start: 1,
          old_count: 8,
          new_start: 1,
          new_count: 4,
          lines: [
            {
              type: "context",
              content: "declare namespace Express {",
              old_line_number: 1,
              new_line_number: 1,
            },
            {
              type: "context",
              content: "  interface Request {",
              old_line_number: 2,
              new_line_number: 2,
            },
            { type: "deletion", content: "    user: any;", old_line_number: 3 },
            { type: "deletion", content: "    session: any;", old_line_number: 4 },
            { type: "deletion", content: "    token: string;", old_line_number: 5 },
            { type: "deletion", content: "    isAuthenticated: boolean;", old_line_number: 6 },
            { type: "addition", content: "    user?: string;", new_line_number: 3 },
            { type: "context", content: "  }", old_line_number: 7, new_line_number: 4 },
            { type: "context", content: "}", old_line_number: 8, new_line_number: 5 },
          ],
        },
      ],
    },
  ],
  log_sections: [
    {
      phase: "install",
      duration_ms: 8200,
      has_error: false,
      lines: [
        "$ npm ci",
        "npm warn deprecated inflight@1.0.6: This module is not supported",
        "added 847 packages in 8s",
        "143 packages are looking for funding",
        "  run `npm fund` for details",
      ],
    },
    {
      phase: "build",
      duration_ms: 12400,
      has_error: false,
      lines: [
        "$ tsc --noEmit",
        "$ vite build",
        "vite v7.3.1 building for production...",
        "transforming (234) src/index.ts",
        "✓ 234 modules transformed.",
        "dist/index.js   45.12 kB │ gzip: 12.34 kB",
        "✓ built in 12.4s",
      ],
    },
    {
      phase: "test",
      duration_ms: 21700,
      has_error: true,
      lines: [
        "$ vitest run",
        "",
        " RUN  v3.0.5 /app",
        "",
        " ✓ tests/utils/format.test.ts (3 tests) 12ms",
        " ✓ tests/utils/validate.test.ts (5 tests) 8ms",
        " ✓ tests/middleware/auth.test.ts (2 tests) 15ms",
        " ✗ tests/routes/api.test.ts (4 tests) 124ms",
        "",
        "  ● tests/routes/api.test.ts > GET /api/users > should return 401 for unauthenticated",
        "",
        "    FAIL  Expected: 401",
        "    Received: 500",
        "",
        "    Error: expect(received).toBe(expected)",
        "",
        "      at Object.<anonymous> (tests/routes/api.test.ts:23:31)",
        "",
        " Tests:  1 failed, 10 passed, 11 total",
        " Time:   21.7s",
      ],
    },
  ],
  fix_summary: `## Root Cause Analysis

The authentication middleware was missing null-safety checks on the JWT token verification result. When an expired or malformed token was provided, \`verifyToken()\` would throw an unhandled exception, propagating up as a **500 Internal Server Error** instead of the expected **401 Unauthorized**.

### Changes Made

1. **\`src/middleware/auth.ts\`** — Added try/catch around \`verifyToken()\` call with explicit null checks on the payload. Now returns proper 401 responses for:
   - Missing tokens
   - Invalid token payloads (missing \`userId\`)
   - Token verification failures (expired, malformed)

2. **\`src/lib/jwt.ts\`** — Changed return type from implicit \`any\` to explicit \`{ userId: string } | null\`. Now catches verification errors internally and returns \`null\` instead of throwing.

3. **\`tests/middleware/auth.test.ts\`** — Added test coverage for the null token and valid token cases.

4. **\`src/types/express.d.ts\`** — Cleaned up the Express Request type augmentation, removing unused fields.

### Remaining Issue

The test \`GET /api/users > should return 401 for unauthenticated\` is still failing because the route handler at \`src/routes/api.ts\` has its own inline auth check that doesn't use the middleware. This needs a separate fix.`,
  identified_issues: [
    {
      title: "Unhandled exception in auth middleware",
      description:
        "verifyToken() throws on invalid tokens but the middleware had no try/catch, causing 500 errors for expired sessions.",
      severity: "critical",
      file: "src/middleware/auth.ts",
      line: 18,
    },
    {
      title: "Unsafe type assertion on JWT payload",
      description:
        "The decoded JWT was used without type checking, assuming userId always exists. Could produce undefined user IDs.",
      severity: "warning",
      file: "src/lib/jwt.ts",
      line: 4,
    },
    {
      title: "Inline auth check in API route bypasses middleware",
      description:
        "The GET /api/users route has its own auth check that doesn't use authMiddleware, causing the test to still fail.",
      severity: "info",
      file: "src/routes/api.ts",
      line: 23,
    },
  ],
};

// --- Helpers ---

function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

const statusConfig: Record<
  BuildStatus,
  {
    label: string;
    icon: typeof CheckCircle2;
    bg: string;
    text: string;
    border: string;
    dot: string;
  }
> = {
  success: {
    label: "Build Passed",
    icon: CheckCircle2,
    bg: "bg-emerald-950/40",
    text: "text-emerald-400",
    border: "border-emerald-900/60",
    dot: "bg-emerald-500",
  },
  failed: {
    label: "Build Failed",
    icon: XCircle,
    bg: "bg-red-950/40",
    text: "text-red-400",
    border: "border-red-900/60",
    dot: "bg-red-500",
  },
  in_progress: {
    label: "Building...",
    icon: Loader2,
    bg: "bg-blue-950/40",
    text: "text-blue-400",
    border: "border-blue-900/60",
    dot: "bg-blue-500",
  },
  pending: {
    label: "Pending",
    icon: Timer,
    bg: "bg-amber-950/40",
    text: "text-amber-400",
    border: "border-amber-900/60",
    dot: "bg-amber-500",
  },
};

const severityConfig: Record<
  IssueSeverity,
  { icon: typeof AlertCircle; bg: string; text: string; border: string; badge: string }
> = {
  critical: {
    icon: XCircle,
    bg: "bg-red-950/40",
    text: "text-red-400",
    border: "border-red-900/60",
    badge: "bg-red-950 border border-red-900 text-red-400 font-mono text-[9px] uppercase tracking-wide",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-950/40",
    text: "text-amber-400",
    border: "border-amber-900/60",
    badge: "bg-amber-950 border border-amber-900 text-amber-400 font-mono text-[9px] uppercase tracking-wide",
  },
  info: {
    icon: Info,
    bg: "bg-blue-950/40",
    text: "text-blue-400",
    border: "border-blue-900/60",
    badge: "bg-blue-950 border border-blue-900 text-blue-400 font-mono text-[9px] uppercase tracking-wide",
  },
};

type TabId = "changes" | "logs" | "summary";

function normalizeStatus(status: string | undefined): BuildStatus {
  if (!status) return "failed";
  const s = status.toLowerCase();
  if (s === "success" || s === "passed" || s === "pass") return "success";
  if (s === "failed" || s === "error" || s === "fail" || s === "failure") return "failed";
  if (s === "in_progress" || s === "building" || s === "running") return "in_progress";
  return "pending";
}

function parseIssuesFromLogs(logSections: LogSection[] | undefined): IdentifiedIssue[] {
  if (!logSections) return [];
  const parsed: IdentifiedIssue[] = [];
  logSections.forEach((section) => {
    if (!section.has_error) return;
    section.lines.forEach((line) => {
      // TypeScript error parsing
      const tsMatch = line.match(/^([^\(]+)\((\d+),(\d+)\):\s*error\s+(\w+):\s*(.*)$/);
      if (tsMatch) {
        parsed.push({
          title: `TypeScript Error ${tsMatch[4]}`,
          description: tsMatch[5],
          severity: "critical",
          file: tsMatch[1].trim(),
          line: parseInt(tsMatch[2]),
        });
        return;
      }

      // Fallback for execution errors/exceptions
      if (/error|failed/i.test(line) && line.length > 10 && !/npm ERR/i.test(line)) {
        parsed.push({
          title: "Execution Error",
          description: line.trim(),
          severity: "critical",
        });
      }
    });
  });
  return parsed;
}

function BuildDetailPage() {
  const { buildId } = Route.useParams();
  const [activeTab, setActiveTab] = useState<TabId>("changes");
  const [shaCopied, setShaCopied] = useState(false);

  // Real API call — falls back to mock for now
  const {
    data: build,
    isLoading,
    error,
  } = useQuery<BuildDetail>({
    queryKey: ["build", buildId],
    queryFn: async () => {
      try {
        const { data } = await api.get<BaseResponse<BuildDetail>>(`/builds/${buildId}`);
        return data.data;
      } catch {
        // Fall back to mock data during development
        return MOCK_BUILD;
      }
    },
  });

  const copySha = async (sha: string) => {
    await navigator.clipboard.writeText(sha);
    setShaCopied(true);
    setTimeout(() => setShaCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-5 w-5 animate-spin text-zinc-550" />
      </div>
    );
  }

  if (error && !build) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-xs font-mono text-red-450">
          Failed to load build details. Please try again.
        </div>
      </div>
    );
  }

  if (!build) return null;

  const normalizedStatus = normalizeStatus(build.status);

  // Parse issues from log sections if server returned null/empty
  const finalIssues =
    build.identified_issues && build.identified_issues.length > 0
      ? build.identified_issues
      : parseIssuesFromLogs(build.log_sections);

  // Create a recommendation summary if none is available in build payload
  let finalSummary = build.fix_summary;
  if (!finalSummary && finalIssues.length > 0) {
    finalSummary = `## Recommended Action\n\nResolve the following compilation issues detected in the logs:\n\n${finalIssues
      .map(
        (issue) =>
          `### ${issue.title}\n- **File**: \`${issue.file}${issue.line ? `:${issue.line}` : ""}\`\n- **Details**: ${issue.description}`,
      )
      .join("\n\n")}`;
  }

  // Create detail view using real build payload values
  const mergedBuild: BuildDetail = {
    ...build,
    status: normalizedStatus,
    files_changed: build.files_changed || [],
    log_sections: build.log_sections || [],
    identified_issues: finalIssues,
    fix_summary: finalSummary || "No AI analysis summary generated for this build.",
    total_additions: build.total_additions ?? 0,
    total_deletions: build.total_deletions ?? 0,
  };

  const status = statusConfig[mergedBuild.status];
  const StatusIcon = status?.icon || XCircle;

  const tabs: { id: TabId; label: string; count?: number }[] = [
    { id: "changes", label: "Changes", count: mergedBuild.files_changed?.length },
    { id: "logs", label: "Build Log" },
    { id: "summary", label: "AI Summary" },
  ];

  return (
    <div className="mx-auto max-w-6xl pb-16">
      {/* Back navigation */}
      <Link
        to="/dashboard/repos/$repoId"
        params={{ repoId: mergedBuild.repo_id }}
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 no-underline transition hover:text-zinc-200"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to deployments
      </Link>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-zinc-100 sm:text-2xl font-sans">
          {mergedBuild.commit_title}
        </h1>
        {mergedBuild.commit_description && (
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400 font-sans">
            {mergedBuild.commit_description}
          </p>
        )}

        {/* Meta row */}
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-400">
          {/* Commit SHA */}
          <button
            onClick={() => copySha(mergedBuild.commit_sha)}
            className="inline-flex items-center gap-1.5 rounded-md bg-zinc-800 border border-zinc-700 px-2 py-1 font-mono text-xs text-zinc-300 transition hover:bg-zinc-700 hover:text-zinc-100"
            title={mergedBuild.commit_sha}
          >
            <GitCommit className="h-3.5 w-3.5" />
            {mergedBuild.commit_sha.slice(0, 7)}
            {shaCopied ? (
              <Check className="h-3 w-3 text-emerald-400" />
            ) : (
              <Copy className="h-3 w-3 text-zinc-500" />
            )}
          </button>

          {/* Branch */}
          <span className="inline-flex items-center gap-1.5">
            <GitBranch className="h-3.5 w-3.5" />
            <span className="rounded-md bg-zinc-800 border border-zinc-750 px-2 py-0.5 font-mono text-xs text-zinc-300">
              {mergedBuild.branch}
            </span>
          </span>

          {/* Author */}
          <span className="inline-flex items-center gap-1.5">
            {mergedBuild.pusher_avatar ? (
              <img
                src={mergedBuild.pusher_avatar}
                alt={mergedBuild.pusher}
                className="h-4 w-4 rounded-full"
              />
            ) : (
              <User className="h-3.5 w-3.5 text-zinc-400" />
            )}
            {mergedBuild.pusher}
          </span>

          {/* Time */}
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {relativeTime(mergedBuild.created_at)}
            <span className="text-zinc-550 font-mono">
              ({new Date(mergedBuild.created_at).toLocaleString()})
            </span>
          </span>

          {/* Duration */}
          {mergedBuild.duration_ms != null && (
            <span className="inline-flex items-center gap-1.5">
              <Timer className="h-3.5 w-3.5" />
              {formatDuration(mergedBuild.duration_ms)}
            </span>
          )}
        </div>
      </div>

      {/* Status banner */}
      <div
        className={`mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border px-5 py-3.5 bg-zinc-900 border-zinc-800 ${status?.text}`}
      >
        <div className="flex items-center gap-3">
          <StatusIcon
            className={`h-5 w-5 ${status?.text} ${mergedBuild.status === "in_progress" ? "animate-spin" : ""}`}
          />
          <span className="text-sm font-semibold">{status?.label}</span>
          {mergedBuild.status === "failed" && mergedBuild.identified_issues?.length > 0 && (
            <span className="text-xs text-red-400 font-mono">
              — {mergedBuild.identified_issues.filter((i) => i.severity === "critical").length}{" "}
              critical issue
              {mergedBuild.identified_issues.filter((i) => i.severity === "critical").length !== 1
                ? "s"
                : ""}{" "}
              found
            </span>
          )}
        </div>

        {mergedBuild.pr_url && (
          <a
            href={mergedBuild.pr_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600 px-3 py-1.5 text-xs font-mono text-zinc-100 font-semibold no-underline transition"
          >
            <Github className="h-3.5 w-3.5 text-zinc-200" />
            View Fix Suggestions
            <ExternalLink className="h-3 w-3 text-zinc-400" />
          </a>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-6 flex space-x-1 border-b border-zinc-800">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`relative flex items-center gap-1.5 px-4 pb-3 pt-1 text-sm font-medium transition-colors ${
              activeTab === tab?.id
                ? "border-b-2 border-white text-zinc-100 font-semibold"
                : "border-b-2 border-transparent text-zinc-400 hover:border-zinc-800 hover:text-zinc-200"
            }`}
          >
            {tab?.id === "summary" && <Sparkles className="h-3.5 w-3.5" />}
            {tab?.label}
            {tab?.count != null && (
              <span
                className={`rounded-full border px-1.5 py-0.5 text-[10px] font-semibold font-mono ${
                  activeTab === tab?.id
                    ? "bg-zinc-800 text-white border-zinc-700"
                    : "bg-zinc-800/40 text-zinc-450 border-zinc-800"
                }`}
              >
                {tab?.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "changes" && (
        <DiffViewer
          files={mergedBuild.files_changed}
          totalAdditions={mergedBuild.total_additions}
          totalDeletions={mergedBuild.total_deletions}
        />
      )}

      {activeTab === "logs" && <BuildLogViewer sections={mergedBuild.log_sections} />}

      {activeTab === "summary" && (
        <div className="space-y-6">
          {/* Issues list */}
          {mergedBuild.identified_issues?.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-zinc-250 font-sans">
                Identified Issues ({mergedBuild.identified_issues.length})
              </h3>
              {mergedBuild.identified_issues.map((issue, i) => {
                const sev = severityConfig[issue.severity];
                const SevIcon = sev?.icon || AlertCircle;
                return (
                  <div key={i} className={`rounded-xl border p-4 ${sev?.bg} ${sev?.border}`}>
                    <div className="flex items-start gap-3">
                      <SevIcon className={`mt-0.5 h-4 w-4 shrink-0 ${sev?.text}`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-sm font-semibold ${sev?.text} font-sans`}>{issue.title}</h4>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${sev?.badge}`}
                          >
                            {issue.severity}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-zinc-300 leading-relaxed font-sans">{issue.description}</p>
                        {issue.file && (
                          <p className="mt-2 font-mono text-xs text-zinc-500">
                            {issue.file}
                            {issue.line != null && `:${issue.line}`}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* AI Summary */}
          {mergedBuild.fix_summary && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
              <div className="flex items-center gap-2 border-b border-zinc-800 px-5 py-3">
                <Sparkles className="h-4 w-4 text-white" />
                <h3 className="text-sm font-semibold text-zinc-150 font-sans">Agent47 Analysis</h3>
              </div>
              <div className="px-5 py-4">
                <MarkdownRenderer content={mergedBuild.fix_summary} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Simple markdown renderer for the AI summary. Handles headers, code blocks, bold, lists. */
function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines?.length) {
    const line = lines[i];

    // Code block
    if (line?.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines?.length && !lines[i]?.startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <pre
          key={key++}
          className="overflow-x-auto rounded-lg bg-zinc-950 border border-zinc-800 p-4 font-mono text-xs text-zinc-300 my-3"
        >
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
      continue;
    }

    // Heading
    if (line?.startsWith("### ")) {
      elements.push(
        <h4 key={key++} className="mb-2 mt-5 text-sm font-bold text-zinc-100 font-sans">
          {renderInline(line?.slice(4))}
        </h4>
      );
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      elements.push(
        <h3 key={key++} className="mb-2 mt-6 text-base font-bold text-zinc-150 font-sans">
          {renderInline(line.slice(3))}
        </h3>
      );
      i++;
      continue;
    }

    // List item
    if (/^\d+\.\s/.test(line) || line.startsWith("- ")) {
      const listItems: string[] = [];
      const isOrdered = /^\d+\.\s/.test(line);
      while (
        i < lines.length &&
        (isOrdered ? /^\d+\.\s/.test(lines[i]) : lines[i].startsWith("- "))
      ) {
        listItems.push(isOrdered ? lines[i].replace(/^\d+\.\s/, "") : lines[i].slice(2));
        i++;
      }
      const Tag = isOrdered ? "ol" : "ul";
      elements.push(
        <Tag
          key={key++}
          className={`my-2 space-y-1.5 pl-5 ${isOrdered ? "list-decimal" : "list-disc"} text-zinc-400 text-xs font-sans`}
        >
          {listItems.map((item, j) => (
            <li key={j}>
              {renderInline(item)}
            </li>
          ))}
        </Tag>
      );
      continue;
    }

    // Blank line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph
    elements.push(
      <p key={key++} className="my-2 text-xs leading-relaxed text-zinc-400 font-sans">
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return <>{elements}</>;
}

/** Render inline markdown: bold, code, links */
function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let partKey = 0;

  while (remaining.length > 0) {
    const codeIdx = remaining.indexOf("`");
    const boldIdx = remaining.indexOf("**");

    if (codeIdx === -1 && boldIdx === -1) {
      parts.push(remaining);
      break;
    }

    const nextIdx =
      codeIdx === -1 ? boldIdx : boldIdx === -1 ? codeIdx : Math.min(codeIdx, boldIdx);

    if (nextIdx > 0) {
      parts.push(remaining.slice(0, nextIdx));
      remaining = remaining.slice(nextIdx);
    }

    if (remaining.startsWith("`")) {
      const end = remaining.indexOf("`", 1);
      if (end === -1) {
        parts.push(remaining);
        break;
      }
      parts.push(
        <code
          key={partKey++}
          className="rounded bg-zinc-800 border border-zinc-750 px-1 py-0.5 font-mono text-xs text-zinc-200"
        >
          {remaining.slice(1, end)}
        </code>
      );
      remaining = remaining.slice(end + 1);
    } else if (remaining.startsWith("**")) {
      const end = remaining.indexOf("**", 2);
      if (end === -1) {
        parts.push(remaining);
        break;
      }
      parts.push(
        <strong key={partKey++} className="font-semibold text-zinc-100">
          {remaining.slice(2, end)}
        </strong>
      );
      remaining = remaining.slice(end + 2);
    }
  }

  return parts;
}
