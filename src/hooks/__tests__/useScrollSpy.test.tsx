import { act, fireEvent, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import useScrollSpy from '../useScrollSpy';

const mockPathname = vi.fn();
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}));

const SECTION_IDS = [
  'experience',
  'publications',
  'education',
  'projects',
] as const;

describe('useScrollSpy', () => {
  beforeEach(() => {
    mockPathname.mockReturnValue('/');
  });

  it('starts with no active section on the homepage (nothing selected in the hero)', () => {
    const { result } = renderHook(() => useScrollSpy(SECTION_IDS));
    expect(result.current).toBeNull();
  });

  it('returns null off the homepage', () => {
    mockPathname.mockReturnValue('/projects');
    const { result } = renderHook(() => useScrollSpy(SECTION_IDS));
    expect(result.current).toBeNull();
  });

  it('returns null for an empty section list', () => {
    const { result } = renderHook(() => useScrollSpy([]));
    expect(result.current).toBeNull();
  });

  it('activates the last section once the page is scrolled to the bottom', () => {
    // A short last section can run out of scroll room before the
    // IntersectionObserver ever marks it active; simulate that by reporting
    // a scroll position flush with the bottom of a tall, scrollable page.
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 2000,
      configurable: true,
    });
    Object.defineProperty(window, 'innerHeight', {
      value: 800,
      configurable: true,
    });
    Object.defineProperty(window, 'scrollY', {
      value: 1200,
      configurable: true,
    });

    try {
      const { result } = renderHook(() => useScrollSpy(SECTION_IDS));
      act(() => {
        fireEvent.scroll(window);
      });

      expect(result.current).toBe('projects');
    } finally {
      // Restore jsdom's "no scrollable content" defaults so later tests in
      // this file don't inherit a false "at bottom" reading.
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        value: 0,
        configurable: true,
      });
      Object.defineProperty(window, 'scrollY', {
        value: 0,
        configurable: true,
      });
    }
  });

  it('does not force the last section active when the page has no scrollable content', () => {
    // jsdom default: scrollHeight 0, innerHeight positive — must not read as "at bottom"
    const { result } = renderHook(() => useScrollSpy(SECTION_IDS));
    act(() => {
      fireEvent.scroll(window);
    });

    expect(result.current).toBeNull();
  });
});
