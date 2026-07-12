import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Navigation from '../../Template/Navigation';

// Mock usePathname to control active state
const mockPathname = vi.fn();
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}));

describe('Navigation', () => {
  beforeEach(() => {
    mockPathname.mockReturnValue('/');

    // Mock matchMedia for ThemeToggle
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('renders the full-name wordmark linking home', () => {
    render(<Navigation />);
    const logo = screen.getByRole('link', { name: /ryan s\. bohluli/i });
    expect(logo).toHaveAttribute('href', '/');
  });

  it('marks the wordmark active only on the homepage', () => {
    mockPathname.mockReturnValue('/');
    const { unmount } = render(<Navigation />);
    let logo = screen.getByRole('link', { name: /ryan s\. bohluli/i });
    expect(logo).toHaveClass('active');
    expect(logo).toHaveAttribute('aria-current', 'page');
    unmount();

    mockPathname.mockReturnValue('/projects');
    render(<Navigation />);
    logo = screen.getByRole('link', { name: /ryan s\. bohluli/i });
    expect(logo).not.toHaveClass('active');
    expect(logo).not.toHaveAttribute('aria-current');
  });

  it('renders anchor links for all homepage sections in page order', () => {
    render(<Navigation />);

    const nav = document.querySelector('.nav-links') as HTMLElement;
    const links = Array.from(nav.querySelectorAll('a'));

    expect(links.map((l) => l.getAttribute('href'))).toEqual([
      '/#experience',
      '/#publications',
      '/#education',
      '/#projects',
    ]);
    expect(links.map((l) => l.textContent)).toEqual([
      'Experience',
      'Publications',
      'Education',
      'Projects',
    ]);
  });

  it('marks the first section active by default on the homepage', () => {
    mockPathname.mockReturnValue('/');
    render(<Navigation />);

    const experienceLink = screen.getByRole('link', { name: /experience/i });
    expect(experienceLink).toHaveClass('active');
    expect(experienceLink).toHaveAttribute('aria-current', 'location');

    const projectsLink = screen.getByRole('link', { name: /^projects$/i });
    expect(projectsLink).not.toHaveClass('active');
  });

  it('marks no section active off the homepage', () => {
    mockPathname.mockReturnValue('/projects');
    render(<Navigation />);

    const nav = document.querySelector('.nav-links') as HTMLElement;
    expect(nav.querySelectorAll('a.active').length).toBe(0);
    expect(nav.querySelectorAll('[aria-current]').length).toBe(0);
  });

  it('renders theme toggle and hamburger menu', () => {
    render(<Navigation />);

    // Theme toggle should be present (placeholder initially due to SSR)
    const navActions = document.querySelector('.nav-actions');
    expect(navActions).toBeInTheDocument();
  });
});
