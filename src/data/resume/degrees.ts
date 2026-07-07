export interface Degree {
  school: string;
  degree: string;
  link: string;
  year: number;
}

const degrees: Degree[] = [
  {
    school: 'Johns Hopkins University',
    degree:
      'B.S. Computational Neuroscience — Honors Thesis Program (GPA 3.92)',
    link: 'https://www.jhu.edu',
    year: 2027,
  },
  {
    school: 'School of Science and Engineering',
    degree: 'High School Diploma — Summa Cum Laude',
    link: 'https://semagnet.dallasisd.org/',
    year: 2023,
  },
];

export default degrees;
