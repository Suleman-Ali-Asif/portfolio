"use client";

import { useEffect, useRef, useState } from "react";

const INTERACTIVE =
  'a, button, input, textarea, select, label, summary, [role="button"], [tabindex="0"], [class~="cursor-pointer"]';

export default function CursorOrb() {
  const ringRef  = useRef<HTMLDivElement>(null);
  const dotRef   = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -200, y: -200 });
  const posRef   = useRef({ x: -200, y: -200 });
  const rafRef   = useRef<number>(0);

  const [visible,  setVisible]  = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);

      // Dot is exact — bypass React re-render
      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${e.clientX}px,${e.clientY}px) translate(-50%,-50%)`;
      }

      const el = document.elementFromPoint(e.clientX, e.clientY);
      setHovering(!!el?.closest(INTERACTIVE));
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      posRef.current.x = lerp(posRef.current.x, mouseRef.current.x, 0.13);
      posRef.current.y = lerp(posRef.current.y, mouseRef.current.y, 0.13);
      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate(${posRef.current.x}px,${posRef.current.y}px) translate(-50%,-50%)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [visible]);

  return (
    <>
      {/* Ring — lags slightly behind the dot */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998]"
        style={{
          width:  hovering ? 24 : 34,
          height: hovering ? 24 : 34,
          borderRadius: "50%",
          border: `1px solid ${hovering ? "rgba(200,168,112,0.85)" : "rgba(200,168,112,0.35)"}`,
          opacity: visible ? 1 : 0,
          transition:
            "width 0.18s ease, height 0.18s ease, border-color 0.15s ease, opacity 0.3s ease",
          willChange: "transform",
        }}
      />

      {/* Dot — exact mouse position, no lag */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999]"
        style={{
          width:  hovering ? 5 : 3,
          height: hovering ? 5 : 3,
          borderRadius: "50%",
          backgroundColor: hovering ? "#f0ece4" : "#c8a870",
          opacity: visible ? 1 : 0,
          transition:
            "width 0.12s ease, height 0.12s ease, background-color 0.12s ease, opacity 0.3s ease",
          willChange: "transform",
        }}
      />
    </>
  );
}
