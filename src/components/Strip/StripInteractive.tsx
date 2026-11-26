'use client';

import type { FocusEvent, PointerEvent, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

interface ItemBase {
  label: string;
  text: string;
  /** Position of the selection dot, mm. */
  x: number;
  y: number;
}

export interface BeatItem extends ItemBase {
  kind: 'beat';
  /** Interactive region, mm. */
  hitStart: number;
  hitEnd: number;
  tick?: string;
}

export interface MarkItem extends ItemBase {
  kind: 'mark';
  /** SVG path for the printed mark, hidden while the dot sits on it. */
  glyph: string;
}

export type StripItem = BeatItem | MarkItem;

interface StripInteractiveProps {
  items: StripItem[];
  hint: { text: string; phone: string };
  width: number;
  height: number;
  /** Static SVG content: grid, trace and pen. */
  children: ReactNode;
}

const percent = (mm: number, width: number) => `${(mm / width) * 100}%`;

function CaptionText({ item }: { item: StripItem }) {
  return (
    <>
      <span className="caption-label">{item.label}.</span>{' '}
      <span className="caption-text">{item.text}</span>
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
 * Selection layer for the rhythm strip. Until something is selected the
 * caption shows a hint. Hover, focus or tap picks a beat or event mark; the
 * only things that change are the selection dot and the caption.
 */
export default function StripInteractive({
  items,
  hint,
  width,
  height,
  children,
}: StripInteractiveProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const item = selected === null ? null : items[selected];

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
              {items.map(
                (it, i) =>
                  it.kind === 'mark' &&
                  i !== selected && (
                    <path
                      key={it.label + it.x}
                      className="strip-event-glyph"
                      d={it.glyph}
                    />
                  ),
              )}
              {item && (
                <circle
                  className="strip-marker"
                  cx={item.x}
                  cy={item.y}
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

            {items.map(
              (it) =>
                it.kind === 'beat' &&
                it.tick && (
                  <span
                    key={it.tick}
                    className="strip-tick"
                    style={{ left: percent(it.x, width) }}
                    aria-hidden="true"
                  >
                    {it.tick}
                  </span>
                ),
            )}

            {items.map((it, i) => (
              <button
                key={it.kind + it.label + it.x}
                type="button"
                className={it.kind === 'beat' ? 'strip-beat' : 'strip-event'}
                style={
                  it.kind === 'beat'
                    ? {
                        left: percent(it.hitStart, width),
                        width: percent(it.hitEnd - it.hitStart, width),
                      }
                    : { left: percent(it.x, width) }
                }
                aria-label={`${it.label}: ${it.text}`}
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
          {item && <CaptionText item={item} />}
        </p>
        <p className="caption caption-hint" hidden={item !== null}>
          <HintText hint={hint} />
        </p>
        {/* Invisible copies of every caption share the grid cell, so the box
            is always as tall as the longest one and nothing below it moves. */}
        <p className="caption caption-sizer" aria-hidden="true">
          <HintText hint={hint} />
        </p>
        {items.map((it) => (
          <p
            key={it.kind + it.label + it.x}
            className="caption caption-sizer"
            aria-hidden="true"
          >
            <CaptionText item={it} />
          </p>
        ))}
      </div>
    </>
  );
}
