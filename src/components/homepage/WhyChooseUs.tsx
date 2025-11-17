import * as LucideIcons from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/ui/Button";
import { Link } from "react-router-dom";
import { useWhyChooseUs } from "@/hooks/useWhyChooseUs";

// Fallback data with construction-specific icons
const fallbackDifferentiators = [
  { icon: "Shield", title: "Licensed & Certified", desc: "Fully licensed and insured with $5M liability coverage, WSIB compliant, and municipally licensed across the Greater Toronto Area. Proven track record with 500+ successful commercial and residential projects.", stats: "500+ Projects Completed" },
  { icon: "Building", title: "Comprehensive Services", desc: "Complete construction solutions from envelope restoration to specialty trades. Single point of contact eliminates coordination complexity and streamlines project delivery.", stats: "21+ Service Offerings" },
  { icon: "Award", title: "Premium Materials", desc: "Authorized contractor for industry-leading brands with extended manufacturer warranties. Premium materials and proven installation methods ensure lasting quality and performance.", stats: "Extended Warranties" },
  { icon: "Calendar", title: "On-Time Delivery", desc: "Dedicated project management with transparent pricing and detailed estimates. Our systematic approach maintains a 95% on-time completion rate across all projects.", stats: "95% On-Time Rate" },
  { icon: "HardHat", title: "Expert Team", desc: "OSHA certified crews with continuous training and comprehensive safety protocols. Zero-incident safety record backed by full liability coverage on every project.", stats: "OSHA Certified" },
  { icon: "Hammer", title: "Quality Standards", desc: "Rigorous quality control processes and industry-leading best practices ensure exceptional results. Every project meets or exceeds regulatory requirements and client expectations.", stats: "ISO-Compliant Processes" },
];

const WhyChooseUs = () => {
  const { data: items, isLoading } = useWhyChooseUs();
  
  const differentiators = items && items.length > 0 
    ? items.map(item => ({
        icon: item.icon_name || "BadgeCheck",
        title: item.title,
        desc: item.description,
        stats: item.stats_badge || "",
      }))
    : fallbackDifferentiators;
  return (
    <section className="py-20 md:py-24 bg-muted/30">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl">
        
        {/* Section Header - Enterprise Style */}
        <div className="max-w-3xl mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            Why Property Owners Choose Us
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            With over 15 years of proven expertise serving Ontario, we deliver exceptional construction results through licensed professionals, complete services, and unwavering commitment to quality.
          </p>
        </div>

        {/* Cards Grid - Clean 3-Column Layout */}
        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {differentiators.map((item, index) => {
              const Icon = (LucideIcons as any)[item.icon] || LucideIcons.BadgeCheck;
              return (
              <Card
                key={index}
                variant="elevated"
                className="h-full hover-subtle group"
              >
                <div className="p-8 h-full flex flex-col">
                  {/* Icon with Steel Blue Accent */}
                  <div className="w-14 h-14 rounded-lg bg-steel-blue/10 flex items-center justify-center mb-6 group-hover:bg-steel-blue/20 transition-colors hover-scale-icon">
                    <Icon className="w-7 h-7 text-steel-blue" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold mb-4 text-foreground leading-tight">
                      {item.title}
                    </h3>
                    
                    <p className="text-base text-muted-foreground mb-6 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  {/* Stats Badge */}
                  <div className="pt-6 border-t border-border">
                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-steel-blue">
                      {item.stats}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        )}

        {/* Bottom CTA Section - Professional Design */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-primary/20 bg-background">
            <div className="p-8 lg:p-12 text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                Ready to Start Your Project?
              </h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Get a detailed proposal for your construction project with transparent pricing and comprehensive scope documentation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="primary" className="min-w-[200px]">
                  <Link to="/contact">Request Site Assessment</Link>
                </Button>
                <Button asChild size="lg" variant="secondary" className="min-w-[200px]">
                  <Link to="/projects">View Portfolio</Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
