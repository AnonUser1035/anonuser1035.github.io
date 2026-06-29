import dayjs from 'dayjs';

import type { Position } from '@/data/resume/work';

import JobSummary from './JobSummary';

interface JobProps {
  data: Position;
}

export default function Job({ data }: JobProps) {
  const { name, position, url, startDate, endDate, summary, highlights } = data;

  return (
    <article className="jobs-container">
      <header className="jobs-header">
        <div className="jobs-headline">
          <h3>
            <a href={url}>{name}</a>
          </h3>
          <p className="daterange">
            <time dateTime={startDate}>
              {dayjs(startDate).format('MMMM YYYY')}
            </time>
            {' – '}
            {endDate ? (
              <time dateTime={endDate}>
                {dayjs(endDate).format('MMMM YYYY')}
              </time>
            ) : (
              'Present'
            )}
          </p>
        </div>
        <p className="role">{position}</p>
      </header>
      {summary ? <JobSummary summary={summary} /> : null}
      {highlights ? (
        <ul className="points">
          {highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
