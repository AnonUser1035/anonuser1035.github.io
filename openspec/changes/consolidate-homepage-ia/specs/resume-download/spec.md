## ADDED Requirements

### Requirement: Downloadable résumé PDF

The homepage SHALL offer a downloadable, static PDF résumé as the shareable/printable résumé artifact, in place of a live `/resume` HTML route.

#### Scenario: User downloads the résumé from the homepage

- **WHEN** a user clicks the "Download Résumé" link near the Hero section
- **THEN** the browser downloads or opens a static PDF file containing Ryan's most recent résumé

#### Scenario: Résumé PDF is a static asset, not a generated page

- **WHEN** the site is built via static export
- **THEN** the résumé PDF exists as a static file under `public/` and is served at a stable URL (e.g. `/resume.pdf`), requiring no server-side rendering or print stylesheet
