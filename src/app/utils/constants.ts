import type { ProjectItem } from "@/app/types";
import { PROJECTS } from "@/app/data/projects";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getConstants(_theme?: string): { projects: ProjectItem[] } {
  return { projects: PROJECTS };
}

export const NAV = [
  { label: "About", id: "about" },
  { label: "Work",  id: "work"  },
  { label: "Contact", id: "contact" },
];

export const EXPERTISE = [
  {
    area: "Backend Engineering",
    stack: "Node.js · Go · MySQL · MongoDB · Redis",
    desc: "REST API design, data pipeline architecture, in-memory caching, and ORM-level query optimisation.",
  },
  {
    area: "Payments & Integrations",
    stack: "Stripe · Creem.io · Ghost CMS · Browser Extensions",
    desc: "Webhook-driven subscription management, tiered access control, and third-party platform integrations.",
  },
  {
    area: "Frontend & Tooling",
    stack: "Next.js · Astro · React · Tailwind CSS · Plasmo",
    desc: "Static site migrations, server-rendered UIs, and browser extension development injected into live platforms.",
  },
];
