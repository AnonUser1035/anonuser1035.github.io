## Context

The Projects page (`app/projects/page.tsx`) currently derives both grouping and ordering from data at render time: it filters `data` into `featuredProjects`/`otherProjects` by a `featured: boolean` field, sorts each group by `date` descending, and only shows "Selected Work"/"More Projects" `<h2>` labels when both groups are non-empty. `Cell.tsx` additionally carries a cursor-following screenshot preview (dwell timer, pointer-follow math, edge-flip positioning) gated behind `preview` being set and `hover: hover` + `pointer: fine` + no-reduced-motion media queries. With four projects landing (three existing plus Ember) and a decision to hand-curate relevance order rather than derive it from dates, both of these render-time derivations become the wrong shape for the data.

## Goals / Non-Goals

**Goals:**

- Make the source array in `src/data/projects.ts` the single source of truth for display order — no runtime re-sorting.
- Render one flat, ordered grid with no group headings.
- Make every project's link action label consistent by relying on `Cell.tsx`'s existing default rather than introducing new hardcoded copy.
- Delete the screenshot preview feature completely (state, effect, JSX, CSS, tests, images) rather than partially disabling it.

**Non-Goals:**

- Not building any replacement visual (e.g., a static inline thumbnail) for the removed preview — user explicitly wants the minimal, text-only card.
- Not introducing an explicit numeric `order` field — plain array order is sufficient at this scale (4 items) and avoids a field that must be kept in sync with position anyway.
- Not changing `projectAppRoutes` or its consumer in `Navigation.tsx`.
- Not building any mechanism to re-derive "relevance" automatically (e.g., from stars, recency, traffic) — this is a hand-curated ordering, revisited manually as projects are added or reprioritized.

## Decisions

**Array order as ordering source of truth, no `order` field.** `page.tsx` will render `data` directly instead of computing `byDateDesc`. Considered adding an explicit `order: number` field, but with only 4 entries, array position is self-documenting and one less field to keep consistent when entries are reordered (dragging a numeric field along with a reorder is extra ceremony this scale doesn't need). `date` stays on each entry purely for the displayed year — it's decoupled from ordering going forward.

**Drop `featured` entirely rather than keep-but-ignore.** Since grouping is being removed, an unused `featured` field would be dead weight with no reader left in the codebase (confirmed via grep — nothing outside the removed grouping logic reads it). Deleting it now avoids a stale, silently-ignored flag confusing whoever edits `projects.ts` next.

**Consistent link label via deletion, not a new hardcoded string.** `Cell.tsx` already computes `actionLabel = linkLabel ?? (isInternal ? 'Open' : 'Visit')`. All four projects' links are external today (including Ember's bare GitHub repo), so removing the three existing `linkLabel` overrides makes every card read "Visit" for free, with no `Cell.tsx` change and no new copy invented. This also means the internal/external default distinction stays intact and correct if a future project ever links to an in-site route.

**Full removal of the preview feature, not a feature flag or dead-code-behind-a-check.** The preview is unused enough (previously 1 of 3 cards, and the new NSS-only screenshot would still be 1 of 4) that partial removal (e.g., leaving the CSS or the `preview` field in the type "just in case") would just be untested dead code. Removing the field, the effect, the JSX branch, the CSS rules, and the two now-orphaned images (`nss-fleet-demo.png`, and the already-orphaned `workout-tracker.png`) keeps `Cell.tsx` and `cards.css` matching what's actually rendered.

**Ember links to its bare GitHub repo, not a download URL.** `anonuser1035/ember`'s README references a `releases/latest/download/Ember.dmg` link, but the repo has zero published releases (`gh api .../releases` → `[]`), so that URL 404s today. Linking to the repo itself is the only currently-live destination; this can be swapped to a release/download link later once one exists, without any structural change (still a single external `link` string).

## Risks / Trade-offs

- **Manual order drifts from reality over time** → Mitigation: order is small (4 items) and lives in one array; revisit whenever a project is added or a bigger reprioritization happens. No automation needed at this scale.
- **Deleting `featured` is a type-shape break for any external consumer of `Project`** → Mitigation: `Project` is only imported within this codebase (`Cell.tsx`, `page.tsx`, tests); grep confirms no other reader, so this is safe.
- **Deleting the preview images loses them from git history's working tree (recoverable via history, but gone from `public/`)** → Mitigation: acceptable since neither image is referenced anywhere after this change; they remain retrievable from git history if ever needed.

## Migration Plan

Single-PR change, no runtime data migration (this is a static Next.js export with data literally checked into the repo). Steps: update `Project` type and all four entries in `projects.ts` → simplify `page.tsx` to a flat render → strip preview code from `Cell.tsx` → strip preview CSS from `cards.css` → update the two test files → delete the two now-unused images → run `npm run format`, `npm run lint`, `npm test`, `npm run build` before opening the PR. No feature flag or staged rollout needed; this ships as one normal deploy.
