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
  // Temporarily hidden while under revision — re-add to show on /projects.
  // {
  //   title: 'Workout Tracker',
  //   subtitle: 'Personal tool',
  //   link: '/workouts/',
  //   preview: '/images/projects/workout-tracker.png',
  //   linkLabel: 'Open tracker',
  //   date: '2026-06-20',
  //   desc: "An interactive weekly training tracker that lays out each day's split, lets me check off sets as I go, and persists progress in the browser — resetting automatically each day.",
  //   tech: ['TypeScript', 'React', 'localStorage'],
  //   featured: true,
  // },
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
