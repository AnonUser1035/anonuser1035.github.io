# Design: Collapse Site to One Page

## Context

The site is a Next.js 16 App Router static export (GitHub Pages, `trailingSlash: true`) with three content routes: `/` (Hero + ResumeNav scroll-spy + Experience/Education/Skills/Contact sections), `/projects` (Cell grid from `src/data/projects.ts`), and `/publications` (PublicationList of publications + presentations). Navigation is split across two systems: the site header (`Navigation.tsx`: logo + page tabs + ThemeToggle + Hamburger/SlideMenu below 736px) and the homepage-only sticky `ResumeNav` (IntersectionObserver scroll spy over four sections).

All decisions are recorded in `proposal.md`. Target: one page, one header, devportfolio-style, implemented directly on `dev`.

## Goals / Non-Goals

**Goals:**

- Single scrolling homepage: Hero, `#experience`, `#publications`, `#education`, `#projects`.
- Single header nav whose links are section anchors, with the scroll-spy active highlight lifted from ResumeNav.
- Contact (EmailLink, response-time hint, ContactIcons) and the resume PDF button live in the Hero.
- Skills section unmounted entirely.
- Old `/projects/` and `/publications/` URLs keep working via minimal meta-refresh stubs.
- Hamburger breakpoint raised to 900px so mid-width viewports use the slide menu.

**Non-Goals:**

- Reincorporating skill highlights anywhere (tracked as a future todo in the proposal).
- Redesigning section content (Experience, Education, project cards, publication lists render as-is, only re-homed).
- Client-script redirects or 301 emulation beyond meta refresh (old links have near-zero traffic).
- Any change to external project app links or the theme system.

## Decisions

### 1. One shared sections data source

Replace `src/data/routes.ts` with `src/data/sections.ts`: an ordered array `[{ label, id }]` for Experience, Publications, Education, Projects. Header nav, Hamburger menu, and the scroll-spy hook all consume it, so order and labels can never drift between desktop, mobile, and spy. `routes.ts` and its test are deleted (nothing else imports it once Navigation and Hamburger switch over).

_Alternative considered:_ keep `routes.ts` and add a parallel sections list. Rejected: two lists describing the same nav is exactly the two-system problem this change removes.

### 2. Scroll spy becomes a hook consumed by the header

Extract ResumeNav's logic into `src/hooks/useScrollSpy.ts` (takes the section ids, returns the active id). Carry over the existing behaviors verbatim: `-20% 0px -75% 0px` rootMargin, highest-intersection-ratio selection with closest-to-top fallback, jsdom guards, and the bottom-of-page fallback (harmless generalization even though the new last section, Projects, is tall). `Navigation.tsx` becomes the sole nav: logo, section anchor links with `active` class + `aria-current="location"` from the hook, ThemeToggle, Hamburger. `ResumeNav.tsx`, its test, and its CSS block are deleted; the test's scroll-spy coverage migrates to a `useScrollSpy` test.

_Alternative considered:_ keep ResumeNav as a second row docked under the header. Rejected in explore: less unified, the whole point is one nav.

### 3. Anchor hrefs are `/#section`, spy active only on `/`

Header and hamburger links use `/#experience` style hrefs so they work from the 404 page and the redirect stubs, not just the homepage. On `/` they behave as pure hash links (no navigation, smooth scroll via existing `html { scroll-behavior: smooth }`). The hook only runs/observes when `usePathname() === '/'`; on other paths no link is active. The `projectAppRoutes` special-casing in `Navigation.isActive` is dropped (Projects is no longer a route; if a visitor is inside an internal project app, no header section is active, which is honest).

### 4. Homepage assembly

`app/page.tsx` renders inside the existing `resume-page`/`resume-content` structure:

