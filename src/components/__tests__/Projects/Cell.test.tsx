import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Cell from '../../Projects/Cell';

describe('Cell', () => {
  const externalProject = {
    title: 'Test Project',
    subtitle: 'A test subtitle',
    link: 'https://example.com',
    date: '2023-01-01',
    desc: 'This is a test project description',
    tech: ['TypeScript'],
  };

  it('renders an external project as a new-tab link covering the entry', () => {
    render(<Cell data={externalProject} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', externalProject.link);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveClass('project-record--link');
  });

  it('renders internal routes without opening a new tab', () => {
    render(<Cell data={{ ...externalProject, link: '/projects/some-app/' }} />);
    const link = screen.getByRole('link');
    // next/link may normalize the trailing slash in the rendered href.
    expect(link.getAttribute('href')).toMatch(/^\/projects\/some-app\/?$/);
    expect(link).not.toHaveAttribute('target');
  });

  it('renders project description, subtitle, and year', () => {
    render(<Cell data={externalProject} />);
    expect(screen.getByText(externalProject.desc)).toBeInTheDocument();
    expect(screen.getByText(externalProject.subtitle)).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
  });

  it('defaults the action verb by link type and shows tech tags', () => {
    render(<Cell data={externalProject} />);
    expect(screen.getByText('Visit')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('renders a project without a link as a plain record (no link role)', () => {
    const { container } = render(
      <Cell data={{ title: 'No Link', date: '2024-01-01', desc: 'Static.' }} />,
    );
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(container.querySelector('.project-record')).toBeInTheDocument();
  });
});
