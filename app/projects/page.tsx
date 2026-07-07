import type { Metadata } from 'next';

import Cell from '@/components/Projects/Cell';
import PageWrapper from '@/components/Template/PageWrapper';
import data from '@/data/projects';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Projects',
  description:
    'Selected research and engineering projects by Ryan Bohluli in neurotechnology, neuromodulation, and biomedical devices.',
  path: '/projects/',
});

export default function ProjectsPage() {
  // Newest first within each group.
  const byDateDesc = (a: (typeof data)[number], b: (typeof data)[number]) =>
    b.date.localeCompare(a.date);
  const featuredProjects = data.filter((p) => p.featured).sort(byDateDesc);
  const otherProjects = data.filter((p) => !p.featured).sort(byDateDesc);
  // Only label the two groups when both exist; a lone group reads as the page
  // itself, not a sub-section. Scales up cleanly as more projects are added.
  const showGroupLabels =
    featuredProjects.length > 0 && otherProjects.length > 0;

  return (
    <PageWrapper mainClassName="page-main--wide">
      <section className="projects-page">
        <header className="page-header">
          <h1 className="page-title">Projects</h1>
        </header>

        {featuredProjects.length > 0 && (
          <section className="projects-featured">
            {showGroupLabels && <h2 className="group-label">Selected Work</h2>}
            <div className="projects-grid">
              {featuredProjects.map((project) => (
                <Cell
                  data={project}
                  headingLevel={showGroupLabels ? 'h3' : 'h2'}
                  key={project.title}
                />
              ))}
            </div>
          </section>
        )}

        {otherProjects.length > 0 && (
          <section className="projects-other">
            {showGroupLabels && <h2 className="group-label">More Projects</h2>}
            <div className="projects-grid">
              {otherProjects.map((project) => (
                <Cell
                  data={project}
                  headingLevel={showGroupLabels ? 'h3' : 'h2'}
                  key={project.title}
                />
              ))}
            </div>
          </section>
        )}
      </section>
    </PageWrapper>
  );
}
