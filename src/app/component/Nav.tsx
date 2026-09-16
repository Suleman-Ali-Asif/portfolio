"use client";

import Link from "next/link";
import { NAV } from "../utils/constants";
import LocalTime from "./LocalTime";
import ThemeToggle from "./ThemeToggle";
import { TILE_RADIUS } from "./Tile";

interface NavProps {
  /** id of the section currently in view; omit on pages without sections */
  activeSection?: string;
}

/** Top bar as the first tile of the bento: name and clock left, links right. */
export default function Nav({ activeSection }: NavProps) {
  return (
    <header className="mx-auto max-w-[1440px] px-3 pt-3 sm:px-4 sm:pt-4">
      <div className={`flex h-16 items-center justify-between gap-4 bg-surface px-5 sm:px-7 ${TILE_RADIUS}`}>
        <div className="flex items-baseline gap-3">
          <Link href="/" className="whitespace-nowrap font-display text-[16px] font-semibold tracking-tight text-text">
            Suleman Ali
          </Link>
          <span className="hidden items-baseline gap-1.5 text-[12.5px] text-muted sm:inline-flex">
            <span>Lahore</span>
            <LocalTime />
          </span>
        </div>

        <nav aria-label="Primary" className="flex items-center gap-0.5 sm:gap-1">
          {NAV.map(({ label, id }) => {
            const isActive = activeSection === id;
            return (
              <a
                key={id}
                href={`/#${id}`}
                aria-current={isActive ? "location" : undefined}
                className={`px-1.5 py-2 text-[13.5px] transition-colors duration-200 sm:px-2.5 sm:text-[14px] ${
                  id === "about" ? "hidden sm:inline" : ""
                } ${isActive ? "text-text" : "text-muted hover:text-text"}`}
              >
                {label}
              </a>
            );
          })}
          <span className="ml-1">
            <ThemeToggle />
          </span>
        </nav>
      </div>
    </header>
  );
}
