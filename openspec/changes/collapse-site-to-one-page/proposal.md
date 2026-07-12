# Proposal: Collapse Site to One Page

## Why

The site currently runs two navigation systems stacked on top of each other: a header with page tabs (Projects, Publications) plus a hamburger slide menu on mobile, and a separate sticky `ResumeNav` scroll-spy sub-nav on the homepage (Experience, Education, Skills, Contact). Ryan wants the unity of ryanfitzgerald.github.io/devportfolio: one page, one header, anchor links that smooth-scroll to sections, with scroll-spy highlighting. Our existing building blocks (IntersectionObserver scroll spy, accessible slide menu, `scroll-margin-top` offsets) are better than devportfolio's; the change is an IA consolidation, not new scroll machinery.

## What Changes

### Single page
- Merge `/projects` and `/publications` page content into the homepage as sections. Delete the standalone routes as destinations, but keep lightweight redirect stubs (static export cannot do server redirects) so existing deep links land on `/#projects` and `/#publications`.
- New homepage section order (decided): Hero, Experience, Publications, Education, Projects.
- Fully drop the Skills section: no nav item, no section, no relocated content for now. Future todo (out of scope for this change): reincorporate skill highlights somewhere lightweight, e.g. a line in the hero copy or a compact strip inside Experience.
- Remove the `#contact` section. Its content (EmailLink, response-time line, ContactIcons) moves into the Hero, alongside a prominent resume PDF link (hpaul-v2 pattern: socials directly under the intro).

### Single header
- One header nav: Logo | Experience, Publications, Education, Projects | theme toggle. All links are section anchors with smooth scroll, ordered to match the page.
- Lift `ResumeNav`'s IntersectionObserver scroll-spy logic into the header so the active section is highlighted; delete `ResumeNav` as a separate bar.
- Hamburger slide menu (already accessible: focus trap, scroll lock) becomes the single mobile nav, listing the same section anchors.
- Raise the hamburger breakpoint from 736px to ~900px so mid-width viewports get the slide menu instead of a cramped link row.

### Cleanup / ripple effects
- `ScrollToTop` on route change becomes mostly moot but must respect incoming `#hash` links (redirect stubs depend on this).
- Sitemap, canonical URLs, and route-level metadata consolidate to the single page (plus 404).
- `ResumeNav`'s bottom-of-page scroll-spy hack (BOTTOM_THRESHOLD_PX) can likely be dropped once short final sections (Contact) are gone; verify against the new final section.
- Update `src/data/routes.ts` (or replace with a sections data source) and `Navigation.tsx` active-link logic (`projectAppRoutes` handling needs a rethink since Projects is no longer a route).
- Keep external project app links (e.g. ankibot subdomain) working from the Projects section.

## Decisions Already Made (from explore session)

- Full one-page, "just like ryan fitzgerald" (user's words). Losing per-page URLs for Projects/Publications is accepted; redirects preserve old links.
- Contact lives in the Hero, not a section or nav item.
- Resume PDF link lives in the Hero (not the header), keeping the header at four links.
- Section order: Hero, Experience, Publications, Education, Projects.
- Skills is fully dropped (nav item, section, and content). Tracked as a future todo below, not part of this change.

## Future Todos (out of scope)

- Reincorporate skill highlights somewhere lightweight (hero copy line, compact strip in Experience, or elsewhere) once the one-page layout has settled.

## Open Questions

None. Redirect mechanism decided: meta refresh only (`<meta http-equiv="refresh" content="0; url=/#...">` with a plain fallback link). Old deep links have near-zero traffic, so no client-script redirect needed; keep the stubs minimal.

## Workflow Note

Per user instruction, implement this change directly on the `dev` branch (no topic branch), then land on `main` via the usual PR/merge flow.

## Impact

- Components: `Navigation.tsx`, `Hamburger.tsx`/`SlideMenu.tsx` (link source), `ResumeNav.tsx` (removed/absorbed), `Hero.tsx`, homepage `app/page.tsx`, `app/projects/page.tsx` and `app/publications/page.tsx` (become redirect stubs), `ScrollToTop.tsx`.
- Data: `src/data/routes.ts`, possibly a new sections list.
- Styles: `layout/header.css`, `layout/navigation.css`, `pages/resume.css` (scroll offsets), breakpoint constant.
- SEO: `app/sitemap.ts`, metadata exports, canonical URLs.
- Tests: ResumeNav tests migrate to header scroll-spy; navigation tests update.
