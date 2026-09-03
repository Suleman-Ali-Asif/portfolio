"use client";

import { useState } from "react";
import type { Architecture, NodeType } from "@/app/types";

// ─── Constants ────────────────────────────────────────────────────────────────

const NW = 120;
const NH = 48;

const TYPE_COLOR: Record<NodeType, { stroke: string; fill: string; dot: string; label: string }> = {
  client:   { stroke: "#7db3d4", fill: "rgba(125,179,212,0.08)", dot: "#7db3d4", label: "client" },
  server:   { stroke: "#c8a870", fill: "rgba(200,168,112,0.08)", dot: "#c8a870", label: "api server" },
  database: { stroke: "#7ac9a0", fill: "rgba(122,201,160,0.07)", dot: "#7ac9a0", label: "database" },
  external: { stroke: "#c9a357", fill: "rgba(201,163,87,0.07)",  dot: "#c9a357", label: "external api" },
};

const DUR_FWD = ["2.4s", "3.1s", "1.9s", "2.7s", "2.2s"];
const DUR_REV = ["2.8s", "2.0s", "3.4s", "1.8s", "2.6s"];

// ─── Geometry helpers ─────────────────────────────────────────────────────────

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

function edgePts(ax: number, ay: number, bx: number, by: number) {
  const [x1, y1] = clip(ax, ay, bx, by);
  const [x2, y2] = clip(bx, by, ax, ay);
  return { x1, y1, x2, y2 };
}

// ─── SVG node icons ───────────────────────────────────────────────────────────

