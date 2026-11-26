import { describe, expect, it } from 'vitest';

import { AUTHOR_NAME, SITE_URL } from '@/lib/utils';
import { metadata as notFoundMetadata } from '../not-found';
import { metadata as talksMetadata } from '../talks/page';

describe('page metadata', () => {
  it('gives /talks/ its own share card and canonical url', () => {
    expect(talksMetadata.title).toBe('Talks and posters');
    expect(talksMetadata.openGraph?.url).toBe(`${SITE_URL}/talks/`);
    expect(talksMetadata.openGraph?.title).toBe(
      `Talks and posters | ${AUTHOR_NAME}`,
    );
  });

  it('overrides 404 share metadata without inventing a canonical url', () => {
    expect(notFoundMetadata.openGraph?.url).toBeUndefined();
    expect(notFoundMetadata.openGraph?.description).toBe(
      notFoundMetadata.description,
    );
    expect(notFoundMetadata.twitter?.title).toBe(
      `${notFoundMetadata.title} | ${AUTHOR_NAME}`,
    );
  });
});
