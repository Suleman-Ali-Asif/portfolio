"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import CopyEmail from "./component/CopyEmail";
import DotLaptop from "./component/DotLaptop";
import LocalTime from "./component/LocalTime";
import Nav from "./component/Nav";
import ProjectDetail from "./component/ProjectDetail";
import Tile, { Bento } from "./component/Tile";
import { Screenshot } from "./component/WorkGrid";
import { AppContextProvider, useApp } from "./context/AppContext";
import type { ProjectItem } from "./types";
import { EDUCATION, EXPERIENCE, getConstants, NAV, STACK } from "./utils/constants";

// ─── Active section hook ──────────────────────────────────────────────────────

function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    // A section is "current" while it overlaps a band from 15% to 50% down the
    // viewport. When several overlap, the lowest one on the page wins, so the
    // section scrolling into view takes over as it passes the band.
    const inBand = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) inBand.add(e.target.id);
          else inBand.delete(e.target.id);
        }
        const current = [...ids].reverse().find((id) => inBand.has(id));
        if (current) setActive(current);
      },
      { rootMargin: "-15% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);

  return active;
}

// ─── Small pieces ─────────────────────────────────────────────────────────────

const EMAIL = "a.suleman3757@gmail.com";
const GITHUB = "https://github.com/Suleman-Ali-Asif";
const LINKEDIN = "https://linkedin.com/in/suleman-ali-asif";

