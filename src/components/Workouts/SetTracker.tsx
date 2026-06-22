import { CheckIcon } from './icons';

interface SetTrackerProps {
  exKey: string;
  sets: number;
  unilateral: boolean;
  isSetDone: (id: string) => boolean;
  toggleSet: (id: string) => void;
}

function SetDot({
  id,
  done,
  onToggle,
}: {
  id: string;
  done: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <button
      type="button"
      className={`set-dot ${done ? 'set-dot--done' : ''}`}
      aria-pressed={done}
      aria-label={done ? 'Set complete' : 'Mark set complete'}
      onClick={() => onToggle(id)}
    >
      {done && <CheckIcon />}
    </button>
  );
}

export default function SetTracker({
  exKey,
  sets,
  unilateral,
  isSetDone,
  toggleSet,
}: SetTrackerProps) {
  const indices = Array.from({ length: sets }, (_, i) => i);

  if (unilateral) {
    return (
      <div className="set-tracker set-tracker--unilateral">
        {(['L', 'R'] as const).map((side) => (
          <div key={side} className="set-tracker-row">
            <span className="set-tracker-side">{side}</span>
            <div className="set-tracker-dots">
              {indices.map((i) => {
                const id = `${exKey}_${i}_${side}`;
                return (
                  <SetDot
                    key={id}
                    id={id}
                    done={isSetDone(id)}
                    onToggle={toggleSet}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="set-tracker set-tracker-dots">
      {indices.map((i) => {
        const id = `${exKey}_${i}`;
        return (
          <SetDot key={id} id={id} done={isSetDone(id)} onToggle={toggleSet} />
        );
      })}
    </div>
  );
}
