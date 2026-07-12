export interface Section {
  label: string;
  id: string;
}

/**
 * Homepage sections in page order. Drives the header nav links, the
 * hamburger slide menu, and the scroll-spy targets so labels, ids, and
 * order can never drift between surfaces.
 */
const sections: Section[] = [
  { label: 'Experience', id: 'experience' },
  { label: 'Education', id: 'education' },
  { label: 'Publications', id: 'publications' },
  { label: 'Projects', id: 'projects' },
];

export const sectionIds: string[] = sections.map((section) => section.id);

export default sections;
