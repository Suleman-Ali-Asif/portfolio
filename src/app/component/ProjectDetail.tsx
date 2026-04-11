"use client";

import { useApp } from "@/app/context/AppContext";
import { getConstants } from "@/app/utils/constants";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import SystemDesignVisualizer from "./SystemDesignVisualizer";

type Tab = "overview" | "arch";

export default function ProjectDetail() {
  const { selectedSlug, view, closeProject } = useApp();
  const { projects } = getConstants();
  const project = projects.find((p) => p.slug === selectedSlug) ?? null;

  const [activeTab, setActiveTab] = useState<Tab>("overview");

  useEffect(() => {
    setActiveTab(view === "arch" ? "arch" : "overview");
  }, [view, selectedSlug]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeProject();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeProject]);

  return (
    <AnimatePresence>
      {selectedSlug && project && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm cursor-pointer"
            onClick={closeProject}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              damping: 28,
              stiffness: 260,
              mass: 0.8,
            }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full lg:w-[720px] bg-canvas border-l border-edge flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex-shrink-0 border-b border-edge px-6 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-1">
                {(["overview", ...(project.architecture ? ["arch"] : [])] as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 font-mono text-[11px] border transition-all duration-150 ${
                      activeTab === tab
                        ? "border-accent text-accent bg-accent/5"
                        : "border-edge text-muted hover:border-label hover:text-body"
                    }`}
                  >
                    {tab === "overview" ? "Overview" : "Architecture"}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 font-mono text-[11px] text-muted hover:text-accent transition-colors duration-150"
                  >
                    {project.url.replace(/^https?:\/\//, "")}
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                )}
                <button
                  onClick={closeProject}
                  className="p-1.5 text-muted hover:text-bright transition-colors duration-150"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Slug breadcrumb */}
            <div className="flex-shrink-0 px-6 py-2 border-b border-edge-soft bg-surface">
              <span className="font-mono text-[10px] text-faint opacity-40">
                projects / {project.slug}
              </span>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-6 lg:px-10 py-10">
              <AnimatePresence mode="wait">
                {activeTab === "overview" ? (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                  >
                    <h2 className="text-3xl font-bold text-bright tracking-tight mb-3">
                      {project.name}
                    </h2>

                    <p className="text-body text-sm leading-relaxed mb-8 max-w-lg">
                      {project.description}
                    </p>

                    <p className="text-label font-mono text-[10px] tracking-[0.2em] uppercase mb-3">
                      Tech Stack
                    </p>
                    <div className="flex flex-wrap gap-2 mb-10">
                      {project.stack.map((tag) => (
                        <span
                          key={tag}
                          className="text-muted font-mono text-[11px] border border-edge px-2.5 py-1 rounded-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {project.problem && (
                      <div className="mb-8">
                        <p className="text-label font-mono text-[10px] tracking-[0.2em] uppercase mb-3">
                          Problem
                        </p>
                        <p className="text-body text-sm leading-relaxed">
                          {project.problem}
                        </p>
                      </div>
                    )}

                    {project.whatIBuilt && project.whatIBuilt.length > 0 && (
                      <div className="mb-8">
                        <p className="text-label font-mono text-[10px] tracking-[0.2em] uppercase mb-3">
                          What I Built
                        </p>
                        <ul className="space-y-2">
                          {project.whatIBuilt.map((item, i) => (
                            <li
                              key={i}
                              className="flex gap-3 text-sm text-body"
                            >
                              <span className="text-accent font-mono flex-shrink-0 mt-0.5">
                                —
                              </span>
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {project.engineeringWork &&
                      project.engineeringWork.length > 0 && (
                        <div className="mb-8">
                          <p className="text-label font-mono text-[10px] tracking-[0.2em] uppercase mb-3">
                            Engineering Work
                          </p>
                          <ul className="space-y-2">
                            {project.engineeringWork.map((item, i) => (
                              <li
                                key={i}
                                className="flex gap-3 text-sm text-body"
                              >
                                <span className="text-accent font-mono flex-shrink-0 mt-0.5">
                                  —
                                </span>
                                <span className="leading-relaxed">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {project.impact && project.impact.length > 0 && (
                      <div className="mb-8">
                        <p className="text-label font-mono text-[10px] tracking-[0.2em] uppercase mb-3">
                          Impact
                        </p>
                        <ul className="space-y-2">
                          {project.impact.map((item, i) => (
                            <li
                              key={i}
                              className="flex gap-3 text-sm text-body"
                            >
                              <span className="text-label font-mono flex-shrink-0 mt-0.5">
                                ↑
                              </span>
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {project.requestFlow && project.requestFlow.length > 0 && (
                      <div className="mb-10">
                        <p className="text-label font-mono text-[10px] tracking-[0.2em] uppercase mb-3">
                          Request Flow
                        </p>
                        <ol className="space-y-2.5">
                          {project.requestFlow.map((step, i) => (
                            <li
                              key={i}
                              className="flex gap-3 text-sm text-body"
                            >
                              <span className="text-faint font-mono text-[10px] tabular-nums flex-shrink-0 mt-0.5 w-5">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <span className="leading-relaxed">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* Architecture teaser */}
                    {project.architecture && (
                      <div className="border border-edge bg-surface p-5">
                        <p className="text-label font-mono text-[10px] tracking-[0.2em] uppercase mb-2">
                          System Design
                        </p>
                        <p className="text-body text-sm leading-relaxed mb-4">
                          {project.architecture.summary}
                        </p>
                        <button
                          onClick={() => setActiveTab("arch")}
                          className="font-mono text-[11px] text-accent border border-accent px-3 py-1.5 hover:bg-accent/5 transition-colors duration-150"
                        >
                          View Architecture →
                        </button>
                      </div>
                    )}
                  </motion.div>
                ) : project.architecture ? (
                  <motion.div
                    key="arch"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                  >
                    <p className="text-label font-mono text-[10px] tracking-[0.25em] uppercase mb-6">
                      System Architecture
                    </p>
                    <SystemDesignVisualizer
                      architecture={project.architecture}
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
