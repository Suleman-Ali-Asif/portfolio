"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { ProjectItem } from "@/app/types";

/**
 * WorkIndex — the project list as an index, not a card grid. Rows on the left;
 * on large screens a sticky preview on the right crossfades to whichever row
 * is hovered or focused. Siblings dim while one row is active. Below `lg`
 * each row carries its own screenshot.
 */

function Screenshot({
  project,
  sizes,
  priority = false,
}: {
  project: ProjectItem;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <>
      <Image
        src={project.image}
        alt={`${project.name} website`}
        fill
        priority={priority}
        sizes={sizes}
        className={`object-cover object-top ${project.imageDark ? "dark:hidden" : ""}`}
      />
      {project.imageDark && (
        <Image
          src={project.imageDark}
          alt={`${project.name} website`}
          fill
          priority={priority}
          sizes={sizes}
          className="hidden object-cover object-top dark:block"
        />
      )}
    </>
  );
}

export default function WorkIndex({
  projects,
  onOpen,
}: {
  projects: ProjectItem[];
  onOpen: (slug: string) => void;
}) {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);
  const active = projects.find((p) => p.slug === hovered) ?? projects[0];

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_460px]">
      <ul
        className="group/list border-t border-border"
        onMouseLeave={() => setHovered(null)}
      >
        {projects.map((project) => {
          const isActive = hovered === project.slug;
          return (
            <li
              key={project.slug}
              className={`border-b border-border transition-opacity duration-300 ${
                hovered && !isActive ? "lg:opacity-45" : "opacity-100"
              }`}
              onMouseEnter={() => setHovered(project.slug)}
              onFocus={() => setHovered(project.slug)}
            >
              <button
                type="button"
                onClick={() => onOpen(project.slug)}
                className="group/row block w-full cursor-pointer py-7 text-left focus-visible:outline-none sm:py-8"
              >
                {/* Screenshot inline below lg */}
                <div className="relative mb-6 aspect-[1440/675] w-full overflow-hidden rounded-lg border border-border bg-surface-2 lg:hidden">
                  <Screenshot project={project} sizes="(min-width: 640px) 640px, 100vw" />
                </div>

                <div className="flex items-baseline justify-between gap-6">
                  <h3 className="font-display text-[22px] font-semibold leading-tight tracking-tight text-text sm:text-[24px]">
                    {project.name}
                  </h3>
                  <span className="flex flex-shrink-0 items-center gap-2 font-mono text-[12px] text-muted">
                    {project.url && (
                      <span className="hidden sm:inline">{project.url.replace(/^https?:\/\//, "")}</span>
                    )}
                    <ArrowUpRight
                      className="h-4 w-4 text-faint transition-all duration-200 group-hover/row:-translate-y-0.5 group-hover/row:translate-x-0.5 group-hover/row:text-text group-focus-visible/row:text-text"
                      aria-hidden="true"
                    />
                  </span>
                </div>

                <p className="mt-3 max-w-[540px] text-[15.5px] leading-[1.6] text-body">
                  {project.description}
                </p>

                <p className="mt-4 font-mono text-[12px] leading-relaxed text-muted">
                  {project.stack.join(" · ")}
                </p>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Sticky preview, lg and up */}
      <div className="hidden lg:block">
        <div className="sticky top-24">
          <div className="relative aspect-[1440/675] w-full overflow-hidden rounded-lg border border-border bg-surface-2">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={active.slug}
                className="absolute inset-0"
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                <Screenshot project={active} sizes="460px" priority={active === projects[0]} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-3 flex items-baseline justify-between gap-4 text-[13px]">
            <AnimatePresence initial={false} mode="wait">
              <motion.p
                key={active.slug}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="text-muted"
              >
                {active.architecture
                  ? `${active.architecture.nodes.length} components, ${active.architecture.edges.length} connections`
                  : "Frontend contribution"}
              </motion.p>
            </AnimatePresence>
            {active.url && (
              <a
                href={active.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-muted inline-flex items-center gap-1 whitespace-nowrap"
              >
                Visit site
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
