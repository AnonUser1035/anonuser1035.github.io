## Context

Post-collapse, `body { padding-top: var(--header-height) }` (reset.css) pushes content below the fixed header, so a section's usable "first glance" height is `100vh - header-height`. There is no `scroll-padding-top` on the scroll root; anchor landings rely entirely on per-section `scroll-margin-top`. `resume-section` uses `calc(var(--header-height) + var(--scroll-offset-resume))` where `--scroll-offset-resume: 6rem` — a value left over from the removed sticky `ResumeNav`, producing a ~6rem empty band above every heading. The hero (`.hero`, home.css) is a fixed-padding stack (`padding: 6rem 2rem 5rem`, 160px avatar, stacked margins) totaling ~890px, which overflows a laptop viewport and hides the contact block below the fold.

## Goals / Non-Goals

**Goals:**

- Anchors land just under the fixed header with a small intentional gap (~1.5rem), no large void, correct on desktop and mobile.
- The hero fits within `100vh - header` on common viewports so avatar, name, tagline, résumé button, and the full contact block are visible at first glance, scaling down gracefully on shorter screens.

**Non-Goals:**

- No change to hero content, wording, or element order.
- No change to section content or the nav/scroll-spy behavior.
- No new JS; CSS only.

## Decisions

### 1. Anchor offset: `scroll-padding-top` on html + minimal per-section margin

Add `html { scroll-padding-top: var(--header-height) }` (and `--header-height-mobile` under the existing `max-width: 736px` body query) so the scroll root itself accounts for the fixed header — every current and future in-page anchor is correct by default. Then reduce the per-section breathing gap: retune `--scroll-offset-resume` from `6rem` to `~1.5rem` and keep `resume-section { scroll-margin-top: var(--scroll-offset-resume) }` as pure breathing room (no longer re-adding the header height, since scroll-padding-top handles that). Net landing offset becomes `header + 1.5rem` instead of `header + 6rem`.

Guard against double-counting: because `scroll-padding-top` and `scroll-margin-top` both apply, the section calc must drop its `var(--header-height)` term when scroll-padding-top is introduced, or the header is counted twice. Review the content.css anchors (`scroll-margin-top: calc(var(--header-height) + var(--spacing-6))` at lines 72/303) and align them the same way so long-form pages don't regress.

_Alternative considered:_ just shrink `--scroll-offset-resume` and keep the `calc(header + offset)` form. Simpler, but leaves every anchor dependent on remembering to add the header height; `scroll-padding-top` is the more robust default. Chosen the robust path but will verify no double offset.

### 2. Hero: viewport-bounded, centered, clamp-scaled

Make `.hero` a centered flex column bounded to the first screen:

```
.hero {
  min-height: calc(100dvh - var(--header-height));
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-block: clamp(1.5rem, 4vh, 4rem);
}
```

Use `dvh` so mobile browser chrome doesn't push content off; `100vh` is the natural fallback for browsers without `dvh`. Under the mobile body query, base the calc on `--header-height-mobile`.

Scale internal sizing so a tall stack compresses on short viewports instead of overflowing:

- Avatar: `clamp(96px, 14vh, 160px)` for both width/height; margin-bottom `clamp(1rem, 2.5vh, 2.5rem)`.
- Name margin, tagline margin, `.hero-contact` margin-top, and `.contact-email-block` margin-bottom: convert fixed rems to `clamp(min, vh-based, current)` so vertical rhythm shrinks first on short screens.
- Keep font sizes as-is (name already uses `clamp` on `vw`); the fix is vertical spacing, not type scale.

At typical desktop heights (~900px+) the clamps resolve near today's values, preserving the current look; on ~700px laptops they compress enough to keep the contact icons above the fold.

_Alternative considered:_ fixed smaller paddings without `min-height`/centering. Rejected: doesn't guarantee fit across viewport heights and loses the deliberate "hero owns the first screen" framing that makes contact visible at a glance.

### 3. Floor on compression

Below ~600px viewport height (rare: very short windows), allow the hero to exceed the viewport and scroll normally rather than crushing content — the clamps bottom out at readable minimums (avatar 96px, ≥1rem gaps). This is acceptable graceful degradation, not a guaranteed-fit target.

## Risks / Trade-offs

- [Double header offset if both scroll-padding-top and the old `calc(header + …)` remain] → Audit every `scroll-margin-top` and drop the redundant `var(--header-height)` term; verify landings by eye on desktop and mobile.
- [`dvh` unsupported on old browsers] → `min-height` with `vh` fallback declared first, `dvh` second; worst case matches today's behavior.
- [Clamp scaling changes desktop look] → Tune upper clamp bounds to current values so ≥900px viewports render essentially unchanged; compare before/after screenshots.
- [Contact still below fold on very short/zoomed viewports] → Documented floor (§3); not a regression from today, where it's always below the fold.

## Migration Plan

CSS-only, implemented on `dev` per the standing workflow note. Verify with `npm run build` + viewport checks at ~1440×900, ~1280×720, and mobile ~390×844; confirm anchor landings and hero fit. Rollback = revert the commit. No data or API changes.

## Open Questions

- Final breathing gap (~1.5rem) and the shortest viewport we guarantee hero fit (~600–700px) — settle by eye during implementation.
