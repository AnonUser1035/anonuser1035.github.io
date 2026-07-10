## ADDED Requirements

### Requirement: No Tech Tag Pills

Project entries SHALL NOT display a tech-stack tag list.

#### Scenario: Project card renders with no tech tags

- **WHEN** the Projects page renders a project entry
- **THEN** no pill-style tech tag elements appear anywhere in that entry, regardless of whether the underlying data previously had a tech stack list
