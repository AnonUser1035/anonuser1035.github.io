import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { EMAIL, PROFILES } from '@/data/content';
import Letter from '../Letter';

describe('Letter', () => {
  it('links the copy as written', () => {
    render(<Letter />);
    const href = (name: string) =>
      screen.getAllByRole('link', { name })[0].getAttribute('href');

    expect(href('Thakor Lab')).toBe('https://neuroengineering.bme.jhu.edu/');
    expect(href('Neuro Safety Systems')).toBe(
      'https://neurosafetysystems.com/',
    );
    expect(href(EMAIL)).toBe(`mailto:${EMAIL}`);
    expect(href('LinkedIn')).toBe(PROFILES.linkedin);
    expect(href('Google Scholar')).toBe(PROFILES.scholar);
    expect(href('flashcard app')).toBe('https://ankibot.ryanbohluli.com/');
    expect(href('timer for erg workouts')).toBe(
      'https://emoms.ryanbohluli.com/',
    );
    expect(href('menu-bar app')).toBe('https://github.com/anonuser1035/ember');

    const here = screen.getAllByRole('link', { name: 'here' });
    expect(here.map((a) => a.getAttribute('href'))).toEqual([
      '/papers/',
      '/resume.pdf',
    ]);
  });

  it('lists three recent papers with DOI links and venue lines', () => {
    const { container } = render(<Letter />);
    const items = container.querySelectorAll('.recent-papers li');
    expect(items).toHaveLength(3);
    for (const item of items) {
      expect(item.querySelector('a')?.getAttribute('href')).toMatch(
        /^https:\/\/doi\.org\//,
      );
      expect(item.querySelector('.venue')?.textContent).toMatch(/\.$/);
    }
  });

  it('carries both P.S. endings for pointer and touch screens', () => {
    const { container } = render(<Letter />);
    expect(container.querySelector('.postscript-pointer')).toHaveTextContent(
      'Hover over one.',
    );
    expect(container.querySelector('.postscript-touch')).toHaveTextContent(
      'Tap one, or drag the strip back for earlier years.',
    );
  });

  it('signs off and dates the letter', () => {
    render(<Letter />);
    expect(screen.getByText('Ryan')).toHaveClass('signature');
    expect(screen.getByRole('contentinfo')).toHaveTextContent(
      'Baltimore, November 2026',
    );
  });
});
