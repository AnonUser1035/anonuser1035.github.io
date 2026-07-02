## ADDED Requirements

### Requirement: Retire the checklist workout tracker

The system SHALL remove the day-of-week checklist workout tracker previously served at `/workouts`, including its weekly-plan data model, tap-to-check-off UI, and per-day localStorage progress. The `/workouts` route SHALL instead serve the EMOM timer experience titled "David Rosen's EMOMs".

**Reason**: The checklist model has no time dimension and cannot express EMOM training, which is time-driven.

**Migration**: No data migration is required. Prior per-day set-completion state in localStorage is obsolete and MAY be ignored or cleared; it is not read by the new experience.

#### Scenario: Visiting the workouts route

- **WHEN** a visitor opens `/workouts`
- **THEN** they see the "David Rosen's EMOMs" timer experience, not a day-of-week set-checklist

#### Scenario: Projects entry re-enabled

- **WHEN** the Projects listing renders
- **THEN** it includes an entry titled "David Rosen's EMOMs" linking to `/workouts/`

### Requirement: Interval clock playback

The system SHALL play the expanded `Segment[]` timeline on an interval clock that advances segment by segment, showing a countdown of the time remaining in the current segment and automatically transitioning to the next segment when the current one elapses. The clock SHALL keep accurate elapsed time even when the browser throttles timers (e.g. by anchoring to a timestamp rather than accumulating tick deltas).

#### Scenario: Segment countdown and auto-advance

- **WHEN** a 60-second work segment is playing and reaches 0
- **THEN** the clock automatically advances to the next segment and begins its countdown

#### Scenario: End of workout

- **WHEN** the final segment of the timeline elapses
- **THEN** the clock stops and the UI indicates the workout is complete

#### Scenario: Timing stays accurate under throttling

- **WHEN** the tab is backgrounded or the timer is throttled during a segment
- **THEN** on the next tick the displayed remaining time reflects real elapsed wall-clock time rather than drifting behind

### Requirement: Glanceable player UI

The system SHALL present the running workout in a large, glanceable layout readable at a distance. It SHALL prominently display the current segment's remaining time, the current station (movement, measure, and load when present), and the next station or segment. It SHALL indicate progress through the workout (current block and position within the rotation), and SHALL visually distinguish `work`, `break`, and `hold` segments.

#### Scenario: Work segment display

- **WHEN** a work segment for "front squat, 10 reps, 45 lb" is playing
- **THEN** the UI shows the large countdown, the movement name, "10 reps", the "45 lb" load, and what comes next

#### Scenario: Break and hold segments are visually distinct

- **WHEN** the timeline reaches a `break` segment and later a `hold` segment
- **THEN** each is rendered with a visually distinct treatment from work segments, and the hold shows its movement and hold duration

### Requirement: Playback controls

The system SHALL provide start, pause/resume, and reset controls. Starting SHALL begin the selected workout's timeline from its first segment. Pausing SHALL freeze the countdown; resuming SHALL continue from the same point. Resetting SHALL return the timeline to its first segment in a stopped state.

#### Scenario: Pause and resume

- **WHEN** the user pauses mid-segment and later resumes
- **THEN** the countdown continues from the exact remaining time at which it was paused

#### Scenario: Reset

- **WHEN** the user resets
- **THEN** playback stops and the timeline returns to the first segment without auto-starting

### Requirement: Audio transition cues

The system SHALL emit audible cues at segment transitions (for example, a countdown of the final seconds and a distinct start-of-segment tone) so the user can train without watching the screen. Because browsers require a user gesture to enable audio, the system SHALL unlock audio on the start interaction and SHALL degrade gracefully (remaining fully functional visually) if audio is unavailable or blocked.

#### Scenario: Cue at the top of each interval

- **WHEN** a new work segment begins
- **THEN** an audible start cue plays, preceded by a short countdown cue in the final seconds of the previous segment

#### Scenario: Audio blocked

- **WHEN** the browser blocks or does not support audio playback
- **THEN** the timer continues to run and display correctly with no error surfaced to the user

### Requirement: Screen wake lock during playback

The system SHALL request a Screen Wake Lock while a workout is actively playing so the display does not sleep mid-workout, and SHALL release the lock when playback stops, completes, or is paused. If the Wake Lock API is unavailable, the timer SHALL continue to function normally.

#### Scenario: Screen stays awake while running

- **WHEN** a workout is actively playing on a supporting device
- **THEN** the screen is kept awake for the duration of playback

#### Scenario: Lock released when not running

- **WHEN** playback is paused, reset, or completes
- **THEN** the wake lock is released so the screen may sleep normally

### Requirement: Erg pace line

For stations whose measure is `cal` (optionally with `meters`) and that declare a `pace` target, the system SHALL display a per-minute pacing target (for example, "hold ≥18 cal/min") during that station's work segment. Stations without a `pace` target SHALL simply omit the pace line.

#### Scenario: Calorie station with a pace target

- **WHEN** a rowing station with `measure: cal 12 meters 200` and a per-minute `pace` target is playing
- **THEN** the UI shows the target rate as a pace line alongside the countdown

#### Scenario: Station without a pace target

- **WHEN** a work segment's station has no `pace` target
- **THEN** no pace line is shown and the rest of the display is unaffected
