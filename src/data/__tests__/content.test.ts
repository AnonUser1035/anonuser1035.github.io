import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { DESCRIPTION, MILESTONES } from '../content.ts';

const COPY_FILES = ['src/data/content.ts', 'src/data/talks.ts'];

describe('copy', () => {
  it.each(COPY_FILES)('%s has no em dashes and no COACH', (file) => {
    const text = readFileSync(resolve(process.cwd(), file), 'utf8');
    expect(text).not.toContain('—');
    expect(text).not.toMatch(/COACH/i);
  });

  it('runs oldest first, with a month on every beat, and ends with Now', () => {
    const MONTHS = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
    const order = MILESTONES.slice(0, -1).map((m) => {
      const [month, year] = m.label.split(' ');
      expect(MONTHS).toContain(month);
      return Number(year) * 12 + MONTHS.indexOf(month);
    });
    expect(order).toEqual([...order].sort((x, y) => x - y));
    expect(MILESTONES.at(-1)?.label).toBe('Now');
  });

  it('keeps Now current: no Cho Lab', () => {
    expect(MILESTONES.at(-1)?.text).not.toMatch(/Cho/);
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

  it('keeps outdated titles out of the description', () => {
    expect(DESCRIPTION).not.toMatch(/Chief Research Officer/);
  });
});
