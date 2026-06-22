// Weekly workout plan, keyed by JS day-of-week (0 = Sunday … 6 = Saturday).
//
// This drives the interactive tracker at /workouts. Edit the plan here to make
// it your own — the UI renders whatever sections you define and persists each
// day's checked-off sets to localStorage (keyed by calendar date).

export interface WorkoutExercise {
  name: string;
  sets: number;
  /** Free-form rep target, e.g. "8–12" or "10–12 each". Include "each" for unilateral lifts to split L/R tracking. */
  reps: string;
  weight?: string;
  notes?: string;
  /** Rest cue shown inline beneath the exercise. */
  rest?: string;
  /** Position label within a superset, e.g. "A" / "B". */
  label?: string;
  /** Optional image path under /public; omitted entries simply render no image. */
  image?: string;
}

export type WorkoutSection =
  | {
      kind: 'superset';
      /** Superset label, e.g. "A". */
      label: string;
      /** Short description of the pairing. */
      focus: string;
      rest: string;
      exercises: WorkoutExercise[];
    }
  | {
      kind: 'standalone';
      name: string;
      sets: number;
      reps: string;
      weight?: string;
      notes?: string;
      rest?: string;
      image?: string;
    }
  | { kind: 'finisher'; exercises: WorkoutExercise[] }
  | { kind: 'abs'; exercises: WorkoutExercise[] };

export interface WorkoutDay {
  day: string;
  type: 'workout' | 'rest';
  name: string;
  duration?: string;
  /** Shown on rest days. */
  message?: string;
  sections?: WorkoutSection[];
}

export type WeeklyPlan = Record<number, WorkoutDay>;

