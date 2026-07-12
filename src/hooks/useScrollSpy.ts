'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

/** Offset from top of viewport for intersection detection (header height) */
const INTERSECTION_MARGIN = '-20% 0px -75% 0px';

/**
 * A short last section followed by the footer can run out of scroll room
 * before it ever enters the intersection band above — the page hits max
 * scroll while the section's top edge is still below it, so the observer
 * alone can never mark it active. This is the standard scroll-spy fix:
 * once the page is scrolled to (within this many px of) the bottom, force
 * the last section active regardless of what the observer reports.
 */
const BOTTOM_THRESHOLD_PX = 2;

/**
 * Tracks which homepage section is currently in view. Returns the active
 * section id, or null when not on the homepage (no section is "current"
 * from other routes).
 *
 * Pass a stable (module-level) array of ids to avoid re-subscribing the
 * observer on every render.
 */
export default function useScrollSpy(
  sectionIds: readonly string[],
): string | null {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!isHome || sectionIds.length === 0) {
      setActiveSection(null);
      return;
    }

    const firstSectionId = sectionIds[0];
    const lastSectionId = sectionIds[sectionIds.length - 1];

    // True while the visitor is still above the first section (hero at the top
    // of the viewport): the first section's top hasn't reached the activation
    // band yet, so no tab should read as "current". 0.2 matches the -20% top
    // edge of INTERSECTION_MARGIN.
    const isAboveFirstSection = () => {
      const first = document.getElementById(firstSectionId);
      if (!first) return false;
      return first.getBoundingClientRect().top > window.innerHeight * 0.2;
    };

    const checkBottom = () => {
      const { scrollHeight } = document.documentElement;
      // Guard against unlaid-out environments (e.g. jsdom, where
      // scrollHeight defaults to 0) reporting a false "at bottom".
      const hasScrollableContent = scrollHeight > window.innerHeight;
      const atBottom =
        hasScrollableContent &&
        window.innerHeight + window.scrollY >=
          scrollHeight - BOTTOM_THRESHOLD_PX;
      if (atBottom) {
        setActiveSection(lastSectionId);
      }
    };

    window.addEventListener('scroll', checkBottom, { passive: true });
    checkBottom();

    // Check if IntersectionObserver is available (not in test environment)
    if (typeof IntersectionObserver === 'undefined') {
      return () => window.removeEventListener('scroll', checkBottom);
    }

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create IntersectionObserver for efficient scroll tracking
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // While still in the hero (above the first section), keep nothing
        // active so no tab is pre-selected on load.
        if (isAboveFirstSection()) {
          setActiveSection(null);
          return;
        }

        // Find the entry that is most visible (highest intersection ratio)
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);

        let targetEntry: IntersectionObserverEntry | null = null;

        if (visibleEntries.length > 0) {
          // When there are visible entries, pick the one with the highest intersection ratio
          targetEntry = visibleEntries.reduce((prev, current) =>
            current.intersectionRatio > prev.intersectionRatio ? current : prev,
          );
        } else if (entries.length > 0) {
          // When no entries are intersecting, fall back to the entry closest to the viewport
          targetEntry = entries.reduce((prev, current) => {
            const prevDistance = Math.abs(prev.boundingClientRect.top);
            const currentDistance = Math.abs(current.boundingClientRect.top);
            return currentDistance < prevDistance ? current : prev;
          });
        }

        if (targetEntry) {
          const targetId = targetEntry.target.id;
          if (sectionIds.includes(targetId)) {
            setActiveSection(targetId);
          }
        }
      },
      {
        rootMargin: INTERSECTION_MARGIN,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    // Observe all sections
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => {
      window.removeEventListener('scroll', checkBottom);
      observerRef.current?.disconnect();
    };
  }, [isHome, sectionIds]);

  return isHome ? activeSection : null;
}
