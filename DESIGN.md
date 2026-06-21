---
name: ryanbohluli.com
description: The personal portfolio of Ryan Bohluli — computational neuroscience, neurotech, medicine. A clinical record, read fast by experts.
colors:
  signal-cobalt: '#2e59ba'
  sky-blue: '#60a5fa'
  ink: '#1d1d1f'
  slate: '#58585d'
  slate-muted: '#6b6b70'
  paper-white: '#ffffff'
  mist: '#f5f5f7'
  fog: '#f0f0f2'
  hairline: '#0000001a'
  ink-night-bg: '#0a0a0a'
  ink-night-surface: '#111111'
  ink-night-fg: '#e5e5e5'
  skill-violet: '#6968b3'
  skill-azure: '#37b1f5'
  skill-graphite: '#40494e'
  skill-indigo: '#515dd4'
  skill-coral: '#e47272'
  skill-rose: '#cc7b94'
typography:
  display:
    fontFamily: "'Source Serif 4', 'Source Serif Pro', Georgia, serif"
    fontSize: 'clamp(2.5rem, 7vw, 4rem)'
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: '-0.015em'
  headline:
    fontFamily: "'Source Serif 4', 'Source Serif Pro', Georgia, serif"
    fontSize: '2.2rem'
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: '-0.01em'
  title:
    fontFamily: "'Source Serif 4', 'Source Serif Pro', Georgia, serif"
    fontSize: '1.6rem'
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 'normal'
  body:
    fontFamily: "'Source Sans 3', 'Source Sans Pro', Helvetica, sans-serif"
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: '0.01em'
  label:
    fontFamily: "'Source Sans 3', 'Source Sans Pro', Helvetica, sans-serif"
    fontSize: '0.875rem'
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: '0.04em'
  mono:
    fontFamily: "ui-monospace, 'SF Mono', 'Cascadia Code', Menlo, monospace"
    fontSize: '0.95rem'
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 'normal'
rounded:
  xs: '4px'
  sm: '8px'
  md: '12px'
  lg: '16px'
  xl: '24px'
  full: '999px'
spacing:
  2: '0.5rem'
  4: '1rem'
  6: '1.5rem'
  8: '2rem'
  12: '3rem'
  16: '4rem'
  element: '1.75rem'
  section: '4rem'
components:
  button-primary:
    backgroundColor: '{colors.signal-cobalt}'
    textColor: '{colors.paper-white}'
    rounded: '{rounded.sm}'
    padding: '0 2em'
    height: '3.25rem'
  button-primary-hover:
    backgroundColor: '#274d9f'
    textColor: '{colors.paper-white}'
  button-secondary:
    backgroundColor: '#00000000'
    textColor: '{colors.slate}'
    rounded: '{rounded.sm}'
    padding: '0 2em'
    height: '3.25rem'
  chip:
    backgroundColor: '{colors.mist}'
    textColor: '{colors.ink}'
    rounded: '{rounded.full}'
    padding: '0.5rem 1rem'
  tech-tag:
    textColor: '{colors.signal-cobalt}'
    rounded: '{rounded.full}'
    padding: '0.3rem 0.75rem'
  card:
    backgroundColor: '{colors.paper-white}'
    rounded: '{rounded.lg}'
    padding: '1.5rem'
  nav-link:
    textColor: '{colors.ink}'
    rounded: '{rounded.sm}'
    padding: '0.75rem 1.125rem'
---

# Design System: ryanbohluli.com

## 1. Overview

**Creative North Star: "The Clinical Record"**

This is the chart at the foot of the bed — the document an expert picks up, scans in seconds, and trusts. Its authority comes from legibility and restraint, never from decoration. The reader is a time-pressed specialist (an admissions committee, a PI, an investor) who has read a thousand of these and can smell padding instantly. So the system gives them structure, whitespace, and exact typography, and gets out of the way. Color is an annotation, not a mood. The work — nine papers, fifty surgeries, seventy calls answered — is the content; the design's only job is to make that content unmissable and effortless to navigate.

The voice is **rigorous, grounded, and clear**. A scholarly serif carries the headings; a clean humanist sans carries the prose. White (or near-black, in the dark record) dominates; a single cobalt does all the signalling. Surfaces are calm at rest and respond to touch with a quiet lift — confidence without spectacle. Generous vertical rhythm separates sections so the eye can rest between dense passages.

