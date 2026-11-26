import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TALKS } from '@/data/talks';
import TalkList, { citationLine } from '../TalkList';

describe('TalkList', () => {
  it('lists every talk and poster with Bohluli RS at weight 500', () => {
    const { container } = render(<TalkList />);
    const entries = container.querySelectorAll('.paper');
    expect(entries).toHaveLength(TALKS.length);
    for (const entry of entries) {
      expect(entry.querySelector('.paper-authors .me')).toHaveTextContent(
        'Bohluli RS',
      );
    }
  });

  it('shows the poster award on its entry', () => {
    const { container } = render(<TalkList />);
    expect(container.querySelector('.paper-venue')).toHaveTextContent(
      'Johns Hopkins Neurosurgery Research Day (Synapse Summit), 2026. Poster. Best Poster in Functional Neurosurgery.',
    );
  });

  it('formats the citation line from the parts that exist', () => {
    expect(
      citationLine({
        title: '',
        authors: '',
        venue: 'Yale Bouchet Conference',
        year: '2026',
      }),
    ).toBe('Yale Bouchet Conference, 2026.');
  });
});
