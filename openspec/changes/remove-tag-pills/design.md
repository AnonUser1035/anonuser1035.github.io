## Context

Two unrelated UI surfaces both use small pill/oval "chip" styling that Ryan wants gone: the per-project tech-stack tags (`.tech-tag`, rendered from each `Project.tech` array in `Cell.tsx`) and the three hero credential pills (`.hero-chip`, hardcoded in `Hero.tsx`). Both are purely presentational lists with no other consumers.

## Goals / Non-Goals

**Goals:**

- Remove the tech-tag pill list from every project card, and remove the `tech` data backing it entirely rather than leaving an unused field (consistent with how `preview`/`featured` were fully removed from `Project` in the prior projects-tab change, not just hidden).
- Remove the three hero credential pills and their wrapper from the homepage.
- Leave the hero tagline prose (including the literal words "Volunteer EMT" inside that sentence) untouched — only the chip elements go.
- Leave the unrelated `.skill-tag`/`.skill-tags` pills on the Skills page untouched — not in scope.

**Non-Goals:**

- No replacement visual (e.g., plain comma-separated text) for either removed element — user wants them gone, not restyled.
- No change to `.group-label` or any other shared tag/label primitive in `tags.css`.

## Decisions

**Drop `Project.tech` entirely, not just its rendering.** Nothing outside `Cell.tsx` reads `tech` (confirmed via grep — only `projects.ts` writes it, only `Cell.tsx` reads it). Keeping an unused field on every entry would be the same stale-data situation already fixed once this session for `preview`/`featured`; deleting it keeps `projects.ts` matching what's actually rendered.

**Hero chips are removed as a single JSX block plus their CSS, not toggled by a flag.** `hero-chips`/`hero-chip` have no other use (single render site in `Hero.tsx`, single consumer of the CSS classes). A flag or conditional would add complexity for a one-way decision.

**`project-record-meta`'s flex layout survives unchanged.** The `.project-record-action` span already has `margin-left: auto`, so once the tech-tag `<ul>` is removed, the action label ("Visit →" etc.) still right-aligns correctly inside `project-record-meta` with no CSS changes needed there.

## Risks / Trade-offs

- **Deleting `tech` is a type-shape break for `Project`** → Mitigation: `Project` is only imported within this codebase (`Cell.tsx`, `page.tsx`, tests); no external consumer.
- **Losing the at-a-glance tech-stack signal on project cards** → Mitigation: this is the explicit ask; the `tech` list was supplementary information, not load-bearing for the project's description or link.

## Migration Plan

Single commit, no data migration. Steps: remove `tech` from `Project` type and all entries in `projects.ts` → remove the tech-tag render block from `Cell.tsx` → remove `hero-chips` block from `Hero.tsx` → strip the corresponding CSS from `tags.css`, `cards.css`, `home.css`, and `dark-mode.css` → update the three affected test files → run `npm run format`, `npm run lint`, `npm run type-check`, `npm test`, and `npm run build`.
