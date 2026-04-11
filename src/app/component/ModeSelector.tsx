"use client";

import { useApp, type AppMode } from "@/app/context/AppContext";

export default function ModeSelector() {
  const { setMode } = useApp();

  const choose = (m: AppMode) => setMode(m);

  return (
    <div className="fixed inset-0 z-[100] bg-canvas flex items-center justify-center">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <style>{`
        @keyframes selectorFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .selector-fadein { animation: selectorFadeUp 0.4s ease both; }
      `}</style>

      <div className="selector-fadein relative z-10 flex flex-col items-center gap-10 px-6 text-center max-w-md w-full">
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-label mb-4">
            Welcome
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-bright tracking-tight mb-4 leading-tight">
            How do you want
            <br />
            to browse?
          </h1>
          <p className="font-mono text-sm text-label">
            You can toggle between modes anytime.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <button
            onClick={() => choose("terminal")}
            className="group flex flex-col items-center gap-3 border border-edge bg-surface hover:border-accent hover:bg-hover transition-all duration-150 px-6 py-9 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent cursor-pointer"
          >
            <span className="font-mono text-2xl text-accent opacity-40 group-hover:opacity-100 transition-opacity duration-150">
              &gt;_
            </span>
            <span className="font-mono text-bright text-sm font-medium">Terminal</span>
            <span className="font-mono text-secondary text-[11px] group-hover:text-muted transition-colors duration-150">
              keyboard-first
            </span>
          </button>

          <button
            onClick={() => choose("gui")}
            className="group flex flex-col items-center gap-3 border border-edge bg-surface hover:border-accent hover:bg-hover transition-all duration-150 px-6 py-9 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent cursor-pointer"
          >
            <span className="text-2xl text-accent opacity-40 group-hover:opacity-100 transition-opacity duration-150">
              ⬚
            </span>
            <span className="font-mono text-bright text-sm font-medium">GUI</span>
            <span className="font-mono text-secondary text-[11px] group-hover:text-muted transition-colors duration-150">
              visual layout
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
