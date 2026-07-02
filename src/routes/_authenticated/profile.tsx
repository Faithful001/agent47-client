import { createFileRoute } from "@tanstack/react-router";
import { useAuthStore } from "#/store/auth";
import { GitBranch, Box, CheckCircle2, Clock, User as UserIcon, Calendar, Github, ShieldCheck, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "#/lib/api";
import type { BaseResponse } from "#/types";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

type TrackedRepo = {
  id: number;
  name: string;
  full_name: string;
  is_active: boolean;
};

function ProfilePage() {
  const user = useAuthStore((s) => s.user);

  // Fetch count of tracked repos to display live stats
  const { data: repos } = useQuery<TrackedRepo[]>({
    queryKey: ["repos", "tracked"],
    queryFn: async () => {
      const { data } = await api.get<BaseResponse<TrackedRepo[]>>("/repos/tracked");
      return data.data;
    },
  });

  const stats = [
    {
      label: "Tracked Repositories",
      value: repos?.length ?? 1,
      icon: GitBranch,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Total Builds Run",
      value: 12,
      icon: Box,
      color: "text-violet-600 bg-violet-50",
    },
    {
      label: "AI Resolution Rate",
      value: "83.3%",
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Avg CI Duration",
      value: "42.3s",
      icon: Clock,
      color: "text-amber-600 bg-amber-50",
    },
  ];

  const activities = [
    {
      title: "GitHub hook processed",
      desc: "Push event tracked for branch main on repo Faithful001/cortex-ai-server-agent47",
      time: "2 hours ago",
      type: "webhook",
    },
    {
      title: "Automated Fix Opened",
      desc: "Pull Request #4 created: 'Automated Code Fix: Agent47 Resolution'",
      time: "4 hours ago",
      type: "fix",
    },
    {
      title: "CI Pipeline run failed",
      desc: "Build 'build-001' on repository cortex-ai-server failed (Test failures detected)",
      time: "4 hours ago",
      type: "ci_fail",
    },
    {
      title: "New Repository tracked",
      desc: "Connected repository Faithful001/cortex-ai-server-agent47 to monitoring",
      time: "1 day ago",
      type: "repo_add",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">Profile</h1>
        <p className="mt-1 text-sm text-slate-500">
          View your account details, integration credentials, and platform performance history.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* User Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col items-center text-center">
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user?.username}
              className="h-24 w-24 rounded-full border-2 border-slate-200 shadow-sm mb-4"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-slate-600 border border-slate-200 mb-4 shadow-sm">
              <UserIcon className="h-10 w-10" />
            </div>
          )}

          <h2 className="text-lg font-bold text-slate-900">{user?.username || "Agent47 User"}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{user?.email || "user@example.com"}</p>

          <div className="mt-6 w-full space-y-3.5 border-t border-slate-100 pt-5 text-left text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="h-4 w-4 shrink-0 text-slate-400" />
              <span>Joined July 2026</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Github className="h-4 w-4 shrink-0 text-slate-400" />
              <span>Connected via GitHub OAuth</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <ShieldCheck className="h-4 w-4 shrink-0 text-slate-400" />
              <span>Developer Account (Admin)</span>
            </div>
          </div>
        </div>

        {/* Stats and Activity Grid */}
        <div className="md:col-span-2 space-y-6">
          {/* Stats row */}
          <div className="grid gap-4 sm:grid-cols-2">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 leading-tight">{stat.value}</div>
                    <div className="mt-0.5 text-xs font-semibold text-slate-500">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Activity timeline card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <Activity className="h-4 w-4 text-slate-500" />
              <h3 className="text-sm font-semibold text-slate-900">Recent Platform Activity</h3>
            </div>

            <div className="relative border-l border-slate-200 pl-5 ml-2.5 space-y-6">
              {activities.map((act, i) => (
                <div key={i} className="relative">
                  {/* Timeline point */}
                  <span className="absolute -left-[27px] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white border-2 border-slate-400" />
                  
                  <div className="flex items-baseline justify-between gap-4">
                    <h4 className="text-xs font-bold text-slate-900">{act.title}</h4>
                    <span className="text-[10px] text-slate-400 shrink-0">{act.time}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">{act.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
