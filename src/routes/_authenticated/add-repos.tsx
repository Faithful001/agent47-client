import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "../../lib/api";
import type { BaseResponse } from "../../types";
import { useAuthStore } from "../../store/auth";
import { useState } from "react";
import { GitBranch, Loader2, Check, ArrowRight, Search } from "lucide-react";

type AvailableRepo = {
  name: string;
  full_name: string;
};

export const Route = createFileRoute("/_authenticated/add-repos")({
  component: OnboardingPage,
});

function OnboardingPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: repos,
    isLoading,
    error,
  } = useQuery<AvailableRepo[]>({
    queryKey: ["repos", "available"],
    queryFn: async () => {
      const { data } = await api.get<BaseResponse<AvailableRepo[]>>("/repos");
      return data.data;
    },
  });

  console.log("repos", repos);

  const trackMutation = useMutation({
    mutationFn: async (repoFullNames: string[]) => {
      // Track repos sequentially
      for (const repo_full_name of repoFullNames) {
        await api.post<BaseResponse<any>>(
          "/repos/track",
          { repo_full_name },
          {
            headers: {
              "X-GitHub-Event": "check_run",
            },
          }
        );
      }
    },
    onSuccess: () => {
      navigate({ to: "/dashboard" } as any);
    },
  });

  const toggleRepo = (fullName: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(fullName)) {
        next.delete(fullName);
      } else {
        next.add(fullName);
      }
      return next;
    });
  };

  const filteredRepos = repos?.filter(
    (r) =>
      r.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = () => {
    if (selected.size > 0) {
      trackMutation.mutate(Array.from(selected));
    }
  };

  return (
    <div className="mx-auto max-w-2xl py-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Welcome{user?.username ? `, ${user.username}` : ``}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Select the repositories you'd like Agent47 to monitor. You can always change this later
          from your dashboard.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search repositories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        />
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          Failed to load repositories. Please try again.
        </div>
      )}

      {/* Repo list */}
      {filteredRepos && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          {filteredRepos.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-slate-400">No repositories found.</p>
            </div>
          ) : (
            <ul className="m-0 list-none divide-y divide-slate-100 p-0">
              {filteredRepos.map((repo) => {
                const isSelected = selected.has(repo.full_name);
                return (
                  <li key={repo.full_name}>
                    <button
                      onClick={() => toggleRepo(repo.full_name)}
                      className={`flex w-full cursor-pointer items-center gap-4 border-none bg-transparent px-4 py-3.5 text-left transition hover:bg-slate-50 ${
                        isSelected ? "bg-slate-50/50" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <div
                        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border transition ${
                          isSelected ? "border-slate-900 bg-slate-900" : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                      </div>

                      {/* Icon */}
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100">
                        <GitBranch className="h-4 w-4 text-slate-500" strokeWidth={1.8} />
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <p className="m-0 truncate text-sm font-medium text-slate-900">
                          {repo.name}
                        </p>
                        <p className="m-0 truncate text-xs text-slate-400">{repo.full_name}</p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* Footer actions */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-slate-400">
          {selected.size > 0
            ? `${selected.size} ${selected.size === 1 ? `repository` : `repositories`} selected`
            : "Select at least one repository"}
        </p>
        <button
          onClick={handleSubmit}
          disabled={selected.size === 0 || trackMutation.isPending}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {trackMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Continue
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>

      {/* Error state for mutation */}
      {trackMutation.isError && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          Failed to track repositories. Please try again.
        </div>
      )}
    </div>
  );
}
