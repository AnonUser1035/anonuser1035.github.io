import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { DESCRIPTION, MILESTONES } from '../content';

const COPY_FILES = ['src/data/content.ts', 'src/data/publications.ts'];

describe('copy', () => {
  it.each(COPY_FILES)('%s has no em dashes', (file) => {
    const text = readFileSync(resolve(process.cwd(), file), 'utf8');
    expect(text).not.toContain('—');
  });

  it('has twelve milestones, oldest first, ending with Now', () => {
    expect(MILESTONES).toHaveLength(12);
    expect(MILESTONES[11].label).toBe('Now');
  });

  it('prints year ticks on beats 1, 2, 3, 4, 8 and 12', () => {
    const ticks = MILESTONES.flatMap((m, i) =>
      m.tick ? [[i + 1, m.tick]] : [],
    );
    expect(ticks).toEqual([
      [1, '2022'],
      [2, '2023'],
      [3, '2024'],
      [4, '2025'],
      [8, '2026'],
      [12, 'now'],
    ]);
  });

  it('keeps the outdated title out of the description', () => {
    expect(DESCRIPTION).not.toMatch(/Chief Research Officer/);
  });
});
