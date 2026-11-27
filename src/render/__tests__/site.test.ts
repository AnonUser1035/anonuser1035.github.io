import { describe, expect, it } from 'vitest';

import { EMAIL, NAME, PROFILES } from '../../data/content.ts';
import { TALKS } from '../../data/talks.ts';
import { SITE_URL } from '../../site.ts';
import { jsonLd } from '../html.ts';
import { citationLine, dated } from '../pages.ts';
import { renderSite } from '../site.ts';

const site = renderSite({ now: new Date('2026-11-26T00:00:00Z') });
const parse = (html: string) =>
  new DOMParser().parseFromString(html, 'text/html');
const home = parse(site['index.html']);
const talks = parse(site['talks/index.html']);
const notFound = parse(site['404.html']);
const meta = (doc: Document, key: string) =>
  doc
    .querySelector(`meta[name="${key}"], meta[property="${key}"]`)
    ?.getAttribute('content');

describe('the letter', () => {
  const href = (text: string) =>
    [...home.querySelectorAll('a')]
      .find((a) => a.textContent === text)
      ?.getAttribute('href');

  it('uses descriptive link text throughout', () => {
    expect(href('Thakor Lab')).toBe('https://neuroengineering.bme.jhu.edu/');
    expect(href('Neuro Safety Systems')).toBe(
      'https://neurosafetysystems.com/',
    );
    expect(href('how it started')).toBe(
      'https://engineering.jhu.edu/magazine/inquiring-minds/change-agents/fighting-fatigue-on-the-road/',
    );
    expect(href('All publications')).toBe(PROFILES.scholar);
    expect(href('ORCID')).toBe(PROFILES.orcid);
    expect(href('talks and posters')).toBe('/talks/');
    expect(href(EMAIL)).toBe(`mailto:${EMAIL}`);
    expect(href('LinkedIn')).toBe(PROFILES.linkedin);
    expect(href('résumé (PDF)')).toBe('/resume.pdf');
    expect(href('here')).toBeUndefined();
  });

  it('lists four selected works, newest first, with DOI links', () => {
    expect(home.querySelector('.work-intro')?.textContent).toBe(
      'Selected work:',
    );
    const items = [...home.querySelectorAll('.selected-work li')];
    expect(
      items.map((li) => li.querySelector('a')?.getAttribute('href')),
    ).toEqual([
      'https://doi.org/10.64898/2026.11.18.767417',
      'https://doi.org/10.1038/s41551-026-01777-6',
      'https://doi.org/10.1115/1.4072357',
      'https://doi.org/10.1115/DMD2026-1020',
    ]);
    expect(items[0].querySelector('.venue')?.textContent).toMatch(
      'bioRxiv preprint',
    );
  });

  it('keeps the letter short: no P.S., Cho Lab, COACH or tools paragraph', () => {
    const letter = home.querySelector('.letter');
    expect(letter?.querySelector('.postscript')).toBeNull();
    expect(letter?.textContent).not.toMatch(/Cho Lab|COACH|P\.S\.|small tools/);
  });

  it('signs off and says where and when it was written', () => {
    const footer = home.querySelector('footer');
    expect(footer?.querySelector('.signature')?.textContent).toBe('Ryan');
    expect(footer?.querySelector('.dateline')?.textContent).toBe(
      'Written in Dallas, TX, November 2026',
    );
  });

  it('signs off beside a small portrait that loads last', () => {
    const img = home.querySelector('.sign-off img.portrait');
    expect(img?.getAttribute('src')).toBe('/images/portrait-small.jpg');
    expect(img?.getAttribute('alt')).toBe(`Portrait of ${NAME}`);
    expect(img?.getAttribute('loading')).toBe('lazy');
    expect(img?.nextElementSibling?.querySelector('.signature')).not.toBeNull();
  });

  it('dates the letter in Dallas time', () => {
    expect(dated(new Date('2026-12-01T03:00:00Z'))).toBe('November 2026');
    expect(dated(new Date('2026-12-01T07:00:00Z'))).toBe('December 2026');
  });

  it('says up front that Ryan is an undergraduate applying to medical school', () => {
    const text = home.querySelector('.letter')?.textContent ?? '';
    expect(text).toContain(
      'I’m a senior at Johns Hopkins studying neuroscience.',
    );
    expect(text).toContain('I’m applying to medical school');
    expect(text).toContain('from Johns Hopkins Engineering.');
  });

  it('describes a schema.org Person affiliated with Johns Hopkins', () => {
    const script = home.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script?.textContent ?? '{}');
    expect(data).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: NAME,
      url: SITE_URL,
      image: `${SITE_URL}/images/portrait.jpg`,
      affiliation: {
        '@type': 'CollegeOrUniversity',
        name: 'Johns Hopkins University',
      },
    });
    expect(data.sameAs).toEqual([
      PROFILES.linkedin,
      PROFILES.scholar,
      PROFILES.orcid,
    ]);
    expect(JSON.stringify(data)).not.toMatch(/github/i);
    expect(JSON.stringify(data)).not.toMatch(/Chief Research Officer/);
  });

  it('escapes < in structured data so it can never close the script', () => {
    const html = jsonLd({ headline: '</script><script>alert(1)</script>' });
    expect(html.slice(0, -'</script>'.length)).not.toContain('</script>');
    expect(html).toContain('\\u003c');
  });
});

