import Button from "#/components/ui/buttons";
import DeleteModal from "#/components/ui/modals/delete-modal";
import { api } from "#/lib/api";
import { getErrorMessage } from "#/lib/utils/get-error-message";
import type { BaseResponse } from "#/types";
import type { TrackedRepo, UpdateRepoPayload, BuildItem } from "#/types/repo.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  User,
  Copy,
  RefreshCw,
  Folder,
  Loader2,
  GitCommit,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Timer,
  GitBranch,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/repos/$repoId")({
  component: RepoDetailsPage,
});

function RepoDetailsPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { repoId } = Route.useParams();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"deployments" | "settings">("deployments");

  const [repoData, setRepoData] = useState<UpdateRepoPayload>({});

  const [page, setPage] = useState(1);
  const [allBuilds, setAllBuilds] = useState<BuildItem[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Fetch builds list paginated
  const { data: buildsData, isFetching: isFetchingBuilds } = useQuery({
    queryKey: ["builds", repoId, page],
    queryFn: async () => {
      const { data } = await api.get<
        BaseResponse<{
          items: BuildItem[];
          total: number;
          page: number;
          limit: number;
          has_more: boolean;
        }>
      >(`/builds?repo_id=${repoId}&page=${page}&limit=5`);
      return data.data;
    },
    enabled: !!repoId,
  });

  console.log("buildsData", buildsData);
  console.log("allBuilds", allBuilds);

  // Reset page and items list when repository ID changes
  useEffect(() => {
    setPage(1);
    setHasMore(false);
  }, [repoId]);

  const displayedBuilds = allBuilds.filter((b) => b.repo_id === repoId);

  // Merge new page results
  useEffect(() => {
    if (buildsData?.items) {
      setAllBuilds((prev) => {
        console.log("prev", prev);
        console.log("buildsData.items", buildsData.items);
        if (page === 1) {
          return buildsData.items;
        }
        const existingIds = new Set(prev.map((b) => b.id));
        const newItems = buildsData.items.filter((b) => !existingIds.has(b.id));
        return [...prev, ...newItems];
      });
      setHasMore(buildsData.has_more);
    }
  }, [buildsData, page]);

  // Observer sentinel entry listener
  useEffect(() => {
    if (!hasMore || isFetchingBuilds) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((p) => p + 1);
        }
      },
      { rootMargin: "150px" }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [hasMore, isFetchingBuilds]);

  console.log("repoData", repoData);

  const {
    data: repo,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["repo", repoId],
    queryFn: async () => {
      const { data } = await api.get<BaseResponse<TrackedRepo>>(`/repos/${repoId}`);
      return data.data;
    },
  });

  console.log("repo", repo);

  function isRepoDataChanged() {
    if (!repo) return false;

    const fields = [
      "build_command",
      "start_command",
      "root_directory",
      "install_command",
      "env_vars",
    ] as const;

    return fields.some((key) => {
      const editedValue = repoData[key];
      const originalValue = repo[key];

      if (editedValue === undefined) return false;
      return editedValue !== originalValue;
    });
  }

  const { mutateAsync: deleteRepo, isPending: isDeletingRepo } = useMutation({
    mutationFn: async (repoId: string) => {
      const { data } = await api.delete<BaseResponse<any>>(`/repos/${repoId}`);
      return data.data;
    },
    onSuccess: () => {
      toast.success("Project deleted successfully");
      setIsDeleteModalOpen(false);
      navigate({ to: "/dashboard" });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
      setIsDeleteModalOpen(false);
    },
  });

  const { mutateAsync: updateRepo, isPending: isUpdatingRepo } = useMutation({
    mutationFn: async (repoId: string) => {
      const { data } = await api.patch<BaseResponse<any>>(`/repos/${repoId}`, repoData);
      return data.data;
    },
    onSuccess: () => {
      toast.success("Project updated successfully");
      setRepoData({});
      queryClient.invalidateQueries({ queryKey: ["repo", repoId] });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
    },
  });

  return (
    <div className="mx-auto max-w-5xl">
      {error ? (
        <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-xs font-mono text-red-400">
          {getErrorMessage(error)}
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h1 className="flex h-8 items-center text-2xl font-bold tracking-tight text-zinc-100 font-sans">
              {isLoading ? (
                <div className="h-7 w-64 animate-pulse rounded-md bg-zinc-800" />
              ) : (
                repo?.name
              )}
            </h1>
          </div>

          <div className="mb-8 flex space-x-6 border-b border-zinc-800">
            <button
              onClick={() => setActiveTab("deployments")}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === "deployments"
                  ? "border-b-2 border-white text-zinc-100 font-semibold"
                  : "border-b-2 border-transparent text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
              }`}
            >
              Deployments
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === "settings"
                  ? "border-b-2 border-white text-zinc-100 font-semibold"
                  : "border-b-2 border-transparent text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
              }`}
            >
              Settings
            </button>
          </div>

          {activeTab === "deployments" && (
            <div className="space-y-4">
              {isFetchingBuilds && displayedBuilds.length === 0 && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
                </div>
              )}
              {displayedBuilds.map((build) => {
                // Determine a status (mock fallback if undefined)
                const status: "success" | "failed" | "in_progress" | "pending" =
                  build.status || (build.commit_title.includes("error") ? "failed" : "success");

                const statusDetails = {
                  success: {
                    label: "Passed",
                    icon: CheckCircle2,
                    classes: "text-emerald-400 bg-emerald-950/40 border border-emerald-900/60",
                  },
                  failed: {
                    label: "Failed",
                    icon: XCircle,
                    classes: "text-red-400 bg-red-950/40 border border-red-900/60",
                  },
                  in_progress: {
                    label: "Building",
                    icon: Loader2,
                    classes: "text-blue-400 bg-blue-950/40 border border-blue-900/60",
                  },
                  pending: {
                    label: "Pending",
                    icon: Timer,
                    classes: "text-amber-400 bg-amber-950/40 border border-amber-900/60",
                  },
                }[status];

                const StatusIcon = statusDetails.icon;

                return (
                  <Link
                    key={build.id}
                    to="/dashboard/repos/builds/$buildId"
                    params={{ buildId: build.id }}
                    className="group block rounded-xl border border-zinc-800 bg-zinc-900 p-5 no-underline transition hover:border-zinc-700 hover:shadow-lg animate-none"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1 min-w-0">
                        {/* Title & Status badge */}
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold font-mono ${statusDetails.classes}`}
                          >
                            {status === "in_progress" ? (
                              <Loader2 className="h-2.5 w-2.5 shrink-0 animate-spin" />
                            ) : (
                              <StatusIcon className="h-2.5 w-2.5 shrink-0" />
                            )}
                            {statusDetails.label}
                          </span>
                          <span className="font-semibold text-zinc-100 group-hover:text-white transition-colors">
                            {build.commit_title}
                          </span>
                        </div>

                        {build.commit_description && (
                          <p className="text-zinc-400 text-xs mb-3 line-clamp-2 leading-relaxed">
                            {build.commit_description}
                          </p>
                        )}

                        {/* Meta metadata row */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-zinc-400">
                          {/* Pusher */}
                          <span className="flex items-center gap-1">
                            <span className="rounded bg-zinc-800 p-0.5">
                              <User className="h-3.5 w-3.5 text-zinc-400" />
                            </span>
                            {build.pusher}
                          </span>

                          {/* Branch */}
                          {build.branch && (
                            <span className="flex items-center gap-1 font-mono text-[11px] bg-zinc-850 text-zinc-400 border border-zinc-750 rounded px-1.5 py-0.5">
                              <GitBranch className="h-3.5 w-3.5 text-zinc-400 mr-0.5" />
                              {build.branch}
                            </span>
                          )}

                          {/* Commit SHA */}
                          {build.commit_sha && (
                            <span className="flex items-center gap-1 font-mono text-[11px] bg-zinc-850 text-zinc-400 border border-zinc-750 rounded px-1.5 py-0.5">
                              <GitCommit className="h-3.5 w-3.5 text-zinc-400 mr-0.5" />
                              {build.commit_sha.slice(0, 7)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right side metadata + chevron */}
                      <div className="flex items-center justify-between border-t border-zinc-800 pt-3 sm:border-0 sm:pt-0 sm:flex-col sm:items-end sm:gap-2 shrink-0">
                        <span className="text-zinc-500 text-xs sm:text-right font-mono">
                          {new Date(build.created_at).toLocaleString()}
                        </span>
                        <ChevronRight className="h-4 w-4 text-zinc-500 group-hover:text-zinc-400 transition-transform group-hover:translate-x-0.5 hidden sm:block" />
                      </div>
                    </div>
                  </Link>
                );
              })}
              {isFetchingBuilds && displayedBuilds.length > 0 && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
                </div>
              )}
              <div ref={sentinelRef} className="h-1" />
              {!isFetchingBuilds && displayedBuilds.length === 0 && (
                <p className="text-xs font-mono text-zinc-550 py-4">No deployments found.</p>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-8 max-w-3xl pb-16">
              {/* Basic Settings */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-zinc-200 mb-2 font-sans">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={repo?.name ?? ""}
                    disabled
                    className="w-full rounded-md border border-zinc-750 bg-zinc-950 px-3 py-2 text-xs focus:outline-none text-zinc-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-200 mb-2 font-sans">
                    Install Command
                  </label>
                  <input
                    type="text"
                    value={repoData.install_command ?? repo?.install_command ?? ""}
                    onChange={(e) =>
                      setRepoData((prev) => ({ ...prev, install_command: e.target.value }))
                    }
                    className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs focus:border-white focus:outline-none text-zinc-100 font-mono placeholder-zinc-650"
                    placeholder="Leave empty to use default install commands"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-200 mb-2 font-sans">
                    Build Command
                  </label>
                  <input
                    type="text"
                    value={repoData.build_command ?? repo?.build_command ?? ""}
                    onChange={(e) =>
                      setRepoData((prev) => ({ ...prev, build_command: e.target.value }))
                    }
                    className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs focus:border-white focus:outline-none text-zinc-100 font-mono placeholder-zinc-650"
                    placeholder="Leave empty to use default build commands"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-200 mb-2 font-sans">
                    Test Command
                  </label>
                  <input
                    type="text"
                    value={repoData.test_command ?? repo?.test_command ?? ""}
                    onChange={(e) =>
                      setRepoData((prev) => ({ ...prev, test_command: e.target.value }))
                    }
                    className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs focus:border-white focus:outline-none text-zinc-100 font-mono placeholder-zinc-650"
                    placeholder="Leave empty to use default test commands"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-200 mb-2 font-sans">
                    Start Command
                  </label>
                  <input
                    type="text"
                    value={repoData.start_command ?? repo?.start_command ?? ""}
                    onChange={(e) =>
                      setRepoData((prev) => ({ ...prev, start_command: e.target.value }))
                    }
                    className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs focus:border-white focus:outline-none text-zinc-100 font-mono placeholder-zinc-650"
                    placeholder="Leave empty to use default start commands"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-200 mb-2 font-sans">
                    Environment Variables
                  </label>
                  <textarea
                    rows={4}
                    value={repoData.env_vars ?? repo?.env_vars ?? ""}
                    onChange={(e) => setRepoData((prev) => ({ ...prev, env_vars: e.target.value }))}
                    className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs focus:border-white focus:outline-none text-zinc-100 font-mono placeholder-zinc-650"
                    placeholder={"KEY=VALUE\nPORT=3000"}
                  />
                </div>
              </div>

              <div className="h-px w-full bg-zinc-800" />

              {/* GitHub Integration */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-zinc-100 font-sans">GitHub Integration</h3>

                <div>
                  <label className="block text-sm font-semibold text-zinc-200 mb-2 font-sans">
                    Repository URL
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      className="w-full rounded-md border border-zinc-750 bg-zinc-950 px-3 py-2 text-xs text-zinc-400 font-mono pr-10"
                      value={repo ? `https://github.com/${repo.full_name}` : ""}
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors">
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-200 mb-2 font-sans">
                    Current Branch
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      className="w-full rounded-md border border-zinc-750 bg-zinc-950 px-3 py-2 text-xs text-zinc-400 font-mono pr-10"
                      value={repo?.default_branch || "main"}
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors">
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-200 mb-2 font-sans">
                    Base Directory
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      className="flex-1 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs focus:border-white focus:outline-none text-zinc-100 font-mono"
                      value={repoData.root_directory ?? repo?.root_directory ?? "/"}
                      onChange={(e) =>
                        setRepoData((prev) => ({ ...prev, root_directory: e.target.value }))
                      }
                    />
                    <button className="flex items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-semibold font-mono text-zinc-350 hover:bg-zinc-700 transition">
                      <Folder className="h-4 w-4" />
                      Browse
                    </button>
                  </div>
                </div>
              </div>

              <div className="h-px w-full bg-zinc-800" />

              {/* Danger Zone */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="text-sm font-bold text-zinc-100 font-sans">Delete Project</h3>
                  <p className="text-xs text-zinc-400 mt-1 font-sans">
                    Permanently delete this project and all data.
                  </p>
                </div>

                <DeleteModal
                  open={isDeleteModalOpen}
                  onOpenChange={setIsDeleteModalOpen}
                  isLoading={isDeletingRepo}
                  title="Delete project"
                  description="Are you sure you want to delete this project?"
                  onClick={() => deleteRepo(repoId)}
                  onClose={() => setIsDeleteModalOpen(false)}
                />
              </div>
              <Button
                variant="primary"
                className="w-full flex items-center justify-center"
                onClick={() => updateRepo(repoId)}
                disabled={!isRepoDataChanged() || isUpdatingRepo}
              >
                {isUpdatingRepo ? (
                  <Loader2 className="h-4 w-4 animate-spin text-zinc-900" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
