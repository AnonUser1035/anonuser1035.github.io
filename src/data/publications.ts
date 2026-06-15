export interface Publication {
  /** Full author list. The author name matching AUTHOR_LASTNAME is emphasized on render. */
  authors: string;
  title: string;
  venue: string;
  /** Display year, e.g. "2026". Optional for forthcoming work. */
  year?: string;
  /** Publication status, e.g. "In Press", "Accepted", "Under Review". */
  status?: string;
  /** Digital Object Identifier (without the https://doi.org/ prefix). */
  doi?: string;
  /** Direct link, if not derivable from a DOI. */
  url?: string;
  /** True when Ryan is the first author. */
  firstAuthor?: boolean;
}

/** Substring of the author string to emphasize when rendering. */
export const AUTHOR_KEY = 'Bohluli, R.S.';

export const publications: Publication[] = [
  {
    authors: 'Bohluli, R.S., et al.',
    title:
      'Advances in Focused Ultrasound for Vagus Nerve Stimulation: Assessing Autonomic Tone',
    venue: 'ASME Digital Collection',
    year: '2026',
    status: 'In Press',
    doi: '10.1115/DMD2026-1020',
    firstAuthor: true,
  },
  {
    authors: 'Bohluli, R.S., et al.',
    title:
      'Monitoring Autonomic Tone During Spinal Cord Neuromodulation Using a Wearable AURIS Sensor',
    venue: 'bioRxiv',
    year: '2026',
    doi: '10.64898/2026.03.07.709943',
    firstAuthor: true,
  },
  {
    authors: 'Lopez, A.F., … Bohluli, R.S., et al.',
    title:
      'Hemodynamic Impact of Different Vasopressors on Blood Flow in the Middle Cerebral Artery',
    venue: 'Neurosurgery 72 (Supplement 1), p. 145',
    year: '2026',
    doi: '10.1227/neu.0000000000003964_492',
  },
  {
    authors: 'Lopez, A.F., … Bohluli, R.S., et al.',
    title:
      'Spinal Cord Neuromodulation for Blood Pressure Control Using Focused Ultrasound',
    venue: 'Nature Scientific Reports',
    year: '2025',
    doi: '10.1038/s41598-025-25330-8',
  },
  {
    authors: 'Routkevitch, D., … Bohluli, R.S., et al.',
    title: 'Optimal Norepinephrine-Mediated Feedback Control of Blood Flow',
    venue: 'Nature Biomedical Engineering',
    status: 'Accepted, In Press',
  },
  {
    authors: 'Griffith, K.M., … Bohluli, R.S., et al.',
    title: 'From Invasive to Non-Invasive: Focused Ultrasound Neuromodulation',
    venue: 'ASME Digital Collection',
    status: 'Accepted, In Press',
    doi: '10.1115/DMD2026-1008',
  },
  {
    authors: 'Lopez, A.F., … Bohluli, R.S., et al.',
    title:
      'Cerebral vs. Spinal Autoregulation: Hemodynamic Responses in a Porcine Model Following Traumatic Injury',
    venue: 'Manuscript',
    status: 'Under Review',
  },
  {
    authors: 'Lopez, A.F., Bohluli, R.S., Thakor, N.V.',
    title:
      'Engineering Neuromodulation Techniques: A Review of Current Methods and Promising Therapeutic Approaches',
    venue: 'CAE Engineering Journal',
    status: 'Under Review',
  },
];

export const presentations: Publication[] = [
  {
    authors: 'Bohluli, R.S., et al.',
    title:
      'Advances in Focused Ultrasound for Vagus Nerve Stimulation: Assessing Autonomic Tone',
    venue:
      'Poster — 2026 Design of Medical Devices Conference, Minneapolis, MN',
    year: 'Apr 2026',
    firstAuthor: true,
  },
  {
    authors: 'Lopez, A.F., Bohluli, R.S., Griffith, K.M., Thakor, N.V.',
    title:
      'Spatially Targeted Neuromodulation with Focused Ultrasound for Autonomic and Hemodynamic Control',
    venue: '2026 Yale Bouchet Conference',
    year: 'Apr 2026',
  },
  {
    authors: 'Bohluli, R.S., et al.',
    title:
      'Integration of Near-Infrared Spectroscopy in Blood Pressure Modulation',
    venue: 'Poster — Georgetown-TUM Neuroengineering Conference',
    year: 'Jun 2025',
    firstAuthor: true,
  },
];
