import Footer from './Footer';

interface PageWrapperProps {
  children: React.ReactNode;
  hideFooter?: boolean;
  mainClassName?: string;
}

/**
 * Server component wrapper for page layout.
 * Provides consistent page structure with optional footer.
 * Relies on Next.js built-in scroll restoration for navigation.
 */
export default function PageWrapper({
  children,
  hideFooter = false,
  mainClassName,
}: PageWrapperProps) {
  return (
    <div className="page-container">
      {/* id is the skip-link target (app/layout.tsx); tabIndex lets it take
          programmatic focus so the next Tab lands inside the content. */}
      <main
        id="main-content"
        tabIndex={-1}
        className={['page-main', mainClassName].filter(Boolean).join(' ')}
      >
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
