import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Page Not Found',
  description: 'The page you are looking for could not be found.',
});

export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="not-found-page">
      <div className="not-found-content">
        <span className="not-found-code">404</span>
        <h1 className="not-found-title">Page Not Found</h1>
        <p className="not-found-message">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="not-found-actions">
          <Link href="/" className="not-found-button">
            Go Home
          </Link>
          <a
            href="mailto:ryan@neurosafetysystems.com"
            className="not-found-link"
          >
            Contact Me
          </a>
        </div>
      </div>
    </main>
  );
}
