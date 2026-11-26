// @ts-check
/*
 * Rhythm strip selection. Hover, focus or tap picks a beat: the dot moves to
 * its R peak and the caption shows its milestone. Leaving the strip, tabbing
 * past it, or tapping elsewhere brings back the hint. Inlined into the page.
 */
(() => {
  const strip = document.querySelector('.strip');
  const live = document.querySelector('.caption[aria-live]');
  const hint = document.querySelector('.caption-hint');
  if (
    !(strip instanceof HTMLElement) ||
    !live ||
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
    beats[selected]?.removeAttribute('aria-current');
    selected = index;
    const beat = beats[index];
    if (!(beat instanceof HTMLElement)) {
      marker.remove();
      live.textContent = '';
      hint.hidden = false;
      return;
    }
    beat.setAttribute('aria-current', 'true');
    marker.setAttribute('cx', beat.dataset.x ?? '0');
    marks?.append(marker);
    live.innerHTML = sizers[index + 1].innerHTML;
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
    if (index >= 0) select(index);
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
})();
