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

const Capabilities = () => {
  const deliveryMethods = [
    {
      title: "Specialty Contracting",
      description: "Self-performed building envelope and interior systems",
      icon: Building2,
      details: ["85% in-house execution", "Direct quality control", "No subcontractor markup", "Single-point accountability"],
    },
    {
      title: "Design-Assist",
      description: "Early contractor involvement during design",
      icon: Users,
      details: ["Constructability review", "Value engineering", "Technical expertise", "Optimal project outcomes"],
    },
    {
      title: "Multi-Trade Integration",
      description: "Coordinated execution of multiple specialty trades",
      icon: Layers,
      details: ["Masonry + EIFS + waterproofing", "Unified scheduling", "Seamless coordination", "Reduced project complexity"],
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
    envelope: ["Stucco & EIFS Systems", "Architectural painting", "Metal cladding installation", "Waterproofing systems", "Masonry repair"],
    interior: ["Commercial painting", "Interior buildouts", "High-performance coatings", "Parking garage restoration"],
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Capabilities | Project Delivery & Self-Perform Trades | Ascent Group"
        description="Comprehensive general contracting capabilities including GC, CM, design-build delivery with self-perform exterior envelope and interior trades across Ontario."
      />
      <Navigation />
      
      <PageHeader
        title="Project Delivery Capabilities"
        description="Specialty contracting excellence: Building envelope restoration and interior systems delivered through self-performed trades and integrated multi-trade execution across Ontario."
        backgroundImage={heroImage}
        cta={{ label: CTA_TEXT.primary, href: "/contact" }}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Capabilities" }
        ]}
      />

      <main className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
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

          {/* Market Sectors - Link to Markets Page */}
          <section className="mb-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Market Sectors We Serve</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                We deliver specialized construction solutions across commercial, multi-family, institutional, and industrial sectors.
              </p>
              <Link to="/markets">
                <Button size="lg" className="gap-2">
                  View All Markets <TrendingUp className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </section>

          {/* Self-Perform */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Self-Perform Capabilities</h2>
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

          {/* Trade Coordination */}
          <section className="mb-16">
            <Card className="border-primary/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Multi-Trade Coordination</CardTitle>
                <CardDescription>We coordinate 15+ specialty trades including</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div className="p-4">
                    <p className="font-medium">Structural & Foundation</p>
                    <p className="text-sm text-muted-foreground">Concrete, steel, carpentry</p>
                  </div>
                  <div className="p-4">
                    <p className="font-medium">MEP Systems</p>
                    <p className="text-sm text-muted-foreground">Mechanical, electrical, plumbing</p>
                  </div>
                  <div className="p-4">
                    <p className="font-medium">Specialty Trades</p>
                    <p className="text-sm text-muted-foreground">Fire protection, roofing, glazing</p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                  <CardTitle>Largest Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary mb-2">$15M+</p>
                  <p className="text-sm text-muted-foreground">Mixed-use development</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <TrendingUp className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Available Bonding</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary mb-2">$5M</p>
                  <p className="text-sm text-muted-foreground">Single project capacity</p>
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
