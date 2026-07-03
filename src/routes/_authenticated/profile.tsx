import { createFileRoute } from "@tanstack/react-router";
import { useAuthStore } from "#/store/auth";
import {
  GitBranch,
  Box,
  CheckCircle2,
  Clock,
  User as UserIcon,
  Calendar,
  Github,
  ShieldCheck,
  Activity,
  Loader2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "#/lib/api";
import type { BaseResponse } from "#/types";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

const iconMap: Record<string, any> = {
  GitBranch,
  Box,
  CheckCircle2,
  Clock,
};

function formatRelativeTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    if (diffMs < 0) return "just now";

    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "yesterday";
    return `${diffDays}d ago`;
  } catch {
    return dateStr;
  }
}

function formatJoinedDate(dateStr?: string): string {
  if (!dateStr) return "--";
  try {
    const d = new Date(dateStr);
    const month = d.toLocaleString("en-US", { month: "long" });
    const year = d.getFullYear();
    return `Joined ${month} ${year}`;
  } catch {
    return "--";
  }
}

function ProfilePage() {
  const user = useAuthStore((s) => s.user);

  // Fetch count of tracked repos and recent activities dynamically
  const { data: profileStats, isLoading: isLoadingStats } = useQuery<{
    stats: {
      label: string;
      value: string | number;
      icon: string;
      color: string;
    }[];
    activities: {
      title: string;
      desc: string;
      time: string;
      type: string;
    }[];
  }>({
    queryKey: ["profile", "stats"],
    queryFn: async () => {
      const { data } = await api.get<BaseResponse<any>>("/auth/profile-stats");
      return data.data;
    },
  });

  const stats = profileStats?.stats || [
    {
      label: "Tracked Repositories",
      value: "...",
      icon: "GitBranch",
      color: "text-cyan-400 bg-cyan-950/40 border border-cyan-900/60",
    },
    {
      label: "Total Builds Run",
      value: "...",
      icon: "Box",
      color: "text-violet-400 bg-violet-950/40 border border-violet-900/60",
    },
    {
      label: "AI Resolution Rate",
      value: "...",
      icon: "CheckCircle2",
      color: "text-emerald-400 bg-emerald-950/40 border border-emerald-900/60",
    },
    {
      label: "Avg CI Duration",
      value: "...",
      icon: "Clock",
      color: "text-amber-400 bg-amber-950/40 border border-amber-900/60",
    },
  ];

  const activities = profileStats?.activities || [];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100 font-sans">Profile</h1>
        <p className="mt-1 text-sm text-zinc-400 font-sans">
          View your account details, integration credentials, and platform performance history.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* User Card */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm flex flex-col items-center text-center">
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user?.username}
              className="h-24 w-24 rounded-full border-2 border-zinc-700 shadow-sm mb-4"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 mb-4 shadow-sm">
              <UserIcon className="h-10 w-10" />
            </div>
          )}

          <h2 className="text-lg font-bold text-zinc-100 font-sans">{user?.username}</h2>
          {user?.email && <p className="text-xs text-zinc-400 mt-0.5 font-mono">{user?.email}</p>}

          <div className="mt-6 w-full space-y-3.5 border-t border-zinc-800 pt-5 text-left text-xs text-zinc-350">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0 text-zinc-500" />
              <span>{formatJoinedDate(user?.created_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Github className="h-4 w-4 shrink-0 text-zinc-500" />
              <span>Connected via GitHub OAuth</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-zinc-500" />
              <span>Developer Account (Admin)</span>
            </div>
          </div>
        </div>

        {/* Stats and Activity Grid */}
        <div className="md:col-span-2 space-y-6">
          {/* Stats row */}
          <div className="grid gap-4 sm:grid-cols-2">
            {stats.map((stat, i) => {
              const Icon = iconMap[stat.icon] || Box;
              return (
                <div
                  key={i}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-sm flex items-center gap-4 animate-none"
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-zinc-100 leading-tight font-mono">
                      {stat.value}
                    </div>
                    <div className="mt-0.5 text-xs font-semibold text-zinc-400 font-sans">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Activity timeline card */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-4">
              <Activity className="h-4 w-4 text-zinc-400" />
              <h3 className="text-sm font-semibold text-zinc-100 font-sans">
                Recent Platform Activity
              </h3>
            </div>

            <div className="relative border-l border-zinc-800 pl-5 ml-2.5 space-y-6">
              {isLoadingStats && (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
                </div>
              )}
              {!isLoadingStats && activities.length === 0 && (
                <p className="text-xs font-mono text-zinc-500 py-2">
                  No platform activity recorded yet.
                </p>
              )}
              {activities.map((act, i) => (
                <div key={i} className="relative">
                  {/* Timeline point */}
                  <span className="absolute -left-[27px] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-zinc-950 border-2 border-zinc-700" />

                  <div className="flex items-baseline justify-between gap-4">
                    <h4 className="text-xs font-bold text-zinc-200 font-sans">{act.title}</h4>
                    <span className="text-[10px] text-zinc-500 shrink-0 font-mono">
                      {formatRelativeTime(act.time)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-450 leading-relaxed font-mono">{act.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
