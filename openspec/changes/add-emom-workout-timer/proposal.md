## Why

The `/workouts` route currently ships a day-of-week **checklist tracker** — you tap sets off, and you set your own pace. That model has no concept of time, so it can't drive the kind of training the owner actually does: **EMOM** ("Every Minute On the Minute") workouts, where a running clock dictates the pace and the reps are just what you fit into each interval. Rather than bolt a timer onto a checklist, we replace the tracker with a purpose-built, data-driven EMOM timer branded **"David Rosen's EMOMs"**.

## What Changes

- **BREAKING**: Remove the checklist workout tracker — the day-of-week `WeeklyPlan` model, the tap-to-check-off UI, and per-day localStorage progress. The `/workouts` route is repurposed, not preserved.
- Introduce an **EMOM authoring grammar**: a workout is `Block[]`; each block has a `duration`, a default `interval` (seconds/station, usually 60), and an ordered list of `stations` rotated one per interval, plus optional trailing segments (`break`, `hold`). Stations carry a tagged `measure` (`reps` / `perSide` / `cal`+`meters` / `holdSec`), optional `load`, per-station `interval` override, and optional per-minute `pace` target.
- Introduce a pure **`expand()` compiler** that flattens the authoring model into a flat `Segment[]` timeline the timer plays. Partial final rounds **run to the clock** (Option A): when a block's duration isn't a whole multiple of the rotation, the trailing minutes continue the rotation from the next station and the block stops at its duration.
- Introduce a **runtime timer player**: a large glanceable countdown of the current segment, current + next station, block/round progress, and transition handling driven by an interval clock.
- Add **gym-practical runtime features**: audio transition cues (unlocked by a start tap), Screen Wake Lock so the display stays on, and start/pause/reset controls.
- Add an optional **erg pace line** for `cal`/`meters` stations — a per-minute target rate ("hold ≥18 cal/min") derived from the station's `pace` field.
- Ship an initial workout library seeded with the owner's "EMOM 30" as data (no code changes to add future workouts).

## Capabilities

### New Capabilities

- `emom-workout-model`: The authoring grammar (blocks, stations, measures, per-station interval, pace) and the pure `expand()` compiler that flattens a workout into an ordered `Segment[]` timeline, including the run-to-the-clock partial-round rule.
- `emom-timer`: The runtime experience — the interval clock, the glanceable player UI, start/pause/reset, audio transition cues, Screen Wake Lock, and the optional erg pace line.

### Modified Capabilities

<!-- None. The existing checklist tracker was never captured as an OpenSpec spec; its removal is described in What Changes and the emom-timer spec. -->

## Impact

- **Routes**: `app/workouts/page.tsx` repurposed to render the EMOM player and library; metadata retitled to "David Rosen's EMOMs".
- **Data**: `src/data/workouts.ts` replaced — the `WeeklyPlan`/`WorkoutDay`/`WorkoutSection` types give way to the EMOM authoring types plus the seeded workout library.
- **Components**: `src/components/Workouts/` (`WorkoutTracker`, `icons`) replaced by the EMOM player, its interval-clock hook, and supporting subcomponents.
- **Styles**: workout tracker CSS in `app/styles/` replaced with player styles (large-format countdown, station cards, pace line).
- **Projects**: the commented-out Workout Tracker entry in `src/data/projects.ts:46-49` is re-enabled and retitled "David Rosen's EMOMs".
- **Persistence**: per-day set-completion localStorage removed; any timer state persisted is transient (e.g., last-run workout selection).
- **Dependencies**: none expected — Wake Lock and Web Audio are browser APIs; the static-export (`output: 'export'`) constraint is preserved (fully client-side).
