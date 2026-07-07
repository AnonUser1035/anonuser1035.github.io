## ADDED Requirements

### Requirement: Homepage does not duplicate top-level navigation

The homepage SHALL NOT include an in-page directory/navigation block whose sole purpose is linking to destinations already reachable from the top-level navigation (hamburger menu and nav bar).

#### Scenario: No redundant Projects/Publications directory block

- **WHEN** a user loads the homepage
- **THEN** there is no standalone "Projects / Publications" directory list on the page; those destinations remain reachable only via the top-level navigation

### Requirement: Resume section content avoids em dashes

Experience and Education content (job summaries, degree descriptions) rendered in the homepage's resume section SHALL NOT use em dashes; use commas or parentheses instead.

#### Scenario: Resume summaries and degree lines contain no em dash

- **WHEN** the homepage renders Experience and Education content
- **THEN** the rendered summary and degree text contains no em dash character

### Requirement: Resume section headings use a moderate heading scale

The Experience/Education/Skills/Contact section headings on the homepage SHALL use a heading size appropriate for multiple headings appearing in one continuous scroll, rather than the larger size suited to a single standalone heading.

#### Scenario: Section headings are not oversized

- **WHEN** a user views the homepage's Experience, Education, Skills, or Contact section heading
- **THEN** the heading renders at the `--text-2xl` size token rather than `--text-3xl`
