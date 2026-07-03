import { useState, useRef, useEffect, useMemo } from "react";
import type { LogSection } from "#/types/repo.type";
import { Search, Copy, Check, ChevronDown, ChevronRight, AlertCircle } from "lucide-react";

interface BuildLogViewerProps {
  sections: LogSection[];
}

export default function BuildLogViewer({ sections }: BuildLogViewerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState<Set<number>>(() => {
    // Auto-expand sections with errors, or all if none have errors
    const errorIndices = new Set<number>();
    sections.forEach((s, i) => {
      if (s.has_error) errorIndices.add(i);
    });
    return errorIndices.size > 0 ? errorIndices : new Set(sections.map((_, i) => i));
  });
  const [copied, setCopied] = useState(false);
  const firstErrorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to first error
    const timer = setTimeout(() => {
      firstErrorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const allLogText = useMemo(
    () => sections.map((s) => `=== ${s.phase.toUpperCase()} ===\n${s.lines.join("\n")}`).join("\n\n"),
    [sections],
  );

  const copyLogs = async () => {
    await navigator.clipboard.writeText(allLogText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  let foundFirstError = false;

  const isErrorLine = (line: string) =>
    /error|ERR!|FAIL|failed|exception|panic|fatal/i.test(line) && !/\d+ error/.test(line);

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
      {/* Toolbar */}
      <div className="flex items-center gap-3 border-b border-zinc-800 bg-zinc-900 px-4 py-2.5">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 py-1.5 pl-9 pr-3 text-xs text-zinc-300 placeholder-zinc-650 focus:border-zinc-500 focus:outline-none font-mono"
          />
        </div>
        <button
          onClick={copyLogs}
          className="flex items-center gap-1.5 rounded-md border border-zinc-750 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-400 transition hover:border-zinc-500 hover:text-zinc-200 font-mono"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* Log sections */}
      <div className="max-h-[600px] overflow-y-auto">
        {sections.map((section, sectionIndex) => {
          const isExpanded = expandedSections.has(sectionIndex);
          const filteredLines = searchQuery
             ? section.lines.filter((l) => l.toLowerCase().includes(searchQuery.toLowerCase()))
             : section.lines;

          return (
            <div key={sectionIndex} className="border-b border-zinc-800 last:border-0">
              {/* Section header */}
              <button
                onClick={() => toggleSection(sectionIndex)}
                className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs font-medium transition ${
                  section.has_error
                    ? "bg-red-950/40 text-red-400 hover:bg-red-950/60"
                    : "bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800/50"
                }`}
              >
                {isExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                )}
                <span className="font-semibold uppercase tracking-wider font-sans">{section.phase}</span>
                {section.has_error && <AlertCircle className="h-3.5 w-3.5 text-red-400" />}
                {section.duration_ms != null && (
                  <span className="ml-auto text-zinc-500 font-mono">
                    {section.duration_ms < 1000
                      ? `${section.duration_ms}ms`
                      : `${(section.duration_ms / 1000).toFixed(1)}s`}
                  </span>
                )}
                <span className="text-zinc-500 font-mono ml-2">{section.lines.length} lines</span>
              </button>

              {/* Section content */}
              {isExpanded && (
                <div className="bg-zinc-950 px-4 py-2 font-mono text-xs leading-5">
                  {filteredLines.map((line, lineIndex) => {
                    const isError = isErrorLine(line);
                    const isFirstError = isError && !foundFirstError;
                    if (isFirstError) foundFirstError = true;
                    const highlight =
                      searchQuery && line.toLowerCase().includes(searchQuery.toLowerCase());

                    return (
                      <div
                        key={lineIndex}
                        ref={isFirstError ? firstErrorRef : undefined}
                        className={`border-l-2 py-px pl-3 ${
                          isError
                            ? "border-red-500 bg-red-950/30 text-red-300"
                            : highlight
                              ? "border-amber-500 bg-amber-950/20 text-amber-200"
                              : "border-transparent text-zinc-450"
                        }`}
                      >
                        <span className="mr-4 inline-block w-8 select-none text-right text-zinc-650">
                          {lineIndex + 1}
                        </span>
                        {line}
                      </div>
                    );
                  })}
                  {filteredLines.length === 0 && searchQuery && (
                    <div className="py-4 text-center text-zinc-550 font-mono">
                      No matching lines in this section
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
