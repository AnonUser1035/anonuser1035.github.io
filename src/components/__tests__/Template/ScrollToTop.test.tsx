import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import ScrollToTop from '../../Template/ScrollToTop';

const mockPathname = vi.fn();
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}));

describe('ScrollToTop', () => {
  const scrollTo = vi.fn();

  beforeEach(() => {
    scrollTo.mockClear();
    Object.defineProperty(window, 'scrollTo', {
      value: scrollTo,
      writable: true,
    });
    window.location.hash = '';
  });

  afterEach(() => {
    window.location.hash = '';
  });

  it('does not scroll on the initial render', () => {
    mockPathname.mockReturnValue('/');
    render(<ScrollToTop />);
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('scrolls to top on a hash-free route change', () => {
    mockPathname.mockReturnValue('/');
    const { rerender } = render(<ScrollToTop />);

    mockPathname.mockReturnValue('/projects');
    rerender(<ScrollToTop />);

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'instant' });
  });

  it('preserves anchor landings by skipping the scroll when a hash is present', () => {
    mockPathname.mockReturnValue('/projects');
    const { rerender } = render(<ScrollToTop />);

    window.location.hash = '#education';
    mockPathname.mockReturnValue('/');
    rerender(<ScrollToTop />);

    expect(scrollTo).not.toHaveBeenCalled();
  });
});
