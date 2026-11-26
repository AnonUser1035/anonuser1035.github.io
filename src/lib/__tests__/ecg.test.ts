import { describe, expect, it } from 'vitest';

import { MILESTONES } from '@/data/content';
import {
  beats,
  buildStrip,
  CAL_END,
  CAL_START,
  R_MARKER_Y,
  rrIntervals,
  type Sample,
  sampleTrace,
  TRACE_END,
  toX,
  tracePath,
} from '../ecg';

const LISTED_R_PEAKS = [
  0.85, 1.916, 2.947, 3.917, 4.799, 5.577, 6.267, 6.896, 7.49, 8.066, 8.634,
  9.198,
];

const strip = beats(12);
const samples = sampleTrace(strip);

/** Threshold for leaving the isoelectric line, as a reader would by eye. */
const THRESHOLD_MV = 0.01;

function inWindow(from: number, to: number, s = samples): Sample[] {
  return s.filter(([t]) => t >= from && t <= to);
}

function firstAbove(from: number, to: number, s = samples): number {
  const hit = inWindow(from, to, s).find(([, v]) => Math.abs(v) > THRESHOLD_MV);
  if (!hit) throw new Error(`No deflection between ${from} and ${to}`);
  return hit[0];
}

function lastAbove(from: number, to: number, s = samples): number {
  const hit = inWindow(from, to, s)
    .reverse()
    .find(([, v]) => Math.abs(v) > THRESHOLD_MV);
  if (!hit) throw new Error(`No deflection between ${from} and ${to}`);
  return hit[0];
}

/** Measure each beat from the sampled trace alone. */
function measure(s = samples) {
  const peaks = s.filter(
    ([t, v], k) =>
      v > 0.5 && t > CAL_END && v >= s[k - 1][1] && v > s[k + 1][1],
  );

  return peaks.map(([r, rMv], i) => {
    const prevR = peaks[i - 1]?.[0];
    const nextR = peaks[i + 1]?.[0];
    const rr = prevR === undefined ? peaks[1][0] - r : r - prevR;

    const pOnset = firstAbove(r - 0.3, r - 0.08, s);
    const qrsOnset = firstAbove(r - 0.08, r, s);
    const qrsOffset = lastAbove(r, r + 0.08, s);
    const tEnd = lastAbove(r + 0.08, nextR ? nextR - 0.3 : TRACE_END, s);
    const sMv = Math.min(...inWindow(r, r + 0.05, s).map(([, v]) => v));

    const qt = tEnd - qrsOnset;
    return {
      r,
      rMv,
      sMv,
      rate: 60 / rr,
      pr: pOnset === undefined ? 0 : qrsOnset - pOnset,
      qrs: qrsOffset - qrsOnset,
      qtc: qt / Math.sqrt(rr),
      tEnd,
    };
  });
}

const measured = measure();

describe('rhythm', () => {
  it('has 12 R peaks at the listed times, within 1 ms', () => {
    expect(measured).toHaveLength(12);
    measured.forEach(({ r }, i) => {
      expect(Math.abs(r - LISTED_R_PEAKS[i])).toBeLessThan(0.001);
    });
  });

  it('accelerates from 56 to 106 bpm', () => {
    const rates = rrIntervals(12).map((rr) => 60 / rr);
    expect(rates[0]).toBeCloseTo(56.3, 1);
    expect(rates[rates.length - 1]).toBeCloseTo(106.5, 1);
    for (let k = 1; k < rates.length; k += 1) {
      expect(rates[k]).toBeGreaterThan(rates[k - 1]);
    }
  });

  it('ends every T wave before the trace stops', () => {
    expect(measured[11].tEnd).toBeLessThan(TRACE_END);
    expect(strip[11].tEnd).toBeLessThan(TRACE_END);
  });

  it('keeps other milestone counts inside the 10-second strip and rate limits', () => {
    for (const count of [10, 11, 13, 14]) {
      const rates = rrIntervals(count).map((rr) => 60 / rr);
      expect(Math.min(...rates)).toBeGreaterThanOrEqual(50);
      expect(Math.max(...rates)).toBeLessThanOrEqual(110);
      const other = beats(count);
      expect(other[count - 1].r).toBeCloseTo(LISTED_R_PEAKS[11], 3);
      expect(other[count - 1].tEnd).toBeLessThan(TRACE_END);
    }
    expect(() => rrIntervals(30)).toThrow();
  });
});

type Measured = ReturnType<typeof measure>[number];

