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
  grid-minor: 'rgb(204 70 98 / 0.13)'
  grid-major: 'rgb(204 70 98 / 0.3)'
  marker: '#c1121f'
  paper-dark: '#121419'
  ink-dark: '#e7e8ec'
  secondary-dark: '#c0c3ca'
  muted-dark: '#8a8e97'
  rule-dark: '#30333a'
  navy-dark: '#a4bae6'
  strip-paper-dark: '#1b1a20'
  grid-minor-dark: 'rgb(236 120 140 / 0.1)'
  grid-major-dark: 'rgb(236 120 140 / 0.24)'
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

<!-- impeccable:design-map -->

Name: ryanbohluli.com
Colors: paper #faf8f5, ink #1d2129, secondary #454a54, muted #6a6e78, rule #d8d9de, navy #23406e, strip-paper #fcf1f2, grid-minor rgb(204 70 98 / 0.13), grid-major rgb(204 70 98 / 0.3), marker #c1121f, paper-dark #121419, ink-dark #e7e8ec (+8 more in the frontmatter)
Fonts: Newsreader (display, lead, body, signature, caption, small, year-label, print)
Spacing: gutter-left max(22px, 17vw), gutter-right 22px, measure 35rem, strip-max 1680px, name-gap 32px, caption-gap 16px, paragraph 1em, section 3em, page-top 11vh, page-bottom 12vh
Radius: none 0px, focus 2px
North Star: "A letter on ECG letterhead"
Rules:

- The Crimson Rule. Crimson means "this beat" or "the pen".
- The Ink Trace Rule. The waveform is ink in both themes.
- The One Family Rule. Hierarchy comes from size, italics and color within Newsreader.
- The No Headings Rule. The letter has no section headings.
  Don't:
- Don't add navigation, buttons, cards, icons, badges, section headings, monospace type or a theme toggle.
- Don't add shadows, rounded containers, gradients or tinted panels.
- Don't use em dashes anywhere in the copy (a test enforces this).
- Don't color the waveform, animate anything besides the print reveal and pen, or move the letter when a beat is selected.
- Don't let the page scroll sideways on phones; only the strip scrolls.
  Do:
- Do keep the strip anatomically accurate and keep `src/lib/__tests__/ecg.test.ts` passing.
- Do fold related moments into one caption rather than adding a sixteenth beat.
- Do keep crimson for the marker and pen, and the trace in ink.
- Do set everything in Newsreader, using size, italics and Secondary for hierarchy.
- Do keep captions in the reserved grid cell so selection never shifts the layout.
- Do clear WCAG AA in both themes.
  Map: src/styles/tokens.css
  Map: public/icon.svg
  Map: public/apple-touch-icon.png
  Map: src/lib/**tests**/ecg.test.ts
  Full: .impeccable/design-full.md (read a section when you need its detail)
