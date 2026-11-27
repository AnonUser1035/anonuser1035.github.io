/**
 * Talks and posters, newest first, shown on /talks/. Publications live on
 * Google Scholar instead. Author lists use Vancouver style and are given in
 * full; AUTHOR_KEY is set in weight 500 on render. No em dashes.
 */

export interface Talk {
  title: string;
  authors: string;
  venue: string;
  year: string;
  /** "Poster" or "Talk". */
  kind?: string;
  award?: string;
  /** The published version of the work (a DOI link), when there is one. */
  href?: string;
}

export const AUTHOR_KEY = 'Bohluli RS';

// Presented twice in 2026, under the title of the published conference paper.
const FUS_VNS = {
  title:
    'Advances in Focused Ultrasound for Vagus Nerve Stimulation: Assessing Autonomic Tone for Non-Invasive Neuromodulation',
  authors:
    'Bohluli RS, Lopez AF, Perkins PL, Griffith KM, Baca EC, Tandri A, Kramer PJ, Davidar AD, Theodore N, Cho SM, Kang J, Thakor NV',
  href: 'https://doi.org/10.1115/DMD2026-1020',
};

export const TALKS: Talk[] = [
  {
    ...FUS_VNS,
    venue: 'Johns Hopkins Neurosurgery Research Day (Synapse Summit)',
    year: '2026',
    kind: 'Poster',
    award: 'Best Poster in Functional Neurosurgery',
  },
  {
    ...FUS_VNS,
    venue: 'ASME Design of Medical Devices Conference',
    year: '2026',
    kind: 'Poster',
  },
  {
    title:
      'Spatially Targeted Neuromodulation with Focused Ultrasound for Autonomic and Hemodynamic Control',
    authors: 'Lopez AF, Bohluli RS, Griffith KM, Thakor NV',
    venue: 'Yale Bouchet Conference',
    year: '2026',
    kind: 'Poster',
  },
  {
    title:
      'Integration of Near Infrared Spectroscopy in Blood Pressure Modulation',
    authors: 'Bohluli RS, Lopez AF, Routkevitch D, Theodore N, Thakor NV',
    venue: 'Georgetown-TUM Neuroengineering Conference',
    year: '2025',
    kind: 'Poster',
  },
];
