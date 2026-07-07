import { Fragment } from 'react';

import { AUTHOR_KEY, type Publication } from '@/data/publications';

interface PublicationListProps {
  items: Publication[];
}

/** Render an author string, emphasizing the site owner's name. */
function Authors({ authors }: { authors: string }) {
  const parts = authors.split(AUTHOR_KEY);
  return (
    <span className="publication-authors">
      {parts.map((part, i) => (
        <Fragment key={`${part}-${i}`}>
          {part}
          {i < parts.length - 1 && <strong>{AUTHOR_KEY}</strong>}
        </Fragment>
      ))}
    </span>
  );
}

function Entry({ item }: { item: Publication }) {
  const href = item.url ?? (item.doi ? `https://doi.org/${item.doi}` : null);

  return (
    <li className="publication">
      {href ? (
        <a className="publication-title" href={href}>
          {item.title}
        </a>
      ) : (
        <span className="publication-title">{item.title}</span>
      )}
      <Authors authors={item.authors} />
      <span className="publication-meta">
        <span className="publication-venue">{item.venue}</span>
        {item.year && <span className="publication-year">{item.year}</span>}
        {item.status && (
          <span className="publication-status">{item.status}</span>
        )}
        {item.firstAuthor && (
          <span className="publication-badge">First author</span>
        )}
      </span>
      {item.doi && (
        <a className="publication-doi" href={`https://doi.org/${item.doi}`}>
          doi:{item.doi}
        </a>
      )}
    </li>
  );
}

export default function PublicationList({ items }: PublicationListProps) {
  return (
    <ol className="publication-list">
      {items.map((item) => (
        <Entry item={item} key={item.title} />
      ))}
    </ol>
  );
}
