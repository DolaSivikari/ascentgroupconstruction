import { Shield } from "lucide-react";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";
import { useCountUpOnView } from "@/hooks/useCountUpOnView";
import { useStaggerAnimation } from "@/hooks/useStaggerAnimation";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export const HomepageProofStrip = () => {
  const prefersReducedMotion = useReducedMotion();
  const { ref: containerRef, isVisible, skipAnimation } = useScrollFadeIn({ threshold: 0.2 });
  const delays = useStaggerAnimation({ itemCount: 4, staggerDelay: 100 });
  const show = isVisible || skipAnimation || prefersReducedMotion;

  const { ref: yearsRef, displayValue: yearsValue } = useCountUpOnView({
    end: 15,
    suffix: "+",
    duration: 1800,
  });

  const { ref: selfPerfRef, displayValue: selfPerfValue } = useCountUpOnView({
    end: 85,
    suffix: "%",
    duration: 1800,
  });

  const stats = [
    {
      value: yearsValue,
      ref: yearsRef,
      label: "Years Crew Experience",
      isCountUp: true,
    },
    {
      value: selfPerfValue,
      ref: selfPerfRef,
      label: "Self-Performed Trades",
      isCountUp: true,
    },
    {
      value: "$2M",
      ref: null,
      label: "CGL Coverage",
      isCountUp: false,
    },
    {
      value: null,
      ref: null,
      label: "WSIB Compliant",
      isCountUp: false,
      isIcon: true,
    },
  ];

  return (
    <section className="bg-primary py-14 md:py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div
          ref={containerRef}
          className="flex flex-wrap justify-center items-center gap-12 md:gap-20"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center"
              style={{
                opacity: show ? 1 : 0,
                transform: show ? "translateY(0)" : "translateY(24px)",
                transition: prefersReducedMotion
                  ? "none"
                  : `opacity 300ms ease-out, transform 300ms ease-out`,
                transitionDelay: show ? `${delays[index] ?? 0}ms` : "0ms",
              }}
            >
              {stat.isIcon ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-white/70 uppercase tracking-widest">
                    {stat.label}
                  </span>
                </div>
              ) : (
                <>
                  {stat.isCountUp ? (
                    <span
                      ref={stat.ref as React.Ref<HTMLSpanElement>}
                      className="block text-4xl md:text-5xl font-bold text-white tabular-nums"
                    >
                      {stat.value}
                    </span>
                  ) : (
                    <span className="block text-4xl md:text-5xl font-bold text-white">
                      {stat.value}
                    </span>
                  )}
                  <span className="mt-2 block text-sm font-semibold text-white/70 uppercase tracking-widest">
                    {stat.label}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
