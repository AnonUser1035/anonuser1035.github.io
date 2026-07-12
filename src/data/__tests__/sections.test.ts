import { describe, expect, it } from 'vitest';

import sections, { sectionIds } from '../sections';

describe('sections', () => {
  it('exports a non-empty array of sections', () => {
    expect(Array.isArray(sections)).toBe(true);
    expect(sections.length).toBeGreaterThan(0);
  });

  it('has correct structure for each section', () => {
    for (const section of sections) {
      expect(typeof section.label).toBe('string');
      expect(typeof section.id).toBe('string');
      expect(section.label.trim().length).toBeGreaterThan(0);
    }
  });

  it('lists sections in page order', () => {
    expect(sectionIds).toEqual([
      'experience',
      'education',
      'publications',
      'projects',
    ]);
  });

  it('has unique ids and labels', () => {
    const ids = sections.map((s) => s.id);
    const labels = sections.map((s) => s.label);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(labels).size).toBe(labels.length);
  });

  it('uses anchor-safe ids (lowercase, no spaces or hashes)', () => {
    for (const section of sections) {
      expect(section.id).toMatch(/^[a-z][a-z0-9-]*$/);
    }
  });

  it('keeps sectionIds in sync with sections', () => {
    expect(sectionIds).toEqual(sections.map((s) => s.id));
  });
});
