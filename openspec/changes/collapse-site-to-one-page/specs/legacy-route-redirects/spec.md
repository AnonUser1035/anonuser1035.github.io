# Spec: Legacy Route Redirects

## ADDED Requirements

### Requirement: Old routes redirect to homepage sections

`/projects/` and `/publications/` SHALL remain buildable routes that render minimal stubs whose `<head>` contains a zero-delay meta refresh to `/#projects` and `/#publications` respectively, plus a visible fallback link to the same target.

#### Scenario: Visitor follows an old projects link

- **WHEN** a browser loads `/projects/`
- **THEN** it is redirected via meta refresh to `/#projects` and lands on the Projects section

#### Scenario: Meta refresh unavailable

- **WHEN** the meta refresh does not fire
- **THEN** the stub page shows a visible link the visitor can click to reach the homepage section

### Requirement: Stubs excluded from search

The redirect stubs SHALL declare `robots` noindex metadata, and `app/sitemap.ts` SHALL list only the homepage.

#### Scenario: Sitemap contains a single URL

- **WHEN** the sitemap is generated
- **THEN** it contains exactly one entry, the site root URL

### Requirement: Route-change scrolling respects hashes

The global scroll-to-top-on-route-change behavior SHALL NOT fire when the destination URL includes a fragment, so `/#<section>` navigations land on the section.

#### Scenario: Navigating home with a fragment

- **WHEN** a visitor navigates from the 404 page to `/#education`
- **THEN** the viewport ends on the Education section, not the top of the page
