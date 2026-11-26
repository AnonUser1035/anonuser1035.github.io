/**
 * Talks and posters, newest first, shown on /talks/. Publications live on
 * Google Scholar instead. Author lists use Vancouver style; AUTHOR_KEY is set
 * in weight 500 on render. No em dashes.
 */

export interface Talk {
  title: string;
  authors: string;
  venue: string;
  year: string;
  /** "Poster" or "Talk", when known. */
  kind?: string;
  award?: string;
}

export const AUTHOR_KEY = 'Bohluli RS';

export const TALKS: Talk[] = [
  {
    // Descriptive label: the final printed title is unverified.
    title: 'Focused ultrasound for non-invasive vagus nerve stimulation',
    authors:
      'Bohluli RS, Lopez AF, Perkins PL, Griffith KM, Baca EC, Tandri A, Kramer PJ, Davidar AD, Theodore N, Cho SM, Kang J, Thakor NV',
    venue: 'Johns Hopkins Neurosurgery Research Day (Synapse Summit)',
    year: '2026',
    kind: 'Poster',
    award: 'Best Poster in Functional Neurosurgery',
  },
  {
    title:
      'Advances in Focused Ultrasound for Vagus Nerve Stimulation: Assessing Autonomic Tone',
    authors: 'Bohluli RS, et al.',
    venue: 'Design of Medical Devices Conference, Minneapolis, MN',
    year: '2026',
    kind: 'Poster',
  },
  {
    title:
      'Spatially Targeted Neuromodulation with Focused Ultrasound for Autonomic and Hemodynamic Control',
    authors: 'Lopez AF, Bohluli RS, Griffith KM, Thakor NV',
    venue: 'Yale Bouchet Conference',
    year: '2026',
  },
  {
    title:
      'Integration of Near-Infrared Spectroscopy in Blood Pressure Modulation',
    authors: 'Bohluli RS, et al.',
    venue: 'Georgetown-TUM Neuroengineering Conference',
    year: '2025',
    kind: 'Poster',
  },
];
