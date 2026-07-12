'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import sections, { sectionIds } from '@/data/sections';
import useScrollSpy from '@/hooks/useScrollSpy';

import Hamburger from './Hamburger';
import ThemeToggle from './ThemeToggle';

export default function Navigation() {
  const pathname = usePathname();
  const activeSection = useScrollSpy(sectionIds);
  const isHome = pathname === '/';

  return (
    <header className="site-header">
      <Link
        href="/"
        className={`site-logo ${isHome ? 'active' : ''}`}
        aria-current={isHome ? 'page' : undefined}
      >
        <span className="logo-text">Ryan S. Bohluli</span>
      </Link>

      <nav className="nav-links">
        {sections.map((section) => (
          <Link
            key={section.id}
            href={`/#${section.id}`}
            className={`nav-link ${activeSection === section.id ? 'active' : ''}`}
            aria-current={activeSection === section.id ? 'location' : undefined}
          >
            {section.label}
          </Link>
        ))}
      </nav>

      <div className="nav-actions">
        <ThemeToggle />
        <Hamburger />
      </div>
    </header>
  );
}
