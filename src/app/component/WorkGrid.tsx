"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import type { ProjectItem } from "@/app/types";
import Tile from "./Tile";

/**
 * WorkGrid: one tile per project. Screenshot on top inside its own rounded
 * frame, then name, role, a short description and the stack. The whole tile
 * opens the case-study panel.
 */

export function Screenshot({
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

export default function WorkGrid({
  projects,
  onOpen,
}: {
  projects: ProjectItem[];
  onOpen: (slug: string) => void;
}) {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
      {projects.map((project) => (
        <li key={project.slug} className="min-w-0">
          <Tile
            as="button"
            type="button"
            interactive
            onClick={() => onOpen(project.slug)}
            className="w-full"
            aria-label={`${project.name}: open case study`}
          >
            <div className="relative aspect-[1440/675] w-full overflow-hidden rounded-2xl bg-surface-2">
              <div className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover/tile:scale-[1.02]">
                <Screenshot
                  project={project}
                  sizes="(min-width: 1024px) 340px, (min-width: 640px) 50vw, 100vw"
                />
              </div>
            </div>

            <div className="mt-5 flex items-baseline justify-between gap-4">
              <h3 className="font-display text-[20px] font-semibold leading-tight tracking-tight text-text">
                {project.name}
              </h3>
              <ArrowUpRight
                className="h-4 w-4 flex-shrink-0 self-center text-faint transition-all duration-200 group-hover/tile:-translate-y-0.5 group-hover/tile:translate-x-0.5 group-hover/tile:text-text group-focus-visible/tile:text-text"
                aria-hidden="true"
              />
            </div>
            {project.role && <p className="mt-1 text-[13.5px] text-muted">{project.role}</p>}

            <p className="mt-3 text-[16px] leading-[1.6] text-body">{project.description}</p>

            <p className="mt-auto pt-5 font-mono text-[11.5px] leading-relaxed text-muted">
              {project.stack.join(", ")}
            </p>
          </Tile>
        </li>
      ))}
    </ul>
  );
}
