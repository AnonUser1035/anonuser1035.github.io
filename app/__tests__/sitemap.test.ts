import { describe, expect, it } from 'vitest';

import { SITE_URL } from '@/lib/utils';
import sitemap from '../sitemap';

describe('sitemap', () => {
  it('lists the homepage and /talks/', () => {
    expect(sitemap().map((entry) => entry.url)).toEqual([
      SITE_URL,
      `${SITE_URL}/talks/`,
    ]);
  });
});
