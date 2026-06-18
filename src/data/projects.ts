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
    date: '2026-06-01',
    desc: 'A fleet-management dashboard I built from scratch to demonstrate driver fatigue management and rerouting for truckers. Monitors live vigilance and shift hours across a fleet, escalates and nudges at-risk drivers, and surfaces recommended interventions before fatigue becomes a hazard.',
    tech: ['TypeScript', 'React', 'Real-time UI', 'Product Design'],
    featured: true,
  },
  {
    title: 'Vigilance Score',
    subtitle: 'Neuro Safety Systems',
    link: 'https://neurosafetysystems.com',
    date: '2025-05-01',
    desc: 'Real-time driver-fatigue platform that classifies vigilance states from in-ear EEG and triggers haptic feedback on-device within milliseconds. Outperforms camera-based fatigue detection by 40%.',
    tech: ['Python', 'EEG', 'Machine Learning', 'On-device Inference'],
    featured: true,
  },
  {
    title: 'Closed-Loop Neuromodulation System',
    subtitle: 'Thakor Lab — Honors Thesis',
    date: '2025-01-01',
    desc: 'Feedback-controlled epidural and focused-ultrasound stimulation that modulates mean arterial pressure in spinal-cord-injury models, using multi-modal physiological signals.',
    tech: ['MATLAB / Simulink', 'Signal Processing', 'Arduino'],
    featured: true,
  },
  {
    title: 'Wearable AURIS Sensor',
    subtitle: 'In-ear autonomic monitoring',
    date: '2025-03-01',
    desc: 'Custom PEDOT:PSS in-ear electrodes on flexible substrates plus a Python/MATLAB pipeline for R-peak detection and heart-rate-variability analysis, matching clinical gold-standard electrodes.',
    tech: ['PEDOT:PSS', 'Python', 'MATLAB', 'Signal Processing'],
    featured: true,
  },
  {
    title: 'Attentional Circuit Model',
    subtitle: 'Mysore Lab',
    date: '2024-05-01',
    desc: 'A Raspberry Pi simulation replicating the brain’s attentional-suppression pathways, built alongside two mentees who presented a companion build at a Young Engineers contest.',
    tech: ['Python', 'Raspberry Pi', 'Computer Vision'],
  },
  {
    title: 'Pharmacy Outreach Automation',
    subtitle: 'St. Vincent de Paul Pharmacy',
    date: '2025-02-01',
    desc: 'An n8n workflow with an AI-powered FAQ and SMS interface that automated patient outreach and cut administrative load for a volunteer pharmacy.',
    tech: ['n8n', 'OpenAI API', 'SMS'],
  },
  {
    title: 'Surgical Tooling & Ultrasound Integration',
    subtitle: 'Thakor Lab',
    date: '2024-10-01',
    desc: 'Custom surgical tools and ultrasound-integration devices designed and fabricated in SOLIDWORKS to improve neuromodulation experiments.',
    tech: ['SOLIDWORKS', 'Hardware', 'Fabrication'],
  },
];

export default data;
