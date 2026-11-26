/**
 * All homepage copy lives here, so a content pass never touches code.
 *
 * Inline links use Markdown syntax: [link text](https://example.com).
 * Use typographic apostrophes (’) and no em dashes.
 */

export const NAME = 'Ryan S. Bohluli';

export const DESCRIPTION =
  'Ryan S. Bohluli studies the nervous system at Johns Hopkins, co-founded Neuro Safety Systems, and rides as an EMT in Baltimore County.';

export const EMAIL = 'ryan@neurosafetysystems.com';

export const PROFILES = {
  linkedin: 'https://www.linkedin.com/in/bohluli/',
  github: 'https://github.com/anonuser1035',
  scholar: 'https://scholar.google.com/citations?user=8er4PycAAAAJ&hl=en',
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
    label: '2022',
    tick: '2022',
    text: 'First research jobs: Abbott’s neuromodulation division, and a thermo-fluids lab at UT Dallas.',
  },
  {
    label: '2023',
    tick: '2023',
    text: 'Started computational neuroscience at Johns Hopkins. Joined the Mysore Lab.',
  },
  {
    label: '2024',
    tick: '2024',
    text: 'Joined the Thakor Lab: focused ultrasound and autonomic control after spinal cord injury.',
  },
  {
    label: 'May 2025',
    tick: '2025',
    text: 'Co-founded Neuro Safety Systems: wearable EEG for fatigue detection.',
  },
  {
    label: 'Summer 2025',
    text: 'PURA Fellow. Poster at the Georgetown-TUM Neuroengineering Conference.',
  },
  {
    label: '2025',
    text: 'Co-author, Scientific Reports: spinal cord neuromodulation for blood pressure control.',
  },
  {
    label: 'Nov 2025',
    text: 'Started running calls as an EMT-B with the Arbutus Volunteer Fire Department.',
  },
  {
    label: 'Feb 2026',
    tick: '2026',
    text: 'Joined the Cho Lab (in-ear EEG for pain) and the Lubelski Lab (EEG and postoperative delirium).',
  },
  {
    label: 'Mar 2026',
    text: 'First-author preprint on bioRxiv: wearable monitoring of autonomic tone.',
  },
  {
    label: 'Apr 2026',
    text: 'First-author paper and poster at the Design of Medical Devices Conference, Minneapolis.',
  },
  {
    label: '2026',
    text: 'Co-author, Nature Biomedical Engineering (accepted): feedback control of blood flow.',
  },
  {
    label: 'Now',
    tick: 'now',
    text: 'Honors thesis, Neuro Safety Systems, the Cho Lab, and calls with Arbutus.',
  },
];

export interface RecentPaper {
  title: string;
  href: string;
  venue: string;
}

export interface PaperList {
  intro: string;
  papers: RecentPaper[];
}

/** A paragraph (string) or the short list of recent papers. */
export type LetterBlock = string | PaperList;

export const LEAD =
  'Hi, I’m Ryan. I study the nervous system, mostly by trying to read it before something goes wrong.';

export const LETTER: LetterBlock[] = [
  'At Johns Hopkins I work on focused ultrasound that steadies blood pressure after spinal cord injury, in the [Thakor Lab](https://neuroengineering.bme.jhu.edu/), and on in-ear EEG for measuring pain, in the Cho Lab. With three co-founders I started [Neuro Safety Systems](https://neurosafetysystems.com/), which uses wearable EEG to catch fatigue before it turns into a crash. I also ride as an EMT with the Arbutus Volunteer Fire Department in Baltimore County.',
  'I grew up in Dallas. I’m pre-med, and the long-term plan is to work somewhere between the clinic, the lab, and a company, which is more or less where I already am.',
  {
    intro: 'A few recent papers:',
    papers: [
      {
        title:
          'Advances in focused ultrasound for vagus nerve stimulation: assessing autonomic tone',
        href: 'https://doi.org/10.1115/DMD2026-1020',
        venue: 'Design of Medical Devices Conference, 2026. First author.',
      },
      {
        title:
          'Monitoring autonomic tone during spinal cord neuromodulation using a wearable AURIS sensor',
        href: 'https://doi.org/10.64898/2026.03.07.709943',
        venue: 'bioRxiv, 2026. First author.',
      },
      {
        title:
          'Spinal cord neuromodulation for blood pressure control using low-intensity focused ultrasound',
        href: 'https://doi.org/10.1038/s41598-025-25330-8',
        venue: 'Scientific Reports, 2025.',
      },
    ],
  },
  'The full list, with talks and posters, is [here](/papers/).',
  'I also build small tools when I need them: a [flashcard app](https://ankibot.ryanbohluli.com/), a [timer for erg workouts](https://emoms.ryanbohluli.com/), and a [menu-bar app](https://github.com/anonuser1035/ember) that keeps a Mac awake with the lid closed.',
  `The best way to reach me is [${EMAIL}](mailto:${EMAIL}). I’m also on [LinkedIn](${PROFILES.linkedin}) and [Google Scholar](${PROFILES.scholar}), and my CV is [here](/resume.pdf).`,
];

export const SIGNATURE = 'Ryan';

export const POSTSCRIPT = {
  text: 'P.S. Every beat on the strip up top is a milestone.',
  /** Shown where the device can hover. */
  pointer: 'Hover over one.',
  /** Shown on touch screens, (hover: none). */
  touch: 'Tap one, or drag the strip back for earlier years.',
};

/** Place, then the month and year of the last content update. */
export const FOOTER = 'Baltimore, November 2026';
