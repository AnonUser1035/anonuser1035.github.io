## MODIFIED Requirements

### Requirement: Downloadable résumé PDF

The homepage SHALL offer a downloadable, static PDF résumé as the shareable/printable résumé artifact, in place of a live `/resume` HTML route. A real file SHALL exist at the linked path; a wired-but-missing link does not satisfy this requirement.

#### Scenario: User downloads the résumé from the homepage

- **WHEN** a user clicks the "Download Résumé" link near the Hero section
- **THEN** the browser downloads a static PDF file at `/resume.pdf` containing Ryan's résumé (which may be an acceptable placeholder even if not perfectly current)

#### Scenario: Résumé PDF is a static asset, not a generated page

- **WHEN** the site is built via static export
- **THEN** the résumé PDF exists as a static file under `public/` and is served at a stable URL (`/resume.pdf`), requiring no server-side rendering or print stylesheet
