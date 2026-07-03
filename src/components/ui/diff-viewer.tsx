import { useState } from "react";
import type { FileDiff, DiffHunk, DiffLine } from "#/types/repo.type";
import { ChevronDown, ChevronRight, File, FilePlus, FileMinus, FileEdit } from "lucide-react";

interface DiffViewerProps {
  files: FileDiff[];
  totalAdditions: number;
  totalDeletions: number;
}

const statusIcon: Record<FileDiff["status"], typeof File> = {
  added: FilePlus,
  removed: FileMinus,
  modified: FileEdit,
  renamed: FileEdit,
};

const statusColor: Record<FileDiff["status"], string> = {
  added: "text-emerald-500",
  removed: "text-red-500",
  modified: "text-amber-500",
  renamed: "text-blue-500",
};

function HunkView({ hunk }: { hunk: DiffHunk }) {
  return (
    <div>
      {/* Hunk header */}
      <div className="diff-hunk-header bg-zinc-800 border-zinc-800 px-4 py-1 font-mono text-[11px] text-cyan-400">
        @@ -{hunk.old_start},{hunk.old_count} +{hunk.new_start},{hunk.new_count} @@
      </div>
      {/* Lines */}
      {hunk.lines.map((line, i) => (
        <DiffLineView key={i} line={line} />
      ))}
    </div>
  );
}

function DiffLineView({ line }: { line: DiffLine }) {
  const bgClass =
    line.type === "addition"
      ? "diff-line-add"
      : line.type === "deletion"
        ? "diff-line-del"
        : "diff-line-ctx";

  const prefix = line.type === "addition" ? "+" : line.type === "deletion" ? "-" : " ";

  return (
    <div className={`diff-line ${bgClass} flex font-mono text-xs leading-5`}>
      <span className="diff-line-num inline-block w-12 select-none border-r border-zinc-800 pr-2 text-right text-zinc-500">
        {line.old_line_number ?? ""}
      </span>
      <span className="diff-line-num inline-block w-12 select-none border-r border-zinc-800 pr-2 text-right text-zinc-500">
        {line.new_line_number ?? ""}
      </span>
      <span className="diff-prefix inline-block w-5 select-none text-center">{prefix}</span>
      <span className="flex-1 whitespace-pre-wrap break-all pl-1">{line.content}</span>
    </div>
  );
}

function FileHeader({
  file,
  isExpanded,
  onToggle,
}: {
  file: FileDiff;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const Icon = statusIcon[file.status];
  const color = statusColor[file.status];

  return (
    <button
      onClick={onToggle}
      className="flex w-full items-center gap-2 border-b border-zinc-800 bg-zinc-900 px-4 py-2 text-left text-xs transition hover:bg-zinc-850"
    >
      {isExpanded ? (
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
      ) : (
        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
      )}
      <Icon className={`h-4 w-4 shrink-0 ${color}`} strokeWidth={1.8} />
      <span className="flex-1 truncate font-mono text-xs text-zinc-300">
        {file.old_filename ? (
          <>
            <span className="text-zinc-550 line-through">{file.old_filename}</span>
            <span className="mx-1.5 text-zinc-500">→</span>
            {file.filename}
          </>
        ) : (
          file.filename
        )}
      </span>
      <span className="flex items-center gap-2 text-xs font-mono">
        {file.additions > 0 && <span className="font-semibold text-emerald-400">+{file.additions}</span>}
        {file.deletions > 0 && <span className="font-semibold text-red-400">−{file.deletions}</span>}
      </span>
    </button>
  );
}

export default function DiffViewer({ files, totalAdditions, totalDeletions }: DiffViewerProps) {
  const [expandedFiles, setExpandedFiles] = useState<Set<number>>(
    () => new Set(files.map((_, i) => i)),
  );
  const [selectedFile, setSelectedFile] = useState<number | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  const toggleFile = (index: number) => {
    setExpandedFiles((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const scrollToFile = (index: number) => {
    setSelectedFile(index);
    // Ensure the file is expanded
    setExpandedFiles((prev) => new Set(prev).add(index));
    document.getElementById(`diff-file-${index}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-md">
      {/* Stats bar */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50 px-4 py-2">
        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-[10px] font-mono text-zinc-300 transition hover:bg-zinc-700 hover:text-zinc-150"
          >
            {showSidebar ? "Hide" : "Show"} file tree
          </button>
          <span className="font-mono">{files.length} file{files.length !== 1 ? "s" : ""} changed</span>
          <span className="font-mono text-emerald-400">+{totalAdditions}</span>
          <span className="font-mono text-red-400">−{totalDeletions}</span>
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={() => setExpandedFiles(new Set(files.map((_, i) => i)))}
            className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-[10px] font-mono text-zinc-300 transition hover:bg-zinc-700 hover:text-zinc-150"
          >
            Expand all
          </button>
          <button
            onClick={() => setExpandedFiles(new Set())}
            className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-[10px] font-mono text-zinc-300 transition hover:bg-zinc-700 hover:text-zinc-150"
          >
            Collapse all
          </button>
        </div>
      </div>

      <div className="flex">
        {/* File tree sidebar */}
        {showSidebar && (
          <div className="w-64 shrink-0 border-r border-zinc-800 bg-zinc-950/40">
            <div className="p-2">
              {files.map((file, index) => {
                const Icon = statusIcon[file.status];
                const color = statusColor[file.status];
                const isSelected = selectedFile === index;
                // Extract just the filename from path
                const parts = file.filename.split("/");
                const name = parts.pop()!;
                const dir = parts.join("/");

                return (
                  <button
                    key={index}
                    onClick={() => scrollToFile(index)}
                    className={`flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left transition ${
                      isSelected
                        ? "bg-zinc-850 text-cyan-400 border border-zinc-750"
                        : "text-zinc-400 hover:bg-zinc-850"
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 shrink-0 ${color}`} strokeWidth={1.8} />
                    <div className="min-w-0 flex-1 font-mono">
                      <div className="truncate text-xs font-medium">{name}</div>
                      {dir && (
                        <div className="truncate text-[10px] text-zinc-550">{dir}</div>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-[10px] font-mono">
                      {file.additions > 0 && <span className="text-emerald-400">+{file.additions}</span>}
                      {file.deletions > 0 && <span className="text-red-400">−{file.deletions}</span>}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Diff content */}
        <div className="min-w-0 flex-1">
          {files.map((file, index) => (
            <div key={index} id={`diff-file-${index}`}>
              <FileHeader
                file={file}
                isExpanded={expandedFiles.has(index)}
                onToggle={() => toggleFile(index)}
              />
              {expandedFiles.has(index) && (
                <div className="overflow-x-auto bg-zinc-950">
                  {file.hunks.map((hunk, hunkIndex) => (
                    <HunkView key={hunkIndex} hunk={hunk} />
                  ))}
                  {file.hunks.length === 0 && (
                    <div className="py-6 text-center text-xs font-mono text-zinc-550">
                      Binary file or no visible changes
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
