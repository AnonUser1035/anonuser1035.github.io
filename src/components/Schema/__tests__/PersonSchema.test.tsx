import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PROFILES } from '@/data/content';
import { AUTHOR_NAME, SITE_URL } from '@/lib/utils';
import PersonSchema from '../PersonSchema';

function schema() {
  const { container } = render(<PersonSchema />);
  const script = container.querySelector('script[type="application/ld+json"]');
  return JSON.parse(script?.innerHTML || '{}');
}

describe('PersonSchema', () => {
  it('describes a schema.org Person', () => {
    const data = schema();
    expect(data['@context']).toBe('https://schema.org');
    expect(data['@type']).toBe('Person');
    expect(data.name).toBe(AUTHOR_NAME);
    expect(data.url).toBe(SITE_URL);
  });

  it('links LinkedIn, GitHub, Google Scholar and ORCID in sameAs', () => {
    expect(schema().sameAs).toEqual([
      PROFILES.linkedin,
      PROFILES.github,
      PROFILES.scholar,
      PROFILES.orcid,
    ]);
  });

  it('is affiliated with Johns Hopkins University', () => {
    expect(schema().affiliation).toMatchObject({
      '@type': 'CollegeOrUniversity',
      name: 'Johns Hopkins University',
    });
  });

  it('drops the outdated job title', () => {
    const json = JSON.stringify(schema());
    expect(json).not.toMatch(/Chief Research Officer/);
    expect(schema().jobTitle).toBeUndefined();
  });
});
