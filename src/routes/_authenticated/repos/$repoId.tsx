import Button from "#/components/ui/buttons";
import DeleteModal from "#/components/ui/modals/delete-modal";
import { api } from "#/lib/api";
import { getErrorMessage } from "#/lib/utils/get-error-message";
import type { BaseResponse } from "#/types";
import type { TrackedRepo, UpdateRepoPayload } from "#/types/repo.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { User, Copy, RefreshCw, Folder, Loader2 } from "lucide-react";
import { useState } from "react";

import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/repos/$repoId")({
  component: RepoDetailsPage,
});

function RepoDetailsPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { repoId } = Route.useParams();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"deployments" | "settings">("deployments");

  const [repoData, setRepoData] = useState<UpdateRepoPayload>({});

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
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {getErrorMessage(error)}
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h1 className="flex h-8 items-center text-2xl font-bold tracking-tight text-slate-900">
              {isLoading ? (
                <div className="h-7 w-64 animate-pulse rounded-md bg-slate-200" />
              ) : (
                repo?.name
              )}
            </h1>
          </div>

          <div className="mb-8 flex space-x-6 border-b border-slate-200">
            <button
              onClick={() => setActiveTab("deployments")}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === "deployments"
                  ? "border-b-2 border-slate-900 text-slate-900"
                  : "border-b-2 border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
              }`}
            >
              Deployments
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === "settings"
                  ? "border-b-2 border-slate-900 text-slate-900"
                  : "border-b-2 border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
              }`}
            >
              Settings
            </button>
          </div>

          {activeTab === "deployments" && (
            <div className="space-y-4">
              {repo?.builds?.map((build) => (
                <div
                  key={build.id}
                  className="rounded-xl border border-slate-200 bg-white p-6 flex items-start justify-between"
                >
                  <div className="flex flex-col gap-y-4">
                    <div className="">
                      <p className="text-lg font-semibold">{build.commit_title}</p>
                      <p className="text-slate-600 text-sm">{build.commit_description}</p>
                    </div>
                    <span className="flex items-center gap-x-2">
                      <span className="rounded-md bg-slate-200 p-1">
                        <User className="h-4 w-4" />
                      </span>
                      <p className="text-slate-600 text-xs">{build.pusher}</p>
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs">
                    {new Date(build.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
              {!isLoading && (!repo?.builds || repo.builds.length === 0) && (
                <p className="text-sm text-slate-500 py-4">No deployments found.</p>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-8 max-w-3xl pb-16">
              {/* Basic Settings */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={repo?.name ?? ""}
                    disabled
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Install Command
                  </label>
                  <input
                    type="text"
                    value={repoData.install_command ?? repo?.install_command ?? ""}
                    onChange={(e) =>
                      setRepoData((prev) => ({ ...prev, install_command: e.target.value }))
                    }
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 placeholder-slate-400"
                    placeholder="Leave empty to use default install commands"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Build Command
                  </label>
                  <input
                    type="text"
                    value={repoData.build_command ?? repo?.build_command ?? ""}
                    onChange={(e) =>
                      setRepoData((prev) => ({ ...prev, build_command: e.target.value }))
                    }
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 placeholder-slate-400"
                    placeholder="Leave empty to use default build commands"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Test Command
                  </label>
                  <input
                    type="text"
                    value={repoData.test_command ?? repo?.test_command ?? ""}
                    onChange={(e) =>
                      setRepoData((prev) => ({ ...prev, test_command: e.target.value }))
                    }
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 placeholder-slate-400"
                    placeholder="Leave empty to use default test commands"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Start Command
                  </label>
                  <input
                    type="text"
                    value={repoData.start_command ?? repo?.start_command ?? ""}
                    onChange={(e) =>
                      setRepoData((prev) => ({ ...prev, start_command: e.target.value }))
                    }
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 placeholder-slate-400"
                    placeholder="Leave empty to use default start commands"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Environment Variables
                  </label>
                  <textarea
                    rows={4}
                    value={repoData.env_vars ?? repo?.env_vars ?? ""}
                    onChange={(e) => setRepoData((prev) => ({ ...prev, env_vars: e.target.value }))}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 placeholder-slate-400 font-mono"
                    placeholder={"KEY=VALUE\nPORT=3000"}
                  />
                </div>
              </div>

              <div className="h-px w-full bg-slate-200" />

              {/* GitHub Integration */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900">GitHub Integration</h3>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Repository URL
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 pr-10"
                      value={repo ? `https://github.com/${repo.full_name}` : ""}
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Current Branch
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 pr-10"
                      value={repo?.default_branch || "main"}
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Base Directory
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                      value={repoData.root_directory ?? repo?.root_directory ?? "/"}
                      onChange={(e) =>
                        setRepoData((prev) => ({ ...prev, root_directory: e.target.value }))
                      }
                    />
                    <button className="flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                      <Folder className="h-4 w-4" />
                      Browse
                    </button>
                  </div>
                </div>
              </div>

              <div className="h-px w-full bg-slate-200" />

              {/* Danger Zone */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Delete Project</h3>
                  <p className="text-sm text-slate-500 mt-1">
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
                className="w-full flex items-center justify-center"
                onClick={() => updateRepo(repoId)}
                disabled={!isRepoDataChanged() || isUpdatingRepo}
              >
                {isUpdatingRepo ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
