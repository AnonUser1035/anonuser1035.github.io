// @ts-check
/*
 * Easter eggs. Nothing announces them: a pointer cursor or a small hover
 * response is the only hint, and they're pointer-only, so they add no tab
 * stops and screen readers skip them. Each checks <html data-fidgets> when it
 * fires, so the dev panel can switch them live.
 */
(() => {
  const strip = document.querySelector('.strip');
  const svg = strip?.querySelector('.strip-svg');
  if (!(strip instanceof HTMLElement) || !(svg instanceof SVGSVGElement))
    return;

  const NS = 'http://www.w3.org/2000/svg';
  const MM_PER_SECOND = 25;
  const root = document.documentElement;
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
  const width = svg.viewBox.baseVal.width;
  const height = svg.viewBox.baseVal.height;
  const baseline = Number(strip.dataset.baseline);
  const markerY = Number(strip.dataset.markerY);

  /** @param {string} name */
  const on = (name) => (root.dataset.fidgets ?? '').split(' ').includes(name);
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
    for (const [key, value] of Object.entries(attrs))
      el.setAttribute(key, String(value));
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

  // Last pointer type, since click events don't reliably carry one.
  let pointer = 'mouse';
  strip.addEventListener('pointerdown', (event) => {
    pointer = event.pointerType;
  });

  // 1. Reprint: the strip clears and prints again, beats re-arming as the
  //    pen passes. Tear-off slides the old printout away first.
  let tearing = false;
  const reprint = () => {
    select(-1);
    for (const animation of strip.getAnimations({ subtree: true })) {
      if (animation instanceof CSSAnimation) animation.currentTime = 0;
    }
  };
  const tearOff = () => {
    if (tearing) return;
    tearing = true;
    const away = strip.animate(
      [
        { transform: 'none', opacity: 1 },
        { transform: 'translateY(-45%) rotate(-1.5deg)', opacity: 0 },
      ],
      {
        duration: 320,
        easing: 'cubic-bezier(0.5, 0, 0.9, 0.5)',
        fill: 'forwards',
      },
    );
    away.onfinish = () => {
      reprint();
      strip.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 260,
        easing: 'ease-out',
      });
      away.cancel();
      tearing = false;
    };
  };
  const restart = () => {
    if (on('tearoff') && !reduced.matches) tearOff();
    else if (on('reprint') || on('tearoff')) reprint();
  };
  const penHit = overlay('strip-pen-hit');
  penHit.style.left = pct(pen.cx.baseVal.value);
  penHit.style.top = `${(pen.cy.baseVal.value / height) * 100}%`;
  penHit.style.animationDelay = pen.style.animationDelay;
  penHit.addEventListener('click', restart);

  // 2. Ping: a ring leaves the dot when a beat is clicked or tapped.
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

  // 3. Retrace: the pen redraws the clicked beat in crimson at true paper
  //    speed (25 mm/s), then the ink fades back.
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

  // 4. Gain switch: the calibration pulse toggles 10 and 5 mm/mV, like the
  //    gain knob on an ECG machine. The trace eases to half height.
  const cal = overlay('strip-cal');
  cal.style.width = beats[0]?.style.left ?? '0';
  ink.style.transformOrigin = `0 ${baseline}px`;
  strip.style.setProperty('--half-marks', `${(baseline - markerY) / 2}px`);
  strip.style.setProperty(
    '--half-pen',
    `${(baseline - pen.cy.baseVal.value) / 2}px`,
  );
  /** @param {boolean} half */
  const setGain = (half) => {
    strip.classList.toggle('strip--half', half);
    speed.textContent = half ? '25 mm/s · 5 mm/mV' : '25 mm/s';
  };
  cal.addEventListener('click', () => {
    if (on('gain')) setGain(!strip.classList.contains('strip--half'));
  });
  document.addEventListener('fidgets', () => {
    if (!on('gain')) setGain(false);
  });

  // 5. Calipers (mouse): drag across beats to measure the interval between
  //    two R peaks and the rate it implies.
  const calipers = draw('g', { class: 'strip-calipers' });
  marks.before(calipers);
  const reading = overlay('strip-caliper-reading');
  /** @type {{ x: number, from: number } | null} */
  let drag = null;
  let dragged = false;
  /** @param {number} clientX */
  const nearest = (clientX) => {
    const box = strip.getBoundingClientRect();
    const at = ((clientX - box.left) / box.width) * width;
    let best = -1;
    beats.forEach((beat, i) => {
      if (!armed(beat)) return;
      if (
        best < 0 ||
        Math.abs(mm(beat, 'x') - at) < Math.abs(mm(beats[best], 'x') - at)
      ) {
        best = i;
      }
    });
    return best;
  };
  const hideCalipers = () => {
    calipers.replaceChildren();
    reading.textContent = '';
  };
  /** @param {number} a @param {number} b */
  const measure = (a, b) => {
    if (a < 0 || b < 0 || a === b) return hideCalipers();
    const [i, j] = a < b ? [a, b] : [b, a];
    const x1 = mm(beats[i], 'x');
    const x2 = mm(beats[j], 'x');
    const intervals = j - i;
    const ms = Math.round(((x2 - x1) / MM_PER_SECOND) * 1000);
    const bpm = Math.round((60000 * intervals) / ms);
    calipers.replaceChildren(
      draw('line', { x1, x2: x1, y1: 1.2, y2: height - 1.2 }),
      draw('line', { x1: x2, x2, y1: 1.2, y2: height - 1.2 }),
      draw('line', { x1, x2, y1: 2, y2: 2 }),
    );
    reading.style.left = pct((x1 + x2) / 2);
    reading.textContent =
      intervals === 1
        ? `RR ${ms} ms · ${bpm} bpm`
        : `${intervals} intervals · ${(ms / 1000).toFixed(2)} s · ${bpm} bpm`;
  };
  strip.addEventListener('pointerdown', (event) => {
    hideCalipers();
    dragged = false;
    drag =
      on('calipers') && event.pointerType !== 'touch' && event.button === 0
        ? { x: event.clientX, from: nearest(event.clientX) }
        : null;
  });
  strip.addEventListener('pointermove', (event) => {
    if (!drag || !(event.buttons & 1)) return;
    if (!dragged && Math.abs(event.clientX - drag.x) < 6) return;
    dragged = true;
    measure(drag.from, nearest(event.clientX));
  });
  addEventListener('pointerup', () => {
    drag = null;
  });
  strip.addEventListener('pointerleave', hideCalipers);

  // Clicking a beat: ping and retrace. With both off, a mouse click on the
  // strip reprints it instead.
  strip.addEventListener('click', (event) => {
    const index = beats.indexOf(/** @type {HTMLElement} */ (event.target));
    if (index < 0 || dragged || event.detail === 0 || reduced.matches) return;
    if (on('ping')) ping(index);
    if (on('retrace')) retrace(index);
    if (!on('ping') && !on('retrace') && pointer === 'mouse') restart();
  });

  // 6. Pen in rhythm is CSS only (fidgets.css), timed by --rr on the pen.

  // 7. Signature re-ink: "Ryan" writes itself again, left to right.
  const signature = document.querySelector('.signature');
  if (signature instanceof HTMLElement) {
    signature.addEventListener('click', () => {
      if (!on('ink') || reduced.matches) return;
      signature.classList.remove('is-inking');
      void signature.offsetWidth;
      signature.classList.add('is-inking');
    });
    signature.addEventListener('animationend', () => {
      signature.classList.remove('is-inking');
    });
  }

  // 8. Year steps: a printed year picks that year's first milestone, and
  //    each click after steps to the next one.
  for (const tick of strip.querySelectorAll('.strip-tick')) {
    tick.addEventListener('click', () => {
      if (!on('years')) return;
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
      const current = beats.findIndex((beat) =>
        beat.hasAttribute('aria-current'),
      );
      select(group[(group.indexOf(current) + 1) % group.length]);
    });
  }
})();
