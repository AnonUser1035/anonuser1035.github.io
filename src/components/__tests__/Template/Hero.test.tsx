import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Hero from '../../Template/Hero';

describe('Hero', () => {
  it('renders the hero section', () => {
    render(<Hero />);

    const heroSection = document.querySelector('.hero');
    expect(heroSection).toBeInTheDocument();
  });

  it('displays the name as heading', () => {
    render(<Hero />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Ryan S. Bohluli');
  });

  it('renders the tagline with Johns Hopkins and Neuro Safety Systems links', () => {
    render(<Hero />);

    const hopkinsLink = screen.getByRole('link', { name: /johns hopkins/i });
    expect(hopkinsLink).toHaveAttribute('href', 'https://www.jhu.edu');
    expect(hopkinsLink).toHaveClass('hero-highlight');

    const nssLink = screen.getByRole('link', { name: /neuro safety systems/i });
    expect(nssLink).toHaveAttribute('href', 'https://neurosafetysystems.com');
    expect(nssLink).toHaveClass('hero-highlight');
  });

  it('renders the résumé download button', () => {
    render(<Hero />);

    const resumeButton = screen.getByRole('link', {
      name: /download résumé/i,
    });
    expect(resumeButton).toHaveAttribute('href', '/resume.pdf');
    expect(resumeButton).toHaveAttribute('download');
    expect(resumeButton).toHaveClass('button-primary');
  });

  it('renders the contact block with email and hint', () => {
    render(<Hero />);

    const emailLink = screen.getByRole('link', {
      name: /@neurosafetysystems\.com/i,
    });
    expect(emailLink).toHaveAttribute(
      'href',
      'mailto:ryan@neurosafetysystems.com',
    );

    expect(
      screen.getByText(/usually respond within 24 hours/i),
    ).toBeInTheDocument();
  });

  it('renders social contact icons', () => {
    render(<Hero />);

    const icons = document.querySelector('.hero-contact .icons');
    expect(icons).toBeInTheDocument();
  });

  it('does not link to a #contact section', () => {
    render(<Hero />);

    const anchors = Array.from(document.querySelectorAll('a'));
    expect(anchors.some((a) => a.getAttribute('href') === '#contact')).toBe(
      false,
    );
  });
});
