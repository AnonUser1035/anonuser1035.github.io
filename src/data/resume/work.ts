/**
 * Conforms to https://jsonresume.org/schema/
 */
export interface Position {
  name: string;
  position: string;
  url: string;
  startDate: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
  /**
   * When true, the role renders as a single compact ledger line (org · role ·
   * year) under "Earlier experience" instead of a full summary block. Reserved
   * for older/minor roles so the lead roles carry the weight.
   */
  condensed?: boolean;
}

// Lead roles get one high-signal sentence each — the technical detail lives in
// the Skills section, not repeated per role. Older/minor roles are `condensed`
// to a single ledger line with no summary.
const work: Position[] = [
  {
    name: 'Neuro Safety Systems Inc.',
    position: 'Co-founder & Chief Research Officer',
    url: 'https://neurosafetysystems.com',
    startDate: '2025-05-01',
    summary: `Co-founded a neurotechnology venture ($5M valuation, $100K pre-seed)
    building in-ear EEG for driver-fatigue detection. I direct research, the
    machine-learning pipeline, and partnerships spanning national freight carriers and
    the U.S. Army Aeromedical Research Laboratory.`,
  },
  {
    name: 'Thakor Laboratory, Johns Hopkins School of Medicine',
    position: 'Undergraduate Research Assistant (PURA Fellow)',
    url: 'https://neuroengineering.bme.jhu.edu/',
    startDate: '2024-08-01',
    summary: `PURA Fellow studying closed-loop neuromodulation for autonomic control
    after spinal cord injury, with an independent honors thesis comparing focused
    ultrasound to vagus nerve stimulation that became a first-author publication.`,
  },
  {
    name: 'Cho Laboratory, Johns Hopkins School of Medicine',
    position: 'Undergraduate Research Assistant',
    url: 'https://www.hopkinsmedicine.org',
    startDate: '2026-02-01',
    summary: `Building a clinical platform that characterizes pain through in-ear EEG,
    validated against a 64-lead clinical EEG cap.`,
  },
  {
    name: 'Lubelski Laboratory (Ceribell Project), Johns Hopkins School of Medicine',
    position: 'Undergraduate Clinical Research Assistant',
    url: 'https://www.hopkinsmedicine.org',
    startDate: '2026-02-01',
    endDate: '2026-05-01',
    summary: `Clinical EEG research identifying early biomarkers of postoperative
    delirium in spine-surgery patients, from preoperative consent through
    intraoperative monitoring.`,
  },
  {
    name: 'Arbutus Volunteer Fire Department',
    position: 'Volunteer EMT',
    url: 'https://www.arbutusvfd.org/',
    startDate: '2025-11-01',
    summary: `Certified EMT-Basic on a Baltimore County BLS/ALS unit, responding to 70+
    calls in underserved neighborhoods and distributing naloxone through Baltimore's
    leave-behind program.`,
  },
  {
    name: 'Mysore Laboratory, Johns Hopkins University',
    position: 'Undergraduate Research Assistant',
    url: 'https://mysorelab.johnshopkins.edu/',
    startDate: '2023-09-01',
    endDate: '2024-07-01',
    condensed: true,
  },
  {
    name: 'Abbott Laboratories, Neuromodulation Division',
    position: 'Applied Research Assistant',
    url: 'https://www.abbott.com',
    startDate: '2022-06-01',
    endDate: '2022-08-01',
    condensed: true,
  },
  {
    name: 'Advanced Research in Thermo-Fluid Systems Lab, UT Dallas',
    position: 'Research Assistant',
    url: 'https://www.utdallas.edu',
    startDate: '2022-06-01',
    endDate: '2022-10-01',
    condensed: true,
  },
];

export default work;
