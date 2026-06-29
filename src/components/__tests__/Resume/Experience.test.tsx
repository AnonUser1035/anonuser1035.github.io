import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Experience from '../../Resume/Experience';

const mockJobs = [
  {
    name: 'Acme Corp',
    position: 'Senior Engineer',
    url: 'https://acme.com',
    startDate: '2020-01-01',
    endDate: '2023-06-30',
    summary: 'Led engineering team.',
    highlights: ['Built features', 'Improved performance'],
  },
  {
    name: 'Startup Inc',
    position: 'Software Engineer',
    url: 'https://startup.com',
    startDate: '2018-01-01',
    endDate: '2019-12-31',
    highlights: ['Wrote code'],
  },
];

describe('Experience', () => {
  it('renders the experience section with title', () => {
    render(<Experience data={mockJobs} />);

    expect(
      screen.getByRole('heading', { name: /experience/i }),
    ).toBeInTheDocument();
  });

  it('renders all jobs', () => {
    render(<Experience data={mockJobs} />);

    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('Startup Inc')).toBeInTheDocument();
  });

  it('renders job positions', () => {
    render(<Experience data={mockJobs} />);

    expect(screen.getByText(/Senior Engineer/)).toBeInTheDocument();
    expect(screen.getByText(/Software Engineer/)).toBeInTheDocument();
  });

  it('renders jobs with company links', () => {
    render(<Experience data={mockJobs} />);

    const links = screen.getAllByRole('link');
    expect(
      links.some((l) => l.getAttribute('href') === 'https://acme.com'),
    ).toBe(true);
    expect(
      links.some((l) => l.getAttribute('href') === 'https://startup.com'),
    ).toBe(true);
  });

  it('handles empty jobs array', () => {
    render(<Experience data={[]} />);

    expect(
      screen.getByRole('heading', { name: /experience/i }),
    ).toBeInTheDocument();
    // No job articles
    const articles = document.querySelectorAll('.jobs-container');
    expect(articles.length).toBe(0);
  });

  it('renders condensed roles as compact ledger rows under an Earlier label', () => {
    const jobs = [
      ...mockJobs,
      {
        name: 'Old Lab',
        position: 'Intern',
        url: 'https://oldlab.com',
        startDate: '2019-06-01',
        endDate: '2019-08-01',
        summary: 'Did intern things.',
        highlights: ['A thing'],
        condensed: true,
      },
    ];

    render(<Experience data={jobs} />);

    expect(screen.getByText('Earlier experience')).toBeInTheDocument();

    // Full jobs render as .jobs-container; condensed ones as .job-condensed
    expect(document.querySelectorAll('.jobs-container').length).toBe(2);
    const condensed = document.querySelectorAll('.job-condensed');
    expect(condensed.length).toBe(1);

    // Condensed entry shows org + role but not its summary/highlights
    expect(screen.getByText('Old Lab')).toBeInTheDocument();
    expect(screen.queryByText('Did intern things.')).not.toBeInTheDocument();
    expect(screen.queryByText('A thing')).not.toBeInTheDocument();
  });

  it('omits the Earlier label when no roles are condensed', () => {
    render(<Experience data={mockJobs} />);

    expect(screen.queryByText('Earlier experience')).not.toBeInTheDocument();
  });
});
