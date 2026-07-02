## 1. Authoring model and expander (pure, test-first)

- [ ] 1.1 Define authoring types in `src/data/workouts.ts` (replacing the weekly-plan types): `Workout`, `Block`, `Station`, the tagged `Measure` union (`reps` / `perSide` / `cal`+`meters` / `holdSec`), optional `load`, per-station `interval`, and per-minute `pace`
- [ ] 1.2 Define the runtime `Segment` type (`work` / `break` / `hold`, `durationSec`, source station reference)
- [ ] 1.3 Implement pure `expand(workout): Segment[]` — rotation one station per interval, trailing `then` segments, and the run-to-the-clock partial-round rule (Option A)
- [ ] 1.4 Write Vitest unit tests in `src/data/__tests__/`: clean 2-station/10-min round, 3-station/10-min → `A B C A B C A B C A`, trailing break+hold ordering, per-station interval override, whole-workout multi-block expansion, determinism

## 2. Seed workout library

- [ ] 2.1 Encode the owner's "EMOM 30" (three 10-min blocks, loads, measures, breaks, plank hold) as data in the library
- [ ] 2.2 Add a test asserting the seeded EMOM 30 expands to the expected segment count and ordering
- [ ] 2.3 Confirm adding a second workout requires only data (no component/`expand()` change)

## 3. Interval clock hook

- [ ] 3.1 Implement `useIntervalClock` (`'use client'`): timestamp-anchored remaining time, auto-advance across segments, completion state
- [ ] 3.2 Add start / pause-resume / reset behavior (pause stores elapsed offset; resume re-anchors)
- [ ] 3.3 Verify timing stays accurate after background-tab throttling (recompute from wall-clock each tick)

## 4. Player UI (replaces WorkoutTracker)

- [ ] 4.1 Remove `WorkoutTracker.tsx` and `icons.tsx`; scaffold the EMOM player component tree under `src/components/Workouts/`
- [ ] 4.2 Build the glanceable layout: large current-segment countdown, current station (movement / measure / load), next-up, block + rotation progress
- [ ] 4.3 Render each measure type correctly (reps, "10/10" per-side, "12 cal (200m)", plank hold) and visually distinguish work / break / hold segments
- [ ] 4.4 Add workout selection UI backed by the library data
- [ ] 4.5 Wire start / pause / reset controls to the clock hook

## 5. Gym-practical runtime features

- [ ] 5.1 Web Audio transition cues: final-seconds countdown + start-of-segment tone; unlock audio on the start gesture; degrade silently if blocked
- [ ] 5.2 Screen Wake Lock requested while playing, released on pause/stop/complete; feature-detect and no-op if unavailable
- [ ] 5.3 Erg pace line: show per-minute target for `cal` stations that declare `pace`; omit otherwise

## 6. Route, styling, and wiring

- [ ] 6.1 Repurpose `app/workouts/page.tsx` to render the player + library; update metadata title/description to "David Rosen's EMOMs" (keep `path: '/workouts/'`, `createPageMetadata`)
- [ ] 6.2 Replace workout-tracker CSS in `app/styles/` with player styles (large countdown, station cards, pace line, work/break/hold treatments), using existing tokens — no hard-coded colors
- [ ] 6.3 Re-enable and retitle the Projects entry in `src/data/projects.ts` to "David Rosen's EMOMs" → `/workouts/`
- [ ] 6.4 Remove obsolete per-day localStorage read/write paths

## 7. Verification

- [ ] 7.1 `npm run type-check`, `npm run lint`, `npm test`, `npm run build` (static export) all green
- [ ] 7.2 Manual phone check: audio cues fire, screen stays awake, layout is glanceable across a room
- [ ] 7.3 `npm run format` before committing; audit AGENTS.md for any new patterns worth recording