This system explicitly **rejects the marketing playbook**: no gradient-washed hero, no feature-card grids, no big-number stat blocks, no uppercase tracked eyebrow stacked above every section, no neon, no glassmorphism. Those are the tells of a SaaS landing page or a startup pitch, and this is neither. It also rejects the interchangeable "developer portfolio template" — the colored side-stripe on every card, the rainbow of accents, the same lifted box repeated five ways. When in doubt, the system removes rather than adds.

**Key Characteristics:**

- **One voice, one accent.** A single cobalt signals; everything else is ink, slate, and paper.
- **Serif headlines, sans prose.** Scholarly contrast axis — institutional, not fashionable.
- **Whitespace is the layout.** Rhythm and breathing room over density and chrome.
- **Quiet, uniform interaction.** A small lift on hover; nothing bounces or shouts.
- **Legibility is non-negotiable.** Every text/background pair clears WCAG AA.

## 2. Colors

A near-monochrome paper-and-ink base, with a single cobalt accent doing all the signalling and a muted categorical palette reserved strictly for skill grouping.

### Primary

- **Signal Cobalt** (`#2e59ba`): The one voice. Links, primary buttons, active nav, focus rings, the lone section divider, the dot on an impact bullet. In dark mode it lightens to **Sky Blue** (`#60a5fa`) to hold contrast on near-black. Used on roughly ≤10% of any screen — its rarity is what makes it read as "important," not "decorative."

### Secondary

- **Sky Blue** (`#60a5fa`): The dark-mode accent and the lighter end of the cobalt relationship. Pairs with Signal Cobalt only in subtle two-stop gradients on functional elements (e.g. a focus glow); never as a decorative wash.

### Tertiary

- **The Skill Palette** — _Violet_ (`#6968b3`), _Azure_ (`#37b1f5`), _Graphite_ (`#40494e`), _Indigo_ (`#515dd4`), _Coral_ (`#e47272`), _Rose_ (`#cc7b94`): Six muted hues used **only** to label skill categories on the resume. They are intentionally desaturated so the page never turns into a rainbow. Hue alone must never be the only signal (see the No-Stripe Rule and Do's & Don'ts).

### Neutral

- **Ink** (`#1d1d1f`): Primary text and bold headings on light backgrounds. The "black" of the record.
- **Slate** (`#58585d`): Secondary text — subtitles, dates, supporting bullet copy. Clears AA at ~6.8:1 on paper.
- **Slate Muted** (`#6b6b70`): The _floor_ for de-emphasized text. Replaces the old `rgba(0,0,0,0.5)` (~3.9:1, an AA failure). Timestamps, captions, and hints stop here — never lighter.
- **Paper White** (`#ffffff`): The dominant surface. The page is mostly this.
- **Mist** (`#f5f5f7`) / **Fog** (`#f0f0f2`): Subtle surface offsets for chips, hovers, and alternating zones. Tonal layering, not borders, carries most separation.
- **Hairline** (`#0000001a`): 1px borders and dividers. Faint by design.
- **Night Record** — _Bg_ (`#0a0a0a`), _Surface_ (`#111111`), _Fg_ (`#e5e5e5`): The dark theme. Near-black, not navy; warmth comes from nothing — it's a clinical dark, with Sky Blue as the only color.

### Named Rules

**The One Voice Rule.** Exactly one accent signals on any given screen — cobalt (light) or sky (dark). If a second color is carrying meaning, it's wrong. The skill palette is the single sanctioned exception, and only on the resume's skills section.

**The Annotation Rule.** Color marks; it never decorates. A cobalt element should always _mean_ something is interactive, active, or important. No cobalt for atmosphere.

## 3. Typography

**Display Font:** Source Serif 4 (with Source Serif Pro, Georgia, serif)
**Body Font:** Source Sans 3 (with Source Sans Pro, Helvetica, sans-serif)
**Mono Font:** system mono stack (ui-monospace → SF Mono → Cascadia → Menlo)

**Character:** A scholarly pairing from one superfamily — Source Serif and Source Sans share x-height and proportion, so they sit together without friction, while the serif/sans split gives a clean editorial contrast axis. The serif reads like a journal masthead; the sans reads like well-set body copy. Together: a research document, not a brochure. _(This replaces the previous Raleway heading font, whose light, wide, geometric personality read "2016 portfolio template" rather than "rigorous scientist.")_

### Hierarchy

