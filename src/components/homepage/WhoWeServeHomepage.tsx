import { Building2, Users, Home, Briefcase, ArrowRight } from "lucide-react";
import { Section } from "@/components/sections/Section";
import { SectionHeader } from "@/design-system/components";
import { Card } from "@/design-system/components/Card";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const clientSegments = [
  {
    icon: Briefcase,
    title: "General Contractors",
    description: "Trade partner for envelope and restoration scopes on commercial and multi-family projects across the GTA.",
    href: "/for-general-contractors",
    badge: "Trade Partner",
  },
  {
    icon: Building2,
    title: "Property Managers",
    description: "Reliable envelope maintenance and emergency restoration for multi-residential and commercial portfolios.",
    href: "/property-managers",
    badge: "Primary",
  },
  {
    icon: Users,
    title: "Commercial Owners",
    description: "Façade remediation and building envelope solutions for office buildings, retail strips, and industrial properties.",
    href: "/commercial-clients",
  },
  {
    icon: Home,
    title: "Homeowners",
    description: "Exterior restoration and interior renovation services for single-family homes across Ontario.",
    href: "/homeowners",
  },
];

const WhoWeServeHomepage = () => {
  return (
    <Section size="major" className="bg-muted/30">
      <div className="relative z-10">
        <SectionHeader
          badge="Who We Serve"
          title="Trusted Envelope & Restoration Partner"
          description="From general contractors seeking reliable trade partners to property managers protecting their portfolios—we deliver specialized envelope and restoration solutions across Ontario and the GTA."
          align="left"
          maxWidth="lg"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clientSegments.map((segment) => {
            const Icon = segment.icon;
            const content = (
              <Card
                variant="interactive"
                size="lg"
                className="h-full group"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-[var(--radius-sm)] bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold">{segment.title}</h3>
                        {segment.badge && (
                          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            {segment.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    {segment.description}
                  </p>
                  {segment.href && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                        Learn More
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            );

            if (segment.href) {
              return (
                <Link key={segment.title} to={segment.href} className="block">
                  {content}
                </Link>
              );
            }
            return <div key={segment.title}>{content}</div>;
          })}
        </div>
      </div>
    </Section>
  );
};

export default WhoWeServeHomepage;