function NodeIcon({ type, cx, cy }: { type: NodeType; cx: number; cy: number }) {
  const s = TYPE_COLOR[type].stroke;
  const ox = cx - 10, oy = cy - 10;

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

// ─── Component ────────────────────────────────────────────────────────────────

export default function SystemDesignVisualizer({ architecture }: { architecture: Architecture }) {
  const [hNode, setHNode] = useState<string | null>(null);
  const [hEdge, setHEdge] = useState<string | null>(null);

  const nodeMap = Object.fromEntries(architecture.nodes.map((n) => [n.id, n]));
  const hNodeDef = hNode ? architecture.nodes.find((n) => n.id === hNode) ?? null : null;

  const infoText: string | null =
    hNode
      ? (architecture.nodes.find((n) => n.id === hNode)?.tooltip ?? null)
      : hEdge
      ? (() => {
          const e = architecture.edges.find((e) => `${e.from}>${e.to}` === hEdge);
          if (!e) return null;
          const dir = e.bidirectional ? "↔" : "→";
          return `${nodeMap[e.from].label} ${dir} ${nodeMap[e.to].label} — ${e.label}`;
        })()
      : null;

  return (
    <div>
      <p className="text-body text-[14.5px] leading-relaxed mb-5 max-w-xl">
        {architecture.summary}
      </p>

      <div className="border border-border bg-surface rounded-2xl overflow-hidden">
        <svg viewBox="0 0 620 240" className="w-full" style={{ display: "block" }}>
          <defs>
            <pattern id="sdv-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="0.7" style={{ fill: "var(--border)" }} />
            </pattern>
            <marker id="sdv-arr-fwd" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L7,3 z" style={{ fill: "var(--border-strong)" }} />
            </marker>
            <marker id="sdv-arr-bwd" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto-start-reverse">
              <path d="M7,3 L0,0 L0,6 z" style={{ fill: "var(--border-strong)" }} />
            </marker>
          </defs>

          <rect width="620" height="240" fill="url(#sdv-dots)" />

          {/* Edges */}
          {architecture.edges.map((edge, i) => {
            const from = nodeMap[edge.from];
            const to   = nodeMap[edge.to];
            const { x1, y1, x2, y2 } = edgePts(from.x, from.y, to.x, to.y);
            const eid    = `${edge.from}>${edge.to}`;
            const isVert = Math.abs(x2 - x1) < 5;
            const mx     = (x1 + x2) / 2;
            const my     = (y1 + y2) / 2;
            const lit    = hEdge === eid || hNode === edge.from || hNode === edge.to;

            return (
              <g key={eid}>
                <line
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="transparent" strokeWidth="18"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHEdge(eid)}
                  onMouseLeave={() => setHEdge(null)}
                />
                <line
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  style={{ stroke: lit ? "var(--text-faint)" : "var(--border-strong)" }}
                  strokeWidth={lit ? 1.5 : 1}
                  strokeDasharray={lit ? undefined : "5 4"}
                  markerEnd="url(#sdv-arr-fwd)"
                  markerStart={edge.bidirectional ? "url(#sdv-arr-bwd)" : undefined}
                />
                <circle r="2.5" fill={TYPE_COLOR[from.type].dot} opacity="0.9">
                  <animateMotion dur={DUR_FWD[i % 5]} repeatCount="indefinite" path={`M${x1},${y1} L${x2},${y2}`} />
                </circle>
                {edge.bidirectional && (
                  <circle r="2.5" fill={TYPE_COLOR[to.type].dot} opacity="0.9">
                    <animateMotion dur={DUR_REV[i % 5]} begin="1.2s" repeatCount="indefinite" path={`M${x2},${y2} L${x1},${y1}`} />
                  </circle>
                )}
                <text
                  x={isVert ? mx + 8 : mx}
                  y={isVert ? my      : my - 7}
                  textAnchor={isVert ? "start" : "middle"}
                  fontSize="8"
                  style={{ fill: lit ? "var(--text-muted)" : "var(--text-faint)", userSelect: "none" }}
                  fontFamily="var(--font-jetbrains), monospace"
                >
                  {edge.label}
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {architecture.nodes.map((node) => {
            const c     = TYPE_COLOR[node.type];
            const isHov = hNode === node.id;
            return (
              <g
                key={node.id}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHNode(node.id)}
                onMouseLeave={() => setHNode(null)}
              >
                {isHov && (
                  <rect
                    x={node.x - NW / 2 - 4} y={node.y - NH / 2 - 4}
                    width={NW + 8} height={NH + 8}
                    rx="4" fill={c.fill} opacity="0.5"
                  />
                )}
                <rect
                  x={node.x - NW / 2} y={node.y - NH / 2}
                  width={NW} height={NH} rx="2"
                  style={{ fill: isHov ? c.fill : "var(--surface-2)", stroke: isHov ? c.stroke : "var(--border-strong)" }}
                  strokeWidth={isHov ? 1.5 : 1}
                />
                <NodeIcon type={node.type} cx={node.x} cy={node.y - 7} />
                <text
                  x={node.x} y={node.y + 12}
                  textAnchor="middle" fontSize="9" fontWeight="600"
                  style={{ fill: isHov ? c.stroke : "var(--text-body)", userSelect: "none" }}
                  fontFamily="var(--font-instrument), sans-serif"
                >
                  {node.label}
                </text>
                <text
                  x={node.x} y={node.y + 22}
                  textAnchor="middle" fontSize="7"
                  style={{ fill: isHov ? "var(--text-muted)" : "var(--text-faint)", userSelect: "none" }}
                  fontFamily="var(--font-jetbrains), monospace"
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
        {(Object.entries(TYPE_COLOR) as [NodeType, (typeof TYPE_COLOR)[NodeType]][]).map(([type, c]) => (
          <span key={type} className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-sm" style={{ backgroundColor: c.stroke }} />
            <span className="font-mono text-[10px] text-muted">{c.label}</span>
          </span>
        ))}
        <span className="flex items-center gap-2 ml-auto">
          <span className="w-5 h-2 rounded-full inline-block bg-primary" />
          <span className="font-mono text-[10px] text-muted">animated data flow</span>
        </span>
      </div>

      {/* Info panel */}
      <div className="border border-border bg-surface rounded-2xl p-4 mt-3" style={{ minHeight: 72 }}>
        {infoText ? (
          <>
            {hNodeDef && (
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: TYPE_COLOR[hNodeDef.type].stroke }} />
                <span
                  className="font-mono text-[9px] tracking-widest uppercase"
                  style={{ color: TYPE_COLOR[hNodeDef.type].stroke }}
                >
                  {hNodeDef.label}
                  <span className="ml-2 opacity-50">·</span>
                  <span className="ml-2 normal-case tracking-normal opacity-60">{hNodeDef.sublabel}</span>
                </span>
              </div>
            )}
            <p className="text-body text-xs leading-relaxed">{infoText}</p>
          </>
        ) : (
          <p className="font-mono text-muted text-xs">
            ↑ hover any component or connection to see how it fits in the system
          </p>
        )}
      </div>
    </div>
  );
}
