'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * Scrolls to top on route changes.
 * Uses instant scroll to override CSS smooth behavior for navigation.
 */
export default function ScrollToTop() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip initial render to avoid unnecessary scroll on page load
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Preserve in-page anchor navigation: when the destination carries a
    // hash (e.g. arriving at /#projects from a redirect stub or the 404
    // page), let the browser land on that section instead of the top.
    if (window.location.hash) {
      return;
    }

    // Instant scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
