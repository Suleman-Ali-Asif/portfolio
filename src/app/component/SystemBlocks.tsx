"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * SystemBlocks — the headline, acted out. The parts of a product assemble
 * into one system when in view, then the connecting lines draw in and the
 * blocks rest with a slow idle pulse. Drawn as a schematic: hairline blocks
 * on a bus line, not a tile grid. Plays once; "Replay" runs it again.
 * Static under prefers-reduced-motion.
 */

interface Block {
  id: string;
  title: string;
  sub: string;
  tone?: "primary";
}

const ROWS: { label: string; blocks: Block[] }[] = [
  {
    label: "Data path",
    blocks: [
      { id: "loaders", title: "Data loaders",    sub: "cron · polling · change detection" },
      { id: "cache",   title: "In-memory cache", sub: "hashmap · sub-ms reads" },
      { id: "api",     title: "API server",      sub: "REST · auth · plan tiers", tone: "primary" },
      { id: "web",     title: "Web app",         sub: "Next.js · Astro · extensions" },
    ],
  },
  {
    label: "Around it",
    blocks: [
      { id: "db",       title: "Databases",     sub: "MongoDB · MySQL" },
      { id: "payments", title: "Payments",      sub: "Stripe · Creem.io · webhooks" },
      { id: "ops",      title: "Deploy and ops", sub: "7 services in production" },
    ],
  },
];

const ALL = ROWS.flatMap((r) => r.blocks);
const STAGGER = 0.1;
const SPRING = { type: "spring" as const, stiffness: 320, damping: 26, mass: 0.9 };

export default function SystemBlocks() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [run, setRun] = useState(0);
  const [settled, setSettled] = useState(false);
  const [pulse, setPulse] = useState<string | null>(null);

  const play = inView || run > 0;
  const totalMs = (ALL.length * STAGGER + 0.5) * 1000;

  useEffect(() => {
    if (!play) return;
    setSettled(false);
    const t = setTimeout(() => setSettled(true), reduce ? 0 : totalMs);
    return () => clearTimeout(t);
  }, [play, run, reduce, totalMs]);

  useEffect(() => {
    if (!settled || reduce) return;
    let i = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.3 });
    if (ref.current) io.observe(ref.current);
    const t = setInterval(() => {
      if (!visible || document.hidden) return;
      setPulse(ALL[i % ALL.length].id);
      i += 1;
    }, 2400);
    return () => { clearInterval(t); io.disconnect(); };
  }, [settled, reduce]);

  const blockInitial = reduce ? false : { opacity: 0, y: 18, scale: 0.96 };
  let index = 0;

  return (
    <div ref={ref} className="relative">
      <div
        role="img"
        aria-label="The parts of a product I own: data loaders, in-memory cache, API server, web app, databases, payments, deploy and ops"
        className="grid gap-5"
      >
        {ROWS.map((row) => (
          <div key={`${row.label}-${run}`} className="grid gap-2 sm:grid-cols-[88px_1fr] sm:items-center sm:gap-4">
            <p className="font-mono text-[11px] leading-tight text-faint">{row.label}</p>
            <div className="relative">
              {/* bus line, drawn after the blocks settle */}
              <motion.div
                aria-hidden="true"
                className="absolute left-2 right-2 top-1/2 hidden h-px origin-left bg-border-strong sm:block"
                initial={reduce ? false : { scaleX: 0 }}
                animate={settled ? { scaleX: 1 } : {}}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
              <div
                className={`relative grid gap-3 sm:gap-5 ${
                  row.blocks.length === 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2 sm:grid-cols-3"
                }`}
              >
                {row.blocks.map((b) => {
                  const i = index++;
                  const primary = b.tone === "primary";
                  const isPulse = pulse === b.id;
                  return (
                    <motion.div
                      key={`${b.id}-${run}`}
                      className={`relative rounded-md border bg-surface px-3 py-2.5 ${
                        primary ? "border-primary/60" : "border-border-strong"
                      }`}
                      initial={blockInitial}
                      animate={play ? { opacity: 1, y: 0, scale: 1 } : {}}
                      transition={{ ...SPRING, delay: reduce ? 0 : 0.1 + i * STAGGER }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className={`font-display text-[13.5px] font-semibold leading-snug tracking-tight ${primary ? "text-primary" : "text-text"}`}>
                          {b.title}
                        </p>
                        <span
                          aria-hidden="true"
                          className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full transition-all duration-500"
                          style={{
                            backgroundColor: primary ? "var(--primary)" : "var(--border-strong)",
                            opacity: settled ? (isPulse ? 1 : 0.6) : 0,
                            transform: isPulse ? "scale(1.6)" : "scale(1)",
                          }}
                        />
                      </div>
                      <p className="mt-1 font-mono text-[10.5px] leading-relaxed text-muted">{b.sub}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 sm:pl-[104px]">
        <p className="text-[13px] text-muted">The parts I own on a typical product.</p>
        {!reduce && (
          <button
            type="button"
            onClick={() => setRun((r) => r + 1)}
            className="link-muted cursor-pointer text-[13px]"
          >
            Replay
          </button>
        )}
      </div>
    </div>
  );
}
