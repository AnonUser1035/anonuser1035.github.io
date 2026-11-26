import type { Metadata } from 'next';

import PaperGroups from '@/components/Papers/PaperGroups';
import { NAME } from '@/data/content';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Papers',
  description: `Papers, preprints and presentations by ${NAME}.`,
  path: '/papers/',
});

export default function PapersPage() {
  return (
    <main className="page page--papers">
      <div className="column">
        <p className="name">
          <a href="/">{NAME}</a>
        </p>
        <PaperGroups />
      </div>
    </main>
  );
}
