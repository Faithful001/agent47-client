import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "../../../lib/api";
import type { BaseResponse } from "../../../types";
// import { useAuthStore } from "../../../store/auth";
import { useState } from "react";
import { GitBranch, Loader2, Search, ChevronRight, Trash2 } from "lucide-react";

type AvailableRepo = {
  name: string;
  full_name: string;
};

export const Route = createFileRoute("/_authenticated/repos/add")({
  component: OnboardingPage,
});

function OnboardingPage() {
  const navigate = useNavigate();
  // const user = useAuthStore((s) => s.user);

  // Repo Selection State
  const [searchQuery, setSearchQuery] = useState("");
  const [configuringRepo, setConfiguringRepo] = useState<AvailableRepo | null>(null);

  // Configuration State
  const [rootDirectory, setRootDirectory] = useState("");
  const [buildCommand, setBuildCommand] = useState("");
  const [installCommand, setInstallCommand] = useState("");
  const [startCommand, setStartCommand] = useState("");
  const [testCommand, setTestCommand] = useState("");
  const [envVars, setEnvVars] = useState<{ key: string; value: string }[]>([
    { key: "", value: "" },
  ]);

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

  const trackMutation = useMutation({
    mutationFn: async () => {
      if (!configuringRepo) return;

      const envVarsRecord = envVars.reduce(
        (acc, curr) => {
          if (curr.key.trim() && curr.value.trim()) {
            acc[curr.key.trim()] = curr.value.trim();
          }
          return acc;
        },
        {} as Record<string, string>
      );

      const payload = {
        repo_full_name: configuringRepo.full_name,
        root_directory: rootDirectory || null,
        install_command: installCommand || null,
        build_command: buildCommand || null,
        test_command: testCommand || null,
        start_command: startCommand || null,
        env_vars: Object.keys(envVarsRecord).length > 0 ? JSON.stringify(envVarsRecord) : null,
      };

      await api.post<BaseResponse<any>>("/repos/track", payload, {
        headers: {
          "X-GitHub-Event": "check_run",
        },
      });
    },
    onSuccess: () => {
      navigate({ to: "/dashboard" } as any);
    },
  });

  const filteredRepos = repos?.filter(
    (r) =>
      r.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addEnvVar = () => setEnvVars([...envVars, { key: "", value: "" }]);

  const removeEnvVar = (index: number) => {
    if (envVars.length === 1) {
      setEnvVars([{ key: "", value: "" }]);
      return;
    }
    setEnvVars(envVars.filter((_, i) => i !== index));
  };

  const updateEnvVar = (index: number, field: "key" | "value", value: string) => {
    const newVars = [...envVars];
    newVars[index][field] = value;
    setEnvVars(newVars);

    // Auto-add new row if we're typing in the last row and both fields have some content
    if (index === envVars.length - 1 && newVars[index].key && newVars[index].value) {
      addEnvVar();
    }
  };

  if (configuringRepo) {
    return (
      <div className="mx-auto max-w-2xl py-8">
        <div className="mb-8">
          <button
            onClick={() => setConfiguringRepo(null)}
            className="mb-6 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            Back to repositories
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Configure Project</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Importing <span className="font-semibold text-slate-900">{configuringRepo.name}</span>.
            Configure your build and deployment settings.
          </p>
        </div>

        <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 md:p-8">
          {/* Root Directory */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">Root Directory</label>
            <p className="text-xs text-slate-500 mb-3">
              The directory within your project where your code is located.
            </p>
            <input
              type="text"
              placeholder="./"
              value={rootDirectory}
              onChange={(e) => setRootDirectory(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100"
            />
          </div>

          <div className="h-px w-full bg-slate-100" />

          {/* Build Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Build Settings</h3>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Build Command
                </label>
                <input
                  type="text"
                  placeholder="npm run build"
                  value={buildCommand}
                  onChange={(e) => setBuildCommand(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Test Command
                </label>
                <input
                  type="text"
                  placeholder="npm test"
                  value={testCommand}
                  onChange={(e) => setTestCommand(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Install Command
                </label>
                <input
                  type="text"
                  placeholder="npm install"
                  value={installCommand}
                  onChange={(e) => setInstallCommand(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Start Command
                </label>
                <input
                  type="text"
                  placeholder="npm start"
                  value={startCommand}
                  onChange={(e) => setStartCommand(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-slate-100" />

          {/* Environment Variables */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Environment Variables</h3>
            <div className="space-y-3">
              {envVars.map((envVar, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="KEY"
                      value={envVar.key}
                      onChange={(e) => updateEnvVar(idx, "key", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-mono focus:bg-white focus:border-slate-400 focus:outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="VALUE"
                      value={envVar.value}
                      onChange={(e) => updateEnvVar(idx, "value", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-mono focus:bg-white focus:border-slate-400 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => removeEnvVar(idx)}
                    className="flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Connect Action */}
        <div className="mt-6 flex items-center justify-end">
          <button
            onClick={() => trackMutation.mutate()}
            disabled={trackMutation.isPending}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {trackMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Deploy"}
          </button>
        </div>

        {trackMutation.isError && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            Failed to setup repository. Please try again.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Let's build something new.
        </h1>
        <p className="mt-2 text-base text-slate-500">
          To deploy a new Project, import an existing repository from your Git provider.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex gap-4 items-center">
          <h2 className="font-semibold text-slate-900 whitespace-nowrap hidden sm:block">
            Import Git Repository
          </h2>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
            />
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mx-4 my-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            Failed to load repositories. Please try again.
          </div>
        )}

        {/* Repo list */}
        {filteredRepos && (
          <div className="max-h-[500px] overflow-y-auto">
            {filteredRepos.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-slate-400">No repositories found.</p>
              </div>
            ) : (
              <ul className="m-0 list-none divide-y divide-slate-100 p-0">
                {filteredRepos.map((repo) => (
                  <li
                    key={repo.full_name}
                    className="flex items-center justify-between px-4 py-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 shadow-sm">
                        <GitBranch className="h-4 w-4" strokeWidth={1.8} />
                      </div>
                      <div className="font-medium text-slate-900 text-sm">
                        {repo.name}
                        <span className="block text-xs font-normal text-slate-500 mt-0.5">
                          {repo.full_name}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setConfiguringRepo(repo)}
                      className="cursor-pointer rounded-md border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-100"
                    >
                      Import
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
