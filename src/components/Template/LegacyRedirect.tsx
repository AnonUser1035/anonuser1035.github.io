interface LegacyRedirectProps {
  /** Where the content lives now, e.g. "/papers/". */
  to: string;
}

/**
 * Minimal stub for a retired route. The meta refresh (hoisted into <head> by
 * React) sends the visitor on; the visible link is the fallback when refresh
 * is unavailable. Pages using this should also declare `robots` noindex.
 */
export default function LegacyRedirect({ to }: LegacyRedirectProps) {
  return (
    <>
      <meta httpEquiv="refresh" content={`0;url=${to}`} />
      <main className="page column">
        <p className="body-text">
          This page has moved. <a href={to}>Take me there.</a>
        </p>
      </main>
    </>
  );
}
