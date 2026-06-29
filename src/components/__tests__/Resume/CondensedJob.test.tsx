import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import CondensedJob from '../../Resume/Experience/CondensedJob';

const baseJob = {
  name: 'Old Lab',
  position: 'Intern',
  url: 'https://oldlab.com',
  startDate: '2022-06-01',
  endDate: '2022-08-01',
};

describe('CondensedJob', () => {
  it('renders the org name as a link and the role', () => {
    render(<CondensedJob data={baseJob} />);

    const link = screen.getByRole('link', { name: /old lab/i });
    expect(link).toHaveAttribute('href', 'https://oldlab.com');
    expect(screen.getByText('Intern')).toBeInTheDocument();
  });

  it('collapses a same-year role to a single year', () => {
    render(<CondensedJob data={baseJob} />);

    expect(screen.getByText('2022')).toBeInTheDocument();
  });

  it('renders a year range with a two-digit end', () => {
    render(
      <CondensedJob
        data={{ ...baseJob, startDate: '2023-09-01', endDate: '2024-07-01' }}
      />,
    );

    expect(screen.getByText('2023–24')).toBeInTheDocument();
  });

  it('shows Present when there is no end date', () => {
    render(<CondensedJob data={{ ...baseJob, endDate: undefined }} />);

    expect(screen.getByText('2022–Present')).toBeInTheDocument();
  });
});
