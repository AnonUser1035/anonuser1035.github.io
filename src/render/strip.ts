/**
 * Lead II rhythm strip, one beat per milestone. All geometry is computed here
 * at build time; the inlined client script only moves the dot and caption.
 */
import { HINT, MILESTONES, type Milestone } from '../data/content.ts';
import {
  BASELINE_MM,
  beats,
  buildStrip,
  R_MARKER_Y,
  STRIP_HEIGHT_MM,
  STRIP_WIDTH_MM,
  toX,
} from '../lib/ecg.ts';
import { esc } from './html.ts';

/** Seconds for the trace to print from the calibration pulse to the pen. */
export const REVEAL_SECONDS = 3.4;
/** Extra clip width past the pen so the round line cap is never cut. */
const REVEAL_OVERHANG_MM = 1;

/** Round for output: 3 decimals, no trailing zeros. */
const fixed = (n: number, digits = 3) => String(Number(n.toFixed(digits)));
const pct = (mm: number) => `${fixed((mm / STRIP_WIDTH_MM) * 100, 4)}%`;

const captionText = (m: Milestone) =>
  `<span class="caption-label">${esc(m.label)}.</span> <span class="caption-text">${esc(m.text)}</span>`;

const hintText = `${esc(HINT.text)}<span class="hint-phone"> ${esc(HINT.phone)}</span>`;

export function strip() {
  const count = MILESTONES.length;
  const geometry = buildStrip(count);
  const timing = beats(count);
  const revealWidth = geometry.pen.x + REVEAL_OVERHANG_MM;

  const items = MILESTONES.map((milestone, i) => ({
    ...milestone,
    ...geometry.beats[i],
    // The clip grows linearly, so this is when the pen draws the R peak.
    printedAt: (REVEAL_SECONDS * geometry.beats[i].x) / revealWidth,
    pStart: toX(timing[i].pStart),
    tEnd: toX(timing[i].tEnd),
  }));

  const penStyle = `animation-delay:${REVEAL_SECONDS}s`;

  const svg =
    `<svg class="strip-svg" viewBox="0 0 ${STRIP_WIDTH_MM} ${STRIP_HEIGHT_MM}" aria-hidden="true" focusable="false">` +
    `<defs><clipPath id="strip-reveal"><rect class="strip-reveal" x="0" y="0" width="${fixed(revealWidth)}" height="${STRIP_HEIGHT_MM}" style="animation-duration:${REVEAL_SECONDS}s"/></clipPath></defs>` +
    `<path class="strip-grid strip-grid--minor" d="${geometry.grid.minor}"/>` +
    `<path class="strip-grid strip-grid--major" d="${geometry.grid.major}"/>` +
    `<g class="strip-ink"><path class="strip-trace" d="${geometry.trace}" clip-path="url(#strip-reveal)"/></g>` +
    `<circle class="strip-pen" cx="${fixed(geometry.pen.x)}" cy="${fixed(geometry.pen.y)}" r="0.65" style="${penStyle}"/>` +
    '<g class="strip-marks"></g>' +
    '</svg>';

  const ticks = items
    .filter((b) => b.tick)
    .map(
      (b) =>
        `<span class="strip-tick" style="left:${pct(b.x)}" aria-hidden="true">${esc(b.tick ?? '')}</span>`,
    )
    .join('');

  // One tab stop: the oldest beat takes focus first, arrow keys move from
  // there, and the strip script keeps tabindex on the last beat focused.
  const buttons = items
    .map((b, i) => {
      const style = `left:${pct(b.hitStart)};width:${pct(b.hitEnd - b.hitStart)};animation-delay:${fixed(b.printedAt)}s`;
      // R peak, P-wave onset and T-wave end (mm), for the dot and retrace.
      const data = `data-x="${fixed(b.x)}" data-p="${fixed(b.pStart)}" data-t="${fixed(b.tEnd)}"`;
      return `<button type="button" role="option" class="strip-beat" style="${style}" ${data} tabindex="${i === 0 ? 0 : -1}" aria-selected="false" aria-label="${esc(`${b.label}: ${b.text}`)}"></button>`;
    })
    .join('');

  // Invisible copies of every caption share the grid cell, so the box is
  // always as tall as the longest one and nothing below it moves.
  const sizers = [hintText, ...items.map(captionText)]
    .map(
      (html) =>
        `<p class="caption caption-sizer" aria-hidden="true">${html}</p>`,
    )
    .join('');

  return (
    '<div class="strip-frame"><div class="strip-scroller">' +
    `<div class="strip" role="listbox" aria-orientation="horizontal" aria-label="Milestones on the rhythm strip" data-marker-y="${fixed(R_MARKER_Y)}" data-baseline="${BASELINE_MM}">` +
    svg +
    '<span class="strip-print strip-print--lead" aria-hidden="true">II</span>' +
    '<span class="strip-print strip-print--speed" aria-hidden="true">25 mm/s</span>' +
    ticks +
    buttons +
    '</div></div></div>' +
    '<div class="caption-box column">' +
    '<p class="caption caption-current"></p>' +
    `<p class="caption caption-hint">${hintText}</p>` +
    sizers +
    '</div>'
  );
}
