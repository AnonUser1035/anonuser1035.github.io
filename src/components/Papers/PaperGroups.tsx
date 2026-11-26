import { Fragment } from 'react';

import {
  AUTHOR_KEY,
  PUBLICATION_GROUPS,
  type Publication,
} from '@/data/publications';

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

/** "Scientific Reports, 2025. In press." from the parts that exist. */
export function citationLine({ venue, year, status }: Publication): string {
  const where = [venue, year].filter(Boolean).join(', ');
  return [where, status]
    .filter(Boolean)
    .map((part) => `${part}.`)
    .join(' ');
}

function Entry({ item }: { item: Publication }) {
  return (
    <li className="paper">
      <p className="paper-title">
        {item.doi ? (
          <a href={`https://doi.org/${item.doi}`}>{item.title}</a>
        ) : (
          item.title
        )}
      </p>
      <Authors authors={item.authors} />
      <p className="paper-venue">{citationLine(item)}</p>
    </li>
  );
}

export default function PaperGroups() {
  return (
    <>
      {PUBLICATION_GROUPS.map((group) => (
        <section className="paper-group" key={group.name}>
          <h2>{group.name}</h2>
          <ul className="paper-list">
            {group.items.map((item) => (
              <Entry item={item} key={item.title} />
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
