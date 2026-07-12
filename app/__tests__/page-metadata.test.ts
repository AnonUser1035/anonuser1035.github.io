import { describe, expect, it } from 'vitest';

import { AUTHOR_NAME } from '@/lib/utils';
import { metadata as notFoundMetadata } from '../not-found';
import { metadata as projectsMetadata } from '../projects/page';
import { metadata as publicationsMetadata } from '../publications/page';

describe('page metadata', () => {
  it.each([
    ['projects', projectsMetadata],
    ['publications', publicationsMetadata],
  ])('marks the %s redirect stub noindex', (_, metadata) => {
    expect(metadata.robots).toMatchObject({ index: false });
  });

  it('overrides 404 share metadata without inventing a canonical url', () => {
    expect(notFoundMetadata.openGraph?.url).toBeUndefined();
    expect(notFoundMetadata.openGraph?.description).toBe(
      notFoundMetadata.description,
    );
    expect(notFoundMetadata.openGraph?.title).toBe(
      `${notFoundMetadata.title} | ${AUTHOR_NAME}`,
    );
    expect(notFoundMetadata.twitter?.description).toBe(
      notFoundMetadata.description,
    );
    expect(notFoundMetadata.twitter?.title).toBe(
      `${notFoundMetadata.title} | ${AUTHOR_NAME}`,
    );
  });
});
