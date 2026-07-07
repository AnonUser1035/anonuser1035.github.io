## Why

The homepage still has a placeholder gap and some leftover rough edges from the last two changes: the "Download Résumé" button has no file behind it yet, the bottom-of-page Projects/Publications directory duplicates navigation the top nav already provides, resume content still has em dashes despite the no-em-dash rule, and the resume section headings are visually heavier than they need to be now that four of them (Experience, Education, Skills, Contact) stack in one continuous scroll.

## What Changes

- Wire the real (if dated) résumé PDF into `public/resume.pdf`, sourced from `/Users/ryan/Projects/General/Applications/General/Ryan Bohluli Resume.pdf`. Ryan has confirmed this is an acceptable placeholder despite being out of date.
- Remove the inline "Projects / Publications" directory block from the bottom of the homepage (`app/page.tsx`'s `home-directory` nav). Top-level navigation (hamburger + nav bar) already links to both, so this in-page block is redundant now that it sits below a full narrative page instead of a short landing page.
- Remove remaining em dashes from resume section content: `resume/work.ts`'s Neuro Safety Systems summary, `resume/degrees.ts`'s two degree lines, and the homepage's own `<meta name="description">` copy in `app/page.tsx`.
- Reduce the font size of the Experience/Education/Skills section headings (and the matching Contact heading) from `--text-3xl` to `--text-2xl`, since four large headings in one scroll read as heavier than one heading did on its own standalone `/resume` page.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `resume-download`: the downloadable PDF requirement is now fulfilled by a real file rather than a wired-but-missing link. (Spec lives in the not-yet-archived `consolidate-homepage-ia` change; this delta applies on top of it.)
- `homepage-narrative`: removes the inline Projects/Publications directory nav from the homepage, extends the no-em-dash rule to resume section content (not just Hero copy), and reduces section heading size. (Spec lives across the not-yet-archived `consolidate-homepage-ia` and `polish-homepage-copy-and-links` changes; this delta applies on top of both.)

## Impact

- `public/resume.pdf`: new file, copied from the path Ryan provided.
- `app/page.tsx`: removes the `home-directory` nav block, the now-unused `destinations` array, and the now-unused `Link` import; fixes the em dash in the page's metadata description.
- `src/data/resume/work.ts`, `src/data/resume/degrees.ts`: em dashes removed from user-facing summary/degree text.
- `app/styles/pages/resume.css`, `app/styles/pages/home.css`: section heading font size reduced.
- No route, navigation-structure, or data-shape changes.
