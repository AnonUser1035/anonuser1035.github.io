import { describe, expect, it } from 'vitest';

import { SITE_URL } from '@/lib/utils';
import sitemap from '../sitemap';

describe('sitemap', () => {
  it('lists the homepage and /papers/', () => {
    expect(sitemap().map((entry) => entry.url)).toEqual([
      SITE_URL,
      `${SITE_URL}/papers/`,
    ]);
  });

  it('does not list the legacy redirect stubs', () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).not.toContain(`${SITE_URL}/projects/`);
    expect(urls).not.toContain(`${SITE_URL}/publications/`);
  });
});
