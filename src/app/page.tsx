"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import CopyEmail from "./component/CopyEmail";
import LocalTime from "./component/LocalTime";
import Nav from "./component/Nav";
import ProjectDetail from "./component/ProjectDetail";
import SystemBlocks from "./component/SystemBlocks";
import WorkIndex from "./component/WorkIndex";
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
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [ids]);

  return active;
}

// ─── Small pieces ─────────────────────────────────────────────────────────────

const EMAIL = "a.suleman3757@gmail.com";

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="link inline-flex items-center gap-1 text-[15px]"
    >
      {children}
      <ArrowUpRight className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
    </a>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-[clamp(1.5rem,2.6vw,1.85rem)] font-semibold tracking-tight text-text">
      {children}
    </h2>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function PortfolioInner() {
  const { openProject, openArch, selectedSlug, view } = useApp();
  const { projects } = getConstants();
  const sectionIds = NAV.map((n) => n.id);
  const activeSection = useActiveSection(sectionIds);

  // Deep link: /?project=<slug>[&view=arch] opens a project on load.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("project");
    if (!slug || !projects.some((p) => p.slug === slug)) return;
    if (params.get("view") === "arch") openArch(slug);
    else openProject(slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the URL in sync so an open project can be shared.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (selectedSlug) {
      url.searchParams.set("project", selectedSlug);
      if (view === "arch") url.searchParams.set("view", "arch");
      else url.searchParams.delete("view");
    } else {
      url.searchParams.delete("project");
      url.searchParams.delete("view");
    }
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  }, [selectedSlug, view]);

  return (
    <div className="min-h-dvh bg-bg text-text">
      <Nav activeSection={activeSection} />

      <main className="mx-auto max-w-[1040px] px-5 sm:px-8">

        {/* ── ABOUT ── */}
        <section id="about" className="scroll-mt-20 pt-16 sm:pt-24">
          <div className="max-w-[680px]">
            <p className="text-[15px] text-muted">
              Software engineer at Jfreaks Software Solutions, Lahore.
            </p>

            <h1 className="mt-5 font-display text-[clamp(2.4rem,5vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-text">
              Whole systems,{" "}
              <em className="block font-serif font-normal italic text-text sm:inline">one engineer.</em>
            </h1>

            <p className="mt-7 text-[17px] leading-[1.65] text-body">
              I take a product from architecture to deployment: the API, the data
              loaders, the payments, the dashboards. Seven services behind Commodity
              Price API, three browser extensions for TweetStorm.ai, a full platform
              migration for Netus.ai. Most of the work is server-side.
            </p>

            <div className="mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-3">
              <ExternalLink href="https://github.com/Suleman-Ali-Asif">GitHub</ExternalLink>
              <ExternalLink href="https://linkedin.com/in/suleman-ali-asif">LinkedIn</ExternalLink>
              <a href="/resume.pdf" download="Suleman_Ali_Resume.pdf" className="link text-[15px]">
                Résumé (PDF)
              </a>
              <CopyEmail email={EMAIL} />
            </div>
          </div>

          <div className="mt-16 sm:mt-20">
            <SystemBlocks />
          </div>

          {/* What I do */}
          <div className="mt-20 max-w-[820px] sm:mt-24">
            <SectionTitle>What I do</SectionTitle>
            <dl className="mt-6 border-t border-border">
              {EXPERTISE.map(({ area, stack, desc }) => (
                <div
                  key={area}
                  className="grid gap-2 border-b border-border py-6 md:grid-cols-[240px_1fr] md:gap-10"
                >
                  <dt>
                    <span className="block font-display text-[17px] font-semibold tracking-tight text-text">
                      {area}
                    </span>
                    <span className="mt-1.5 block font-mono text-[11.5px] leading-relaxed text-muted">
                      {stack}
                    </span>
                  </dt>
                  <dd className="max-w-[520px] text-[15.5px] leading-[1.65] text-body">{desc}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── WORK ── */}
        <section id="work" className="scroll-mt-20 pt-24 sm:pt-32">
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
            <SectionTitle>Selected work</SectionTitle>
            <p className="text-[14px] text-muted">
              {projects.length} products, {projects.filter((p) => p.architecture).length} with architecture diagrams
            </p>
          </div>
          <WorkIndex projects={projects} onOpen={openProject} />
        </section>

        {/* ── NOW ── */}
        <section id="now" className="scroll-mt-20 pt-24 sm:pt-32">
          <div className="max-w-[820px]">
            <SectionTitle>Now</SectionTitle>
            <dl className="mt-6 grid gap-x-10 gap-y-6 border-t border-border pt-6 sm:grid-cols-2">
              {[
                { k: "Working at", v: "Jfreaks Software Solutions, since 2023" },
                { k: "Open to", v: "Freelance projects and full-time roles" },
                { k: "Main stack", v: "Node.js, Go, Next.js, MySQL, MongoDB" },
                { k: "Based in", v: <>Lahore, Pakistan · <LocalTime /> local (UTC+5)</> },
              ].map(({ k, v }) => (
                <div key={k} className="grid grid-cols-[110px_1fr] gap-4">
                  <dt className="text-[14px] text-muted">{k}</dt>
                  <dd className="text-[15.5px] leading-snug text-text">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 font-mono text-[11.5px] text-faint">Updated September 2026</p>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" className="scroll-mt-20 pt-24 pb-14 sm:pt-32">
          <div className="max-w-[820px] border-t border-border pt-10">
            <SectionTitle>Contact</SectionTitle>
            <p className="mt-4 max-w-[520px] text-[16px] leading-[1.65] text-body">
              Freelance projects and full-time roles. Email is the fastest way to reach me.
            </p>
            <div className="mt-8">
              <CopyEmail email={EMAIL} size="lg" />
            </div>
            <p className="mt-5 text-[15px] text-muted">
              Or{" "}
              <Link href="/contact" className="link">
                use the contact form
              </Link>
              .
            </p>
          </div>

          <footer className="mt-24 flex flex-col gap-4 border-t border-border pt-6 text-[13px] text-muted sm:flex-row sm:items-start sm:justify-between">
            <p className="max-w-[520px] leading-relaxed">
              Suleman Ali, Lahore. Set in Bricolage Grotesque and Instrument Sans. The
              architecture diagrams are hand-laid SVG driven by the same data as the
              case studies.
            </p>
            <div className="flex items-center gap-5">
              <a href="https://github.com/Suleman-Ali-Asif" target="_blank" rel="noopener noreferrer" className="link-muted">GitHub</a>
              <a href="https://linkedin.com/in/suleman-ali-asif" target="_blank" rel="noopener noreferrer" className="link-muted">LinkedIn</a>
              <a href="/resume.pdf" download="Suleman_Ali_Resume.pdf" className="link-muted">Résumé</a>
            </div>
          </footer>
        </section>
      </main>

      <ProjectDetail />
    </div>
  );
}

export default function Portfolio() {
  return (
    <AppContextProvider>
      <PortfolioInner />
    </AppContextProvider>
  );
}
