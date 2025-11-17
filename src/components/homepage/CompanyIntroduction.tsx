import { Button } from "@/ui/Button";
import { ArrowRight, Building, HardHat, Award, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { organizationSchema } from "@/utils/structured-data";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { Section } from "@/components/sections/Section";

export default function CompanyIntroduction() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal({ threshold: 0.2 });
  const { ref: contentRef, isVisible: contentVisible } = useScrollReveal({ threshold: 0.1 });
  const { ref: highlightsRef, isVisible: highlightsVisible } = useScrollReveal({ threshold: 0.1 });
  
  const schema = organizationSchema({
    name: "Ascent Group Construction",
    description: "Lead/specialty contractor for building envelope & restoration in Toronto (GTA) — façade remediation, waterproofing, sealants, EIFS/stucco, masonry, concrete & parking-garage repair.",
    url: typeof window !== "undefined" ? window.location.origin : "",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Section 
        size="major" 
        className="bg-gradient-to-b from-background via-construction-orange/5 to-background relative overflow-hidden"
      >
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(30deg,transparent_24%,rgba(251,113,29,0.1)_25%,rgba(251,113,29,0.1)_26%,transparent_27%,transparent_74%,rgba(251,113,29,0.1)_75%,rgba(251,113,29,0.1)_76%,transparent_77%,transparent)] bg-[length:55px_96px]" />
        </div>
        
        <div className="relative z-10">
          
          {/* Section Header */}
          <div 
            ref={headerRef}
            className={cn(
              "max-w-4xl mb-12 transition-all duration-700",
              headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <SectionBadge 
              icon={Building} 
              text="About Ascent Group" 
              className={cn(
                "transition-all duration-700",
                headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
            />
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Building Envelope & Restoration Specialists in Toronto (GTA)
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              Lead contractor for envelope and exterior restoration—planning, self-performing, and delivering accountable results across the GTA and Golden Horseshoe.
            </p>
          </div>

          {/* Main Content */}
          <div 
            ref={contentRef}
            className={cn(
              "mb-16 transition-all duration-700",
              contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
            style={{ transitionDelay: '100ms' }}
          >
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Left column */}
              <div className="space-y-6">
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  <span className="text-foreground font-semibold">Ascent Group Construction</span> protects buildings from water intrusion, façade deterioration, and structural wear. We act as the <span className="text-foreground font-semibold">lead contractor</span> for envelope and exterior restoration scopes—planning access and safety, self‑performing the core trades, and communicating clearly from <span className="text-foreground font-semibold">site walk to closeout</span>.
                </p>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  <span className="text-foreground font-semibold">Envelope is our focus—this is all we do.</span> From assessment and scope development to submittals, sequencing, and turnover, we follow consultant/EOR details and manufacturer requirements.
                </p>
              </div>
              
              {/* Right column */}
              <div className="space-y-6">
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  We <span className="text-foreground font-semibold">self‑perform key trades</span>—sealants/caulking, EIFS & stucco, masonry repairs and tuckpointing, waterproofing & protective coatings, concrete and <span className="text-foreground font-semibold">parking‑garage rehabilitation</span>—coordinating trusted partners only when needed.
                </p>
                <p className="text-base text-muted-foreground leading-relaxed">
                  We work safely in <span className="text-foreground font-semibold">occupied buildings</span>, document progress with <span className="text-foreground font-semibold">photo logs</span>, and provide <span className="text-foreground font-semibold">applicable manufacturer and workmanship warranties</span>.
                </p>
              </div>
            </div>

            {/* Key Highlights - Modern Card Grid */}
            <div 
              ref={highlightsRef}
              className="grid md:grid-cols-3 gap-6"
            >
              {[
                {
                  icon: Building,
                  title: "Complete Services",
                  description: "Prime specialty contractor with self-perform trades delivering schedule certainty and quality control across building envelope and restoration projects.",
                  color: "construction-orange"
                },
                {
                  icon: HardHat,
                  title: "Proven Track Record",
                  description: "15+ years of experience with proven on-time, on-budget delivery serving developers, property managers, and institutional clients across the Greater Toronto Area.",
                  color: "construction-orange"
                },
                {
                  icon: Award,
                  title: "Building Our Credentials",
                  description: "Licensed business with WSIB registration and insurance in progress. Committed to safety, quality documentation, and professional execution on every project.",
                  color: "construction-orange"
                }
              ].map((highlight, index) => {
                const Icon = highlight.icon;
                return (
                  <div
                    key={index}
                    className={cn(
                      "group relative p-6 rounded-xl border border-construction-orange/20 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md",
                      "hover:border-construction-orange/40 hover:shadow-xl hover:shadow-construction-orange/20",
                      "transition-all duration-500 hover:scale-105",
                      "overflow-hidden",
                      highlightsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    )}
                    style={{ transitionDelay: `${index * 100 + 400}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-construction-orange/0 to-construction-orange/0 group-hover:from-construction-orange/10 group-hover:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10">
                      <div className="w-14 h-14 rounded-xl bg-construction-orange/10 flex items-center justify-center mb-4 group-hover:bg-construction-orange/15 group-hover:scale-110 transition-all duration-300">
                        <Icon className="w-7 h-7 text-construction-orange" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-3">{highlight.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {highlight.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Service Areas - Modern Info Card */}
          <div className="mb-12 max-w-5xl mx-auto">
            <div className="relative p-8 rounded-2xl border border-construction-orange/20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-construction-orange/5 via-transparent to-construction-orange/5" />
              <div className="relative z-10 grid md:grid-cols-2 gap-6 items-center">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-construction-orange/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-construction-orange" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Service Area</h4>
                    <p className="text-sm text-muted-foreground">
                      Toronto, Mississauga, Brampton, Vaughan/Markham, Oakville/Burlington, Hamilton & the GTA/Golden Horseshoe
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-construction-orange/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-construction-orange" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Response Time</h4>
                    <p className="text-sm text-muted-foreground">
                      Typical availability for site assessments: <span className="font-semibold text-foreground">48–72 hours</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA - Improved spacing and hierarchy */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-construction-orange hover:bg-construction-orange/90 group">
              <Link to="/contact" className="inline-flex items-center gap-2">
                Request Site Assessment
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-construction-orange/30 hover:border-construction-orange/50">
              <Link to="/services">
                View Services
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-construction-orange/30 hover:border-construction-orange/50">
              <Link to="/for-general-contractors">
                For GCs: Request Unit Pricing
              </Link>
            </Button>
          </div>

        </div>
      </Section>
    </>
  );
}
