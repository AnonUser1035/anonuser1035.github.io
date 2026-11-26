# AGENTS.md

Guidance for AI coding agents working on this Next.js personal portfolio site.

## Quick Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run format       # Format with Prettier + Biome (run before committing)
npm run lint         # Biome linting
npm run type-check   # TypeScript checking
npm test             # Vitest tests
npm run build        # Production build + static export
```

**File-scoped (faster feedback):**

```bash
npx tsc --noEmit path/to/file.tsx           # Type check single file
npx biome check path/to/file.tsx            # Lint single file
npm test -- ComponentName                    # Test single component
```

## Project Structure

```
app/                  → Pages (/, /papers, legacy redirect stubs), layout, global CSS
app/styles/           → tokens.css, base.css, strip.css, page.css
src/components/       → React components (Strip, Letter, Papers, Schema, Template)
src/data/content.ts   → All homepage copy, milestones, contact links (one file)
src/data/publications.ts → Everything listed on /papers
src/lib/ecg.ts        → Pure rhythm-strip model (waveform, path, hit areas)
public/images/og.png  → Static 1200x630 share card
```

## Code Style

**Do:**

- Use TypeScript strict mode, functional components with hooks
- Style with CSS custom properties in `app/styles/` (colors and type in `tokens.css`)
- Keep components small and focused
- Use existing patterns from similar components
- Mark client components with `'use client'`
- Follow conventional commits: `feat:`, `fix:`, `chore:`, `docs:`
- Run `npm run format` before committing (CI enforces this)

**Don't:**

- Add new dependencies without clear need
- Create god components or monolithic files
- Hard-code colors—use CSS variables (`var(--color-*)`)
- Skip type annotations on function parameters
- Commit without running `npm run format` first

## Git Workflow

- Create a topic branch for every task; never commit or push directly to `main`
- Make small, frequent conventional commits as you go (e.g., `feat:`, `fix:`, `refactor:`)
- Push to your remote branch after every commit to keep it in sync
- Land changes on `main` by merging GitHub PRs with conventional-commit titles (deploys trigger automatically from these merges)
- If multiple PRs need to land together, open an integration branch PR; do not locally merge into `main`
- Treat `main` as protected: force-pushes and history rewrites require explicit user approval

## Tech Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 (preflight only) · Biome · Vitest

## Key Patterns

- **The letter**: The homepage (`app/page.tsx`) is the name, a Lead II rhythm strip, and a short first-person letter. No nav, buttons, cards, icons, badges, section headings, monospace, or theme toggle. When something seems missing, ask before adding it
- **Copy lives in `src/data/content.ts`**: letter paragraphs (Markdown-style `[text](href)` links), milestones, P.S., footer, metadata description. Use typographic apostrophes and never em dashes (a test enforces this). Update the footer month when content changes
- **Rhythm strip**: `src/lib/ecg.ts` turns the milestone count into SVG geometry at build time (viewBox in mm, 25 mm/s, 10 mm/mV). `RhythmStrip` (server) renders the static paper and trace; `StripInteractive` (client) only moves the R-peak marker and caption. Clinicians read this strip: keep it anatomically accurate and keep `src/lib/__tests__/ecg.test.ts` passing (R-peak times, PR, QRS, QTc, rate). Adding or removing a milestone redraws the beats; 9 to 15 fit
- **Theming**: light by default, dark through `prefers-color-scheme` only. Colors are tokens in `app/styles/tokens.css`; the waveform is always ink, and crimson is reserved for the marker and pen
- **Phones (under 760px)**: the strip keeps a 900px minimum width inside a scroller with `direction: rtl`, so it opens on the most recent beats without script. Keep the page itself free of horizontal scroll
- **/papers**: rendered from `src/data/publications.ts` in three groups. Vancouver author lists; `Bohluli RS` is set in weight 500. Manuscripts under review name no journal
- **Static export**: `output: 'export'` for GitHub Pages; no server features
- **Canonical/export URLs**: match `trailingSlash: true` output (`/papers/`) in metadata, sitemap, and schema; file-like routes such as `/sitemap.xml` stay file-like
- **Page metadata**: build route metadata with `createPageMetadata` so `openGraph` and `twitter` are overridden too; for `app/not-found.tsx`, omit `openGraph.url`
- **Legacy routes**: `/projects` and `/publications` are noindex meta-refresh stubs (`LegacyRedirect`) pointing at `/` and `/papers/`
- **Share card**: `public/images/og.png` is a static image drawn from the real strip geometry; regenerate it if the name or strip changes

## Testing

Tests live in `__tests__/` directories adjacent to the code they test. Run `npm test` before committing.

```bash
npm test                        # Run all tests
npm test -- --watch             # Watch mode
npm test -- ComponentName       # Run specific test
```

## Further Reading

- [README.md](./README.md): setup and deployment

## Maintaining This Document

When creating a PR, audit this file and make small, targeted improvements based on your learnings—new patterns discovered, outdated references, or missing guidance that would have helped.