1. `Hero` (now with contact block + resume button)
2. `<section id="experience">` — `Experience` (unchanged)
3. `<section id="publications">` — the two grouped `PublicationList`s from the old page, with an h2 section heading and h3 group labels (demoted one level from the standalone page's h1/h2)
4. `<section id="education">` — `Education` (unchanged)
5. `<section id="projects">` — the `Cell` grid, h2 section heading, cells at `headingLevel="h3"`

Skills import and section are removed from the page. The `Skills` component and `src/data/resume/skills.ts` stay in the tree untouched (tested, self-contained, and the future todo wants the content back in some form); only the mount point goes away. The `#contact` section is deleted.

Homepage `metadata.description` is rewritten to drop "skills" and reflect the one-page structure.

### 5. Hero absorbs contact

Hero keeps avatar, name, tagline, and the Download Résumé primary button. The "Get in touch → #contact" secondary button is replaced by the contact block inline in the hero (hpaul-v2 pattern): `EmailLink`, the "Usually respond within 24 hours" hint, and `ContactIcons`. The `home-contact` CSS is repurposed/renamed into hero contact styles; no dangling `#contact` references remain.

### 6. Redirect stubs

`app/projects/page.tsx` and `app/publications/page.tsx` become stubs that render `<meta httpEquiv="refresh" content="0;url=/#projects" />` (React 19 hoists meta tags to `<head>`) plus a visible fallback line: "Projects now live on the homepage. [Take me there.]". Metadata: `robots: { index: false }` so the stubs drop out of search; their `createPageMetadata` entries go away. `app/sitemap.ts` shrinks to the homepage entry only.

_Alternative considered:_ deleting the routes outright. Rejected: static export means instant 404s for any existing link; the stub costs ~10 lines.

### 7. ScrollToTop respects hashes

`ScrollToTop` currently forces instant scroll-to-top on every pathname change. It must skip when `window.location.hash` is non-empty, otherwise navigating from 404/stub pages to `/#section` would jump to the section and then snap to top. Hash-only clicks on the homepage don't change pathname, so the common case is unaffected.

### 8. Breakpoint bump to 900px

The nav/header media queries in `app/styles/layout/header.css` (33, 48, 138) and `app/styles/layout/navigation.css` (67, 185) move from 735/736px to 899/900px. Other files using 736px (page grids, resume layout, etc.) are content-layout breakpoints and stay untouched. With four links plus the full-name logo and theme toggle, 736px is too tight; below 900px the slide menu takes over.

### 9. CSS and scroll offsets

New homepage sections (`#publications`, `#projects`) get the same `resume-section` treatment so the existing `scroll-margin-top: calc(var(--header-height) + ...)` keeps anchor landings clear of the fixed header. `.resume-nav` styles are deleted. The `--scroll-offset-resume` calc may simplify now that the sticky sub-nav is gone (verify landings visually).

## Risks / Trade-offs

- [Losing per-page SEO for Projects/Publications] → Accepted in proposal; sitemap consolidates, stubs are noindex with meta refresh, and homepage metadata mentions projects and publications.
- [Scroll-spy behaves differently with five taller sections] → Logic carried over verbatim including the bottom fallback; verify manually with the dev server at several viewport heights.
- [`headingLevel` demotion breaks visual hierarchy on re-homed sections] → Cell already supports `headingLevel`; publication group labels reuse existing `group-label` styles, checked visually.
- [Tests widely reference routes/pages that disappear] → Known blast radius: `routes.test.ts`, `ResumeNav.test.tsx`, `Navigation.test.tsx`, `Hamburger.test.tsx`, `Hero.test.tsx`, `sitemap.test.ts`, `page-metadata.test.ts`. Each migrates alongside its component in the same task, never batched at the end.
- [Meta refresh in JSX might not hoist as expected] → Verify in the built export (`npm run build`, inspect `out/projects/index.html`) that the meta tag lands in `<head>`; if not, fall back to a tiny inline `<script>window.location.replace(...)</script>` in the stub.

## Migration Plan

Implemented directly on `dev` (user instruction), small conventional commits, pushed after each. Lands on `main` via the usual PR/merge. Single deploy; no data migration. Rollback = revert the merge.

## Open Questions

None.
