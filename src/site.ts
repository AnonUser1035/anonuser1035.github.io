/** Site-wide constants used in every page's <head>. */
import { NAME } from './data/content.ts';

export const SITE_URL = 'https://www.ryanbohluli.com';

/** Static share card, 1200x630. */
export const OG_IMAGE = {
  url: '/images/og.png',
  width: 1200,
  height: 630,
  alt: NAME,
} as const;

export const KEYWORDS = [
  NAME,
  'Johns Hopkins',
  'neuroscience',
  'neuromodulation',
  'neurotechnology',
  'EEG',
  'EMT',
  'pre-med',
  'Neuro Safety Systems',
  'research',
];

/** Browser chrome colors; match --color-paper in tokens.css. */
export const THEME_COLORS = { light: '#FAF8F5', dark: '#121419' } as const;

/** Both faces are used above the fold: the name, and the italic caption. */
export const FONTS = [
  '/fonts/newsreader-roman.woff2',
  '/fonts/newsreader-italic.woff2',
];
