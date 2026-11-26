---
name: ryanbohluli.com
description: Ryan S. Bohluli's personal site, set as a short letter on ECG letterhead. A name, a Lead II rhythm strip whose beats are milestones, and a first-person letter.
colors:
  paper: '#faf8f5'
  ink: '#1d2129'
  secondary: '#454a54'
  muted: '#6a6e78'
  rule: '#d8d9de'
  navy: '#23406e'
  strip-paper: '#fcf1f2'
  grid-minor: '#cc466221'
  grid-major: '#cc46624d'
  marker: '#c1121f'
  paper-dark: '#121419'
  ink-dark: '#e7e8ec'
  secondary-dark: '#c0c3ca'
  muted-dark: '#8a8e97'
  rule-dark: '#30333a'
  navy-dark: '#a4bae6'
  strip-paper-dark: '#1b1a20'
  grid-minor-dark: '#ec788c1a'
  grid-major-dark: '#ec788c3d'
  marker-dark: '#f0505a'
typography:
  display:
    fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
    fontSize: '3.25rem'
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: '-0.02em'
  lead:
    fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
    fontSize: '1.9375rem'
    fontWeight: 400
    lineHeight: 1.36
    letterSpacing: 'normal'
  body:
    fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
    fontSize: '1.25rem'
    fontWeight: 400
    lineHeight: 1.62
    letterSpacing: 'normal'
  signature:
    fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
    fontSize: '1.625rem'
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 'normal'
  caption:
    fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
    fontSize: '1.125rem'
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 'normal'
  small:
    fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
    fontSize: '1.0625rem'
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 'normal'
  year-label:
    fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
    fontSize: '0.90625rem'
    fontWeight: 400
    lineHeight: 1
    letterSpacing: 'normal'
  print:
    fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
    fontSize: '0.78125rem'
    fontWeight: 400
    lineHeight: 1
    letterSpacing: 'normal'
rounded:
  none: '0px'
  focus: '2px'
spacing:
  gutter-left: 'max(22px, 17vw)'
  gutter-right: '22px'
  measure: '35rem'
  strip-max: '1680px'
  name-gap: '32px'
  caption-gap: '16px'
  paragraph: '1em'
  section: '3em'
  page-top: '11vh'
  page-bottom: '12vh'
components:
  link:
    textColor: '{colors.ink}'
  link-hover:
    textColor: '{colors.navy}'
  strip:
    backgroundColor: '{colors.strip-paper}'
  strip-marker:
    backgroundColor: '{colors.marker}'
    size: '2mm'
  caption:
    textColor: '{colors.secondary}'
    typography: '{typography.caption}'
  caption-label:
    textColor: '{colors.navy}'
  year-label:
    textColor: '{colors.navy}'
    typography: '{typography.year-label}'
  venue:
    textColor: '{colors.secondary}'
    typography: '{typography.small}'
  footer:
    textColor: '{colors.secondary}'
    typography: '{typography.small}'
---

# Design System: ryanbohluli.com

## 1. Overview

**Creative North Star: "A letter on ECG letterhead"**

The homepage is three things in order: the name, a full-width Lead II rhythm strip, and a short first-person letter signed "Ryan". The strip is the letterhead. Each beat is a milestone; hovering, focusing or tapping a beat puts a crimson dot on its R peak and shows a caption. Everything else is type on paper.

Clinicians read this strip, so it is drawn to clinical standards: 25 mm/s, 10 mm/mV, a calibration pulse, real PR, QRS and QT intervals, and faint recording noise between beats. The letter is short, warm and specific. The design's job is to stay out of the way of both.

**Key Characteristics:**

- **One typeface.** Newsreader in two weights (400, 500), roman and italic. No sans, no monospace.
- **Paper and ink.** A warm off-white page, near-black ink, crimson only for the marker and pen.
- **No chrome.** No nav, buttons, cards, icons, badges, section headings or theme toggle.
- **Nothing moves but the dot.** Selecting a beat changes the marker and the caption, never the layout.
- **Legibility first.** Every text and background pair clears WCAG AA in both themes.

