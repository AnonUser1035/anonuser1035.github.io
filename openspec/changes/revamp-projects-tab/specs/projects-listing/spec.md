## ADDED Requirements

### Requirement: Curated Display Order

The Projects page SHALL display project entries in the fixed order defined by their position in the source data array, not derived from any field such as publish date.

#### Scenario: Entries render in array order

- **WHEN** the Projects page renders the project listing
- **THEN** entries appear in the same order they are defined in the source data, regardless of each entry's `date` value

### Requirement: Single Flat Listing

The Projects page SHALL render all project entries in one ungrouped listing with no sub-section headings splitting entries into tiers.

#### Scenario: No group labels shown

- **WHEN** the Projects page renders
- **THEN** no "Selected Work" / "More Projects" (or equivalent tiering) heading appears, and every project entry appears in a single grid

### Requirement: Consistent Link Action Label

Every project entry with a link SHALL present the same default action label and affordance for its link type, with no per-entry custom wording.

#### Scenario: External project link shows the default label

- **WHEN** a project entry has an external link and does not specify a custom label
- **THEN** its action affordance displays the component's default external-link label ("Visit") consistently with every other external project entry

### Requirement: No Screenshot Preview

Project entries SHALL NOT show a cursor-following or hover-triggered screenshot/thumbnail preview.

#### Scenario: Hovering a project entry shows no preview

- **WHEN** a pointer hovers over a project entry that has a link
- **THEN** no preview image or thumbnail appears near the cursor, regardless of how long the pointer rests
