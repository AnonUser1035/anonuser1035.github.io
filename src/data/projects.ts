export interface Project {
  title: string;
  subtitle?: string;
  link?: string;
  /**
   * Screenshot shown as a cursor-following preview when hovering a linked
   * entry on a pointer device. Optional — entries without one simply show
   * no preview.
   */
  preview?: string;
  /**
   * Verb for the link affordance. Defaults to "Open" for internal routes and
   * "Visit" for external links.
   */
  linkLabel?: string;
  date: string;
  desc: string;
  tech?: string[];
  featured?: boolean;
}

const data: Project[] = [
  {
    title: 'NSS Fleet Demo',
    subtitle: 'Neuro Safety Systems',
    link: 'https://demo.neurosafetysystems.com',
    preview: '/images/projects/nss-fleet-demo.png',
    linkLabel: 'View demo',
    date: '2026-06-01',
    desc: 'A fleet-management dashboard I built from scratch to demonstrate driver fatigue management and rerouting for truckers. Monitors live vigilance and shift hours across a fleet, escalates and nudges at-risk drivers, and surfaces recommended interventions before fatigue becomes a hazard.',
    tech: ['TypeScript', 'React', 'Real-time UI', 'Product Design'],
    featured: true,
  },
  {
    title: 'ankibot',
    subtitle: 'Personal project',
    link: 'https://ankibot.ryanbohluli.com',
    linkLabel: 'Try it',
    date: '2026-06-29',
    desc: 'A flashcard study app I am building toward an AI-assisted Anki-style tutor. It imports existing Anki decks entirely in the browser, schedules reviews with a spaced-repetition engine, and runs a focused study session UI, all client-side with no backend.',
    tech: ['TypeScript', 'React', 'Vite', 'Spaced Repetition'],
    featured: true,
  },
  {
    title: "David Rosen's EMOMs",
    subtitle: 'Personal tool',
    link: '/workouts/',
    linkLabel: 'Open timer',
    date: '2026-07-02',
    desc: 'An interval timer for EMOM ("every minute on the minute") workouts. Workouts are authored as data and compiled into a flat timeline the timer plays — a running clock rotates through movements each minute, with 3-2-1 audio cues, per-minute pacing targets for the ergs, and a screen wake lock so it stays readable across the gym.',
    tech: ['TypeScript', 'React', 'Web Audio', 'Wake Lock API'],
    featured: true,
  },
];

/**
 * Internal site routes that are project "apps" — their link is an in-site
 * route rather than an external URL. Used so the Projects nav item stays
 * selected while you're inside one of these apps (trailing slash normalized).
 */
export const projectAppRoutes: string[] = data
  .filter((p): p is Project & { link: string } =>
    Boolean(p.link?.startsWith('/')),
  )
  .map((p) => p.link.replace(/\/+$/, '') || '/');

export default data;
