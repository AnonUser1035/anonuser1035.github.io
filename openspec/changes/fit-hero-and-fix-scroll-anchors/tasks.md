# Tasks: Fit Hero and Fix Scroll Anchors

## 1. Accurate anchor landings

- [x] 1.1 Add `scroll-padding-top: var(--header-height)` to `html` in `app/styles/base/reset.css`, and `--header-height-mobile` under the existing `max-width: 736px` body query
- [x] 1.2 Retune `--scroll-offset-resume` in `app/styles/tokens/spacing.css` from `6rem` to a small breathing gap (~1.5rem)
- [x] 1.3 Update `resume-section` in `app/styles/pages/resume.css` so `scroll-margin-top` is just the breathing gap (drop the `var(--header-height)` term now that scroll-padding-top adds it) — avoid double-counting the header
- [x] 1.4 Align the content.css anchors (lines ~72/303) the same way so long-form pages keep a clean landing without a doubled offset

## 2. Hero fits one viewport

- [x] 2.1 Make `.hero` a centered flex column bounded to `calc(100dvh - var(--header-height))` (with `100vh` fallback and `--header-height-mobile` on small screens) in `app/styles/pages/home.css`
- [x] 2.2 Replace fixed avatar size, vertical margins, and hero padding with `clamp()` values that compress on short viewports and resolve near current values at ~900px+ heights (avatar, name/tagline margins, `.hero-contact` margin-top, `.contact-email-block` margin-bottom)
- [x] 2.3 Reconcile the existing `@media (max-width: 640px)` hero overrides with the new clamp-based sizing so mobile still fits and looks right

## 3. Verification

- [x] 3.1 Run `npm run build`; confirm no CSS regressions and the export still contains the hero contact block and section anchors
- [x] 3.2 Verify anchor landings (Experience/Publications/Education/Projects) sit just below the header with a small gap at desktop and mobile widths — no large void, no doubled offset
- [x] 3.3 Verify the hero fits with contact visible at first glance on ~1440×900, ~1280×720, and mobile ~390×844; confirm graceful behavior on a very short viewport
- [x] 3.4 Run `npm test`, `npm run type-check`, `npm run lint`, `npm run format`; commit on `dev` and push
