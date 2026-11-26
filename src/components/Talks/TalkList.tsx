import { Fragment } from 'react';

import { AUTHOR_KEY, TALKS, type Talk } from '@/data/talks';

function Authors({ authors }: { authors: string }) {
  const parts = authors.split(AUTHOR_KEY);
  return (
    <p className="paper-authors">
      {parts.map((part, i) => (
        <Fragment key={`${part}-${i}`}>
          {part}
          {i < parts.length - 1 && <span className="me">{AUTHOR_KEY}</span>}
        </Fragment>
      ))}
    </p>
  );
}

/** "Venue, 2026. Poster. Award." from the parts that exist. */
export function citationLine({ venue, year, kind, award }: Talk): string {
  return [`${venue}, ${year}`, kind, award]
    .filter(Boolean)
    .map((part) => `${part}.`)
    .join(' ');
}

export default function TalkList() {
  return (
    <ul className="paper-list">
      {TALKS.map((talk) => (
        <li className="paper" key={talk.title}>
          <p className="paper-title">{talk.title}</p>
          <Authors authors={talk.authors} />
          <p className="paper-venue">{citationLine(talk)}</p>
        </li>
      ))}
    </ul>
  );
}
