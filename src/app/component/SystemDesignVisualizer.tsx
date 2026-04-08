"use client";

import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type NodeType = "client" | "server" | "database" | "external";

interface NodeDef {
  id: string;
  label: string;
  sublabel: string;
  type: NodeType;
  x: number;
  y: number;
  tooltip: string;
}

interface EdgeDef {
  from: string;
  to: string;
  label: string;
  bidirectional: boolean;
}

interface Architecture {
  summary: string;
  nodes: NodeDef[];
  edges: EdgeDef[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const NW = 120; // node width
const NH = 48;  // node height

const TYPE_COLOR: Record<NodeType, { stroke: string; fill: string; dot: string; label: string }> = {
  client:   { stroke: "#c084fc", fill: "rgba(192,132,252,0.08)", dot: "#c084fc", label: "client" },
  server:   { stroke: "#d8d0bc", fill: "rgba(216,208,188,0.07)", dot: "#d8d0bc", label: "api server" },
  database: { stroke: "#4ade80", fill: "rgba(74,222,128,0.07)",  dot: "#4ade80", label: "database" },
  external: { stroke: "#fbbf24", fill: "rgba(251,191,36,0.07)",  dot: "#fbbf24", label: "external api" },
};

// Fixed durations – avoids SSR/client hydration mismatch from Math.random()
const DUR_FWD = ["2.4s", "3.1s", "1.9s", "2.7s", "2.2s"];
const DUR_REV = ["2.8s", "2.0s", "3.4s", "1.8s", "2.6s"];

// ─── Geometry helpers ─────────────────────────────────────────────────────────

/** Clip from (cx,cy) toward (tx,ty) to the edge of a NW×NH rectangle. */
function clip(cx: number, cy: number, tx: number, ty: number): [number, number] {
  const dx = tx - cx, dy = ty - cy;
  const hw = NW / 2, hh = NH / 2;
  if (Math.abs(dx) < 0.001) return [cx, cy + Math.sign(dy) * hh];
  const slope = dy / dx;
  const xb = Math.sign(dx) * hw;
  const yAtX = slope * xb;
  if (Math.abs(yAtX) <= hh) return [cx + xb, cy + yAtX];
  const yb = Math.sign(dy) * hh;
  return [cx + yb / slope, cy + yb];
}

function edgePts(a: NodeDef, b: NodeDef) {
  const [x1, y1] = clip(a.x, a.y, b.x, b.y);
  const [x2, y2] = clip(b.x, b.y, a.x, a.y);
  return { x1, y1, x2, y2 };
}

// ─── SVG node icons ───────────────────────────────────────────────────────────

function NodeIcon({ type, cx, cy }: { type: NodeType; cx: number; cy: number }) {
  const s = TYPE_COLOR[type].stroke;
  const ox = cx - 10, oy = cy - 10; // icon is 20×20, offset to center

  if (type === "client") return (
    <g stroke={s} strokeWidth="1.5" fill="none" transform={`translate(${ox},${oy})`}>
      <rect x="1" y="1" width="18" height="13" rx="1.5" />
      <line x1="10" y1="14" x2="10" y2="18" />
      <line x1="6"  y1="18" x2="14" y2="18" />
    </g>
  );

  if (type === "server") return (
    <g stroke={s} strokeWidth="1.5" fill="none" transform={`translate(${ox},${oy})`}>
      <rect x="1" y="1"  width="18" height="7" rx="1" />
      <rect x="1" y="11" width="18" height="7" rx="1" />
      <circle cx="16.5" cy="4.5"  r="1.2" fill={s} stroke="none" />
      <circle cx="16.5" cy="14.5" r="1.2" fill={s} stroke="none" />
    </g>
  );

  if (type === "database") return (
    <g stroke={s} strokeWidth="1.5" fill="none" transform={`translate(${ox},${oy})`}>
      <ellipse cx="10" cy="4"  rx="9" ry="3" />
      <ellipse cx="10" cy="16" rx="9" ry="3" />
      <line x1="1"  y1="4" x2="1"  y2="16" />
      <line x1="19" y1="4" x2="19" y2="16" />
    </g>
  );

  // external → globe
  return (
    <g stroke={s} strokeWidth="1.5" fill="none" transform={`translate(${ox},${oy})`}>
      <circle cx="10" cy="10" r="9" />
      <ellipse cx="10" cy="10" rx="5" ry="9" />
      <line x1="1"   y1="10" x2="19"  y2="10" />
      <line x1="2.5" y1="5"  x2="17.5" y2="5"  />
      <line x1="2.5" y1="15" x2="17.5" y2="15" />
    </g>
  );
}

// ─── Architecture data ────────────────────────────────────────────────────────

// Standard node positions (SVG viewBox 0 0 620 240)
const P = {
  client:   { x: 90,  y: 155 },
  api:      { x: 310, y: 155 },
  db:       { x: 520, y: 155 },
  external: { x: 310, y: 55  },
};

const ARCH: Record<string, Architecture> = {
  "Commodity Price API": {
    summary:
      "REST API that ingests commodity market data on a schedule and serves real-time & historical prices for 130+ commodities.",
    nodes: [
      {
        id: "client", label: "Web Dashboard", sublabel: "Next.js", type: "client", ...P.client,
        tooltip:
          "Next.js consumer dashboard: browse 130+ live commodity prices, view historical price charts, manage API keys, and monitor monthly usage quotas. Server-side rendered for fast initial load.",
      },
      {
        id: "api", label: "API Server", sublabel: "Node.js · Express", type: "server", ...P.api,
        tooltip:
          "Express REST API with JWT auth, per-key rate limiting, and request validation. Core endpoints: GET /v1/prices, /v1/historical, /v1/commodities. Uses connection pooling to handle burst traffic efficiently.",
      },
      {
        id: "db", label: "Database", sublabel: "MongoDB", type: "database", ...P.db,
        tooltip:
          "MongoDB stores time-series price data with compound indexes on (commodity, timestamp) for sub-10ms range queries. Also holds user accounts, hashed API keys, and request telemetry.",
      },
      {
        id: "external", label: "Market Feeds", sublabel: "External APIs", type: "external", ...P.external,
        tooltip:
          "Third-party commodity data providers — financial exchanges and data vendors. A Node.js cron job fetches, validates, deduplicates, and upserts fresh prices into MongoDB every minute.",
      },
    ],
    edges: [
      { from: "client",   to: "api", label: "HTTP / REST",      bidirectional: true  },
      { from: "api",      to: "db",  label: "Query · Write",    bidirectional: true  },
      { from: "external", to: "api", label: "Scheduled Ingest", bidirectional: false },
    ],
  },

  "TweetStorm.ai": {
    summary:
      "AI-powered browser extension that generates viral tweet threads with customizable tone and keyword injection directly inside X.com.",
    nodes: [
      {
        id: "client", label: "Browser Ext.", sublabel: "Plasmo · React", type: "client", ...P.client,
        tooltip:
          "Plasmo browser extension injecting a React sidebar into X.com. Users pick tone (witty, professional, viral), add target keywords, then trigger generation — all without leaving the tweet composer.",
      },
      {
        id: "api", label: "API Server", sublabel: "Next.js API Routes", type: "server", ...P.api,
        tooltip:
          "Next.js API routes orchestrate the pipeline: validate the session token, check monthly quota in MySQL, build a GPT-4 system prompt enforcing tone + character limits, call OpenAI, and return structured thread JSON.",
      },
      {
        id: "db", label: "Database", sublabel: "MySQL", type: "database", ...P.db,
        tooltip:
          "MySQL stores user accounts, subscription tiers, monthly generation quotas, and full tweet history. Quota is enforced with an atomic decrement on every API call to prevent over-use.",
      },
      {
        id: "external", label: "OpenAI API", sublabel: "GPT-4", type: "external", ...P.external,
        tooltip:
          "GPT-4 generates tweet threads via the OpenAI Chat Completions API. System prompts enforce Twitter's 280-char limit per tweet, thread coherence across 5–10 tweets, CTA placement, and requested tone.",
      },
    ],
    edges: [
      { from: "client", to: "api",      label: "HTTPS / REST",       bidirectional: true },
      { from: "api",    to: "db",       label: "Query · Write",      bidirectional: true },
      { from: "api",    to: "external", label: "Completion Request", bidirectional: true },
    ],
  },

  "Netus.ai": {
    summary:
      "High-throughput AI content platform for rewriting and summarizing text with real-time word-by-word streaming output.",
    nodes: [
      {
        id: "client", label: "Web App", sublabel: "React · Vite", type: "client", ...P.client,
        tooltip:
          "React SPA built with Vite. Users paste up to 5,000 words, choose a mode (rephrase, summarize, expand, simplify), and see streaming output appear word-by-word via Server-Sent Events for instant feedback.",
      },
      {
        id: "api", label: "API Server", sublabel: "Go (Golang)", type: "server", ...P.api,
        tooltip:
          "Go backend chosen for its concurrency model. Goroutines handle many simultaneous streaming sessions cheaply. Pipes LLM tokens to clients via SSE, manages JWT auth, per-tier rate limiting, and daily usage tracking.",
      },
      {
        id: "db", label: "Database", sublabel: "SQL", type: "database", ...P.db,
        tooltip:
          "Relational database storing user accounts, subscription plans, daily word-count quotas, and rewrite history. ACID guarantees ensure atomic quota decrements and prevent double-spends under concurrent requests.",
      },
      {
        id: "external", label: "LLM API", sublabel: "AI Provider", type: "external", ...P.external,
        tooltip:
          "Large language model API called by the Go server in streaming mode. The Go server forwards tokens via SSE the instant they arrive from the provider, giving users real-time output with minimal added latency.",
      },
    ],
    edges: [
      { from: "client", to: "api",      label: "SSE · REST",      bidirectional: true },
      { from: "api",    to: "db",       label: "Query · Write",   bidirectional: true },
      { from: "api",    to: "external", label: "Stream Request",  bidirectional: true },
    ],
  },

  "API-Freaks": {
    summary:
      "Developer resource hub curating 1,000+ public APIs with full-text discovery search and a live in-browser API tester.",
    nodes: [
      {
        id: "client", label: "Web Portal", sublabel: "Next.js", type: "client", ...P.client,
        tooltip:
          "SSR Next.js frontend delivering SEO-optimised API listing pages, a full-text search-powered discovery UI, curated tutorials, and an interactive API tester that sends live requests from the browser.",
      },
      {
        id: "api", label: "API Server", sublabel: "Node.js · Express", type: "server", ...P.api,
        tooltip:
          "Express backend serving the API catalog and article content. Also acts as a CORS proxy: the live tester sends requests here, the server forwards them to the real external API and streams back the sanitised response.",
      },
      {
        id: "db", label: "Database", sublabel: "MongoDB", type: "database", ...P.db,
        tooltip:
          "MongoDB stores the curated API catalog (name, category, auth method, base URL, docs link), user-submitted suggestions, saved developer collections, and article content. Atlas Search powers the full-text discovery UI.",
      },
      {
        id: "external", label: "Public APIs", sublabel: "1,000+ APIs", type: "external", ...P.external,
        tooltip:
          "The 1,000+ public APIs catalogued on the platform. The Express proxy forwards live test requests to them, strips CORS-blocking headers, and returns the response to the browser — letting developers test any API without setup.",
      },
    ],
    edges: [
      { from: "client", to: "api",      label: "HTTP / REST",   bidirectional: true },
      { from: "api",    to: "db",       label: "Query · Write", bidirectional: true },
      { from: "api",    to: "external", label: "Proxy Request", bidirectional: true },
    ],
  },
};

const PROJECT_NAMES = Object.keys(ARCH);

// ─── Component ────────────────────────────────────────────────────────────────

export default function SystemDesignVisualizer() {
  const [proj, setProj]   = useState(PROJECT_NAMES[0]);
  const [hNode, setHNode] = useState<string | null>(null);
  const [hEdge, setHEdge] = useState<string | null>(null);

  const arch    = ARCH[proj];
  const nodeMap = Object.fromEntries(arch.nodes.map(n => [n.id, n]));

  const hNodeDef = hNode ? arch.nodes.find(n => n.id === hNode) ?? null : null;

  const infoText: string | null =
    hNode ? (arch.nodes.find(n => n.id === hNode)?.tooltip ?? null)
    : hEdge ? (() => {
        const e = arch.edges.find(e => `${e.from}>${e.to}` === hEdge);
        if (!e) return null;
        const dir = e.bidirectional ? "↔" : "→";
        return `${nodeMap[e.from].label} ${dir} ${nodeMap[e.to].label} — ${e.label}`;
      })()
    : null;

  return (
    <div className="mt-16">
      {/* Section label */}
      <p
        className="text-[color:var(--color-text-label)] text-[10px] tracking-[0.25em] uppercase mb-6"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        System Architecture
      </p>

      {/* Project tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {PROJECT_NAMES.map(name => (
          <button
            key={name}
            onClick={() => { setProj(name); setHNode(null); setHEdge(null); }}
            className={`text-[11px] px-3 py-1.5 border transition-all duration-150 ${
              proj === name
                ? "border-[color:var(--color-accent)] text-[color:var(--color-accent)] bg-[rgba(216,208,188,0.05)]"
                : "border-[color:var(--color-border)] text-[color:var(--color-text-muted)] hover:border-[color:var(--color-text-label)] hover:text-[color:var(--color-text-body)]"
            }`}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Summary */}
      <p className="text-[color:var(--color-text-body)] text-sm leading-relaxed mb-5 max-w-xl">
        {arch.summary}
      </p>

      {/* SVG diagram */}
      <div className="border border-[color:var(--color-border)] bg-[#0c0c0c] overflow-hidden">
        <svg viewBox="0 0 620 240" className="w-full" style={{ display: "block" }}>
          <defs>
            {/* Subtle dot-grid background */}
            <pattern id="sdv-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="0.5" fill="rgba(255,255,255,0.025)" />
            </pattern>
            {/* Arrow markers */}
            <marker id="sdv-arr-fwd" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L7,3 z" fill="#2a2a2a" />
            </marker>
            <marker id="sdv-arr-bwd" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto-start-reverse">
              <path d="M7,3 L0,0 L0,6 z" fill="#2a2a2a" />
            </marker>
          </defs>

          {/* Background */}
          <rect width="620" height="240" fill="url(#sdv-dots)" />

          {/* ── Edges ── */}
          {arch.edges.map((edge, i) => {
            const from = nodeMap[edge.from], to = nodeMap[edge.to];
            const { x1, y1, x2, y2 } = edgePts(from, to);
            const eid     = `${edge.from}>${edge.to}`;
            const isVert  = Math.abs(x2 - x1) < 5;
            const mx      = (x1 + x2) / 2, my = (y1 + y2) / 2;
            const lit     = hEdge === eid || hNode === edge.from || hNode === edge.to;

            return (
              <g key={eid}>
                {/* Wide invisible hit area */}
                <line
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="transparent" strokeWidth="18"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHEdge(eid)}
                  onMouseLeave={() => setHEdge(null)}
                />
                {/* Visible line */}
                <line
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={lit ? "#3a3a3a" : "#1c1c1c"}
                  strokeWidth={lit ? 1.5 : 1}
                  strokeDasharray={lit ? undefined : "5 4"}
                  markerEnd="url(#sdv-arr-fwd)"
                  markerStart={edge.bidirectional ? "url(#sdv-arr-bwd)" : undefined}
                />
                {/* Animated data dot — forward */}
                <circle r="2.5" fill={TYPE_COLOR[from.type].dot} opacity="0.9">
                  <animateMotion
                    dur={DUR_FWD[i % 5]}
                    repeatCount="indefinite"
                    path={`M${x1},${y1} L${x2},${y2}`}
                  />
                </circle>
                {/* Animated data dot — reverse (bidirectional only) */}
                {edge.bidirectional && (
                  <circle r="2.5" fill={TYPE_COLOR[to.type].dot} opacity="0.9">
                    <animateMotion
                      dur={DUR_REV[i % 5]}
                      begin="1.2s"
                      repeatCount="indefinite"
                      path={`M${x2},${y2} L${x1},${y1}`}
                    />
                  </circle>
                )}
                {/* Edge label */}
                <text
                  x={isVert ? mx + 8 : mx}
                  y={isVert ? my      : my - 7}
                  textAnchor={isVert ? "start" : "middle"}
                  fontSize="8"
                  fill={lit ? "#4a4a4a" : "#242424"}
                  fontFamily="JetBrains Mono, monospace"
                  style={{ userSelect: "none" }}
                >
                  {edge.label}
                </text>
              </g>
            );
          })}

          {/* ── Nodes ── */}
          {arch.nodes.map(node => {
            const c     = TYPE_COLOR[node.type];
            const isHov = hNode === node.id;
            return (
              <g
                key={node.id}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHNode(node.id)}
                onMouseLeave={() => setHNode(null)}
              >
                {/* Outer glow on hover */}
                {isHov && (
                  <rect
                    x={node.x - NW / 2 - 4} y={node.y - NH / 2 - 4}
                    width={NW + 8} height={NH + 8}
                    rx="4" fill={c.fill} opacity="0.5"
                  />
                )}
                {/* Node box */}
                <rect
                  x={node.x - NW / 2} y={node.y - NH / 2}
                  width={NW} height={NH} rx="2"
                  fill={isHov ? c.fill : "#0e0e0e"}
                  stroke={isHov ? c.stroke : "#222"}
                  strokeWidth={isHov ? 1.5 : 1}
                />
                {/* Icon — 20×20 centered horizontally, in top ~60% of node */}
                <NodeIcon type={node.type} cx={node.x} cy={node.y - 7} />
                {/* Primary label */}
                <text
                  x={node.x} y={node.y + 12}
                  textAnchor="middle" fontSize="9" fontWeight="600"
                  fill={isHov ? c.stroke : "#7a7570"}
                  fontFamily="Poppins, sans-serif"
                  style={{ userSelect: "none" }}
                >
                  {node.label}
                </text>
                {/* Sublabel / tech stack */}
                <text
                  x={node.x} y={node.y + 22}
                  textAnchor="middle" fontSize="7"
                  fill={isHov ? "#4a4641" : "#2a2825"}
                  fontFamily="JetBrains Mono, monospace"
                  style={{ userSelect: "none" }}
                >
                  {node.sublabel}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3">
        {(Object.entries(TYPE_COLOR) as [NodeType, typeof TYPE_COLOR[NodeType]][]).map(([type, c]) => (
          <span key={type} className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-sm" style={{ backgroundColor: c.stroke }} />
            <span
              className="text-[10px] text-[color:var(--color-text-muted)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {c.label}
            </span>
          </span>
        ))}
        <span className="flex items-center gap-2 ml-auto">
          <span className="w-5 h-2 rounded-full inline-block" style={{ backgroundColor: "#d8d0bc" }} />
          <span
            className="text-[10px] text-[color:var(--color-text-muted)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            animated data flow
          </span>
        </span>
      </div>

      {/* Info panel */}
      <div
        className="border border-[color:var(--color-border)] bg-[#0c0c0c] p-4 mt-2"
        style={{ minHeight: 72 }}
      >
        {infoText ? (
          <>
            {hNodeDef && (
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-1.5 h-1.5 rounded-full inline-block"
                  style={{ backgroundColor: TYPE_COLOR[hNodeDef.type].stroke }}
                />
                <span
                  className="text-[9px] tracking-widest uppercase"
                  style={{ color: TYPE_COLOR[hNodeDef.type].stroke, fontFamily: "var(--font-mono)" }}
                >
                  {hNodeDef.label}
                  <span className="ml-2 opacity-50">·</span>
                  <span className="ml-2 normal-case tracking-normal opacity-60">{hNodeDef.sublabel}</span>
                </span>
              </div>
            )}
            <p className="text-[color:var(--color-text-body)] text-xs leading-relaxed">
              {infoText}
            </p>
          </>
        ) : (
          <p
            className="text-[color:var(--color-text-muted)] text-xs"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            ↑ hover any component or connection to see how it fits in the system
          </p>
        )}
      </div>
    </div>
  );
}
