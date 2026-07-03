export type BuildStatus = "success" | "failed" | "in_progress" | "pending";

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
  status?: BuildStatus;
};

export type DiffHunk = {
  old_start: number;
  old_count: number;
  new_start: number;
  new_count: number;
  lines: DiffLine[];
};

export type DiffLine = {
  type: "addition" | "deletion" | "context";
  content: string;
  old_line_number?: number;
  new_line_number?: number;
};

export type FileDiff = {
  filename: string;
  status: "added" | "modified" | "removed" | "renamed";
  additions: number;
  deletions: number;
  hunks: DiffHunk[];
  old_filename?: string; // for renames
};

export type LogSection = {
  phase: string; // "install" | "build" | "test" | etc.
  lines: string[];
  has_error: boolean;
  duration_ms?: number;
};

export type IssueSeverity = "critical" | "warning" | "info";

export type IdentifiedIssue = {
  title: string;
  description: string;
  severity: IssueSeverity;
  file?: string;
  line?: number;
};

export type BuildDetail = {
  id: string;
  repo_id: string;
  user_id: string;
  commit_title: string;
  commit_description: string;
  commit_sha: string;
  branch: string;
  pusher: string;
  pusher_avatar?: string;
  created_at: string;
  status: BuildStatus;
  duration_ms?: number;
  files_changed: FileDiff[];
  log_sections: LogSection[];
  fix_summary?: string; // markdown
  identified_issues: IdentifiedIssue[];
  total_additions: number;
  total_deletions: number;
  pr_url?: string;
  contract_status?: string;
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
