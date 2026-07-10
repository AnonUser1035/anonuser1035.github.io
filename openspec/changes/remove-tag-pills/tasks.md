## 1. Data: `src/data/projects.ts`

- [x] 1.1 Remove `tech` from the `Project` interface
- [x] 1.2 Remove the `tech: [...]` line from all four project entries

## 2. Component: `src/components/Projects/Cell.tsx`

- [x] 2.1 Remove `tech` from the destructured `data` fields
- [x] 2.2 Remove the `<ul className="project-record-tech">` tech-tag render block, leaving `project-record-meta` wrapping just the action label

## 3. Component: `src/components/Template/Hero.tsx`

- [x] 3.1 Remove the `<div className="hero-chips">...</div>` block (the three `hero-chip` spans), leaving the tagline paragraph and CTA row untouched

## 4. Styles

- [x] 4.1 Remove `.tech-tag` and the `.project-record--link:hover .tech-tag, .project-record--link:focus-visible .tech-tag` rule from `app/styles/components/tags.css`
- [x] 4.2 Remove `.project-record-tech` from `app/styles/components/cards.css`
- [x] 4.3 Remove `.hero-chips`, `.hero-chip`, `.hero-chip:hover`, and their mobile-breakpoint overrides from `app/styles/pages/home.css`
- [x] 4.4 Remove the `[data-theme='dark'] .hero-chip` rule from `app/styles/dark-mode.css` and the duplicate `[data-theme='dark'] .hero-chip` rule in `app/styles/pages/home.css`

## 5. Tests

- [x] 5.1 Remove `tech: ['TypeScript']` from the `externalProject` fixture in `src/components/__tests__/Projects/Cell.test.tsx` and drop the `TypeScript` tech-tag assertion from its "defaults the action verb..." test
- [x] 5.2 Remove the "tech is an array when present" test from `src/data/__tests__/projects.test.ts`
- [x] 5.3 Remove the "displays hero chips for credentials" test from `src/components/__tests__/Template/Hero.test.tsx`
- [x] 5.4 Run `npm test` and confirm the full suite passes

## 6. Verification

- [x] 6.1 Grep the repo for `tech-tag`, `project-record-tech`, `hero-chip`, and `hero-chips` to confirm no remaining references
- [x] 6.2 Run `npm run format`, `npm run lint`, `npm run type-check`, and `npm run build`
