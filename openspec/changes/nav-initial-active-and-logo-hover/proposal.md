# Proposal: Nav Initial Active State and Logo Hover

## Why

Two small nav polish issues on the one-page site:

1. **Experience is highlighted on load.** `useScrollSpy` initializes `activeSection` to the first section id, and its no-intersection fallback picks the closest section even when the visitor is still at the top in the hero. So the Experience tab reads as "current" before the user has scrolled to any section. Nothing should be highlighted while the hero is in view.
2. **The wordmark logo is solid-filled by default.** `.site-logo.active` fills the logo with solid cobalt on the homepage (it's the "current page"). Ryan wants the wordmark unhighlighted at rest and the blue fill to appear only on hover/focus.

## What Changes

### No active tab until a section is reached

- Start the scroll spy with no active section (null) instead of the first section.
- Only mark a section active once it has actually scrolled up to the activation band; while the hero occupies the top of the viewport (no section reached yet), keep the active section null so no header/hamburger tab is highlighted.
- Preserve existing behavior once scrolling: the section in view is highlighted, and the last section is active at the bottom of the page.

### Logo fills blue only on hover

- Remove the solid-fill "active" treatment for `.site-logo` so the wordmark looks like its default (transparent plate) on the homepage.
- Move the solid cobalt fill (with inverted `--color-bg` text) to `:hover`/`:focus-visible`, replacing the current subtle hover.
- Keep the `active`/`aria-current="page"` on the logo for accessibility (screen readers still get "current page"); only the visual fill changes.

## Decisions Already Made

- At the top of the page (hero visible), no section tab is highlighted.
- The logo is visually unhighlighted at rest and fills blue on hover/focus; `aria-current` stays for a11y.
- Visual/behavioral only; no content or IA changes.

## Open Questions

None.

## Impact

- `src/hooks/useScrollSpy.ts` (initial state + "in hero" guard) and its test `src/hooks/__tests__/useScrollSpy.test.tsx`.
- `app/styles/layout/navigation.css` (logo hover/active rules).
- Possibly `src/components/__tests__/Template/Navigation.test.tsx` (initial-active expectation).
- No API/data changes.
