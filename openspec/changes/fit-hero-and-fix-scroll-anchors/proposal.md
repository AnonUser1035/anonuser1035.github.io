# Proposal: Fit Hero and Fix Scroll Anchors

## Why

Two rough edges remain after collapsing the site to one page:

1. **Anchor scrolling leaves awkward empty space.** `resume-section` sets `scroll-margin-top: calc(var(--header-height) + var(--scroll-offset-resume))` = 4rem + 6rem = **10rem**. The 6rem offset was calibrated for the old sticky `ResumeNav` sub-nav that sat below the header. That bar is gone, so every anchor now lands ~6rem too low, dropping a visible empty band above each section heading.
2. **The hero overflows the first viewport.** `.hero` is a fixed-padding vertical stack (~890px tall on desktop) that ignores viewport height. On a typical laptop (~800px, minus the 4rem fixed header) the contact block — email, response hint, social icons — falls below the fold, so contact info is not available at first glance.

## What Changes

### Accurate anchor landings

- Shrink the section scroll offset so anchors land just below the fixed header with a small, deliberate breathing gap instead of a 6rem void. Retune `--scroll-offset-resume` (or the `resume-section` calc) to roughly `header + ~1.5rem`.
- Make the offset track the mobile header height (`--header-height-mobile`) at mobile widths, since `resume.css` currently hardcodes the desktop `--header-height` in the calc regardless of viewport.
- Prefer a robust mechanism: set `scroll-padding-top` on the scroll root (html) to the header height so any future anchor is correct by default, and keep a small per-section `scroll-margin-top` only for intentional breathing room. Verify smooth-scroll and reduced-motion paths still land correctly.

### Hero fits one viewport

- Make `.hero` fill (and not exceed) the first screen: `min-height: calc(100dvh - var(--header-height))` with the content vertically centered, so the résumé button and the full contact block are visible without scrolling. Use `dvh` (with a `vh` fallback) for mobile browser-chrome resilience; account for `--header-height-mobile` on small screens.
- Scale the hero's internal sizing to the viewport so it fits on shorter screens instead of overflowing: replace fixed avatar size, vertical margins, and padding with `clamp()`-based values that compress on short viewports and expand on tall ones. Preserve the current look at typical desktop heights.
- Keep the existing content and order (avatar, name, tagline, résumé button, contact block); this is a sizing/layout change, not a content change.

## Decisions Already Made

- Contact info (email, response hint, social icons) MUST be visible in the hero without scrolling on common laptop/desktop and mobile viewports.
- Anchor landings should sit just under the header with a small intentional gap, not the current large void.
- No content or ordering changes; visual/layout only.

## Open Questions

- Exact breathing gap below the header on anchor landing (target ~1.5rem; finalize by eye).
- Minimum viewport height we guarantee the hero fits without internal scroll (target: down to ~600px tall; below that, graceful overflow is acceptable).

## Impact

- Styles: `app/styles/pages/home.css` (hero sizing/centering/clamp scaling), `app/styles/tokens/spacing.css` (`--scroll-offset-resume`), `app/styles/pages/resume.css` (section `scroll-margin-top`), `app/styles/base/reset.css` (possible `scroll-padding-top` on html), `app/styles/pages/content.css` (align any shared anchor offset).
- No component/TS changes expected; no test changes expected (styling only). Verify via production build + viewport checks.
