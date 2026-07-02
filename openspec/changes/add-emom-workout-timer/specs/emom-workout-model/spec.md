## ADDED Requirements

### Requirement: EMOM authoring grammar

The system SHALL represent an EMOM workout as an ordered list of blocks, where each block defines a `duration` in minutes, a default `interval` in seconds (the length of one station's turn, typically 60), an ordered list of `stations` rotated one per interval, and an optional ordered list of trailing `then` segments (breaks and holds). Each station SHALL declare a `movement` name and exactly one tagged `measure`, and MAY declare a `load`, an `interval` override (in seconds), and a `pace` target expressed per 60 seconds.

The tagged `measure` MUST be exactly one of: `reps` (a whole count), `perSide` (a whole count performed on each side, e.g. "10/10"), `cal` (a machine calorie count, optionally with an equivalent `meters` distance), or `holdSec` (a static hold in seconds, e.g. a plank).

#### Scenario: Block with rep and calorie stations

- **WHEN** a block declares `duration: 10`, `interval: 60`, and stations `[{ movement: "front squat", load: "45 lb", measure: reps 10 }, { movement: "row", measure: cal 12 meters 200 }]`
- **THEN** the model is valid and describes a two-station rotation with a default 60-second interval

#### Scenario: Per-side and hold measures

- **WHEN** a station declares `measure: perSide 10` and another declares `measure: holdSec 50`
- **THEN** both are valid measures, the per-side station represents 10 reps on each side, and the hold station represents a 50-second static hold with no rep count

#### Scenario: Per-station interval override

- **WHEN** a block has default `interval: 60` and one station declares its own `interval: 90`
- **THEN** that station's turn lasts 90 seconds while other stations use the 60-second default

### Requirement: Expansion to a flat segment timeline

The system SHALL provide a pure `expand()` function that transforms a workout's authoring model into an ordered list of runtime segments with no dependency on wall-clock time or randomness. Each `Segment` SHALL carry its type (`work`, `break`, or `hold`), its duration in seconds, and — for `work` and `hold` segments — the source station (movement, measure, load, pace) so the runtime can render it without re-reading the authoring model.

Given identical input, `expand()` SHALL always produce identical output.

#### Scenario: Clean rotation expands to whole rounds

- **WHEN** `expand()` receives a 10-minute block with two 60-second stations `[A, B]`
- **THEN** it emits 10 work segments in the order A, B, A, B, A, B, A, B, A, B (5 complete rounds), each 60 seconds long

#### Scenario: Trailing segments follow the rotation

- **WHEN** a block's `then` list is `[break 60s, hold "plank" 50s]`
- **THEN** `expand()` emits the block's work segments first, then a 60-second `break` segment, then a 50-second `hold` segment carrying the plank station

#### Scenario: Whole workout expands across blocks

- **WHEN** `expand()` receives a workout with multiple blocks
- **THEN** it emits each block's segments in order, block after block, producing one continuous timeline for the entire workout

### Requirement: Partial final rounds run to the clock

When a block's `duration` is not a whole multiple of its rotation length, `expand()` SHALL fill the block up to its exact `duration` by continuing the rotation from the next station, and SHALL stop at the block's duration even if that leaves the final round incomplete (Option A: run to the clock). `expand()` SHALL NOT pad the block with extra rest to complete a round, and SHALL NOT drop the leftover time.

#### Scenario: Three stations across ten minutes

- **WHEN** `expand()` receives a 10-minute block with three 60-second stations `[A, B, C]`
- **THEN** it emits 10 work segments in the order A, B, C, A, B, C, A, B, C, A (three complete rounds plus one leftover minute continuing with station A), and the block ends after the 10th segment

#### Scenario: Mixed-interval block respects the duration boundary

- **WHEN** a block's rotation totals more time than the remaining duration allows for a full turn
- **THEN** `expand()` includes stations in rotation order only while whole station turns fit within the block's `duration`, and does not emit a partial-length segment that would exceed the block boundary

### Requirement: Data-driven workout library

The system SHALL source all workouts from data so that adding, editing, or removing a workout requires only data changes and no component or engine changes. The library SHALL include the owner's seeded "EMOM 30" workout expressed entirely in the authoring grammar.

#### Scenario: Seeded EMOM 30 is present

- **WHEN** the workout library loads
- **THEN** it includes an "EMOM 30" workout composed of three 10-minute blocks whose stations, loads, measures, breaks, and plank hold match the owner's prescription

#### Scenario: Adding a workout is data-only

- **WHEN** a new EMOM workout is added to the library data
- **THEN** it becomes selectable and playable with no changes to the timer components or the `expand()` function
