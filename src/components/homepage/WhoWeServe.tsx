import { Link } from "react-router-dom";
import { Building, HardHat, ArrowRight, CheckCircle2, Wrench, Hammer, Ruler } from "lucide-react";
import { Button } from "@/ui/Button";
import { Card } from "@/components/ui/card";

const WhoWeServe = () => {
  return (
    <section className="py-20 md:py-24 bg-background">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl">
        {/* Section Header - Enterprise Style */}
        <div className="max-w-3xl mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            Client Solutions
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Delivering specialized envelope restoration and façade remediation services to developers, building owners, and property managers across Ontario.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Developers & Building Owners */}
          <Card variant="elevated" className="relative overflow-hidden group hover-subtle">
            <div className="p-8 lg:p-10">
              {/* Icon with Steel Blue Accent */}
              <div className="w-14 h-14 rounded-lg bg-steel-blue/10 flex items-center justify-center mb-6">
                <Building className="h-7 w-7 text-steel-blue" />
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
                Developers & Building Owners
              </h3>
              <p className="text-base text-muted-foreground mb-8 leading-relaxed">
                Prime specialty services and trade package support for multi-unit residential and commercial envelope projects.
              </p>

              {/* Benefits List */}
              <ul className="space-y-4 mb-10 pb-8 border-b border-border">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-steel-blue shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Building envelope restoration & remediation</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-steel-blue shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Masonry, EIFS/stucco, & waterproofing systems</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-steel-blue shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Trade package support with unit rates & 48h submittals</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-steel-blue shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Self-performed envelope trades & specialty coatings</span>
                </li>
              </ul>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="primary" size="lg" className="group">
                  <Link to="/capabilities" className="inline-flex items-center gap-2">
                    See Our Work
                    <ArrowRight className="h-4 w-4 hover-translate-arrow" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link to="/prequalification">
                    Pre-Qualification
                  </Link>
                </Button>
              </div>
            </div>
          </Card>

          {/* Property Owners & Managers */}
          <Card variant="elevated" className="relative overflow-hidden group hover-subtle">
            <div className="p-8 lg:p-10">
              {/* Icon with Steel Blue Accent */}
              <div className="w-14 h-14 rounded-lg bg-steel-blue/10 flex items-center justify-center mb-6">
                <HardHat className="h-7 w-7 text-steel-blue" />
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
                Property Owners & Managers
              </h3>
              <p className="text-base text-muted-foreground mb-8 leading-relaxed">
                Complete project management solutions from initial assessment through final completion and warranty support.
              </p>

              {/* Benefits List */}
              <ul className="space-y-4 mb-10 pb-8 border-b border-border">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-steel-blue shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Building envelope restoration and upgrades</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-steel-blue shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Interior and exterior renovation projects</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-steel-blue shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Capital improvement programs</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-steel-blue shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Maintenance and repair services</span>
                </li>
              </ul>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="primary" size="lg" className="group">
                  <Link to="/contact" className="inline-flex items-center gap-2">
                    <Link to="/contact">Request Site Assessment</Link>
                    <ArrowRight className="h-4 w-4 hover-translate-arrow" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link to="/projects">
                    View Projects
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WhoWeServe;
