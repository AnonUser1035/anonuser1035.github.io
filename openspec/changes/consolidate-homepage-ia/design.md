## Context

The site is a Next.js 16 App Router site with `output: 'export'` (fully static, no server). Today `/resume` already has its own internal scroll-spy nav (`ResumeNav`) covering Experience/Education/Skills, built with `IntersectionObserver`. `/contact` is a thin standalone page. Both routes duplicate `PageWrapper`, route metadata, and top-level nav chrome that the homepage also pays for. `/projects` and `/publications` are list/browse content and are explicitly staying separate — this design does not touch them.

Workouts spinout is a separate, already-decided future change and is not touched here.

## Goals / Non-Goals

**Goals:**

- Move Experience/Education/Skills/Contact content and rendering onto `/` with no loss of existing component/data reuse.
- Preserve the floating scroll-spy nav UX, generalized to the homepage's full section list.
- Replace `/resume` as a shareable artifact with a static downloadable PDF.
- Keep `/projects`, `/publications`, top nav (hamburger), and theme toggle behaviorally unchanged.
- Keep the change purely IA/routing — no dependency, framework, or icon-library changes.

**Non-Goals:**

- Not redesigning visual style, typography, or theming.
- Not changing `/projects` or `/publications` content or routes.
- Not addressing `/workouts` removal (tracked separately).
- Not building a print stylesheet — the résumé PDF is a static asset, not a rendered view.
- Not changing FontAwesome/icon usage.

## Decisions

**Homepage section order: Hero → Experience → Education → Skills → Contact.**
Mirrors the existing `/resume` internal ordering (Experience/Education/Skills) with Hero prepended and Contact appended, so the merge is closer to "move sections up a level" than "invent new grouping." Contact goes last, following the common pattern of contact-as-closing-section on a narrative page.

**Generalize `ResumeNav` in place rather than writing a new component.**
`ResumeNav`'s `sections` array and `INTERSECTION_MARGIN` logic already do exactly what's needed — the only change is the list of `{name, id}` entries growing from 3 to include `contact` (and moving its mount point from `/resume` to `/`). Alternative considered: build a separate `HomeNav` component — rejected as pure duplication of working logic for no behavioral difference.

**Résumé PDF is a static file in `public/`, not a generated route.**
A live `/resume` HTML page would need to be kept in sync with the PDF and would need print styles. A static PDF (e.g. `public/resume.pdf`) linked via a plain `<a href="/resume.pdf" download>` button near Hero avoids both — the PDF is the single source of truth for "give someone my resume," and the homepage is the single source of truth for "browse my background interactively." Trade-off: the PDF must be manually regenerated/replaced when `work.ts`/`degrees.ts`/`skills.ts` change; no automated PDF generation is in scope for this change.

**`/resume` and `/contact` routes are deleted outright (BREAKING), not redirected.**
Given this is a personal site with low external inbound-link surface, a redirect shim (e.g. a client-side redirect page) adds complexity for marginal benefit. If broken-link concerns surface later, a redirect can be added as a follow-up without blocking this change.

**Homepage metadata absorbs `/resume` and `/contact` descriptions.**
`app/page.tsx`'s `metadata`/`generateMetadata` should broaden its description to mention experience, education, skills, and contact, since those are no longer separately indexed pages. `app/sitemap.ts` drops the `/resume` and `/contact` entries.

## Risks / Trade-offs

- **[Risk]** Removing `/resume` and `/contact` breaks any existing external links or bookmarks (LinkedIn "portfolio" field, old email signatures, search-engine-indexed URLs). → **Mitigation**: user to update any known external links to those URLs (e.g. LinkedIn, resume-sharing services) to point at `/` and the new `/resume.pdf` after this ships; no in-app redirect planned initially.
- **[Risk]** A single long homepage may hurt scannability on mobile compared to separate pages. → **Mitigation**: floating scroll-spy nav (already proven on `/resume`) exists precisely to solve in-page wayfinding; no new risk beyond what `/resume` already handles today for 3 sections.
- **[Risk]** Consolidating four routes' metadata into one reduces distinct indexed URLs, which could reduce standalone search visibility for e.g. "Ryan Bohluli contact." → **Mitigation**: acceptable trade-off per proposal's goal (this is a personal narrative site, not an SEO-surface-maximization site); `/projects` and `/publications` remain independently indexed.
- **[Risk]** Existing tests target `/resume` and `/contact` page components/routes directly and will need updating or removal alongside the route deletion. → **Mitigation**: covered explicitly in tasks.md.

## Migration Plan

1. Generalize `ResumeNav`'s section list; move it (or its usage) to mount on `/`.
2. Compose `app/page.tsx` with Hero → Experience → Education → Skills → Contact sections, reusing existing components/data.
3. Add `public/resume.pdf` and a download link/button near Hero.
4. Update `app/page.tsx` metadata and `app/sitemap.ts` to reflect the merged content and removed routes.
5. Delete `app/resume/` and `app/contact/` route directories and their route-specific tests; add/update tests for the new homepage composition.
6. Manual QA: verify scroll-spy nav, anchors, PDF download, and that `/projects`/`/publications`/theme toggle/hamburger are unaffected.

No server-side rollback concerns — this is a static export; reverting is a normal git revert and redeploy.

## Open Questions

- Should `/resume` or `/contact` get a lightweight redirect to `/` instead of a hard 404, given unknown external link surface? (Currently decided: no redirect for v1; revisit if broken links are reported.)
