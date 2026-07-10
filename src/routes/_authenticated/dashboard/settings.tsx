import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Sparkles,
  Key,
  Link as LinkIcon,
  Sliders,
  Check,
  Copy,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import Button from "#/components/ui/buttons";
import { api } from "#/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { BaseResponse } from "#/types";
import { getErrorMessage } from "#/lib/utils/get-error-message";

export const Route = createFileRoute("/_authenticated/dashboard/settings")({
  component: SettingsPage,
});

type TabId = "agent" | "keys" | "webhooks";

function SettingsSkeleton({ tab }: { tab: TabId }) {
  return (
    <div className="space-y-6 animate-pulse p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-5 w-40 rounded bg-zinc-800" />
        <div className="h-3 w-80 rounded bg-zinc-800/60" />
      </div>

      <div className="h-px bg-zinc-800" />

      {tab === "agent" && (
        <div className="space-y-6">
          {/* Radio list */}
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 rounded-lg bg-zinc-800/40 border border-zinc-800/40" />
            ))}
          </div>

          <div className="h-px bg-zinc-800" />

          {/* Active provider */}
          <div className="space-y-2">
            <div className="h-4 w-32 rounded bg-zinc-800" />
            <div className="h-3 w-72 rounded bg-zinc-800/60" />
            <div className="h-9 w-full rounded bg-zinc-950 border border-zinc-700/20" />
          </div>

          <div className="h-px bg-zinc-800" />

          {/* Temperature */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <div className="h-4 w-28 rounded bg-zinc-800" />
              <div className="h-3 w-48 rounded bg-zinc-800/60" />
            </div>
            <div className="h-2 w-full rounded bg-zinc-800" />
          </div>
        </div>
      )}

      {tab === "keys" && (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3.5 w-36 rounded bg-zinc-800" />
              <div className="h-9 w-full rounded bg-zinc-950 border border-zinc-700/20" />
            </div>
          ))}
        </div>
      )}

      {tab === "webhooks" && (
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3.5 w-24 rounded bg-zinc-800" />
              <div className="h-9 w-full rounded bg-zinc-950 border border-zinc-700/20" />
            </div>
          ))}
          <div className="h-24 w-full rounded-lg bg-amber-950/10 border border-amber-900/20 animate-none" />
        </div>
      )}

      {/* Button Skeleton */}
      <div className="mt-6 flex justify-end border-t border-zinc-800 pt-5">
        <div className="h-9 w-28 rounded bg-zinc-800" />
      </div>
    </div>
  );
}

function SettingsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabId>("agent");
  const [model, setModel] = useState("gemini-1.5-pro");
  const [temperature, setTemperature] = useState(0.2);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [activeProvider, setActiveProvider] = useState("openrouter");

  // Form states
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({
    openrouter: "",
    google: "",
    anthropic: "",
    openai: "",
    groq: "",
  });

  const [webhookUrl] = useState("http://localhost:8000/webhooks/github");
  const [webhookSecret] = useState("thatlongrandomstring");

  const {
    data: keysList,
    isLoading,
    error,
  } = useQuery<any[]>({
    queryKey: ["apiKeys"],
    queryFn: async () => {
      const res = await api.get<BaseResponse<any[]>>("/api-keys/");
      return res.data.data;
    },
  });

  useEffect(() => {
    if (!keysList) return;

    const mappedKeys: Record<string, string> = {
      openrouter: "",
      google: "",
      openai: "",
      anthropic: "",
      groq: "",
    };
    let activeKeyFound = false;

    keysList.forEach((k: any) => {
      const nameLower = k.name.toLowerCase();
      mappedKeys[nameLower] = k.key;
      if (k.is_active) {
        setActiveProvider(nameLower);
        if (k.model) setModel(k.model);
        if (k.temperature !== undefined && k.temperature !== null) setTemperature(k.temperature);
        activeKeyFound = true;
      }
    });

    if (!activeKeyFound && keysList.length > 0) {
      const firstKeyLower = keysList[0].name.toLowerCase();
      setActiveProvider(firstKeyLower);
      if (keysList[0].model) setModel(keysList[0].model);
      if (keysList[0].temperature !== undefined && keysList[0].temperature !== null)
        setTemperature(keysList[0].temperature);
    }

    setApiKeys(mappedKeys);
  }, [keysList]);

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(label);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleShowKey = (key: string) => {
    setShowKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const { mutateAsync: saveSettings, isPending: saving } = useMutation({
    mutationFn: async (payload: {
      api_keys: Record<string, string>;
      active_provider: string;
      model: string;
      temperature: number;
    }) => {
      const { data } = await api.post<BaseResponse<any[]>>("/api-keys/", payload);
      return data.data;
    },
    onSuccess: () => {
      toast.success("Settings saved successfully");
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
    },
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSettings({
      api_keys: apiKeys,
      active_provider: activeProvider,
      model,
      temperature,
    });
  };

  const tabs: { id: TabId; label: string; icon: typeof Sliders }[] = [
    { id: "agent", label: "Agent Engine", icon: Sparkles },
    { id: "keys", label: "API Keys", icon: Key },
    { id: "webhooks", label: "Webhooks Integration", icon: LinkIcon },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100 font-sans">Settings</h1>
        <p className="mt-1 text-sm text-zinc-400 font-sans">
          Manage your AI agent behavior, integration tokens, and platform configurations.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-4">
        {/* Sidebar Tabs */}
        <aside className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                  isActive
                    ? "bg-zinc-800 text-white font-semibold"
                    : "text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.8} />
                {tab.label}
              </button>
            );
          })}
        </aside>

        {/* Content Panel */}
        <main className="md:col-span-3">
          {isLoading ? (
            <SettingsSkeleton tab={activeTab} />
          ) : error ? (
            <div className="rounded-xl border border-red-900 bg-red-950/40 p-6 text-sm font-sans text-red-400">
              <p className="font-semibold mb-1">Failed to load API keys</p>
              <p className="text-xs text-red-500 font-mono">
                {(error as any).message || "Unknown error"}
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSave}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm"
            >
              {/* 1. Agent Engine Tab */}
              {activeTab === "agent" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-zinc-100 font-sans">AI Agent Model</h3>
                    <p className="mt-1 text-xs text-zinc-400 font-sans">
                      Select which Large Language Model will power the Operative agent during bug
                      resolution.
                    </p>
                  </div>

                  <div className="grid gap-3">
                    {[
                      {
                        id: "gemini-1.5-pro",
                        name: "Gemini 1.5 Pro (Recommended)",
                        desc: "Best for reasoning and code syntax analysis.",
                      },
                      {
                        id: "claude-3-5-sonnet",
                        name: "Claude 3.5 Sonnet",
                        desc: "Highest overall coding capability.",
                      },
                      {
                        id: "gpt-4o",
                        name: "GPT-4o",
                        desc: "Fast inference and multi-step pipeline actions.",
                      },
                      {
                        id: "deepseek-coder",
                        name: "DeepSeek Coder 250B",
                        desc: "Open-weights model tailored for codebase fixes.",
                      },
                    ].map((m) => (
                      <label
                        key={m.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition hover:bg-zinc-850/30 ${
                          model === m.id
                            ? "border-white bg-zinc-850/45"
                            : "border-zinc-800 bg-zinc-900"
                        }`}
                      >
                        <input
                          type="radio"
                          name="model"
                          value={m.id}
                          checked={model === m.id}
                          onChange={(e) => setModel(e.target.value)}
                          className="mt-1 h-4 w-4 accent-zinc-100"
                        />
                        <div>
                          <div className="text-sm font-semibold text-zinc-100 font-sans">
                            {m.name}
                          </div>
                          <div className="mt-0.5 text-xs text-zinc-450 font-sans">{m.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="h-px w-full bg-zinc-800" />

                  {/* Active Key Provider */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-zinc-100 font-sans">
                      Active Key Provider
                    </label>
                    <p className="text-xs text-zinc-400 font-sans">
                      Select which credential provider to route LLM requests through. Note that the
                      selected model must be supported by the chosen provider (or use OpenRouter).
                    </p>
                    <select
                      value={activeProvider}
                      onChange={(e) => setActiveProvider(e.target.value)}
                      className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs focus:border-white focus:outline-none focus:ring-1 focus:ring-zinc-700 text-zinc-100 font-sans"
                    >
                      <option value="openrouter">
                        OpenRouter (Unified routing for all models)
                      </option>
                      <option value="google">Google API (Direct Gemini connection)</option>
                      <option value="openai">OpenAI API (Direct GPT connection)</option>
                      <option value="anthropic">Anthropic API (Direct Claude connection)</option>
                      <option value="groq">Groq API (Direct open-weights connection)</option>
                    </select>
                  </div>

                  <div className="h-px w-full bg-zinc-800" />

                  {/* Hyperparameters */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-semibold text-zinc-100 font-sans">
                        Temperature ({temperature})
                      </label>
                      <span className="text-xs text-zinc-500 font-mono">
                        Lower values produce more deterministic fixes
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-800 accent-zinc-100"
                    />
                  </div>
                </div>
              )}

              {/* 2. API Keys Tab */}
              {activeTab === "keys" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-zinc-100 font-sans">
                      LLM API Credentials
                    </h3>
                    <p className="mt-1 text-xs text-zinc-400 font-sans">
                      If you choose to run custom agent models, configure your personal access
                      tokens here.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        id: "openrouter",
                        label: "OpenRouter API Key (Main Engine)",
                        placeholder: "sk-or-v1-...",
                      },
                      { id: "google", label: "Google API Key", placeholder: "AIzaSy..." },
                      { id: "groq", label: "Groq API Key", placeholder: "gsk_..." },
                      { id: "openai", label: "OpenAI API Key", placeholder: "sk-proj-..." },
                      { id: "anthropic", label: "Anthropic API Key", placeholder: "sk-ant-..." },
                    ].map((field) => {
                      const isVisible = !!showKeys[field.id];
                      return (
                        <div key={field.id}>
                          <label className="block text-xs font-semibold text-zinc-300 mb-1.5 font-sans">
                            {field.label}
                          </label>
                          <div className="relative">
                            <input
                              type={isVisible ? "text" : "password"}
                              value={apiKeys[field.id as keyof typeof apiKeys]}
                              onChange={(e) =>
                                setApiKeys((prev) => ({ ...prev, [field.id]: e.target.value }))
                              }
                              placeholder={field.placeholder}
                              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs focus:border-white focus:outline-none focus:ring-1 focus:ring-zinc-700 text-zinc-100 font-mono pr-20"
                            />
                            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => toggleShowKey(field.id)}
                                className="p-1.5 text-zinc-500 hover:text-zinc-300"
                              >
                                {isVisible ? (
                                  <EyeOff className="h-3.5 w-3.5" />
                                ) : (
                                  <Eye className="h-3.5 w-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Webhooks Tab */}
              {activeTab === "webhooks" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-zinc-100 font-sans">
                      GitHub Webhook Integration
                    </h3>
                    <p className="mt-1 text-xs text-zinc-400 font-sans">
                      Use these values to configure webhook events in your GitHub repositories.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5 font-sans">
                        Payload URL
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          readOnly
                          value={webhookUrl}
                          className="w-full rounded-md border border-zinc-750 bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-400 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => copyToClipboard(webhookUrl, "Webhook URL")}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-500 hover:text-zinc-300"
                        >
                          {copiedKey === "Webhook URL" ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5 font-sans">
                        Webhook Secret Token
                      </label>
                      <div className="relative">
                        <input
                          type={showKeys.webhookSecret ? "text" : "password"}
                          readOnly
                          value={webhookSecret}
                          className="w-full rounded-md border border-zinc-750 bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-400 pr-20"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => toggleShowKey("webhookSecret")}
                            className="p-1.5 text-zinc-500 hover:text-zinc-300"
                          >
                            {showKeys.webhookSecret ? (
                              <EyeOff className="h-3.5 w-3.5" />
                            ) : (
                              <Eye className="h-3.5 w-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(webhookSecret, "Webhook Secret")}
                            className="p-1.5 text-zinc-500 hover:text-zinc-300"
                          >
                            {copiedKey === "Webhook Secret" ? (
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-amber-900/60 bg-amber-950/20 p-4">
                    <h4 className="text-xs font-semibold text-amber-400 font-sans">
                      Configuration Instructions
                    </h4>
                    <p className="mt-1 text-[11px] text-amber-500 leading-relaxed font-mono">
                      1. Go to your GitHub Repository Settings → **Webhooks** → **Add Webhook**.
                      <br />
                      2. Paste the **Payload URL** above.
                      <br />
                      3. Select Content type: **application/json**.
                      <br />
                      4. Paste the **Secret** token above.
                      <br />
                      5. Select events: **Check suites**, **Push** events.
                      <br />
                      6. Click **Add webhook**.
                    </p>
                  </div>
                </div>
              )}

              {/* Preferences Tab removed */}

              {/* Bottom Actions */}
              <div className="mt-6 flex justify-end border-t border-zinc-800 pt-5">
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}
