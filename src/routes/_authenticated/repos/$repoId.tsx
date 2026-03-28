import { api } from "#/lib/api";
import { getErrorMessage } from "#/lib/utils/get-error-message";
import type { BaseResponse } from "#/types";
import type { TrackedRepo } from "#/types/repo";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { User } from "lucide-react";

export const Route = createFileRoute("/_authenticated/repos/$repoId")({
  component: RepoDetailsPage,
});

function RepoDetailsPage() {
  const { repoId } = Route.useParams();

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

  return (
    <div className="mx-auto max-w-5xl">
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {getErrorMessage(error)}
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h1 className="flex h-8 items-center text-2xl font-bold tracking-tight text-slate-900">
              {isLoading ? (
                <div className="h-7 w-64 animate-pulse rounded-md bg-slate-200" />
              ) : (
                repo?.name
              )}
            </h1>
          </div>

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
        </>
      )}
    </div>
  );
}
