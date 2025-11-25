import { Building2, Users, Layers, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/ui/Button";
import SEO from "@/components/SEO";
import { CTA_TEXT } from "@/design-system/constants";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import heroImage from "@/assets/heroes/hero-general-contracting.jpg";
import { PartnershipModelsSection } from "@/components/partnerships/PartnershipModelsSection";

const Capabilities = () => {
  const deliveryMethods = [
    {
      title: "Self-Performed Specialty Work",
      description: "10-person crew executes 85% of work in-house",
      icon: Building2,
      details: [
        "EIFS, stucco, sealant, masonry, painting—all direct execution", 
        "Minimal sub-tier layers = direct accountability", 
        "No subcontractor markup on self-performed scope", 
        "Same crew start-to-finish for consistency"
      ],
    },
    {
      title: "Pre-Construction Consultation",
      description: "Practical input during planning for envelope scope",
      icon: Users,
      details: [
        "Field-tested recommendations for EIFS and cladding approaches", 
        "Realistic cost guidance based on actual project experience", 
        "Material selection support (Dryvit, Parex, Sto)", 
        "Constructability insights for your envelope consultant"
      ],
    },
    {
      title: "Envelope + Interior Trade Packaging",
      description: "Bundle related envelope and interior scopes under one specialty contractor",
      icon: Layers,
      details: [
        "Typical package: Façade restoration + protective coatings + painting", 
        "Unified schedule for envelope remediation and interior finishes", 
        "Single point of contact for related building enclosure work", 
        "Reduces coordination burden for envelope-focused projects"
      ],
    },
  ];

  const marketSectors = [
    {
      name: "Building Envelope Services",
      services: ["Stucco & EIFS", "Cladding Systems", "Masonry Restoration", "Waterproofing"],
      link: "/services/building-envelope",
    },
    {
      name: "Interior Services",
      services: ["Interior Buildouts", "Painting Services", "Tile & Flooring", "Protective Coatings"],
      link: "/services/interior-buildouts",
    },
    {
      name: "Specialty Services",
      services: ["Sustainable Construction", "Historic Restoration", "Custom Projects"],
      link: "/services/sustainable-construction",
    },
  ];

  const selfPerform = {
    envelope: [
      "EIFS & stucco installation/repair (Dryvit, Parex, Sto certified)",
      "Perimeter sealant replacement (windows, expansion joints, penetrations)",
      "Masonry restoration & tuckpointing (brick, block, stone)",
      "Exterior architectural painting & protective coatings",
      "Balcony waterproofing membrane systems"
    ],
    interior: [
      "Commercial & residential painting (interior/exterior)",
      "High-performance coatings (epoxy, urethane, anti-graffiti)",
      "Tile & resilient flooring installation",
      "Interior drywall finishing & buildouts",
      "Parking garage restoration (coating, marking, repairs)"
    ],
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Capabilities | Specialty Contracting & Self-Perform Trades | Ascent Group"
        description="Emerging specialty contractor delivering building envelope restoration and interior trades across Ontario's GTA. Self-performed work with 15+ years combined team experience."
      />
      <Navigation />
      
      <PageHeader
        title="What We Deliver: Building Envelope & Interior Trades"
        description="Self-performed specialty work with direct accountability. Serving commercial, multi-family, and residential clients across Ontario's GTA."
        backgroundImage={heroImage}
        cta={{ label: CTA_TEXT.primary, href: "/contact" }}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Capabilities" }
        ]}
      />

      <main className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Partnership Models */}
          <PartnershipModelsSection />

          {/* Project Delivery */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Project Delivery Methods</h2>
            <ScrollReveal direction="up">
              <div className="grid md:grid-cols-3 gap-6">
              {deliveryMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>{method.title}</CardTitle>
                      <CardDescription>{method.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {method.details.map((detail, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            </ScrollReveal>
          </section>

          {/* Service Categories */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Service Categories</h2>
            <ScrollReveal direction="up">
              <div className="grid md:grid-cols-3 gap-6">
                {marketSectors.map((sector, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle>{sector.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-4">
                        {sector.services.map((service, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            {service}
                          </li>
                        ))}
                      </ul>
                      <Link to={sector.link}>
                        <Button variant="outline" className="w-full">
                          View Services
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollReveal>
          </section>

          {/* Self-Perform */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-4 text-center">Self-Perform Capabilities</h2>
            <div className="text-center mb-8 max-w-3xl mx-auto">
              <p className="text-muted-foreground">
                Our 10-person crew directly executes 85% of project scope—EIFS, masonry, sealant, painting, and coatings. 
                We sub-trade only specialized equipment work (e.g., swing-stage rigging) and maintain direct oversight of all activities.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Complete Exterior Envelope</CardTitle>
                  <CardDescription>Full building envelope systems and restoration</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {selfPerform.envelope.map((item, i) => (
                      <li key={i} className="text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Interior & Specialty</CardTitle>
                  <CardDescription>Commercial interior construction and coatings</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {selfPerform.interior.map((item, i) => (
                      <li key={i} className="text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>


          {/* Project Size */}
          <section>
            <h2 className="text-3xl font-bold mb-8 text-center">Project Size & Capacity</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <TrendingUp className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Typical Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary mb-2">$100K - $5M</p>
                  <p className="text-sm text-muted-foreground">Most projects fall in this range</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Building2 className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Team Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary mb-2">$15M+ Projects</p>
                  <p className="text-sm text-muted-foreground">Prior roles on large-scale developments</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <TrendingUp className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Project Financial Strength</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary mb-2">$2M CGL</p>
                  <p className="text-sm text-muted-foreground">WSIB compliant with growing bonding capacity</p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Capabilities;
