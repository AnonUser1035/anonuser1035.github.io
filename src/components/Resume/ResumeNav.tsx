'use client';

import { useEffect, useRef, useState } from 'react';

const sections = [
  { name: 'Experience', id: 'experience' },
  { name: 'Education', id: 'education' },
  { name: 'Skills', id: 'skills' },
  { name: 'Contact', id: 'contact' },
] as const;

type SectionId = (typeof sections)[number]['id'];

/** Offset from top of viewport for intersection detection (header height + nav) */
const INTERSECTION_MARGIN = '-20% 0px -75% 0px';

/**
 * A short last section (Contact) followed by the footer can run out of
 * scroll room before it ever enters the intersection band above — the
 * page hits max scroll while Contact's top edge is still below it, so the
 * observer alone can never mark it active. This is the standard scroll-spy
 * fix: once the page is scrolled to (within this many px of) the bottom,
 * force the last section active regardless of what the observer reports.
 */
const BOTTOM_THRESHOLD_PX = 2;

export default function ResumeNav() {
  const [activeSection, setActiveSection] = useState<SectionId>('experience');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const lastSectionId = sections[sections.length - 1].id;

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
          const sectionId = sections.find(
            (s) => s.id === targetEntry.target.id,
          );
          if (sectionId) {
            setActiveSection(sectionId.id);
          }
        }
      },
      {
        rootMargin: INTERSECTION_MARGIN,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    // Observe all sections
    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => {
      window.removeEventListener('scroll', checkBottom);
      observerRef.current?.disconnect();
    };
  }, []);

  return (
    <nav className="resume-nav" aria-label="Resume sections">
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className={`resume-nav-link ${activeSection === section.id ? 'active' : ''}`}
          aria-current={activeSection === section.id ? 'location' : undefined}
        >
          {section.name}
        </a>
      ))}
    </nav>
  );
}
