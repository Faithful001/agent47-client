export type BuildItem = {
  user_id: string;
  branch: string;
  commit_description: string;
  pusher: string;
  id: string;
  repo_id: string;
  commit_title: string;
  commit_sha: string;
  created_at: string;
};

export type TrackedRepo = {
  id: string;
  default_branch: string;
  is_active: boolean;
  owner: string;
  user_id: string;
  name: string;
  full_name: string;
  webhook_id: number;
  created_at: string;
  builds: BuildItem[];
};
