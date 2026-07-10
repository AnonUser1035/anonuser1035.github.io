## Why

Ryan dislikes the small oval/pill tags currently shown on the site: the tech-stack pills under each project card, and the three credential pills ("Johns Hopkins '27", "Neurotech Founder", "Volunteer EMT") under the homepage hero tagline. Both should come out.

## What Changes

- **BREAKING** (internal data shape): Remove the `tech` field from the `Project` type and from all four entries in `src/data/projects.ts`; stop rendering the tech-tag pill list in `src/components/Projects/Cell.tsx`, and remove the associated `.tech-tag`/`.project-record-tech` CSS.
- Remove the `hero-chips` block (the three credential pills) from `src/components/Template/Hero.tsx`, and remove the associated `.hero-chips`/`.hero-chip` CSS (including its mobile and dark-mode overrides).
- No replacement visual is introduced for either — this is a straight removal to a plainer, text-only presentation, matching the minimal direction already taken on the Projects page.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `projects-listing`: adds a requirement that project entries no longer display a tech-stack tag list (extends the capability introduced in the still-unarchived `revamp-projects-tab` change).
- `homepage-hero`: introduces this capability's spec for the first time (no prior spec file exists in `openspec/specs/`), capturing that the hero section shows no credential pills below the tagline.

## Impact

- **Data**: `src/data/projects.ts` — drop `tech` from the `Project` interface and all four entries.
- **Components**: `src/components/Projects/Cell.tsx` (remove the tech-tag `<ul>` render block), `src/components/Template/Hero.tsx` (remove the `hero-chips` div and its three chip spans).
- **Styles**: `app/styles/components/tags.css` (remove `.tech-tag` and its hover rule), `app/styles/components/cards.css` (remove `.project-record-tech`), `app/styles/pages/home.css` (remove `.hero-chips`, `.hero-chip`, `.hero-chip:hover`, and the mobile-breakpoint overrides for both), `app/styles/dark-mode.css` (remove the `.hero-chip` dark override).
- **Tests**: `src/components/__tests__/Projects/Cell.test.tsx` (drop the tech fixture field and its assertion), `src/data/__tests__/projects.test.ts` (drop the "tech is an array when present" test), `src/components/__tests__/Template/Hero.test.tsx` (drop the "displays hero chips for credentials" test).
- **Unaffected**: `.skill-tag`/`.skill-tags` (Skills page pills — a separate, unrelated component the user did not mention), the hero tagline prose itself (including the phrase "Volunteer EMT" inside the sentence, which is not a chip and stays).
