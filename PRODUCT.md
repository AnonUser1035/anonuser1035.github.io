# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The personal portfolio of Ryan Bohluli — computational neuroscience at Johns Hopkins, co-founder & CRO of Neuro Safety Systems, volunteer EMT, and aspiring physician. It serves four overlapping audiences, each arriving with a different question:

- **Med school / residency admissions** — evaluating him as a future physician. They want evidence of clinical depth, service, and a coherent narrative behind the credentials.
- **Research & academia** (PIs, collaborators, grad programs) — reading the publications and lab work. They want rigor, scholarly weight, and proof the science is real.
- **Investors & neurotech partners** — assessing Neuro Safety Systems. They want vision, traction, and technical edge, conveyed without hype.
- **Recruiters & general professional contacts** — networking and quick evaluation. They want a clean, skimmable overview and an easy way to reach him.

The common thread: these are time-pressed, credential-literate readers who decide fast. The site must let any of them find what they came for in seconds and leave convinced the substance is real.

All four carry equal weight. When they pull in different directions, none outranks another.

## Product Purpose

A single, authoritative home for Ryan's professional identity — work, publications, resume, and a way to get in touch. It exists to consolidate a multi-disciplinary story (neuroscience research + a neurotech venture + frontline medicine + community work) into one credible, navigable place that holds up to scrutiny from admissions committees, scientists, and investors alike. Success looks like: a reader from any of the four audiences lands, immediately understands who he is and why it matters, finds the specific proof they need (a paper, the resume, the venture), and reaches out or comes away convinced.

## Positioning

Everything Ryan does is reading the body before something goes wrong: the Hopkins research on focused ultrasound and blood pressure after spinal cord injury, the Neuro Safety Systems wearable that detects driver drowsiness, and EMT calls in Baltimore County. The homepage's opening sentence says it in his own words: "I study the nervous system, mostly by trying to read it before something goes wrong." That through-line, not any single credential, is what another applicant's or founder's site could not truthfully claim.

## Operating Context

- The site is ryanbohluli.com: a homepage written as a short first-person letter, plus `/talks/` and a 404 page.
- The full publication list lives on Google Scholar, with ORCID as the secondary record. The homepage shows four selected works; `/talks/` lists talks and posters.
- Readers reach Ryan by email or LinkedIn, and can download a one-page résumé PDF.
- It is read on phones and desktops, in light or dark mode following the system setting.
- Ryan maintains it himself. Copy lives in `src/data/content.ts` and `src/data/talks.ts`, the résumé is exported from his Word source, and every change is reviewed in a local preview before it deploys.

## Capabilities and Constraints

- Plain HTML built by a small TypeScript script and served from GitHub Pages; merges to `main` deploy. No framework, bundler or runtime dependencies, and page weight is watched.
- Google Analytics stays, in production builds only and loaded after the page, by Ryan's choice.
- Clinicians read the rhythm strip, so it stays clinically accurate (25 mm/s, 10 mm/mV, real PR, QRS and QT intervals). One beat per milestone, 15 at most.

## Brand Commitments

**Rigorous, credible, understated.** The voice is precise and earned — it states what was done and lets the work carry the weight. Confidence comes from substance, not volume. Warmth is present but quiet (the EMT-and-mentor throughline), never performed. Three words: _rigorous, grounded, clear._ The site should feel like reading a well-edited CV that happens to be beautiful — trust through restraint, not persuasion through flash.

- **Name:** Ryan S. Bohluli. Structured data keeps "Ryan Bohluli" as an alternate name.
- **Voice:** a short, warm, specific first-person letter, signed "Ryan". Typographic apostrophes, no em dashes in site copy (a test enforces it), and descriptive link text, never "here".

## Anti-references

- **Generic SaaS landing pages** — gradient-heavy heroes, feature-card grids, big-number hero metrics, an uppercase tracked eyebrow above every section. None of it.
- **Flashy startup / marketing sites** — loud animation, neon, drenched color, salesy copy. Too promotional for an academic-clinical identity.
- **Cookie-cutter portfolio templates** — the interchangeable "developer portfolio" look with no personality of its own.
- **Cluttered, busy, dense layouts** (the strongest aversion) — the site must stay **minimal, highly readable, and effortless to navigate**. When in doubt, remove. Whitespace, clear hierarchy, and fast wayfinding beat density every time.

## Evidence on Hand

- Four selected papers with DOI links on the homepage (`src/data/content.ts`); the full list on Google Scholar and ORCID.
- Talks and posters with Vancouver author lists (`src/data/talks.ts`), including a Best Poster award in functional neurosurgery at Johns Hopkins Neurosurgery Research Day 2026.
- The one-page résumé, `public/resume.pdf`.
- The JHU Engineering magazine story on how Neuro Safety Systems started.
- Profiles: Google Scholar, ORCID, LinkedIn and GitHub.

Not on hand, and never to be invented: testimonials, a portrait photo, Neuro Safety Systems traction numbers, or press beyond that story.

## Product Principles

1. **Let the work speak.** Real publications, real surgeries, real calls answered. Present evidence plainly; resist embellishment. Credibility is the product.
2. **Minimal, navigable, fast.** Every page should be skimmable in seconds and reachable in one or two clicks. Reduce before adding. Clarity over decoration.
3. **One identity, many lenses.** Unify neuroscience, neurotech, and medicine into a single coherent narrative rather than four disconnected résumés — each audience finds its thread without the others becoming noise.
4. **Quiet confidence.** Polish and restraint over spectacle. The design earns trust by being precise and uncluttered, not by demanding attention.
5. **Substance is legible.** Typography, contrast, and hierarchy serve reading. If a flourish competes with comprehension, the flourish loses.

## Accessibility & Inclusion

Target **WCAG 2.1 AA**: body text ≥4.5:1 contrast (large/bold text ≥3:1), full keyboard navigation with visible focus, semantic HTML and landmarks, and a meaningful `prefers-reduced-motion` alternative for every animation. Light and dark themes follow the system setting. Prefer color-blind-safe distinctions (don't rely on hue alone for any signal). Given the academic/clinical audience and the minimal-and-readable mandate, legibility is treated as a first-class design constraint, not a retrofit.
