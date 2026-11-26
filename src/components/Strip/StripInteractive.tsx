'use client';

import type { FocusEvent, PointerEvent, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

export interface StripBeat {
  /** R peak, mm. */
  x: number;
  /** Interactive region, mm. */
  hitStart: number;
  hitEnd: number;
  /** Seconds after load when the pen draws this R peak. */
  printedAt: number;
  label: string;
  text: string;
  tick?: string;
}

interface StripInteractiveProps {
  beats: StripBeat[];
  hint: { text: string; phone: string };
  width: number;
  height: number;
  /** y of the selection dot on an R peak, mm. */
  markerY: number;
  /** Static SVG content: grid, trace and pen. */
  children: ReactNode;
}

const percent = (mm: number, width: number) => `${(mm / width) * 100}%`;

function CaptionText({ beat }: { beat: StripBeat }) {
  return (
    <>
      <span className="caption-label">{beat.label}.</span>{' '}
      <span className="caption-text">{beat.text}</span>
    </>
  );
}

function HintText({ hint }: { hint: StripInteractiveProps['hint'] }) {
  return (
    <>
      {hint.text}
      <span className="hint-phone"> {hint.phone}</span>
    </>
  );
}

/**
 * Selection layer for the rhythm strip. Until a beat is selected the caption
 * shows a hint. Hover, focus or tap picks a beat; the only things that change
 * are the dot on its R peak and the caption.
 */
export default function StripInteractive({
  beats,
  hint,
  width,
  height,
  markerY,
  children,
}: StripInteractiveProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const beat = selected === null ? null : beats[selected];

  // On touch screens there is no hover to leave, so a tap anywhere outside
  // the strip returns the caption to the hint.
  useEffect(() => {
    const onPointerDown = (event: globalThis.PointerEvent) => {
      const strip = stripRef.current;
      if (
        event.pointerType === 'touch' &&
        strip &&
        !strip.contains(event.target as Node)
      ) {
        setSelected(null);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  // Touch pointers select on tap (click), so dragging the strip to scroll
  // never changes the caption.
  const hover = (index: number) => (event: PointerEvent) => {
    if (event.pointerType !== 'touch') setSelected(index);
  };

  const leave = (event: PointerEvent) => {
    if (event.pointerType !== 'touch') setSelected(null);
  };

  const blur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setSelected(null);
    }
  };

  return (
    <>
      <div className="strip-frame">
        <div className="strip-scroller">
          <div
            ref={stripRef}
            className="strip"
            role="group"
            aria-label="Rhythm strip"
            onPointerLeave={leave}
            onBlur={blur}
          >
            <svg
              className="strip-svg"
              viewBox={`0 0 ${width} ${height}`}
              aria-hidden="true"
              focusable="false"
            >
              {children}
              {beat && (
                <circle
                  className="strip-marker"
                  cx={beat.x}
                  cy={markerY}
                  r={1}
                />
              )}
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
                  animationDelay: `${b.printedAt.toFixed(3)}s`,
                }}
                aria-label={`${b.label}: ${b.text}`}
                aria-current={i === selected ? 'true' : undefined}
                onPointerEnter={hover(i)}
                onFocus={() => setSelected(i)}
                onClick={() => setSelected(i)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="caption-box column">
        <p className="caption" aria-live="polite">
          {beat && <CaptionText beat={beat} />}
        </p>
        <p className="caption caption-hint" hidden={beat !== null}>
          <HintText hint={hint} />
        </p>
        {/* Invisible copies of every caption share the grid cell, so the box
            is always as tall as the longest one and nothing below it moves. */}
        <p className="caption caption-sizer" aria-hidden="true">
          <HintText hint={hint} />
        </p>
        {beats.map((b) => (
          <p
            key={b.label + b.x}
            className="caption caption-sizer"
            aria-hidden="true"
          >
            <CaptionText beat={b} />
          </p>
        ))}
      </div>
    </>
  );
}
