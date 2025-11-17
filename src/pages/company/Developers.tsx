import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import SEO from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Building2, 
  ShieldCheck, 
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  Award,
  FileText,
  Users,
  Clock
} from "lucide-react";
import heroDevelopersImage from "@/assets/heroes/hero-developers.jpg";

const Developers = () => {
  const benefits = [
    {
      icon: ShieldCheck,
      title: "Bonding Capacity",
      description: "$10M per project with financial strength to handle large-scale developments"
    },
    {
      icon: Award,
      title: "Proven Track Record",
      description: "15+ years partnering with major GTA developers on 100+ multi-unit projects"
    },
    {
      icon: Calendar,
      title: "Fast-Track Capability",
      description: "Dedicated crews and equipment to meet aggressive development timelines"
    },
    {
      icon: TrendingUp,
      title: "Value Engineering",
      description: "Cost-saving alternatives without compromising quality or building code compliance"
    }
  ];

  const services = [
    {
      title: "New Construction Painting",
      description: "Complete interior and exterior painting for residential and commercial developments",
      details: ["Multi-unit coordination", "Phased completion schedules", "Quality control inspections", "Warranty programs"]
    },
    {
      title: "Building Envelope Systems",
      description: "EIFS, stucco, masonry, and cladding installation with 15-year waterproofing warranties",
      details: ["Thermal performance optimization", "Weather barrier integration", "Code compliance documentation", "System testing"]
    },
    {
      title: "Parkade & Infrastructure",
      description: "Traffic coating systems, concrete restoration, and protective coatings for parking structures",
      details: ["Fast-cure systems", "Overnight/weekend scheduling", "Structural assessment", "Maintenance programs"]
    }
  ];

  const process = [
    {
      step: "1",
      title: "Pre-Qualification",
      description: "Submit comprehensive documentation including insurance, bonding, safety records, and references"
    },
    {
      step: "2",
      title: "RFP Response",
      description: "Detailed proposals with material specifications, crew schedules, and value engineering options"
    },
    {
      step: "3",
      title: "Contract & Coordination",
      description: "Formalized agreements with milestone schedules integrated with your project timeline"
    },
    {
      step: "4",
      title: "Execution & Delivery",
      description: "On-site project management, daily reporting, and quality assurance throughout construction"
    }
  ];

  return (
    <>
      <SEO 
        title="Developers & Contractors | Partnership Solutions"
        description="Partner with Ascent Group Construction for your development projects. $10M bonding capacity, 15+ years experience, and proven delivery on multi-unit residential and commercial builds across the GTA."
        canonical="/company/developers"
      />
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        {/* Background decorations */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl" />
        </div>

        <Navigation />
        
        <PageHeader
          eyebrow="For Developers & GCs"
          title="Build With a Trusted Partner"
          description="Reliable subcontracting for painting, EIFS, stucco, and building envelope systems on projects of any scale"
          backgroundImage={heroDevelopersImage}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Company", href: "/about" },
            { label: "Developers" }
          ]}
          variant="with-cta"
          cta={{
            label: "Request Prequalification Package",
            href: "/resources/contractor-portal"
          }}
        />

        <main id="main-content">
          
          {/* Why Partner Section */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Why Developers Choose Ascent</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Financial strength, technical expertise, and track record you can trust
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                {benefits.map((benefit, index) => (
                  <Card 
                    key={index} 
                    className="hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group border-2 hover:border-primary/30 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        <benefit.icon className="w-7 h-7 text-secondary" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground text-sm">{benefit.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Specialized Developer Services</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Full-scope painting and building envelope solutions for new construction
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {services.map((service, index) => (
                  <Card 
                    key={index} 
                    className="hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 hover:border-primary/30 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-bold mb-3 text-primary">{service.title}</h3>
                      <p className="text-muted-foreground mb-6">{service.description}</p>
                      <ul className="space-y-2">
                        {service.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-sm">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Process Section */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Partnership Process</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  From RFP to project completion - a streamlined approach
                </p>
              </div>

              <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {process.map((item, index) => (
                  <Card 
                    key={index} 
                    className="relative hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-2 hover:border-primary/30 group animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 text-secondary rounded-full flex items-center justify-center mb-4 text-xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {item.step}
                      </div>
                      <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                    {index < process.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-primary/30" />
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-20 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
                <div>
                  <div className="text-5xl font-bold mb-2 text-secondary">$10M</div>
                  <div className="text-primary-foreground/80">Bonding Capacity</div>
                </div>
                <div>
                  <div className="text-5xl font-bold mb-2 text-secondary">15+</div>
                  <div className="text-primary-foreground/80">Years Experience</div>
                </div>
                <div>
                  <div className="text-5xl font-bold mb-2 text-secondary">100+</div>
                  <div className="text-primary-foreground/80">Multi-Unit Projects</div>
                </div>
                <div>
                  <div className="text-5xl font-bold mb-2 text-secondary">Zero</div>
                  <div className="text-primary-foreground/80">Safety Incidents</div>
                </div>
              </div>
            </div>
          </section>

          {/* Documentation Section */}
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <Card className="border-2 border-primary/20">
                  <CardContent className="p-12">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                        <FileText className="w-10 h-10 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-3xl font-bold mb-4">Ready to Evaluate Us?</h2>
                        <p className="text-muted-foreground mb-6 text-lg">
                          Access our complete contractor documentation including insurance certificates, 
                          WSIB clearance, bonding letters, safety certifications, financial statements, 
                          and project references.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-3 mb-8">
                          {[
                            "Insurance: $5M Liability",
                            "WSIB Clearance Certificate",
                            "Bonding: $10M Capacity",
                            "COR Safety Certification",
                            "Financial Statements",
                            "Project References",
                            "Equipment & Crew Details",
                            "Quality Management System"
                          ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                              <span className="text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                        <Button size="lg" asChild className="w-full sm:w-auto">
                          <Link to="/resources/contractor-portal">
                            <FileText className="mr-2 w-5 h-5" />
                            Access Contractor Portal
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4 text-center">
              <div className="max-w-2xl mx-auto">
                <Users className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="text-4xl font-bold mb-4">
                  Let's Build Together
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Discuss your upcoming development project and how we can contribute to its success
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild variant="secondary">
                    <Link to="/contact">
                      Schedule Consultation
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/resources/contractor-portal">
                      Download Documentation
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

        </main>
        <Footer />
      </div>
    </>
  );
};

export default Developers;