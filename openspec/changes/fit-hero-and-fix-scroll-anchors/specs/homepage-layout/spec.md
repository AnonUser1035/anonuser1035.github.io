# Spec: Homepage Layout

## ADDED Requirements

### Requirement: Hero fits the first viewport

The hero SHALL be bounded to the first screen (`min-height` of the viewport minus the fixed header height) with its content vertically centered, so that on common laptop, desktop, and mobile viewports the avatar, name, tagline, résumé button, and the full contact block (email, response hint, social icons) are all visible without scrolling. The hero's internal spacing SHALL scale with viewport height so the content compresses to fit shorter screens rather than overflowing, down to a documented floor below which normal scrolling is acceptable.

#### Scenario: Contact visible at first glance on a laptop

- **WHEN** the homepage loads on a ~1280×720 viewport
- **THEN** the résumé button and the contact block (email, hint, social icons) are visible without scrolling

#### Scenario: Hero content order and copy unchanged

- **WHEN** the hero renders
- **THEN** it shows the same elements in the same order (avatar, name, tagline, résumé button, contact block) with unchanged wording

#### Scenario: Graceful fallback on very short viewports

- **WHEN** the viewport is shorter than the documented floor
- **THEN** the hero may exceed the viewport and scroll normally, with content remaining legible (no crushed or clipped elements)

### Requirement: Anchor links land just below the header

In-page anchor navigation SHALL land the target section just beneath the fixed header with only a small intentional breathing gap, on both desktop and mobile header heights. There SHALL NOT be a large empty band above the landed section heading, and the header offset SHALL NOT be double-counted.

#### Scenario: Section anchor lands cleanly

- **WHEN** a visitor activates a header or hamburger section link (e.g. Education)
- **THEN** the section heading rests just below the header with a small gap, not a ~6rem void

#### Scenario: Correct on mobile header height

- **WHEN** the same anchor is activated at a mobile viewport width
- **THEN** the landing clears the shorter mobile header with the same small gap, not the desktop offset
