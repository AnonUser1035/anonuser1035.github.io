## Why

The Projects tab has grown organically to three entries with per-project copy, ordering, and link-label choices, and a hover screenshot preview that only one entry actually uses. The descriptions are long and inconsistent in length, the display order is tied to publish date rather than what's actually worth leading with, the link affordance reads differently on every card ("View demo", "Try it", "Open timer"), and the screenshot preview adds real component complexity for a feature that barely gets used. None of this scales cleanly as a fourth project (Ember, a new macOS menu-bar app) gets added. This change tightens the page into a simpler, more consistent, and easier-to-maintain listing before more projects are added on top of it.

## What Changes

- Shorten all project descriptions in `src/data/projects.ts` to one strong sentence plus a short supporting clause; keep them free of em dashes.
- Add a new "Ember" project entry (a macOS menu-bar app that keeps the Mac awake with one click), linking to its bare GitHub repo (`https://github.com/AnonUser1035/ember`) since no built release exists yet.
- **BREAKING** (internal data shape): Replace date-based sorting with a fixed, curated relevance order — NSS Fleet Demo, ankibot, EMOMs, Ember — driven by array order in the data file instead of `Array.sort` by `date` in `app/projects/page.tsx`.
- **BREAKING** (internal data shape): Remove the "Selected Work" / "More Projects" group split in `app/projects/page.tsx`; render a single flat, ordered grid. Remove the now-unused `featured` field from the `Project` type and all entries.
- Make the link action label consistent across every project card by removing all per-project `linkLabel` overrides, letting every (currently all-external) project fall through to Cell.tsx's existing "Visit" default.
- Remove the cursor-following screenshot preview feature entirely: the `preview` field, the pointer/dwell-timer logic and preview JSX in `Cell.tsx`, the associated CSS in `cards.css`, the related test coverage, and the two now-unused images in `public/images/projects/`.

## Capabilities

### New Capabilities

(none — this modifies the existing, previously unspecified projects listing behavior)

### Modified Capabilities

- `projects-listing`: introduces this capability's spec for the first time (no prior spec file exists in `openspec/specs/`), capturing curated ordering, consistent link labeling, and the removal of grouping and the hover preview as the behavior going forward.

## Impact

- **Data**: `src/data/projects.ts` — `Project` interface (drop `preview`, `featured`; array becomes the ordering source of truth), all four project entries (shortened copy, no `linkLabel` overrides, new Ember entry).
- **Page**: `app/projects/page.tsx` — drop date-sort and featured/other grouping logic; render one ordered `projects-grid`.
- **Component**: `src/components/Projects/Cell.tsx` — remove all preview-related state, effect, and JSX.
- **Styles**: `app/styles/components/cards.css` — remove `.project-preview` rule blocks and the stale comment referencing it.
- **Tests**: `src/data/__tests__/projects.test.ts` and `src/components/__tests__/Projects/Cell.test.tsx` — drop preview-specific assertions/fixture fields.
- **Assets**: delete `public/images/projects/nss-fleet-demo.png` and `public/images/projects/workout-tracker.png` (both unused after this change).
- **Unaffected**: `projectAppRoutes` export and internal-route detection (still used by `src/components/Template/Navigation.tsx`), the arrow glyph logic, dayjs year formatting, tech-tag rendering.
