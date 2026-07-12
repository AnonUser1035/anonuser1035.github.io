# Spec: Site Navigation

## ADDED Requirements

### Requirement: Single header with section anchor links
The site SHALL have exactly one navigation surface: the fixed site header. It SHALL contain the logo (linking to `/`), anchor links to the homepage sections Experience, Publications, Education, and Projects (in that order, matching page order), the theme toggle, and the hamburger button (mobile widths only). No secondary navigation bar (ResumeNav) SHALL render.

#### Scenario: Header links scroll to sections on the homepage
- **WHEN** a visitor on `/` clicks a header section link
- **THEN** the page smooth-scrolls to that section, landing below the fixed header (scroll-margin offset), without a route change

#### Scenario: Header links work from non-home pages
- **WHEN** a visitor on the 404 page or a redirect stub clicks a header section link
- **THEN** the browser navigates to `/#<section>` and lands on that section

### Requirement: Scroll-spy highlights the active section
On `/`, the header SHALL highlight the section link whose section is currently most visible, using IntersectionObserver logic equivalent to the previous ResumeNav (highest intersection ratio, closest-to-top fallback, bottom-of-page fallback to the last section), and SHALL set `aria-current="location"` on the active link.

#### Scenario: Scrolling updates the active link
- **WHEN** the visitor scrolls from the Experience section into the Publications section
- **THEN** the Publications header link gains the active style and `aria-current="location"`, and Experience loses it

#### Scenario: No active section off the homepage
- **WHEN** the visitor is on any path other than `/`
- **THEN** no header section link is marked active

### Requirement: Hamburger slide menu mirrors the header sections
Below the mobile breakpoint the inline links SHALL hide and the hamburger button SHALL show. The slide menu SHALL list Home plus the same four section links (same source data, same order), close on link tap, and retain its existing accessibility behavior (focus trap, Escape, overlay tap, scroll lock).

#### Scenario: Section link tapped in slide menu
- **WHEN** a visitor opens the hamburger menu and taps Education
- **THEN** the menu closes and the page scrolls to `#education`

### Requirement: Mobile breakpoint at 900px
The header SHALL show inline section links at viewport widths of 900px and above, and the hamburger below 900px. Content-layout breakpoints elsewhere SHALL be unchanged.

#### Scenario: Mid-width viewport
- **WHEN** the viewport is 800px wide
- **THEN** the hamburger is shown and the inline links are hidden

### Requirement: Single source of section data
Header links, slide-menu links, and scroll-spy targets SHALL derive from one shared ordered sections list so labels, ids, and order cannot drift.

#### Scenario: Section list drives all surfaces
- **WHEN** a section entry is reordered in the sections data
- **THEN** the header, slide menu, and scroll-spy all reflect the new order with no other edits
