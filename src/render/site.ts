/** Every file the build writes, keyed by output path. */
import { DESCRIPTION, NAME } from '../data/content.ts';
import { scripts, styles } from './assets.ts';
import { document } from './html.ts';
import { home, notFound, sitemap, talks } from './pages.ts';

/** Easter eggs, in the order the dev panel lists them. */
export const ALL_FIDGETS = [
  'reprint',
  'tearoff',
  'ping',
  'retrace',
  'gain',
  'calipers',
  'rhythm',
  'ink',
  'years',
] as const;

export type Fidget = (typeof ALL_FIDGETS)[number];

/** The easter eggs the live site ships with. Empty until they're picked. */
export const LIVE_FIDGETS: Fidget[] = [];

export interface SiteOptions {
  /** Dev build: every easter egg plus the picker panel and live reload. */
  dev?: boolean;
  /** Easter eggs to switch on. Defaults to LIVE_FIDGETS. */
  fidgets?: readonly Fidget[];
  /** Google Analytics measurement ID. */
  gaId?: string;
  /** Sitemap date; defaults to now. */
  now?: Date;
}

const BASE_STYLES = ['tokens', 'base', 'strip', 'page'];

/** Dev only: reload the page when the dev server rebuilds. */
const RELOAD = "new EventSource('/__reload').onmessage=()=>location.reload();";

export function renderSite({
  dev = false,
  fidgets = LIVE_FIDGETS,
  gaId,
  now = new Date(),
}: SiteOptions = {}): Record<string, string> {
  const withFidgets = fidgets.length > 0;
  const css = styles([
    ...BASE_STYLES,
    ...(withFidgets ? ['fidgets'] : []),
    ...(dev ? ['panel'] : []),
  ]);
  const homeScript =
    scripts([
      'strip',
      ...(withFidgets ? ['fidgets'] : []),
      ...(dev ? ['panel'] : []),
    ]) + (dev ? `\n${RELOAD}` : '');
  const shared = { css, gaId, script: dev ? RELOAD : undefined };

  return {
    'index.html': document({
      ...shared,
      meta: { description: DESCRIPTION, path: '/' },
      body: home({ fidgets: withFidgets }),
      script: homeScript,
      fidgets: fidgets.join(' '),
    }),
    'talks/index.html': document({
      ...shared,
      meta: {
        title: 'Talks and posters',
        description: `Talks and posters by ${NAME}, including a Best Poster award in functional neurosurgery.`,
        path: '/talks/',
      },
      body: talks(),
    }),
    '404.html': document({
      ...shared,
      meta: {
        title: 'Page Not Found',
        description: 'The page you are looking for could not be found.',
        noindex: true,
      },
      body: notFound(),
    }),
    'sitemap.xml': sitemap(now),
  };
}
