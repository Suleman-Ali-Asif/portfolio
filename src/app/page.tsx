"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import ModeSelector from "./component/ModeSelector";
import Nav from "./component/Nav";
import ProjectDetail from "./component/ProjectDetail";
import Terminal from "./component/Terminal";
import { AppContextProvider, useApp } from "./context/AppContext";
import { EXPERTISE, getConstants, NAV } from "./utils/constants";

// ─── Active section hook ──────────────────────────────────────────────────────

function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const handler = () => {
      const scrollY = window.scrollY;
      if (scrollY < 80) { setActive(ids[0]); return; }

      const atBottom =
        scrollY + window.innerHeight >= document.documentElement.scrollHeight - 60;
      if (atBottom) { setActive(ids[ids.length - 1]); return; }

      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 160) {
          setActive(id);
          return;
        }
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [ids]);

  return active;
}

// ─── Mode toggle button ───────────────────────────────────────────────────────

function ModeToggle() {
  const { mode, toggleMode } = useApp();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "`") {
        e.preventDefault();
        toggleMode();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggleMode]);

  return (
    <button
      onClick={toggleMode}
      title={mode === "gui" ? "Open Terminal (Ctrl+`)" : "Open GUI (Ctrl+`)"}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-3.5 py-2 font-mono border border-edge bg-surface text-accent hover:border-accent hover:bg-hover transition-all duration-150 text-[11px]"
    >
      {mode === "gui" ? (
        <>
          <span className="opacity-70">&gt;_</span>
          <span>Terminal</span>
        </>
      ) : (
        <>
          <span className="opacity-70">⬚</span>
          <span>GUI</span>
        </>
      )}
    </button>
  );
}

// ─── GUI layout ───────────────────────────────────────────────────────────────

