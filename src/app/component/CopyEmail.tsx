"use client";

import { useEffect, useState } from "react";

/**
 * CopyEmail — the address as a mailto link, with a small "Copy" action that
 * flips to "Copied" for two seconds.
 */
export default function CopyEmail({
  email,
  className = "",
  size = "md",
}: {
  email: string;
  className?: string;
  size?: "md" | "lg";
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      /* clipboard unavailable — the mailto link still works */
    }
  };

  const linkClass =
    size === "lg"
      ? "link break-all font-display text-[clamp(1.4rem,3.4vw,2.4rem)] font-semibold tracking-tight"
      : "link text-[15px]";

  return (
    <span className={`inline-flex flex-wrap items-baseline gap-x-3 gap-y-1 ${className}`}>
      <a href={`mailto:${email}`} className={linkClass}>
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        className="cursor-pointer font-mono text-[12px] text-muted transition-colors duration-200 hover:text-text"
        aria-live="polite"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </span>
  );
}