/** Sunday-first tab order matching the day-of-week keys. */
export const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0] as const;
export const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const plan: WeeklyPlan = {
  1: {
    day: 'Monday',
    type: 'workout',
    name: 'Push',
    duration: '55–65 mins',
    sections: [
      {
        kind: 'superset',
        label: 'A',
        focus: 'chest + rear delt',
        rest: '60 sec after each pair',
        exercises: [
          {
            label: 'A',
            name: 'DB Floor Press / Bench Press',
            sets: 4,
            reps: '6–10',
            weight: '40–45 lbs',
          },
          {
            label: 'B',
            name: 'Rear Delt Raise (face-down)',
            sets: 4,
            reps: '15–20',
            weight: '10 lbs',
          },
        ],
      },
      {
        kind: 'superset',
        label: 'B',
        focus: 'incline press + lateral raise',
        rest: '60 sec after each pair',
        exercises: [
          {
            label: 'A',
            name: 'Incline DB Press',
            sets: 3,
            reps: '8–12',
            weight: '25–35 lbs',
          },
          {
            label: 'B',
            name: 'Lateral Raises',
            sets: 3,
            reps: '15–20',
            weight: '10–12.5 lbs',
          },
        ],
      },
      {
        kind: 'superset',
        label: 'C',
        focus: 'squeeze press + overhead press',
        rest: '75 sec after each pair',
        exercises: [
          {
            label: 'A',
            name: 'DB Squeeze Press',
            sets: 3,
            reps: '10–15',
            weight: '35–40 lbs',
          },
          {
            label: 'B',
            name: 'DB Overhead Press',
            sets: 3,
            reps: '8–10',
            weight: '20–25 lbs',
          },
        ],
      },
      {
        kind: 'standalone',
        name: 'DB Overhead Tricep Extension',
        sets: 3,
        reps: '10–15',
        weight: '25 lbs',
        rest: '75 sec rest',
      },
      {
        kind: 'finisher',
        exercises: [
          {
            name: 'Feet-elevated push-ups',
            sets: 2,
            reps: 'max',
            rest: '60 sec',
          },
        ],
      },
    ],
  },

  2: {
    day: 'Tuesday',
    type: 'rest',
    name: 'Rest Day',
    message: 'Hit your calories. Light walk if you feel like it.',
  },

  3: {
    day: 'Wednesday',
    type: 'workout',
    name: 'Legs + Biceps',
    duration: '55–65 mins',
    sections: [
      {
        kind: 'standalone',
        name: 'Goblet Squat',
        sets: 4,
        reps: '8–12',
        weight: '40–45 lbs',
        notes: 'Slow eccentric',
        rest: '2 min rest',
      },
      {
        kind: 'standalone',
        name: 'DB Romanian Deadlift',
        sets: 4,
        reps: '8–10',
        weight: '40–45 lbs',
        rest: '90 sec rest',
      },
      {
        kind: 'superset',
        label: 'A',
        focus: 'split squat + calf raise',
        rest: '75 sec after each pair',
        exercises: [
          {
            label: 'A',
            name: 'Bulgarian Split Squat',
            sets: 3,
            reps: '8–10 each',
            weight: '20–25 lbs',
          },
          {
            label: 'B',
            name: 'Calf Raises',
            sets: 3,
            reps: '15–20',
            weight: '30–40 lbs',
          },
        ],
      },
      {
        kind: 'superset',
        label: 'B',
        focus: 'curl + hammer curl',
        rest: '75 sec after each pair',
        exercises: [
          {
            label: 'A',
            name: 'DB Curl (supinating)',
            sets: 3,
            reps: '8–12',
            weight: '25–30 lbs',
          },
          {
            label: 'B',
            name: 'Hammer Curl',
            sets: 3,
            reps: '10–12',
            weight: '25 lbs',
          },
        ],
      },
    ],
  },

  4: {
    day: 'Thursday',
    type: 'rest',
    name: 'Rest Day',
    message: 'Hit your calories. Light walk if you feel like it.',
  },

  5: {
    day: 'Friday',
    type: 'workout',
    name: 'Pull + Chest',
    duration: '55–65 mins',
    sections: [
      {
        kind: 'standalone',
        name: 'Pull-ups (or band-assisted)',
        sets: 4,
        reps: '6–10',
        notes: 'Stop 1–2 reps short of failure',
        rest: '2 min rest',
      },
      {
        kind: 'superset',
        label: 'A',
        focus: 'row + curl',
        rest: '75 sec after each pair',
        exercises: [
          {
            label: 'A',
            name: '1-Arm DB Row',
            sets: 3,
            reps: '8–12 each',
            weight: '45–50 lbs',
          },
          {
            label: 'B',
            name: 'DB Curl (supinating)',
            sets: 3,
            reps: '8–12',
            weight: '25–30 lbs',
          },
        ],
      },
      {
        kind: 'superset',
        label: 'B',
        focus: 'chest-supported row + incline curl',
        rest: '60 sec after each pair',
        exercises: [
          {
            label: 'A',
            name: 'Chest-Supported DB Row',
            sets: 3,
            reps: '10–15',
            weight: '35 lbs',
          },
          {
            label: 'B',
            name: 'Incline DB Curl',
            sets: 3,
            reps: '10–15',
            weight: '20–25 lbs',
          },
        ],
      },
      {
        kind: 'superset',
        label: 'C',
        focus: 'pullover + hammer curl',
        rest: '60 sec after each pair',
        exercises: [
          {
            label: 'A',
            name: 'DB Pullover',
            sets: 2,
            reps: '12–15',
            weight: '30–35 lbs',
          },
          {
            label: 'B',
            name: 'Hammer Curl',
            sets: 2,
            reps: '10–12',
            weight: '25 lbs',
          },
        ],
      },
      {
        kind: 'finisher',
        exercises: [
          {
            name: 'DB Floor Press (heavier)',
            sets: 3,
            reps: '8–12',
            weight: '40–45 lbs',
            rest: '90 sec',
          },
        ],
      },
    ],
  },

  6: {
    day: 'Saturday',
    type: 'workout',
    name: 'Legs + Abs',
    duration: '45–55 mins',
    sections: [
      {
        kind: 'superset',
        label: 'A',
        focus: 'squat + calf',
        rest: '75 sec after each pair',
        exercises: [
          {
            label: 'A',
            name: 'Goblet Squat',
            sets: 3,
            reps: '12–15',
            weight: '40 lbs',
            notes: 'Slow pace',
          },
          {
            label: 'B',
            name: 'Calf Raises',
            sets: 3,
            reps: '15–20',
            weight: '30 lbs',
          },
        ],
      },
      {
        kind: 'superset',
        label: 'B',
        focus: 'RDL + split squat',
        rest: '75 sec after each pair',
        exercises: [
          {
            label: 'A',
            name: 'DB RDL',
            sets: 3,
            reps: '12–15',
            weight: '30–35 lbs',
          },
          {
            label: 'B',
            name: 'Bulgarian Split Squat',
            sets: 3,
            reps: '10–12 each',
            weight: '20 lbs',
          },
        ],
      },
      {
        kind: 'abs',
        exercises: [
          {
            name: 'Weighted Crunches or Decline Situps',
            sets: 3,
            reps: '12–15',
            weight: '10–25 lbs',
            rest: '60 sec',
          },
          { name: 'Plank', sets: 2, reps: '30–45 sec' },
          { name: 'Leg Raises', sets: 2, reps: '12–15', rest: '45 sec' },
        ],
      },
    ],
  },

  0: {
    day: 'Sunday',
    type: 'workout',
    name: 'Shoulders + Arms + Chest',
    duration: '55–65 mins',
    sections: [
      {
        kind: 'superset',
        label: 'A',
        focus: 'overhead press + lateral raise',
        rest: '75 sec after each pair',
        exercises: [
          {
            label: 'A',
            name: 'DB Overhead Press',
            sets: 4,
            reps: '8–10',
            weight: '20–25 lbs',
          },
          {
            label: 'B',
            name: 'Lateral Raises',
            sets: 4,
            reps: '15–20',
            weight: '10–12.5 lbs',
          },
        ],
      },
      {
        kind: 'superset',
        label: 'B',
        focus: 'rear delt + arnold press',
        rest: '60 sec after each pair',
        exercises: [
          {
            label: 'A',
            name: 'Rear Delt Raise',
            sets: 3,
            reps: '15–20',
            weight: '10 lbs',
          },
          {
            label: 'B',
            name: 'Arnold Press',
            sets: 3,
            reps: '10–12',
            weight: '15–20 lbs',
          },
        ],
      },
      {
        kind: 'superset',
        label: 'C',
        focus: 'concentration curl + tricep extension',
        rest: '60 sec after each pair',
        exercises: [
          {
            label: 'A',
            name: 'Concentration Curl',
            sets: 3,
            reps: '12–15 each',
            weight: '20–25 lbs',
          },
          {
            label: 'B',
            name: 'DB Overhead Tricep Extension',
            sets: 3,
            reps: '10–15',
            weight: '25 lbs',
          },
        ],
      },
      {
        kind: 'superset',
        label: 'D',
        focus: 'reverse curl + floor press',
        rest: '60 sec after each pair',
        exercises: [
          {
            label: 'A',
            name: 'Reverse Curl',
            sets: 2,
            reps: '12–15',
            weight: '20 lbs',
          },
          {
            label: 'B',
            name: 'DB Floor Press (pump)',
            sets: 3,
            reps: '12–15',
            weight: '35–40 lbs',
          },
        ],
      },
    ],
  },
};

export default plan;
