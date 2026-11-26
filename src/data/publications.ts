/**
 * Everything listed on /papers, grouped as shown. Author lists use Vancouver
 * style; AUTHOR_KEY is set in weight 500 on render. No em dashes.
 */

export interface Publication {
  title: string;
  authors: string;
  /** Journal, conference or server. Omit for manuscripts under review. */
  venue?: string;
  year?: string;
  /** "In press", "Accepted", "Under review", or "Poster" for presentations. */
  status?: string;
  /** DOI without the https://doi.org/ prefix. */
  doi?: string;
}

export interface PublicationGroup {
  name: string;
  items: Publication[];
}

export const AUTHOR_KEY = 'Bohluli RS';

export const PUBLICATION_GROUPS: PublicationGroup[] = [
  {
    name: 'Papers',
    items: [
      {
        title:
          'Advances in Focused Ultrasound for Vagus Nerve Stimulation: Assessing Autonomic Tone for Non-Invasive Neuromodulation',
        authors: 'Bohluli RS, et al.',
        venue: 'Design of Medical Devices Conference (DMD2026), ASME',
        year: '2026',
        status: 'In press',
        doi: '10.1115/DMD2026-1020',
      },
      {
        title:
          'Hemodynamic Impact of Different Vasopressors on Blood Flow in the Middle Cerebral Artery',
        authors: 'Lopez AF, … Bohluli RS, et al.',
        venue: 'Neurosurgery 72 (Supplement 1), p. 145',
        year: '2026',
        doi: '10.1227/neu.0000000000003964_492',
      },
      {
        title:
          'Spinal Cord Neuromodulation for Blood Pressure Control Using Low-Intensity Focused Ultrasound',
        authors: 'Lopez AF, … Bohluli RS, et al.',
        venue: 'Scientific Reports',
        year: '2025',
        doi: '10.1038/s41598-025-25330-8',
      },
      {
        title: 'Optimal Norepinephrine-Mediated Feedback Control of Blood Flow',
        authors: 'Routkevitch D, … Bohluli RS, et al.',
        venue: 'Nature Biomedical Engineering',
        status: 'Accepted',
      },
      {
        title:
          'From Invasive to Non-Invasive: Focused Ultrasound Neuromodulation of the Spinal Cord',
        authors: 'Griffith KM, … Bohluli RS, et al.',
        venue: 'Design of Medical Devices Conference (DMD2026), ASME',
        year: '2026',
        status: 'In press',
        doi: '10.1115/DMD2026-1008',
      },
    ],
  },
  {
    name: 'Preprints and manuscripts',
    items: [
      {
        title:
          'Monitoring Autonomic Tone During Spinal Cord Neuromodulation Using Wearable AURIS Sensor',
        authors: 'Bohluli RS, et al.',
        venue: 'bioRxiv',
        year: '2026',
        doi: '10.64898/2026.03.07.709943',
      },
      {
        title:
          'Cerebral vs. Spinal Autoregulation: Hemodynamic Responses in a Porcine Model Following Traumatic Injury',
        authors: 'Lopez AF, … Bohluli RS, et al.',
        status: 'Under review',
      },
      {
        title:
          'Engineering Neuromodulation Techniques: A Review of Current Methods and Promising Therapeutic Approaches',
        authors: 'Lopez AF, Bohluli RS, Thakor NV',
        status: 'Under review',
      },
    ],
  },
  {
    name: 'Presentations',
    items: [
      {
        title:
          'Advances in Focused Ultrasound for Vagus Nerve Stimulation: Assessing Autonomic Tone',
        authors: 'Bohluli RS, et al.',
        venue: 'Design of Medical Devices Conference, Minneapolis, MN',
        year: '2026',
        status: 'Poster',
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
        status: 'Poster',
      },
    ],
  },
];
