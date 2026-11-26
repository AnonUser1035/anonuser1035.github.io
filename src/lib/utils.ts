/**
 * Shared site constants
 */
import { NAME } from '@/data/content';

export const SITE_URL = 'https://www.ryanbohluli.com';
export const AUTHOR_NAME = NAME;
export const TWITTER_HANDLE = '';

/** Static share card, 1200x630. */
export const OG_IMAGE = {
  url: '/images/og.png',
  width: 1200,
  height: 630,
  alt: NAME,
} as const;
