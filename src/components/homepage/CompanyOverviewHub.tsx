import { useRef } from "react";
import { CheckCircle, Target } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useCompanyOverview } from "@/hooks/useCompanyOverview";
import { Section } from "@/components/sections/Section";
import { SectionHeader } from "@/design-system/components";
import { Card } from "@/design-system/components/Card";

// Fallback data — preserved from CMS-wired implementation
const fallbackApproach = [
  "Detailed site assessment and project planning",
  "Transparent pricing with no hidden costs",
  "Dedicated project manager for seamless coordination",
  "Premium materials from trusted suppliers",
  "Rigorous quality control at every phase",
  "Comprehensive warranties and ongoing support",
];

const fallbackValues = [
  { icon: "Shield", title: "Safety First", description: "Comprehensive safety protocols and training for every project, ensuring zero-incident worksites." },
  { icon: "Award", title: "Quality Craftsmanship", description: "Premium materials and skilled trades deliver results that exceed industry standards." },
  { icon: "Lightbulb", title: "Innovation", description: "Latest techniques and sustainable solutions for modern construction challenges." },
  { icon: "Heart", title: "Client Partnership", description: "Transparent communication and dedicated support throughout your project journey." },
];

const fallbackPromise = [
  { title: "On-Time Delivery", description: "We respect your schedule with efficient project management and clear timelines." },
  { title: "Budget Certainty", description: "Detailed estimates upfront with no surprise costs or change orders." },
  { title: "Quality Guarantee", description: "Comprehensive warranties backed by 15+ years of team experience." },
  { title: "Safety Compliance", description: "WSIB certified with strict adherence to all safety regulations." },
];

const CompanyOverviewHub = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  useIntersectionObserver(sectionRef, { threshold: 0.2 });
  
  const { sections, items } = useCompanyOverview();
  
  const getItemsForSection = (sectionType: string) => {
    const section = sections.find(s => s.section_type === sectionType);
    if (!section) return [];
    return items.filter(item => item.section_id === section.id);
  };
  
  const approachItems = getItemsForSection("approach");
  const valuesItems = getItemsForSection("values");
  const promiseItems = getItemsForSection("promise");
  
  const OUR_APPROACH = approachItems.length > 0 ? approachItems.map(i => i.content) : fallbackApproach;
  const COMPANY_VALUES = valuesItems.length > 0 
    ? valuesItems.map(i => ({ icon: i.icon_name || "Shield", title: i.title || "", description: i.content }))
    : fallbackValues;
  const OUR_PROMISE = promiseItems.length > 0
    ? promiseItems.map(i => ({ title: i.title || "", description: i.content }))
    : fallbackPromise;

  const hasApproach = OUR_APPROACH.length > 0;
  const hasValues = COMPANY_VALUES.length > 0;
  const hasPromise = OUR_PROMISE.length > 0;

  return (
    <div ref={sectionRef}>
      <Section size="major" className="bg-gradient-to-b from-muted/40 to-background">
        <SectionHeader
          title="Your Envelope, Restoration & Interior Trades Partner"
          description="From building envelope systems to specialty restoration, we deliver focused trade execution with the expertise, safety standards, and quality you expect."
          align="left"
          maxWidth="lg"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Our Approach Column */}
          {hasApproach && (
            <Card variant="default" size="lg" className="h-full border-t-4 border-t-primary">
              <h3 className="text-lg font-bold uppercase tracking-wider text-primary mb-6">Our Approach</h3>
              <div className="space-y-4">
                {OUR_APPROACH.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Our Values Column */}
          {hasValues && (
            <Card variant="elevated" size="lg" className="h-full bg-primary text-primary-foreground">
              <h3 className="text-lg font-bold uppercase tracking-wider mb-6">Our Values</h3>
              <div className="space-y-5">
                {COMPANY_VALUES.map((value, index) => {
                  const Icon = (LucideIcons as any)[value.icon] || LucideIcons.Shield;
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-[var(--radius-sm)] bg-primary-foreground/15 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-0.5">{value.title}</p>
                        <p className="text-xs text-primary-foreground/80 leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Our Promise Column */}
          {hasPromise && (
            <Card variant="default" size="lg" className="h-full border-t-4 border-t-accent">
              <h3 className="text-lg font-bold uppercase tracking-wider text-foreground mb-6">Our Promise</h3>
              <div className="space-y-5">
                {OUR_PROMISE.map((promise, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold mb-0.5">{promise.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{promise.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </Section>
    </div>
  );
};

export default CompanyOverviewHub;
