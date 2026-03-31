import { Link } from "react-router-dom";
import { Shield, Users, Award, FileText } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface StatItem {
  icon: typeof Shield;
  numericValue: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

const stats: StatItem[] = [
  { icon: Shield, numericValue: 2, prefix: "$", suffix: "M Insured", label: "CGL Coverage" },
  { icon: Users, numericValue: 15, suffix: "+ Years", label: "Crew Experience" },
  { icon: Award, numericValue: 0, suffix: "", label: "Active Clearance" },
];

const useCountUp = (target: number, duration: number, start: boolean, rm: boolean) => {
  const [value, setValue] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!start || hasRun.current || rm) {
      if (rm) setValue(target);
      return;
    }
    hasRun.current = true;
    if (target === 0) { setValue(0); return; }

    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * target);
      if (progress < 1) requestAnimationFrame(animate);
      else setValue(target);
    };
    requestAnimationFrame(animate);
  }, [start, target, duration, rm]);

  return value;
};

export const HomepageProofStrip = () => {
  const rm = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setIsVisible(true); },
      { threshold: 0.4 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const val0 = useCountUp(stats[0].numericValue, 1600, isVisible, rm);
  const val1 = useCountUp(stats[1].numericValue, 1600, isVisible, rm);
  const values = [val0, val1, 0];

  return (
    <section className="pt-10 pb-2">
      <div className="container mx-auto px-4">
        <div
          ref={ref}
          className="rounded-[var(--radius-lg)] py-8 px-6 bg-muted/50 border border-border"
        >
          <div className="grid gap-6 text-center grid-cols-1 sm:grid-cols-3">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const isWSIB = index === 2;
              return (
                <div key={index} className="flex flex-col items-center gap-1">
                  <Icon className="w-5 h-5 mb-1 text-primary" aria-hidden="true" />
                  <p className="text-xl md:text-2xl font-bold tabular-nums">
                    {isWSIB
                      ? "WSIB Compliant"
                      : `${stat.prefix || ""}${Math.round(values[index])}${stat.suffix || ""}`}
                  </p>
                  <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-border/60 text-center">
            <Link
              to="/prequalification"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              Download Prequal Package
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
