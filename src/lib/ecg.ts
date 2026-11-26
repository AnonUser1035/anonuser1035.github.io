/**
 * Lead II rhythm strip model.
 *
 * Pure functions that turn a beat count into SVG geometry on standard ECG
 * paper: 25 mm/s, 10 mm/mV, user units in millimeters. Everything here runs at
 * build time; the client only receives the finished path strings and beat
 * positions.
 *
 * The waveform is a sum of simple components per beat (P, q, R, s, T) with
 * exactly isoelectric PR, ST and TP segments. The drawn trace adds a faint,
 * fixed recording noise between beats; it is zero on the calibration pulse
 * and near every QRS, so peaks and intervals are untouched. See the expected
 * measurements in `src/lib/__tests__/ecg.test.ts`.
 */

// Paper and scale
export const MM_PER_SECOND = 25;
export const MM_PER_MV = 10;
export const STRIP_SECONDS = 10;
export const STRIP_WIDTH_MM = STRIP_SECONDS * MM_PER_SECOND; // 250
export const STRIP_HEIGHT_MM = 30;
export const BASELINE_MM = 20;

// Calibration pulse: 1 mV for 200 ms
export const CAL_START = 0.2;
export const CAL_END = 0.4;
export const CAL_MV = 1;

// Rhythm: sinus, accelerating along a logistic curve
const FIRST_R = 0.85;
const RR_FAST = 0.56;
const RR_SPAN = 0.54;
const RR_CENTER = 4.5;
const RR_WIDTH = 1.3;
const REFERENCE_BEATS = 12;

/** Where the trace stops: just before the next, unrecorded P wave. */
export const TRACE_END = 9.546;

// Waveform components, times relative to the R peak in seconds
const P_START = -0.195;
const P_DURATION = 0.09;
const P_MV = 0.15;
const P_EXPONENT = 1.4;

const QRS_ONSET = -0.035;
const Q = { mu: -0.024, sigma: 0.006, mv: -0.14 };
const R = { mu: 0, sigma: 0.0085, mv: 1.3 };
const S = { mu: 0.026, sigma: 0.0075, mv: -0.22 };
/** Gaussians are applied within this many sigmas of their center, 0 beyond. */
const GAUSS_CUTOFF = 6;

const QTC = 0.38;
const T_DURATION_PER_ROOT_RR = 0.2;
const T_MV = 0.32;
const T_RISE = 2.6;
const T_FALL = 1.5;
const T_MODE = T_RISE / (T_RISE + T_FALL);
const T_PEAK = T_MODE ** T_RISE * (1 - T_MODE) ** T_FALL;

// Sampling
const COARSE_STEP = 0.002;
const FINE_STEP = 0.0005;
const FINE_WINDOW = 0.05;
/** Path simplification tolerance in mm, far below a device pixel. */
const SIMPLIFY_MM = 0.004;

// Recording noise: smoothed Gaussian jitter on a fixed seed, so every build
// draws the same strip. Knots every 6 ms keep the path compact.
const NOISE_STEP = 0.006;
const NOISE_MV = 0.009; // standard deviation
const NOISE_LIMIT_MV = 0.03;
const NOISE_CORRELATION = 0.5;
const NOISE_SEED = 20261126;
const NOISE_START = 0.45; // after the calibration pulse
const NOISE_FADE_IN = 0.1;
const NOISE_QUIET = 0.035; // seconds either side of an R peak with no noise
const NOISE_FADE = 0.035;

/** Hit area padding before the first P wave, in seconds. */
const FIRST_HIT_LEAD = 0.1;

/** y of the R-peak marker, in mm (1.30 mV above the baseline). */
export const R_MARKER_Y = BASELINE_MM - R.mv * MM_PER_MV;

export interface Beat {
  /** R-peak time, seconds. */
  r: number;
  /** RR interval preceding this beat (the first beat uses the first one). */
  rr: number;
  /** P-wave onset, seconds. */
  pStart: number;
  /** T-wave end, seconds. */
  tEnd: number;
  /** Interactive region, seconds. */
  hitStart: number;
  hitEnd: number;
}

export type Sample = readonly [t: number, mv: number];

export const toX = (t: number): number => t * MM_PER_SECOND;
export const toY = (mv: number): number => BASELINE_MM - mv * MM_PER_MV;

