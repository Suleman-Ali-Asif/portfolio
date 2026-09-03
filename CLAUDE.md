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

**Next.js 15 App Router** portfolio site using React 19, Tailwind CSS v4, Framer Motion, and `next-themes`.

Screenshots for visual checks: headless Chrome via CDP with real time (a `--virtual-time-budget` freezes Framer Motion mid-animation, `--timeout` captures before hydration). Emulate `prefers-color-scheme` through `Emulation.setEmulatedMedia`; the default headless profile here reports dark.

### Routing
- `/` → `src/app/page.tsx` — editorial single page in a 1040px container: top bar, About (meta line, headline, paragraph, text links + copy-email, `SystemBlocks` schematic, "What I do" rows), Selected work (`WorkIndex`), Now (facts list with live Lahore time), Contact (large email link), footer colophon. Text blocks are capped at 680–820px; the Work section uses the full container. Supports deep links `/?project=<slug>` and `/?project=<slug>&view=arch`, which open the detail panel on load; the URL is kept in sync while a project is open.
- `/contact` → `src/app/contact/page.tsx` — contact form (reCAPTCHA v3 + `/api/contact` route using Resend)

### Key directories
- `src/app/data/projects.ts` — single source of truth for all projects, including architecture graphs (nodes/edges) and screenshot paths (`image`, optional `imageDark`, files in `public/<slug>-light.png` / `-dark.png`, 1440×675). Adding a project here makes it appear in the work index, the preview, the detail panel, and the diagram.
- `src/app/utils/constants.ts` — `getConstants()`, `NAV` (About / Work / Now / Contact), `EXPERTISE`
- `src/app/types/index.ts` — `ProjectItem`, `Architecture`, `NodeDef`, `EdgeDef`, `NodeType`
- `src/app/context/AppContext.tsx` — `selectedSlug`, `view` (list/detail/arch); `openProject`, `openArch`, `closeProject`
- `src/app/component/`
  - `Nav.tsx` — sticky top bar: name, Lahore `LocalTime`, section links, `ThemeToggle`; hairline underneath
  - `LocalTime.tsx` — Asia/Karachi clock, ticks per minute, `--:--` placeholder before hydration
  - `CopyEmail.tsx` — mailto link + "Copy"/"Copied" action; `size="lg"` for the Contact section
  - `SystemBlocks.tsx` — hero schematic: seven product-part blocks in two rows ("Data path", "Around it") on a hairline bus; blocks spring in when in view (once, with Replay), the bus lines draw after, then a slow idle pulse. Static under reduced motion
  - `WorkIndex.tsx` — project list as index rows (name, url, description, mono stack). On `lg+` a sticky preview on the right crossfades to the hovered/focused row and siblings dim; below `lg` each row carries its own screenshot. Clicking a row opens the detail panel
  - `ArchThumb.tsx` — static labelled miniature of a project's architecture graph, shown in the detail panel's Architecture teaser
  - `ProjectDetail.tsx` — slide-in right panel (Framer Motion) with Overview / Architecture underline tabs; sections separated by hairlines, not boxes
  - `SystemDesignVisualizer.tsx` — interactive animated architecture diagram. Node type hues are intentionally fixed; all chrome (backgrounds, borders, text) uses theme CSS variables so it renders in both themes. Keep its layout and behaviour as-is.
  - `ThemeProvider.tsx`, `ThemeToggle.tsx` — `next-themes` (class strategy, system default)

### Theme / Dark Mode
`next-themes` toggles the `dark` class on `<html>`. All colours are semantic CSS variables defined in `globals.css` under `:root` (light) and `.dark`, then exposed to Tailwind via `@theme inline` (e.g. `bg-bg`, `bg-surface`, `bg-surface-2`, `text-text`, `text-body`, `text-muted`, `text-faint`, `text-primary`, `border-border`, `border-border-strong`). Palette is near-monochrome: warm-neutral paper in light, soft black in dark, one indigo accent reserved for focus rings, selection and the highlighted schematic block. Use these tokens; do not hardcode hex in components and do not use gradients or filled tinted panels.

### Design language
Editorial personal site, not a landing page. Hairline rules (`border-border`) separate content instead of cards; radii are small (`rounded-md` / `rounded-lg`); no shadows, no gradients. Fonts via `next/font/google`: Bricolage Grotesque (`font-display`, headings), Instrument Sans (`font-sans`, body), Instrument Serif italic (`font-serif`, used once, in the headline), JetBrains Mono (`font-mono`, meta and stacks). Links are underlined text (`.link` / `.link-muted` in `globals.css`), never buttons; the only filled button is the contact form's submit. Headings are sentence case. Motion is hover-driven (row dimming, preview crossfade, arrow nudge); no entrance stagger on sections. `prefers-reduced-motion` is respected globally.

### Image domains
External images from `images.unsplash.com` are allowed in `next.config.ts`.

### Client components
Pages and interactive components use `"use client"`. `WorkIndex` and the detail panel render theme-aware screenshots with `next/image` (`dark:hidden` / `hidden dark:block` pair). `ThemeToggle` checks a `mounted` flag before showing the active icon to avoid hydration mismatches.
