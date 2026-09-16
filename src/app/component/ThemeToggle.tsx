"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  // Ease the whole page through the theme change (globals.css .theme-switching)
  const toggle = () => {
    const root = document.documentElement;
    root.classList.add("theme-switching");
    setTheme(isDark ? "light" : "dark");
    window.setTimeout(() => root.classList.remove("theme-switching"), 300);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-muted transition-[color,background-color,transform] duration-200 hover:bg-surface-2 hover:text-text active:scale-95 cursor-pointer"
    >
      {/* Render both icons; swap via opacity so SSR markup is stable */}
      <span className="relative block h-4 w-4">
        <Sun
          className={`absolute inset-0 h-4 w-4 transition-opacity duration-200 ${
            mounted && isDark ? "opacity-100" : "opacity-0"
          }`}
        />
        <Moon
          className={`absolute inset-0 h-4 w-4 transition-opacity duration-200 ${
            mounted && isDark ? "opacity-0" : "opacity-100"
          }`}
        />
      </span>
    </button>
  );
}
