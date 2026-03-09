import { Shield, Users, Award } from "lucide-react";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";
import { useCountUpOnView } from "@/hooks/useCountUpOnView";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export const TrustBadgeBar = () => {
  const prefersReducedMotion = useReducedMotion();
  const { ref: sectionRef, isVisible, skipAnimation } = useScrollFadeIn({ threshold: 0.3 });
  const show = isVisible || skipAnimation || prefersReducedMotion;

  const { ref: yearsRef, displayValue: yearsValue } = useCountUpOnView({
    end: 15,
    suffix: "+",
    duration: 1500,
  });

  const { ref: insuredRef, displayValue: insuredValue } = useCountUpOnView({
    end: 2,
    prefix: "$",
    suffix: "M",
    duration: 1200,
  });

  return (
    <section
      ref={sectionRef as React.Ref<HTMLElement>}
      className="py-6 bg-muted/30 border-y border-border/50"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(16px)",
        transition: prefersReducedMotion
          ? "none"
          : "opacity 300ms ease-out, transform 300ms ease-out",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {/* $2M Insured */}
          <div className="flex items-center gap-3 text-center">
            <div className="p-2 rounded-full bg-primary/10">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm text-foreground">
                <span ref={insuredRef as React.Ref<HTMLSpanElement>}>{insuredValue}</span>
                {" "}Insured
              </div>
              <div className="text-xs text-muted-foreground">CGL Coverage</div>
            </div>
          </div>

          {/* 15+ Years */}
          <div className="flex items-center gap-3 text-center">
            <div className="p-2 rounded-full bg-primary/10">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm text-foreground">
                <span ref={yearsRef as React.Ref<HTMLSpanElement>}>{yearsValue}</span>
                {" "}Years
              </div>
              <div className="text-xs text-muted-foreground">Crew Experience</div>
            </div>
          </div>

          {/* WSIB Compliant — static */}
          <div className="flex items-center gap-3 text-center">
            <div className="p-2 rounded-full bg-primary/10">
              <Award className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm text-foreground">WSIB Compliant</div>
              <div className="text-xs text-muted-foreground">Active Clearance</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
