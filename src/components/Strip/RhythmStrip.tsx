import { EVENT_MARKS, HINT, MILESTONES } from '@/data/content';
import {
  buildStrip,
  R_MARKER_Y,
  STRIP_HEIGHT_MM,
  STRIP_WIDTH_MM,
  type StripGeometry,
} from '@/lib/ecg';

import StripInteractive, { type StripItem } from './StripInteractive';

/** Seconds for the trace to print from the calibration pulse to the pen. */
const REVEAL_SECONDS = 3.4;
/** Extra clip width past the pen so the round line cap is never cut. */
const REVEAL_OVERHANG_MM = 1;
/** Event mark glyph: a small downward triangle printed at the top edge. */
const MARK_HALF_WIDTH_MM = 0.8;
const MARK_DEPTH_MM = 1.4;
/** Where the selection dot sits on an event mark, in mm from the top. */
const MARK_MARKER_Y = 1.6;

/**
 * Beats and event marks in chronological order. Each event mark sits in the
 * flat stretch between the beat it follows and the next one.
 */
function stripItems(geometry: StripGeometry): StripItem[] {
  const items: StripItem[] = [];

  MILESTONES.forEach((milestone, i) => {
    const beat = geometry.beats[i];
    items.push({ kind: 'beat', ...milestone, ...beat, y: R_MARKER_Y });

    const marks = EVENT_MARKS.filter((mark) => mark.after === milestone.label);
    if (marks.length > 1 || (marks.length && i === MILESTONES.length - 1)) {
      throw new Error(
        `Event marks after "${milestone.label}": use at most one per gap, and none after the last beat.`,
      );
    }
    for (const { label, text } of marks) {
      const x = beat.hitEnd;
      items.push({
        kind: 'mark',
        label,
        text,
        x,
        y: MARK_MARKER_Y,
        glyph: `M${x - MARK_HALF_WIDTH_MM} 0H${x + MARK_HALF_WIDTH_MM}L${x} ${MARK_DEPTH_MM}Z`,
      });
    }
  });

  const placed = items.filter((item) => item.kind === 'mark').length;
  if (placed !== EVENT_MARKS.length) {
    throw new Error(
      'Every event mark needs an "after" that matches a milestone label.',
    );
  }
  return items;
}

/**
 * Lead II rhythm strip, one beat per milestone, with event marks for smaller
 * moments. Geometry is computed here at build time; the client island only
 * moves the marker and caption.
 */
export default function RhythmStrip() {
  const geometry = buildStrip(MILESTONES.length);
  const items = stripItems(geometry);
  const revealWidth = geometry.pen.x + REVEAL_OVERHANG_MM;

  return (
    <StripInteractive
      items={items}
      hint={HINT}
      width={STRIP_WIDTH_MM}
      height={STRIP_HEIGHT_MM}
    >
      <defs>
        <clipPath id="strip-reveal">
          <rect
            className="strip-reveal"
            x={0}
            y={0}
            width={revealWidth}
            height={STRIP_HEIGHT_MM}
            style={{ animationDuration: `${REVEAL_SECONDS}s` }}
          />
        </clipPath>
      </defs>
      <path className="strip-grid strip-grid--minor" d={geometry.grid.minor} />
      <path className="strip-grid strip-grid--major" d={geometry.grid.major} />
      <path
        className="strip-trace"
        d={geometry.trace}
        clipPath="url(#strip-reveal)"
      />
      <circle
        className="strip-pen"
        cx={geometry.pen.x}
        cy={geometry.pen.y}
        r={0.65}
        style={{ animationDelay: `${REVEAL_SECONDS}s` }}
      />
    </StripInteractive>
  );
}
