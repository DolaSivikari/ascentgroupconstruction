import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * AnimatedScrollIndicator — pulsing vertical line + "SCROLL" label.
 *
 * Render-gated to viewports ≥ 800px tall. On short laptops/tablets the hero
 * already shares space with the next section, and an animated cue there reads
 * as patronizing. One mount-time check, no listeners needed beyond the initial
 * read.
 *
 * Reduced-motion: renders static line + label, no pulse/bounce.
 */
export const AnimatedScrollIndicator = () => {
  const prefersReducedMotion = useReducedMotion();
  const [tallEnough, setTallEnough] = useState(false);

  useEffect(() => {
    const check = () => setTallEnough(window.innerHeight >= 800);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!tallEnough) return null;

  const animated = !prefersReducedMotion;

  return (
    <div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 pointer-events-none"
      aria-hidden="true"
    >
      <span
        className={`text-xs font-medium tracking-[0.25em] uppercase text-white/70 ${
          animated ? "animate-[scroll-label-bounce_2.4s_ease-in-out_infinite]" : ""
        }`}
      >
        Scroll
      </span>
      <span className="relative block h-8 w-px overflow-hidden bg-white/15">
        <span
          className={`absolute inset-x-0 top-0 block h-full w-px bg-white/80 ${
            animated ? "animate-[scroll-line-pulse_2.4s_cubic-bezier(0.22,1,0.36,1)_infinite]" : ""
          }`}
        />
      </span>

      <style>{`
        @keyframes scroll-label-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.7; }
          50% { transform: translateY(-3px); opacity: 1; }
        }
        @keyframes scroll-line-pulse {
          0% { transform: translateY(-100%); }
          60% { transform: translateY(100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
};