describe('/talks/', () => {
  it('lists every talk and poster with Bohluli RS at weight 500', () => {
    const entries = talks.querySelectorAll('.paper');
    expect(entries).toHaveLength(TALKS.length);
    for (const entry of entries) {
      expect(entry.querySelector('.paper-authors .me')?.textContent).toBe(
        'Bohluli RS',
      );
    }
  });

  it('gives every entry a format and a full author list', () => {
    for (const talk of TALKS) {
      expect(talk.kind).toBe('Poster');
      expect(talk.authors).not.toMatch(/et al/);
    }
  });

  it('links both focused-ultrasound posters to the published paper', () => {
    const links = [...talks.querySelectorAll('.paper-title a')].map((a) =>
      a.getAttribute('href'),
    );
    expect(links).toEqual([
      'https://doi.org/10.1115/DMD2026-1020',
      'https://doi.org/10.1115/DMD2026-1020',
    ]);
  });

  it('shows the poster award on its entry', () => {
    expect(talks.querySelector('.paper-venue')?.textContent).toBe(
      'Johns Hopkins Neurosurgery Research Day (Synapse Summit), 2026. Poster. Best Poster in Functional Neurosurgery.',
    );
  });

  it('formats the citation line from the parts that exist', () => {
    expect(
      citationLine({
        title: '',
        authors: '',
        venue: 'Yale Bouchet Conference',
        year: '2026',
      }),
    ).toBe('Yale Bouchet Conference, 2026.');
  });
});

describe('metadata', () => {
  it('titles the homepage with the name and points og:url at the root', () => {
    expect(home.title).toBe(NAME);
    expect(meta(home, 'og:url')).toBe(`${SITE_URL}/`);
    expect(meta(home, 'robots')).toBe('index, follow');
  });

  it('gives /talks/ its own share card and canonical url', () => {
    expect(talks.title).toBe(`Talks and posters | ${NAME}`);
    expect(meta(talks, 'og:url')).toBe(`${SITE_URL}/talks/`);
    expect(meta(talks, 'og:title')).toBe(`Talks and posters | ${NAME}`);
    expect(meta(talks, 'twitter:title')).toBe(`Talks and posters | ${NAME}`);
  });

  it('keeps the 404 out of search without inventing a canonical url', () => {
    expect(meta(notFound, 'og:url')).toBeUndefined();
    expect(meta(notFound, 'robots')).toBe('noindex');
    expect(meta(notFound, 'og:description')).toBe(
      meta(notFound, 'description'),
    );
  });

  it('shares the static card everywhere', () => {
    for (const doc of [home, talks, notFound]) {
      expect(meta(doc, 'og:image')).toBe(`${SITE_URL}/images/og.png`);
      expect(meta(doc, 'twitter:card')).toBe('summary_large_image');
    }
  });

  it('links the favicon and the home-screen icon on every page', () => {
    for (const doc of [home, talks, notFound]) {
      const href = (rel: string) =>
        doc.querySelector(`link[rel="${rel}"]`)?.getAttribute('href');
      expect(href('icon')).toBe('/icon.svg');
      expect(href('apple-touch-icon')).toBe('/apple-touch-icon.png');
    }
  });

  it('lists the homepage and /talks/ in the sitemap', () => {
    const urls = [...site['sitemap.xml'].matchAll(/<loc>([^<]+)<\/loc>/g)];
    expect(urls.map((m) => m[1])).toEqual([SITE_URL, `${SITE_URL}/talks/`]);
  });
});

describe('build modes', () => {
  it('ships no analytics without an ID, and loads GA after the page with one', () => {
    expect(site['index.html']).not.toContain('googletagmanager');
    const withGa = renderSite({ gaId: 'G-TEST123' });
    for (const html of Object.values(withGa).slice(0, 3)) {
      expect(html).toContain("gtag('config','G-TEST123')");
      expect(html).toContain("addEventListener('load'");
    }
    expect(() => renderSite({ gaId: "G-1');alert(1);//" })).toThrow();
  });

  it('keeps the easter eggs to the homepage', () => {
    expect(site['index.html']).toContain('strip-pen-hit');
    for (const page of [site['talks/index.html'], site['404.html']]) {
      expect(page).not.toMatch(/strip-torn|<script>/);
    }
  });

  it('adds live reload to dev builds only', () => {
    const dev = renderSite({ dev: true });
    for (const page of ['index.html', 'talks/index.html', '404.html']) {
      expect(dev[page]).toContain('/__reload');
      expect(site[page]).not.toContain('/__reload');
    }
  });
});
