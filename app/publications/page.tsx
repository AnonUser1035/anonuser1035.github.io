import type { Metadata } from 'next';

import PageWrapper from '@/components/Template/PageWrapper';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Publications',
  description: 'Selected publications, posters, and research output.',
  path: '/publications/',
});

export default function PublicationsPage() {
  return (
    <PageWrapper mainClassName="page-main--wide">
      <section className="publications-page">
        <header className="publications-header">
          <h1 className="page-title">Publications</h1>
        </header>
        <p>Publications coming soon.</p>
      </section>
    </PageWrapper>
  );
}
