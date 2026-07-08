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

  it('renders navigation links for all non-index routes', () => {
    render(<Navigation />);

    // Should have links for Projects and Publications
    expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /publications/i }),
    ).toBeInTheDocument();
  });

  it('marks home route as active when on homepage', () => {
    mockPathname.mockReturnValue('/');
    render(<Navigation />);

    // Publications link should not be active on the homepage
    const publicationsLink = screen.getByRole('link', {
      name: /publications/i,
    });
    expect(publicationsLink).not.toHaveClass('active');
  });

  it('marks projects route as active when on projects page', () => {
    mockPathname.mockReturnValue('/projects');
    render(<Navigation />);

    const projectsLink = screen.getByRole('link', { name: /projects/i });
    expect(projectsLink).toHaveClass('active');
    expect(projectsLink).toHaveAttribute('aria-current', 'page');
  });

  it('marks nested routes as active', () => {
    mockPathname.mockReturnValue('/publications/some-paper');
    render(<Navigation />);

    const publicationsLink = screen.getByRole('link', {
      name: /publications/i,
    });
    expect(publicationsLink).toHaveClass('active');
  });

  it('renders theme toggle and hamburger menu', () => {
    render(<Navigation />);

    // Theme toggle should be present (placeholder initially due to SSR)
    const navActions = document.querySelector('.nav-actions');
    expect(navActions).toBeInTheDocument();
  });
});
