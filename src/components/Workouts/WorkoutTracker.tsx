'use client';

import { useEffect, useState } from 'react';
import plan, { DAY_LABELS, DAY_ORDER } from '@/data/workouts';
import { useWorkoutProgress } from '@/hooks/useWorkoutProgress';
import WorkoutSection from './WorkoutSection';

export default function WorkoutTracker() {
  const { toggleSet, isSetDone, hydrated } = useWorkoutProgress();
  const [today, setToday] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [dateLabel, setDateLabel] = useState('');

  useEffect(() => {
    const now = new Date();
    setToday(now.getDay());
    setSelectedDay(now.getDay());
    setDateLabel(
      now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }),
    );
  }, []);

  const ready = hydrated && selectedDay !== null;
  const day = selectedDay !== null ? plan[selectedDay] : undefined;

  return (
    <div className="workout-tracker">
      <div className="workout-topbar">
        <p className="workout-date">{dateLabel || ' '}</p>
        <div className="workout-tabs" role="tablist" aria-label="Day of week">
          {DAY_ORDER.map((d) => {
            const active = d === selectedDay;
            return (
              <button
                key={d}
                type="button"
                role="tab"
                aria-selected={active}
                className={`workout-tab ${active ? 'is-active' : ''}`}
                onClick={() => setSelectedDay(d)}
              >
                <span>{DAY_LABELS[d]}</span>
                <span
                  className={`workout-tab-dot ${d === today ? 'is-today' : ''}`}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>
      </div>

      {!ready || !day ? (
        <div className="workout-loading" aria-hidden="true" />
      ) : day.type === 'rest' ? (
        <div className="workout-rest-day">
          <div className="workout-rest-emoji">🛌</div>
          <h2 className="workout-rest-title">{day.name}</h2>
          <p className="workout-rest-message">{day.message}</p>
        </div>
      ) : (
        <div className="workout-body">
          <header className="workout-day-head">
            <h2 className="workout-day-name">{day.name}</h2>
            {day.duration && (
              <p className="workout-day-duration">{day.duration}</p>
            )}
          </header>
          <div className="workout-sections">
            {day.sections?.map((section, si) => (
              <WorkoutSection
                key={si}
                section={section}
                dayKey={selectedDay}
                sectionIndex={si}
                isSetDone={isSetDone}
                toggleSet={toggleSet}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
