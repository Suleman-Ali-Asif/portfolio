import type { ProjectItem } from "@/app/types";
import { PROJECTS } from "@/app/data/projects";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getConstants(_theme?: string): { projects: ProjectItem[] } {
  return { projects: PROJECTS };
}

export const NAV = [
  { label: "About", id: "about" },
  { label: "Work", id: "work" },
  { label: "Experience", id: "experience" },
  { label: "Contact", id: "contact" },
];

/** Engineering habits, each anchored to a decision on a shipped product. */
export const PRINCIPLES = [
  {
    title: "One source of truth for state.",
    body:
      "Verid's API never enqueues a scrape. It writes next_run_at to Postgres and the worker claims due rows with FOR UPDATE SKIP LOCKED. Redis holds queues and caches and is not backed up, because losing it loses nothing.",
    source: "Verid",
  },
  {
    title: "Make retries safe before making them fast.",
    body:
      "TweetStorm's publish worker persists each tweet's X ID as it posts. A crash mid-thread resumes at the first unpublished tweet. Stripe events at Commodity Price API are stored by event ID and skipped on redelivery.",
    source: "TweetStorm.ai, Commodity Price API",
  },
  {
    title: "Read from memory, write only on change.",
    body:
      "Commodity Price API answers price requests from a map in the process. Loaders compare each incoming value with the cached one and write to MongoDB only when it differs. Usage counts are flushed in bulk every five minutes.",
    source: "Commodity Price API",
  },
  {
    title: "Let the provider tell you what happened.",
    body:
      "Netus.ai subscriptions were once written from the browser after checkout. They are now set by Stripe and Creem webhooks behind a unique constraint and an upsert, so an interrupted redirect cannot leave a paying user without credits.",
    source: "Netus.ai",
  },
];

export const EXPERIENCE = [
  {
    period: "Since 2024",
    org: "Jfreaks Software Solutions",
    role: "Full-stack engineer, Lahore",
    points: [
      "Verid: designed and built a web change-detection SaaS from the first commit. Next.js 16 app, BullMQ worker, eight shared packages, Creem billing, self-hosted deploys on two VPS.",
      "Commodity Price API: primary maintainer since September 2024. Loader to API hot path, one-second gold and silver, six official-source loaders, Stripe and trials, the MCP server, the tools site.",
      "TweetStorm.ai: the thread scheduler and its publish worker, the bookmark manager and its Chrome and Firefox extension, Stripe lifecycle handlers, the Prisma to Knex migration, the deploy pipeline.",
      "Netus.ai: webhook-driven Stripe billing, the plans table, one-off credit packs, Redis rate limiting for anonymous use, dunning, the newsletter and video services in Go, most of the Astro marketing site.",
    ],
  },
  {
    period: "Summer 2023",
    org: "Apexion",
    role: "Backend developer intern, remote",
    points: [
      "Refactored Node.js services and REST endpoints, focusing on query handling and memory use.",
      "Worked inside an agile team on sprint planning and CI/CD.",
    ],
  },
];

export const EDUCATION = [
  {
    period: "2020 to 2024",
    org: "Air University, Islamabad",
    role: "BS Software Engineering",
  },
];

export const STACK = [
  { group: "Languages", items: "TypeScript, JavaScript, Go, SQL" },
  { group: "Backend", items: "Node.js, Express, Next.js API routes, Go (chi, gorilla/mux), BullMQ, node-cron" },
  { group: "Data", items: "PostgreSQL, MySQL, MongoDB, Redis, Knex, Prisma (migrations), Mongoose" },
  { group: "Payments and integrations", items: "Stripe, Creem, X API v2, OpenAI and Azure OpenAI, Anthropic, Resend, SES, Ghost" },
  { group: "Frontend", items: "React 19, Next.js 16, Astro 5, Tailwind CSS v4, Plasmo browser extensions" },
  { group: "Ops", items: "Docker, GitHub and Gitea Actions, Kubernetes, pm2, nginx, WireGuard, Sentry, Cloudflare R2, Wasabi" },
];
