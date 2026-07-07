import type { Metadata } from 'next';

import PublicationList from '@/components/Publications/PublicationList';
import PageWrapper from '@/components/Template/PageWrapper';
import { presentations, publications } from '@/data/publications';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Publications',
  description:
    'Peer-reviewed publications and conference presentations by Ryan Bohluli in neuromodulation, focused ultrasound, and wearable neurotechnology.',
  path: '/publications/',
});

export default function PublicationsPage() {
  return (
    <PageWrapper mainClassName="page-main--wide">
      <section className="publications-page">
        <header className="page-header">
          <h1 className="page-title">Publications</h1>
        </header>

        <section className="publications-section">
          <h2 className="group-label">Publications</h2>
          <PublicationList items={publications} />
        </section>

        <section className="publications-section">
          <h2 className="group-label">Presentations</h2>
          <PublicationList items={presentations} />
        </section>
      </section>
    </PageWrapper>
  );
}
