import type { Metadata } from 'next';

import Cell from '@/components/Projects/Cell';
import PublicationList from '@/components/Publications/PublicationList';
import Education from '@/components/Resume/Education';
import Experience from '@/components/Resume/Experience';
import { PersonSchema } from '@/components/Schema';
import Hero from '@/components/Template/Hero';
import PageWrapper from '@/components/Template/PageWrapper';
import projects from '@/data/projects';
import { presentations, publications } from '@/data/publications';
import degrees from '@/data/resume/degrees';
import work from '@/data/resume/work';

export const metadata: Metadata = {
  description:
    'Ryan Bohluli: computational neuroscience at Johns Hopkins, co-founder & Chief Research Officer at Neuro Safety Systems, EMT, and aspiring physician. Experience, publications, education, and projects on one page.',
};

export default function HomePage() {
  return (
    <PageWrapper mainClassName="page-main--wide">
      <PersonSchema />
      <Hero />

      <div className="resume-page">
        <div className="resume-content">
          <section id="experience" className="resume-section">
            <Experience data={work} />
          </section>

          <section id="publications" className="resume-section">
            <div className="publications">
              <div className="title">
                <h2>Publications</h2>
              </div>

              <div className="publications-section">
                <h3 className="group-label">Publications</h3>
                <PublicationList items={publications} />
              </div>

              <div className="publications-section">
                <h3 className="group-label">Presentations</h3>
                <PublicationList items={presentations} />
              </div>
            </div>
          </section>

          <section id="education" className="resume-section">
            <Education data={degrees} />
          </section>

          <section id="projects" className="resume-section">
            <div className="projects">
              <div className="title">
                <h2>Projects</h2>
              </div>

              <div className="projects-grid">
                {projects.map((project) => (
                  <Cell data={project} headingLevel="h3" key={project.title} />
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageWrapper>
  );
}
