# Tasks: Nav Initial Active State and Logo Hover

## 1. No active tab until a section is reached

- [x] 1.1 In `src/hooks/useScrollSpy.ts`, initialize `activeSection` to `null` and remove the `setActiveSection(sectionIds[0])` seed in the effect
- [x] 1.2 Add an "in hero" guard at the top of the observer callback: if the first section's `getBoundingClientRect().top > window.innerHeight * 0.2`, set active `null` and return; otherwise keep existing highest-ratio/closest logic
- [x] 1.3 Update `src/hooks/__tests__/useScrollSpy.test.tsx`: initial value is `null`; the "no scrollable content" case stays `null`; keep the bottom-scroll test (last section active at bottom)
- [x] 1.4 Update `src/components/__tests__/Template/Navigation.test.tsx` if it asserts a section active on load (expect none active at scroll 0)

## 2. Logo fills blue only on hover/focus

- [x] 2.1 In `app/styles/layout/navigation.css`, remove the `.site-logo.active` solid-fill rules (and `.active .logo-text`, `.active:hover/.active:focus-visible`) so `.active` no longer changes appearance
- [x] 2.2 Give `.site-logo:hover, .site-logo:focus-visible` the solid accent fill + accent border, and set `.logo-text` to `var(--color-bg)` on hover/focus

## 3. Verification

- [x] 3.1 Run `npm test`, `npm run type-check`, `npm run lint`, `npm run format`
- [x] 3.2 Run `npm run build`; headless-Chrome check: no section tab active at scroll 0, correct tab active after scrolling into it and at the bottom; logo unfilled at rest, filled on hover
- [x] 3.3 Commit on `dev` and push
