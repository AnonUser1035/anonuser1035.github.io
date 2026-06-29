import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import SkillTag from '../../Resume/Skills/SkillTag';

describe('SkillTag', () => {
  it('renders the skill title', () => {
    const skill = { title: 'Python', competency: 5, category: ['Languages'] };

    render(<SkillTag data={skill} />);

    expect(screen.getByText('Python')).toBeInTheDocument();
  });

  it('renders a single uniform tag with no size variant', () => {
    const skill = { title: 'Python', competency: 5, category: ['Languages'] };

    render(<SkillTag data={skill} />);

    const tag = document.querySelector('.skill-tag');
    expect(tag).toBeInTheDocument();
    expect(tag?.className).toBe('skill-tag');
  });

  it('does not expose a competency rating', () => {
    const skill = { title: 'Python', competency: 5, category: ['Languages'] };

    render(<SkillTag data={skill} />);

    const tag = document.querySelector('.skill-tag') as HTMLElement;
    expect(tag.getAttribute('title')).toBeNull();
    expect(tag.getAttribute('aria-label')).toBeNull();
  });
});
