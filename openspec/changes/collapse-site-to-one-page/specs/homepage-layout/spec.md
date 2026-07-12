# Spec: Homepage Layout

## ADDED Requirements

### Requirement: One-page section order

The homepage SHALL contain all site content as sections in this order: Hero, `#experience` (Experience), `#publications` (Publications and Presentations), `#education` (Education), `#projects` (Projects grid). No standalone Skills or Contact section SHALL render.

#### Scenario: Homepage renders all sections in order

- **WHEN** a visitor loads `/`
- **THEN** the sections appear in the order Hero, Experience, Publications, Education, Projects, each with the id matching its header anchor

#### Scenario: Skills section absent

- **WHEN** a visitor loads `/`
- **THEN** no Skills section or `#skills` anchor target exists on the page

### Requirement: Hero contains contact and resume actions

The Hero SHALL contain the Download Résumé button (linking to `/resume.pdf`), the email link, the "Usually respond within 24 hours" hint, and the contact icons. No link to a `#contact` anchor SHALL remain anywhere on the site.

#### Scenario: Contact reachable without scrolling past sections

- **WHEN** a visitor loads `/`
- **THEN** the email link, contact icons, and resume download are visible within the Hero, above the Experience section

### Requirement: Re-homed sections keep content and demote headings

The Publications section SHALL render the same grouped lists (Publications, then Presentations) as the former `/publications` page, and the Projects section the same curated Cell grid as the former `/projects` page, with headings demoted one level (section titles h2, group labels and card titles h3) to fit the single-page outline.

#### Scenario: Publications content preserved

- **WHEN** a visitor views `#publications` on the homepage
- **THEN** every publication and presentation from the former standalone page is present, grouped identically

#### Scenario: Projects content preserved

- **WHEN** a visitor views `#projects` on the homepage
- **THEN** every project card from the former standalone page is present in the same curated order, with working external links
