import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, TrendingUp, Users, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import nobleExteriors from "@/assets/partners/noble-exteriors.webp";
import miralCladding from "@/assets/partners/miral-cladding.png";
import eagleContracting from "@/assets/partners/eagle-contracting.png";
import { Link } from "react-router-dom";

interface CaseStudy {
  partner: string;
  partnerLogo: string;
  projectName: string;
  projectType: string;
  duration: string;
  value: string;
  description: string;
  challenge: string;
  solution: string;
  results: string[];
  tags: string[];
}

interface PartnerCaseStudiesProps {
  background?: "default" | "muted";
}

const caseStudies: CaseStudy[] = [
  {
    partner: "Noble Exteriors",
    partnerLogo: nobleExteriors,
    projectName: "Waterfront Condominiums Restoration",
    projectType: "Multi-Residential",
    duration: "18 months",
    value: "$4.5M",
    description: "Complete building envelope restoration for a 32-story waterfront condominium complex.",
    challenge: "The aging facade required comprehensive restoration while residents remained in occupancy, necessitating minimal disruption and strict safety protocols.",
    solution: "Collaborated with Noble Exteriors to implement a phased approach using swing stages and advanced weatherproofing techniques. Their expertise in occupied building work ensured seamless coordination.",
    results: [
      "Zero safety incidents across 18-month duration",
      "Completed 2 weeks ahead of schedule",
      "98% resident satisfaction rating",
      "Extended building envelope lifespan by 25+ years"
    ],
    tags: ["Facade Restoration", "Multi-Residential", "Occupied Building"]
  },
  {
    partner: "Miral Cladding",
    partnerLogo: miralCladding,
    projectName: "Corporate Campus Expansion",
    projectType: "Commercial Office",
    duration: "14 months",
    value: "$6.2M",
    description: "Modern architectural cladding installation for a new 8-story corporate office building featuring sustainable design elements.",
    challenge: "Tight timeline with complex custom cladding panels requiring precision installation and integration with building automation systems.",
    solution: "Partnered with Miral Cladding for custom fabrication and installation. Their advanced prefabrication capabilities and BIM coordination enabled accelerated construction while maintaining quality.",
    results: [
      "LEED Gold certification achieved",
      "30% faster installation than traditional methods",
      "Custom panel system with 50-year warranty",
      "15% reduction in HVAC energy consumption"
    ],
    tags: ["Cladding Systems", "LEED", "Commercial"]
  },
  {
    partner: "Eagle Contracting Inc.",
    partnerLogo: eagleContracting,
    projectName: "Industrial Warehouse Complex",
    projectType: "Industrial",
    duration: "10 months",
    value: "$3.8M",
    description: "Ground-up construction of a 150,000 sq ft distribution center with advanced logistics infrastructure.",
    challenge: "Aggressive schedule with penalty clauses, complex site logistics, and coordination of multiple specialized trades under tight deadlines.",
    solution: "Eagle Contracting Inc. served as our primary subcontractor, managing site coordination and specialty installations. Their project management expertise and reliable workforce kept the project on track.",
    results: [
      "Completed on time despite weather delays",
      "Zero lost-time accidents",
      "Client occupied facility 1 week early",
      "Exceeded structural load requirements by 12%"
    ],
    tags: ["New Construction", "Industrial", "Fast-Track"]
  }
];

export function PartnerCaseStudies({ background = "default" }: PartnerCaseStudiesProps) {
  const sectionClasses = cn(
    "py-24",
    background === "muted" && "bg-muted/30"
  );

  return (
    <section className={sectionClasses}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 text-sm">
              Success Stories
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Partner Collaboration Highlights
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Real projects where partnership excellence delivered exceptional results
            </p>
          </div>

          <div className="space-y-12">
            {caseStudies.map((study, index) => (
              <Card 
                key={index} 
                className="overflow-hidden hover:shadow-2xl transition-all border-2"
              >
                <div className="grid lg:grid-cols-[300px_1fr] gap-0">
                  {/* Partner Info Sidebar */}
                  <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-muted/20 p-8 flex flex-col justify-center items-center border-r">
                    <div className="w-32 h-32 bg-background rounded-xl shadow-lg p-4 mb-4 flex items-center justify-center">
                      <img
                        src={study.partnerLogo}
                        alt={`${study.partner} logo`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h3 className="font-bold text-xl mb-2 text-center">{study.partner}</h3>
                    <Badge variant="outline" className="mb-4">{study.projectType}</Badge>
                    
                    <div className="w-full space-y-3 mt-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">{study.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="font-semibold">{study.value}</span>
                      </div>
                    </div>
                  </div>

                  {/* Case Study Content */}
                  <CardContent className="p-8 lg:p-10">
                    <h3 className="text-2xl font-bold mb-3">{study.projectName}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {study.description}
                    </p>

                    <div className="space-y-6">
                      <div>
                        <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                          <span className="w-2 h-2 bg-destructive rounded-full"></span>
                          Challenge
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed pl-4">
                          {study.challenge}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary rounded-full"></span>
                          Solution
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed pl-4">
                          {study.solution}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-sustainability" />
                          Results
                        </h4>
                        <div className="grid md:grid-cols-2 gap-3 pl-4">
                          {study.results.map((result, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-sustainability mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{result}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-4 border-t">
                        {study.tags.map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-8">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-3">
                  Partner With Excellence
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  These success stories represent just a few examples of how strategic partnerships 
                  deliver exceptional value. Ready to bring your project to life?
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link to="/contact">
                    <Badge variant="default" className="px-6 py-3 text-base cursor-pointer hover:bg-primary/90">
                      Start Your Project
                    </Badge>
                  </Link>
                  <Link to="/projects">
                    <Badge variant="outline" className="px-6 py-3 text-base cursor-pointer hover:bg-muted">
                      View All Projects
                    </Badge>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
