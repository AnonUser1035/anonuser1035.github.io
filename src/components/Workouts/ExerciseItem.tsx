import type { WorkoutExercise } from '@/data/workouts';
import { CheckIcon, ClockIcon } from './icons';
import { isExerciseDone, isUnilateral, setIds } from './keys';
import SetTracker from './SetTracker';

interface ExerciseItemProps {
  /** Exercise data; `name` plus set/rep targets. */
  exercise: Pick<
    WorkoutExercise,
    'name' | 'sets' | 'reps' | 'weight' | 'notes' | 'rest' | 'label'
  >;
  exKey: string;
  isSetDone: (id: string) => boolean;
  toggleSet: (id: string) => void;
}

export default function ExerciseItem({
  exercise,
  exKey,
  isSetDone,
  toggleSet,
}: ExerciseItemProps) {
  const { name, sets, reps, weight, notes, rest, label } = exercise;
  const unilateral = isUnilateral(reps);
  const done = isExerciseDone(setIds(exKey, sets, unilateral), isSetDone);
  const meta = [`${sets}×${reps}`, weight, notes].filter(Boolean).join('  ·  ');

  return (
    <div className="workout-exercise">
      <div className="workout-exercise-head">
        <p className="workout-exercise-name">
          {label && <span className="workout-exercise-label">{label} · </span>}
          {name}
        </p>
        <span
          className={`workout-exercise-done ${done ? 'is-done' : ''}`}
          aria-hidden={!done}
        >
          <CheckIcon />
        </span>
      </div>
      <p className="workout-exercise-meta">{meta}</p>
      <SetTracker
        exKey={exKey}
        sets={sets}
        unilateral={unilateral}
        isSetDone={isSetDone}
        toggleSet={toggleSet}
      />
      {rest && (
        <p className="workout-rest workout-rest--inline">
          <ClockIcon />
          <span>{rest}</span>
        </p>
      )}
    </div>
  );
}
