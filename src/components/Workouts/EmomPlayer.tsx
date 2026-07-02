'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import workouts, { type Segment, type Workout } from '@/data/workouts';
import { AudioCues } from './audio';
import { expand } from './expand';
import { measureLabel, mmss, paceLabel } from './format';
import { useIntervalClock } from './useIntervalClock';
import { useWakeLock } from './useWakeLock';

const SEGMENT_LABELS: Record<Segment['type'], string> = {
  work: 'Work',
  break: 'Rest',
  hold: 'Hold',
};

function stationOf(segment: Segment | undefined) {
  if (!segment || segment.type === 'break') return null;
  return segment.station;
}

/** One-line "up next" descriptor for the following segment. */
function nextLabel(segment: Segment | undefined): string {
  if (!segment) return 'Finish';
  if (segment.type === 'break') return 'Rest';
  return segment.station.movement;
}

export default function EmomPlayer() {
  const [workout, setWorkout] = useState<Workout>(workouts[0]);
  const segments = useMemo(() => expand(workout), [workout]);
  const clock = useIntervalClock(segments);
  const cues = useRef<AudioCues | null>(null);
  if (!cues.current) cues.current = new AudioCues();

  const running = clock.status === 'running';
  useWakeLock(running);

  const current = segments[clock.segmentIndex];
  const next = segments[clock.segmentIndex + 1];
  const station = stationOf(current);
  const pace = station ? paceLabel(station.pace) : null;

  // Start tone / transition cue when the active segment changes.
  const prevIndex = useRef<number | null>(null);
  useEffect(() => {
    if (!running) {
      prevIndex.current = null;
      return;
    }
    if (
      prevIndex.current !== null &&
      prevIndex.current !== clock.segmentIndex
    ) {
      cues.current?.start();
    }
    prevIndex.current = clock.segmentIndex;
  }, [running, clock.segmentIndex]);

  // 3-2-1 countdown beeps in the final seconds of a segment.
  const lastBeep = useRef('');
  useEffect(() => {
    if (!running) return;
    const r = clock.segmentRemaining;
    if (r >= 1 && r <= 3) {
      const tag = `${clock.segmentIndex}:${r}`;
      if (lastBeep.current !== tag) {
        lastBeep.current = tag;
        cues.current?.countdown();
      }
    }
  }, [running, clock.segmentIndex, clock.segmentRemaining]);

  // End-of-workout flourish.
  useEffect(() => {
    if (clock.status === 'done') cues.current?.finish();
  }, [clock.status]);

  const handleStart = () => {
    cues.current?.unlock();
    cues.current?.start();
    prevIndex.current = 0;
    clock.start();
  };

  const idle = clock.status === 'idle';
  const done = clock.status === 'done';

  // ── Idle: workout overview + start ──────────────────────────────────────
  if (idle) {
    return (
      <div className="emom">
        {workouts.length > 1 && (
          <div
            className="emom-picker"
            role="tablist"
            aria-label="Choose a workout"
          >
            {workouts.map((w) => (
              <button
                key={w.slug}
                type="button"
                role="tab"
                aria-selected={w.slug === workout.slug}
                className={`emom-picker-tab ${w.slug === workout.slug ? 'is-active' : ''}`}
                onClick={() => setWorkout(w)}
              >
                {w.title}
              </button>
            ))}
          </div>
        )}

        <div className="emom-overview">
          <h2 className="emom-overview-title">{workout.title}</h2>
          <p className="emom-overview-summary">{workout.summary}</p>
          <ol className="emom-block-list">
            {workout.blocks.map((block, bi) => (
              <li key={bi} className="emom-block">
                <div className="emom-block-head">
                  <span className="emom-block-label">
                    {block.label ?? `Block ${bi + 1}`}
                  </span>
                  <span className="emom-block-meta">
                    {block.durationMin} min · {block.intervalSec}s
                  </span>
                </div>
                <ul className="emom-station-list">
                  {block.stations.map((s, si) => (
                    <li key={si} className="emom-station-row">
                      <span className="emom-station-name">{s.movement}</span>
                      <span className="emom-station-measure">
                        {measureLabel(s.measure)}
                        {s.load ? ` · ${s.load}` : ''}
                      </span>
                    </li>
                  ))}
                  {block.then?.map((t, ti) => (
                    <li key={`t${ti}`} className="emom-station-row is-trailing">
                      {t.kind === 'break' ? (
                        <>
                          <span className="emom-station-name">Rest</span>
                          <span className="emom-station-measure">
                            {mmss(t.seconds)}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="emom-station-name">
                            {t.station.movement}
                          </span>
                          <span className="emom-station-measure">
                            {measureLabel(t.station.measure)}
                          </span>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>

        <button
          type="button"
          className="emom-btn emom-btn--go"
          onClick={handleStart}
        >
          Start
        </button>
      </div>
    );
  }

  // ── Done ────────────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="emom emom--done">
        <div className="emom-done-emoji" aria-hidden="true">
          ✅
        </div>
        <h2 className="emom-done-title">{workout.title} complete</h2>
        <p className="emom-done-meta">
          {mmss(clock.totalDuration)} of work done.
        </p>
        <button type="button" className="emom-btn" onClick={clock.reset}>
          Back to start
        </button>
      </div>
    );
  }

  // ── Running / paused ────────────────────────────────────────────────────
  const type = current?.type ?? 'work';
  const round = current?.type === 'work' ? current.round : undefined;
  const blockLabel =
    current?.type === 'work'
      ? (current.blockLabel ?? `Block ${current.blockIndex + 1}`)
      : undefined;

  return (
    <div className={`emom emom--live emom--${type}`}>
      <div className="emom-status">
        <span className="emom-status-phase">{SEGMENT_LABELS[type]}</span>
        <span className="emom-status-progress">
          {clock.segmentIndex + 1} / {segments.length}
          {blockLabel ? ` · ${blockLabel}${round ? ` · rd ${round}` : ''}` : ''}
        </span>
      </div>

      <div className="emom-countdown" aria-live="off">
        {mmss(clock.segmentRemaining)}
      </div>

      <div className="emom-now">
        {station ? (
          <>
            <p className="emom-now-movement">{station.movement}</p>
            <p className="emom-now-measure">
              {measureLabel(station.measure)}
              {station.load ? ` · ${station.load}` : ''}
            </p>
            {pace && <p className="emom-now-pace">{pace}</p>}
          </>
        ) : (
          <p className="emom-now-movement">Rest</p>
        )}
      </div>

      <p className="emom-next">
        Next: <strong>{nextLabel(next)}</strong>
      </p>

      <div className="emom-controls">
        {running ? (
          <button type="button" className="emom-btn" onClick={clock.pause}>
            Pause
          </button>
        ) : (
          <button
            type="button"
            className="emom-btn emom-btn--go"
            onClick={clock.resume}
          >
            Resume
          </button>
        )}
        <button
          type="button"
          className="emom-btn emom-btn--ghost"
          onClick={clock.reset}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
