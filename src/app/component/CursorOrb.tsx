"use client";

import { useEffect, useRef, useState } from "react";

export default function CursorOrb() {
  const orbRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const posRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

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
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible]);

  return (
    <div
      ref={orbRef}
      className="pointer-events-none fixed top-0 left-0 z-[9999]"
      style={{
        width: "180px",
        height: "180px",
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(200,168,112,0.06) 0%, transparent 70%)`,
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.3s ease",
        willChange: "transform",
      }}
    />
  );
}
