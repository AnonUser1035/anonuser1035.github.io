/**
 * All homepage copy lives here, so a content pass never touches code.
 *
 * Inline links use Markdown syntax: [link text](https://example.com).
 * Use typographic apostrophes (’) and no em dashes.
 */

export const NAME = 'Ryan S. Bohluli';

export const DESCRIPTION =
  'Ryan S. Bohluli studies the nervous system at Johns Hopkins, co-founded Neuro Safety Systems, and volunteers as an EMT in Baltimore County.';

export const EMAIL = 'ryan@neurosafetysystems.com';

export const PROFILES = {
  linkedin: 'https://www.linkedin.com/in/bohluli/',
  github: 'https://github.com/anonuser1035',
  scholar: 'https://scholar.google.com/citations?user=8er4PycAAAAJ&hl=en',
  orcid: 'https://orcid.org/0000-0003-4182-5773',
} as const;

export interface Milestone {
  /** Short date shown upright before the caption, e.g. "Nov 2025". */
  label: string;
  /** One sentence shown in italics after the label. */
  text: string;
  /** Optional year printed on the strip under this beat's R peak. */
  tick?: string;
}

/**
 * One heartbeat per milestone, oldest first. The strip is drawn from this
 * list: changing its length changes the number of beats (9 to 15 fit).
 */
export const MILESTONES: Milestone[] = [
  {
    label: 'Jun 2022',
    tick: '2022',
    text: 'First research jobs: Abbott’s neuromodulation division, and a thermo-fluids lab at UT Dallas.',
  },
  {
    label: 'Aug 2023',
    tick: '2023',
    text: 'Started at Johns Hopkins in neuroscience, computational track. Joined the Mysore Lab.',
  },
  {
    label: 'Jul 2024',
    tick: '2024',
    text: 'Joined the Thakor Lab: focused ultrasound and autonomic control after spinal cord injury.',
  },
  {
    label: 'Sep 2024',
    text: 'Joined the Hopkins rugby team.',
  },
  {
    label: 'Dec 2024',
    text: 'Helped revive the Iranian Cultural Society at Hopkins.',
  },
  {
    label: 'May 2025',
    tick: '2025',
    text: 'Co-founded Neuro Safety Systems: wearable EEG for fatigue detection.',
  },
  {
    label: 'Jun 2025',
    text: 'PURA Fellow. Poster at the Georgetown-TUM Neuroengineering Conference.',
  },
  {
    label: 'Nov 2025',
    text: 'Joined the Arbutus Volunteer Fire Department. Cleared as an EMT provider in March 2026.',
  },
  {
    label: 'Nov 2025',
    text: 'Co-author, Scientific Reports: spinal cord neuromodulation for blood pressure control.',
  },
  {
    label: 'Feb 2026',
    tick: '2026',
    text: 'Joined the Cho Lab. Through May, postoperative delirium research in the Theodore/Lubelski Lab (Ceribell Project).',
  },
  {
    label: 'Apr 2026',
    text: 'First-author paper and poster at the Design of Medical Devices Conference. In May, Best Poster in Functional Neurosurgery at Hopkins.',
  },
  {
    label: 'Aug 2026',
    text: 'First-author paper in the Journal of Medical Devices: wearable autonomic monitoring with AURIS.',
  },
  {
    label: 'Oct 2026',
    text: 'Our collaborative paper on closed-loop control of blood flow was published in Nature Biomedical Engineering.',
  },
  {
    label: 'Nov 2026',
    text: 'Posted Fighting Sleep, a first-author bioRxiv preprint on minute-by-minute driver fatigue.',
  },
  {
    label: 'Now',
    tick: 'now',
    text: 'Applying to medical school. Honors thesis, Neuro Safety Systems, and calls with Arbutus.',
  },
];

/** Shown in the caption until a beat is selected. */
export const HINT = {
  text: 'Select a beat to explore.',
  /** Added on phones, where the strip scrolls sideways. */
  phone: 'Drag back for earlier years.',
};

export interface SelectedWork {
  title: string;
  href: string;
  venue: string;
}

export interface WorkList {
  intro: string;
  works: SelectedWork[];
}

/** A paragraph (string) or the short list of selected work. */
export type LetterBlock = string | WorkList;

export const LEAD =
  'Hi, I’m Ryan. I study the nervous system, mostly by trying to read it before something goes wrong.';

export const LETTER: LetterBlock[] = [
  'At Johns Hopkins I research how focused ultrasound might help regulate blood pressure after spinal cord injury, in the [Thakor Lab](https://neuroengineering.bme.jhu.edu/). With three Hopkins rugby teammates I also started [Neuro Safety Systems](https://neurosafetysystems.com/), which is developing wearable systems to detect driver drowsiness. [Here’s how it started](https://engineering.jhu.edu/magazine/inquiring-minds/change-agents/fighting-fatigue-on-the-road/).',
  'I volunteer as an EMT with the Arbutus Volunteer Fire Department in Baltimore County. I’m pursuing medicine, and I want patient care to shape the questions I study and the tools I build.',
  'I’m Iranian American and grew up in Dallas. I helped revive Hopkins’ Iranian Cultural Society and volunteer at Gandomak, a Farsi language school.',
  {
    intro: 'Selected work:',
    works: [
      {
        title:
          'Fighting Sleep: Minute-by-Minute Driver Fatigue from a Dry-Electrode EEG Headband',
        href: 'https://doi.org/10.64898/2026.11.18.767417',
        venue: 'bioRxiv preprint, 2026. First author.',
      },
      {
        title:
          'Optimal closed-loop feedback control of blood flow after spinal cord injury with norepinephrine',
        href: 'https://doi.org/10.1038/s41551-026-01777-6',
        venue: 'Nature Biomedical Engineering, 2026.',
      },
      {
        title:
          'Monitoring Autonomic Tone During Spinal Cord Neuromodulation Using Wearable AURIS Sensor',
        href: 'https://doi.org/10.1115/1.4072357',
        venue: 'Journal of Medical Devices, 2026. First author.',
      },
      {
        title:
          'Advances in Focused Ultrasound for Vagus Nerve Stimulation: Assessing Autonomic Tone for Non-Invasive Neuromodulation',
        href: 'https://doi.org/10.1115/DMD2026-1020',
        venue: 'ASME Design of Medical Devices Conference, 2026. First author.',
      },
    ],
  },
  `[All publications](${PROFILES.scholar}) are on Google Scholar, my author profile is on [ORCID](${PROFILES.orcid}), and [talks and posters](/talks/) have their own page.`,
  `The best way to reach me is [${EMAIL}](mailto:${EMAIL}). I’m also on [LinkedIn](${PROFILES.linkedin}), and here’s my [résumé (PDF)](/resume.pdf).`,
];

export const SIGNATURE = 'Ryan';

/** Closing line under the letter. */
export const FOOTER = 'Written in Dallas, TX';
