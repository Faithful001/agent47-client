import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import type { BaseResponse } from "../../types";
import { GitBranch, CheckCircle2, XCircle, Loader2, Plus, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

type TrackedRepo = {
  id: number;
  name: string;
  full_name: string;
  is_active: boolean;
};

export const Route = createFileRoute("/_authenticated/dashboard")({
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor and manage your tracked repositories.
          </p>
        </div>
        <a
          href="/add-repos"
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white no-underline transition hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          Add Repos
        </a>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          Failed to load repositories. Please try again.
        </div>
      )}

      {/* Empty state */}
      {repos && repos.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white py-16 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
            <GitBranch className="h-6 w-6 text-slate-400" strokeWidth={1.5} />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">No repositories tracked</h3>
          <p className="mt-1 text-sm text-slate-500">
            Connect your first repository to get started.
          </p>
          <a
            href="/add-repos"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-900 no-underline hover:underline"
          >
            Add repositories
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      )}

      {/* Repos grid */}
      {repos && repos.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {repos.map((repo) => (
            <Link
              to="/repos/$repoId"
              params={{ repoId: repo.id.toString() }}
              key={repo.id}
              className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                  <GitBranch className="h-4 w-4 text-slate-600" strokeWidth={1.8} />
                </div>
                {repo.is_active ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                    <CheckCircle2 className="h-3 w-3" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                    <XCircle className="h-3 w-3" />
                    Inactive
                  </span>
                )}
              </div>
              <h3 className="text-sm font-semibold text-slate-900">{repo.name}</h3>
              <p className="mt-0.5 truncate text-xs text-slate-400">{repo.full_name}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
