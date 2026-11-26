/**
 * Test helper: loads the built homepage into jsdom and runs the inline script
 * it ships, with stand-ins for the browser APIs jsdom lacks.
 */
import { renderSite } from '../../render/site.ts';

export interface FakeAnimation {
  target: Element;
  keyframes: Keyframe[];
  onfinish: (() => void) | null;
  finish(): void;
}

/** Stands in for the strip's CSS print animations. */
export class FakeCSSAnimation {
  currentTime: number | null = 3400;
  playing = true;
  pause() {
    this.playing = false;
  }
  play() {
    this.playing = true;
  }
}

const html = renderSite()['index.html'];

export function loadHome({ reducedMotion = false } = {}) {
  const animations: FakeAnimation[] = [];
  const prints = [new FakeCSSAnimation(), new FakeCSSAnimation()];

  Object.assign(globalThis, { CSSAnimation: FakeCSSAnimation });
  window.matchMedia = ((query: string) => ({
    matches: reducedMotion && query.includes('reduce'),
    media: query,
  })) as unknown as typeof window.matchMedia;
  Element.prototype.animate = function (this: Element, keyframes) {
    const animation: FakeAnimation = {
      target: this,
      keyframes: keyframes as Keyframe[],
      onfinish: null,
      finish() {
        this.onfinish?.();
      },
    };
    animations.push(animation);
    return animation as unknown as Animation;
  };
  Element.prototype.getAnimations = () => prints as unknown as Animation[];
  Element.prototype.setPointerCapture = () => {};

  const page = new DOMParser().parseFromString(html, 'text/html');
  document.body.innerHTML = page.body.innerHTML;
  const script = [...page.querySelectorAll('script:not([type])')]
    .map((s) => s.textContent)
    .join('\n');
  new Function(script)();

  return { animations, prints };
}
