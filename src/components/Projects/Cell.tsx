'use client';

import dayjs from 'dayjs';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { Project } from '@/data/projects';

interface CellProps {
  data: Project;
}

// Gap between the cursor and the floating preview thumbnail.
const PREVIEW_OFFSET = 20;

export default function Cell({ data }: CellProps) {
  const { title, subtitle, link, preview, linkLabel, date, desc, tech } = data;

  const hasLink = Boolean(link);
  // Internal routes navigate client-side via <Link>; external demos open in a
  // new tab via <a>.
  const isInternal = Boolean(link?.startsWith('/'));
  const canPreview = Boolean(link && preview);

  const actionLabel = linkLabel ?? (isInternal ? 'Open' : 'Visit');
  const arrow = isInternal ? '→' : '↗';

  const previewRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  // Pointer-only flourish; following is disabled under reduced-motion.
  const canHover = useRef(false);
  const follows = useRef(true);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia === 'function') {
      canHover.current = window.matchMedia(
        '(hover: hover) and (pointer: fine)',
      ).matches;
      follows.current = !window.matchMedia('(prefers-reduced-motion: reduce)')
        .matches;
    }
    return () => {
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const positionPreview = useCallback((clientX: number, clientY: number) => {
    const el = previewRef.current;
    if (!el) return;
    const width = el.offsetWidth;
    // Flip to the left of the cursor near the right edge so it never clips.
    const flip = clientX + PREVIEW_OFFSET + width > window.innerWidth;
    const x = flip
      ? clientX - PREVIEW_OFFSET - width
      : clientX + PREVIEW_OFFSET;
    el.style.transform = `translate(${x}px, ${clientY + PREVIEW_OFFSET}px)`;
  }, []);

  const handleEnter = useCallback(
    (e: React.PointerEvent) => {
      if (!canPreview || !canHover.current) return;
      if (preview) setPreviewSrc((src) => src ?? preview); // load on first intent
      positionPreview(e.clientX, e.clientY);
      setPreviewVisible(true);
    },
    [canPreview, preview, positionPreview],
  );

  const handleMove = useCallback(
    (e: React.PointerEvent) => {
      if (!previewVisible || !follows.current) return;
      const { clientX, clientY } = e;
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() =>
        positionPreview(clientX, clientY),
      );
    },
    [previewVisible, positionPreview],
  );

  const handleLeave = useCallback(() => setPreviewVisible(false), []);

  const ariaLabel = isInternal
    ? `${title}${subtitle ? `, ${subtitle}` : ''}`
    : `${title}${subtitle ? `, ${subtitle}` : ''} (opens in a new tab)`;

  const body = (
    <article className="project-record-body">
      <header className="project-record-header">
        <h3 className="project-record-title">{title}</h3>
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
        href={link}
        aria-label={ariaLabel}
        className="project-record project-record--link"
        onPointerEnter={handleEnter}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
      >
        {body}
        {previewNode}
      </Link>
    );
  }

  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className="project-record project-record--link"
        onPointerEnter={handleEnter}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
      >
        {body}
        {previewNode}
      </a>
    );
  }

  return <div className="project-record">{body}</div>;
}
