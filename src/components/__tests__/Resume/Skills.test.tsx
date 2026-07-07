import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Skills from '../../Resume/Skills';

const mockCategories = [
  { name: 'Languages', color: '#6968b3' },
  { name: 'ML Engineering', color: '#37b1f5' },
  { name: 'Web Development', color: '#40494e' },
];

const mockSkills = [
  { title: 'Python', competency: 5, category: ['Languages', 'ML Engineering'] },
  {
    title: 'TypeScript',
    competency: 5,
    category: ['Languages', 'Web Development'],
  },
  {
    title: 'JavaScript',
    competency: 4,
    category: ['Languages', 'Web Development'],
  },
  { title: 'PyTorch', competency: 4, category: ['ML Engineering'] },
  { title: 'React', competency: 3, category: ['Web Development'] },
];

describe('Skills', () => {
  it('renders the skills section with title', () => {
    render(<Skills skills={mockSkills} categories={mockCategories} />);

    expect(
      screen.getByRole('heading', { name: /skills/i }),
    ).toBeInTheDocument();
  });

  it('renders no filter buttons (flattened, always-on view)', () => {
    render(<Skills skills={mockSkills} categories={mockCategories} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('shows every skill, grouped by category', () => {
    render(<Skills skills={mockSkills} categories={mockCategories} />);

    // Skills appear once per category they belong to
    expect(screen.getAllByText('Python').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('TypeScript').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('JavaScript').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('PyTorch').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('React').length).toBeGreaterThanOrEqual(1);
  });

  it('renders a group title per non-empty category', () => {
    render(<Skills skills={mockSkills} categories={mockCategories} />);

    const groupTitles = document.querySelectorAll('.group-label');
    expect(groupTitles.length).toBe(3);
  });

  it('sorts skills within a group by competency (highest first)', () => {
    render(<Skills skills={mockSkills} categories={mockCategories} />);

    // Within "Languages": Python (5) and TypeScript (5) before JavaScript (4)
    const languagesGroup = Array.from(
      document.querySelectorAll('.skill-group'),
    ).find((g) => g.querySelector('.group-label')?.textContent === 'Languages');

    const names = Array.from(
      languagesGroup?.querySelectorAll('.skill-tag-name') ?? [],
    ).map((el) => el.textContent);

    expect(names.indexOf('Python')).toBeLessThan(names.indexOf('JavaScript'));
  });
});
