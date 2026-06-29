import dayjs from 'dayjs';

import type { Position } from '@/data/resume/work';

interface CondensedJobProps {
  data: Position;
}

/** Compact year label: "2022" for same-year roles, "2023–24" for a range. */
function yearLabel(startDate: string, endDate?: string): string {
  const start = dayjs(startDate).year();
  if (!endDate) return `${start}–Present`;
  const end = dayjs(endDate).year();
  return start === end ? `${start}` : `${start}–${String(end).slice(-2)}`;
}

export default function CondensedJob({ data }: CondensedJobProps) {
  const { name, position, url, startDate, endDate } = data;

  return (
    <article className="job-condensed">
      <h3 className="job-condensed-heading">
        <a href={url}>{name}</a>
        <span className="job-condensed-role">{position}</span>
      </h3>
      <time className="job-condensed-date" dateTime={startDate}>
        {yearLabel(startDate, endDate)}
      </time>
    </article>
  );
}
