## ADDED Requirements

### Requirement: Standalone deployment

The EMOM timer SHALL be served from its own repository and its own custom subdomain, independent of the personal site's repository, deployment pipeline, and availability.

#### Scenario: App loads independently of the personal site

- **WHEN** a visitor navigates directly to the EMOMs subdomain
- **THEN** the timer app loads and functions fully, with no dependency on ryanbohluli.com being reachable

### Requirement: Distinct visual identity

The EMOM timer app SHALL use its own visual brand (color palette, typography) and SHALL NOT reuse the personal site's design tokens.

#### Scenario: Visual comparison against the personal site

- **WHEN** the EMOMs app and the personal site are viewed side by side
- **THEN** their color palettes and typography are visibly distinct systems, not the same tokens re-skinned

### Requirement: Timer feature parity

The ported app SHALL preserve the existing timer behavior: the block/rotation authoring model, the pure Block-to-Segment expansion/compiler, the timestamp-anchored interval clock, audio cues, screen wake lock during playback, and the glanceable running-workout UI (current segment countdown, current/next station, progress through the workout, and visual distinction between work/break/hold segments).

#### Scenario: EMOM 30 runs identically to the pre-port implementation

- **WHEN** the seeded "EMOM 30" workout is played end-to-end in the new app
- **THEN** the segment sequence, durations, and automatic transitions match the original `/workouts` implementation's behavior

#### Scenario: Screen stays awake during playback

- **WHEN** a workout is running
- **THEN** the device screen does not sleep, and the wake lock is released once the workout stops or completes

### Requirement: Personal site decommission

The personal site SHALL no longer serve a `/workouts` route once the standalone app is live, and its Projects listing SHALL link to the new app instead.

#### Scenario: Old route is gone

- **WHEN** a visitor requests `/workouts` on the personal site after this change ships
- **THEN** they receive the site's standard not-found page, not a redirect and not the old timer

#### Scenario: Projects entry points to the new app

- **WHEN** a visitor views the "David Rosen's EMOMs" entry on the Projects page
- **THEN** it links externally to the standalone app's subdomain and opens in a new tab
