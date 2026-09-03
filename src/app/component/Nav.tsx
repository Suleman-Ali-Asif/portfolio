"use client";

import Link from "next/link";
import { NAV } from "../utils/constants";
import LocalTime from "./LocalTime";
import ThemeToggle from "./ThemeToggle";

interface NavProps {
  /** id of the section currently in view; omit on pages without sections */
  activeSection?: string;
}

export default function Nav({ activeSection }: NavProps) {
  return (
    <header className="sticky top-0 z-30 bg-bg/90 supports-[backdrop-filter]:bg-bg/75 supports-[backdrop-filter]:backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1040px] items-center justify-between gap-4 px-5 sm:px-8">
        <div className="flex items-baseline gap-3">
          <Link href="/" className="whitespace-nowrap font-display text-[15px] font-semibold tracking-tight text-text">
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
                  isActive ? "text-text" : "text-muted hover:text-text"
                }`}
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
      <div className="mx-auto max-w-[1040px] px-5 sm:px-8">
        <div className="h-px bg-border" />
      </div>
    </header>
  );
}
