import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { EVENT_MARKS, HINT, MILESTONES } from '@/data/content';
import { buildStrip } from '@/lib/ecg';
import RhythmStrip from '../RhythmStrip';

const geometry = buildStrip(MILESTONES.length);
const live = () => document.querySelector('.caption[aria-live]');
const hint = () => document.querySelector('.caption-hint') as HTMLElement;
const marker = () => document.querySelector('.strip-marker');
const trace = () => document.querySelector('.strip-trace')?.getAttribute('d');
const beatButtons = () => [
  ...document.querySelectorAll<HTMLButtonElement>('.strip-beat'),
];
const markButtons = () => [
  ...document.querySelectorAll<HTMLButtonElement>('.strip-event'),
];
const strip = () => document.querySelector('.strip') as HTMLElement;

describe('RhythmStrip', () => {
  it('renders one labelled hit area per milestone', () => {
    render(<RhythmStrip />);
    expect(beatButtons()).toHaveLength(MILESTONES.length);
    expect(
      screen.getByRole('button', {
        name: 'Nov 2025: Joined the Arbutus Volunteer Fire Department. Cleared as an EMT provider in March 2026.',
      }),
    ).toBeInTheDocument();
  });

  it('starts with the hint in the caption and no selection dot', () => {
    render(<RhythmStrip />);
    expect(hint()).not.toHaveAttribute('hidden');
    expect(hint()).toHaveTextContent(HINT.text);
    expect(live()).toHaveTextContent('');
    expect(marker()).toBeNull();
  });

  it.each([
    ['hover', (el: HTMLElement) => fireEvent.pointerOver(el)],
    ['focus', (el: HTMLElement) => fireEvent.focus(el)],
    ['tap', (el: HTMLElement) => fireEvent.click(el)],
  ])('moves only the dot and caption on %s', (_, act) => {
    render(<RhythmStrip />);
    const before = trace();
    beatButtons().forEach((button, i) => {
      act(button);
      const m = MILESTONES[i];
      expect(live()).toHaveTextContent(`${m.label}. ${m.text}`);
      expect(hint()).toHaveAttribute('hidden');
      expect(Number(marker()?.getAttribute('cx'))).toBeCloseTo(
        geometry.beats[i].x,
        6,
      );
      expect(marker()?.getAttribute('cy')).toBe('7');
      expect(trace()).toBe(before);
    });
  });

  it('returns to the hint when the pointer leaves the strip', () => {
    render(<RhythmStrip />);
    fireEvent.pointerOver(beatButtons()[3]);
    expect(marker()).not.toBeNull();
    fireEvent.pointerLeave(strip());
    expect(marker()).toBeNull();
    expect(hint()).not.toHaveAttribute('hidden');
  });

  it('returns to the hint when focus moves past the strip', () => {
    render(
      <>
        <RhythmStrip />
        <a href="#after">after</a>
      </>,
    );
    const last = beatButtons().at(-1) as HTMLButtonElement;
    fireEvent.focus(last);
    expect(marker()).not.toBeNull();
    fireEvent.blur(last, { relatedTarget: screen.getByText('after') });
    expect(marker()).toBeNull();
  });

  it('ignores touch pointers entering a beat, so drag-scrolling keeps the hint', () => {
    render(<RhythmStrip />);
    fireEvent.pointerOver(beatButtons()[0], { pointerType: 'touch' });
    expect(marker()).toBeNull();
  });

  it('prints an event mark in the gap after its beat and selects it', () => {
    render(<RhythmStrip />);
    const glyphs = () => document.querySelectorAll('.strip-event-glyph');
    expect(markButtons()).toHaveLength(EVENT_MARKS.length);
    expect(glyphs()).toHaveLength(EVENT_MARKS.length);
    const [mark] = EVENT_MARKS;
    const after = MILESTONES.findIndex((m) => m.label === mark.after);
    fireEvent.focus(markButtons()[0]);
    expect(live()).toHaveTextContent(`${mark.label}. ${mark.text}`);
    expect(Number(marker()?.getAttribute('cx'))).toBeCloseTo(
      geometry.beats[after].hitEnd,
      6,
    );
    // The dot stands in for the printed mark while it is selected.
    expect(glyphs()).toHaveLength(EVENT_MARKS.length - 1);
    fireEvent.pointerLeave(strip());
    expect(glyphs()).toHaveLength(EVENT_MARKS.length);
  });

  it('keeps beats and marks in chronological tab order', () => {
    render(<RhythmStrip />);
    const order = [
      ...document.querySelectorAll('.strip-beat, .strip-event'),
    ].map((el) => el.getAttribute('aria-label')?.split(':')[0]);
    const after = MILESTONES.findIndex((m) => m.label === EVENT_MARKS[0].after);
    expect(order[after + 1]).toBe(EVENT_MARKS[0].label);
    expect(order).toHaveLength(MILESTONES.length + EVENT_MARKS.length);
  });

  it('prints year labels under the beats that carry a tick', () => {
    render(<RhythmStrip />);
    const ticks = [...document.querySelectorAll('.strip-tick')];
    const expected = MILESTONES.flatMap((m, i) =>
      m.tick ? [[m.tick, `${(geometry.beats[i].x / 250) * 100}%`]] : [],
    );
    expect(
      ticks.map((t) => [t.textContent, (t as HTMLElement).style.left]),
    ).toEqual(expected);
  });
});
