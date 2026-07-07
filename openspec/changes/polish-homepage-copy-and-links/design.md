## Context

`consolidate-homepage-ia` merged the homepage's Hero, Experience, Education, Skills, and Contact into one page and rewrote the Hero tagline as a longer, first-person narrative (philosophy, EMT framing, em dashes). On review, that copy reads as too prosey for what the Hero is: a fast, factual introduction before the tangible Experience/Education/Skills sections that immediately follow it. Separately, a link audit of the site's data files found several stale external URLs.

## Goals / Non-Goals

**Goals:**

- Hero copy is short, factual, and tangibles-only (name, role, affiliations, credentials), with no em dashes.
- Every external link referenced from site data either resolves, or has been corrected to a URL that does, or is explicitly flagged as unverifiable-from-this-environment rather than silently left alone.

**Non-Goals:**

- Not rewriting Experience/Education/Skills/Contact copy (those are already fact-driven, not prose).
- Not building an automated/CI link checker. This is a one-time manual-plus-tooling audit, not new infrastructure.
- Not changing publication DOIs or status fields based on their resolution behavior. In-press/under-review entries are expected to not resolve yet.

## Decisions

**Classify link health by signal strength, not by a single status code.**
A plain HTTP status code is not reliable evidence on its own: large institutional domains (`jhu.edu`, `hopkinsmedicine.org`) and `linkedin.com` return 403/999 to any non-browser client regardless of whether the page is alive. Signal strength used, strongest first:

1. DNS resolution failure (`Could not resolve host`) — high-confidence dead.
2. HTTP 4xx from a domain that otherwise connects normally over TLS — high-confidence dead or moved.
3. TLS handshake failure against the domain in the code (as opposed to a working alternate TLD) — high-confidence wrong URL.
4. HTTP 403/999 from a well-known, unmistakably-live institutional or major-platform domain — inconclusive, treated as likely fine, flagged for a human click-check rather than "fixed."

**Only touch links with high-confidence evidence (signals 1 to 3).**
Four links met that bar and were corrected, each verified against a fresh, working replacement URL found via web search and re-checked with a 200 response:

- Thakor Lab: DNS failure on `thakorlab.jhu.edu` → `https://neuroengineering.bme.jhu.edu/` (current official lab site, per search)
- Mysore Lab: DNS failure on `mysore.bme.jhu.edu` → `https://mysorelab.johnshopkins.edu/` (current official lab site, per search)
- Arbutus VFD: TLS handshake failure on `arbutusvfd.com` → `https://www.arbutusvfd.org/` (the department's actual domain is `.org`, not `.com`)
- Dallas ISD SEM: 404 on `dallasisd.org/sem` → `https://semagnet.dallasisd.org/` (the program now has its own subdomain)

**Leave low-confidence signals alone and report them.**
`jhu.edu`, `hopkinsmedicine.org` (used twice in `work.ts`), `linkedin.com/in/bohluli/`, and the ASME/Neurosurgery DOIs all returned 403/999 even with browser-like headers. These are large, unmistakably real destinations; the likely explanation is bot-protection in this sandboxed environment, not a dead link. Changing them without evidence would risk replacing a correct URL with a guess. These are called out in the proposal for Ryan to spot-check by clicking them directly.

**Hero copy: cut to tangibles, drop the narrative framing entirely.**
Replace the philosophical/EMT-framing paragraph from `consolidate-homepage-ia` with a short factual line or two: name/role already covered by the `<h1>` and chips, so the tagline only needs to add the two affiliations (Johns Hopkins, Neuro Safety Systems) and what he does there, in plain sentences with no em dashes (periods or commas instead).

## Risks / Trade-offs

- **[Risk]** The four "corrected" URLs were found via web search, not by Ryan directly confirming they're his intended links (e.g. confirming `neuroengineering.bme.jhu.edu` is in fact "the Thakor Lab" page he means). → **Mitigation**: each replacement matches the original link's evident intent (same lab/organization name) and was confirmed live; call this out so Ryan can do a final visual check.
- **[Risk]** Flagging jhu.edu/hopkinsmedicine.org/linkedin.com/some DOIs as "probably fine but unverified" instead of definitively checking them means a real dead link there could still slip through. → **Mitigation**: explicitly listed in the proposal as needing a manual click-check rather than silently assumed correct.
- **[Risk]** Removing the narrative Hero framing discards work from the immediately-prior change. → **Mitigation**: explicit user direction; the previous framing was a first draft flagged for review, not a settled decision.

## Open Questions

- Should link health checks become a recurring/automated check (e.g. a CI job or periodic script) rather than a one-time audit? Not addressed here; flagged as a possible future change if link rot becomes a recurring problem.