/** Small caption in a tile's top-left corner. */
function Caption({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-[13px] leading-snug text-muted ${className}`}>{children}</p>;
}

const capitalize = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
const uncapitalize = (t: string) => t.charAt(0).toLowerCase() + t.slice(1);

const ROW_ARROW =
  "h-3.5 w-3.5 flex-shrink-0 self-center text-faint transition-all duration-200 group-hover/row:-translate-y-0.5 group-hover/row:translate-x-0.5 group-hover/row:text-text group-focus-visible/row:text-text";

/**
 * Work index tile: a preview on top that crossfades to the hovered row, then
 * every product as a hairline row. Clicking anything opens the case study.
 */
function WorkIndexTile({
  projects,
  onOpen,
  className = "",
}: {
  projects: ProjectItem[];
  onOpen: (slug: string) => void;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);
  const active = projects.find((p) => p.slug === hovered) ?? projects[0];

  return (
    <Tile as="section" id="work" className={`scroll-mt-4 ${className}`} aria-labelledby="work-title">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="work-title" className="font-display text-[20px] font-semibold tracking-tight text-text">
          Selected work
        </h2>
        <Caption>{projects.length} products</Caption>
      </div>

      <button
        type="button"
        onClick={() => onOpen(active.slug)}
        aria-label={`${active.name}: open case study`}
        className="group/preview relative mt-5 block aspect-[1440/675] w-full cursor-pointer overflow-hidden rounded-2xl bg-surface-2"
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={active.slug}
            className="absolute inset-0"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <Screenshot project={active} sizes="(min-width: 1024px) 420px, 100vw" />
          </motion.div>
        </AnimatePresence>
      </button>

      <ul className="mt-5 divide-y divide-border" onMouseLeave={() => setHovered(null)}>
        {projects.map((p) => (
          <li key={p.slug} onMouseEnter={() => setHovered(p.slug)} onFocus={() => setHovered(p.slug)}>
            <button
              type="button"
              onClick={() => onOpen(p.slug)}
              className="group/row flex w-full cursor-pointer items-baseline justify-between gap-4 py-3.5 text-left"
            >
              <span className="min-w-0">
                <span className="block font-display text-[17px] font-semibold leading-tight tracking-tight text-text">
                  {p.name}
                </span>
                {p.role && <span className="mt-0.5 block truncate text-[13px] text-muted">{p.role}</span>}
              </span>
              <ArrowUpRight className={ROW_ARROW} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </Tile>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function PortfolioInner() {
  const { openProject, openArch, selectedSlug, view } = useApp();
  const { projects } = getConstants();
  const sectionIds = useMemo(() => NAV.map((n) => n.id), []);
  const activeSection = useActiveSection(sectionIds);
  const [jfreaks, ...restExperience] = EXPERIENCE;

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
      <a href="#main" className="skip-link">Skip to content</a>
      <Nav activeSection={activeSection} />

      <main id="main" className="mx-auto max-w-[1440px] px-3 pb-3 pt-3 sm:px-4 sm:pb-4 sm:pt-4">

        {/* ── FOLD: intro and portrait/contact on the left; experience and education on the right ── */}
        <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-12">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-8 sm:gap-4 lg:col-span-8 lg:grid-rows-[minmax(0,1.3fr)_minmax(0,1fr)]">

            {/* Intro: headline and about in one tall tile */}
            <Tile
              as="section"
              id="about"
              aria-labelledby="headline"
              className="scroll-mt-4 min-h-[520px] sm:col-span-5 sm:row-span-2 lg:min-h-0"
            >
              <h1
                id="headline"
                className="font-display text-[clamp(2.4rem,4.2vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-text"
              >
                Whole systems,{" "}
                <em className="block font-serif font-normal italic text-text">one engineer.</em>
              </h1>
              <div className="mt-4 flex items-start justify-between gap-6">
                <Caption className="max-w-[48%]">
                  Full-stack engineer at Jfreaks Software Solutions, Lahore. Mostly backend.
                </Caption>
                <DotLaptop className="h-28 w-40 flex-shrink-0 text-text sm:h-32 sm:w-52" />
              </div>
              <div className="mt-auto border-t border-border pt-5">
                <div className="flex items-baseline gap-2 text-[13px] text-muted">
                  <span>Lahore</span>
                  <LocalTime />
                  <span>UTC+5</span>
                </div>
                <p className="mt-3 max-w-[560px] text-[16px] leading-[1.6] text-body">
                  I build the parts of a product that have to keep working when nobody is
                  looking: schedulers, queues, payment webhooks, data loaders, the API in
                  front of them, and the deploy that ships it. Four products below, from a
                  change-detection service I designed from the first commit to a commodity
                  price API I took over and grew to twelve services.
                </p>
              </div>
            </Tile>

            {/* Portrait */}
            <div className="relative min-h-[360px] overflow-hidden rounded-[22px] bg-surface-2 sm:col-span-3 lg:min-h-0">
              <Image
                src="/hero.png"
                alt="Suleman Ali"
                fill
                priority
                sizes="(min-width: 1024px) 340px, (min-width: 640px) 37vw, 100vw"
                className="object-contain object-bottom grayscale"
              />
            </div>

            {/* Contact */}
            <Tile
              as="a"
              href="/contact"
              id="contact"
              inverted
              interactive
              className="scroll-mt-4 min-h-[300px] sm:col-span-3 lg:min-h-0"
              aria-label="Contact: open the contact form"
            >
              <div className="flex items-start justify-between gap-4">
                <p className="max-w-[200px] text-[13px] leading-snug opacity-70">
                  Open to freelance projects and full-time roles. I reply within a day.
                </p>
                <ArrowUpRight
                  className="h-6 w-6 flex-shrink-0 transition-transform duration-200 group-hover/tile:-translate-y-0.5 group-hover/tile:translate-x-0.5"
                  aria-hidden="true"
                />
              </div>
              <p className="mt-auto pt-10 font-display text-[clamp(2rem,3.4vw,2.9rem)] font-semibold leading-none tracking-[-0.03em]">
                Contact <em className="font-serif font-normal italic">me</em>
              </p>
              <p className="mt-3 font-mono text-[12px] opacity-70">{EMAIL}</p>
            </Tile>
          </div>

          {/* Right column: experience over education */}
          <div className="grid grid-rows-[minmax(0,1fr)_auto] gap-3 sm:gap-4 lg:col-span-4">
            <Tile as="section" id="experience" aria-labelledby="experience-title" className="scroll-mt-4 min-h-[360px] lg:min-h-0">
              <div className="flex items-baseline justify-between gap-4">
                <h2 id="experience-title" className="font-display text-[20px] font-semibold tracking-tight text-text">
                  Experience
                </h2>
                <Caption>{EXPERIENCE.length} roles</Caption>
              </div>
              <ol className="mt-4 flex flex-1 flex-col divide-y divide-border">
                {EXPERIENCE.map(({ period, org, role }) => (
                  <li key={org} className="flex flex-1 flex-col justify-center py-5 first:pt-4 last:pb-0">
                    <p className="font-mono text-[12px] text-muted">{period}</p>
                    <h3 className="mt-2 font-display text-[18px] font-semibold leading-snug tracking-tight text-text">
                      {org}
                    </h3>
                    <p className="mt-1 text-[14px] text-muted">{role}</p>
                  </li>
                ))}
              </ol>
            </Tile>

            <Tile as="section" aria-labelledby="education-title">
              <h2 id="education-title" className="font-display text-[20px] font-semibold tracking-tight text-text">
                Education
              </h2>
              <ul className="mt-4 divide-y divide-border">
                {EDUCATION.map(({ period, org, role }) => (
                  <li key={org} className="pt-4">
                    <p className="font-mono text-[12px] text-muted">{period}</p>
                    <h3 className="mt-2 font-display text-[18px] font-semibold leading-snug tracking-tight text-text">
                      {org}
                    </h3>
                    <p className="mt-1 text-[14px] text-muted">{role}</p>
                  </li>
                ))}
              </ul>
            </Tile>
          </div>
        </div>

        {/* ── WORK + OWNERSHIP ── */}
        <Bento className="mt-3 sm:mt-4">
          <WorkIndexTile projects={projects} onOpen={openProject} className="sm:col-span-6 lg:col-span-4" />

          {/* What I owned on each product at Jfreaks, two by two */}
          <Tile as="section" aria-labelledby="owned-title" className="sm:col-span-6 lg:col-span-8">
            <div className="flex items-baseline justify-between gap-4">
              <h2 id="owned-title" className="font-display text-[20px] font-semibold tracking-tight text-text">
                What I owned at {jfreaks.org}
              </h2>
              <Caption>{jfreaks.period}</Caption>
            </div>
            <dl className="mt-6 grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {jfreaks.points.map((pt) => {
                const i = pt.indexOf(": ");
                const name = i === -1 ? "" : pt.slice(0, i);
                const body = capitalize(i === -1 ? pt : pt.slice(i + 2));
                return (
                  <div key={pt} className="border-t border-border pt-4">
                    <dt className="font-display text-[16px] font-semibold tracking-tight text-text">{name}</dt>
                    <dd className="mt-2 text-[16px] leading-[1.6] text-body">{body}</dd>
                  </div>
                );
              })}
            </dl>
            {restExperience[0]?.points.length ? (
              <div className="mt-7 border-t border-border pt-4">
                <p className="text-[13px] text-muted">
                  Before that, {restExperience[0].org}, {uncapitalize(restExperience[0].role)}:{" "}
                  {restExperience[0].points.map((p) => uncapitalize(p.replace(/\.$/, ""))).join("; ")}.
                </p>
              </div>
            ) : null}
          </Tile>

          {/* Stack: six groups across the full width */}
          <Tile as="section" aria-labelledby="stack-title" className="sm:col-span-6 lg:col-span-12">
            <h2 id="stack-title" className="font-display text-[20px] font-semibold tracking-tight text-text">
              Stack
            </h2>
            <dl className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
              {STACK.map(({ group, items }) => (
                <div key={group} className="border-t border-border pt-4">
                  <dt className="text-[13px] text-muted">{group}</dt>
                  <dd className="mt-1.5 text-[16px] leading-relaxed text-text">{items}</dd>
                </div>
              ))}
            </dl>
          </Tile>
        </Bento>

        {/* ── FOOTER ── */}
        <Bento as="div" className="mt-3 sm:mt-4">
          <Tile as="section" aria-labelledby="email-title" className="min-h-[260px] sm:col-span-6 lg:col-span-7">
            <p id="email-title" className="max-w-[420px] text-[13px] leading-snug text-muted">
              Open to freelance projects and full-time roles. Email is the fastest way to
              reach me. I reply within a day.
            </p>
            <div className="mt-auto pt-12">
              <CopyEmail email={EMAIL} size="lg" />
            </div>
          </Tile>

          <Tile as="nav" aria-label="Elsewhere" className="sm:col-span-3 lg:col-span-2">
            <Caption>Elsewhere</Caption>
            <ul className="mt-3 flex flex-1 flex-col divide-y divide-border">
              {[
                { label: "GitHub", href: GITHUB, external: true },
                { label: "LinkedIn", href: LINKEDIN, external: true },
                { label: "Résumé", href: "/resume.pdf", download: "Suleman_Ali_Resume.pdf" },
                { label: "Contact form", href: "/contact" },
              ].map(({ label, href, external, download }) => (
                <li key={label} className="flex flex-1 items-center">
                  {external ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="group/row flex w-full items-center justify-between gap-3 py-3 text-[15px] text-text">
                      {label}
                      <ArrowUpRight className={ROW_ARROW} aria-hidden="true" />
                    </a>
                  ) : download ? (
                    <a href={href} download={download} className="group/row flex w-full items-center justify-between gap-3 py-3 text-[15px] text-text">
                      {label}
                      <ArrowUpRight className={ROW_ARROW} aria-hidden="true" />
                    </a>
                  ) : (
                    <Link href={href} className="group/row flex w-full items-center justify-between gap-3 py-3 text-[15px] text-text">
                      {label}
                      <ArrowUpRight className={ROW_ARROW} aria-hidden="true" />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </Tile>

          <Tile as="footer" className="sm:col-span-3 lg:col-span-3">
            <Caption>Colophon</Caption>
            <p className="mt-3 text-[13.5px] leading-[1.6] text-body">
              Set in Bricolage Grotesque, Instrument Sans and JetBrains Mono. The
              architecture diagrams are hand-laid SVG driven by the same data as the
              case studies. Built with Next.js and Tailwind CSS.
            </p>
            <div className="mt-auto flex items-baseline justify-between gap-4 pt-8 text-[13px] text-muted">
              <span>Suleman Ali, Lahore</span>
              <a href="#main" className="link-muted">Back to top</a>
            </div>
          </Tile>
        </Bento>
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
