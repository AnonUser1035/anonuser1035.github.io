## Context

This is the third small change in a row against the merged homepage (`consolidate-homepage-ia`, then `polish-homepage-copy-and-links`, now this one). None of the three has been archived yet; they're sequential refinements on the same branch. This change closes out the last known rough edges Ryan flagged after looking at the shipped page: a missing résumé file, a redundant nav block, lingering em dashes, and oversized section headings.

## Goals / Non-Goals

**Goals:**

- The "Download Résumé" button on the homepage actually downloads a file.
- The homepage no longer repeats Projects/Publications navigation that the top nav already provides.
- Resume section content (not just Hero) has no em dashes.
- Section headings in the merged resume section are sized appropriately for a page where four of them appear in sequence.

**Non-Goals:**

- Not generating a new, up-to-date résumé. Ryan explicitly said the dated PDF is an acceptable placeholder.
- Not touching em dashes outside the resume section and the homepage metadata description (e.g. Publications page, Workouts app) — out of scope for this request.
- Not changing the top-level navigation structure; Projects/Publications remain reachable via the hamburger/nav bar exactly as they are today.
- Not changing Hero copy again (already addressed in `polish-homepage-copy-and-links`).

## Decisions

**Interpret "remove the inline projects and presentations link" as removing the whole `home-directory` block.**
The homepage currently has no element literally labeled "presentations" — that word only appears on the `/publications` page as a subsection of Publications. The most coherent reading is that Ryan means the bottom-of-page "Projects / Publications" directory list as a single unit (loosely recalling "Publications" as "presentations," since Presentations is a section within it). This delta removes that whole block. If this reading is wrong, it's a one-line revert.

**Copy the PDF as-is; do not attempt to regenerate or edit it.**
Ryan supplied an exact file path and explicitly called it an acceptable, if dated, placeholder. No processing (compression, metadata stripping) is in scope; a straight file copy to `public/resume.pdf` is sufficient.

**Rewrite em dashes using commas or parentheses depending on the original grammatical role**, consistent with the no-em-dash rule established in `polish-homepage-copy-and-links`:

- Parenthetical asides (e.g. "$5M valuation, $100K pre-seed") become parenthetical in parentheses instead of set off by em dashes.
- Appositive/clarifying phrases (e.g. "B.S. Computational Neuroscience — Honors Thesis Program") become comma-separated.

**Reduce section heading size by one step on the existing type scale (`--text-3xl` → `--text-2xl`), not a bespoke value.**
`--text-3xl` (2.75em) was sized for a single prominent heading on a standalone `/resume` page. With Experience, Education, Skills, and Contact headings all appearing in one scroll, stepping down to `--text-2xl` (2.2em) keeps them on the same design-token scale while reducing visual weight, rather than inventing a new one-off size.

## Risks / Trade-offs

- **[Risk]** The "presentations" wording in the request doesn't literally match anything on the homepage, so the removal target is inferred rather than confirmed. → **Mitigation**: called out explicitly in the proposal; easy to restore if wrong.
- **[Risk]** The résumé PDF being out of date could show stale information to a recruiter who downloads it. → **Mitigation**: explicit, informed trade-off Ryan already accepted; not this change's problem to solve.
- **[Risk]** Reducing heading size affects visual hierarchy against the Contact heading, which was styled to match in the prior change. → **Mitigation**: both are stepped down together, so they stay consistent with each other.

## Migration Plan

1. Copy the résumé PDF into `public/resume.pdf`.
2. Remove the `home-directory` block, `destinations` array, and unused `Link` import from `app/page.tsx`.
3. Fix em dashes in `resume/work.ts`, `resume/degrees.ts`, and `app/page.tsx`'s metadata description.
4. Step down section heading font size in `resume.css` and `home.css`.
5. Run the full verification suite (type-check, lint, test, build) and visually confirm heading size and PDF download in a dev server.