function expectClinicalRanges(m: Measured) {
  expect(m.pr).toBeGreaterThanOrEqual(0.15);
  expect(m.pr).toBeLessThanOrEqual(0.165);
  expect(m.qrs).toBeGreaterThanOrEqual(0.075);
  expect(m.qrs).toBeLessThanOrEqual(0.085);
  expect(m.qtc).toBeGreaterThanOrEqual(0.37);
  expect(m.qtc).toBeLessThanOrEqual(0.385);
  expect(m.rMv).toBeCloseTo(1.3, 2);
  expect(m.sMv).toBeCloseTo(-0.21, 2);
}

describe(`the site's strip (${MILESTONES.length} milestones)`, () => {
  const siteStrip = beats(MILESTONES.length);
  const siteMeasured = measure(sampleTrace(siteStrip));

  it('draws one R peak per milestone, between 50 and 110 bpm', () => {
    expect(siteMeasured).toHaveLength(MILESTONES.length);
    for (const { rate } of siteMeasured) {
      expect(rate).toBeGreaterThanOrEqual(50);
      expect(rate).toBeLessThanOrEqual(110);
    }
    expect(siteStrip.at(-1)?.tEnd).toBeLessThan(TRACE_END);
  });

  it.each(
    siteMeasured.map((m, i) => [i + 1, m]),
  )('beat %i reads as normal sinus', (_, m) => expectClinicalRanges(m));
});

describe('waveform measurements', () => {
  it.each(measured.map((m, i) => [i + 1, m]))('beat %i', (_, m) => {
    expect(m.pr).toBeGreaterThanOrEqual(0.15);
    expect(m.pr).toBeLessThanOrEqual(0.165);
    expect(m.qrs).toBeGreaterThanOrEqual(0.075);
    expect(m.qrs).toBeLessThanOrEqual(0.085);
    expect(m.qtc).toBeGreaterThanOrEqual(0.37);
    expect(m.qtc).toBeLessThanOrEqual(0.385);
    expect(m.rMv).toBeCloseTo(1.3, 2);
    expect(m.sMv).toBeCloseTo(-0.21, 2);
  });

  it('holds the baseline at exactly 0 mV in PR, ST and TP segments', () => {
    strip.forEach((beat, i) => {
      const segments = [
        [beat.pStart - 0.04, beat.pStart - 0.001], // TP before P
        [beat.r - 0.1, beat.r - 0.07], // PR
        [beat.r + 0.075, beat.r + 0.09], // ST
      ];
      if (i === 0) segments[0] = [CAL_END + 0.001, beat.pStart - 0.001];
      for (const [from, to] of segments) {
        for (const [, v] of inWindow(from, to)) expect(v).toBe(0);
      }
    });
  });
});

describe('calibration pulse', () => {
  it('is 1 mV for 200 ms with vertical edges', () => {
    const at = (t: number) =>
      samples.filter(([s]) => s === t).map(([, v]) => v);
    expect(at(CAL_START)).toEqual([0, 1]);
    expect(at(CAL_END)).toEqual([1, 0]);
    for (const [, v] of inWindow(CAL_START + 0.001, CAL_END - 0.001)) {
      expect(v).toBe(1);
    }
  });

  it('draws as 10 mm by 5 mm on the strip', () => {
    expect(tracePath(strip).startsWith('M0 20l5 0 0-10 5 0 0 10')).toBe(true);
  });
});

describe('strip geometry', () => {
  const geometry = buildStrip(12);

  it('puts the marker exactly on each R peak', () => {
    geometry.beats.forEach((beat, i) => {
      expect(beat.x).toBeCloseTo(toX(strip[i].r), 6);
    });
    expect(R_MARKER_Y).toBe(7);
  });

  it('tiles the strip with contiguous hit areas ending at the pen', () => {
    const [first] = geometry.beats;
    expect(first.hitStart).toBeCloseTo(toX(strip[0].pStart - 0.1), 6);
    for (let k = 1; k < geometry.beats.length; k += 1) {
      const prev = strip[k - 1];
      const beat = strip[k];
      expect(geometry.beats[k].hitStart).toBe(geometry.beats[k - 1].hitEnd);
      expect(geometry.beats[k].hitStart).toBeCloseTo(
        toX((prev.tEnd + beat.pStart) / 2),
        6,
      );
    }
    expect(geometry.beats[11].hitEnd).toBeCloseTo(geometry.pen.x, 6);
    expect(geometry.pen).toEqual({ x: toX(TRACE_END), y: 20 });
  });

  it('keeps the path compact enough to inline', () => {
    expect(geometry.trace.length).toBeLessThan(16000);
  });
});
