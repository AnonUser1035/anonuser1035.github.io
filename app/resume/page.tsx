import type { Metadata } from 'next';

import Courses from '@/components/Resume/Courses';
import Education from '@/components/Resume/Education';
import Experience from '@/components/Resume/Experience';
import ResumeNav from '@/components/Resume/ResumeNav';
import Skills from '@/components/Resume/Skills';
import PageWrapper from '@/components/Template/PageWrapper';
import courses from '@/data/resume/courses';
import degrees from '@/data/resume/degrees';
import { categories, skills } from '@/data/resume/skills';
import work from '@/data/resume/work';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Resume',
  description:
    'Ryan Bohluli — Johns Hopkins computational neuroscience, Neuro Safety Systems, Thakor & Cho Labs, EMT, and research in closed-loop neuromodulation.',
  path: '/resume/',
});

export default function ResumePage() {
  return (
    <PageWrapper>
      <section className="resume-page">
        <header className="resume-header">
          <h1 className="resume-title">Resume</h1>
          <p className="resume-summary">
            Computational neuroscience student at Johns Hopkins building
            closed-loop neuromodulation systems and wearable neurotechnology.
            Co-founder &amp; Chief Research Officer of Neuro Safety Systems,
            researcher in the Thakor and Cho Labs, certified EMT, and aspiring
            physician. Contributor to nine publications across Nature Biomedical
            Engineering, Scientific Reports, and ASME.
          </p>
        </header>

        <ResumeNav />

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

          <section id="courses" className="resume-section">
            <Courses data={courses} />
          </section>
        </div>
      </section>
    </PageWrapper>
  );
}
