export interface Project {
  title: string;
  subtitle?: string;
  link?: string;
  /**
   * Verb for the link affordance. Defaults to "Open" for internal routes and
   * "Visit" for external links.
   */
  linkLabel?: string;
  date: string;
  desc: string;
  tech?: string[];
}

/**
 * Curated display order (most to least relevant), not date order — this
 * array's order is exactly the order the Projects page renders.
 */
const data: Project[] = [
  {
    title: 'NSS Fleet Demo',
    subtitle: 'Neuro Safety Systems',
    link: 'https://demo.neurosafetysystems.com',
    date: '2026-06-01',
    desc: 'A fleet-management dashboard I built from scratch to monitor driver fatigue and shift hours across a trucking fleet, nudging at-risk drivers before fatigue becomes a hazard.',
    tech: ['TypeScript', 'React', 'Real-time UI', 'Product Design'],
  },
  {
    title: 'ankibot',
    subtitle: 'Personal project',
    link: 'https://ankibot.ryanbohluli.com',
    date: '2026-06-29',
    desc: "A flashcard study app I'm building toward an AI-assisted Anki-style tutor. It imports existing Anki decks and schedules reviews with a spaced-repetition engine, entirely client-side with no backend.",
    tech: ['TypeScript', 'React', 'Vite', 'Spaced Repetition'],
  },
  {
    title: "David Rosen's EMOMs",
    subtitle: 'Personal project',
    link: 'https://emoms.ryanbohluli.com',
    date: '2026-07-02',
    desc: 'An interval timer for EMOM ("every minute on the minute") workouts, with 3-2-1 audio cues and per-minute pacing targets for the ergs. It stays awake and readable across the gym, with a shared heatmap of who trained today.',
    tech: ['TypeScript', 'React', 'Web Audio', 'Cloudflare Workers'],
  },
  {
    title: 'Ember',
    subtitle: 'Personal project',
    link: 'https://github.com/anonuser1035/ember',
    date: '2026-07-10',
    desc: 'A macOS menu-bar app that keeps your Mac awake with one click, even with the lid closed. It asks for your admin password on every toggle and runs no background process to work around that.',
    tech: ['Swift', 'macOS', 'Menu Bar App'],
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
