import type { Metadata } from 'next';

import Cell from '@/components/Projects/Cell';
import PageWrapper from '@/components/Template/PageWrapper';
import data from '@/data/projects';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Projects',
  description:
    'Selected research and engineering projects by Ryan S. Bohluli in neurotechnology, neuromodulation, and biomedical devices.',
  path: '/projects/',
});

export default function ProjectsPage() {
  return (
    <PageWrapper mainClassName="page-main--wide">
      <section className="projects-page">
        <header className="page-header">
          <h1 className="page-title">Projects</h1>
        </header>

        <div className="projects-grid">
          {data.map((project) => (
            <Cell data={project} headingLevel="h2" key={project.title} />
          ))}
        </div>
      </section>
    </PageWrapper>
  );
}
