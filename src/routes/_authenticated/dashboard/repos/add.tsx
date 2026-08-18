import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "../../../../lib/api";
import type { BaseResponse } from "../../../../types";
import { useState } from "react";
import { GitBranch, Loader2, Search, ChevronRight, Trash2 } from "lucide-react";

type AvailableRepo = {
  name: string;
  full_name: string;
};

export const Route = createFileRoute("/_authenticated/dashboard/repos/add")({
  component: OnboardingPage,
});

function OnboardingPage() {
  const navigate = useNavigate();

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
      const { data } = await api.get<BaseResponse<AvailableRepo[]>>("/repos/");
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
            className="mb-6 flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            Back to repositories
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100 font-sans">
            Configure Project
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400 font-sans">
            Importing <span className="font-semibold text-zinc-100">{configuringRepo.name}</span>.
            Configure your build and deployment settings.
          </p>
        </div>

        <div className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-900 p-6 md:p-8">
          {/* Root Directory */}
          <div>
            <label className="block text-sm font-semibold text-zinc-200 mb-1 font-sans">
              Root Directory
            </label>
            <p className="text-xs text-zinc-500 mb-3 font-sans">
              The directory within your project where your code is located.
            </p>
            <input
              type="text"
              placeholder="./"
              value={rootDirectory}
              onChange={(e) => setRootDirectory(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-100 focus:border-white focus:outline-none"
            />
          </div>

          <div className="h-px w-full bg-zinc-800" />

          {/* Build Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-200 font-sans">Build Settings</h3>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1 font-sans">
                  Build Command
                </label>
                <input
                  type="text"
                  placeholder="npm run build"
                  value={buildCommand}
                  onChange={(e) => setBuildCommand(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-100 focus:border-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1 font-sans">
                  Test Command
                </label>
                <input
                  type="text"
                  placeholder="npm test"
                  value={testCommand}
                  onChange={(e) => setTestCommand(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-100 focus:border-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1 font-sans">
                  Install Command
                </label>
                <input
                  type="text"
                  placeholder="npm install"
                  value={installCommand}
                  onChange={(e) => setInstallCommand(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-100 focus:border-white focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-zinc-300 mb-1 font-sans">
                  Start Command
                </label>
                <input
                  type="text"
                  placeholder="npm start"
                  value={startCommand}
                  onChange={(e) => setStartCommand(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-100 focus:border-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-zinc-800" />

          {/* Environment Variables */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-200 font-sans">Environment Variables</h3>
            <div className="space-y-3">
              {envVars.map((envVar, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="KEY"
                      value={envVar.key}
                      onChange={(e) => updateEnvVar(idx, "key", e.target.value)}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-100 focus:border-white focus:outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="VALUE"
                      value={envVar.value}
                      onChange={(e) => updateEnvVar(idx, "value", e.target.value)}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-100 focus:border-white focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => removeEnvVar(idx)}
                    className="flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg text-zinc-500 hover:bg-red-950/40 hover:text-red-400 transition-colors"
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
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 px-4 py-2 text-xs font-semibold font-mono tracking-wide shadow-sm transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            {trackMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Deploy"}
          </button>
        </div>

        {trackMutation.isError && (
          <div className="mt-4 rounded-lg border border-red-900 bg-red-950/40 p-4 text-xs font-mono text-red-400">
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
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100 font-sans">
          Let's build something new.
        </h1>
        <p className="mt-2 text-base text-zinc-400 font-sans">
          To deploy a new Project, import an existing repository from your Git provider.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden shadow-md">
        <div className="p-4 border-b border-zinc-800 flex gap-4 items-center">
          <h2 className="font-semibold text-zinc-100 whitespace-nowrap hidden sm:block font-sans">
            Import Git Repository
          </h2>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 py-2 pl-9 pr-3 text-xs text-zinc-100 outline-none placeholder:text-zinc-550 focus:border-white font-mono"
            />
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mx-4 my-4 rounded-lg border border-red-900 bg-red-950/40 p-4 text-xs font-mono text-red-400">
            Failed to load repositories. Please try again.
          </div>
        )}

        {/* Repo list */}
        {filteredRepos && (
          <div className="max-h-[500px] overflow-y-auto">
            {filteredRepos.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-xs font-mono text-zinc-500">No repositories found.</p>
              </div>
            ) : (
              <ul className="m-0 list-none divide-y divide-zinc-800 p-0">
                {filteredRepos.map((repo) => (
                  <li
                    key={repo.full_name}
                    className="flex items-center justify-between px-4 py-4 hover:bg-zinc-850/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border border-zinc-750 bg-zinc-850 text-zinc-300">
                        <GitBranch className="h-4 w-4" strokeWidth={1.8} />
                      </div>
                      <div className="font-medium text-zinc-200 text-sm font-sans">
                        {repo.name}
                        <span className="block text-xs font-normal text-zinc-500 font-mono mt-0.5">
                          {repo.full_name}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setConfiguringRepo(repo)}
                      className="cursor-pointer rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-1.5 text-xs font-semibold font-mono text-zinc-150 shadow-sm transition hover:bg-zinc-700 hover:text-zinc-100"
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
