import { describe, expect, it } from 'vitest';

import { SITE_URL } from '@/lib/utils';
import sitemap from '../sitemap';

describe('sitemap', () => {
  it('lists only the homepage now that all content is one page', () => {
    const entries = sitemap();

    expect(entries).toHaveLength(1);
    expect(entries[0].url).toBe(SITE_URL);
  });

  it('does not list the legacy redirect stubs', () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).not.toContain(`${SITE_URL}/projects/`);
    expect(urls).not.toContain(`${SITE_URL}/publications/`);
  });
});