function logisticRR(i: number, center: number): number {
  return RR_FAST + RR_SPAN / (1 + Math.exp((i - center) / RR_WIDTH));
}

function sumRR(intervals: number, center: number): number {
  let total = 0;
  for (let i = 1; i <= intervals; i += 1) total += logisticRR(i, center);
  return total;
}

/**
 * RR intervals (seconds) for a strip of `count` beats.
 *
 * For 12 beats this is RR_i = 0.56 + 0.54 / (1 + e^((i - 4.5) / 1.3)),
 * i = 1..11: sinus rhythm accelerating from about 56 to 106 bpm. For any other
 * count the curve keeps its shape and rate limits, and its midpoint shifts so
 * the last R peak still lands where it does with 12 beats. That keeps the
 * strip at 10 seconds and the final T wave before the end of the trace.
 */
export function rrIntervals(count: number): number[] {
  if (!Number.isInteger(count) || count < 2) {
    throw new Error(`Rhythm strip needs at least 2 beats, got ${count}.`);
  }

  const intervals = count - 1;
  const target = sumRR(REFERENCE_BEATS - 1, RR_CENTER);
  let center = RR_CENTER;

  if (count !== REFERENCE_BEATS) {
    const minTotal = intervals * RR_FAST;
    const maxTotal = intervals * (RR_FAST + RR_SPAN);
    if (target <= minTotal || target >= maxTotal) {
      throw new Error(
        `${count} beats cannot fit the 10-second strip between 56 and 107 bpm. ` +
          'Use roughly 9 to 15 milestones.',
      );
    }
    // sumRR increases with center, so bisect for the matching midpoint.
    let lo = -50;
    let hi = 50;
    for (let k = 0; k < 200; k += 1) {
      center = (lo + hi) / 2;
      if (sumRR(intervals, center) < target) lo = center;
      else hi = center;
    }
  }

  return Array.from({ length: intervals }, (_, k) => logisticRR(k + 1, center));
}

function tWindow(rr: number): { start: number; end: number; duration: number } {
  const root = Math.sqrt(rr);
  const end = QRS_ONSET + QTC * root;
  const duration = T_DURATION_PER_ROOT_RR * root;
  return { start: end - duration, end, duration };
}

/** Beat timing and interactive regions for a strip of `count` beats. */
export function beats(count: number): Beat[] {
  const intervals = rrIntervals(count);
  const peaks = [FIRST_R];
  for (const rr of intervals) peaks.push(peaks[peaks.length - 1] + rr);

  const timing = peaks.map((r, i) => {
    const rr = intervals[Math.max(0, i - 1)];
    return { r, rr, pStart: r + P_START, tEnd: r + tWindow(rr).end };
  });

  const last = timing[timing.length - 1];
  if (last.tEnd >= TRACE_END) {
    throw new Error('The last T wave must end before the trace does.');
  }

  return timing.map((beat, i) => {
    const prev = timing[i - 1];
    const next = timing[i + 1];
    return {
      ...beat,
      hitStart: prev
        ? (prev.tEnd + beat.pStart) / 2
        : beat.pStart - FIRST_HIT_LEAD,
      hitEnd: next ? (beat.tEnd + next.pStart) / 2 : TRACE_END,
    };
  });
}

function gaussian(
  d: number,
  { mu, sigma, mv }: { mu: number; sigma: number; mv: number },
): number {
  const z = (d - mu) / sigma;
  return Math.abs(z) > GAUSS_CUTOFF ? 0 : mv * Math.exp(-0.5 * z * z);
}

/** Voltage (mV) of one beat at time d relative to its R peak. */
export function beatVoltage(d: number, rr: number): number {
  let v = 0;

  const pu = (d - P_START) / P_DURATION;
  if (pu > 0 && pu < 1) v += P_MV * Math.sin(Math.PI * pu) ** P_EXPONENT;

  v += gaussian(d, Q) + gaussian(d, R) + gaussian(d, S);

  const t = tWindow(rr);
  const tu = (d - t.start) / t.duration;
  if (tu > 0 && tu < 1) {
    v += (T_MV * (tu ** T_RISE * (1 - tu) ** T_FALL)) / T_PEAK;
  }

  return v;
}

