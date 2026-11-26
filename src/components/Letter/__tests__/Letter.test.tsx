import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { EMAIL, PROFILES } from '@/data/content';
import Letter from '../Letter';

describe('Letter', () => {
  it('uses descriptive link text throughout', () => {
    render(<Letter />);
    const href = (name: string) =>
      screen.getByRole('link', { name }).getAttribute('href');

    expect(href('Thakor Lab')).toBe('https://neuroengineering.bme.jhu.edu/');
    expect(href('Neuro Safety Systems')).toBe(
      'https://neurosafetysystems.com/',
    );
    expect(href('Here’s how it started')).toBe(
      'https://engineering.jhu.edu/magazine/inquiring-minds/change-agents/fighting-fatigue-on-the-road/',
    );
    expect(href('All publications')).toBe(PROFILES.scholar);
    expect(href('ORCID')).toBe(PROFILES.orcid);
    expect(href('talks and posters')).toBe('/talks/');
    expect(href(EMAIL)).toBe(`mailto:${EMAIL}`);
    expect(href('LinkedIn')).toBe(PROFILES.linkedin);
    expect(href('résumé (PDF)')).toBe('/resume.pdf');
    expect(screen.queryByRole('link', { name: 'here' })).toBeNull();
  });

  it('lists four selected works, newest first, with DOI links', () => {
    const { container } = render(<Letter />);
    expect(container.querySelector('.work-intro')).toHaveTextContent(
      'Selected work:',
    );
    const items = [...container.querySelectorAll('.selected-work li')];
    expect(
      items.map((li) => li.querySelector('a')?.getAttribute('href')),
    ).toEqual([
      'https://doi.org/10.64898/2026.11.18.767417',
      'https://doi.org/10.1038/s41551-026-01777-6',
      'https://doi.org/10.1115/1.4072357',
      'https://doi.org/10.1115/DMD2026-1020',
    ]);
    expect(items[0].querySelector('.venue')).toHaveTextContent(
      'bioRxiv preprint',
    );
  });

  it('keeps the letter short: no P.S., Cho Lab, COACH or tools paragraph', () => {
    const { container } = render(<Letter />);
    expect(container.querySelector('.postscript')).toBeNull();
    expect(container.textContent).not.toMatch(
      /Cho Lab|COACH|P\.S\.|small tools/,
    );
  });

  it('signs off and says where it was written', () => {
    render(<Letter />);
    expect(screen.getByText('Ryan')).toHaveClass('signature');
    expect(screen.getByRole('contentinfo')).toHaveTextContent(
      'Written in Dallas, TX',
    );
  });
});
