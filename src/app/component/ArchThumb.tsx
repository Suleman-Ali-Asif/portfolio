import type { Architecture, NodeType } from "@/app/types";

/**
 * ArchThumb — a static miniature of a project's architecture graph. Uses the
 * same node positions as SystemDesignVisualizer but crops tightly to the
 * nodes and labels them, so each card's map is readable rather than decorative.
 */

const NW = 120;
const NH = 48;
const PAD = 14;

const TYPE_STROKE: Record<NodeType, string> = {
  client:   "#7db3d4",
  server:   "#c8a870",
  database: "#7ac9a0",
  external: "#c9a357",
};

export default function ArchThumb({
  architecture,
  className = "",
}: {
  architecture: Architecture;
  className?: string;
}) {
  const nodeMap = Object.fromEntries(architecture.nodes.map((n) => [n.id, n]));

  const xs = architecture.nodes.map((n) => n.x);
  const ys = architecture.nodes.map((n) => n.y);
  const minX = Math.min(...xs) - NW / 2 - PAD;
  const maxX = Math.max(...xs) + NW / 2 + PAD;
  const minY = Math.min(...ys) - NH / 2 - PAD;
  const maxY = Math.max(...ys) + NH / 2 + PAD;

  return (
    <svg
      viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
      role="img"
      aria-label={`Architecture map: ${architecture.nodes.map((n) => n.label).join(", ")}`}
      className={className}
      style={{ display: "block" }}
    >
      {architecture.edges.map((e) => {
        const a = nodeMap[e.from];
        const b = nodeMap[e.to];
        return (
          <line
            key={`${e.from}>${e.to}`}
            x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            strokeWidth="2"
            strokeLinecap="round"
            style={{ stroke: "var(--border-strong)" }}
          />
        );
      })}
      {architecture.nodes.map((n) => (
        <g key={n.id}>
          <rect
            x={n.x - NW / 2} y={n.y - NH / 2}
            width={NW} height={NH} rx="8"
            strokeWidth="2"
            style={{ fill: "var(--surface)", stroke: TYPE_STROKE[n.type] }}
          />
          <text
            x={n.x} y={n.y + 5}
            textAnchor="middle"
            fontSize="14"
            fontWeight="600"
            fontFamily="var(--font-instrument), sans-serif"
            style={{ fill: "var(--text)", userSelect: "none" }}
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
