import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Key, Link as LinkIcon, Sliders, Check, Copy, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Button from "#/components/ui/buttons";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});

type TabId = "agent" | "keys" | "webhooks" | "preferences";

function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("agent");
  const [model, setModel] = useState("gemini-1.5-pro");
  const [temperature, setTemperature] = useState(0.2);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);

  // Form states
  const [apiKeys, setApiKeys] = useState({
    google: "AIzaSyDcpmZOEsXVgR...",
    anthropic: "",
    openai: "",
    groq: "gsk_k1SqeWvI18dG7...",
  });

  const [webhookUrl] = useState("http://localhost:8000/webhooks/github");
  const [webhookSecret] = useState("thatlongrandomstring");

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(label);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleShowKey = (key: string) => {
    setShowKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Simulate API save
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSaving(false);
    toast.success("Settings saved successfully");
  };

  const tabs: { id: TabId; label: string; icon: typeof Sliders }[] = [
    { id: "agent", label: "Agent Engine", icon: Sparkles },
    { id: "keys", label: "API Keys", icon: Key },
    { id: "webhooks", label: "Webhooks Integration", icon: LinkIcon },
    { id: "preferences", label: "Preferences", icon: Sliders },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
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
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                {tab.label}
              </button>
            );
          })}
        </aside>

        {/* Content Panel */}
        <main className="md:col-span-3">
          <form onSubmit={handleSave} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            {/* 1. Agent Engine Tab */}
            {activeTab === "agent" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">AI Agent Model</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Select which Large Language Model will power the Operative agent during bug resolution.
                  </p>
                </div>

                <div className="grid gap-3">
                  {[
                    { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro (Recommended)", desc: "Best for reasoning and code syntax analysis." },
                    { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", desc: "Highest overall coding capability." },
                    { id: "gpt-4o", name: "GPT-4o", desc: "Fast inference and multi-step pipeline actions." },
                    { id: "deepseek-coder", name: "DeepSeek Coder 250B", desc: "Open-weights model tailored for codebase fixes." },
                  ].map((m) => (
                    <label
                      key={m.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition hover:bg-slate-50 ${
                        model === m.id ? "border-slate-900 bg-slate-50/50" : "border-slate-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="model"
                        value={m.id}
                        checked={model === m.id}
                        onChange={(e) => setModel(e.target.value)}
                        className="mt-1 h-4 w-4 accent-slate-900"
                      />
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{m.name}</div>
                        <div className="mt-0.5 text-xs text-slate-500">{m.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="h-px w-full bg-slate-200" />

                {/* Hyperparameters */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-slate-900">
                      Temperature ({temperature})
                    </label>
                    <span className="text-xs text-slate-400">Lower values produce more deterministic fixes</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-slate-900"
                  />
                </div>
              </div>
            )}

            {/* 2. API Keys Tab */}
            {activeTab === "keys" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">LLM API Credentials</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    If you choose to run custom agent models, configure your personal access tokens here.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    { id: "google", label: "Google API Key", placeholder: "AIzaSy..." },
                    { id: "groq", label: "Groq API Key", placeholder: "gsk_..." },
                    { id: "openai", label: "OpenAI API Key", placeholder: "sk-proj-..." },
                    { id: "anthropic", label: "Anthropic API Key", placeholder: "sk-ant-..." },
                  ].map((field) => {
                    const isVisible = !!showKeys[field.id];
                    return (
                      <div key={field.id}>
                        <label className="block text-xs font-semibold text-slate-900 mb-1.5">
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
                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono pr-20"
                          />
                          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => toggleShowKey(field.id)}
                              className="p-1.5 text-slate-400 hover:text-slate-600"
                            >
                              {isVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
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
                  <h3 className="text-base font-bold text-slate-900">GitHub Webhook Integration</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Use these values to configure webhook events in your GitHub repositories.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                      Payload URL
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={webhookUrl}
                        className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-600 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => copyToClipboard(webhookUrl, "Webhook URL")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600"
                      >
                        {copiedKey === "Webhook URL" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                      Webhook Secret Token
                    </label>
                    <div className="relative">
                      <input
                        type={showKeys.webhookSecret ? "text" : "password"}
                        readOnly
                        value={webhookSecret}
                        className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-600 pr-20"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => toggleShowKey("webhookSecret")}
                          className="p-1.5 text-slate-400 hover:text-slate-600"
                        >
                          {showKeys.webhookSecret ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(webhookSecret, "Webhook Secret")}
                          className="p-1.5 text-slate-400 hover:text-slate-600"
                        >
                          {copiedKey === "Webhook Secret" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <h4 className="text-xs font-semibold text-amber-800">Configuration Instructions</h4>
                  <p className="mt-1 text-[11px] text-amber-700 leading-relaxed">
                    1. Go to your GitHub Repository Settings → **Webhooks** → **Add Webhook**.<br />
                    2. Paste the **Payload URL** above.<br />
                    3. Select Content type: **application/json**.<br />
                    4. Paste the **Secret** token above.<br />
                    5. Select events: **Check suites**, **Push** events.<br />
                    6. Click **Add webhook**.
                  </p>
                </div>
              </div>
            )}

            {/* 4. Preferences Tab */}
            {activeTab === "preferences" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">User Preferences</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Configure notifications, displays, and global settings.
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-slate-50">
                    <div>
                      <div className="text-xs font-semibold text-slate-900">Email Notifications</div>
                      <div className="mt-0.5 text-[11px] text-slate-500">
                        Receive email alerts immediately when Agent47 resolves a build failure.
                      </div>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4 accent-slate-900" />
                  </label>

                  <label className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-slate-50">
                    <div>
                      <div className="text-xs font-semibold text-slate-900">Push Alert Webhooks</div>
                      <div className="mt-0.5 text-[11px] text-slate-500">
                        Trigger external Slack or Discord messages when fixes are pushed.
                      </div>
                    </div>
                    <input type="checkbox" className="h-4 w-4 accent-slate-900" />
                  </label>

                  <label className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-slate-50">
                    <div>
                      <div className="text-xs font-semibold text-slate-900">Platform Dark Mode</div>
                      <div className="mt-0.5 text-[11px] text-slate-500">
                        Enable dark colors across console headers.
                      </div>
                    </div>
                    <input type="checkbox" className="h-4 w-4 accent-slate-900" />
                  </label>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="mt-6 flex justify-end border-t border-slate-200 pt-5">
              <Button type="submit" disabled={saving} className="flex items-center justify-center">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
