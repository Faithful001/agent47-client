import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../lib/api";
import type { BaseResponse } from "../../../types";
import { GitBranch, CheckCircle2, XCircle, Loader2, Plus, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

type TrackedRepo = {
  id: number;
  name: string;
  full_name: string;
  is_active: boolean;
};

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: DashboardPage,
});

function DashboardPage() {
  const {
    data: repos,
    isLoading,
    error,
  } = useQuery<TrackedRepo[]>({
    queryKey: ["repos", "tracked"],
    queryFn: async () => {
      const { data } = await api.get<BaseResponse<TrackedRepo[]>>("/repos/tracked");
      return data.data;
    },
  });

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100 font-sans">Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-400 font-sans">
            Monitor and manage your tracked repositories.
          </p>
        </div>
        <Link
          to="/dashboard/repos/add"
          className="inline-flex items-center gap-1.5 rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 px-4 py-2 text-xs font-semibold font-mono tracking-wide shadow-sm no-underline transition"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Repos
        </Link>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-900 bg-red-950/40 p-4 text-xs font-mono text-red-455">
          Failed to load repositories. Please try again.
        </div>
      )}

      {/* Empty state */}
      {repos && repos.length === 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 py-16 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800">
            <GitBranch className="h-6 w-6 text-zinc-500" strokeWidth={1.5} />
          </div>
          <h3 className="text-sm font-semibold text-zinc-100 font-sans">No repositories tracked</h3>
          <p className="mt-1 text-sm text-zinc-400 font-sans">
            Connect your first repository to get started.
          </p>
          <Link
            to="/dashboard/repos/add"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-200 font-mono no-underline hover:text-white hover:underline"
          >
            Add repositories
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* Repos grid */}
      {repos && repos.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {repos.map((repo) => (
            <Link
              to="/dashboard/repos/$repoId"
              params={{ repoId: repo.id.toString() }}
              key={repo.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-zinc-700 hover:shadow-lg no-underline block"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800">
                  <GitBranch className="h-4 w-4 text-zinc-400" strokeWidth={1.8} />
                </div>
                {repo.is_active ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/50 border border-emerald-900/60 px-2 py-0.5 text-[10px] font-semibold font-mono text-emerald-400">
                    <CheckCircle2 className="h-2.5 w-2.5" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800 border border-zinc-700 px-2 py-0.5 text-[10px] font-semibold font-mono text-zinc-400">
                    <XCircle className="h-2.5 w-2.5" />
                    Inactive
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-zinc-100 font-sans">{repo.name}</h3>
              <p className="mt-0.5 truncate text-xs text-zinc-500 font-mono">{repo.full_name}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
