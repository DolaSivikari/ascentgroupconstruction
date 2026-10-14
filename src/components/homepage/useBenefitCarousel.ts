import { useEffect, useRef, useState } from "react";

export const BENEFIT_ROTATION_MS = 12000;
const cardCount = () =>
  typeof window === "undefined"
    ? 1
    : window.matchMedia("(min-width: 1024px)").matches
      ? 3
      : window.matchMedia("(min-width: 640px)").matches
        ? 2
        : 1;

export function useBenefitCarousel(
  clientCount: number,
  ownerCount: number,
  reducedMotion: boolean,
) {
  const ref = useRef<HTMLElement>(null);
  const [cardsPerSlide, setCardsPerSlide] = useState(cardCount);
  const count =
    Math.ceil(clientCount / cardsPerSlide) +
    Math.ceil(ownerCount / cardsPerSlide);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reading, setReading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(
    () => typeof document !== "undefined" && document.hidden,
  );
  const active = Math.min(index, Math.max(0, count - 1));

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const tablet = window.matchMedia("(min-width: 640px)");
    const resize = () => {
      setCardsPerSlide(cardCount());
      setIndex(0);
    };
    desktop.addEventListener("change", resize);
    tablet.addEventListener("change", resize);
    return () => {
      desktop.removeEventListener("change", resize);
      tablet.removeEventListener("change", resize);
    };
  }, []);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            ([entry]) => setVisible(entry.isIntersecting),
            { threshold: 0.2 },
          );
    observer?.observe(section);
    const visibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  const running =
    count > 1 &&
    visible &&
    !hidden &&
    !paused &&
    !hovered &&
    !focused &&
    !reading &&
    !reducedMotion;
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(
      () => setIndex((active + 1) % count),
      BENEFIT_ROTATION_MS,
    );
    return () => window.clearTimeout(timer);
  }, [active, count, running]);

  const select = (next: number) => {
    setPaused(true);
    setIndex((next + count) % count);
  };
  return {
    ref,
    cardsPerSlide,
    active,
    running,
    paused,
    setPaused,
    setHovered,
    setFocused,
    setReading,
    select,
  };
}
