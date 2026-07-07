## ADDED Requirements

### Requirement: Shared, identity-free counter

The system SHALL track workout completions as a single global count per calendar day, with no per-user, per-device, or per-session distinction. There SHALL be no accounts, login, or client-side identity of any kind.

#### Scenario: Two different visitors both see the same count

- **WHEN** two different people (different devices, different browsers) view the heatmap on the same day
- **THEN** they see identical counts for every day shown — the data is not personalized

### Requirement: Completion-triggered check-in

A check-in SHALL be recorded only when a workout's full segment timeline completes (the running clock reaches the end of its last segment), and SHALL be recorded exactly once per completed run.

#### Scenario: Finishing a workout records one check-in

- **WHEN** a visitor plays a workout from start to finish without resetting
- **THEN** exactly one check-in is recorded for that completion

#### Scenario: Abandoning a workout records nothing

- **WHEN** a visitor starts a workout and closes the tab or resets before the final segment elapses
- **THEN** no check-in is recorded

### Requirement: Fixed-timezone day bucketing

The system SHALL compute which calendar day a check-in belongs to using a single fixed, server-side timezone, regardless of the visitor's location or any client-supplied timestamp.

#### Scenario: Same day for every visitor regardless of location

- **WHEN** visitors in different timezones complete workouts within the same fixed-timezone calendar day
- **THEN** their check-ins are attributed to the same day bucket and the rendered grid is identical for all viewers

### Requirement: Past-month heatmap display

The system SHALL display a calendar-style grid of the most recent 30 days, showing each day's check-in count, including days with a count of zero.

#### Scenario: A day with no activity still appears

- **WHEN** a day in the past-month window had zero completions
- **THEN** that day still renders in the grid as an explicit zero, not a gap

#### Scenario: A day with several completions renders with higher intensity

- **WHEN** a day has a higher check-in count than another day in the window
- **THEN** its cell is visually distinguishable as more active (e.g. higher color intensity) than the lower-count day

### Requirement: Isolated backend infrastructure

The check-in and heatmap-read endpoints SHALL be served by a Cloudflare Worker and D1 database dedicated to this app, with no shared bindings, tables, or deployment with any other product's backend.

#### Scenario: Independent of other products' infrastructure

- **WHEN** another product's Worker or database (e.g. ankibot's) is redeployed, scaled, or experiences an outage
- **THEN** the EMOM check-in and heatmap endpoints are unaffected