## 2. Colors

Light by default; dark follows `prefers-color-scheme` only. All colors are tokens in `src/styles/tokens.css`.

### Neutral

- **Paper** (`#faf8f5`, dark `#121419`): the page.
- **Ink** (`#1d2129`, dark `#e7e8ec`): text, the name, and the waveform. The trace is always ink, never colored.
- **Secondary** (`#454a54`, dark `#c0c3ca`): captions, venues, author lists, the footer.
- **Muted** (`#6a6e78`, dark `#8a8e97`): only the printed strip marks ("II", "25 mm/s"). Darkened from the brief's `#7c808a` so those marks reach 4.6:1 on the strip paper.
- **Rule** (`#d8d9de`, dark `#30333a`): the resting link underline.

### Strip

- **Strip paper** (`#fcf1f2`, dark `#1b1a20`): the faint pink of ECG paper.
- **Grid** (crimson at 13% for 1 mm squares, 30% for 5 mm squares; lighter in dark mode): hairlines that never scale.

### Accents

- **Marker** (`#c1121f`, dark `#f0505a`): the selection dot and the pulsing pen at the end of the trace. The favicon's full stop is the same pen. Nothing else is crimson.
- **Navy** (`#23406e`, dark `#a4bae6`): link hover and focus, year labels under the strip, and the date at the start of a caption.

### Named Rules

**The Crimson Rule.** Crimson means "this beat" or "the pen". Never use it for text, links or decoration.

**The Ink Trace Rule.** The waveform is ink in both themes. A colored trace reads as a monitor screenshot, not a printed strip.

## 3. Typography

**Font:** Newsreader, self-hosted and trimmed to the weights in use (roman 400 to 500, italic 400), falling back to a metric-matched Times New Roman, then Georgia.

### Hierarchy

- **Name** (italic 400, 52px, 1.1, `-0.02em`; 40px on phones): the only large type. It shares the signature's italic, so the letter opens and closes in one hand. Weight 500 is left only for the author's name in citation lists.
- **Lead** (400, 31px, 1.36; 26px on phones): the letter's opening sentence.
- **Body** (400, 20px, 1.62; 18.5px on phones): the letter. Measure capped at 35rem.
- **Signature** (italic, 26px, 1.3): "Ryan".
- **Caption** (italic, 18px, 1.5, Secondary): beat captions and the idle hint. The date label is upright and navy.
- **Small** (17px, 1.5): venues (italic), the footer (italic), author lists and the talks note.
- **Year labels** (italic, 14.5px, Navy) and **printed marks** (12.5px, Muted): text laid over the strip in screen pixels.

### Named Rules

**The One Family Rule.** Hierarchy comes from size, italics and color within Newsreader. Do not add a second family, a monospace face or bold weights.

**The No Headings Rule.** The letter has no section headings. "Selected work:" is a sentence, separated by wider space, not a heading.

## 4. Elevation

Flat. No shadows, no lifted surfaces, no rounded containers. Separation comes from whitespace alone. The only radius is the 2px corner on the link focus outline.

## 5. Components

### Rhythm strip

- **Geometry:** an SVG with `viewBox="0 0 250 30"` in millimeters, aspect ratio 250:30, centered, up to 1680px wide. It spans the page rather than the text column.
- **Paper and grid:** strip paper background, 1 mm minor and 5 mm major grid lines as non-scaling 1px hairlines.
- **Trace:** ink, 1.4px, round joins and caps, non-scaling. It opens with a calibration pulse, then one beat per milestone (9 to 15 fit; 15 is the maximum). Seeded noise of at most 0.03 mV appears between beats, never on the calibration pulse or within 35 ms of an R peak.
- **Printed marks:** "II" top left and "25 mm/s" top right, in Muted.
- **Year labels:** italic navy, centered under the first beat of each year, 4% of the strip height from the bottom so they clear the S waves.
- **Pen:** a crimson dot at the end of the trace that fades in after printing and pulses slowly.
- **Selection:** each beat is an invisible button spanning its hit area. Hover (mouse), focus (keyboard) or tap (touch) shows a 2 mm crimson dot with a 2px strip-paper ring on the R peak. The dot is the focus indicator; buttons have no outline. Leaving the strip, tabbing past it or tapping elsewhere clears it.

