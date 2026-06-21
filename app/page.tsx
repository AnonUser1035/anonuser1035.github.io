import type { Metadata } from 'next';
import Link from 'next/link';

import { PersonSchema } from '@/components/Schema';
import Hero from '@/components/Template/Hero';
import PageWrapper from '@/components/Template/PageWrapper';

export const metadata: Metadata = {
  description:
    'Ryan Bohluli — computational neuroscience at Johns Hopkins, co-founder & Chief Research Officer at Neuro Safety Systems, EMT, and aspiring physician.',
};

const destinations = [
  {
    href: '/projects',
    label: 'Projects',
    desc: 'Selected research and engineering — in-ear EEG, neuromodulation, and the Neuro Safety Systems fleet demo.',
  },
  {
    href: '/publications',
    label: 'Publications',
    desc: 'Nine peer-reviewed papers across Nature Biomedical Engineering, Scientific Reports, and ASME.',
  },
];

export default function HomePage() {
  return (
    <PageWrapper>
      <PersonSchema />
      <Hero />

      <nav className="home-directory" aria-label="Explore the site">
        <ul className="directory-list">
          {destinations.map((d) => (
            <li key={d.href}>
              <Link href={d.href} className="directory-row">
                <span className="directory-row-label">{d.label}</span>
                <span className="directory-row-desc">{d.desc}</span>
                <span className="directory-row-arrow" aria-hidden="true">
                  &rarr;
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </PageWrapper>
  );
}
