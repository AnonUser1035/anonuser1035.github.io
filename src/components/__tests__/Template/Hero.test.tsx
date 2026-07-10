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

  it('renders CTA buttons with correct links', () => {
    render(<Hero />);

    const resumeButton = screen.getByRole('link', {
      name: /download résumé/i,
    });
    expect(resumeButton).toHaveAttribute('href', '/resume.pdf');
    expect(resumeButton).toHaveAttribute('download');
    expect(resumeButton).toHaveClass('button-primary');

    const contactButton = screen.getByRole('link', { name: /get in touch/i });
    expect(contactButton).toHaveAttribute('href', '#contact');
    expect(contactButton).toHaveClass('button-secondary');
  });
});
