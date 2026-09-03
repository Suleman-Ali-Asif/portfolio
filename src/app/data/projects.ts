/**
 * projects.ts — single source of truth for all portfolio projects.
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
  // ─── Commodity Price API ──────────────────────────────────────────────────
  {
    slug: "commodity-price-api",
    name: "Commodity Price API",
    image: "/commodity-light.png",
    imageDark: "/commodity-dark.png",
    description:
      "Multi-app system serving real-time and delayed commodity price data for 130+ commodities via a tiered REST API. Led all applications from architecture to deployment.",
    stack: ["Node.js", "Next.js", "MongoDB", "Stripe", "Cron Jobs", "In-Memory Cache", "Ghost CMS"],
    url: "https://commoditypriceapi.com",

    problem:
      "No developer-friendly API existed for real-time commodity prices at a reasonable cost. Enterprise data providers were expensive; free alternatives served stale data with no tier structure. The product needed fresh data, tiered access, and sub-second response times without hitting a database on every request.",

    whatIBuilt: [
      "REST API serving 130+ commodities (gold, oil, silver, natural gas, wheat) across four subscription tiers",
      "In-memory hashmap cache as the primary read path — all live prices held in API server RAM",
      "Loader app with cron jobs polling two external sources every 1 second and every 1 minute",
      "Smart change-detection in loader: only writes to MongoDB or pushes to cache when price actually changes",
      "Three additional data loaders: 10-minute web scraper, World Bank monthly loader, IMF commodities loader",
      "Tools app with per-commodity price pages (live charts) and a commodity-to-commodity converter",
      "Stripe payment integration with subscription tiers (free / lite / pro / premium)",
      "Ghost blog: deployed, configured, and managed",
    ],

    engineeringWork: [
      "Designed in-memory hashmap cache keyed by commodity symbol — eliminates DB round-trips on every API request",
      "Built loader change-detection: compares incoming price to cached value, skips write entirely if identical — avoids redundant DB writes",
      "Two-tier cron schedule: 1-second cron for premium/real-time feeds, 1-minute cron for standard feeds",
      "Request-tier middleware validates subscription plan and determines which data freshness (10 min / 1 min / 1 s) the caller receives",
      "MongoDB used as persistence and crash-recovery fallback only — not on the hot read path",
      "Deployed and managed 7 separate applications across the system",
    ],

    impact: [
      "API response time: ~1–3 seconds → ~150–400ms after replacing DB reads with in-memory hashmap lookups",
      "Redundant DB writes eliminated — loader only writes when data actually changes",
      "Four subscription tiers (different data freshness) served from a single API codebase with no per-tier branching logic",
    ],

    requestFlow: [
      "Cron fires every 1s or 1min → Loader fetches latest price from external data source",
      "Loader compares incoming price to current cached value — if unchanged, skip write entirely",
      "If changed: write new price to MongoDB, push updated value into API server's in-memory hashmap",
      "Client sends GET /v1/prices/:symbol with API key",
      "Request-tier middleware resolves subscription plan → determines allowed data freshness",
      "API server reads price from hashmap (sub-millisecond lookup) → returns response",
      "On API server restart (empty cache): fallback read from MongoDB to rebuild hashmap before serving",
    ],

    architecture: {
      summary:
        "Seven-app system: a Node.js API server with an in-memory hashmap cache as the primary read path, fed by cron-driven loader apps. MongoDB serves as persistence and crash-recovery fallback, not the hot path. Data freshness (10 min / 1 min / 1 s) is enforced per subscription tier.",
      nodes: [
        {
          id: "loaders",
          label: "Loader Apps",
          sublabel: "Node.js · Cron",
          type: "server",
          ...R1L,
          tooltip:
            "Four loader applications running on separate cron schedules: (1) 1s/1min loader polling two real-time price sources, (2) 10-minute web scraper, (3) World Bank monthly data loader, (4) IMF commodities loader. Each loader compares the incoming value to the current cached value — if unchanged it skips the write entirely, avoiding redundant DB round-trips. When data changes, it writes to MongoDB and pushes the new value to the API server's in-memory cache in a single atomic step.",
        },
        {
          id: "external",
          label: "Data Sources",
          sublabel: "Exchanges · IMF · World Bank",
          type: "external",
          ...R1R,
          tooltip:
            "Multiple external commodity data providers: two real-time price feeds polled every 1 second and 1 minute, a web source scraped every 10 minutes, and monthly datasets from the World Bank Pink Sheet and IMF. Each source feeds a dedicated loader app with its own polling schedule and data mapping logic.",
        },
        {
          id: "webapp",
          label: "Web / Tools App",
          sublabel: "Next.js",
          type: "client",
          ...R2L,
          tooltip:
            "Two Next.js frontend applications: (1) the main web app for API key management, subscription dashboard, and docs; (2) the Tools app with individual commodity pages showing live price charts and a commodity-to-commodity price converter. Both consume the API server and display data at the freshness level permitted by the user's subscription tier.",
        },
        {
          id: "api",
          label: "API Server",
          sublabel: "Node.js · Hashmap Cache",
          type: "server",
          ...R2C,
          tooltip:
            "Core Node.js REST API. Holds all 130+ commodity prices in an in-memory hashmap — the primary read path for every price request. Request-tier middleware validates the API key, resolves the subscription plan (free/lite/pro/premium), and determines which data freshness the caller is allowed to receive. MongoDB is only hit on startup (cache rebuild) or if the loader app is down. Stripe subscription state is also managed here.",
        },
        {
          id: "db",
          label: "MongoDB",
          sublabel: "Persistence · Fallback",
          type: "database",
          ...R2R,
          tooltip:
            "MongoDB stores all commodity price history, user accounts, hashed API keys, and subscription records. It is not on the hot read path — the API server reads from the in-memory hashmap for every live price request. MongoDB's role is persistence (so historical data survives restarts) and crash-recovery fallback (the API server reads from MongoDB to rebuild its cache if it restarts cold).",
        },
      ],
      edges: [
        { from: "external", to: "loaders", label: "Poll (1s · 1min · 10min · monthly)", bidirectional: false },
        { from: "loaders",  to: "api",     label: "Push Cache (on change)",             bidirectional: false },
        { from: "loaders",  to: "db",      label: "Write (on change)",                  bidirectional: false },
        { from: "webapp",   to: "api",     label: "HTTP / REST",                        bidirectional: true  },
        { from: "api",      to: "db",      label: "Fallback Read · Startup Rebuild",    bidirectional: false },
      ],
    },
  },

  // ─── Tweetstorm.ai ───────────────────────────────────────────────────────
  {
    slug: "tweetstorm-ai",
    name: "TweetStorm.ai",
    image: "/tweetstorm-light.png",
    imageDark: "/tweetstorm-dark.png",
    description:
      "AI-powered Twitter/X productivity platform. Built browser extensions, Stripe payment integration, bookmarks management, and migrated the entire ORM from Prisma to Knex.",
    stack: ["Node.js", "MySQL", "Prisma → Knex", "Stripe", "Browser Extensions", "Plasmo", "OpenAI"],
    url: "https://tweetstorm.ai",

    problem:
      "X/Twitter creators needed AI tooling and bookmark management directly inside the platform — injected into the composer workflow, not a separate tab. The native UI had no bulk action tooling and no bookmark organization. The backend also had performance issues from Prisma ORM overhead on hot database paths.",

    whatIBuilt: [
      "Bookmark Extension (built from scratch): saves, tags, and searches bookmarks injected into X's UI",
      "AI Generator Extension: generates tweet threads with tone and keyword control via GPT-4",
      "Bulk Action Extension: filter and manage tweets in bulk (refactored filters, auth, performance improvements)",
      "Bookmarks management section inside the main platform web app",
      "Stripe payment integration: checkout, webhooks, full subscription lifecycle (created / updated / cancelled)",
      "Migrated entire backend ORM from Prisma to Knex query builder",
    ],

    engineeringWork: [
      "Migrated all database queries from Prisma ORM to Knex — rewrote every query to the SQL builder for direct execution control and removed ORM abstraction overhead",
      "Built Stripe webhook handler: processes subscription lifecycle events atomically, updates user tier in MySQL with idempotency checks",
      "Built Bookmark Extension from scratch with Plasmo framework — DOM injection into X's React-rendered UI using MutationObserver to handle dynamically rendered elements",
      "Improved GPT-4 prompts in AI Generator Extension: enforced 280-char limit per tweet, improved thread coherence, reduced hallucinations in tone-specific output",
      "Fixed auth flow in Bulk Action Extension, rewired filter logic, improved DOM traversal performance, refactored for maintainability",
    ],

    impact: [
      "Faster query execution post-Prisma → Knex: direct SQL builder removes ORM abstraction layer from every hot database call",
      "Payment lifecycle fully driven by webhooks — no polling, subscription state stays consistent on plan changes, cancellations, and renewals",
      "Bookmark Extension ships as a standalone installable product independent of the main app",
    ],

    requestFlow: [
      "User triggers action inside X.com via extension UI injected by Plasmo into the live DOM",
      "Extension sends authenticated request to backend with session token",
      "Backend validates session token, queries MySQL (via Knex) to resolve subscription tier and usage quota",
      "AI generation path: backend builds GPT-4 system prompt with tone/keyword constraints → calls OpenAI → returns structured thread JSON",
      "Bookmark path: CRUD operations against MySQL via Knex query builder",
      "Stripe webhook fires on subscription event → backend handler validates signature → updates user tier atomically in MySQL",
    ],

    architecture: {
      summary:
        "Browser extensions injected into X.com via Plasmo communicate with a Node.js backend. Stripe webhooks drive subscription state. MySQL is the source of truth for user data, quotas, and tier. OpenAI handles AI generation via GPT-4.",
      nodes: [
        {
          id: "stripe",
          label: "Stripe",
          sublabel: "Payments · Webhooks",
          type: "external",
          ...R1L,
          tooltip:
            "Stripe manages subscription checkout, plan upgrades, downgrades, and cancellations. Webhooks fire on every subscription lifecycle event (created, updated, cancelled, payment_failed). The backend validates each webhook signature and updates the user's subscription tier in MySQL atomically — no polling, no eventual consistency lag.",
        },
        {
          id: "openai",
          label: "OpenAI GPT-4",
          sublabel: "AI Generation",
          type: "external",
          ...R1R,
          tooltip:
            "GPT-4 generates tweet threads via OpenAI's Chat Completions API. System prompts enforce Twitter's 280-character limit per tweet, thread coherence across 5–10 tweets, CTA placement, and the user-selected tone (witty, professional, viral). Prompt engineering work focused on reducing hallucinations and improving output consistency across tone modes.",
        },
        {
          id: "ext",
          label: "Browser Ext.",
          sublabel: "Plasmo · React",
          type: "client",
          ...R2L,
          tooltip:
            "Three browser extensions built with the Plasmo framework: (1) Bookmark Extension — injects a sidebar into X.com for saving and searching bookmarks, built from scratch; (2) AI Generator Extension — generates tweet threads directly inside the composer; (3) Bulk Action Extension — lets users filter and act on multiple tweets at once. All inject React components into X's live DOM using MutationObserver to handle dynamic rendering.",
        },
        {
          id: "api",
          label: "Backend",
          sublabel: "Node.js · Knex",
          type: "server",
          ...R2C,
          tooltip:
            "Node.js backend serving all extension and web app requests. All database queries use Knex query builder — migrated from Prisma ORM to remove abstraction overhead and gain direct SQL control. Handles session validation, subscription tier enforcement, AI prompt construction and OpenAI calls, bookmark CRUD, and Stripe webhook processing.",
        },
        {
          id: "db",
          label: "MySQL",
          sublabel: "Users · Quotas · Bookmarks",
          type: "database",
          ...R2R,
          tooltip:
            "MySQL stores user accounts, hashed session tokens, subscription tiers, monthly generation quotas, bookmark records, and tweet history. Subscription state is updated atomically by the Stripe webhook handler. Quota is decremented on every AI generation call to enforce per-plan limits.",
        },
      ],
      edges: [
        { from: "stripe",  to: "api",    label: "Webhook (subscription events)",  bidirectional: false },
        { from: "api",     to: "openai", label: "Completion Request",             bidirectional: true  },
        { from: "ext",     to: "api",    label: "HTTPS / REST",                   bidirectional: true  },
        { from: "api",     to: "db",     label: "Query · Write (Knex)",           bidirectional: true  },
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
      "AI content platform. Migrated the full site from WordPress to Astro, rebuilt newsletter delivery with Redis, integrated dual payment providers (Stripe + Creem.io), and built tooling in Go.",
    stack: ["Go", "Astro", "React", "MySQL", "Redis", "Stripe", "Creem.io", "Ghost CMS"],
    url: "https://netus.ai",

    problem:
      "Netus.ai ran on WordPress — slow page loads, expensive to host, and difficult to maintain. Newsletter sends blocked the main server thread. The platform needed two payment providers (Stripe and Creem.io) but the codebase only supported one. Blog content was locked in WordPress with no clean migration path to a proper CMS.",

    whatIBuilt: [
      "Full WordPress → Astro migration: rebuilt all pages as static output, preserved SEO structure and slugs",
      "WordPress blogs → Ghost CMS migration: mapped content structure, rebuilt templates",
      "Redis-backed newsletter service: bulk sends processed as async jobs via a Redis queue",
      "Dual payment integration: Stripe and Creem.io running in parallel from the same Go backend",
      "Headline Generator tool: Go endpoint + React UI, generates headline variations via LLM",
    ],

    engineeringWork: [
      "Rebuilt entire WordPress site in Astro — static generation, no PHP runtime on public-facing pages, full SEO preservation",
      "Migrated blog content from WordPress to Ghost: mapped post/tag/author structure, preserved slugs and redirects",
      "Built newsletter service: Go backend enqueues bulk send jobs into Redis; a separate worker process picks up jobs and sends in batches asynchronously without blocking the main server",
      "Implemented Stripe and Creem.io in the Go backend as parallel payment providers behind a shared interface — webhook handling for both",
      "Built Headline Generator: Go LLM integration with streaming response forwarded to React frontend",
    ],

    impact: [
      "Significant page load improvement post-WordPress → Astro: static HTML served from CDN vs. server-rendered PHP on every request",
      "Newsletter delivery non-blocking: Redis queue absorbs bulk sends without tying up the Go backend",
      "Users can pay via Stripe or Creem.io — no checkout friction from single-provider lock-in",
    ],

    requestFlow: [
      "Static pages served from Astro build output — CDN-delivered, no server hit for public content",
      "Authenticated requests (tools, payments, account) hit Go backend via REST",
      "Go backend validates JWT, checks MySQL for subscription tier and usage quota",
      "AI tools (Headline Generator): Go calls LLM API in streaming mode → forwards tokens to React frontend via SSE",
      "Newsletter send: Go backend receives bulk send request → enqueues job in Redis with recipient list and template",
      "Redis worker picks up job → processes sends in batches asynchronously, retries on failure",
      "Payment webhook (Stripe or Creem.io) → Go handler validates signature → updates MySQL subscription record",
    ],

    architecture: {
      summary:
        "Go backend with MySQL as the source of truth. Static public site served from an Astro build via CDN. Newsletter delivery decoupled from the main server via a Redis job queue. Stripe and Creem.io run as parallel payment providers behind a shared interface.",
      nodes: [
        {
          id: "redis",
          label: "Redis Queue",
          sublabel: "Newsletter Jobs",
          type: "database",
          ...R1L,
          tooltip:
            "Redis acts as the job queue for bulk newsletter delivery. When a send is triggered, the Go backend enqueues a job with the recipient list, template, and metadata — it does not send directly. A separate worker process reads from the queue and processes sends in batches, with retry logic on failure. This decouples email delivery from the request lifecycle and prevents bulk sends from blocking the main Go server.",
        },
        {
          id: "llm",
          label: "LLM API",
          sublabel: "AI Provider",
          type: "external",
          ...R1R,
          tooltip:
            "LLM API used for the Headline Generator tool. The Go backend calls the provider in streaming mode and forwards tokens directly to the React frontend via Server-Sent Events (SSE) as they arrive — giving users real-time output without waiting for the full response. The Go streaming proxy adds minimal latency over the raw provider response.",
        },
        {
          id: "client",
          label: "Astro / React",
          sublabel: "Static Site · Dashboard",
          type: "client",
          ...R2L,
          tooltip:
            "Two frontend surfaces: (1) Astro static site — fully pre-rendered, served from CDN, no server hit on page load. Rebuilt from WordPress with full SEO preservation. (2) React dashboard — authenticated UI for account management, tool access, and newsletter controls. Both connect to the Go backend only for authenticated actions.",
        },
        {
          id: "api",
          label: "Go Backend",
          sublabel: "Go · REST · SSE",
          type: "server",
          ...R2C,
          tooltip:
            "Go backend handling all authenticated requests. Validates JWTs, enforces per-tier quotas from MySQL, and routes to the correct handler: AI tool calls (streaming LLM proxy via SSE), newsletter job enqueue (Redis), or payment webhook processing (Stripe / Creem.io). Stripe and Creem.io are implemented behind a shared payment interface so webhook logic is provider-agnostic.",
        },
        {
          id: "db",
          label: "MySQL",
          sublabel: "Users · Subscriptions",
          type: "database",
          ...R2R,
          tooltip:
            "MySQL is the primary source of truth for user accounts, subscription plans, daily usage quotas, and payment records. Ghost CMS runs separately as a managed blog platform — content migrated from WordPress, templates rebuilt. MySQL subscription records are updated atomically by the Go webhook handler on every payment event from Stripe or Creem.io.",
        },
      ],
      edges: [
        { from: "api",    to: "redis",  label: "Enqueue Job",      bidirectional: false },
        { from: "api",    to: "llm",    label: "Stream (SSE)",     bidirectional: true  },
        { from: "client", to: "api",    label: "REST / SSE",       bidirectional: true  },
        { from: "api",    to: "db",     label: "Query · Write",    bidirectional: true  },
      ],
    },
  },

  // ─── API-Freaks ───────────────────────────────────────────────────────────
  {
    slug: "api-freaks",
    name: "API-Freaks",
    image: "/apifreaks-light.png",
    imageDark: "/apifreaks-dark.png",
    description:
      "Developer resource hub connecting multiple API products (API-Geo, IP lookup, and others). Contributed UI components, frontend–backend integration, and a maintainer role system.",
    stack: ["Next.js", "React", "TypeScript", "SWR", "Tailwind CSS"],
    url: "https://apifreaks.com",

    whatIBuilt: [
      "Built new UI components and pages integrated across the platform",
      "Integrated frontend with existing Java backend via REST — used SWR for data fetching, caching, and revalidation",
      "Implemented a maintainer role: access control UI, protected routes, and permission-aware data fetching",
      "Connected multiple API product pages (API-Geo, IP lookup, and related services) into a unified frontend",
    ],
  },
];

// Validate every project at module load time.
PROJECTS.forEach(validateProject);

export { PROJECTS };
