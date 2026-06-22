'use client';

import { useCallback, useEffect, useState } from 'react';

type ProgressMap = Record<string, boolean>;

/** Local calendar date (YYYY-MM-DD) used to scope a day's progress. */
function dateKey(): string {
  return new Date().toLocaleDateString('en-CA');
}

function storageKey(): string {
  return `wk_${dateKey()}`;
}

/**
 * Tracks which sets have been checked off for *today*, persisted to
 * localStorage and scoped by calendar date — so progress survives reloads
 * during the day and starts fresh the next day.
 *
 * Follows the codebase localStorage convention: state stays `null` until the
 * first client effect reads storage, avoiding hydration mismatches.
 */
export function useWorkoutProgress() {
  const [progress, setProgress] = useState<ProgressMap | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey());
      setProgress(stored ? (JSON.parse(stored) as ProgressMap) : {});
    } catch {
      setProgress({});
    }
  }, []);

  const toggleSet = useCallback((setId: string) => {
    setProgress((prev) => {
      const next = { ...(prev ?? {}), [setId]: !(prev ?? {})[setId] };
      try {
        window.localStorage.setItem(storageKey(), JSON.stringify(next));
      } catch {
        // Ignore write failures (e.g. storage disabled / quota).
      }
      return next;
    });
  }, []);

  const isSetDone = useCallback(
    (setId: string) => Boolean(progress?.[setId]),
    [progress],
  );

  return { progress, toggleSet, isSetDone, hydrated: progress !== null };
}
