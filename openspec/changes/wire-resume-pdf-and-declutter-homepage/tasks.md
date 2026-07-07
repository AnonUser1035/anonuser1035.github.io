## 1. Wire the résumé PDF

- [x] 1.1 Copy `/Users/ryan/Projects/General/Applications/General/Ryan Bohluli Resume.pdf` to `public/resume.pdf`
- [x] 1.2 Confirm the Hero "Download Résumé" link (already pointing at `/resume.pdf`) now resolves to a real file in a dev/build check

## 2. Remove the inline Projects/Publications directory

- [x] 2.1 Remove the `home-directory` nav block from `app/page.tsx`
- [x] 2.2 Remove the now-unused `destinations` array from `app/page.tsx`
- [x] 2.3 Remove the now-unused `Link` import from `app/page.tsx` (verified nothing else in the file needs it)
- [x] 2.4 Confirm Projects and Publications remain reachable via the top nav/hamburger (no regression) — also removed the now-dead `.home-directory`/`.directory-*` CSS from `home.css`

## 3. Remove remaining em dashes in resume content

- [x] 3.1 Rewrite the em dash in `src/data/resume/work.ts`'s Neuro Safety Systems summary
- [x] 3.2 Rewrite the em dash in `src/data/resume/degrees.ts`'s JHU degree line
- [x] 3.3 Rewrite the em dash in `src/data/resume/degrees.ts`'s high school degree line
- [x] 3.4 Rewrite the em dash in `app/page.tsx`'s homepage `metadata.description`

## 4. Reduce resume section heading size

- [x] 4.1 In `app/styles/pages/resume.css`, change the Experience/Education/Skills (and courses/references) title `h2` font size from `var(--text-3xl)` to `var(--text-2xl)`
- [x] 4.2 In `app/styles/pages/home.css`, change `.home-contact .contact-header h2` font size from `var(--text-3xl)` to `var(--text-2xl)` to match

## 5. Verification

- [x] 5.1 Run `npm run type-check`, `npm run lint`, `npm test`, and `npm run build` — all clean (193/193 tests pass)
- [x] 5.2 Grep `src/data/resume` and `app/page.tsx` to confirm no em dash characters remain in user-facing copy — clean (one internal code comment in `work.ts` left untouched, not user-facing)
- [x] 5.3 Manually verify in a browser: résumé PDF downloads a real file (200), no Projects/Publications block at the bottom of the homepage, top nav still links to `/projects/` and `/publications/`
