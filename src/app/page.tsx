"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Nav from "./component/Nav";
import SystemDesignVisualizer from "./component/SystemDesignVisualizer";
import { EXPERTISE, getConstants, NAV } from "./utils/constants";

type ProjectItem = {
  question: string;
  image: string;
  description: string;
  tags?: string[];
  stack?: string[];
  url?: string;
};

function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const handler = () => {
      const scrollY = window.scrollY;
      // At the very top, default to first
      if (scrollY < 80) {
        setActive(ids[0]);
        return;
      }
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

export default function Portfolio() {
  const [mounted, setMounted] = useState(false);
  const { projects } = getConstants("dark") as { projects: ProjectItem[] };
  const sectionIds = NAV.map((n) => n.id);
  const activeSection = useActiveSection(sectionIds);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-[#0b0b0b]" />;
  }

  return (
    <div
      className="min-h-screen bg-[#0b0b0b] text-[#e8e3d9]"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {/* Dot grid texture */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative flex flex-col lg:flex-row min-h-screen max-w-[1280px] mx-auto">
        {/* ───────────────── SIDEBAR ───────────────── */}

        <Nav activeSection={activeSection} />
        {/* ───────────────── MAIN ───────────────── */}
        <main className="flex-1 min-w-0">
          {/* ── ABOUT ── */}
          <section
            id="about"
            className="px-8 lg:px-16 pt-14 lg:pt-24 pb-24 border-b"
          >
            <p
              className="text-[color:var(--color-text-label)] text-[10px] tracking-[0.25em] uppercase mb-12"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              01 / About
            </p>

            {/* Hero headline */}
            <h2 className="text-[clamp(2.8rem,6vw,5rem)] font-bold text-[color:var(--color-text-bright)] tracking-tight leading-[1.06] mb-8">
              I build software
              <br />
              <span className="text-[color:var(--color-text-label)]">
                that ships.
              </span>
            </h2>

            <p className="text-[color:var(--color-text-body)] text-base lg:text-lg leading-relaxed max-w-[520px] mb-16">
              Five years shipping full-stack products — REST APIs, data
              platforms, AI tools, browser extensions, and the infrastructure
              behind them. I work across the entire stack with a preference for
              backend systems.
            </p>

            {/* Stat grid */}
            <div className="grid grid-cols-3 border border-[color:var(--color-border)] divide-x divide-[color:var(--color-border)] mb-20">
              {[
                { v: "5+", l: "Years exp." },
                { v: "4", l: "Products shipped" },
                { v: "130+", l: "API commodities" },
              ].map(({ v, l }) => (
                <div key={l} className="px-5 py-5 sm:px-7 sm:py-6">
                  <div
                    className="text-2xl font-bold text-[color:var(--color-accent)] mb-1.5 tabular-nums"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {v}
                  </div>
                  <div
                    className="text-[color:var(--color-text-muted)] text-[10px] uppercase tracking-widest leading-tight"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {l}
                  </div>
                </div>
              ))}
            </div>

            {/* Expertise */}
            <p
              className="text-[color:var(--color-text-label)] text-[10px] tracking-[0.25em] uppercase mb-6"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Expertise
            </p>
            <div className="divide-y divide-[color:var(--color-border-subtle)]">
              {EXPERTISE.map(({ area, stack, desc }) => (
                <div
                  key={area}
                  className="group grid sm:grid-cols-[190px_1fr] gap-y-2 gap-x-8 py-5 hover:bg-[color:var(--color-text-hover-bg)] -mx-8 lg:-mx-16 px-8 lg:px-16 transition-colors duration-200"
                >
                  <span className="text-[color:var(--color-accent)] text-sm font-medium pt-0.5">
                    {area}
                  </span>
                  <div>
                    <p
                      className="text-[color:var(--color-text-muted)] text-xs mb-1.5"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {stack}
                    </p>
                    <p className="text-[color:var(--color-text-body)] text-sm">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── WORK ── */}
          <section
            id="work"
            className="px-8 lg:px-16 pt-20 pb-24 border-b border-[color:var(--color-border)]"
          >
            <p
              className="text-[color:var(--color-text-label)] text-[10px] tracking-[0.25em] uppercase mb-12"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              02 / Work
            </p>

            <div className="divide-y divide-[color:var(--color-border-subtle)]">
              {projects.map((project, idx) => {
                const techTags = project.tags ?? project.stack ?? [];
                return (
                  <div
                    key={idx}
                    className="group py-9 hover:bg-[color:var(--color-text-hover-bg)] -mx-8 lg:-mx-16 px-8 lg:px-16 transition-colors duration-200"
                  >
                    {/* Title row */}
                    <div className="flex items-baseline justify-between gap-6 mb-4">
                      <div className="flex items-baseline gap-4 min-w-0">
                        <span
                          className="text-[color:var(--color-text-faint)] text-xs tabular-nums flex-shrink-0"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          0{idx + 1}
                        </span>
                        <h3 className="text-[color:var(--color-text-bright)] font-semibold text-lg leading-snug truncate">
                          {project.question}
                        </h3>
                      </div>
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Visit ${project.question}`}
                          className="flex-shrink-0 text-[color:var(--color-text-faint)] hover:text-[color:var(--color-accent)] opacity-0 group-hover:opacity-100 transition-all duration-200"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-[color:var(--color-text-body)] text-sm leading-relaxed mb-5 pl-10 max-w-[540px]">
                      {project.description}
                    </p>

                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-1.5 pl-10">
                      {techTags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-[color:var(--color-text-muted)] text-[11px] border border-[color:var(--color-border)] px-2 py-0.5 rounded-sm"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <SystemDesignVisualizer />
          </section>

          {/* ── CONTACT ── */}
          <section id="contact" className="px-8 lg:px-16 pt-20 pb-28">
            <p
              className="text-[color:var(--color-text-label)] text-[10px] tracking-[0.25em] uppercase mb-12"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              03 / Contact
            </p>

            <div className="border border-[color:var(--color-border-subtle)] p-8 lg:p-12 max-w-xl">
              <h2 className="text-4xl lg:text-[2.75rem] font-bold text-[color:var(--color-text-bright)] tracking-tight leading-[1.1] mb-4">
                Let&apos;s work
                <br />
                together.
              </h2>
              <p className="text-[color:var(--color-text-body)] text-sm leading-relaxed mb-10 max-w-xs">
                Open to freelance projects, full-time roles, and interesting
                collaborations.
              </p>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[color:var(--color-accent)] text-[#0b0b0b] text-sm font-semibold hover:bg-[color:var(--color-accent-dim)] transition-colors duration-200"
              >
                Get in touch
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
