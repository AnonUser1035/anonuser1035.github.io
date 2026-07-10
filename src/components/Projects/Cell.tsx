import dayjs from 'dayjs';
import Link from 'next/link';

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

export default function Cell({ data, headingLevel = 'h3' }: CellProps) {
  const { title, subtitle, link, linkLabel, date, desc } = data;
  const TitleHeading = headingLevel;

  const hasLink = Boolean(link);
  // Internal routes navigate client-side via <Link>; external demos open in a
  // new tab via <a>.
  const isInternal = Boolean(link?.startsWith('/'));

  const actionLabel = linkLabel ?? (isInternal ? 'Open' : 'Visit');
  const arrow = isInternal ? '→' : '↗';

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

  if (link && isInternal) {
    return (
      <Link
        href={link}
        aria-label={ariaLabel}
        className="project-record project-record--link"
      >
        {body}
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
      >
        {body}
      </a>
    );
  }

  return <div className="project-record">{body}</div>;
}
