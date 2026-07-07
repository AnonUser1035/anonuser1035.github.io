import type { Metadata } from 'next';
import Link from 'next/link';

import ContactIcons from '@/components/Contact/ContactIcons';
import EmailLink from '@/components/Contact/EmailLink';
import Education from '@/components/Resume/Education';
import Experience from '@/components/Resume/Experience';
import ResumeNav from '@/components/Resume/ResumeNav';
import Skills from '@/components/Resume/Skills';
import { PersonSchema } from '@/components/Schema';
import Hero from '@/components/Template/Hero';
import PageWrapper from '@/components/Template/PageWrapper';
import degrees from '@/data/resume/degrees';
import { categories, skills } from '@/data/resume/skills';
import work from '@/data/resume/work';

export const metadata: Metadata = {
  description:
    'Ryan Bohluli — computational neuroscience at Johns Hopkins, co-founder & Chief Research Officer at Neuro Safety Systems, EMT, and aspiring physician. Experience, education, skills, and contact info.',
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

      <ResumeNav />

      <div className="resume-page">
        <div className="resume-content">
          <section id="experience" className="resume-section">
            <Experience data={work} />
          </section>

          <section id="education" className="resume-section">
            <Education data={degrees} />
          </section>

          <section id="skills" className="resume-section">
            <Skills skills={skills} categories={categories} />
          </section>
        </div>
      </div>

      <section id="contact" className="resume-section home-contact">
        <div className="contact-header">
          <h2>Contact</h2>
        </div>

        <div className="contact-content">
          <div className="contact-email-block">
            <EmailLink />
            <p className="contact-hint">Usually respond within 24 hours</p>
          </div>

          <div className="contact-divider">
            <span>or find me on</span>
          </div>

          <ContactIcons />
        </div>
      </section>

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
