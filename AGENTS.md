# AGENTS.md

Guidance for AI coding agents working on this personal site: plain HTML built by a small TypeScript script, with no framework and no runtime dependencies.

## Quick Commands

```bash
npm run dev          # Dev build with live reload (localhost:3000, and the LAN)
npm run format       # Format with Prettier + Biome (run before committing)
npm run lint         # Biome linting
npm run type-check   # TypeScript checking
npm test             # Vitest tests
npm run build        # Production build into out/
```

**File-scoped (faster feedback):**

```bash
npx biome check path/to/file.ts             # Lint single file
npm test -- strip                            # Run matching tests
```

## Project Structure

```
build.ts              → Writes out/ (or .dev/ with --dev)
dev.ts                → Dev server: rebuilds and reloads on change
src/render/           → Pages, <head>, strip markup, CSS/JS inlining (build time)
src/client/           → Inlined browser scripts: strip.js (selection), fidgets.js (easter eggs)
src/styles/           → tokens.css, base.css, strip.css, page.css, fidgets.css
src/data/content.ts   → All homepage copy, milestones, links (one file)
src/data/talks.ts     → Talks and posters listed on /talks
public/resume.pdf     → One-page public résumé (see Résumé below)
src/lib/ecg.ts        → Pure rhythm-strip model (waveform, path, hit areas)
public/images/og.png  → Static 1200x630 share card
```

## Code Style

**Do:**

- Use TypeScript strict mode; Node runs it directly, so stick to erasable syntax (no enums) and import with `.ts` extensions
- Write browser code as plain JS in `src/client/` with `// @ts-check` and JSDoc types, one IIFE per file
- Style with CSS custom properties in `src/styles/` (colors and type in `tokens.css`)
- Keep render functions small and focused
- Use existing patterns from similar code
- Follow conventional commits: `feat:`, `fix:`, `chore:`, `docs:`
- Run `npm run format` before committing (CI enforces this)

**Don't:**

- Add new dependencies without clear need
- Create monolithic files
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

Node 24+ (runs the TypeScript build directly) · TypeScript · plain CSS · Biome · Vitest + jsdom

## Key Patterns

- **The letter**: The homepage (`home()` in `src/render/pages.ts`) is the name, a Lead II rhythm strip, and a short first-person letter. No nav, buttons, cards, icons, badges, section headings, monospace, or theme toggle. When something seems missing, ask before adding it
- **Copy lives in `src/data/content.ts`**: letter paragraphs (Markdown-style `[text](href)` links), milestones (labelled with month and year), the caption hint, the closing line under the letter, metadata description. Use typographic apostrophes and never em dashes (a test enforces this). Link text is descriptive ("All publications", "talks and posters", "résumé (PDF)"), never "here".
- **Rhythm strip**: `src/lib/ecg.ts` turns the milestone count into SVG geometry at build time (viewBox in mm, 25 mm/s, 10 mm/mV). `src/render/strip.ts` renders the paper, trace and hit areas at build time; `src/client/strip.js` (inlined, about 2 KB) only moves the selection dot and caption. Each beat stays unselectable until the pen has printed its R peak (a per-beat CSS animation delay). Until something is selected, the caption shows the hint (phones add a drag cue); leaving the strip, tabbing past it, or tapping elsewhere returns to it. The drawn trace carries faint seeded recording noise (at most 0.03 mV), zero on the calibration pulse and within 35 ms of every R peak; tests measure the clean waveform and bound the noise. 15 beats is the maximum: fold related moments into one caption rather than adding beats. Clinicians read this strip: keep it anatomically accurate and keep `src/lib/__tests__/ecg.test.ts` passing (R-peak times, PR, QRS, QTc, rate). Adding or removing a milestone redraws the beats; 9 to 15 fit
- **Theming**: light by default, dark through `prefers-color-scheme` only. Colors are tokens in `src/styles/tokens.css`; the waveform is always ink, and crimson is reserved for the marker and pen
- **Phones (under 760px)**: the strip keeps a 900px minimum width inside a scroller with `direction: rtl`, so it opens on the most recent beats without script. Keep the page itself free of horizontal scroll
- **Publications**: the full list lives on Google Scholar (ORCID secondary); the homepage shows four selected works with DOI links. `/talks/` lists talks and posters from `src/data/talks.ts`, Vancouver author lists, `Bohluli RS` in weight 500
- **Build**: `node build.ts` writes plain HTML to `out/` for GitHub Pages. CSS and the strip script are minified and inlined, so a page is one request plus the two fonts (Newsreader, self-hosted in `public/fonts/`, trimmed to roman 400 to 500 and italic 400). No framework, bundler or runtime dependencies: keep it that way, and watch the size line the build prints
- **Easter eggs** (homepage only, `src/client/fidgets.js` and `src/styles/fidgets.css`): click the selection dot to ping it; click a beat to retrace it in crimson at paper speed; drag the calibration pulse to change the gain (2.5 to 14 mm/mV, resting at 10); click the pen dot to tear the printout off along a ragged edge and print fresh paper; click the signature or the closing line to re-ink both; click a printed year to step through its milestones. Meant to be slightly obvious but not all findable: no labels, only a pointer cursor or a small hover response. They're pointer-only (no tab stops, hidden from screen readers) and respect reduced motion. Ryan passed on calipers (gimmicky) and a heart-rate pulse on the pen (too attention-seeking)
- **Analytics**: Google Analytics in production builds only (`GA_TRACKING_ID`, set in CI from the `NEXT_PUBLIC_GA_TRACKING_ID` repository variable). It is queued at once but fetched after the page loads
- **URLs**: pages are directories (`/talks/` is `out/talks/index.html`), so use the trailing slash in metadata, the sitemap and schema; file-like routes such as `/sitemap.xml` stay file-like
- **Page metadata**: every page goes through `document()` in `src/render/html.ts`, which writes the title, description, Open Graph and Twitter tags from one `PageMeta`; the 404 is `noindex` and has no `og:url`
- **Share card**: `public/images/og.png` is a static image drawn from the real strip geometry; regenerate it if the name or strip changes
- **Résumé**: `public/resume.pdf` is exported from Ryan's Word source (`Ryan-Bohluli-Public-Resume.docx` in his Applications output folder). Edit the .docx, keep it to one page and keep its formatting, export the PDF from Word, then copy it here. Keep the header date ("Updated <Month Year>") current

## Testing

Tests live in `__tests__/` directories adjacent to the code they test. Run `npm test` before committing.

```bash
npm test                        # Run all tests
npm test -- --watch             # Watch mode
npm test -- strip               # Run matching tests
```

## Further Reading

- [README.md](./README.md): setup and deployment

## Maintaining This Document

When creating a PR, audit this file and make small, targeted improvements based on your learnings—new patterns discovered, outdated references, or missing guidance that would have helped.
