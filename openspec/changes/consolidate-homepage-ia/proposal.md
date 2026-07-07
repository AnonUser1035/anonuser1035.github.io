## Why

The site currently spreads one person's story across six routes (`/`, `/resume`, `/contact`, `/publications`, `/projects`, `/workouts`), each re-mounting its own `PageWrapper`, metadata, and nav chrome. Compared against more minimal personal sites, this reads as cluttered — not because of page weight or framework choice (measured and ruled out), but because narrative content (who I am, my experience, how to reach me) is fragmented into separate destinations instead of read as one continuous story. Reference-type content (publications, projects) is a different content mode — "browse a list" rather than "read a narrative" — and correctly stays separate.

## What Changes

- Merge `/resume` and `/contact` into the homepage (`/`). The homepage becomes: Hero (reframed as more personal/"intangibles" — bio and philosophy, not just title) → Experience → Education → Skills → Contact, as sections on one scrolling page.
- Reuse existing `Experience`, `Education`, `Skills`, and contact components and their data sources (`resume/work.ts`, `resume/degrees.ts`, `resume/skills.ts`, `contact.ts`) as-is; only their mount point moves.
- Add a floating scroll-spy in-page nav on the homepage, generalizing the existing `ResumeNav` (IntersectionObserver active-section highlighting) pattern from 3 sections to cover Experience/Education/Skills/Contact.
- Add a "Download Résumé (PDF)" link near the Hero, pointing to a static PDF in `public/`, replacing the live `/resume` page as the shareable/printable resume artifact.
- **BREAKING**: Remove the `/resume` and `/contact` routes/pages once their content is migrated to the homepage. Any external links to these URLs will 404.
- `/projects` and `/publications` remain unchanged, standalone top-level routes.
- Top-level hamburger/mobile nav (`Navigation`, `Hamburger`, `SlideMenu`) is unchanged — still warranted with 3 real destinations (Home, Publications, Projects).
- Theme toggle is unchanged.

Out of scope for this change: spinning out `/workouts` (separate, already-decided future change), any icon-library swap, any framework/stack change. This is an information-architecture and route-consolidation change only.

## Capabilities

### New Capabilities

- `homepage-narrative`: The homepage as a single scrolling narrative page composed of Hero, Experience, Education, Skills, and Contact sections, with a floating scroll-spy nav for wayfinding within the page.
- `resume-download`: A static, downloadable PDF résumé linked from the homepage, replacing the live `/resume` route as the shareable resume artifact.

### Modified Capabilities

- None — no existing `openspec/specs/` capabilities exist yet for this site's routing or page structure.

## Impact

- Removes routes: `app/resume/page.tsx`, `app/contact/page.tsx` (and their tests/metadata).
- Modifies: `app/page.tsx` (new section composition), `src/components/Resume/ResumeNav.tsx` (generalized section list), `src/components/Template/Hero.tsx` (copy reframed toward bio/philosophy).
- Adds: a résumé PDF asset under `public/`, a download link/button near Hero.
- No change to `/projects`, `/publications`, `/workouts`, navigation components, theme toggle, or the underlying resume/contact data files.
- Sitemap and per-route metadata: `/resume` and `/contact` entries are removed from `app/sitemap.ts`; homepage metadata may need to broaden its description to reflect the merged content.
