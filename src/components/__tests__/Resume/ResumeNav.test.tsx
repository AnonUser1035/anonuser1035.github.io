import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ResumeNav from '../../Resume/ResumeNav';

describe('ResumeNav', () => {
  it('renders navigation element', () => {
    render(<ResumeNav />);

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  it('renders links to all homepage sections', () => {
    render(<ResumeNav />);

    expect(screen.getByRole('link', { name: /experience/i })).toHaveAttribute(
      'href',
      '#experience',
    );
    expect(screen.getByRole('link', { name: /education/i })).toHaveAttribute(
      'href',
      '#education',
    );
    expect(screen.getByRole('link', { name: /skills/i })).toHaveAttribute(
      'href',
      '#skills',
    );
    expect(screen.getByRole('link', { name: /contact/i })).toHaveAttribute(
      'href',
      '#contact',
    );
  });

  it('renders 4 navigation links', () => {
    render(<ResumeNav />);

    const links = screen.getAllByRole('link');
    expect(links.length).toBe(4);
  });

  it('has correct CSS class', () => {
    render(<ResumeNav />);

    const nav = document.querySelector('.resume-nav');
    expect(nav).toBeInTheDocument();
  });

  it('experience link is active by default', () => {
    render(<ResumeNav />);

    const experienceLink = screen.getByRole('link', { name: /experience/i });
    expect(experienceLink).toHaveClass('active');
  });

  it('activates the last section once the page is scrolled to the bottom', () => {
    // A short last section can run out of scroll room before the
    // IntersectionObserver ever marks it active; simulate that by reporting
    // a scroll position flush with the bottom of a tall, scrollable page.
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 2000,
      configurable: true,
    });
    Object.defineProperty(window, 'innerHeight', {
      value: 800,
      configurable: true,
    });
    Object.defineProperty(window, 'scrollY', {
      value: 1200,
      configurable: true,
    });

    try {
      render(<ResumeNav />);
      fireEvent.scroll(window);

      const contactLink = screen.getByRole('link', { name: /contact/i });
      expect(contactLink).toHaveClass('active');
    } finally {
      // Restore jsdom's "no scrollable content" defaults so later tests in
      // this file don't inherit a false "at bottom" reading.
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        value: 0,
        configurable: true,
      });
      Object.defineProperty(window, 'scrollY', {
        value: 0,
        configurable: true,
      });
    }
  });
});
