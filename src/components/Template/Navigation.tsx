'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { projectAppRoutes } from '@/data/projects';
import routes from '@/data/routes';

import Hamburger from './Hamburger';
import ThemeToggle from './ThemeToggle';

const normalizePath = (path: string) => path.replace(/\/+$/, '') || '/';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    if (pathname?.startsWith(path)) return true;
    // Internal project apps (e.g. /workouts) keep the Projects tab selected.
    return (
      path === '/projects' &&
      projectAppRoutes.includes(normalizePath(pathname ?? ''))
    );
  };

  return (
    <header className="site-header">
      <Link
        href="/"
        className={`site-logo ${isActive('/') ? 'active' : ''}`}
        aria-current={isActive('/') ? 'page' : undefined}
      >
        <span className="logo-text">Ryan Bohluli</span>
      </Link>

      <nav className="nav-links">
        {routes
          .filter((l) => !l.index)
          .map((l) => (
            <Link
              key={l.label}
              href={l.path}
              className={`nav-link ${isActive(l.path) ? 'active' : ''}`}
              aria-current={isActive(l.path) ? 'page' : undefined}
            >
              {l.label}
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
