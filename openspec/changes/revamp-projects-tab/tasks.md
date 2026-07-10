## 1. Data: `src/data/projects.ts`

- [x] 1.1 Remove `preview` and `featured` from the `Project` interface
- [x] 1.2 Rewrite the `desc` for NSS Fleet Demo down to one strong sentence plus a short supporting clause, no em dashes
- [x] 1.3 Rewrite the `desc` for ankibot down to one strong sentence plus a short supporting clause, no em dashes
- [x] 1.4 Rewrite the `desc` for EMOMs down to one strong sentence plus a short supporting clause, removing its em dash and run-on feature list
- [x] 1.5 Remove the `preview: '/images/projects/nss-fleet-demo.png'` line from the NSS Fleet Demo entry
- [x] 1.6 Remove the `linkLabel` overrides ('View demo', 'Try it', 'Open timer') from all three existing entries
- [x] 1.7 Remove `featured: true` from all three existing entries
- [x] 1.8 Add the new Ember entry (title "Ember", subtitle "Personal project", link `https://github.com/AnonUser1035/ember`, date `2026-07-10`, short no-em-dash desc based on its README, `tech: ['Swift', 'macOS', 'Menu Bar App']` adjusted to match existing tag casing/style, no `linkLabel`, no `preview`, no `featured`)
- [x] 1.9 Order the `data` array as: NSS Fleet Demo, ankibot, EMOMs, Ember (this array order is now the page's display order)

## 2. Page: `app/projects/page.tsx`

- [x] 2.1 Remove the `byDateDesc` sort and the `featuredProjects`/`otherProjects` split
- [x] 2.2 Remove the `showGroupLabels` logic and the "Selected Work"/"More Projects" `<h2>` group labels
- [x] 2.3 Render `data` directly as a single ordered `projects-grid` of `Cell` components, using `headingLevel="h2"` for every entry (matching the current no-group-labels behavior)

## 3. Component: `src/components/Projects/Cell.tsx`

- [x] 3.1 Remove the `preview`/`canPreview` destructuring and derived values
- [x] 3.2 Remove `previewRef`, `previewSrc`, `previewVisible`, `visibleRef` state and the `PREVIEW_OFFSET`/`DWELL_MS` constants
- [x] 3.3 Remove the pointer-listener `useEffect` (dwell timer, cursor-follow position math, edge-flip logic)
- [x] 3.4 Remove the `previewNode` JSX block and its render sites in both the internal-link and external-link return branches

## 4. Styles: `app/styles/components/cards.css`

- [x] 4.1 Remove the `.project-preview` rule block and the `.project-preview.is-visible` and `.project-preview img` rules
- [x] 4.2 Remove the `.project-preview` entry from the reduced-motion block
- [x] 4.3 Remove the stale comment referencing `.project-preview` near `.project-record`

## 5. Tests

- [x] 5.1 Remove the "preview paths start with / when present" test from `src/data/__tests__/projects.test.ts`
- [x] 5.2 Remove `preview: '/images/test.jpg'` from the `externalProject` fixture in `src/components/__tests__/Projects/Cell.test.tsx`
- [x] 5.3 Run `npm test` and confirm the full suite passes

## 6. Assets & Cleanup

- [x] 6.1 Delete `public/images/projects/nss-fleet-demo.png`
- [x] 6.2 Delete `public/images/projects/workout-tracker.png`
- [x] 6.3 Grep the repo for `project-preview`, `preview:`, `nss-fleet-demo`, and `workout-tracker` to confirm no remaining references
- [x] 6.4 Run `npm run format`, `npm run lint`, `npm run type-check`, and `npm run build` before opening the PR
