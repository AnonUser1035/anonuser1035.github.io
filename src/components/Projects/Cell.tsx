'use client';

import dayjs from 'dayjs';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { Project } from '@/data/projects';

interface CellProps {
  data: Project;
  /**
   * Heading level for the project title. Defaults to h3 (titles sit under the
   * h2 group labels); pass 'h2' when the page hides group labels so the
   * heading outline doesn't skip from the page h1 straight to h3.
   */
  headingLevel?: 'h2' | 'h3';
}

// Gap between the cursor and the floating preview thumbnail.
const PREVIEW_OFFSET = 20;
// How long the cursor must rest on an entry before the preview appears.
const DWELL_MS = 450;

export default function Cell({ data, headingLevel = 'h3' }: CellProps) {
  const { title, subtitle, link, preview, linkLabel, date, desc, tech } = data;
  const TitleHeading = headingLevel;

  const hasLink = Boolean(link);
  // Internal routes navigate client-side via <Link>; external demos open in a
  // new tab via <a>.
  const isInternal = Boolean(link?.startsWith('/'));
  const canPreview = Boolean(link && preview);

  const actionLabel = linkLabel ?? (isInternal ? 'Open' : 'Visit');
  const arrow = isInternal ? '→' : '↗';

  const rootRef = useRef<HTMLElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  // Mirror visibility into a ref so the native move listener reads it live.
  const visibleRef = useRef(false);
  visibleRef.current = previewVisible;

  const setRoot = useCallback((node: HTMLElement | null) => {
    rootRef.current = node;
  }, []);

  // Native pointer listeners (rather than React's synthetic onPointerMove) so
  // high-frequency moves reliably restart the dwell timer and the follow loop
  // stays off the React render path. Pointer-only; touch devices just navigate.
  useEffect(() => {
    if (!canPreview || typeof window.matchMedia !== 'function') return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches)
      return;
    const follows = !window.matchMedia('(prefers-reduced-motion: reduce)')
      .matches;

    const el = rootRef.current;
    if (!el) return;

    const last = { x: 0, y: 0 };
    let frame: number | null = null;
    let dwell: number | null = null;

    const position = () => {
      const node = previewRef.current;
      if (!node) return;
      const width = node.offsetWidth;
      // Flip to the left of the cursor near the right edge so it never clips.
      const flip = last.x + PREVIEW_OFFSET + width > window.innerWidth;
      const x = flip
        ? last.x - PREVIEW_OFFSET - width
        : last.x + PREVIEW_OFFSET;
      node.style.transform = `translate(${x}px, ${last.y + PREVIEW_OFFSET}px)`;
    };

    const clearDwell = () => {
      if (dwell != null) {
        clearTimeout(dwell);
        dwell = null;
      }
    };

    const scheduleDwell = () => {
      clearDwell();
      dwell = window.setTimeout(() => {
        position();
        setPreviewVisible(true);
      }, DWELL_MS);
    };

    const onEnter = (e: PointerEvent) => {
      if (preview) setPreviewSrc((src) => src ?? preview); // load on first intent
      last.x = e.clientX;
      last.y = e.clientY;
      scheduleDwell();
    };

    const onMove = (e: PointerEvent) => {
      last.x = e.clientX;
      last.y = e.clientY;
      if (visibleRef.current) {
        if (!follows) return;
        if (frame != null) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(position);
      } else {
        // Still moving — restart the dwell timer so the peek waits for a pause.
        scheduleDwell();
      }
    };

    const onLeave = () => {
      clearDwell();
      if (frame != null) cancelAnimationFrame(frame);
      setPreviewVisible(false);
    };

    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      clearDwell();
      if (frame != null) cancelAnimationFrame(frame);
    };
  }, [canPreview, preview]);

  const ariaLabel = isInternal
    ? `${title}${subtitle ? `, ${subtitle}` : ''}`
    : `${title}${subtitle ? `, ${subtitle}` : ''} (opens in a new tab)`;

  const body = (
    <article className="project-record-body">
      <header className="project-record-header">
        <TitleHeading className="project-record-title">{title}</TitleHeading>
        <time className="project-record-date" dateTime={date}>
          {dayjs(date).format('YYYY')}
        </time>
      </header>

      {subtitle && <p className="project-record-subtitle">{subtitle}</p>}

      <p className="project-record-desc">{desc}</p>

      <div className="project-record-meta">
        {tech && tech.length > 0 && (
          <ul className="project-record-tech">
            {tech.map((t) => (
              <li key={t} className="tech-tag">
                {t}
              </li>
            ))}
          </ul>
        )}
        {hasLink && (
          <span className="project-record-action">
            {actionLabel}
            <span className="project-record-arrow" aria-hidden="true">
              {arrow}
            </span>
          </span>
        )}
      </div>
    </article>
  );

  const previewNode = canPreview ? (
    <div
      ref={previewRef}
      className={`project-preview ${previewVisible ? 'is-visible' : ''}`}
      aria-hidden="true"
    >
      {/* biome-ignore lint/performance/noImgElement: decorative fixed-position
          preview that follows the cursor; next/image's layout model fights the
          transform-based positioning and offers no benefit here. */}
      {previewSrc && <img src={previewSrc} alt="" />}
    </div>
  ) : null;

  if (link && isInternal) {
    return (
      <Link
        ref={setRoot}
        href={link}
        aria-label={ariaLabel}
        className="project-record project-record--link"
      >
        {body}
        {previewNode}
      </Link>
    );
  }

  if (link) {
    return (
      <a
        ref={setRoot}
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className="project-record project-record--link"
      >
        {body}
        {previewNode}
      </a>
    );
  }

  return <div className="project-record">{body}</div>;
}
