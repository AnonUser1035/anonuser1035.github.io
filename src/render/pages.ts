/** The three pages: the letter, /talks/, and the 404. */
import {
  FOOTER,
  LEAD,
  LETTER,
  type LetterBlock,
  NAME,
  PROFILES,
  SIGNATURE,
} from '../data/content.ts';
import { AUTHOR_KEY, TALKS, type Talk } from '../data/talks.ts';
import { SITE_URL } from '../site.ts';
import { esc, inline, jsonLd } from './html.ts';
import { strip } from './strip.ts';

const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: NAME,
  // Keeps search engines linking the pre-middle-initial name to this profile.
  alternateName: 'Ryan Bohluli',
  url: SITE_URL,
  image: `${SITE_URL}/images/portrait.jpg`,
  sameAs: [PROFILES.linkedin, PROFILES.scholar, PROFILES.orcid],
  affiliation: {
    '@type': 'CollegeOrUniversity',
    name: 'Johns Hopkins University',
    url: 'https://www.jhu.edu/',
  },
};

function block(item: LetterBlock): string {
  if (typeof item === 'string') return `<p>${inline(item)}</p>`;
  const works = item.works
    .map(
      (w) =>
        `<li><a href="${esc(w.href)}">${esc(w.title)}</a><span class="venue">${esc(w.venue)}</span></li>`,
    )
    .join('');
  return `<p class="work-intro">${esc(item.intro)}</p><ul class="selected-work">${works}</ul>`;
}

/** "November 2026": when the letter was last built, in Dallas time. */
export const dated = (now: Date) =>
  now.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Chicago',
  });

export function home(now: Date): string {
  return (
    '<main class="page">' +
    jsonLd(person) +
    `<h1 class="name column">${esc(NAME)}</h1>` +
    strip() +
    '<div class="letter column">' +
    `<p class="lead">${esc(LEAD)}</p>` +
    LETTER.map(block).join('') +
    '</div>' +
    // Signed off with a small mounted portrait beside the name and dateline.
    '<footer class="closing column"><div class="sign-off">' +
    `<img class="portrait" src="/images/portrait-small.jpg" width="120" height="150" alt="Portrait of ${esc(NAME)}" loading="lazy" decoding="async">` +
    `<div><p class="signature">${esc(SIGNATURE)}</p>` +
    `<p class="dateline">${esc(`${FOOTER}, ${dated(now)}`)}</p></div>` +
    '</div></footer>' +
    '</main>'
  );
}

/** "Venue, 2026. Poster. Award." from the parts that exist. */
export function citationLine({ venue, year, kind, award }: Talk): string {
  return [`${venue}, ${year}`, kind, award]
    .filter(Boolean)
    .map((part) => `${part}.`)
    .join(' ');
}

const authors = (list: string) =>
  list
    .split(AUTHOR_KEY)
    .map(esc)
    .join(`<span class="me">${esc(AUTHOR_KEY)}</span>`);

const nameLink = `<p class="name"><a href="/">${esc(NAME)}</a></p>`;

export function talks(): string {
  const items = TALKS.map(
    (talk) =>
      '<li class="paper">' +
      `<p class="paper-title">${talk.href ? `<a href="${esc(talk.href)}">${esc(talk.title)}</a>` : esc(talk.title)}</p>` +
      `<p class="paper-authors">${authors(talk.authors)}</p>` +
      `<p class="paper-venue">${esc(citationLine(talk))}</p>` +
      '</li>',
  ).join('');
  return (
    '<main class="page page--papers"><div class="column">' +
    nameLink +
    '<h1 class="paper-group-name">Talks and posters</h1>' +
    `<p class="talks-note">${inline(`Publications are on [Google Scholar](${PROFILES.scholar}) and [ORCID](${PROFILES.orcid}).`)}</p>` +
    `<ul class="paper-list">${items}</ul>` +
    '</div></main>'
  );
}

export function notFound(): string {
  return (
    '<main class="page page--papers"><div class="column">' +
    nameLink +
    '<p class="body-text">The page you’re looking for doesn’t exist or has been moved.</p>' +
    '</div></main>'
  );
}

export function sitemap(lastModified: Date): string {
  const url = (loc: string, priority: number) =>
    `<url><loc>${loc}</loc><lastmod>${lastModified.toISOString()}</lastmod><changefreq>monthly</changefreq><priority>${priority}</priority></url>`;
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    url(SITE_URL, 1) +
    url(`${SITE_URL}/talks/`, 0.6) +
    '</urlset>\n'
  );
}
