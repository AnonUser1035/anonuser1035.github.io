## Context

`/workouts` currently serves a day-of-week checklist tracker (`src/data/workouts.ts`, `src/components/Workouts/WorkoutTracker.tsx`), reachable from a Projects entry that is presently commented out (`src/data/projects.ts:46-49`). The tracker is a static sets/reps model with per-day localStorage — it has no timer.

EMOM training is fundamentally time-driven: a clock runs, and at the top of each interval you begin a prescribed movement; the leftover time is rest. The owner's workouts rotate one movement per interval, use a usually-but-not-always-60-second interval, mix movement types (reps, per-side reps, machine calories, static holds), and interleave breaks and holds between rotation blocks. This is a different paradigm than the checklist, so we replace rather than extend.

Constraints:

- Static export (`output: 'export'`) — the whole feature is client-side; no server, no new backend.
- Existing design system (CSS custom properties in `app/styles/`, `PageWrapper`, theming) must be reused.
- The owner will keep adding workouts, so authoring must be pure data.

## Goals / Non-Goals

**Goals:**

- Model EMOM workouts as compact, human-authored data that mirrors how the owner writes them on paper.
- Isolate all EMOM-specific logic in a pure `expand()` compiler so the runtime timer stays a dumb segment player.
- Deliver a gym-usable timer: glanceable, audible, screen stays awake.
- Make adding future workouts a data-only change.
- Ship "David Rosen's EMOMs" seeded with the owner's EMOM 30.

**Non-Goals:**

- No workout history, accounts, or cross-device sync (would trigger a backend and possibly a repo split — out of scope here).
- No non-EMOM formats (AMRAP, for-time, Tabata) in this change, though the segment model should not preclude them later.
- No auto-detection of how long a movement takes; pacing is author-declared, not measured.
- No intra-minute work/rest split visualization in this change (the erg pace line is the only pacing feature shipped now).

## Decisions

### Two-layer model: authoring → `expand()` → runtime segments

The authoring model matches the owner's shorthand (`Block` with `stations` rotated one per `interval`, plus trailing `then` segments). A pure `expand()` function flattens it into a `Segment[]` the timer plays. The timer knows nothing about EMOM — it walks segments.

- **Why**: All ambiguity (partial rounds, per-station interval, trailing breaks/holds) resolves in one pure, unit-testable place. The runtime never changes when we add workout formats; we add expander cases. Adding workouts is data-only.
- **Alternatives considered**: (a) A timer that understands blocks/rotations directly — rejected: scatters interval math through the UI and stateful clock, hard to test. (b) Author the flat segment list directly — rejected: verbose, error-prone, doesn't match how the owner thinks.

### Partial final rounds run to the clock (Option A)

When a block's `duration` isn't a whole multiple of the rotation, `expand()` continues the rotation from the next station and stops exactly at `duration`, leaving the last round incomplete.

- **Why**: Matches "the clock is boss" mental model of EMOM; least surprising when watching a countdown. Chosen by the owner over "whole rounds only" and "author must make it divide evenly."
- **Consequence**: A 10-minute block with three 60s stations yields `A B C A B C A B C A` — three rounds plus a leftover A. This is the headline acceptance case in the spec.

### Tagged-union `measure`

`reps | perSide | cal(+meters) | holdSec` as a discriminated union; the UI switches on the tag.

- **Why**: The owner's movements are genuinely different kinds (reps, "10/10", "12 cal (200m)", "50 sec plank"). A union keeps each rendering path explicit and type-safe, and makes `holdSec` (a segment with no rep count) a first-class case rather than a hack.

### Timestamp-anchored interval clock in a custom hook

A `useIntervalClock` hook drives playback by computing remaining time from a start timestamp and the segment offsets, rather than decrementing a counter each tick.

- **Why**: `setInterval` throttles in background tabs and drifts. Anchoring to elapsed wall-clock time keeps the countdown accurate and self-correcting. Pause stores the elapsed offset; resume re-anchors.
- **Note**: `'use client'` component; timer state is transient (not persisted beyond optional last-selected-workout).

### Web Audio cues unlocked on start; Wake Lock during play

Audio context is created/resumed on the start gesture (mobile autoplay policy). Screen Wake Lock is requested while running and released on pause/stop/complete. Both feature-detect and degrade silently.

- **Why**: You don't watch the screen mid-set, and the screen must not sleep. These are the two features that separate a usable gym timer from a toy. Neither needs a dependency.

### Reuse existing structure and styling

Player lives under `src/components/Workouts/` (replacing tracker files); route stays `app/workouts/page.tsx`; styles replace the tracker CSS in `app/styles/`. Projects entry re-enabled and retitled.

- **Why**: The tracker was already an in-site app; keeping the route and slot avoids churn and reuses the design system and Pages deploy. No repo split (decided: static client-side app has nothing to gain from separation until it grows a backend).

## Risks / Trade-offs

- **Partial-round rule feels wrong in practice** → It lives entirely in `expand()`; changing the rule is a one-function edit plus test updates, no UI/runtime change.
- **iOS audio/Wake Lock quirks** (audio needs a gesture; Wake Lock support varies) → Unlock audio on the explicit start tap; feature-detect both; timer remains fully functional visually if either is blocked.
- **Background-tab timer throttling** → Timestamp-anchored clock recomputes from wall-clock on each tick, so it self-corrects after throttling.
- **Removing the checklist deletes localStorage progress** → Acceptable and intended; documented as no-migration in the spec. Old keys are simply never read.
- **Scope creep toward history/sync/other formats** → Explicitly non-goals; the segment model leaves room without committing now.

## Migration Plan

1. Land the authoring types + `expand()` with unit tests (including the EMOM 30 expansion and the run-to-the-clock partial-round case) before any UI.
2. Replace the tracker data/components/styles; repurpose the route and metadata to "David Rosen's EMOMs".
3. Re-enable and retitle the Projects entry.
4. Static build + manual gym check (audio, wake lock, glanceability) on a phone.

Rollback: revert the PR; the prior checklist tracker is intact in git history if it must return.

## Open Questions

- Exact audio cue design (how many seconds of countdown beeps, distinct end-of-workout tone) — a runtime detail, decide during implementation.
- Whether to persist the last-selected workout across visits — minor nicety, not required by any spec scenario.
- Default `pace` values for the seeded erg stations — the owner can supply targets; stations without them simply omit the pace line.
