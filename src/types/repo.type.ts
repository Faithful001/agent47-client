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
  owner: string;
  default_branch: string;
  build_command: string;
  test_command: string;
  start_command: string;
  root_directory: string;
  created_at: string;
  user_id: string;
  id: string;
  name: string;
  full_name: string;
  webhook_id: number;
  install_command: string;
  env_vars: string;
  is_active: boolean;
  builds: BuildItem[];
};

export type UpdateRepoPayload = {
  build_command?: string;
  start_command?: string;
  test_command?: string;
  root_directory?: string;
  install_command?: string;
  env_vars?: string;
};
