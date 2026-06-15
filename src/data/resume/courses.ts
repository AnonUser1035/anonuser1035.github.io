export interface Course {
  title: string;
  number: string;
  link?: string;
  university: string;
}

const courses: Course[] = [
  {
    title: 'Neuroscience: Cellular & Systems I',
    number: 'AS.080.305',
    university: 'Johns Hopkins',
  },
  {
    title: 'Neuroscience: Cellular & Systems II',
    number: 'AS.080.306',
    university: 'Johns Hopkins',
  },
  {
    title: 'Neuroscience: Cognitive',
    number: 'AS.050.203',
    university: 'Johns Hopkins',
  },
  {
    title: 'Neuroeconomics',
    number: 'AS.080.308',
    university: 'Johns Hopkins',
  },
  {
    title: 'Foundations of Brain, Behavior & Cognition',
    number: 'AS.200.141',
    university: 'Johns Hopkins',
  },
  {
    title: 'Introduction to Computing',
    number: 'AS.250.205',
    university: 'Johns Hopkins',
  },
  {
    title: 'Biochemistry',
    number: 'AS.020.305',
    university: 'Johns Hopkins',
  },
  {
    title: 'Linear Algebra',
    number: 'AS.110.201',
    university: 'Johns Hopkins',
  },
  {
    title: 'Calculus III',
    number: 'AS.110.202',
    university: 'Johns Hopkins',
  },
  {
    title: 'Organic Chemistry I & II',
    number: 'AS.030.205/206',
    university: 'Johns Hopkins',
  },
  {
    title: 'Scientific Communication and Mentoring',
    number: 'AS.080.499',
    university: 'Johns Hopkins',
  },
  {
    title: 'Culture, Religion and Politics in Iran',
    number: 'AS.070.267',
    university: 'Johns Hopkins',
  },
];

export default courses;
