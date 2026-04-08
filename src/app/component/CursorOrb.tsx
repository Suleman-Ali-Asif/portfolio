"use client";

import { useEffect, useRef, useState } from "react";

export default function CursorOrb() {
  const orbRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const posRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleHoverChange = (e: MouseEvent) => {
      const el = e.target as Element;
      const isInteractive =
        el.closest("a") ||
        el.closest("button") ||
        el.closest('[role="button"]') ||
        el.tagName === "A" ||
        el.tagName === "BUTTON";
      setIsHovering(!!isInteractive);
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      posRef.current.x = lerp(posRef.current.x, mouseRef.current.x, 0.09);
      posRef.current.y = lerp(posRef.current.y, mouseRef.current.y, 0.09);

      const orb = orbRef.current;
      if (orb) {
        orb.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px) translate(-50%, -50%)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousemove", handleHoverChange);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousemove", handleHoverChange);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible]);

  return (
    <div
      ref={orbRef}
      className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-screen"
      style={{
        width: isHovering ? "320px" : "220px",
        height: isHovering ? "320px" : "220px",
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(216,208,188,0.22) 0%, rgba(216,208,188,0.06) 40%, transparent 70%)`,
        opacity: isVisible ? 1 : 0,
        transition: "width 0.4s cubic-bezier(0.34,1.56,0.64,1), height 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease",
        willChange: "transform",
      }}
    />
  );
}