- **Display** (Serif, 700, `clamp(2.5rem, 7vw, 4rem)`, 1.05, `-0.015em`): The name in the hero and page-defining H1s. The only place type gets large. Use `text-wrap: balance`.
- **Headline** (Serif, 600, `2.2rem`, 1.2): Section H2s. Confident but not shouting.
- **Title** (Serif, 600, `1.6rem`, 1.3): Job titles, project names, card headers (H3/H4).
- **Body** (Sans, 400, `1rem`, 1.7): All prose. Cap measure at **65–75ch**; the About page especially must not run edge to edge. Use `text-wrap: pretty` on long passages.
- **Label** (Sans, 600, `0.875rem`, `0.04em`, uppercase): Sparingly — the projects section label, skill-category headers. **Not** an eyebrow above every section (see Don'ts).
- **Mono** (system mono, 400, `0.95rem`): Inline code and course numbers. _(Upgrade target from the previous `Courier New`, which reads dated.)_

### Named Rules

**The Serif-Headline Rule.** Every heading is the serif; every run of prose is the sans. Don't set a heading in the sans "for variety" — the consistent serif voice is the system's signature.

**The Quiet Display Rule.** Display type tops out at ~4rem (`clamp` max). Bigger is shouting. Letter-spacing on display never goes below `-0.015em` — letters must not touch.

## 4. Elevation

A hybrid system, leaning flat. Surfaces are paper-flat at rest and separated mostly by **tonal layering** (Paper → Mist → Fog) and hairline borders, not by shadow. Shadow is reserved for **state and focus**: the standard interaction is a small upward lift (`translateY(-2px)` for buttons/tags, `-4px` for cards) with a soft shadow that grows on hover, settling back on `:active`. This is the sanctioned "quiet confidence" motion — present, uniform, never bouncy (easing is `ease-out`, `cubic-bezier(0.16, 1, 0.3, 1)`, no spring on primary surfaces). In dark mode, shadows gain a faint `1px` light inset to define edges against near-black.

### Shadow Vocabulary

- **sm** (`0 1px 2px rgba(0,0,0,0.04)`): Resting card hairline-shadow.
- **md** (`0 4px 12px rgba(0,0,0,0.08)`): Buttons at rest; cards/tags on hover.
- **lg** (`0 8px 30px rgba(0,0,0,0.12)`): Lifted buttons and featured surfaces on hover.
- **xl** (`0 20px 40px rgba(0,0,0,0.15)`): The hero portrait; the most-lifted card states only.

### Named Rules

**The Lift-Not-Glow Rule.** Depth is communicated by lifting a surface toward the reader (transform + shadow), not by adding a colored glow or a gradient behind it. State changes earn shadow; resting surfaces stay flat.

**Reduced-Motion Rule.** Every lift, scale, and reveal has a `@media (prefers-reduced-motion: reduce)` path that drops to an instant color/border change. No exceptions.

## 5. Components

### Buttons

- **Shape:** Gently rounded (`8px`, `rounded.sm`), `3.25rem` tall, comfortable `2em` horizontal padding.
- **Primary:** Solid Signal Cobalt on Paper White text, soft `md` shadow with a 1px top-inset highlight. Hover deepens the cobalt (~85% cobalt + black) and lifts `-2px` to `lg` shadow; active settles to `0` with `sm` shadow.
- **Secondary / Ghost:** Transparent with a `1.5px` inset border in Slate; text in Slate. Hover fills with a faint cobalt tint, border and text go cobalt, lifts `-2px`.
- **Focus:** `3px` cobalt-tint ring via box-shadow (never `outline: none` without a replacement ring).

### Chips (credential pills)

- **Style:** Mist background, Ink text, full-radius (`999px`), `1px` hairline border. The hero credential chips ("Johns Hopkins '27", "Volunteer EMT").
- **State:** Hover shifts to a faint cobalt-subtle background with a cobalt border and a `-1px` nudge. Static/informational — not buttons.

### Tags

- **Tech tags:** Full-radius cobalt-tinted pills (cobalt text on `accent-light`), `text-xs`. Used inside project cards.
- **Skill tags:** Rounded (`8px`), paper background, hairline border, category color conveyed by an **icon + the category header**, not a left-stripe. _(The current `4px border-left` skill-tag stripe is a banned side-stripe — see Don'ts — and must move to a full border tint or icon.)_

### Cards / Containers

- **Corner Style:** `16px` (`rounded.lg`) for project/feature cards; `12px` (`rounded.md`) for work and course cards.
- **Background:** Paper White (light) / Night Surface (dark).
- **Border:** `1px` hairline at rest, going cobalt on hover.
- **Shadow Strategy:** Per Elevation — `sm` at rest, lifting to `lg`/`xl` on hover with a `-4px` translate. Featured cards add a `2px` cobalt-tint ring.
- **Internal Padding:** `1.5rem`–`2rem`.
- **Restraint:** Consolidate card variants. Five near-identical hover-lift cards (project, job, course, work, featured) read as busy against the minimal mandate — prefer two shared card treatments, differentiated by content, not by five bespoke styles.

### Inputs / Fields

- **Current state:** No custom field styling exists (the contact flow uses links, not a form); inputs inherit Tailwind defaults.
- **When added:** `1px` hairline border, `8px` radius, Paper background; focus = cobalt border + `3px` cobalt-tint ring (mirror the button focus ring). Placeholder text must clear 4.5:1 — use Slate Muted, never a light gray.

### Navigation

- **Style:** Text links in Ink, serif-adjacent weight, `8px` radius hit-area. An animated `2.5px` cobalt underline scales in on hover/active/focus; active links also get a faint cobalt-light background.
- **States:** Hover/focus → cobalt text + faint background + underline; a subtle `1.02` scale. Focus-visible always shows the underline (keyboard parity with hover).
- **Mobile:** Desktop nav hides below `736px`; a hamburger opens a slide menu. Theme toggle is a `44px` square (meets touch-target minimums).

### Hero Portrait (signature)

- A `160px` circular portrait with an `xl` shadow and a `1px` hairline ring. Theme-aware (`ThemePortrait` swaps light/dark variants). Hover scales `1.03` and lifts `-2px`, revealing a faint cobalt ring. This is the one piece of personality-bearing chrome — keep it; it earns its place. **The blurred radial gradient blob behind the hero, however, does not** (see Don'ts).

## 6. Do's and Don'ts

### Do:

- **Do** keep one accent doing all the signalling — Signal Cobalt (`#2e59ba`) light, Sky Blue (`#60a5fa`) dark — on ≤10% of any screen (The One Voice Rule).
- **Do** set every heading in Source Serif 4 and every run of prose in Source Sans 3 (The Serif-Headline Rule).
- **Do** keep display type ≤ `4rem` and letter-spacing ≥ `-0.015em` (The Quiet Display Rule).
- **Do** carry separation with whitespace, tonal layers (Paper → Mist → Fog), and hairline borders before reaching for shadow.
- **Do** keep the quiet hover-lift uniform and `ease-out`, and give every motion a `prefers-reduced-motion` fallback.
- **Do** clear WCAG AA on every text/background pair; de-emphasized text bottoms out at Slate Muted (`#6b6b70`, ~5.2:1), never lighter.
- **Do** convey skill categories with an icon plus the category header, and never with hue alone (color-blind safety).
- **Do** cap body measure at 65–75ch.

### Don't:

- **Don't** ship the **gradient-washed hero** — the 1200px blurred cobalt radial blob behind the hero is the SaaS-landing tell named in the brief. Remove it; let whitespace and the portrait carry the hero.
- **Don't** use a **colored side-stripe** (`border-left`/`border-right` > 1px, or a `::before` stripe) on any card, tag, or list item. The job-card hover stripe and the `4px` skill-tag left border both violate this. Rewrite with full borders, a background tint, or an icon.
- **Don't** repeat **identical lifted card grids**. Consolidate the five card variants into two shared treatments; sameness reads as busy, which is the strongest aversion in the brief.
- **Don't** stack a **tiny uppercase tracked eyebrow above every section**. Labels are rare and deliberate, not section scaffolding. Numbered section markers (01/02/03) are likewise banned unless the content is a true ordered sequence.
- **Don't** introduce **feature-card grids, big-number hero metrics, neon, gradient text, or glassmorphism** — the marketing/startup playbook the brief rejects.
- **Don't** let muted text fall to `rgba(0,0,0,0.5)`/`#808080` (~3.9:1) or any lighter gray "for elegance." That's the single most common AA failure.
- **Don't** add a second signalling color or turn the skill palette loose outside the resume skills section (The Annotation Rule).
- **Don't** make surfaces glow or sit on a colored gradient to suggest depth; lift them instead (The Lift-Not-Glow Rule).
