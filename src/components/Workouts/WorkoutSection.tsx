import type { WorkoutSection as Section } from '@/data/workouts';
import ExerciseItem from './ExerciseItem';
import { ClockIcon } from './icons';
import { exerciseKey } from './keys';

interface WorkoutSectionProps {
  section: Section;
  dayKey: number;
  sectionIndex: number;
  isSetDone: (id: string) => boolean;
  toggleSet: (id: string) => void;
}

export default function WorkoutSection({
  section,
  dayKey,
  sectionIndex,
  isSetDone,
  toggleSet,
}: WorkoutSectionProps) {
  if (section.kind === 'superset') {
    return (
      <div className="workout-card">
        <div className="workout-superset-head">
          <span className="workout-superset-label">SS {section.label}</span>
          <span className="workout-superset-focus">{section.focus}</span>
        </div>
        {section.exercises.map((ex, ei) => (
          <div key={ex.label ?? ex.name}>
            <div className="workout-exercise-wrap">
              <ExerciseItem
                exercise={ex}
                exKey={exerciseKey(dayKey, sectionIndex, ei)}
                isSetDone={isSetDone}
                toggleSet={toggleSet}
              />
            </div>
            {ei < section.exercises.length - 1 && (
              <div className="workout-no-rest">
                <span>no rest</span>
              </div>
            )}
          </div>
        ))}
        <div className="workout-rest workout-rest--footer">
          <ClockIcon />
          <span>{section.rest}</span>
        </div>
      </div>
    );
  }

  if (section.kind === 'standalone') {
    return (
      <div className="workout-card">
        <div className="workout-exercise-wrap">
          <ExerciseItem
            exercise={section}
            exKey={exerciseKey(dayKey, sectionIndex, 0)}
            isSetDone={isSetDone}
            toggleSet={toggleSet}
          />
        </div>
      </div>
    );
  }

  // 'finisher' | 'abs'
  const accentClass =
    section.kind === 'finisher'
      ? 'workout-group-label--finisher'
      : 'workout-group-label--abs';
  return (
    <div className="workout-card">
      <div className="workout-group-head">
        <span className={`workout-group-label ${accentClass}`}>
          {section.kind === 'finisher' ? 'Finisher' : 'Abs'}
        </span>
      </div>
      {section.exercises.map((ex, ei) => (
        <div key={ex.name} className="workout-group-item">
          <ExerciseItem
            exercise={ex}
            exKey={exerciseKey(dayKey, sectionIndex, ei)}
            isSetDone={isSetDone}
            toggleSet={toggleSet}
          />
        </div>
      ))}
    </div>
  );
}
