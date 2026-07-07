## 1. Résumé PDF asset

- [ ] 1.1 Add the most recent résumé as a static PDF at `public/resume.pdf` — **BLOCKED: needs the actual PDF file from Ryan; wiring (download link, path) is in place and ready for it to be dropped in**
- [x] 1.2 Add a "Download Résumé (PDF)" link/button near the Hero in `app/page.tsx`, pointing to `/resume.pdf` with a `download` attribute

## 2. Generalize the scroll-spy nav

- [x] 2.1 In `src/components/Resume/ResumeNav.tsx`, extend the `sections` array to include `contact` alongside `experience`/`education`/`skills` (kept the existing component name/file — renaming would have touched CSS classes and tests for no behavioral gain)
- [x] 2.2 Verify `INTERSECTION_MARGIN` and active-state behavior still work correctly with 4 sections instead of 3
- [x] 2.3 Update or add tests for the generalized nav (`src/components/__tests__/Resume/ResumeNav.test.tsx`)

## 3. Compose the homepage sections

- [x] 3.1 Update `app/page.tsx` to render, in order: `Hero` → scroll-spy nav → Experience section (`#experience`) → Education section (`#education`) → Skills section (`#skills`) → Contact section (`#contact`)
- [x] 3.2 Reuse `Experience`, `Education`, `Skills` components and `resume/work.ts`, `resume/degrees.ts`, `resume/skills.ts` data exactly as used today in `app/resume/page.tsx`
- [x] 3.3 Reuse `EmailLink` and `ContactIcons` components and `contact.ts` data exactly as used today in `app/contact/page.tsx`
- [x] 3.4 Keep the existing "Projects / Publications" directory list on the homepage — moved it to the end of the page (after Contact) so it reads as "keep exploring" rather than interrupting the narrative right after Hero
- [x] 3.5 Add appropriate section wrapper markup/CSS so the merged sections read as one coherent scroll (reused `.resume-page`/`.resume-content`/`.resume-section` for Experience/Education/Skills; added a small `.home-contact` wrapper in `home.css` that reuses `.contact-*` classes minus the standalone page's full-viewport centering)

## 4. Reframe the Hero copy

- [x] 4.1 Update `src/components/Template/Hero.tsx` copy to lead with bio/philosophy ("intangibles") rather than functioning as a title-only banner — copy is a first draft; please review/edit the voice

## 5. Remove the old routes

- [x] 5.1 Delete `app/resume/page.tsx` and its directory
- [x] 5.2 Delete `app/contact/page.tsx` and its directory
- [x] 5.3 Remove or update tests referencing `/resume` or `/contact` routes directly — updated `app/__tests__/page-metadata.test.ts`, `app/__tests__/sitemap.test.ts`, `src/data/__tests__/routes.test.ts`, `Hero.test.tsx`, `Footer.test.tsx`, `Navigation.test.tsx`, `Hamburger.test.tsx`
- [x] 5.4 Remove the `/resume/` and `/contact/` entries from `app/sitemap.ts`
- [x] 5.5 (added) Update `src/data/routes.ts` to drop Resume/Contact top-level nav entries (top nav + hamburger now list Projects/Publications only; Home is reached via the logo)
- [x] 5.6 (added) Update `Footer.tsx` and `not-found.tsx` links that pointed at `/resume`/`/contact` to `/#experience`/`/#contact`
- [x] 5.7 (added) Remove now-dead CSS (`.contact-page` wrapper, `.resume-header`/`.resume-title`) left behind by the deleted standalone pages

## 6. Metadata updates

- [x] 6.1 Broaden `app/page.tsx`'s `metadata` description to reflect the merged content (experience, education, skills, contact) instead of only the current top-level bio blurb
- [x] 6.2 Confirm `openGraph`/`twitter` metadata on `app/page.tsx` still make sense as the single canonical entry point — unchanged: the homepage intentionally inherits `openGraph`/`twitter` from `app/layout.tsx` (its `url` already equals `SITE_URL`), so no override is needed there; only the plain-text `description` needed broadening

## 7. Verification

- [x] 7.1 Run `npm run type-check`, `npm run lint`, `npm test`, and `npm run build` — all clean (193/193 tests pass)
- [x] 7.2 Manually verify in a browser: scroll-spy nav highlights correctly through all 4 sections, anchor links work, `/projects`/`/publications`/hamburger nav/theme toggle unaffected — verified via dev server; résumé PDF download link is wired but the target file doesn't exist yet (see 1.1)
- [x] 7.3 Confirm `/resume` and `/contact` are no longer generated in the static export output — confirmed, `out/` only contains `/`, `/projects`, `/publications`, `/workouts`
