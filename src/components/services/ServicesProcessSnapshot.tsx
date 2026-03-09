import { Section } from "@/components/sections/Section";
import { TYPOGRAPHY_STYLES } from "@/design-system/constants";
import { FileSearch, ClipboardList, Calculator, Truck } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: FileSearch,
    title: "Review Scope",
    description: "We review your drawings, specifications, or scope description to understand the work required.",
  },
  {
    step: "02",
    icon: ClipboardList,
    title: "Assess Site & Documents",
    description: "Site visit or document review to confirm conditions, access, phasing needs, and any constraints.",
  },
  {
    step: "03",
    icon: Calculator,
    title: "Price & Coordinate",
    description: "Detailed pricing by scope with clear inclusions, exclusions, and schedule expectations.",
  },
  {
    step: "04",
    icon: Truck,
    title: "Mobilize & Deliver",
    description: "Crews mobilize on schedule. Progress updates, quality checks, and organized closeout.",
  },
] as const;

export const ServicesProcessSnapshot = () => {
  return (
    <Section size="major">
      <div className="mb-12">
        <p className={`${TYPOGRAPHY_STYLES.label} text-accent mb-3`}>Our Process</p>
        <h2 className={`${TYPOGRAPHY_STYLES.sectionTitle} text-foreground mb-4`}>
          How We Engage
        </h2>
        <p className={`${TYPOGRAPHY_STYLES.bodyDefault} text-muted-foreground max-w-3xl`}>
          From scope review to project closeout — a clear, repeatable process for every engagement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {STEPS.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={s.step} className="relative">
              {/* Connector line (desktop only, not on last) */}
              {idx < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-[calc(100%_-_0.5rem)] w-[calc(100%_-_2.5rem)] h-px bg-border z-0" />
              )}
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 border-2 border-accent/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-accent">{s.step}</span>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-4.5 h-4.5 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
};
