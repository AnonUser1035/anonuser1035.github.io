import Link from 'next/link';

interface LegacyRedirectProps {
  /** Homepage anchor to redirect to, e.g. "/#projects". */
  to: string;
  /** Label for the content that moved, e.g. "Projects". */
  label: string;
}

/**
 * Minimal stub for a route that has been folded into the homepage. The
 * meta refresh (hoisted into <head> by React) bounces the visitor to the
 * matching section; the visible link is the fallback when refresh is
 * unavailable. Pages using this should also declare `robots` noindex.
 */
export default function LegacyRedirect({ to, label }: LegacyRedirectProps) {
  return (
    <>
      <meta httpEquiv="refresh" content={`0;url=${to}`} />
      <main id="main-content" tabIndex={-1} className="redirect-stub">
        <p>
          {label} now live on the homepage.{' '}
          <Link href={to}>Take me there.</Link>
        </p>
      </main>
    </>
  );
}
