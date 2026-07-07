## 1. Rewrite Hero copy

- [x] 1.1 Rewrite the Hero tagline in `src/components/Template/Hero.tsx` to be short and tangibles-only (name/role/affiliations already covered by the heading and chips; the tagline should just state the two affiliations and roles in plain factual sentences)
- [x] 1.2 Confirm the new copy contains no em dash character
- [x] 1.3 Update `src/components/__tests__/Template/Hero.test.tsx` if the tagline text assertions need adjusting — no change needed, existing assertions only target the JHU/NSS links and chips

## 2. Fix confirmed-broken links

- [x] 2.1 In `src/data/resume/work.ts`, update the Thakor Lab entry's `url` from `https://thakorlab.jhu.edu` to `https://neuroengineering.bme.jhu.edu/`
- [x] 2.2 In `src/data/resume/work.ts`, update the Mysore Lab entry's `url` from `https://mysore.bme.jhu.edu` to `https://mysorelab.johnshopkins.edu/`
- [x] 2.3 In `src/data/resume/work.ts`, update the Arbutus Volunteer Fire Department entry's `url` from `https://www.arbutusvfd.com` to `https://www.arbutusvfd.org/`
- [x] 2.4 In `src/data/resume/degrees.ts`, update the Dallas ISD SEM entry's `link` from `https://www.dallasisd.org/sem` to `https://semagnet.dallasisd.org/`

## 3. Verification

- [x] 3.1 Re-check each of the 4 corrected URLs returns a 200 response — arbutusvfd.org and semagnet.dallasisd.org confirmed 200; the two *.jhu.edu-family replacements return 403 from this sandboxed environment (same bot-blocking signature as jhu.edu/hopkinsmedicine.org, not evidence of being dead)
- [x] 3.2 Run `npm run type-check`, `npm run lint`, `npm test`, and `npm run build` — all clean (193/193 tests pass)
- [x] 3.3 Confirm no other links in `resume/work.ts`, `resume/degrees.ts`, `projects.ts`, `contact.ts` were changed — confirmed, only the 4 listed above
- [x] 3.4 Report the unverifiable-but-likely-fine links (jhu.edu, hopkinsmedicine.org x2, linkedin.com/in/bohluli, ASME/Neurosurgery DOIs) to Ryan for a manual click-check — reported in chat
