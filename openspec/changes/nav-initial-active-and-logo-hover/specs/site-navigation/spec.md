# Spec: Site Navigation

## ADDED Requirements

### Requirement: No section tab is active while the hero is in view

On the homepage, when the visitor has not yet scrolled to any section (the hero occupies the top of the viewport), NO header or hamburger section tab SHALL be marked active. A section tab SHALL become active only once its section has scrolled up to the activation region, and SHALL return to none-active when the visitor scrolls back to the hero. The last section SHALL still be active at the bottom of the page.

#### Scenario: Nothing highlighted on load

- **WHEN** the homepage loads at scroll position 0
- **THEN** no section tab (Experience, Publications, Education, Projects) is marked active or `aria-current`

#### Scenario: Section activates after scrolling to it

- **WHEN** the visitor scrolls until the Experience section reaches the activation region
- **THEN** the Experience tab becomes active, and it clears again if the visitor scrolls back to the top

### Requirement: Wordmark logo highlights only on hover or focus

The wordmark logo SHALL render as its default (unfilled) plate at rest on all pages, including the homepage, and SHALL show the solid accent fill with inverted text only on hover or keyboard focus. The logo SHALL retain `aria-current="page"` on the homepage for assistive technology even though it is not visually filled.

#### Scenario: Logo not filled at rest on the homepage

- **WHEN** the homepage is at rest with no pointer or focus on the logo
- **THEN** the wordmark is not filled with the accent color, and it still exposes `aria-current="page"`

#### Scenario: Logo fills on hover/focus

- **WHEN** the logo is hovered or focused via keyboard
- **THEN** it fills with the accent color and its text switches to the inverted (background) color
