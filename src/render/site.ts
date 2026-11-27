/** Every file the build writes, keyed by output path. */
import { DESCRIPTION, NAME } from '../data/content.ts';
import { scripts, styles } from './assets.ts';
import { document } from './html.ts';
import { home, notFound, sitemap, talks } from './pages.ts';

export interface SiteOptions {
  /** Dev build: reloads the page whenever the dev server rebuilds. */
  dev?: boolean;
  /** Google Analytics measurement ID. */
  gaId?: string;
  /** Sitemap date; defaults to now. */
  now?: Date;
}

const BASE_STYLES = ['tokens', 'base', 'strip', 'page'];

const RELOAD = "new EventSource('/__reload').onmessage=()=>location.reload();";

export function renderSite({
  dev = false,
  gaId,
  now = new Date(),
}: SiteOptions = {}): Record<string, string> {
  const css = styles(BASE_STYLES);
  const reload = dev ? RELOAD : '';

  return {
    'index.html': document({
      meta: { description: DESCRIPTION, path: '/' },
      body: home(now),
      css: styles([...BASE_STYLES, 'fidgets']),
      script: [scripts(['strip', 'fidgets']), reload].join('\n').trim(),
      gaId,
    }),
    'talks/index.html': document({
      meta: {
        title: 'Talks and posters',
        description: `Talks and posters by ${NAME}, including a Best Poster award in functional neurosurgery.`,
        path: '/talks/',
      },
      body: talks(),
      css,
      script: reload,
      gaId,
    }),
    '404.html': document({
      meta: {
        title: 'Page Not Found',
        description: 'The page you are looking for could not be found.',
        noindex: true,
      },
      body: notFound(),
      css,
      script: reload,
      gaId,
    }),
    'sitemap.xml': sitemap(now),
  };
}
