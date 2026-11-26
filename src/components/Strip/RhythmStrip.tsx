import { HINT, MILESTONES } from '@/data/content';
import {
  buildStrip,
  R_MARKER_Y,
  STRIP_HEIGHT_MM,
  STRIP_WIDTH_MM,
} from '@/lib/ecg';

import StripInteractive from './StripInteractive';

/** Seconds for the trace to print from the calibration pulse to the pen. */
const REVEAL_SECONDS = 3.4;
/** Extra clip width past the pen so the round line cap is never cut. */
const REVEAL_OVERHANG_MM = 1;

/**
 * Lead II rhythm strip, one beat per milestone. Geometry is computed here at
 * build time; the client island only moves the marker and caption.
 */
export default function RhythmStrip() {
  const geometry = buildStrip(MILESTONES.length);
  const revealWidth = geometry.pen.x + REVEAL_OVERHANG_MM;
  const beats = MILESTONES.map((milestone, i) => ({
    ...milestone,
    ...geometry.beats[i],
  }));

  return (
    <StripInteractive
      beats={beats}
      hint={HINT}
      width={STRIP_WIDTH_MM}
      height={STRIP_HEIGHT_MM}
      markerY={R_MARKER_Y}
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