/** Voltage (mV) of the whole strip at time t, calibration pulse included. */
export function voltage(t: number, strip: readonly Beat[]): number {
  let v = t >= CAL_START && t < CAL_END ? CAL_MV : 0;
  for (const beat of strip) v += beatVoltage(t - beat.r, beat.rr);
  return v;
}

/** Small seeded PRNG (mulberry32), so the noise is identical on every build. */
function seeded(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NOISE_KNOTS = (() => {
  const random = seeded(NOISE_SEED);
  const count = Math.ceil(TRACE_END / NOISE_STEP) + 2;
  const knots = new Float64Array(count);
  const innovation = NOISE_MV * Math.sqrt(1 - NOISE_CORRELATION ** 2);
  let previous = 0;
  for (let k = 0; k < count; k += 1) {
    const gaussian =
      Math.sqrt(-2 * Math.log(1 - random())) * Math.cos(2 * Math.PI * random());
    previous = NOISE_CORRELATION * previous + innovation * gaussian;
    knots[k] = Math.max(-NOISE_LIMIT_MV, Math.min(NOISE_LIMIT_MV, previous));
  }
  return knots;
})();

const smoothstep = (x: number): number =>
  x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x);

/**
 * Recording noise (mV) at time t: zero on the calibration pulse and within
 * 35 ms of every R peak, fading in over the next 35 ms.
 */
export function noise(t: number, strip: readonly Beat[]): number {
  let envelope = smoothstep((t - NOISE_START) / NOISE_FADE_IN);
  for (const { r } of strip) {
    if (envelope === 0) return 0;
    envelope *= smoothstep((Math.abs(t - r) - NOISE_QUIET) / NOISE_FADE);
  }
  if (envelope === 0) return 0;
  const x = t / NOISE_STEP;
  const k = Math.floor(x);
  const f = x - k;
  return envelope * (NOISE_KNOTS[k] * (1 - f) + NOISE_KNOTS[k + 1] * f);
}

/**
 * Sample the trace from 0 to TRACE_END: every 2 ms, every 0.5 ms within 50 ms
 * of each R peak, and exact vertical edges on the calibration pulse. Pass
 * `noisy` for the drawn trace; measurements use the clean waveform.
 */
export function sampleTrace(
  strip: readonly Beat[],
  { noisy = false }: { noisy?: boolean } = {},
): Sample[] {
  const at = (t: number) => voltage(t, strip) + (noisy ? noise(t, strip) : 0);
  const times: number[] = [];
  const coarse = Math.round(TRACE_END / COARSE_STEP);
  for (let k = 0; k <= coarse; k += 1) times.push(k * COARSE_STEP);
  times.push(TRACE_END);

  const fine = Math.round(FINE_WINDOW / FINE_STEP);
  for (const { r } of strip) {
    for (let k = -fine; k <= fine; k += 1) times.push(r + k * FINE_STEP);
  }

  const edges = [CAL_START, CAL_END];
  const sorted = times
    .filter((t) => t >= 0 && t <= TRACE_END)
    .filter((t) => edges.every((e) => Math.abs(t - e) > 1e-9))
    .sort((a, b) => a - b)
    .filter((t, i, all) => i === 0 || t - all[i - 1] > 1e-9);

  const samples: Sample[] = [];
  let edge = 0;
  for (const t of sorted) {
    while (edge < edges.length && edges[edge] < t) {
      const e = edges[edge];
      samples.push([e, at(e - 1e-9)], [e, at(e)]);
      edge += 1;
    }
    samples.push([t, at(t)]);
  }
  return samples;
}

type Point = [x: number, y: number];

