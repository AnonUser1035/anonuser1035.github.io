// Pure helpers for deriving stable per-set identifiers and completion state.

/** Stable key for an exercise within a given day + section. */
export function exerciseKey(
  dayKey: number,
  sectionIndex: number,
  exerciseIndex: number,
): string {
  return `s_${dayKey}_${sectionIndex}_${exerciseIndex}`;
}

/** Unilateral lifts (tracked separately per side) are flagged via "each" in the rep target. */
export function isUnilateral(reps: string): boolean {
  return reps.includes('each');
}

/** All set ids for an exercise — two per set (L/R) when unilateral. */
export function setIds(
  exKey: string,
  sets: number,
  unilateral: boolean,
): string[] {
  const ids: string[] = [];
  for (let i = 0; i < sets; i += 1) {
    if (unilateral) {
      ids.push(`${exKey}_${i}_L`, `${exKey}_${i}_R`);
    } else {
      ids.push(`${exKey}_${i}`);
    }
  }
  return ids;
}

export function isExerciseDone(
  ids: string[],
  isSetDone: (id: string) => boolean,
): boolean {
  return ids.length > 0 && ids.every(isSetDone);
}
