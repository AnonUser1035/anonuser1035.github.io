import { describe, expect, it } from 'vitest';

import { SITE_URL } from '@/lib/utils';
import sitemap from '../sitemap';

describe('sitemap', () => {
  it('uses trailing slashes for exported page routes', () => {
    const entries = sitemap();

    expect(entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ url: `${SITE_URL}/resume/` }),
        expect.objectContaining({ url: `${SITE_URL}/projects/` }),
        expect.objectContaining({ url: `${SITE_URL}/publications/` }),
        expect.objectContaining({ url: `${SITE_URL}/contact/` }),
      ]),
    );
  });

  it('uses trailing slashes for every non-root entry', () => {
    const entries = sitemap();
    const nonRoot = entries.filter((entry) => entry.url !== SITE_URL);

    expect(nonRoot.length).toBeGreaterThan(0);
    expect(nonRoot.every((entry) => entry.url.endsWith('/'))).toBe(true);
  });
});
