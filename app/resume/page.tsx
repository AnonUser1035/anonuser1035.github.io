import type { Metadata } from 'next';

import Education from '@/components/Resume/Education';
import Experience from '@/components/Resume/Experience';
import ResumeNav from '@/components/Resume/ResumeNav';
import Skills from '@/components/Resume/Skills';
import PageWrapper from '@/components/Template/PageWrapper';
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
            Researcher in closed-loop neuromodulation and wearable
            neurotechnology across the Thakor and Cho Labs at Johns Hopkins, an
            independent honors thesis on focused-ultrasound vagus nerve
            stimulation, and the R&amp;D organization I built as co-founder and
            Chief Research Officer of Neuro Safety Systems. Nine publications
            across Nature Biomedical Engineering, Scientific Reports, and ASME.
            Certified EMT and aspiring physician.
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
        </div>
      </section>
    </PageWrapper>
  );
}
