import { useEffect, type RefObject } from "react";

/** Updates only the media mask; scroll never changes React state or the video source. */
export function useHeroScrollFrame(
  wrapperRef: RefObject<HTMLDivElement>,
  heroRef: RefObject<HTMLElement>,
  reducedMotion: boolean,
) {
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const hero = heroRef.current;
    if (!wrapper || !hero) return;

    const reset = () => {
      wrapper.dataset.frameMode = "off";
      delete wrapper.dataset.framePosition;
      wrapper.style.removeProperty("--hero-frame-progress");
      wrapper.style.removeProperty("--hero-frame-distance");
      wrapper.style.removeProperty("--hero-frame-height");
      wrapper.style.removeProperty("--hero-frame-offset");
    };
    // Check the preference immediately as the shared hook settles its initial value.
    if (
      reducedMotion ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !CSS.supports("clip-path", "inset(0 round 1px)")
    ) {
      reset();
      return;
    }

    let frame = 0;
    let distance = 1;
    let previousProgress = "";
    const update = () => {
      frame = 0;
      const top = wrapper.getBoundingClientRect().top;
      const progress = Math.max(0, Math.min(1, -top / distance));
      // Move within reserved space: root overflow and route transforms can break sticky/fixed.
      wrapper.dataset.framePosition =
        top >= 0 ? "before" : progress < 1 ? "during" : "after";
      wrapper.style.setProperty(
        "--hero-frame-offset",
        `${progress * distance}px`,
      );
      const eased = (1 - (1 - progress) ** 2).toFixed(4);
      if (eased !== previousProgress) {
        wrapper.style.setProperty("--hero-frame-progress", eased);
        previousProgress = eased;
      }
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const measure = () => {
      distance = Math.max(1, window.innerHeight * 0.5);
      // Never pin content taller than the viewport: all controls must remain reachable.
      const height = hero.getBoundingClientRect().height;
      const fits = height <= window.innerHeight;
      wrapper.dataset.frameMode = fits ? "pinned" : "flow";
      wrapper.style.setProperty("--hero-frame-height", `${height}px`);
      wrapper.style.setProperty(
        "--hero-frame-distance",
        `${fits ? distance : 0}px`,
      );
      schedule();
    };

    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(measure);
    observer?.observe(hero);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    measure();
    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      window.cancelAnimationFrame(frame);
      reset();
    };
  }, [wrapperRef, heroRef, reducedMotion]);
}
