import type { Metadata } from 'next';

import { NAME } from '@/data/content';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Page Not Found',
  description: 'The page you are looking for could not be found.',
});

export default function NotFound() {
  return (
    <main className="page page--papers">
      <div className="column">
        <p className="name">
          <a href="/">{NAME}</a>
        </p>
        <p className="body-text">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
      </div>
    </main>
  );
}
