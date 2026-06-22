import { describe, expect, it } from 'vitest';

import { exerciseKey, isExerciseDone, isUnilateral, setIds } from '../keys';

describe('workout set keys', () => {
  it('builds stable, unique exercise keys', () => {
    expect(exerciseKey(1, 0, 0)).toBe('s_1_0_0');
    expect(exerciseKey(1, 0, 1)).not.toBe(exerciseKey(1, 0, 0));
    expect(exerciseKey(0, 2, 1)).toBe('s_0_2_1');
  });

  it('detects unilateral lifts via the rep target', () => {
    expect(isUnilateral('8–10 each')).toBe(true);
    expect(isUnilateral('8–12')).toBe(false);
  });

  it('emits one id per set for bilateral lifts', () => {
    expect(setIds('s_1_0_0', 3, false)).toEqual([
      's_1_0_0_0',
      's_1_0_0_1',
      's_1_0_0_2',
    ]);
  });

  it('emits L/R ids per set for unilateral lifts', () => {
    expect(setIds('s_1_0_0', 2, true)).toEqual([
      's_1_0_0_0_L',
      's_1_0_0_0_R',
      's_1_0_0_1_L',
      's_1_0_0_1_R',
    ]);
  });

  it('marks an exercise done only when every set is checked', () => {
    const ids = setIds('s_1_0_0', 2, false);
    const done = new Set(['s_1_0_0_0']);

    expect(isExerciseDone(ids, (id) => done.has(id))).toBe(false);
    done.add('s_1_0_0_1');
    expect(isExerciseDone(ids, (id) => done.has(id))).toBe(true);
  });

  it('treats an exercise with no sets as not done', () => {
    expect(isExerciseDone([], () => true)).toBe(false);
  });
});
