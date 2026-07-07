## ADDED Requirements

### Requirement: External links referenced from site data resolve

External URLs referenced from site data (`resume/work.ts`, `resume/degrees.ts`, `projects.ts`, `contact.ts`, `publications.ts`) SHALL point to a live, correct destination whenever this can be confirmed with reasonable confidence (DNS resolution succeeds, and the domain does not return a client or server error inconsistent with normal operation).

#### Scenario: A link with high-confidence dead evidence is corrected

- **WHEN** an external link's domain fails DNS resolution, returns a 404 from a domain that otherwise loads normally, or fails a TLS handshake against the exact domain used in the code
- **THEN** the link is replaced with a verified-working current URL for the same organization or destination

#### Scenario: A link that cannot be conclusively verified is left unchanged and flagged

- **WHEN** an external link's domain is a well-known, unmistakably-live institutional or major-platform destination that returns a non-2xx response consistent with automated-request blocking (e.g. 403, 999) rather than evidence of being dead
- **THEN** the link is left unchanged and is explicitly called out for a manual human check, rather than being "fixed" on unverified evidence
