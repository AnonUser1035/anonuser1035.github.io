## ADDED Requirements

### Requirement: Homepage presents a single narrative page

The homepage (`/`) SHALL present Hero, Experience, Education, Skills, and Contact as sections of one continuous scrolling page, in that order, rather than as separate routes.

#### Scenario: Visiting the homepage shows all narrative sections

- **WHEN** a user navigates to `/`
- **THEN** the page renders Hero, then Experience, then Education, then Skills, then Contact sections in that order, each identifiable by a stable anchor id (`#experience`, `#education`, `#skills`, `#contact`)

#### Scenario: Resume and contact content is reused, not rebuilt

- **WHEN** the homepage renders the Experience, Education, Skills, and Contact sections
- **THEN** it uses the existing `Experience`, `Education`, `Skills`, and contact components and their existing data sources (`resume/work.ts`, `resume/degrees.ts`, `resume/skills.ts`, `contact.ts`) without altering their underlying data shape

### Requirement: Hero section conveys personal/intangible framing

The Hero section SHALL be written to introduce the person (bio, philosophy, personality) rather than functioning only as a title/role banner.

#### Scenario: Hero precedes tangible resume content

- **WHEN** a user loads the homepage
- **THEN** the Hero section appears above Experience and reads as introductory/personal copy, distinct from the factual Experience/Education/Skills sections below it

### Requirement: Floating scroll-spy navigation on the homepage

The homepage SHALL provide a floating in-page navigation that highlights the section currently in view, covering Experience, Education, Skills, and Contact, using the existing IntersectionObserver-based active-section pattern.

#### Scenario: Active section updates while scrolling

- **WHEN** a user scrolls the homepage so that a given section (e.g. Skills) is the most visible in the viewport
- **THEN** the floating nav marks that section's link as active (`aria-current="location"` and an active style), and no other section link is marked active

#### Scenario: Clicking a nav link jumps to its section

- **WHEN** a user clicks a floating nav link for a section
- **THEN** the page scrolls to that section's anchor id

### Requirement: Standalone routes remain unaffected

The `/projects` and `/publications` routes, the top-level hamburger/mobile navigation, and the theme toggle SHALL remain unchanged in behavior by this change.

#### Scenario: Projects and Publications still work as separate pages

- **WHEN** a user navigates to `/projects` or `/publications`
- **THEN** each renders as its own standalone route, independent of the homepage's section content

### Requirement: Standalone Resume and Contact routes are removed

The `/resume` and `/contact` routes SHALL no longer exist as separate pages once their content is merged into the homepage. No redirect is provided in this change.

#### Scenario: Former resume and contact URLs are no longer routes

- **WHEN** a user navigates to `/resume` or `/contact`
- **THEN** no dedicated route exists for that path (the static export produces no page for it); links to those URLs should be updated to `/#experience` (or `/`) and `/#contact` respectively, or to the downloadable résumé PDF