/** Ramer-Douglas-Peucker, iterative, keeping points flagged in `keep`. */
function simplify(points: Point[], tolerance: number, keep: Set<number>) {
  const retained = new Uint8Array(points.length);
  retained[0] = 1;
  retained[points.length - 1] = 1;
  for (const k of keep) retained[k] = 1;

  // Split at forced points so they always survive.
  const anchors = [...retained.keys()].filter((k) => retained[k]);
  const stack: Array<[number, number]> = [];
  for (let k = 1; k < anchors.length; k += 1) {
    stack.push([anchors[k - 1], anchors[k]]);
  }

  while (stack.length > 0) {
    const [a, b] = stack.pop() as [number, number];
    const [ax, ay] = points[a];
    const [bx, by] = points[b];
    const dx = bx - ax;
    const dy = by - ay;
    const length = Math.hypot(dx, dy);
    let worst = -1;
    let worstDistance = tolerance;
    for (let k = a + 1; k < b; k += 1) {
      const [px, py] = points[k];
      const distance =
        length === 0
          ? Math.hypot(px - ax, py - ay)
          : Math.abs(dy * (px - ax) - dx * (py - ay)) / length;
      if (distance > worstDistance) {
        worst = k;
        worstDistance = distance;
      }
    }
    if (worst !== -1) {
      retained[worst] = 1;
      stack.push([a, worst], [worst, b]);
    }
  }

  return points.filter((_, k) => retained[k]);
}

/** Format thousandths of a mm compactly: 50 -> ".05", -1250 -> "-1.25". */
function num(thousandths: number): string {
  const sign = thousandths < 0 ? '-' : '';
  const abs = Math.abs(thousandths);
  const whole = Math.floor(abs / 1000);
  const frac = String(abs % 1000)
    .padStart(3, '0')
    .replace(/0+$/, '');
  return `${sign}${whole || !frac ? whole : ''}${frac ? `.${frac}` : ''}`;
}

function pair(dx: number, dy: number): string {
  const y = num(dy);
  return `${num(dx)}${y.startsWith('-') ? '' : ' '}${y}`;
}

/**
 * SVG path data for the drawn (noisy) trace, simplified to within 0.004 mm
 * and written as relative moves. Deltas come from coordinates rounded to
 * 0.001 mm, so rounding never accumulates along the strip.
 */
export function tracePath(strip: readonly Beat[]): string {
  const samples = sampleTrace(strip, { noisy: true });
  const points: Point[] = samples.map(([t, v]) => [toX(t), toY(v)]);

  const keep = new Set<number>();
  samples.forEach(([t], k) => {
    if (strip.some((beat) => Math.abs(t - beat.r) < 1e-9)) keep.add(k);
    if (Math.abs(t - CAL_START) < 1e-9 || Math.abs(t - CAL_END) < 1e-9) {
      keep.add(k);
    }
  });

  const rounded = simplify(points, SIMPLIFY_MM, keep).map(
    ([x, y]) => [Math.round(x * 1000), Math.round(y * 1000)] as Point,
  );
  const [first, ...rest] = rounded;
  let path = `M${pair(first[0], first[1])}l`;
  let prev = first;
  rest.forEach((point, k) => {
    const step = pair(point[0] - prev[0], point[1] - prev[1]);
    path += k === 0 || step.startsWith('-') ? step : ` ${step}`;
    prev = point;
  });
  return path;
}

/** Grid lines: minor every 1 mm, major every 5 mm, as two path strings. */
export function gridPaths(): { minor: string; major: string } {
  let minor = '';
  let major = '';
  for (let x = 0; x <= STRIP_WIDTH_MM; x += 1) {
    const line = `M${x} 0V${STRIP_HEIGHT_MM}`;
    if (x % 5 === 0) major += line;
    else minor += line;
  }
  for (let y = 0; y <= STRIP_HEIGHT_MM; y += 1) {
    const line = `M0 ${y}H${STRIP_WIDTH_MM}`;
    if (y % 5 === 0) major += line;
    else minor += line;
  }
  return { minor, major };
}

export interface StripGeometry {
  trace: string;
  grid: { minor: string; major: string };
  /** Pen position at the end of the trace, in mm. */
  pen: { x: number; y: number };
  beats: Array<{
    /** R peak, mm. */
    x: number;
    /** Interactive region, mm. */
    hitStart: number;
    hitEnd: number;
  }>;
}

/** Everything the strip component needs, computed once at build time. */
export function buildStrip(count: number): StripGeometry {
  const strip = beats(count);
  return {
    trace: tracePath(strip),
    grid: gridPaths(),
    pen: {
      x: toX(TRACE_END),
      y: toY(voltage(TRACE_END, strip) + noise(TRACE_END, strip)),
    },
    beats: strip.map((beat) => ({
      x: toX(beat.r),
      hitStart: toX(beat.hitStart),
      hitEnd: toX(beat.hitEnd),
    })),
  };
}
