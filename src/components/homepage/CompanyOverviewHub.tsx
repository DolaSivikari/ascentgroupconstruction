import { useRef } from "react";
import { CheckCircle, Target } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useCompanyOverview } from "@/hooks/useCompanyOverview";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";

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
  const { ref: headerRef, isVisible: headerVisible, skipAnimation: headerSkip } =
    useScrollFadeIn();
  const showHeader = headerVisible || headerSkip || prefersReducedMotion;

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

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-28 lg:py-32 px-4 bg-gradient-to-b from-background to-muted/30"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-12"
          style={{
            opacity: showHeader ? 1 : 0,
            transform: showHeader ? "translateY(0)" : "translateY(24px)",
            transition: prefersReducedMotion
              ? "none"
              : "opacity 300ms ease-out, transform 300ms ease-out",
          }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Your Envelope, Restoration & Interior Trades Partner
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            From building envelope systems to specialty restoration, we deliver focused trade execution
            with the expertise, safety standards, and quality you expect.
          </p>
        </div>

        {/* Our Approach */}
        <div className="bg-card rounded-[var(--radius-lg)] p-8 md:p-12 border mb-8">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
              How We Deliver Excellence
            </h3>
            <p className="text-muted-foreground mb-8 text-lg">
              Our proven process ensures every project is completed to the highest standards,
              on time and within budget.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {OUR_APPROACH.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  style={prefersReducedMotion ? undefined : { animationDelay: `${index * 80}ms` }}
                >
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="bg-card rounded-[var(--radius-lg)] p-8 md:p-12 border mb-8">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-foreground text-center">
              Built on Core Values
            </h3>
            <p className="text-muted-foreground mb-10 text-lg text-center">
              These principles guide every decision we make and every project we undertake.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {COMPANY_VALUES.map((value, index) => {
                const Icon = (LucideIcons as any)[value.icon] || LucideIcons.Shield;
                return (
                  <div
                    key={index}
                    className="p-6 rounded-[var(--radius-lg)] bg-gradient-to-br from-muted/50 to-muted border hover:border-primary/50 transition-all hover:shadow-[var(--shadow-lg)] group"
                    style={prefersReducedMotion ? undefined : { animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold mb-2 text-foreground">
                          {value.title}
                        </h4>
                        <p className="text-muted-foreground">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Our Promise */}
        <div className="bg-card rounded-[var(--radius-lg)] p-8 md:p-12 border">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-foreground text-center">
              Our Commitment to You
            </h3>
            <p className="text-muted-foreground mb-10 text-lg text-center">
              When you partner with us, you get guarantees that matter.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {OUR_PROMISE.map((promise, index) => (
                <div
                  key={index}
                  className="p-6 rounded-[var(--radius-lg)] bg-muted/30 border hover:border-primary/50 transition-all hover:shadow-[var(--shadow-md)]"
                  style={prefersReducedMotion ? undefined : { animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <Target className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <h4 className="text-xl font-semibold text-foreground">
                      {promise.title}
                    </h4>
                  </div>
                  <p className="text-muted-foreground ml-8">
                    {promise.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyOverviewHub;
