'use client';

import type { CSSProperties, PointerEvent, ReactNode } from 'react';
import { useState } from 'react';

export interface StripBeat {
  /** R peak, mm. */
  x: number;
  /** Interactive region, mm. */
  hitStart: number;
  hitEnd: number;
  label: string;
  text: string;
  tick?: string;
  /** Seconds into the print animation when the trace reaches this R peak. */
  revealAt: number;
}

interface StripInteractiveProps {
  beats: StripBeat[];
  width: number;
  height: number;
  markerY: number;
  /** Static SVG content: grid, trace and pen. */
  children: ReactNode;
}

const percent = (mm: number, width: number) => `${(mm / width) * 100}%`;

/**
 * Selection layer for the rhythm strip. Hover, focus or tap picks a beat; the
 * only things that change are the R-peak marker and the caption.
 */
export default function StripInteractive({
  beats,
  width,
  height,
  markerY,
  children,
}: StripInteractiveProps) {
  const [selected, setSelected] = useState(beats.length - 1);
  const [touched, setTouched] = useState(false);
  const beat = beats[selected];

  const select = (index: number) => {
    setSelected(index);
    setTouched(true);
  };

  // Touch pointers select on tap (click) so that dragging the strip to
  // scroll never changes the caption.
  const hover = (index: number) => (event: PointerEvent) => {
    if (event.pointerType !== 'touch') select(index);
  };

  return (
    <>
      <div className="strip-frame">
        <div className="strip-scroller">
          <div className="strip" role="group" aria-label="Rhythm strip">
            <svg
              className="strip-svg"
              viewBox={`0 0 ${width} ${height}`}
              aria-hidden="true"
              focusable="false"
            >
              {children}
              <circle
                className={touched ? 'strip-marker is-touched' : 'strip-marker'}
                cx={beat.x}
                cy={markerY}
                r={1}
                style={
                  { '--marker-delay': `${beat.revealAt}s` } as CSSProperties
                }
              />
            </svg>

            <span className="strip-print strip-print--lead" aria-hidden="true">
              II
            </span>
            <span className="strip-print strip-print--speed" aria-hidden="true">
              25 mm/s
            </span>

            {beats.map(
              (b) =>
                b.tick && (
                  <span
                    key={b.tick}
                    className="strip-tick"
                    style={{ left: percent(b.x, width) }}
                    aria-hidden="true"
                  >
                    {b.tick}
                  </span>
                ),
            )}

            {beats.map((b, i) => (
              <button
                key={b.label + b.x}
                type="button"
                className="strip-beat"
                style={{
                  left: percent(b.hitStart, width),
                  width: percent(b.hitEnd - b.hitStart, width),
                }}
                aria-label={`${b.label}: ${b.text}`}
                aria-current={i === selected ? 'true' : undefined}
                onPointerEnter={hover(i)}
                onFocus={() => select(i)}
                onClick={() => select(i)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="caption-box column">
        <p className="caption" aria-live="polite">
          <span className="caption-label">{beat.label}.</span>{' '}
          <span className="caption-text">{beat.text}</span>
        </p>
        {/* Invisible copies of every caption share the grid cell, so the box
            is always as tall as the longest one and nothing below it moves. */}
        {beats.map((b) => (
          <p
            key={b.label + b.x}
            className="caption caption-sizer"
            aria-hidden="true"
          >
            <span className="caption-label">{b.label}.</span>{' '}
            <span className="caption-text">{b.text}</span>
          </p>
        ))}
      </div>
    </>
  );
}
