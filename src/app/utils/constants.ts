import type { ProjectItem } from "@/app/types";
import { PROJECTS } from "@/app/data/projects";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getConstants(_theme?: string): { projects: ProjectItem[] } {
  return { projects: PROJECTS };
}

export const NAV = [
  { label: "About", id: "about" },
  { label: "Work", id: "work" },
  { label: "Now", id: "now" },
  { label: "Contact", id: "contact" },
];

export const EXPERTISE = [
  {
    area: "Backend engineering",
    stack: "Node.js · Go · MySQL · MongoDB · Redis",
    desc: "Designed the in-memory read path that took Commodity Price API responses from 1–3 seconds to under 400 ms, and rewrote TweetStorm's data layer from Prisma to Knex.",
  },
  {
    area: "Payments and integrations",
    stack: "Stripe · Creem.io · Ghost CMS · Browser extensions",
    desc: "Webhook-driven subscriptions for three products, including tier changes and cancellations, plus extensions that inject into X's live UI.",
  },
  {
    area: "Frontend and tooling",
    stack: "Next.js · Astro · React · Tailwind CSS · Plasmo",
    desc: "Moved Netus.ai from WordPress to Astro, and build the dashboards and docs sites that sit on top of the APIs.",
  },
];