### Caption

- Sits 16px below the strip, aligned to the text column.
- At rest it shows the hint, "Select a beat to explore." On touch phones it adds "Drag back for earlier years."
- When a beat is selected it shows "Mon YYYY." in upright navy, then the milestone text.
- Every caption is rendered invisibly in the same grid cell, so the box is always as tall as the longest caption and the letter below never moves.

### Letter

- **Column:** left gutter `max(22px, 17vw)`, right gutter 22px, measure 35rem.
- **Rhythm:** paragraphs 1em apart. The selected-work block gets 3em above and below; its items sit 1em apart, each a linked title with its venue on the next line in small italic Secondary.
- **Close:** the signature in italic, with "Written in Dallas, TX" directly beneath it in small italic Secondary and no gap.

### Links

- Inherit the text color with a 1px underline in Rule, offset 0.2em.
- Hover turns both the text and the underline Navy (0.15s, none under reduced motion).
- Keyboard focus shows a 2px Navy outline, offset 3px, with a 2px radius.
- Link text is descriptive ("All publications", "résumé (PDF)"), never "here".

### Talks page

- The name links home. An italic Secondary line names the page, followed by a short note pointing to Google Scholar and ORCID.
- Each entry is a title, then a Vancouver author list in small Secondary with "Bohluli RS" in weight 500, then the venue in small italic.

### Phones (under 760px)

- The strip keeps a 900px minimum width inside a sideways scroller with `direction: rtl`, so it opens on the most recent beats without script. The scrollbar is hidden.
- The page itself never scrolls sideways.
- Type steps down (name 40px, lead 26px, body 18.5px) and the top padding drops to 7vh.

### Favicon

- `public/icon.svg`: Newsreader's italic R, drawn as outlines because favicons can't load web fonts, in ink on paper with the crimson pen dot as its full stop. It switches to the dark palette with `prefers-color-scheme`.
- `public/apple-touch-icon.png`: a 180px light render of the same mark, inset so iOS's rounded corners never reach the dot.
- No rounded tile and no other colors. Change both files together.

## 6. Motion

- **Printing:** on load, a clip grows left to right over 3.4 s at a constant speed, so the trace prints like a recorder. The pen appears when it finishes and pulses every 1.6 s.
- **Reduced motion:** the strip appears fully drawn, the pen does not pulse, and link color changes are instant.
- Nothing else animates.

## 7. Do's and Don'ts

### Do:

- **Do** keep the strip anatomically accurate and keep `src/lib/__tests__/ecg.test.ts` passing.
- **Do** fold related moments into one caption rather than adding a sixteenth beat.
- **Do** keep crimson for the marker and pen, and the trace in ink.
- **Do** set everything in Newsreader, using size, italics and Secondary for hierarchy.
- **Do** keep captions in the reserved grid cell so selection never shifts the layout.
- **Do** clear WCAG AA in both themes.

### Don't:

- **Don't** add navigation, buttons, cards, icons, badges, section headings, monospace type or a theme toggle.
- **Don't** add shadows, rounded containers, gradients or tinted panels. The page is paper.
- **Don't** use em dashes anywhere in the copy (a test enforces this).
- **Don't** color the waveform, animate anything besides the print reveal and pen, or move the letter when a beat is selected.
- **Don't** let the page scroll sideways on phones; only the strip scrolls.
