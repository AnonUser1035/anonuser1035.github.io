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
}

const work: Position[] = [
  {
    name: 'Neuro Safety Systems Inc.',
    position: 'Co-founder & Chief Research Officer',
    url: 'https://neurosafetysystems.com',
    startDate: '2025-05-01',
    summary: `Co-founded a neurotechnology venture building EEG-powered fatigue detection for the
    logistics industry. I direct research, the machine-learning pipeline, and academic and industry
    partnerships. The company is valued at $5M with $100k in pre-seed funding.`,
    highlights: [
      'Architected real-time ML pipelines that classify driver vigilance states from in-ear EEG, producing a proprietary Vigilance Score that outperforms camera-based fatigue classification by 40%.',
      'Built on-device inference models triggering haptic feedback within milliseconds, with encrypted local processing for data privacy.',
      'Recruited and supervised two interns (an EE PhD candidate and a CS undergraduate); led IRB submission for human fatigue trials at JHU Bayview.',
      'Co-authored a provisional patent on a DOT-compliant in-ear EEG headset; partnered with IDUN Technologies for consumer-grade hardware.',
      'Secured pilots with Terminal Transportation and Old Dominion Freight Line and a research partnership with the U.S. Army Aeromedical Research Laboratory (USAARL).',
      'Selected for Antler NYC and the JHU Pava Center Spark/Ignite/Fuel/Blaze accelerators; recognized at e-Fest, America 250, Telora, and the Carey Venture Showcase.',
    ],
  },
  {
    name: 'Thakor Laboratory, Johns Hopkins School of Medicine',
    position: 'Undergraduate Research Assistant (PURA Fellow)',
    url: 'https://thakorlab.jhu.edu',
    startDate: '2024-08-01',
    summary: `Independent and honors-thesis research on closed-loop neuromodulation for autonomic
    control after spinal cord injury. Awarded the Provost's Undergraduate Research Award (PURA) and a
    Neuroscience Departmental Summer Research Award.`,
    highlights: [
      'Engineered closed-loop epidural stimulation systems to modulate mean arterial pressure in post-spinal-cord-injury rats using multi-modal physiological signals.',
      'Led an independent project comparing focused ultrasound (FUS) to invasive vagus nerve stimulation — now the basis of my honors thesis and a first-author publication.',
      'Fabricated custom PEDOT:PSS in-ear sensors on PDMS substrates and built Python/MATLAB pipelines for R-peak detection and heart-rate-variability analysis matching clinical gold-standard electrodes.',
      'Performed 30+ rat laminectomies and assisted in 10+ porcine surgeries; authored an approved IACUC amendment to launch autonomic dysreflexia research.',
      'Contributed to 9 papers (2 first-author) and presented at the 2026 Design of Medical Devices Conference and Yale Bouchet Conference.',
    ],
  },
  {
    name: 'Cho Laboratory, Johns Hopkins School of Medicine',
    position: 'Undergraduate Research Assistant',
    url: 'https://www.hopkinsmedicine.org',
    startDate: '2026-02-01',
    summary: `Developing a clinical platform to characterize pain signals through in-ear EEG, validated
    against a 64-lead EEG cap.`,
    highlights: [
      'Hand-soldering in-ear electrodes and building a clinical-trial-ready data-collection and stimulation interface.',
      'Integrated an Arduino-based controlled pulse generator to synchronize recording software with the raw data stream.',
      'Attending cardiovascular surgeries on porcine models to contextualize the physiological basis of pain signaling.',
    ],
  },
  {
    name: 'Lubelski Laboratory (Ceribell Project), Johns Hopkins School of Medicine',
    position: 'Undergraduate Clinical Research Assistant',
    url: 'https://www.hopkinsmedicine.org',
    startDate: '2026-02-01',
    endDate: '2026-05-01',
    summary: `Clinical EEG research identifying early biomarkers of postoperative delirium in spine
    surgery patients.`,
    highlights: [
      'Consent patients, administer pre-operative cognitive assessments, and apply the Ceribell rapid EEG headset with signal-quality verification before surgery.',
      'Monitor and maintain EEG signal integrity intraoperatively while coordinating with surgical and nursing teams.',
      'Assess patient alertness and comfort in the post-anesthesia care unit before final data collection.',
    ],
  },
  {
    name: 'Arbutus Volunteer Fire Department',
    position: 'Volunteer EMT',
    url: 'https://www.arbutusvfd.com',
    startDate: '2025-11-01',
    summary: `Pre-hospital patient care as a certified EMT-Basic on a Baltimore County BLS/ALS unit.`,
    highlights: [
      'Responded to 70+ calls across lower-income Baltimore County neighborhoods, serving patients in homelessness, substance-use, and mental-health crises.',
      "Participate in Baltimore's Narcan leave-behind program, distributing naloxone at no cost.",
      'Completed station-based field training, HAZMAT, CPR/BLS recertification, and fire-pole certification; help run firehouse community events.',
    ],
  },
  {
    name: 'Mysore Laboratory, Johns Hopkins University',
    position: 'Undergraduate Research Assistant',
    url: 'https://mysore.bme.jhu.edu',
    startDate: '2023-09-01',
    endDate: '2024-07-01',
    summary: `Studied attentional suppression circuits in avian and rodent models.`,
    highlights: [
      'Set up and tested experimental devices and mapped circuit-level dynamics from raw data.',
      'Built a Raspberry Pi simulation replicating the brain’s attentional pathways.',
      'Mentored two high-school students in Python, machine learning, and hardware toward a conference-ready Young Engineers demonstration.',
    ],
  },
  {
    name: 'Abbott Laboratories, Neuromodulation Division',
    position: 'Applied Research Assistant',
    url: 'https://www.abbott.com',
    startDate: '2022-06-01',
    endDate: '2022-08-01',
    highlights: [
      'Contributed to an Abbott Invention Disclosure for gait analysis using a spine-implanted inertial measurement unit (IMU).',
      'Initiated algorithm development for wearable-sensor data collection.',
      'Supported data processing for the REALITY study analyzing long-term outcomes of 2,000+ neurostimulation patients.',
    ],
  },
  {
    name: 'Advanced Research in Thermo-Fluid Systems Lab, UT Dallas',
    position: 'Research Assistant',
    url: 'https://www.utdallas.edu',
    startDate: '2022-06-01',
    endDate: '2022-10-01',
    highlights: [
      'Researched early diagnosis for non-lactating mothers using machine learning.',
      'Invited as a presenter at the BMES Annual Conference for a selective high-school poster competition.',
    ],
  },
];

export default work;
