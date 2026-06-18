export interface Project {
  title: string;
  subtitle?: string;
  link?: string;
  image?: string;
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
    image: '/images/projects/nss-fleet-demo.png',
    date: '2026-06-01',
    desc: 'A fleet-management dashboard I built from scratch to demonstrate driver fatigue management and rerouting for truckers. Monitors live vigilance and shift hours across a fleet, escalates and nudges at-risk drivers, and surfaces recommended interventions before fatigue becomes a hazard.',
    tech: ['TypeScript', 'React', 'Real-time UI', 'Product Design'],
    featured: true,
  },
];

export default data;
