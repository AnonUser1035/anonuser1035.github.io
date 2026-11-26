import type { Metadata } from 'next';

import Inline from '@/components/Letter/Inline';
import TalkList from '@/components/Talks/TalkList';
import { NAME, PROFILES } from '@/data/content';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Talks and posters',
  description: `Talks and posters by ${NAME}, including a Best Poster award in functional neurosurgery.`,
  path: '/talks/',
});

export default function TalksPage() {
  return (
    <main className="page page--papers">
      <div className="column">
        <p className="name">
          <a href="/">{NAME}</a>
        </p>
        <h1 className="paper-group-name">Talks and posters</h1>
        <p className="talks-note">
          <Inline
            text={`Publications are on [Google Scholar](${PROFILES.scholar}) and [ORCID](${PROFILES.orcid}).`}
          />
        </p>
        <TalkList />
      </div>
    </main>
  );
}
