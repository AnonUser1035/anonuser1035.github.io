## Why

Two problems surfaced after reviewing the merged homepage (from the in-flight `consolidate-homepage-ia` change): the Hero copy reads as long, narrative prose when it should read as a quick factual summary, and a link audit of the site's external URLs found several that are stale or outright wrong, which undermines credibility for anyone (a recruiter, a collaborator) who actually clicks them.

## What Changes

- Rewrite the Hero tagline to be short and tangibles-only (role, affiliations, credentials), cutting the philosophical/narrative framing added by `consolidate-homepage-ia`. No em dashes in the new copy, or in any site copy going forward.
- Audit every external link referenced from site data (`resume/work.ts`, `resume/degrees.ts`, `projects.ts`, `contact.ts`, `publications.ts`) for reachability using DNS resolution, HTTP status checks, and web search for current URLs where a domain appears dead.
- Fix confirmed-broken links:
  - Thakor Lab (`resume/work.ts`): `https://thakorlab.jhu.edu` does not resolve (DNS failure) → `https://neuroengineering.bme.jhu.edu/`
  - Mysore Lab (`resume/work.ts`): `https://mysore.bme.jhu.edu` does not resolve (DNS failure) → `https://mysorelab.johnshopkins.edu/`
  - Arbutus Volunteer Fire Department (`resume/work.ts`): `https://www.arbutusvfd.com` is the wrong domain (TLS handshake fails, no valid site) → `https://www.arbutusvfd.org/`
  - Dallas ISD School of Engineering and Science Magnet (`resume/degrees.ts`): `https://www.dallasisd.org/sem` returns 404 (page moved) → `https://semagnet.dallasisd.org/`
- Leave unchanged, and flag for a manual spot-check, links that could not be conclusively verified from this environment because their domains block automated/non-browser requests: `jhu.edu`, `hopkinsmedicine.org`, `linkedin.com`, and a few publication DOIs on `doi.org`. These returned 403/999 responses consistent with bot protection, not confirmed dead links, and have not been changed.
- No changes to `neurosafetysystems.com`, `demo.neurosafetysystems.com`, `ankibot.ryanbohluli.com`, `github.com/anonuser1035`, `abbott.com`, or `utdallas.edu` — all verified reachable (HTTP 200).

## Capabilities

### New Capabilities

- `external-link-integrity`: Ongoing expectation that external links referenced from site data resolve to a live destination, with a documented audit method and an explicit carve-out for domains that block automated verification.

### Modified Capabilities

- `homepage-narrative`: The Hero section's copy requirement changes from personal/philosophical narrative framing to short, tangibles-only copy with no em dashes. (Note: this capability's spec has not yet been archived from `consolidate-homepage-ia`; this delta is written against that change's spec and is intended to apply together with or immediately after it.)

## Impact

- `src/components/Template/Hero.tsx`: tagline copy rewritten, shortened.
- `src/data/resume/work.ts`: two lab URLs and one fire department URL corrected.
- `src/data/resume/degrees.ts`: one school program URL corrected.
- No component logic changes; no new dependencies.
