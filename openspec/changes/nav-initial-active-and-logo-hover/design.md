## Context

`useScrollSpy` (homepage-only) currently seeds `activeSection` with `sectionIds[0]` and, when no section intersects its `-20% 0px -75% 0px` band, falls back to the section with the smallest `|boundingClientRect.top|`. At page top the hero fills the viewport and the first section sits just below the fold, but the fallback still selects it, so Experience highlights before any scrolling. `Navigation.tsx` adds `active` + `aria-current` to both the logo (when `pathname === '/'`) and the current section link. In `navigation.css`, `.site-logo.active` fills the plate solid cobalt with inverted text; `.site-logo:hover` only tints subtly.

## Goals / Non-Goals

**Goals:**

- No section tab highlighted while the hero is in view; sections highlight only once scrolled to, last section active at the bottom (unchanged).
- Logo unhighlighted at rest; solid cobalt fill on hover/focus only; `aria-current` preserved.

**Non-Goals:**

- No change to section order, nav links, or the hamburger structure.
- No removal of the `active`/`aria-current` attributes (a11y semantics stay).

## Decisions

### 1. Scroll spy starts null and guards the "in hero" region

Change the initial state to `null` and drop the `setActiveSection(sectionIds[0])` seed in the effect. Add an "in hero" guard at the top of the IntersectionObserver callback: read the first section's live `getBoundingClientRect().top`; if it is still below the activation band (`> window.innerHeight * 0.2`, matching the `-20%` rootMargin top edge), set active to `null` and return. Otherwise keep the existing logic (highest-ratio visible entry, else closest-by-top fallback). This yields: at the top, first section is far below the band → null; as it scrolls up into the band → active; scrolling back to the hero → null again; between sections the first section's top is well above the band so the guard is inert and the existing fallback keeps the nearest section active. The bottom-of-page scroll fallback (forces the last section) is unchanged.

Because jsdom does not implement `IntersectionObserver`, the observer path is skipped in tests and the hook simply returns its initial state (now `null`); the bottom-scroll listener still forces the last section. Update the hook tests: initial value is `null` (not the first section), and the "no scrollable content" case stays `null`.

_Alternative considered:_ rewrite the hook to a pure scroll-position algorithm (active = last section whose top passed an activation line). Cleaner conceptually, but `getBoundingClientRect` returns zeros in jsdom, which would make the last section always active in tests and force a heavier test rewrite. The guard is a smaller, well-contained change and was already verified in-browser for the surrounding behavior.

### 2. Logo: fill on hover/focus, not on active

In `navigation.css`, remove the `.site-logo.active` solid-fill rules (and the `.site-logo.active:hover/.active .logo-text` variants) so `.active` no longer changes appearance. Replace `.site-logo:hover, .site-logo:focus-visible` with the solid cobalt fill previously on `.active`: `background-color: var(--color-accent); border-color: var(--color-accent);` and set `.logo-text` to `var(--color-bg)` on hover/focus. Net: the wordmark is a plain hairline plate at rest (including on the homepage) and fills cobalt with inverted text on hover/focus. `aria-current="page"` remains from the component.

## Risks / Trade-offs

- [Guard flickers between sections] → The guard only nulls when the _first_ section's top is below the band (i.e., truly in the hero); between later sections the first section is far above the band, so it never triggers mid-page. Verify in-browser across all four sections.
- [Losing the homepage "you are here" cue on the logo] → Intentional per request; `aria-current` keeps the semantic cue for assistive tech.
- [Test expectations change] → Update `useScrollSpy` (and, if it asserts initial section active, `Navigation`) tests to expect null-at-top; behavior verified in headless Chrome.

## Migration Plan

CSS + hook change on `dev`. Verify with `npm test`, `npm run build`, and a headless-Chrome check that no tab is active at scroll 0 and the correct tab activates after scrolling; then merge to `main` to deploy.

## Open Questions

None.
