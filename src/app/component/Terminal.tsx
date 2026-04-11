"use client";

import { useEffect, useRef, useState } from "react";
import { useApp } from "@/app/context/AppContext";
import { getConstants } from "@/app/utils/constants";

// ─── Types ────────────────────────────────────────────────────────────────────

type LineType = "input" | "output" | "error" | "success" | "dim";

interface TerminalLine {
  id: number;
  type: LineType;
  text: string;
}

let lineId = 0;
function makeLine(type: LineType, text: string): TerminalLine {
  return { id: lineId++, type, text };
}

// ─── Boot sequence ────────────────────────────────────────────────────────────

const BOOT: TerminalLine[] = [
  makeLine("output", "╔══════════════════════════════════════╗"),
  makeLine("output", "║   portfolio-terminal  v1.0.0         ║"),
  makeLine("output", "║   Suleman Ali — Full-Stack Engineer  ║"),
  makeLine("output", "╚══════════════════════════════════════╝"),
  makeLine("dim",    ""),
  makeLine("dim",    "Type 'help' for available commands."),
  makeLine("dim",    "Press Ctrl+` to return to GUI mode."),
  makeLine("dim",    ""),
];

// ─── Line styles ──────────────────────────────────────────────────────────────

const LINE_STYLE: Record<LineType, string> = {
  output:  "text-faint",
  input:   "text-bright",
  error:   "text-red-400",
  success: "text-emerald-400",
  dim:     "text-secondary",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Terminal() {
  const { openProject, openArch, toggleMode } = useApp();
  const { projects } = getConstants();

  const [history, setHistory] = useState<TerminalLine[]>(BOOT);
  const [input, setInput]     = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  const bottomRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);
  const savedInput = useRef("");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const push = (...lines: TerminalLine[]) =>
    setHistory((prev) => [...prev, ...lines]);

  const execute = (raw: string) => {
    const trimmed = raw.trim();
    push(makeLine("input", trimmed || ""));
    setInput("");
    setHistoryIdx(-1);
    if (!trimmed) return;

    setCmdHistory((prev) => {
      if (prev[prev.length - 1] === trimmed) return prev;
      return [...prev, trimmed];
    });

    const parts = trimmed.split(/\s+/);
    const cmd   = parts[0].toLowerCase();
    const args  = parts.slice(1);

    switch (cmd) {
      case "help":
        push(
          makeLine("dim",    ""),
          makeLine("output", "Available commands:"),
          makeLine("dim",    ""),
          makeLine("output", "  help               Show this help message"),
          makeLine("output", "  projects            List all projects"),
          makeLine("output", "  open <slug>         Open a project in GUI mode"),
          makeLine("output", "  arch <slug>         Open system design visualizer"),
          makeLine("output", "  clear               Clear the terminal"),
          makeLine("dim",    ""),
          makeLine("dim",    "Keyboard shortcut: Ctrl+` to toggle GUI / Terminal"),
          makeLine("dim",    ""),
        );
        break;

      case "projects":
        push(makeLine("dim", ""));
        projects.forEach((p, i) => {
          const idx = String(i + 1).padStart(2, " ");
          push(
            makeLine("output", `  [${idx}]  ${p.slug}`),
            makeLine("dim",    `         ${p.name}`),
            makeLine("dim",    `         ${p.description.slice(0, 72)}${p.description.length > 72 ? "…" : ""}`),
            makeLine("dim",    ""),
          );
        });
        push(
          makeLine("dim", `  ${projects.length} project${projects.length !== 1 ? "s" : ""} found`),
          makeLine("dim", ""),
          makeLine("dim", "  Run  open <slug>  or  arch <slug>  to explore."),
          makeLine("dim", ""),
        );
        break;

      case "open": {
        const slug = args[0];
        if (!slug) { push(makeLine("error", "Usage: open <slug>  — run 'projects' to see slugs")); break; }
        const project = projects.find((p) => p.slug === slug);
        if (!project) {
          push(makeLine("error", `Project '${slug}' not found.`), makeLine("dim", "Run 'projects' to see available slugs."));
          break;
        }
        push(makeLine("success", `Opening ${project.name} …`), makeLine("dim", "Switching to GUI mode."));
        setTimeout(() => openProject(slug), 650);
        break;
      }

      case "arch": {
        const slug = args[0];
        if (!slug) { push(makeLine("error", "Usage: arch <slug>  — run 'projects' to see slugs")); break; }
        const project = projects.find((p) => p.slug === slug);
        if (!project) {
          push(makeLine("error", `Project '${slug}' not found.`), makeLine("dim", "Run 'projects' to see available slugs."));
          break;
        }
        push(makeLine("success", `Opening architecture for ${project.name} …`), makeLine("dim", "Switching to GUI mode."));
        setTimeout(() => openArch(slug), 650);
        break;
      }

      case "clear":
        setHistory([]);
        break;

      case "gui":
        push(makeLine("success", "Switching to GUI mode …"));
        setTimeout(() => toggleMode(), 400);
        break;

      default:
        push(
          makeLine("error", `command not found: ${cmd}`),
          makeLine("dim",   "Type 'help' for available commands."),
        );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { execute(input); return; }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      if (historyIdx === -1) {
        savedInput.current = input;
        setHistoryIdx(0);
        setInput(cmdHistory[cmdHistory.length - 1]);
      } else if (historyIdx < cmdHistory.length - 1) {
        const newIdx = historyIdx + 1;
        setHistoryIdx(newIdx);
        setInput(cmdHistory[cmdHistory.length - 1 - newIdx]);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx === -1) return;
      if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInput(savedInput.current);
      } else {
        const newIdx = historyIdx - 1;
        setHistoryIdx(newIdx);
        setInput(cmdHistory[cmdHistory.length - 1 - newIdx]);
      }
      return;
    }

    if (historyIdx !== -1 && e.key.length === 1) setHistoryIdx(-1);
  };

  return (
    <div
      className="fixed inset-0 z-30 flex flex-col bg-canvas font-mono"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Header bar */}
      <div className="flex-shrink-0 flex items-center justify-between border-b border-edge px-5 py-3 bg-surface">
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-accent">portfolio-terminal</span>
          <span className="text-[10px] text-secondary">v1.0.0</span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); toggleMode(); }}
          className="flex items-center gap-1.5 text-[10px] text-label border border-edge px-2.5 py-1 hover:border-accent hover:text-accent transition-all duration-150"
        >
          <span>⬚</span>
          <span>GUI</span>
        </button>
      </div>

      {/* Output area */}
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-2">
        {history.map((line) => (
          <div key={line.id} className="leading-[1.7] text-[13px] whitespace-pre-wrap break-all">
            {line.type === "input" ? (
              <span>
                <span className="text-label select-none">portfolio &gt; </span>
                <span className={LINE_STYLE.input}>{line.text}</span>
              </span>
            ) : (
              <span className={LINE_STYLE[line.type]}>{line.text}</span>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="flex-shrink-0 flex items-center border-t border-edge bg-surface px-5 py-3">
        <span className="text-label text-[13px] select-none flex-shrink-0 mr-2">
          portfolio &gt;
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-bright text-[13px] outline-none caret-accent placeholder:text-secondary"
          placeholder="type a command…"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        <span className="text-[10px] text-secondary select-none">↵</span>
      </div>
    </div>
  );
}
