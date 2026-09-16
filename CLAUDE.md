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
- `/` → `src/app/page.tsx` — single page laid out as a **bento wall** (inspired by the Bentolio template's vibe, Sept 2026) in a 1440px container with 12/16px gaps. No section headings; every tile carries its own small caption. **Fold** (fits one 1440×900 screen): left 8 cols = one tall intro tile (`id="about"`, `sm:col-span-5 sm:row-span-2`: h1 "Whole systems, one engineer." at the top, caption + `OrbitMark` hairline ornament in a row under it, hairline rule, then Lahore clock caption + about paragraph pinned to the bottom) beside a 3-col stack of portrait tile (`public/hero.png`, grayscale, `object-contain object-bottom`) over the inverted Contact tile (`Tile inverted`, links to `/contact`, big "Contact me", email in mono); right 4 cols (`grid-rows-[1fr_auto]`) = Experience tile (`EXPERIENCE`, two roles spread over the height) over Education tile (`EDUCATION`, university). Social links live only in the footer Elsewhere tile (moved out of the fold at user request). **Below**: `WorkIndexTile` (`id="work"`, lg-4, preview crossfades to hovered row, hairline rows of all products) beside the "What I owned at Jfreaks" tile (lg-8, 2-col dl from `jfreaks.points`, Apexion one-liner under a hairline), Stack tile lg-12 with a 3-col dl, footer row (email tile with `CopyEmail`, Elsewhere links, colophon). Sections removed at user request in Sept 2026: the four-tile `WorkGrid` and the How-I-work tiles. Section ids for the nav live on tiles: `about`, `work`, `experience`, `contact`. Supports deep links `/?project=<slug>` and `/?project=<slug>&view=arch`, which open the detail panel on load; the URL is kept in sync while a project is open.
- `/contact` → `src/app/contact/page.tsx` — contact form (reCAPTCHA v3 + `/api/contact` route using Resend), wrapped in one large `Tile pad="lg"`; `not-found.tsx` does the same

### Key directories
- `resume/Suleman_Ali_Resume.html` — résumé source. Render with headless Chrome (`--print-to-pdf`, A4, two pages) to `public/resume.pdf`. All bullets verified against the project repos in Sept 2026; no invented percentages.
- `src/app/data/projects.ts` — single source of truth for all projects, including architecture graphs (nodes/edges) and screenshot paths (`image`, optional `imageDark`, files in `public/<slug>-light.png` / `-dark.png`, 1440×675). Adding a project here makes it appear in the work grid, the About index tile, the detail panel, and the diagram. Current four: Verid, Commodity Price API, TweetStorm.ai, Netus.ai. Content was rewritten in Sept 2026 from the actual repositories (`~/Documents/verid.new`, `commodity`, `Tweetstorm`, `Netus`); keep claims to what the code and git history show.
- `src/app/utils/constants.ts` — `getConstants()`, `NAV` (About / Work / Experience / Contact), `PRINCIPLES` (no longer rendered, How-I-work tiles removed Sept 2026), `EXPERIENCE` (Jfreaks, Apexion), `EDUCATION` (Air University), `STACK`. All copy is factual (résumé + case studies). No performance metrics or percentages anywhere on the site; those live in the résumé PDF only.
- `src/app/types/index.ts` — `ProjectItem` (incl. `role`, `outcome`; outcomes are descriptive, never numeric), `Architecture`, `NodeDef`, `EdgeDef`, `NodeType`
- `src/app/context/AppContext.tsx` — `selectedSlug`, `view` (list/detail/arch); `openProject`, `openArch`, `closeProject`
- `src/app/component/`
  - `Nav.tsx` — top bar rendered as the first tile (not sticky): name, Lahore `LocalTime`, section links, `ThemeToggle`. Same 1440px container and 12/16px page padding as the page
  - `LocalTime.tsx` — Asia/Karachi clock, ticks per minute, `--:--` placeholder before hydration
  - `CopyEmail.tsx` — mailto link + "Copy"/"Copied" action; `size="lg"` for the Contact section
  - `Tile.tsx` — `Tile` (polymorphic via `as`; `inverted` = ink-on-paper CTA skin; `interactive` = hover fill shift; `pad` = md/sm/lg/none, use it instead of overriding `p-*`), `TILE_RADIUS` (`rounded-[22px]`, shared with Nav and the portrait) and `Bento` (1 col, `sm` 6, `lg` 12, `gap-3`/`gap-4`). Tiles set their own `sm:col-span-*` / `lg:col-span-*`.
  - `WorkGrid.tsx` — the default export (four-tile project grid) is no longer rendered (removed Sept 2026, user request); the file stays because it exports `Screenshot` (light/dark `next/image` pair) which the fold's `WorkIndexTile` and the detail panel reuse
  - `ArchThumb.tsx` — static labelled miniature of a project's architecture graph, shown in the detail panel's Architecture teaser
  - `ProjectDetail.tsx` — slide-in right panel (Framer Motion, `bg-surface`) with Overview / Architecture underline tabs; sections separated by hairlines, not boxes. The Architecture teaser is a `Tile` on `bg-surface-2`
  - `SystemDesignVisualizer.tsx` — interactive animated architecture diagram. Node type hues are intentionally fixed; all chrome (backgrounds, borders, text) uses theme CSS variables so it renders in both themes. Keep its layout and behaviour as-is.
  - `ThemeProvider.tsx`, `ThemeToggle.tsx` — `next-themes` (class strategy, system default)

### Theme / Dark Mode
`next-themes` toggles the `dark` class on `<html>`. All colours are semantic CSS variables defined in `globals.css` under `:root` (light) and `.dark`, then exposed to Tailwind via `@theme inline` (e.g. `bg-bg`, `bg-surface`, `bg-surface-2`, `text-text`, `text-body`, `text-muted`, `text-faint`, `text-primary`, `border-border`, `border-border-strong`). Palette is near-monochrome: `--bg` is a warm stone grey in light and near-black in dark, `--surface` is the paper tiles sit on, so the bg/surface contrast carries the bento layout. One indigo accent reserved for focus rings and selection. Use these tokens; do not hardcode hex in components and do not use gradients or filled tinted panels. `--text-faint` is decorative only (icons, markers, diagram hairlines); body or label text uses `text-muted` or darker so it passes WCAG AA.

### Design language
Personal site as a bento wall (user request, Sept 2026, after https://bentolio.vercel.app), not a SaaS landing page. Filled tiles (`Tile`: `bg-surface`, `rounded-[22px]`, no border, no shadow) on the darker page ground, one inverted tile (`bg-text text-bg`) for the contact call to action, generous padding, captions top-left and the main statement bottom-aligned. Inside a tile, hairline rules and `divide-y divide-border` rows separate items. Interactive tiles shift fill on hover. No section headings outside tiles. No gradients, no eyebrow labels, no status pills. Fonts via `next/font/google`: Bricolage Grotesque (`font-display`, headings), Instrument Sans (`font-sans`, body), Instrument Serif italic (`font-serif`, used once, in the headline), JetBrains Mono (`font-mono`, meta and stacks). Links are underlined text (`.link` / `.link-muted` in `globals.css`), never buttons; the only filled button is the contact form's submit. Headings are sentence case. Copy avoids em/en dashes and middle-dot separators (use commas, colons, periods). Motion is hover-driven (tile fill shift, preview crossfade, slight screenshot scale, arrow nudge); no entrance stagger on sections. `prefers-reduced-motion` is respected globally.

### Image domains
External images from `images.unsplash.com` are allowed in `next.config.ts`.

### Client components
Pages and interactive components use `"use client"`. `WorkIndexTile` and the detail panel render theme-aware screenshots with `next/image` (`dark:hidden` / `hidden dark:block` pair). `ThemeToggle` checks a `mounted` flag before showing the active icon to avoid hydration mismatches.
