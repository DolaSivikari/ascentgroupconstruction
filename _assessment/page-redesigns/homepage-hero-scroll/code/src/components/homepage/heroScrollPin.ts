/**
 * Scroll maths for the homepage hero "scroll-out" (HeroScrollFrame).
 * Pure functions, so the behaviour is unit-tested without a browser.
 */

/** Desktop and laptop only; phones, tablets and short windows get the static layout. */
export const HERO_SCROLL_QUERY = "(min-width: 1024px) and (min-height: 640px)";

export type PinState = "before" | "pinned" | "after";

export interface PinFrame {
  state: PinState;
  /** 0 at the top of the pin, 1 when the visitor has scrolled through it. */
  progress: number;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/**
 * Where the hero stage sits for the pin wrapper's current position.
 * @param top            pinWrapper.getBoundingClientRect().top
 * @param pinHeight      pinWrapper.offsetHeight (100svh + scroll distance)
 * @param viewportHeight window.innerHeight
 */
export function computePin(
  top: number,
  pinHeight: number,
  viewportHeight: number,
): PinFrame {
  const distance = Math.max(1, pinHeight - viewportHeight);
  const travelled = -top;
  const progress = clamp01(travelled / distance);
  // At exactly 0 the hero sits at the top of the page either way; "before" avoids a needless switch to fixed.
  const state: PinState =
    top >= 0 ? "before" : travelled >= distance ? "after" : "pinned";
  return { state, progress };
}

export interface HeroScrollValues {
  /** 0..1: how far the video has shrunk into its framed panel (also darkens it). */
  frame: number;
  /** 1..0: opacity of the slide copy, buttons and controls. */
  content: number;
  /** px: the slide copy rises as it fades. */
  lift: number;
  /** 1..0: opacity of the "Scroll" cue. */
  cue: number;
  /** 0..1: opacity of the "Built to be documented" statement. */
  statement: number;
}

/** Same curves as the approved preview (homepage preview/index.html, heroScroll). */
export function heroScrollValues(progress: number): HeroScrollValues {
  const p = clamp01(progress);
  return {
    frame: 1 - (1 - p) ** 2,
    content: 1 - clamp01(p * 2.6),
    lift: -p * 60,
    cue: 1 - clamp01(p * 5),
    statement: clamp01((p - 0.4) * 2.5),
  };
}
