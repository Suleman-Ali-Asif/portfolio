/**
 * projects.ts: single source of truth for all portfolio projects.
 *
 * Every claim here was checked against the project repositories in
 * September 2026 (git history, config, cron strings, source files).
 * No performance metrics on the site; those live in the résumé.
 */

import type { ProjectItem } from "@/app/types";

// ---------------------------------------------------------------------------
// Standard node positions (SVG viewBox 0 0 620 240).
// 5-node layout: two nodes on row 1 (y=70), three on row 2 (y=175).
// ---------------------------------------------------------------------------
export const NODE_POSITIONS = {
  client:   { x: 90,  y: 155 },
  api:      { x: 310, y: 155 },
  db:       { x: 520, y: 155 },
  external: { x: 310, y: 55  },
} as const;

// 5-node two-row layout positions
const R1L = { x: 190, y: 70  }; // row 1, left
const R1R = { x: 430, y: 70  }; // row 1, right
const R2L = { x: 90,  y: 175 }; // row 2, left
const R2C = { x: 310, y: 175 }; // row 2, centre
const R2R = { x: 530, y: 175 }; // row 2, right

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------
function validateProject(p: ProjectItem): void {
  const requiredStrings: (keyof ProjectItem)[] = ["slug", "name", "image", "description"];
  for (const field of requiredStrings) {
    const value = p[field];
    if (typeof value !== "string" || value.trim() === "") {
      throw new Error(
        `Project "${p.name || "(unnamed)"}" is missing required string field: "${field}"`
      );
    }
  }

  if (!Array.isArray(p.stack) || p.stack.length === 0) {
    throw new Error(`Project "${p.name}" must have at least one item in "stack"`);
  }

  if (p.architecture !== undefined) {
    if (!p.architecture.summary?.trim()) {
      throw new Error(`Project "${p.name}" is missing architecture.summary`);
    }
    if (!Array.isArray(p.architecture.nodes) || p.architecture.nodes.length === 0) {
      throw new Error(`Project "${p.name}" must have at least one architecture node`);
    }
    if (!Array.isArray(p.architecture.edges) || p.architecture.edges.length === 0) {
      throw new Error(`Project "${p.name}" must have at least one architecture edge`);
    }
  }
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
const PROJECTS: ProjectItem[] = [
  // ─── Verid ────────────────────────────────────────────────────────────────
  {
    slug: "verid",
    name: "Verid",
    image: "/verid-light.png",
    imageDark: "/verid-dark.png",
    description:
      "Web change detection for developers. Point it at a URL, pick an extraction rule and a predicate, and get a signed webhook only when something you care about actually changed.",
    stack: ["TypeScript", "Next.js 16", "BullMQ", "PostgreSQL", "Redis", "Knex", "Cloudflare R2", "Creem", "Docker"],
    url: "https://verid.dev",
    role: "Architecture, worker, API, billing, production",
    outcome: "Postgres is the only scheduling source of truth. Redis can be wiped and the scheduler picks up exactly where it left off.",

    problem:
      "Most change-detection tools alert on any diff, so the useful signal drowns in noise. Developers wanted a specific field out of a page (a price, a version string, a stock flag), a rule for when a change matters, and a delivery they could verify and replay. It also had to keep working on pages that block plain HTTP, and it had to be cheap enough to run on two small servers.",

    whatIBuilt: [
      "An npm workspaces monorepo: Next.js 16 app (marketing, SSR dashboard, REST API, billing), a BullMQ worker, an Express admin panel, a Nextra docs site, and eight shared packages",
      "Six extractors: CSS, XPath, JSONPath, regex, full page text, and an LLM prompt that returns JSON against a schema",
      "A predicate engine: any change, a named field, percent or absolute thresholds, regex, equality, and AND/OR composites",
      "Four delivery channels: HMAC-signed webhooks, email, Slack, and Discord, with a retry ladder, a dead-letter path, and one-click replay",
      "A three-tier fetcher: plain HTTP, then a pooled stealth Chromium, then a residential proxy with sticky sessions",
      "Visual monitoring: full-page or region screenshots, pixel diffs with a change threshold, PNGs in Cloudflare R2 behind signed URLs",
      "In-house auth (scrypt, DB sessions, Google OAuth with PKCE) replacing a third-party library, plus scoped API keys with rotation",
      "Creem billing with order-independent tier reconciliation, and a public playground that runs the real extraction pipeline",
      "A published zero-dependency SDK, a hand-maintained OpenAPI 3.1 spec, a Postman collection, and an llms.txt for agents",
    ],

    engineeringWork: [
      "Scheduler claims due monitors with SELECT FOR UPDATE SKIP LOCKED and bumps next_run_at in the same transaction, so two workers can never double-run one monitor",
      "The API never enqueues scrape jobs. Run now sets next_run_at; pause and delete only remove pending jobs. Redis is treated as disposable and is not backed up",
      "Webhook signing mirrors Stripe: a per-monitor secret encrypted at rest with AES-256-GCM, a t=…,v1=… header, a five-minute replay window, constant-time comparison",
      "Delivery retries are a manual ladder (immediate, 5m, 15m, 30m, 1h, 2h) so every attempt is its own row, and a delivery already marked success or dead is skipped on redelivery",
      "Static fetches that return a 200 with empty fields on CSS or XPath rules escalate to the browser and evaluate the selectors in the live DOM. JSONPath never escalates, because a browser would wrap the JSON in HTML",
      "A Redis circuit breaker for search-engine URLs separates refusals from unusable pages, doubles its cooldown per refusal from 15 minutes up to 6 hours, and paces requests through a Lua-reserved slot",
      "LLM extraction is cached in Redis for 30 days by content hash, so an unchanged page never bills the user twice; OpenAI is primary with an Anthropic fallback",
      "Tier caps live in one typed module read by the API, the worker, the pricing page and the dashboard. A new tier fails to compile until it has a rate-limit budget",
      "Billing re-derives the tier from the subscriptions table on every Creem event instead of trusting event order, after an out-of-order cancellation locked a paying user's monitors",
    ],

    impact: [
      "Users get one webhook per meaningful change, verified with a signature they can check, and can replay any delivery from the dashboard",
      "The worker survives restarts and concurrent instances without duplicate runs, because scheduling state lives in Postgres alone",
      "Everything runs on two self-hosted VPS: images built in GitHub Actions, migrations applied before the worker restarts, nightly pg_dump shipped to Backblaze B2",
    ],

    requestFlow: [
      "Client calls POST /v1/monitors with an API key. The route authenticates, applies a per-tier sliding-window rate limit in Redis, validates the body, and checks tier caps",
      "The monitor row is inserted with next_run_at set to now. If a webhook target exists, a secret is generated and stored encrypted",
      "Every 30 seconds the worker claims due monitors with FOR UPDATE SKIP LOCKED and enqueues one scrape job per monitor",
      "The scrape job fetches (static, browser, or proxy), extracts the configured fields, diffs them against the last successful run, and evaluates the predicate",
      "If the predicate fires, one delivery row is created per target and a deliver job is queued. Webhooks are signed and POSTed with a 15 second timeout",
      "Failures step through the backoff ladder. After the sixth attempt the delivery is marked dead and the user is emailed from the dead-letter queue",
      "The receiver verifies the signature with the shared secret and a five-minute timestamp tolerance. Any delivery can be replayed from the API",
    ],

    architecture: {
      summary:
        "A Next.js app owns the API, dashboard and billing. A separate BullMQ worker owns scheduling, fetching, extraction and delivery. Both share one Postgres and one Redis over a WireGuard tunnel between two VPS. Postgres is the source of truth; Redis holds queues, rate limits and caches and can be lost without data loss.",
      nodes: [
        {
          id: "worker",
          label: "Worker",
          sublabel: "Node, BullMQ",
          type: "server",
          ...R1L,
          tooltip:
            "A single Node process running four BullMQ workers (scrape, deliver, dlq, preview), a 30-second scheduler tick, an hourly lifecycle-email tick and a daily retention sweep. The scheduler claims due monitors atomically with SELECT FOR UPDATE SKIP LOCKED. Scrape jobs run the three-tier fetcher (static HTTP, pooled stealth Chromium, residential proxy), the extractor, the diff and the predicate, then write the run and queue deliveries. Bull Board is exposed on a separate port behind basic auth.",
        },
        {
          id: "targets",
          label: "Sites and targets",
          sublabel: "Monitored URLs, webhooks",
          type: "external",
          ...R1R,
          tooltip:
            "Monitored pages and APIs on the way in; webhook endpoints, Slack, Discord and email on the way out. Pages that block plain HTTP are retried through a stealth browser pool, then through a residential proxy with sticky, geo-matched sessions. Webhooks are POSTed with an HMAC-SHA256 signature header, a 15 second timeout and a six-step retry ladder.",
        },
        {
          id: "clients",
          label: "Dashboard, SDK",
          sublabel: "Browser, @verid.dev/sdk",
          type: "client",
          ...R2L,
          tooltip:
            "The SSR dashboard in the Next.js app, the published TypeScript SDK, Postman, and any HTTP client with a vrd_ API key. Marketing pages are statically generated; the public playground reuses the production extraction pipeline under an IP rate limit.",
        },
        {
          id: "app",
          label: "Next.js app",
          sublabel: "API, auth, billing",
          type: "server",
          ...R2C,
          tooltip:
            "Next.js 16 App Router serving the marketing site, the dashboard, /api/v1 REST routes, in-house auth (scrypt passwords, DB sessions, Google OAuth with PKCE), scoped API keys, Creem checkout and webhooks, and the playground. Rate limiting is a Lua sliding window in Redis keyed by user and tier. The app never enqueues scrape jobs; it only writes next_run_at and delivery status to Postgres.",
        },
        {
          id: "data",
          label: "Postgres, Redis",
          sublabel: "Knex, BullMQ, R2",
          type: "database",
          ...R2R,
          tooltip:
            "PostgreSQL with Prisma for migrations and Knex for every runtime query. Fourteen tables cover users, sessions, API keys, monitors, runs, snapshots, deliveries, templates, usage and billing. Redis 7 carries the BullMQ queues, rate-limit windows, the 30-day LLM cache, proxy host flags and the search-engine circuit breaker. Screenshot PNGs live in Cloudflare R2; only object keys are stored in Postgres.",
        },
      ],
      edges: [
        { from: "clients", to: "app",     label: "HTTPS, REST",            bidirectional: true  },
        { from: "app",     to: "data",    label: "Knex, rate limits",      bidirectional: true  },
        { from: "worker",  to: "data",    label: "Claim, run, deliver",    bidirectional: true  },
        { from: "worker",  to: "targets", label: "Fetch, signed POST",     bidirectional: true  },
      ],
    },
  },

  // ─── Commodity Price API ──────────────────────────────────────────────────
  {
    slug: "commodity-price-api",
    name: "Commodity Price API",
    image: "/commodity-light.png",
    imageDark: "/commodity-dark.png",
    description:
      "A paid REST API for live and historical commodity prices, from gold and crude to US energy, USDA livestock and EU electricity. Taken over in 2024 and grown from three services to twelve.",
    stack: ["TypeScript", "Express", "MongoDB", "Next.js 16", "node-cron", "Stripe", "MCP", "Docker", "pm2"],
    url: "https://commoditypriceapi.com",
    role: "Primary maintainer since September 2024",
    outcome: "Live prices are answered from a map in the API process. Loaders push changes in; MongoDB is the fallback, not the hot path.",

    problem:
      "The original API read from the database on every request and covered a narrow set of scraped symbols. Customers wanted more coverage, official sources with clean licensing, faster gold and silver, an honest trial, and tooling that fit how developers work now. All of that had to land without a rewrite, on a codebase inherited from a previous developer.",

    whatIBuilt: [
      "The loader to API hot path: a one-minute loader pushes the full rate map over a JWT-authenticated POST into the API's in-memory map, with MongoDB as the lazy fallback",
      "One-second gold and silver bid/ask fetchers with dedicated endpoints that break prices down by gram, tola and carat",
      "Six data loaders: live quotes, FT scrape, EIA energy, USDA AMS livestock and grain, EU electricity from ENTSO-E, energy-charts and Eurostat, plus IMF and World Bank monthly importers",
      "v2 of the public API: latest, historical, time-series and fluctuation endpoints, quote-currency conversion, and a consistent error format",
      "Billing and accounts: Stripe Checkout and Billing Portal, idempotent webhooks, seven-day trials with self-service and admin extension, nightly trial-expiry and yearly-plan reset crons, account deletion",
      "Write-behind API metering with a per-day usage ledger that powers the dashboard heatmap",
      "The official MCP server, published to npm, with eight tools that map one-to-one onto v2 endpoints",
      "The marketing site, docs and dashboard in Next.js 16, and a separate free-tools site with per-symbol price pages, metal calculators and ratio pages",
      "The X price bot rewrite after API access was lost, replaying a captured request through a remote browser",
    ],

    engineeringWork: [
      "Loader change detection honours a per-source preference ladder: lower preference wins, equal preference must differ in value. Only changed symbols are written to MongoDB; the full map is pushed to the API",
      "Plans with a ten-minute update frequency read from a snapshot map copied every ten minutes; faster plans read the live map. One codebase, no per-tier branching in the controllers",
      "Usage counting happens after the response finishes, in memory. A five-minute cron flushes deltas with a single $inc bulkWrite, puts them back on failure, and caches unknown keys as null so bad keys never hit the database twice",
      "Gold and silver loops use a five-second per-call timeout, exponential backoff from one to thirty seconds, and stop with an email after five consecutive failures",
      "Official-source loaders poll change signals, not data: EIA's manifest hourly, USDA's publish and correction feeds every fifteen minutes, with a safety valve that forces a full run after six failed checks",
      "EU electricity data is only stored if the response declares a CC BY licence and the expected zone and unit; anything else fails closed and alerts. Attribution was added to the symbols page and Terms",
      "Ticks go to a MongoDB time-series collection with a short TTL; official daily prints go to a separate OHLC collection upserted on commodity and date, so history never depends on the scrape feed",
      "Stripe webhooks store each event ID in a unique collection and check its status before processing, so redeliveries are no-ops",
    ],

    impact: [
      "Twelve repositories in production: nine long-running services, two manual importers and one npm CLI, all TypeScript, deployed by Gitea Actions over SSH",
      "Coverage grew from scraped exchange quotes to include seventeen EIA symbols, sixteen USDA symbols and seventy EU power symbols from official sources",
      "Developers can call the API from Claude, Cursor or any MCP client without writing HTTP code",
    ],

    requestFlow: [
      "Every minute the loader fetches Capital.com and Seeking Alpha quotes in two batched requests and compares each symbol against its in-memory map",
      "Changed symbols are inserted into MongoDB. The full map is POSTed to the API's internal route with a short-lived service JWT",
      "A client calls GET /v2/rates/latest?symbols=XAU,BRENT with an API key in the header",
      "The API validates the key against its user map, rejects ended trials and inactive plans, and checks the monthly quota",
      "The controller picks the live map or the ten-minute snapshot map from the plan's update frequency, then reads each symbol. Misses fall through to MongoDB and are written back to the map",
      "Symbols from official sources (EIA, USDA, power, IMF, World Bank) are read from the OHLC collection instead",
      "If a quote currency is requested and the plan allows it, rates are converted through CurrencyFreaks. A conversion failure still returns 200 with a warning field",
      "When the response finishes, usage is incremented in memory and flushed to MongoDB by the five-minute cron",
    ],

    architecture: {
      summary:
        "Loaders write to MongoDB and push the live map into the Express API over a JWT-authenticated internal route. The API answers from memory and falls back to MongoDB on a miss. Two Next.js sites, the MCP server and the X bot are ordinary API-key clients of v2. Everything is TypeScript in Docker, deployed by Gitea Actions.",
      nodes: [
        {
          id: "loaders",
          label: "Loaders",
          sublabel: "Node, node-cron",
          type: "server",
          ...R1L,
          tooltip:
            "Six loader services on their own cron schedules: the live loader (one-minute cron for Capital.com and Seeking Alpha, plus one-second gold and silver loops), the FT scraper every ten minutes, EIA on an hourly manifest check, USDA on a fifteen-minute publish watch, and EU electricity on day-ahead and settlement schedules in Berlin and Brussels time. IMF and World Bank importers run manually each month. Each loader compares incoming values to its map and writes only what changed.",
        },
        {
          id: "sources",
          label: "Data sources",
          sublabel: "Exchanges, EIA, USDA, ENTSO-E",
          type: "external",
          ...R1R,
          tooltip:
            "Capital.com and Seeking Alpha for live quotes, FT markets via a scraper API, EIA Open Data, USDA AMS My Market News, ENTSO-E, energy-charts and Eurostat for EU power, IMF and World Bank monthly sheets, and CurrencyFreaks for quote conversion. Government and EU sources are polled through their change signals (manifests, publish feeds) rather than on a blind loop.",
        },
        {
          id: "clients",
          label: "Web, tools, MCP",
          sublabel: "Next.js 16, npm",
          type: "client",
          ...R2L,
          tooltip:
            "The marketing site, docs and dashboard (Next.js 16, App Router), the free tools site under /tools with per-symbol pages, metal calculators and ratio pages, the @commoditypriceapi/mcp server, and the X price bot. All of them call v2 with an API key; the web app additionally uses cookie-based JWT auth against v1 for accounts and billing.",
        },
        {
          id: "api",
          label: "API server",
          sublabel: "Express, in-memory maps",
          type: "server",
          ...R2C,
          tooltip:
            "Express 4 with Mongoose, Passport (local, JWT cookie, Google OAuth) and zod. Holds the live rate map, the ten-minute snapshot map, the gold and silver map, and a user map with cached quota state. Enforces trials, plan quotas, symbols per request and quote conversion per plan. Handles Stripe Checkout, Billing Portal and idempotent webhooks. Runs under pm2 in Docker.",
        },
        {
          id: "db",
          label: "MongoDB",
          sublabel: "Time-series, OHLC, users",
          type: "database",
          ...R2R,
          tooltip:
            "A time-series collection for ticks with a short TTL, an OHLC collection for official daily and monthly prints with a unique index on commodity and date, and collections for users, plans, Stripe webhook events (unique event ID), per-day API key usage and trials. Read on API boot to seed lookup maps and on cache misses; otherwise off the hot path.",
        },
      ],
      edges: [
        { from: "sources", to: "loaders", label: "Poll, scrape, download",  bidirectional: false },
        { from: "loaders", to: "api",     label: "Push rate map (JWT)",     bidirectional: false },
        { from: "loaders", to: "db",      label: "Write changed rates",     bidirectional: false },
        { from: "clients", to: "api",     label: "REST v2, API key",        bidirectional: true  },
        { from: "api",     to: "db",      label: "Fallback read, users",    bidirectional: true  },
      ],
    },
  },

  // ─── TweetStorm.ai ────────────────────────────────────────────────────────
  {
    slug: "tweetstorm-ai",
    name: "TweetStorm.ai",
    image: "/tweetstorm-light.png",
    imageDark: "/tweetstorm-dark.png",
    description:
      "Tools for X that X does not ship: AI writing, a thread scheduler, a bookmark manager, and filtered bulk actions run inside x.com by browser extensions.",
    stack: ["TypeScript", "Next.js 16", "MySQL", "Knex", "Prisma", "BullMQ", "Redis", "Plasmo", "Stripe", "X API v2"],
    url: "https://tweetstorm.ai",
    role: "Scheduler, bookmarks, extensions, billing, deploys",
    outcome: "A scheduled thread can be claimed once, resumed mid-thread after a crash, and never posts a tweet twice.",

    problem:
      "The product started as an AI tweet generator with a Stripe subscription. Users wanted to schedule threads through the official X API, keep their bookmarks somewhere searchable, and clean up years of posts in bulk. Each of those needs a different trust boundary: X's OAuth for posting, the user's own browser session for bookmarks and bulk actions, and a server that can crash mid-thread without double posting.",

    whatIBuilt: [
      "The thread scheduler end to end: composer, per-account posting slots and timezones, media uploads to Wasabi via presigned URLs, plan quotas, and BullMQ delayed jobs",
      "A standalone BullMQ worker that publishes threads to X API v2, with its own CI, staging and production stacks",
      "The bookmark manager: folders to depth three, tags, smart folders, archive and read states, plan-gated storage, and a backup sync through the X API for users without the extension",
      "The Bookmark Manager extension for Chrome (MV3) and Firefox (MV2) in Plasmo, which mirrors X bookmarks into the app by replaying X's own GraphQL requests",
      "Most of the content scripts in the Mass Tweet Deletion extension: engagement, reply, like and verified-account filters, pause on tab hide, and scroll recovery on X's infinite feeds",
      "Stripe lifecycle handling across two independent plan families (Core and Bookmarks), receipts and invoice tracking, and Stripe-backed backfill scripts",
      "The Prisma to Knex query migration, Azure OpenAI as the primary model host with OpenAI fallback, dark mode, the free video downloader, and the sha-pinned Gitea registry deploy pipeline",
    ],

    engineeringWork: [
      "Publishing is claimed with a conditional UPDATE from scheduled to publishing. The claim can be retaken only when the lock is older than 45 seconds, a window chosen to sit between BullMQ's job lock and the 60 second retry backoff",
      "Each tweet and media upload persists its X ID as it succeeds, so a retry after a crash resumes at the first unpublished tweet instead of reposting the thread",
      "Errors are classified: tweet too long or media too large are terminal and stop retries; network and X 5xx errors rethrow for BullMQ's three attempts. Usage is refunded and the user emailed only when the thread finally fails",
      "X refresh-token rotation is serialised per account with a Redis SET NX PX lock and a re-read after acquire, so two jobs for one account cannot both rotate the token",
      "The bookmark extension captures X's own Bookmarks request via webRequest, then replays it with fresh cookies and CSRF token, paginates on the bottom cursor with 500 ms spacing, and POSTs batches of twenty to the app. Query IDs and feature flags are learned at runtime, not hard-coded",
      "Bookmark dedupe is scoped by user, X handle and tweet ID, so several X accounts can share one TweetStorm account without collisions",
      "Public thread IDs are a bijection over 2^40 encoded in Crockford base32, so URLs do not leak sequential database IDs",
      "The checkout.session.completed and customer.subscription.updated webhooks race. Both handlers catch the duplicate-key error on the subscriptions insert and treat it as already created",
      "Media is deleted from Wasabi immediately after a successful publish; rejected oversized uploads are flagged and swept daily",
    ],

    impact: [
      "Scheduling, bookmarks and bulk actions ship as three separate trust boundaries: OAuth for posting, the user's own session for extension work, and a worker that cannot double post",
      "Both extensions run on Chrome and Firefox from one Plasmo codebase each, listed in both stores",
      "Deploys are sha-pinned images in a self-hosted registry with two versions kept for rollback, blue and green app containers, and separate staging and production worker stacks",
    ],

    requestFlow: [
      "User composes a thread. Media goes straight from the browser to Wasabi through a presigned PUT",
      "POST /api/scheduler/threads validates media composition (four photos, or one GIF, or one video), thread structure, the account's schedulability and the monthly quota, then inserts the thread and tweets in one transaction",
      "A BullMQ publish job is enqueued with a delay to the scheduled time, three attempts and 60 second exponential backoff. The job ID is stored on the thread",
      "At the scheduled time the worker claims the thread with a conditional UPDATE, refreshes the X token under a Redis lock, and pre-checks weighted tweet length",
      "For each tweet: stream media from Wasabi, upload to X, post with in_reply_to_tweet_id, persist the X IDs. Already-published tweets are skipped on retry",
      "On success the thread is marked published, media is deleted from Wasabi and an audit event is written. On terminal failure usage is refunded once and paying users are emailed",
    ],

    architecture: {
      summary:
        "A Next.js 16 app owns the UI, the API and the schema. A separate BullMQ worker consumes the publish queue and talks to X API v2. Three Plasmo extensions run inside x.com and call the app's extension routes. Stripe webhooks drive two plan families. MySQL is the source of truth; Redis carries the delayed jobs and per-account locks.",
      nodes: [
        {
          id: "worker",
          label: "Publish worker",
          sublabel: "Node, BullMQ",
          type: "server",
          ...R1L,
          tooltip:
            "A standalone Node process consuming the publish queue. Claims a thread atomically, refreshes the X OAuth token under a Redis lock, streams media from Wasabi, uploads and posts each tweet through X API v2, persists X IDs for resume, and writes audit events. Terminal errors stop retries; transient ones use BullMQ's three attempts with 60 second exponential backoff. Deployed as separate staging and production stacks with per-table MySQL grants.",
        },
        {
          id: "x",
          label: "X, Stripe, OpenAI",
          sublabel: "External APIs",
          type: "external",
          ...R1R,
          tooltip:
            "X API v2 for OAuth 2.0 with PKCE, token refresh, bookmark listing and deletion, media upload and posting. Stripe for two independent subscription families with nine handled webhook events. Azure OpenAI hosting GPT-4.1 for generation, with automatic fallback to OpenAI direct and an alert email on rate limits. Wasabi (S3 compatible) for scheduled media.",
        },
        {
          id: "clients",
          label: "Web app, extensions",
          sublabel: "React 19, Plasmo",
          type: "client",
          ...R2L,
          tooltip:
            "The Next.js web app plus three Plasmo browser extensions for Chrome and Firefox. The Bookmark Manager intercepts and replays X's own GraphQL requests with the user's session and syncs into the app using the NextAuth session cookie. The Mass Tweet Deletion extension runs filtered bulk actions inside x.com with jittered pacing. The AI Generator injects a prompt bar under X's composer and authenticates with a per-user API key.",
        },
        {
          id: "app",
          label: "Next.js app",
          sublabel: "API routes, NextAuth",
          type: "server",
          ...R2C,
          tooltip:
            "Next.js 16 App Router with more than fifty API routes behind a shared handleRequest wrapper: AI generation with tiered credit debit, scheduler threads and slots, bookmarks CRUD and sync, extension routes, public rate-limited generators, and Stripe webhooks. NextAuth with Google, X and credentials. Prisma owns the schema and migrations; Knex runs every query. Blue and green containers behind nginx.",
        },
        {
          id: "db",
          label: "MySQL, Redis",
          sublabel: "Knex, BullMQ",
          type: "database",
          ...R2R,
          tooltip:
            "MySQL 8 with 32 models: users, plans, subscriptions, receipts, credits and bulk-action usage, scheduled threads, tweets and media, scheduler events and monthly usage, X accounts, bookmarks, folders, smart folders and tags. Redis 7 with AOF holds the BullMQ publish queue (delayed jobs) and the per-account token-refresh locks.",
        },
      ],
      edges: [
        { from: "clients", to: "app",    label: "REST, session or API key", bidirectional: true  },
        { from: "app",     to: "db",     label: "Knex, enqueue",            bidirectional: true  },
        { from: "app",     to: "x",      label: "OAuth, Stripe, OpenAI",    bidirectional: true  },
        { from: "worker",  to: "db",     label: "Claim, resume, audit",     bidirectional: true  },
        { from: "worker",  to: "x",      label: "Upload, post",             bidirectional: false },
      ],
    },
  },

  // ─── Netus.ai ─────────────────────────────────────────────────────────────
  {
    slug: "netus-ai",
    name: "Netus.ai",
    image: "/netus-light.png",
    imageDark: "/netus-dark.png",
    description:
      "An AI writing platform on a Go and MySQL backend. Owned billing and credits, opened the tools to anonymous visitors, and built the newsletter and video-download services and most of the Astro marketing site.",
    stack: ["Go", "MySQL", "Redis", "Astro 5", "React", "Stripe", "Creem", "AWS SES", "Ghost", "Kubernetes"],
    url: "https://netus.ai",
    role: "Billing, credits, Go services, marketing site",
    outcome: "Credits are debited in one order everywhere: one-off packs first, then the subscription, then personal credits.",

    problem:
      "Subscription state was written from the client after checkout, so a failed redirect meant a paying user without credits. Plans were hard-coded in environment variables. The marketing site could not let visitors try the tools without an account, and blog and newsletter workflows depended on WordPress. The team also needed a video downloader and a newsletter sender that would not block the main API.",

    whatIBuilt: [
      "Stripe billing rebuilt around webhooks (checkout, subscription updated and deleted, invoice paid and failed) with a unique constraint and upsert on the Stripe subscription ID; later extended to Creem past-due and renewal events",
      "A plans table mapping Stripe price IDs and Creem product IDs to credit allowances and intervals, replacing hard-coded mappings, with a Go backfill tool for existing subscriptions",
      "Pay-as-you-go credit packs: Stripe Checkout in payment mode with tiered pricing, a six-month expiry, and a layered deduction engine used by every tool",
      "Redis in the backend, with a Lua-scripted daily and per-minute rate limiter, and a public API that lets anonymous visitors try a dozen tools under per-tool daily limits",
      "Dunning emails for failed payments on an escalating schedule, keyed by invoice in Redis and cleared on renewal",
      "A Kubernetes CronJob in Go that resets free-tier credits on the first of each month in batches",
      "A newsletter service in Go: Ghost webhooks feed Redis sets, a weekly scheduler enqueues a digest, a worker renders and sends per-subscriber email through SES with HMAC unsubscribe links",
      "A standalone video download service in Go around yt-dlp, extracted from the monolith, sharing the guest-token JWT with the main API",
      "Most of the Astro 5 marketing site: product pages, pricing with comparison tables, cookie consent, support form, JSON-LD, and the public React tool islands",
      "The blog migration from the WordPress REST API to Ghost with SSR, a webhook-maintained related-posts index, and a post-build HTML to Markdown mirror with llms.txt",
    ],

    engineeringWork: [
      "Credit deduction runs in one fixed order across the bypasser, paraphraser, summariser, article and keyword tools: one-off packs, then subscription credits, then personal credits, with partial-cover arithmetic when a pack runs out mid-request",
      "The rate limiter is a single Lua script (INCR, then EXPIRE only when the count is one) so the daily window and the per-minute window are each set atomically. It fails open if Redis is down",
      "Guest access reuses one HttpOnly cookie across netus.ai and vd.netus.ai. The video service verifies the same JWT with the same secret, so a visitor's daily quota follows them between services",
      "Dunning counters live in Redis with a 21-day TTL and send at attempts one, three, five and seven, so retry storms from the payment provider do not spam the customer",
      "The digest pipeline is two stages: the scheduler only pushes a date onto a Redis list; a BRPOP worker does the send. A restart between the two loses nothing",
      "Newsletter sends go out in batches of 500 with a global 14 per second ticker under the SES limit, and fall back to four balanced Ghost posts when a week has no new content",
      "The video service retries yt-dlp with an Android player client, then a best-audio fallback, caps files at 500 MB, streams the result and deletes it",
      "Transactional email moved from SES to Zeptomail over SMTP with an explicit STARTTLS handshake; bulk newsletter stayed on the SES SDK from a separate sending domain",
      "The Markdown mirror is a 1,176-line converter that walks the built HTML, strips navigation and CTA chrome, and emits a sibling .md for every page plus llms.txt and llms-full.txt",
    ],

    impact: [
      "Subscription state is set by the provider's events, not by the browser redirect, so an interrupted checkout no longer leaves a paying user without credits",
      "Anonymous visitors can try the paraphraser, detector, summariser and nine generators on the marketing site without an account, each under its own daily limit",
      "Newsletter, video download and credit resets each run as their own Kubernetes workload with their own scaling and failure surface",
    ],

    requestFlow: [
      "A visitor on netus.ai uses a tool. The site checks for a guest cookie; if none, it runs reCAPTCHA v3 and requests a guest token. A low score returns 428 and the client retries with reCAPTCHA v2",
      "The public route passes through the guest middleware and the Redis rate limiter, which maps the endpoint to a generation type and its daily limit",
      "For a signed-in user, the same tool route checks credits (one-off, subscription, personal) and refuses with 402 if the sum is short",
      "The backend builds the prompt, calls Azure OpenAI GPT-4.1 with a fallback to OpenAI on 429, and post-processes the output",
      "The generation is stored and credits are debited in order. One-off packs are consumed first",
      "On renewal, Stripe's invoice.payment_succeeded (or Creem's subscription.paid) resets subscription credits from the plans table. Free users are reset by the monthly CronJob",
    ],

    architecture: {
      summary:
        "A Go REST API on MySQL and Redis serves the React app and the Astro marketing site. Stripe and Creem webhooks own subscription state. Three smaller Go workloads (newsletter, video download, free-credit reset) run beside it on DigitalOcean Kubernetes, sharing Redis and the guest-token secret.",
      nodes: [
        {
          id: "services",
          label: "Go services",
          sublabel: "Newsletter, video, cron",
          type: "server",
          ...R1L,
          tooltip:
            "Three independent Go workloads on the same cluster. Newsletter: chi server receiving Ghost webhooks, a robfig/cron scheduler that enqueues the weekly digest, and a BRPOP worker that sends per-subscriber HTML through SES in batches of 500. Video downloader: chi server around yt-dlp and ffmpeg with the shared guest-token middleware and a per-minute Redis limit. Credit reset: a Kubernetes CronJob on the first of each month that resets free-tier credits in batches of 1,000.",
        },
        {
          id: "external",
          label: "Stripe, Creem, Ghost",
          sublabel: "Webhooks in, SES out",
          type: "external",
          ...R1R,
          tooltip:
            "Stripe and Creem send signature-verified subscription and invoice events that create, renew, cancel and dun subscriptions. Ghost sends HMAC-verified publish webhooks to the newsletter service and the site. Azure OpenAI GPT-4.1 handles generation with OpenAI direct as fallback; Claude Haiku is used for custom writing styles. AWS SES sends the newsletter; Zeptomail sends transactional mail.",
        },
        {
          id: "clients",
          label: "Site, app",
          sublabel: "Astro 5, React 18",
          type: "client",
          ...R2L,
          tooltip:
            "The Astro 5 marketing site on netus.ai with React islands for every public tool, a Ghost-backed SSR blog with related posts, cookie consent, pricing and a Markdown mirror of every page for LLM crawlers. The React app on app.netus.ai for signed-in users, with the one-off credit purchase flow, billing pages and a cancellation-reason form.",
        },
        {
          id: "api",
          label: "Go API",
          sublabel: "gorilla/mux, raw SQL",
          type: "server",
          ...R2C,
          tooltip:
            "Go REST API with two route groups: /api/v1 behind JWT auth and /api/v1/public behind the guest-token middleware and the Redis rate limiter. Owns the AI tools, the layered credit engine, plans, one-off credits, Stripe and Creem webhooks, dunning, support and transactional email. Prepared statements against MySQL; no ORM.",
        },
        {
          id: "db",
          label: "MySQL, Redis",
          sublabel: "Credits, plans, limits",
          type: "database",
          ...R2R,
          tooltip:
            "MySQL holds users, user_credits (personal and subscription), one_off_credits with expiry and a unique Stripe session ID, plans keyed by Stripe price and Creem product IDs, user_subscriptions with a unique Stripe ID, payments and cancellation reasons. Redis 7 with an LRU cap holds daily and per-minute rate-limit counters, dunning counters, newsletter job lists and sets.",
        },
      ],
      edges: [
        { from: "clients",  to: "api",      label: "REST, JWT or guest cookie", bidirectional: true  },
        { from: "api",      to: "db",       label: "Prepared SQL, Lua limits",  bidirectional: true  },
        { from: "external", to: "api",      label: "Signed webhooks",           bidirectional: false },
        { from: "services", to: "db",       label: "Queues, resets",            bidirectional: true  },
        { from: "services", to: "external", label: "SES, Ghost",                bidirectional: true  },
      ],
    },
  },
];

// Validate every project at module load time.
PROJECTS.forEach(validateProject);

export { PROJECTS };
