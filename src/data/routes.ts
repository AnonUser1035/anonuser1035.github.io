export interface Route {
  label: string;
  path: string;
  index?: boolean;
}

const routes: Route[] = [
  {
    index: true,
    label: 'Ryan Bohluli',
    path: '/',
  },
  {
    label: 'Resume',
    path: '/resume',
  },
  {
    label: 'Projects',
    path: '/projects',
  },
  {
    label: 'Publications',
    path: '/publications',
  },
  {
    label: 'Workouts',
    path: '/workouts',
  },
  {
    label: 'Contact',
    path: '/contact',
  },
];

export default routes;