function GUILayout() {
  const { openProject } = useApp();
  const [mounted, setMounted] = useState(false);
  const { projects } = getConstants();
  const sectionIds = NAV.map((n) => n.id);
  const activeSection = useActiveSection(sectionIds);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="min-h-screen bg-canvas" />;

  return (
    <div className="min-h-screen bg-canvas text-bright">
      {/* Dot grid texture */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative flex flex-col lg:flex-row min-h-screen max-w-[1280px] mx-auto">
        <Nav activeSection={activeSection} />

        <main className="flex-1 min-w-0">

          {/* ── ABOUT ── */}
          <section id="about" className="px-8 lg:px-16 pt-14 lg:pt-24 pb-24 border-b border-edge">
            <p className="text-label font-mono text-[10px] tracking-[0.25em] uppercase mb-12">
              01 / About
            </p>

            <h2 className="text-[clamp(2.8rem,6vw,5rem)] font-bold text-bright tracking-tight leading-[1.06] mb-8">
              I build software
              <br />
              <span className="text-label">that ships.</span>
            </h2>

            <p className="text-body text-base lg:text-lg leading-relaxed max-w-[520px] mb-16">
              Software engineer specialising in backend systems — REST APIs, data pipelines,
              payment integrations, and browser extensions. Building production products at
              Jfreaks Software Solutions. I work across the full stack with a preference for
              the backend.
            </p>

            {/* Stat grid */}
            <div className="grid grid-cols-3 border border-edge divide-x divide-edge mb-20">
              {[
                { v: "2+",   l: "Years exp." },
                { v: "4",    l: "Products shipped" },
                { v: "10+",  l: "Technologies" },
              ].map(({ v, l }) => (
                <div key={l} className="px-5 py-5 sm:px-7 sm:py-6">
                  <div className="text-2xl font-bold font-mono text-accent mb-1.5 tabular-nums">
                    {v}
                  </div>
                  <div className="text-muted font-mono text-[10px] uppercase tracking-widest leading-tight">
                    {l}
                  </div>
                </div>
              ))}
            </div>

            {/* Expertise */}
            <p className="text-label font-mono text-[10px] tracking-[0.25em] uppercase mb-6">
              Expertise
            </p>
            <div className="divide-y divide-edge-soft">
              {EXPERTISE.map(({ area, stack, desc }) => (
                <div
                  key={area}
                  className="group grid sm:grid-cols-[190px_1fr] gap-y-2 gap-x-8 py-5 hover:bg-hover -mx-8 lg:-mx-16 px-8 lg:px-16 transition-colors duration-200"
                >
                  <span className="text-accent text-sm font-medium pt-0.5">
                    {area}
                  </span>
                  <div>
                    <p className="text-muted font-mono text-xs mb-1.5">{stack}</p>
                    <p className="text-body text-sm">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── WORK ── */}
          <section id="work" className="px-8 lg:px-16 pt-20 pb-24 border-b border-edge">
            <p className="text-label font-mono text-[10px] tracking-[0.25em] uppercase mb-12">
              02 / Work
            </p>

            <div className="divide-y divide-edge-soft">
              {projects.map((project, idx) => (
                <div
                  key={project.slug}
                  onClick={() => openProject(project.slug)}
                  className="group py-9 hover:bg-hover -mx-8 lg:-mx-16 px-8 lg:px-16 transition-colors duration-200 cursor-pointer"
                >
                  <div className="flex items-baseline justify-between gap-6 mb-4">
                    <div className="flex items-baseline gap-4 min-w-0">
                      <span className="text-faint font-mono text-xs tabular-nums flex-shrink-0">
                        0{idx + 1}
                      </span>
                      <h3 className="text-bright font-semibold text-lg leading-snug truncate">
                        {project.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="opacity-0 group-hover:opacity-100 font-mono text-[10px] text-muted transition-opacity duration-200">
                        open →
                      </span>
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Visit ${project.name}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-faint hover:text-accent opacity-0 group-hover:opacity-100 transition-all duration-200"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-body text-sm leading-relaxed mb-5 pl-10 max-w-[540px]">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pl-10">
                    {project.stack.map((tag) => (
                      <span
                        key={tag}
                        className="text-muted font-mono text-[11px] border border-edge px-2 py-0.5 rounded-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── CONTACT ── */}
          <section id="contact" className="px-8 lg:px-16 pt-20 pb-40">
            <p className="text-label font-mono text-[10px] tracking-[0.25em] uppercase mb-12">
              03 / Contact
            </p>

            <h2 className="text-[clamp(2.6rem,6vw,4.5rem)] font-bold text-bright tracking-tight leading-[1.06] mb-6">
              Let&apos;s build
              <br />
              <span className="text-label">something real.</span>
            </h2>
            <p className="text-body text-base leading-relaxed max-w-sm mb-14">
              Open to freelance projects, full-time roles, and interesting collaborations.
              I reply within 24 hours.
            </p>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-canvas text-sm font-semibold hover:bg-accent-dim transition-colors duration-200 mb-20"
            >
              Get in touch
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <div className="border-t border-edge-soft pt-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  {[
                    { label: "GitHub",   href: "https://github.com/Suleman-Ali-Asif" },
                    { label: "LinkedIn", href: "https://linkedin.com/in/suleman-ali-asif" },
                  ].map(({ label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 font-mono text-muted hover:text-bright text-sm transition-colors duration-200"
                    >
                      {label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </a>
                  ))}
                </div>

                <div className="inline-flex items-center gap-2 font-mono text-muted text-[11px]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  Available for work
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <ProjectDetail />
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

function PortfolioInner() {
  const { mode, isReady, hasChosenMode } = useApp();

  if (!isReady) return <div className="min-h-screen bg-canvas" />;
  if (!hasChosenMode) return <ModeSelector />;

  return (
    <>
      {mode === "terminal" ? <Terminal /> : <GUILayout />}
      <ModeToggle />
    </>
  );
}

export default function Portfolio() {
  return (
    <AppContextProvider>
      <PortfolioInner />
    </AppContextProvider>
  );
}
