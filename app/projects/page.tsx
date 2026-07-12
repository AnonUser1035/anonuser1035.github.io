import type { Metadata } from 'next';

import LegacyRedirect from '@/components/Template/LegacyRedirect';

export const metadata: Metadata = {
  title: 'Projects',
  robots: { index: false, follow: true },
};

export default function ProjectsRedirect() {
  return <LegacyRedirect to="/#projects" label="Projects" />;
}
