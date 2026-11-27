import { describe, expect, it } from 'vitest';

import { MILESTONES } from '../../data/content.ts';
import { loadHome } from './page.ts';

const $ = <T extends Element = HTMLElement>(selector: string) =>
  document.querySelector(selector) as T;
const $$ = (selector: string) => [...document.querySelectorAll(selector)];
const beat = (i: number) => $$('.strip-beat')[i] as HTMLElement;
const pointer = (type: string, target: Element, init: PointerEventInit = {}) =>
  target.dispatchEvent(
    new PointerEvent(type, { bubbles: true, pointerType: 'mouse', ...init }),
  );
/** A pointer click (detail 1); keyboard activation has detail 0. */
const click = (target: Element, detail = 1) =>
  target.dispatchEvent(new MouseEvent('click', { bubbles: true, detail }));
const label = () => $('.caption-current .caption-label')?.textContent;

describe('easter eggs', () => {
  it('add no tab stops and stay hidden from screen readers', () => {
    loadHome();
    const focusable = $$('.strip button, .strip [tabindex]');
    expect(focusable).toHaveLength(MILESTONES.length);
    expect(
      focusable.filter((el) => el.getAttribute('tabindex') === '0'),
    ).toHaveLength(1);
    for (const el of $$('.strip-cal, .strip-pen-hit')) {
      expect(el.tagName).toBe('SPAN');
      expect(el.getAttribute('aria-hidden')).toBe('true');
    }
  });

  it('retrace a clicked beat, and ping only when the press lands on the dot', () => {
    const { animations } = loadHome();
    pointer('pointerover', beat(3));
    // jsdom puts every box at 0,0, so a press at 0,0 is on the dot.
    pointer('pointerdown', beat(3), { clientX: 300, clientY: 300 });
    click(beat(3));
    expect($$('.strip-retrace')).toHaveLength(1);
    expect($$('.strip-ping')).toHaveLength(0);

    pointer('pointerdown', beat(3), { clientX: 0, clientY: 0 });
    click(beat(3));
    expect($$('.strip-ping')).toHaveLength(1);
    expect($$('.strip-retrace')).toHaveLength(2);

    for (const animation of animations) animation.finish();
    expect($$('.strip-ping, .strip-retrace')).toHaveLength(0);
    expect($$('clipPath')).toHaveLength(1); // only the print reveal is left
  });

  it('ignore keyboard activation', () => {
    loadHome();
    click(beat(2), 0);
    expect($$('.strip-retrace')).toHaveLength(0);
  });

  it('turn the calibration pulse into a gain handle that follows the pointer', () => {
    loadHome();
    const strip = $('.strip');
    const cal = $('.strip-cal');
    const speed = () => $('.strip-print--speed').textContent;
    const gain = () => strip.style.getPropertyValue('--gain');
    // 1250 px wide: 5 px per mm, so 1 px of drag is 0.2 mm/mV.
    strip.getBoundingClientRect = () => ({ width: 1250 }) as DOMRect;

    pointer('pointerdown', cal, { clientY: 100, button: 0 });
    pointer('pointermove', cal, { clientY: 90 });
    expect(speed()).toBe('25 mm/s · 12 mm/mV');
    expect(gain()).toBe('1.2');
    pointer('pointermove', cal, { clientY: -400 });
    expect(speed()).toBe('25 mm/s · 14 mm/mV');
    pointer('pointermove', cal, { clientY: 200 });
    expect(speed()).toBe('25 mm/s · 2.5 mm/mV');
    pointer('pointermove', cal, { clientY: 101 });
    expect(speed()).toBe('25 mm/s');
    expect(gain()).toBe('1');

    pointer('pointerup', cal);
    pointer('pointermove', cal, { clientY: 0 });
    expect(speed()).toBe('25 mm/s');
  });

  it('tear off the printout from the pen dot and print fresh paper after', () => {
    const { animations, prints } = loadHome();
    pointer('pointerover', beat(5));
    click($('.strip-pen-hit'));

    const torn = $('.strip-torn');
    expect(torn.getAttribute('aria-hidden')).toBe('true');
    expect($('.strip-torn-paper').style.clipPath).toMatch(/^polygon\(/);
    expect(torn.querySelector('.strip-trace')?.hasAttribute('clip-path')).toBe(
      false,
    );
    expect(torn.querySelector('.strip-marker, .strip-pen')).toBeNull();
    expect($('.strip-marker')).toBeNull();
    expect(prints.every((p) => p.currentTime === 0 && !p.playing)).toBe(true);

    click($('.strip-pen-hit')); // ignored mid-tear
    expect($$('.strip-torn')).toHaveLength(1);

    animations.find((a) => a.target === torn)?.finish();
    expect($('.strip-torn')).toBeNull();
    expect(prints.every((p) => p.playing)).toBe(true);
  });

  it('re-ink the signature and the closing line together', () => {
    loadHome();
    const lines = [$('.signature'), $('.footer p')];
    click(lines[1]);
    expect(lines.every((l) => l.classList.contains('is-inking'))).toBe(true);
    lines[0].dispatchEvent(new Event('animationend'));
    expect(lines[0].classList.contains('is-inking')).toBe(false);
  });

  it('step through a year’s milestones from its printed label', () => {
    loadHome();
    const tick = $$('.strip-tick').find((t) => t.textContent === '2025');
    const steps = Array.from({ length: 5 }, () => {
      click(tick as Element);
      return label();
    });
    expect(steps).toEqual([
      'May 2025.',
      'Jun 2025.',
      'Nov 2025.',
      'Nov 2025.',
      'May 2025.',
    ]);
  });

  it('respect reduced motion', () => {
    const { animations } = loadHome({ reducedMotion: true });
    pointer('pointerover', beat(3));
    pointer('pointerdown', beat(3), { clientX: 0, clientY: 0 });
    click(beat(3));
    click($('.signature'));
    expect(animations).toHaveLength(0);
    expect($('.signature').classList.contains('is-inking')).toBe(false);
  });
});
