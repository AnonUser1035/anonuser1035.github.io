// @ts-check
/*
 * Easter eggs. Nothing announces them: a pointer cursor or a small hover
 * response is the only hint. They're pointer-only, so they add no tab stops
 * and screen readers skip them.
 *
 * - Ping: click the selection dot and a ring leaves it.
 * - Retrace: click a beat and the pen redraws it in crimson at paper speed.
 * - Gain: drag the calibration pulse up or down to change the gain.
 * - Tear-off: click the pen dot; the printout tears away and fresh paper
 *   prints.
 * - Re-ink: click the signature or the line under it; both write again.
 * - Fresh ink: click the name; it turns the pen's crimson and dries back to
 *   ink while the printout tears off.
 * - Year steps: click a printed year to step through that year's milestones.
 */
(() => {
  const strip = document.querySelector('.strip');
  const svg = strip?.querySelector('.strip-svg');
  if (!(strip instanceof HTMLElement) || !(svg instanceof SVGSVGElement)) {
    return;
  }

  const NS = 'http://www.w3.org/2000/svg';
  const MM_PER_SECOND = 25;
  const STANDARD_GAIN = 10; // mm/mV
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const ink = /** @type {SVGGElement} */ (svg.querySelector('.strip-ink'));
  const trace = /** @type {SVGPathElement} */ (
    svg.querySelector('.strip-trace')
  );
  const pen = /** @type {SVGCircleElement} */ (svg.querySelector('.strip-pen'));
  const marks = /** @type {SVGGElement} */ (svg.querySelector('.strip-marks'));
  const defs = /** @type {SVGDefsElement} */ (svg.querySelector('defs'));
  const speed = /** @type {HTMLElement} */ (
    strip.querySelector('.strip-print--speed')
  );
  const beats = /** @type {HTMLElement[]} */ ([
    ...strip.querySelectorAll('.strip-beat'),
  ]);
  const [, , width, height] = (svg.getAttribute('viewBox') ?? '')
    .split(' ')
    .map(Number);
  const penX = Number(pen.getAttribute('cx'));
  const penY = Number(pen.getAttribute('cy'));
  const baseline = Number(strip.dataset.baseline);
  const markerY = Number(strip.dataset.markerY);

  /** @param {number} mm */
  const pct = (mm) => `${(mm / width) * 100}%`;
  /** @param {HTMLElement} beat @param {string} key */
  const mm = (beat, key) => Number(beat.dataset[key]);
  /** @param {Element} el */
  const armed = (el) => getComputedStyle(el).visibility === 'visible';
  /** @param {number} index */
  const select = (index) =>
    strip.dispatchEvent(new CustomEvent('strip:select', { detail: index }));
  /**
   * @param {string} tag
   * @param {Record<string, string | number>} attrs
   */
  const draw = (tag, attrs) => {
    const el = document.createElementNS(NS, tag);
    for (const [key, value] of Object.entries(attrs)) {
      el.setAttribute(key, String(value));
    }
    return el;
  };
  /** @param {string} className */
  const overlay = (className) => {
    const el = document.createElement('span');
    el.className = className;
    el.setAttribute('aria-hidden', 'true');
    strip.append(el);
    return el;
  };

  // Ping and retrace. Whether the press landed on the dot is decided on
  // pointerdown, before a tap moves the dot to the tapped beat.
  let onDot = false;
  strip.addEventListener('pointerdown', (event) => {
    const dot = marks.querySelector('.strip-marker');
    const box = dot?.getBoundingClientRect();
    const reach = event.pointerType === 'touch' ? 24 : 12;
    onDot =
      !!box &&
      Math.hypot(
        event.clientX - (box.left + box.width / 2),
        event.clientY - (box.top + box.height / 2),
      ) <= reach;
  });

  /** @param {number} index */
  const ping = (index) => {
    const ring = draw('circle', {
      class: 'strip-ping',
      cx: mm(beats[index], 'x'),
      cy: markerY,
      r: 1,
    });
    marks.prepend(ring);
    ring.animate(
      [
        { transform: 'scale(1)', opacity: 0.9 },
        { transform: 'scale(4.5)', opacity: 0 },
      ],
      { duration: 750, easing: 'cubic-bezier(0.2, 0.6, 0.3, 1)' },
    ).onfinish = () => ring.remove();
  };

  let clips = 0;
  /** @param {number} index */
  const retrace = (index) => {
    const from = mm(beats[index], 'p');
    const to = mm(beats[index], 't');
    const id = `strip-retrace-${clips++}`;
    const clip = draw('clipPath', { id });
    const reveal = draw('rect', {
      class: 'strip-retrace-reveal',
      x: from,
      y: 0,
      width: to - from,
      height,
    });
    clip.append(reveal);
    defs.append(clip);
    const copy = /** @type {SVGPathElement} */ (trace.cloneNode());
    copy.setAttribute('class', 'strip-retrace');
    copy.setAttribute('clip-path', `url(#${id})`);
    ink.append(copy);
    const duration = ((to - from) / MM_PER_SECOND) * 1000;
    reveal.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], {
      duration,
      fill: 'forwards',
    });
    copy.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 700,
      delay: duration + 350,
      fill: 'forwards',
    }).onfinish = () => {
      copy.remove();
      clip.remove();
    };
  };

  strip.addEventListener('click', (event) => {
    const index = beats.indexOf(/** @type {HTMLElement} */ (event.target));
    // detail is 0 for keyboard clicks: the eggs are pointer-only.
    if (index < 0 || event.detail === 0 || reduced.matches) return;
    retrace(index);
    if (onDot) ping(index);
    onDot = false;
  });

  // Gain: the calibration pulse is a handle. Its top follows the pointer,
  // in half-millimeter steps from 2.5 to 14 mm/mV (the tallest R wave still
  // fits on the paper), and 10 mm/mV is where it rests.
  const cal = overlay('strip-cal');
  cal.style.width = beats[0]?.style.left ?? '0';
  ink.style.transformOrigin = `0 ${baseline}px`;
  strip.style.setProperty('--marks-rise', `${baseline - markerY}px`);
  strip.style.setProperty('--pen-rise', `${baseline - penY}px`);
  let gain = STANDARD_GAIN;
  /** @param {number} value mm/mV */
  const setGain = (value) => {
    const stepped = Math.round(Math.min(14, Math.max(2.5, value)) * 2) / 2;
    if (stepped === gain) return;
    gain = stepped;
    strip.style.setProperty('--gain', String(gain / STANDARD_GAIN));
    speed.textContent =
      gain === STANDARD_GAIN ? '25 mm/s' : `25 mm/s · ${gain} mm/mV`;
  };
  cal.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    try {
      cal.setPointerCapture(event.pointerId); // keep the drag past the handle
    } catch {}
    const mmPerPx = width / strip.getBoundingClientRect().width;
    const startY = event.clientY;
    const startGain = gain;
    /** @param {PointerEvent} move */
    const drag = (move) =>
      setGain(startGain + (startY - move.clientY) * mmPerPx);
    const stop = () => {
      cal.removeEventListener('pointermove', drag);
      cal.removeEventListener('pointerup', stop);
      cal.removeEventListener('pointercancel', stop);
    };
    cal.addEventListener('pointermove', drag);
    cal.addEventListener('pointerup', stop);
    cal.addEventListener('pointercancel', stop);
  });

  // Tear-off. A copy of the printout, cut along a ragged line just past the
  // pen, tears from the bottom up in a few catches (still held at the top),
  // then lifts free and away. A thin band of paper fibers shows along the
  // torn edge. Fresh paper waits underneath, its labels held back, and
  // starts printing once the old sheet is clear.
  let tearing = false;
  /**
   * A torn edge from top to bottom around x: a wandering line with small
   * jags and the odd deeper notch, plus how far fibers stick out past it.
   * @param {number} x @param {number} h px
   */
  const tearLine = (x, h) => {
    /** @type {Array<[x: number, y: number, fiber: number]>} */
    const points = [];
    let drift = 0;
    for (let y = 0; y < h; y += 1.5 + Math.random() * 3) {
      drift = Math.max(-6, Math.min(6, drift + (Math.random() - 0.5) * 2.4));
      const notch = Math.random() < 0.08 ? (Math.random() - 0.5) * 7 : 0;
      const jag = (Math.random() - 0.5) * 3 + notch;
      points.push([x + drift + jag, y, 1 + Math.random() * 2.5]);
    }
    points.push([x + drift, h, 1.5]);
    return points;
  };
  /**
   * @param {Array<[number, number, number]>} line
   * @param {boolean} fibers include the fibers past the edge
   */
  const sheetShape = (line, fibers) => {
    const h = line[line.length - 1][1];
    const edge = line.map(
      ([x, y, fiber]) =>
        `${(x + (fibers ? fiber : 0)).toFixed(1)}px ${y.toFixed(1)}px`,
    );
    return `polygon(0 0,${edge.join(',')},0 ${h}px)`;
  };
  const tearOff = () => {
    if (tearing) return;
    select(-1);
    for (const el of svg.querySelectorAll('.strip-ping, .strip-retrace')) {
      el.remove();
    }
    const prints = strip
      .getAnimations({ subtree: true })
      .filter((animation) => animation instanceof CSSAnimation);
    if (prints.length === 0) return; // reduced motion: nothing prints

    tearing = true;
    const box = strip.getBoundingClientRect();
    const tearX = ((penX + 2.5) / width) * box.width;
    const line = tearLine(tearX, box.height);
    const torn = document.createElement('div');
    torn.className = 'strip-torn';
    torn.inert = true;
    torn.setAttribute('aria-hidden', 'true');
    torn.style.transformOrigin = `${tearX}px 0`;
    const fibers = document.createElement('div');
    fibers.className = 'strip-torn-fibers';
    fibers.style.clipPath = sheetShape(line, true);
    const paper = document.createElement('div');
    paper.className = 'strip-torn-paper';
    paper.style.clipPath = sheetShape(line, false);
    const sheet = /** @type {SVGSVGElement} */ (svg.cloneNode(true));
    for (const el of sheet.querySelectorAll(
      'defs, .strip-pen, .strip-marks, .strip-retrace',
    )) {
      el.remove();
    }
    sheet.querySelector('.strip-trace')?.removeAttribute('clip-path');
    const labels = strip.querySelectorAll('.strip-print--lead, .strip-tick');
    paper.append(sheet, ...[...labels].map((el) => el.cloneNode(true)));
    torn.append(fibers, paper);
    strip.append(torn);
    strip.classList.add('strip--fresh');

    for (const animation of prints) {
      animation.currentTime = 0;
      animation.pause();
    }

    const flat = 'drop-shadow(0 0 0 rgb(0 0 0 / 0))';
    const lifted = 'drop-shadow(0 2px 4px rgb(0 0 0 / 0.16))';
    const away = 'drop-shadow(0 10px 14px rgb(0 0 0 / 0.1))';
    const slip = 'cubic-bezier(0.6, 0, 0.9, 0.6)';
    /**
     * @param {number} offset
     * @param {string} transform
     * @param {string} filter
     * @param {number} opacity
     * @param {string} [easing]
     */
    const frame = (offset, transform, filter, opacity, easing = 'linear') => ({
      offset,
      transform,
      filter,
      opacity,
      easing,
    });
    torn.animate(
      [
        frame(0, 'rotate(0deg)', flat, 1),
        // The tear runs up from the bottom edge in catches.
        frame(0.1, 'rotate(0.3deg)', lifted, 1, slip),
        frame(0.16, 'rotate(0.36deg)', lifted, 1),
        frame(0.26, 'rotate(0.85deg)', lifted, 1, slip),
        frame(0.31, 'rotate(0.9deg)', lifted, 1),
        frame(
          0.42,
          'rotate(1.5deg)',
          lifted,
          1,
          'cubic-bezier(0.4, 0, 0.7, 0.6)',
        ),
        // Free: lifted toward the reader and away.
        frame(
          0.6,
          'translate(-1%, -8%) rotate(1.9deg) scale(1.015)',
          away,
          0.85,
        ),
        frame(1, 'translate(-2.5%, -20%) rotate(2.4deg) scale(1.04)', away, 0),
      ],
      { duration: 1000 },
    ).onfinish = () => {
      torn.remove();
      strip.classList.remove('strip--fresh');
      for (const animation of prints) animation.play();
      tearing = false;
    };
  };
  const penHit = overlay('strip-pen-hit');
  penHit.style.left = pct(penX);
  penHit.style.top = `${(penY / height) * 100}%`;
  penHit.style.animationDelay = pen.style.animationDelay;
  penHit.addEventListener('click', tearOff);

  // Re-ink: the signature writes itself again, then the line under it.
  const lines = [
    document.querySelector('.signature'),
    document.querySelector('.dateline'),
  ].filter((el) => el instanceof HTMLElement);
  const reink = () => {
    if (reduced.matches) return;
    for (const line of lines) {
      line.classList.remove('is-inking');
      void line.offsetWidth;
      line.classList.add('is-inking');
    }
  };
  for (const line of lines) {
    line.addEventListener('click', reink);
    line.addEventListener('animationend', () => {
      line.classList.remove('is-inking');
    });
  }

  // Fresh ink: the name takes the pen's crimson and dries back to ink, and
  // the printout tears off once the pen has finished printing.
  const name = document.querySelector('.name-ink');
  if (name instanceof HTMLElement) {
    name.addEventListener('click', () => {
      if (reduced.matches) return;
      name.classList.remove('is-fresh');
      void name.offsetWidth;
      name.classList.add('is-fresh');
      if (armed(penHit)) tearOff();
    });
    name.addEventListener('animationend', () => {
      name.classList.remove('is-fresh');
    });
  }

  // Year steps: a printed year picks that year's first milestone, and each
  // click after steps to the next one.
  for (const tick of strip.querySelectorAll('.strip-tick')) {
    tick.addEventListener('click', () => {
      const year = (tick.textContent ?? '').toLowerCase();
      const group = beats.flatMap((beat, i) =>
        (beat.getAttribute('aria-label') ?? '')
          .split(':')[0]
          .toLowerCase()
          .endsWith(year) && armed(beat)
          ? [i]
          : [],
      );
      if (group.length === 0) return;
      const current = beats.findIndex(
        (beat) => beat.getAttribute('aria-selected') === 'true',
      );
      select(group[(group.indexOf(current) + 1) % group.length]);
    });
  }
})();
