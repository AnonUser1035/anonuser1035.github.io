# AGENTS.md

Guidance for AI coding agents working on this personal site: plain HTML built by a small TypeScript script, with no framework and no runtime dependencies.

## Code Style

**Do:**

- Style with CSS custom properties in `src/styles/` (colors and type in `tokens.css`)
- Follow conventional commits: `feat:`, `fix:`, `chore:`, `docs:`
- Run `npm test` and `npm run format` before committing (CI enforces formatting)

**Don't:**

- Add new dependencies without clear need
- Hard-code colors—use CSS variables (`var(--color-*)`)

## Git Workflow

- Create a topic branch for every task; never commit or push directly to `main`
- Make small, frequent conventional commits as you go (e.g., `feat:`, `fix:`, `refactor:`)
- Push to your remote branch after every commit to keep it in sync
- Land changes on `main` by merging GitHub PRs with conventional-commit titles (deploys trigger automatically from these merges)
- If multiple PRs need to land together, open an integration branch PR; do not locally merge into `main`
- Treat `main` as protected: force-pushes and history rewrites require explicit user approval

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
- **Favicon**: `public/icon.svg` is Newsreader's italic R as outlines (favicons can't load web fonts) with the crimson pen dot as its full stop, and follows `prefers-color-scheme`. `public/apple-touch-icon.png` is a 180px render of it. Change them together
- **Résumé**: `public/resume.pdf` is exported from Ryan's Word source (`Ryan-Bohluli-Public-Resume.docx` in his Applications output folder). Edit the .docx, keep it to one page and keep its formatting, export the PDF from Word, then copy it here. Keep the header date ("Updated <Month Year>") current

## Further Reading

- [README.md](./README.md): setup and deployment

## Maintaining This Document

When creating a PR, audit this file and make small, targeted improvements based on your learnings—new patterns discovered, outdated references, or missing guidance that would have helped.
