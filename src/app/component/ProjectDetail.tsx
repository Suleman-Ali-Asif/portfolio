"use client";

import { useApp } from "@/app/context/AppContext";
import { getConstants } from "@/app/utils/constants";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import ArchThumb from "./ArchThumb";
import SystemDesignVisualizer from "./SystemDesignVisualizer";

type Tab = "overview" | "arch";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 font-display text-[16px] font-semibold tracking-tight text-text">
      {children}
    </h3>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="max-w-[620px] list-disc space-y-2 pl-5 text-[15.5px] leading-[1.6] text-body marker:text-faint">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export default function ProjectDetail() {
  const { selectedSlug, view, closeProject } = useApp();
  const { projects } = getConstants();
  const project = projects.find((p) => p.slug === selectedSlug) ?? null;
  const reduceMotion = useReducedMotion();

  const [activeTab, setActiveTab] = useState<Tab>("overview");

  useEffect(() => {
    setActiveTab(view === "arch" ? "arch" : "overview");
  }, [view, selectedSlug]);

  useEffect(() => {
    if (!selectedSlug) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeProject();
    };
    window.addEventListener("keydown", handler);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = prev;
    };
  }, [selectedSlug, closeProject]);

  const tabs: Tab[] = project?.architecture ? ["overview", "arch"] : ["overview"];

  return (
    <AnimatePresence>
      {selectedSlug && project && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 cursor-pointer"
            style={{ backgroundColor: "var(--scrim)" }}
            onClick={closeProject}
            aria-hidden="true"
          />

          <motion.div
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-detail-title"
            initial={reduceMotion ? { opacity: 0 } : { x: "100%" }}
            animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { x: "100%" }}
            transition={
              reduceMotion
                ? { duration: 0.15 }
                : { type: "spring", damping: 30, stiffness: 280, mass: 0.8 }
            }
            className="fixed inset-y-0 right-0 z-50 flex w-full flex-col overflow-hidden bg-bg lg:w-[760px] lg:border-l lg:border-border"
          >
            {/* Header */}
            <div className="flex flex-shrink-0 items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-8">
              <div
                role="tablist"
                aria-label="Project sections"
                className="inline-flex gap-1"
              >
                {tabs.map((tab) => {
                  const selected = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      role="tab"
                      type="button"
                      aria-selected={selected}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1.5 text-[14px] transition-colors duration-200 cursor-pointer ${
                        selected
                          ? "text-text underline decoration-text decoration-1 underline-offset-[6px]"
                          : "text-muted hover:text-text"
                      }`}
                    >
                      {tab === "overview" ? "Overview" : "Architecture"}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-muted hidden items-center gap-1 text-[13.5px] sm:inline-flex"
                  >
                    {project.url.replace(/^https?:\/\//, "")}
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={closeProject}
                  aria-label="Close project details"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted transition-colors duration-200 hover:bg-surface-2 hover:text-text cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
              <AnimatePresence mode="wait">
                {activeTab === "overview" ? (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                  >
                    <h2
                      id="project-detail-title"
                      className="font-display text-[clamp(1.9rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-text"
                    >
                      {project.name}
                    </h2>
                    <p className="mt-3 max-w-[600px] text-[15.5px] leading-[1.6] text-body">
                      {project.description}
                    </p>

                    <div className="relative mt-7 aspect-[1440/675] overflow-hidden rounded-lg border border-border bg-surface-2">
                      <Image
                        src={project.image}
                        alt={`${project.name} website`}
                        fill
                        sizes="(min-width: 1024px) 680px, 100vw"
                        className={`object-cover object-top ${project.imageDark ? "dark:hidden" : ""}`}
                      />
                      {project.imageDark && (
                        <Image
                          src={project.imageDark}
                          alt={`${project.name} website`}
                          fill
                          sizes="(min-width: 1024px) 680px, 100vw"
                          className="hidden object-cover object-top dark:block"
                        />
                      )}
                    </div>

                    <p className="mt-5 font-mono text-[12px] leading-relaxed text-muted">
                      {project.stack.join(" · ")}
                    </p>

                    {project.problem && (
                      <section className="mt-10 border-t border-border pt-8">
                        <Label>Problem</Label>
                        <p className="max-w-[620px] text-[15.5px] leading-[1.6] text-body">{project.problem}</p>
                      </section>
                    )}

                    <div className="mt-10 grid gap-10 border-t border-border pt-8">
                      {project.whatIBuilt && project.whatIBuilt.length > 0 && (
                        <section>
                          <Label>What I built</Label>
                          <BulletList items={project.whatIBuilt} />
                        </section>
                      )}

                      {project.engineeringWork && project.engineeringWork.length > 0 && (
                        <section>
                          <Label>Engineering work</Label>
                          <BulletList items={project.engineeringWork} />
                        </section>
                      )}

                      {project.impact && project.impact.length > 0 && (
                        <section>
                          <Label>Impact</Label>
                          <BulletList items={project.impact} />
                        </section>
                      )}

                      {project.requestFlow && project.requestFlow.length > 0 && (
                        <section>
                          <Label>Request flow</Label>
                          <ol className="max-w-[620px] space-y-2.5">
                            {project.requestFlow.map((step, i) => (
                              <li key={i} className="grid grid-cols-[24px_1fr] gap-2 text-[15.5px] leading-[1.6] text-body">
                                <span className="font-mono text-[12px] leading-[1.9] text-muted tabular-nums">
                                  {i + 1}.
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </section>
                      )}

                      {project.architecture && (
                        <section className="border-t border-border pt-8">
                          <Label>Architecture</Label>
                          <div className="mb-5 rounded-lg border border-border bg-surface p-4">
                            <ArchThumb architecture={project.architecture} className="mx-auto w-full max-w-[420px]" />
                            <p className="mt-3 text-center text-[12.5px] text-muted">
                              {project.architecture.nodes.length} components, {project.architecture.edges.length} connections
                            </p>
                          </div>
                          <p className="max-w-[620px] text-[15.5px] leading-[1.6] text-body">
                            {project.architecture.summary}
                          </p>
                          <button
                            type="button"
                            onClick={() => setActiveTab("arch")}
                            className="link mt-5 inline-flex cursor-pointer items-center gap-1 text-[15px]"
                          >
                            View the architecture diagram
                            <ArrowUpRight className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
                          </button>
                        </section>
                      )}
                    </div>
                  </motion.div>
                ) : project.architecture ? (
                  <motion.div
                    key="arch"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                  >
                    <h2
                      id="project-detail-title"
                      className="mb-6 font-display text-[clamp(1.5rem,3vw,2rem)] font-bold leading-tight tracking-tight text-text"
                    >
                      {project.name} architecture
                    </h2>
                    <SystemDesignVisualizer architecture={project.architecture} />
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
