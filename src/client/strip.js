// @ts-check
/*
 * Rhythm strip selection. Hover, focus or tap picks a beat: the dot moves to
 * its R peak and the caption shows its milestone. Leaving the strip, tabbing
 * past it, or tapping elsewhere brings back the hint. Inlined into the page.
 *
 * For keyboards and screen readers the strip is a listbox with one tab stop:
 * arrow keys move between beats and Home/End jump to the ends. Each beat is
 * read once, from its label, with its position.
 */
(() => {
  const strip = document.querySelector('.strip');
  const current = document.querySelector('.caption-current');
  const hint = document.querySelector('.caption-hint');
  if (
    !(strip instanceof HTMLElement) ||
    !current ||
    !(hint instanceof HTMLElement)
  ) {
    return;
  }
  const marks = strip.querySelector('.strip-marks');
  const beats = [...strip.querySelectorAll('.strip-beat')];
  // The hint first, then one sizer per beat.
  const sizers = document.querySelectorAll('.caption-sizer');
  const marker = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'circle',
  );
  marker.setAttribute('class', 'strip-marker');
  marker.setAttribute('r', '1');
  marker.setAttribute('cy', strip.dataset.markerY ?? '0');
  let selected = -1;

  /** @param {number} index Beat to select, or -1 for none. */
  const select = (index) => {
    if (index === selected) return;
    beats[selected]?.setAttribute('aria-selected', 'false');
    selected = index;
    const beat = beats[index];
    if (!(beat instanceof HTMLElement)) {
      marker.remove();
      current.textContent = '';
      hint.hidden = false;
      return;
    }
    beat.setAttribute('aria-selected', 'true');
    marker.setAttribute('cx', beat.dataset.x ?? '0');
    marks?.append(marker);
    current.innerHTML = sizers[index + 1].innerHTML;
    hint.hidden = true;
  };

  /** @param {EventTarget | null} target */
  const indexOf = (target) => beats.indexOf(/** @type {Element} */ (target));

  // Touch pointers select on tap (click), so dragging the strip to scroll
  // never changes the caption.
  strip.addEventListener('pointerover', (event) => {
    const index = indexOf(event.target);
    if (index >= 0 && event.pointerType !== 'touch') select(index);
  });
  strip.addEventListener('pointerleave', (event) => {
    if (event.pointerType !== 'touch') select(-1);
  });
  strip.addEventListener('focusin', (event) => {
    const index = indexOf(event.target);
    if (index < 0) return;
    // Roving tab stop: Tab comes back to the beat focused last.
    for (const beat of beats) beat.setAttribute('tabindex', '-1');
    beats[index].setAttribute('tabindex', '0');
    select(index);
  });

  /** @type {Record<string, (from: number) => number>} */
  const KEYS = {
    ArrowRight: (from) => from + 1,
    ArrowLeft: (from) => from - 1,
    Home: () => 0,
    End: () => beats.length - 1,
  };
  strip.addEventListener('keydown', (event) => {
    const from = indexOf(event.target);
    const move = KEYS[event.key];
    if (from < 0 || !move) return;
    event.preventDefault();
    const to = Math.max(0, Math.min(beats.length - 1, move(from)));
    // A beat the pen hasn't printed yet is hidden and refuses focus.
    /** @type {HTMLElement} */ (beats[to]).focus();
  });
  strip.addEventListener('click', (event) => {
    const index = indexOf(event.target);
    if (index >= 0) select(index);
  });
  strip.addEventListener('focusout', (event) => {
    if (!strip.contains(/** @type {Node | null} */ (event.relatedTarget))) {
      select(-1);
    }
  });

  // On touch screens there is no hover to leave, so a tap anywhere outside
  // the strip returns the caption to the hint.
  document.addEventListener('pointerdown', (event) => {
    if (
      event.pointerType === 'touch' &&
      !strip.contains(/** @type {Node | null} */ (event.target))
    ) {
      select(-1);
    }
  });

  // Easter eggs pick beats with this event (-1 clears). Beats the pen hasn't
  // printed yet stay unselectable.
  strip.addEventListener('strip:select', (event) => {
    const index = /** @type {CustomEvent<number>} */ (event).detail;
    const beat = beats[index];
    if (
      index === -1 ||
      (beat && getComputedStyle(beat).visibility === 'visible')
    ) {
      select(index);
    }
  });

  // Phones: the strip sits in a sideways scroller that opens on the most
  // recent beats. While the trace prints, the paper runs under a pen that
  // holds still where it will come to rest, so the view starts on the
  // oldest beat and ends at the right end as before. Touching, scrolling or
  // focusing the strip hands it back to the reader. Under reduced motion
  // nothing prints, so nothing pans.
  const scroller = strip.parentElement;
  const reveal = strip.querySelector('.strip-reveal');
  const effect = reveal?.getAnimations?.()[0]?.effect;
  const viewBox = strip.querySelector('.strip-svg')?.getAttribute('viewBox');
  if (
    scroller &&
    reveal &&
    effect &&
    viewBox &&
    scroller.scrollWidth > scroller.clientWidth
  ) {
    // The share of the strip's width that the trace prints across.
    const share =
      Number(reveal.getAttribute('width')) / Number(viewBox.split(' ')[2]);
    let frame = 0;
    const ride = () => {
      const progress = Number(effect.getComputedTiming().progress ?? 1);
      const max = scroller.scrollWidth - scroller.clientWidth;
      const left = (1 - progress) * share * strip.clientWidth;
      // RTL: 0 is the right end and -max the left.
      scroller.scrollLeft = -Math.min(max, left);
      frame = progress < 1 ? requestAnimationFrame(ride) : 0;
    };
    const stop = () => cancelAnimationFrame(frame);
    for (const type of ['pointerdown', 'wheel', 'focusin']) {
      scroller.addEventListener(type, stop, { passive: true });
    }
    ride();
  }
})();
