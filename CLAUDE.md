# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test framework is configured.

## Architecture

**Next.js 15 App Router** portfolio site using React 19 and Tailwind CSS v4.

### Routing
- `/` → `src/app/page.tsx` — main landing page (two-column: sticky left sidebar + scrollable right content)
- `/contact` → `src/app/contact/page.tsx` — contact form page

### Key directories
- `src/app/component/` — page-level components (`Hero.tsx`, `Projects.tsx`)
- `src/app/utils/constants.ts` — all project/portfolio data lives here; exports `getConstants(theme)` which returns project info including images and tech tags
- `src/components/` — shared components (`Nav.tsx`, `ThemeToggler.tsx`, `OneLiner.tsx`)

### Theme / Dark Mode
Two approaches coexist: `next-themes` (via `ThemeProvider` in `layout.tsx`) and manual `localStorage` + state in individual pages. The `dark` CSS class is toggled on the `<html>` element. Tailwind `dark:` prefix is used throughout for dark mode styles.

### Styling
- Tailwind CSS v4 (PostCSS-based; configured via `@import "tailwindcss"` in `globals.css`)
- Brand color palette defined in `globals.css` via CSS variables and `@theme`: `--color-primary: #d8d0bc`, `--color-primary-dark: #565448`, `--color-accent: #9013fe`
- Custom keyframe animations (fadeInUp, shimmer, wave, float) defined inline via `<style>` blocks in components
- Framer Motion used for physics-based animations (`OneLiner.tsx`)

### Image domains
External images from `images.unsplash.com` are allowed in `next.config.ts`.

### All pages are client components
Every page and major component uses `"use client"`. Components that rely on theme state check a `mounted` flag before rendering to avoid hydration mismatches.
