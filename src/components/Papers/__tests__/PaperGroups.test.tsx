import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PUBLICATION_GROUPS } from '@/data/publications';
import PaperGroups, { citationLine } from '../PaperGroups';

describe('PaperGroups', () => {
  it('shows three groups whose italic names are the only headings', () => {
    render(<PaperGroups />);
    expect(screen.getAllByRole('heading').map((h) => h.textContent)).toEqual([
      'Papers',
      'Preprints and manuscripts',
      'Presentations',
    ]);
  });

  it('lists the 8 papers and 3 presentations from the old site', () => {
    const counts = PUBLICATION_GROUPS.map((g) => g.items.length);
    expect(counts[0] + counts[1]).toBe(8);
    expect(counts[2]).toBe(3);
  });

  it('sets Bohluli RS at weight 500 in every author list', () => {
    const { container } = render(<PaperGroups />);
    const entries = container.querySelectorAll('.paper');
    expect(entries).toHaveLength(11);
    for (const entry of entries) {
      expect(entry.querySelector('.paper-authors .me')).toHaveTextContent(
        'Bohluli RS',
      );
    }
  });

  it('links titles to DOIs where they exist', () => {
    render(<PaperGroups />);
    const link = screen.getByRole('link', {
      name: /Spinal Cord Neuromodulation for Blood Pressure Control/,
    });
    expect(link).toHaveAttribute(
      'href',
      'https://doi.org/10.1038/s41598-025-25330-8',
    );
  });

  it('applies the venue fixes and keeps manuscripts unnamed', () => {
    const all = PUBLICATION_GROUPS.flatMap((g) => g.items);
    const venues = all.map((p) => p.venue ?? '');
    expect(venues).not.toContain('Nature Scientific Reports');
    expect(venues).toContain('Scientific Reports');
    expect(venues.some((v) => v.includes('ASME Digital Collection'))).toBe(
      false,
    );
    expect(venues).toContain(
      'Design of Medical Devices Conference (DMD2026), ASME',
    );
    for (const p of all.filter((x) => x.status === 'Under review')) {
      expect(p.venue).toBeUndefined();
    }
  });

  it('formats the citation line', () => {
    expect(
      citationLine({
        title: '',
        authors: '',
        venue: 'Scientific Reports',
        year: '2025',
      }),
    ).toBe('Scientific Reports, 2025.');
    expect(
      citationLine({ title: '', authors: '', status: 'Under review' }),
    ).toBe('Under review.');
  });
});
