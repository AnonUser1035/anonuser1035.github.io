import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { DESCRIPTION, EVENT_MARKS, MILESTONES } from '../content';

const COPY_FILES = ['src/data/content.ts', 'src/data/talks.ts'];

describe('copy', () => {
  it.each(COPY_FILES)('%s has no em dashes and no COACH', (file) => {
    const text = readFileSync(resolve(process.cwd(), file), 'utf8');
    expect(text).not.toContain('—');
    expect(text).not.toMatch(/COACH/i);
  });

  it('runs oldest first and ends with Now', () => {
    expect(MILESTONES[0].label).toBe('2022');
    expect(MILESTONES.at(-1)?.label).toBe('Now');
  });

  it('prints each year once, on the first beat of that year', () => {
    expect(MILESTONES.flatMap((m) => (m.tick ? [m.tick] : []))).toEqual([
      '2022',
      '2023',
      '2024',
      '2025',
      '2026',
      'now',
    ]);
  });

  it('anchors every event mark to a milestone', () => {
    const labels = MILESTONES.map((m) => m.label);
    for (const mark of EVENT_MARKS) expect(labels).toContain(mark.after);
  });

  it('keeps outdated titles out of the description', () => {
    expect(DESCRIPTION).not.toMatch(/Chief Research Officer/);
  });
});
