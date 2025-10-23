// components/ThemeToggler.tsx
"use client";

import { Lightbulb, LightbulbOff } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggler() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-6 w-6" />;
  }

  return (
    <button
      aria-label="theme toggler"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="dark:bg-dark-secondary bg-light-secondary p-2 rounded-lg transition-colors hover:opacity-80"
    >
      {theme === "light" ? (
        <LightbulbOff className="h-6 w-6" />
      ) : (
        <Lightbulb className="h-6 w-6" />
      )}
    </button>
  );
}
