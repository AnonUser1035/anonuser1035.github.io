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
    expect(heading).toHaveTextContent('Ryan Bohluli');
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

  it('displays hero chips for credentials', () => {
    render(<Hero />);

    expect(screen.getByText(/Hopkins\s*['’]27/)).toBeInTheDocument();
    expect(screen.getByText('Neurotech Founder')).toBeInTheDocument();
    expect(screen.getByText('Volunteer EMT')).toBeInTheDocument();
  });

  it('renders CTA buttons with correct links', () => {
    render(<Hero />);

    const aboutButton = screen.getByRole('link', { name: /about me/i });
    expect(aboutButton).toHaveAttribute('href', '/about');
    expect(aboutButton).toHaveClass('button-primary');

    const resumeButton = screen.getByRole('link', { name: /view resume/i });
    expect(resumeButton).toHaveAttribute('href', '/resume');
    expect(resumeButton).toHaveClass('button-secondary');
  });
});
