import { beforeEach, describe, expect, it } from 'vitest';

import { HINT, MILESTONES } from '../../data/content.ts';
import { buildStrip } from '../../lib/ecg.ts';
import { loadHome } from './page.ts';

const geometry = buildStrip(MILESTONES.length);

const live = () => document.querySelector('.caption-current');
const hint = () => document.querySelector('.caption-hint') as HTMLElement;
const marker = () => document.querySelector('.strip-marker');
const trace = () => document.querySelector('.strip-trace')?.getAttribute('d');
const strip = () => document.querySelector('.strip') as HTMLElement;
const beatButtons = () => [
  ...document.querySelectorAll<HTMLButtonElement>('.strip-beat'),
];
const pointer = (type: string, target: Element, pointerType = 'mouse') =>
  target.dispatchEvent(new PointerEvent(type, { bubbles: true, pointerType }));

describe('rhythm strip', () => {
  beforeEach(() => {
    loadHome();
  });

  it('renders one labelled hit area per milestone', () => {
    expect(beatButtons()).toHaveLength(MILESTONES.length);
    const labels = beatButtons().map((b) => b.getAttribute('aria-label'));
    expect(labels).toContain(
      'Nov 2025: Joined the Arbutus Volunteer Fire Department. Cleared as an EMT provider in March 2026.',
    );
    expect(labels.some((l) => /^Apr 2026: .*Best Poster/.test(l ?? ''))).toBe(
      true,
    );
  });

  it('starts with the hint in the caption and no selection dot', () => {
    expect(hint().hidden).toBe(false);
    expect(hint().textContent).toContain(HINT.text);
    expect(live()?.textContent).toBe('');
    expect(marker()).toBeNull();
  });

  it.each([
    ['hover', (el: Element) => pointer('pointerover', el)],
    [
      'focus',
      (el: Element) =>
        el.dispatchEvent(new FocusEvent('focusin', { bubbles: true })),
    ],
    [
      'tap',
      (el: Element) =>
        el.dispatchEvent(new MouseEvent('click', { bubbles: true })),
    ],
  ])('moves only the dot and caption on %s', (_, act) => {
    const before = trace();
    beatButtons().forEach((button, i) => {
      act(button);
      const m = MILESTONES[i];
      expect(live()?.textContent).toBe(`${m.label}. ${m.text}`);
      expect(hint().hidden).toBe(true);
      expect(Number(marker()?.getAttribute('cx'))).toBeCloseTo(
        geometry.beats[i].x,
        3,
      );
      expect(marker()?.getAttribute('cy')).toBe('7');
      expect(button.getAttribute('aria-selected')).toBe('true');
      expect(
        beatButtons().filter((b) => b.getAttribute('aria-selected') === 'true'),
      ).toHaveLength(1);
      expect(trace()).toBe(before);
    });
  });

  it('is one tab stop: a listbox whose first beat takes focus', () => {
    expect(strip().getAttribute('role')).toBe('listbox');
    expect(strip().getAttribute('aria-orientation')).toBe('horizontal');
    expect(
      beatButtons().every((b) => b.getAttribute('role') === 'option'),
    ).toBe(true);
    expect(beatButtons().map((b) => b.tabIndex)).toEqual(
      MILESTONES.map((_, i) => (i === 0 ? 0 : -1)),
    );
    // Read once, from the label: the caption is no longer a live region.
    expect(document.querySelector('[aria-live]')).toBeNull();
  });

  it('moves between beats with the arrow keys, Home and End', () => {
    const key = (k: string) =>
      document.activeElement?.dispatchEvent(
        new KeyboardEvent('keydown', { key: k, bubbles: true }),
      );
    const at = () =>
      beatButtons().indexOf(document.activeElement as HTMLButtonElement);
    beatButtons()[0].focus();
    expect(at()).toBe(0);
    key('ArrowLeft');
    expect(at()).toBe(0);
    key('ArrowRight');
    key('ArrowRight');
    expect(at()).toBe(2);
    expect(live()?.textContent).toBe(
      `${MILESTONES[2].label}. ${MILESTONES[2].text}`,
    );
    key('End');
    expect(at()).toBe(MILESTONES.length - 1);
    key('ArrowRight');
    expect(at()).toBe(MILESTONES.length - 1);
    key('Home');
    expect(at()).toBe(0);
    key('ArrowRight');
    // Tab returns to the beat focused last.
    expect(beatButtons().filter((b) => b.tabIndex === 0)).toEqual([
      beatButtons()[1],
    ]);
  });

  it('returns to the hint when the pointer leaves the strip', () => {
    pointer('pointerover', beatButtons()[3]);
    expect(marker()).not.toBeNull();
    strip().dispatchEvent(
      new PointerEvent('pointerleave', { pointerType: 'mouse' }),
    );
    expect(marker()).toBeNull();
    expect(hint().hidden).toBe(false);
  });

  it('returns to the hint when focus moves past the strip', () => {
    const after = document.createElement('a');
    document.body.append(after);
    const last = beatButtons().at(-1) as HTMLButtonElement;
    last.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    expect(marker()).not.toBeNull();
    last.dispatchEvent(
      new FocusEvent('focusout', { bubbles: true, relatedTarget: after }),
    );
    expect(marker()).toBeNull();
  });

  it('ignores touch pointers entering a beat, so drag-scrolling keeps the hint', () => {
    pointer('pointerover', beatButtons()[0], 'touch');
    expect(marker()).toBeNull();
  });

  it('returns to the hint on a tap outside the strip', () => {
    beatButtons()[2].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    pointer('pointerdown', document.body, 'touch');
    expect(marker()).toBeNull();
  });

  it('lets other scripts pick a beat, and clear it, with strip:select', () => {
    strip().dispatchEvent(new CustomEvent('strip:select', { detail: 4 }));
    expect(live()?.textContent).toMatch(MILESTONES[4].text);
    strip().dispatchEvent(new CustomEvent('strip:select', { detail: -1 }));
    expect(marker()).toBeNull();
  });

  it('keeps each beat unselectable until the pen has drawn its R peak', () => {
    const delays = beatButtons().map((b) => parseFloat(b.style.animationDelay));
    const reveal = document.querySelector('.strip-reveal') as SVGRectElement;
    const seconds = parseFloat(reveal.style.animationDuration);
    const clipWidth = Number(reveal.getAttribute('width'));
    delays.forEach((delay, i) => {
      expect(delay).toBeCloseTo((seconds * geometry.beats[i].x) / clipWidth, 3);
    });
    expect(delays[0]).toBeGreaterThan(0);
    expect(delays.at(-1)).toBeLessThan(seconds);
  });

  it('prints year labels under the beats that carry a tick', () => {
    const ticks = [...document.querySelectorAll<HTMLElement>('.strip-tick')];
    const expected = MILESTONES.flatMap((m, i) =>
      m.tick ? [[m.tick, (geometry.beats[i].x / 250) * 100]] : [],
    );
    expect(ticks.map((t) => t.textContent)).toEqual(expected.map((e) => e[0]));
    ticks.forEach((t, i) => {
      expect(parseFloat(t.style.left)).toBeCloseTo(Number(expected[i][1]), 3);
    });
  });
});
