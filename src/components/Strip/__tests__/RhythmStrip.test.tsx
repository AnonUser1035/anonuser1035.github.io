import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MILESTONES } from '@/data/content';
import { buildStrip } from '@/lib/ecg';
import RhythmStrip from '../RhythmStrip';

const geometry = buildStrip(MILESTONES.length);
const caption = () =>
  document.querySelector('.caption[aria-live]')?.textContent ?? '';
const markerX = () =>
  Number(document.querySelector('.strip-marker')?.getAttribute('cx'));
const trace = () => document.querySelector('.strip-trace')?.getAttribute('d');
const beatsButtons = () =>
  screen.getAllByRole('button', { name: /^(\d{4}|[A-Z][a-z]+)/ });

describe('RhythmStrip', () => {
  it('renders one labelled hit area per milestone', () => {
    render(<RhythmStrip />);
    const buttons = beatsButtons();
    expect(buttons).toHaveLength(12);
    expect(
      screen.getByRole('button', {
        name: 'Nov 2025: Started running calls as an EMT-B with the Arbutus Volunteer Fire Department.',
      }),
    ).toBeInTheDocument();
  });

  it('selects the last beat on load', () => {
    render(<RhythmStrip />);
    expect(caption()).toBe(
      'Now. Honors thesis, Neuro Safety Systems, the Cho Lab, and calls with Arbutus.',
    );
    expect(markerX()).toBeCloseTo(geometry.beats[11].x, 6);
  });

  it('announces the caption politely', () => {
    render(<RhythmStrip />);
    expect(document.querySelector('.caption[aria-live]')).toHaveAttribute(
      'aria-live',
      'polite',
    );
  });

  it.each([
    ['hover', (el: HTMLElement) => fireEvent.pointerOver(el)],
    ['focus', (el: HTMLElement) => fireEvent.focus(el)],
    ['tap', (el: HTMLElement) => fireEvent.click(el)],
  ])('moves only the marker and caption on %s', (_, act) => {
    render(<RhythmStrip />);
    const before = trace();
    beatsButtons().forEach((button, i) => {
      act(button);
      const m = MILESTONES[i];
      expect(caption()).toBe(`${m.label}. ${m.text}`);
      expect(markerX()).toBeCloseTo(geometry.beats[i].x, 6);
      expect(trace()).toBe(before);
    });
  });

  it('ignores touch pointers entering a beat, so drag-scrolling keeps the caption', () => {
    render(<RhythmStrip />);
    fireEvent.pointerOver(beatsButtons()[0], { pointerType: 'touch' });
    expect(caption()).toMatch(/^Now\./);
  });

  it('prints year labels under beats 1, 2, 3, 4, 8 and 12', () => {
    render(<RhythmStrip />);
    const ticks = [...document.querySelectorAll('.strip-tick')];
    expect(ticks.map((t) => t.textContent)).toEqual([
      '2022',
      '2023',
      '2024',
      '2025',
      '2026',
      'now',
    ]);
    const expectedX = [0, 1, 2, 3, 7, 11].map(
      (i) => `${(geometry.beats[i].x / 250) * 100}%`,
    );
    expect(ticks.map((t) => (t as HTMLElement).style.left)).toEqual(expectedX);
  });
});
