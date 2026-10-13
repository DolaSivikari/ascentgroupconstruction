import { useEffect, useRef, useState, type ReactNode } from "react";
import contentModule, { homeCommitment } from "@/content/pages/home-commitment";
import { restoreStructured } from "@/content/structured";
import { useResolvedContent } from "@/lib/content/store";
import {
  computePin,
  heroScrollValues,
  HERO_SCROLL_QUERY,
  type PinState,
} from "./heroScrollPin";
import "./hero-scroll-frame.css";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** Read synchronously on first render, so desktop never flips layout after mount (no CLS). */
function useMatchMedia(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia(query).matches
      : false,
  );
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const list = window.matchMedia(query);
    const onChange = () => setMatches(list.matches);
    onChange();
    list.addEventListener?.("change", onChange);
    return () => list.removeEventListener?.("change", onChange);
  }, [query]);
  return matches;
}

/**
 * Homepage hero scroll-out: while the visitor scrolls through half a screen, the hero video
 * shrinks into a framed panel and the "Built to be documented" statement fades in over it.
 *
 * The hero is pinned with JavaScript, not `position: sticky`, because `overflow-x: hidden` on
 * html/body/#root (src/index.css) disables sticky site-wide. If a transformed ancestor (e.g. the
 * PageTransition wrapper's retained animation) turns `position: fixed` into page-relative
 * positioning, the stage detects it once and pins with a transform instead.
 *
 * EnhancedHero itself is untouched apart from two marker attributes:
 * `data-hero-content` (slide copy) and `data-hero-scroll-cue` (the "Scroll" cue).
 */
export function HeroScrollFrame({ children }: { children: ReactNode }) {
  const wide = useMatchMedia(HERO_SCROLL_QUERY);
  const reducedMotion = useMatchMedia(REDUCED_MOTION_QUERY);
  const enabled = wide && !reducedMotion;
  const copy = restoreStructured(homeCommitment, useResolvedContent(contentModule));
  const pinRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const pin = pinRef.current;
    const stage = stageRef.current;
    if (!pin || !stage) return;

    let frameRequest = 0;
    let lastState: PinState | "" = "";
    let lastFaded: boolean | null = null;
    let useTransform = false;

    const update = () => {
      frameRequest = 0;
      const rect = pin.getBoundingClientRect();
      const { state, progress } = computePin(rect.top, pin.offsetHeight, window.innerHeight);
      const v = heroScrollValues(progress);

      if (state !== lastState) {
        lastState = state;
        stage.dataset.state = state;
        if (state === "pinned" && !useTransform) {
          // Layout is flushed here, so this reads the fixed position the browser applied.
          if (Math.abs(stage.getBoundingClientRect().top) > 1) {
            useTransform = true;
            stage.dataset.pin = "transform";
          }
        }
      }

      const s = stage.style;
      // Fallback pin: move the stage down by the distance scrolled, in the ancestor's (possibly scaled) units.
      const scale = pin.offsetHeight ? rect.height / pin.offsetHeight || 1 : 1;
      s.setProperty("--hsf-shift", useTransform && state === "pinned" ? `${-rect.top / scale}px` : "0px");
      s.setProperty("--hsf-frame", v.frame.toFixed(4));
      s.setProperty("--hsf-content", v.content.toFixed(4));
      s.setProperty("--hsf-lift", `${v.lift.toFixed(2)}px`);
      s.setProperty("--hsf-cue", v.cue.toFixed(4));
      s.setProperty("--hsf-statement", v.statement.toFixed(4));

      // Once the slide copy has faded it ignores pointer hits (CSS uses data-faded).
      const faded = v.content < 0.1;
      if (faded !== lastFaded) {
        lastFaded = faded;
        stage.dataset.faded = String(faded);
      }
    };

    const schedule = () => {
      if (!frameRequest) frameRequest = requestAnimationFrame(update);
    };

    // Keyboard users who tab onto a faded hero button are scrolled back to the hero, so the focused
    // control is visible. The copy stays in the accessibility tree (it holds the page's only h1).
    const onFocusIn = (event: FocusEvent) => {
      if (stage.dataset.faded !== "true") return;
      const content = stage.querySelector("[data-hero-content]");
      if (content && event.target instanceof Node && content.contains(event.target))
        window.scrollTo({ top: window.scrollY + pin.getBoundingClientRect().top, behavior: "auto" });
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    stage.addEventListener("focusin", onFocusIn);
    return () => {
      if (frameRequest) cancelAnimationFrame(frameRequest);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      stage.removeEventListener("focusin", onFocusIn);
    };
  }, [enabled]);

  const statement = (
    <div className="hsf-statement-inner">
      <p className="hsf-eyebrow">{copy.eyebrow}</p>
      <h2 id="hsf-title" className="hsf-title">
        {copy.title}
      </h2>
      <p className="hsf-body">{copy.body}</p>
      <ul className="hsf-points">
        {copy.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </div>
  );

  if (!enabled) {
    return (
      <>
        {children}
        <section className="hsf-static" aria-labelledby="hsf-title">
          {statement}
        </section>
      </>
    );
  }

  return (
    <div ref={pinRef} className="hsf" data-hero-scroll="">
      <div ref={stageRef} className="hsf-stage" data-state="before">
        <div className="hsf-frame">
          {children}
          <div className="hsf-shade" aria-hidden="true" />
        </div>
        <section className="hsf-statement" aria-labelledby="hsf-title">
          {statement}
        </section>
      </div>
    </div>
  );
}

export default HeroScrollFrame;
