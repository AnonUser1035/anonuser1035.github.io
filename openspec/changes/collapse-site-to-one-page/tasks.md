# Tasks: Collapse Site to One Page

## 1. Shared foundations

- [x] 1.1 Create `src/data/sections.ts` with the ordered sections list (Experience, Publications, Education, Projects) and a test; delete `src/data/routes.ts` and `src/data/__tests__/routes.test.ts` once no imports remain (end of group 2)
- [x] 1.2 Extract ResumeNav's scroll-spy logic into `src/hooks/useScrollSpy.ts` (rootMargin, ratio selection, closest-to-top fallback, bottom fallback, jsdom guards), active only when pathname is `/`; migrate the spy-behavior coverage from `ResumeNav.test.tsx` into a hook test

## 2. Single header nav

- [x] 2.1 Rework `Navigation.tsx`: section anchor links (`/#<id>`) from `sections.ts`, active class + `aria-current="location"` from `useScrollSpy`, drop `projectAppRoutes` logic; update `Navigation.test.tsx`
- [x] 2.2 Rework `Hamburger.tsx`: menu lists Home + section links from `sections.ts`, closes on tap; update `Hamburger.test.tsx`
- [x] 2.3 Delete `ResumeNav.tsx`, its test, and `.resume-nav` styles in `app/styles/pages/resume.css`; verify `scroll-margin-top` offsets still land sections below the header
- [x] 2.4 Raise nav/header breakpoints from 735/736px to 899/900px in `app/styles/layout/header.css` and `app/styles/layout/navigation.css` only

## 3. Hero with contact

- [x] 3.1 Move EmailLink, response-time hint, and ContactIcons into `Hero.tsx` alongside the Download Résumé button; remove the "Get in touch" `#contact` button; update `Hero.test.tsx`
- [x] 3.2 Repurpose the `home-contact`/contact CSS into hero contact styles; confirm no `#contact` references remain in code or styles (Footer/404 Contact links repointed to mailto)

## 4. One-page homepage

- [x] 4.1 Rebuild `app/page.tsx`: Hero, `#experience`, `#publications` (grouped PublicationLists, h2 section heading, h3 group labels), `#education`, `#projects` (Cell grid, `headingLevel="h3"`); remove Skills and Contact sections (keep Skills component + data files in tree)
- [x] 4.2 Add `resume-section`/scroll-margin treatment and section heading styles for the new `#publications` and `#projects` sections
- [x] 4.3 Update homepage `metadata.description` to reflect the one-page structure (drop "skills", mention projects and publications); `page-metadata.test.ts` updates land with the stubs in group 5

## 5. Legacy routes and scrolling

- [x] 5.1 Convert `app/projects/page.tsx` and `app/publications/page.tsx` to meta-refresh stubs (`0;url=/#projects` / `0;url=/#publications`) with visible fallback links and `robots` noindex metadata
- [x] 5.2 Shrink `app/sitemap.ts` to the homepage entry only; update `sitemap.test.ts`
- [x] 5.3 Make `ScrollToTop.tsx` skip when the destination URL has a hash; cover with a test if the existing pattern allows

## 6. Verification

- [x] 6.1 Run `npm test` (177 pass), `npm run type-check` (clean), `npm run lint` (clean after format); fix fallout
- [x] 6.2 Run `npm run build`; confirmed the meta refresh is hoisted into `<head>` for both stubs with `noindex` robots, and the exported homepage carries the four section anchors with no stray `#skills`/`#contact` (no inline-script fallback needed)
- [x] 6.3 Verified structure via the production export (section order/anchors, hero contact, stub redirects, single-entry sitemap); interactive logic (scroll-spy active state, hamburger open/close, hash-skip scroll) covered by `useScrollSpy`, `Navigation`, `Hamburger`, and `ScrollToTop` unit tests
- [x] 6.4 Ran `npm run format`; AGENTS.md had no stale `/projects`/`/publications`/ResumeNav/736 refs—added a Single-page IA pattern; committed on `dev` and pushed
