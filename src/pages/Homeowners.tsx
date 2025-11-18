import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PageHeader from "@/components/PageHeader";
import { Section } from "@/components/sections/Section";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/ui/Button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Paintbrush, 
  Hammer, 
  Droplets, 
  Square, 
  Shield,
  CheckCircle,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  ClipboardCheck,
  Award,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { ParallaxSection } from "@/components/animations/ParallaxSection";
import heroImage from "@/assets/heroes/hero-residential-painting.jpg";
import { usePageAnalytics } from "@/hooks/usePageAnalytics";

const Homeowners = () => {
  usePageAnalytics('homeowners');

  const residentialServices = [
    {
      icon: Paintbrush,
      title: "Interior & Exterior Painting",
      description: "Complete painting services for homes, condos, and townhouses. Professional prep work, quality finishes, and clean execution.",
      scope: [
        "Full interior painting (walls, ceilings, trim)",
        "Exterior painting (siding, stucco, brick)",
        "Color consultation and matching",
        "Minor drywall repair included"
      ],
      typical: "$2,000 - $15,000",
      timeline: "3-7 days"
    },
    {
      icon: Home,
      title: "Stucco & EIFS Repair",
      description: "Residential stucco repairs, EIFS damage correction, and color-matched finishing. We fix cracks, water damage, and impact damage.",
      scope: [
        "Stucco crack repair and patching",
        "EIFS impact damage restoration",
        "Water damage investigation and repair",
        "Color and texture matching"
      ],
      typical: "$1,500 - $8,000",
      timeline: "2-5 days"
    },
    {
      icon: Square,
      title: "Tile & Flooring Installation",
      description: "Ceramic, porcelain, vinyl plank, and laminate installation for kitchens, bathrooms, basements, and living areas.",
      scope: [
        "Tile installation (floor and wall)",
        "Vinyl plank and laminate flooring",
        "Bathroom and kitchen backsplashes",
        "Subfloor prep and leveling"
      ],
      typical: "$3,000 - $12,000",
      timeline: "3-8 days"
    },
    {
      icon: Droplets,
      title: "Waterproofing & Caulking",
      description: "Residential waterproofing for basements, balconies, and building perimeter. Caulking replacement for windows and doors.",
      scope: [
        "Window and door caulking replacement",
        "Balcony waterproofing (condo units)",
        "Basement waterproofing (interior/exterior)",
        "Foundation crack repair"
      ],
      typical: "$1,200 - $6,000",
      timeline: "1-4 days"
    },
    {
      icon: Hammer,
      title: "Renovation & Finishing",
      description: "Basement finishing, bathroom renovations, kitchen updates, and general home improvements.",
      scope: [
        "Basement finishing and drywall",
        "Bathroom renovation and tiling",
        "Kitchen backsplash and painting",
        "Trim, doors, and finishing carpentry"
      ],
      typical: "$5,000 - $35,000",
      timeline: "1-4 weeks"
    },
    {
      icon: Home,
      title: "Exterior Cladding & Siding",
      description: "Siding repair and replacement for residential homes. Hardie board, vinyl, and wood siding services.",
      scope: [
        "Siding repair and replacement",
        "Hardie board installation",
        "Trim and soffit work",
        "Color-matched finishing"
      ],
      typical: "$4,000 - $20,000",
      timeline: "5-10 days"
    }
  ];

  const whyChooseUs = [
    {
      icon: Shield,
      title: "Fully Insured & WSIB Compliant",
      description: "$5M liability coverage and full WSIB compliance protect you and your property."
    },
    {
      icon: Award,
      title: "15+ Years Team Experience",
      description: "Our crew has worked on hundreds of residential and commercial projects across the GTA."
    },
    {
      icon: CheckCircle,
      title: "Clear Quotes, No Surprises",
      description: "Detailed written estimates with itemized pricing. You know exactly what you're paying for."
    },
    {
      icon: Clock,
      title: "On-Time, Professional Execution",
      description: "We show up when we say we will, work efficiently, and clean up thoroughly every day."
    }
  ];

  const processSteps = [
    {
      number: "01",
      title: "Request a Quote",
      description: "Fill out our estimate form or call us directly. Describe your project and upload photos if available.",
      cta: "Get Free Estimate"
    },
    {
      number: "02",
      title: "Site Visit & Estimate",
      description: "We'll visit your home to assess the work, take measurements, and answer your questions. You'll receive a detailed written estimate within 2-3 days.",
      cta: null
    },
    {
      number: "03",
      title: "Schedule & Execute",
      description: "Once you approve the estimate, we'll schedule your project (typically 1-3 weeks out). We arrive on time, work cleanly, and communicate throughout.",
      cta: null
    },
    {
      number: "04",
      title: "Final Walkthrough",
      description: "We'll walk through the completed work with you, address any concerns, and provide care instructions and warranty information.",
      cta: null
    }
  ];

  return (
    <div className="min-h-screen">
      <SEO 
        title="Residential Services for Homeowners | Painting, Renovations, Tile, Flooring | Ascent Group Construction"
        description="Professional residential construction services in Toronto and the GTA. Interior/exterior painting, stucco repair, tile & flooring, renovations, waterproofing. 15+ years experience, fully insured. Free estimates."
        keywords="residential painting Toronto, home renovation GTA, tile installation Toronto, flooring contractor, stucco repair homeowners, basement finishing, bathroom renovation, EIFS repair residential"
      />

      <Navigation />

      <PageHeader
        title="Residential Services for Homeowners"
        description="Professional Painting, Renovations, Tile, Flooring & More • 15+ Years Experience • Fully Insured • Free Estimates • Serving Toronto & GTA"
        backgroundImage={heroImage}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Homeowners" }
        ]}
      />

      {/* Introduction Section */}
      <Section>
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Badge variant="secondary" className="mb-4">Trusted by Homeowners Across the GTA</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Quality Construction Services for Your Home
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Whether you're looking to refresh your home with new paint, repair exterior stucco damage, renovate your bathroom, or install new tile and flooring—we bring <strong>15+ years of professional construction experience</strong> to residential projects across Toronto and the Greater Toronto Area.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We're a small, owner-operated team that delivers the same professional standards, quality materials, and clean execution you'd expect from larger firms—with the personalized attention and clear communication you deserve as a homeowner.
            </p>
          </div>
        </ScrollReveal>

        {/* Why Choose Us */}
        <StaggerContainer>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {whyChooseUs.map((item, index) => {
              const Icon = item.icon;
              return (
                <ScrollReveal key={index}>
                  <Card className="text-center h-full">
                    <CardContent className="pt-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              );
            })}
          </div>
        </StaggerContainer>
      </Section>

      {/* Residential Services Grid */}
      <Section className="bg-accent">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Residential Services</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              From simple repairs to complete renovations, we handle a wide range of residential construction services with professional execution and fair pricing.
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {residentialServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <ScrollReveal key={index}>
                <Card className="h-full">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Typical Scope:</h4>
                        <ul className="space-y-1">
                          {service.scope.map((item, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-4 border-t flex items-center justify-between text-sm">
                        <div>
                          <span className="text-muted-foreground">Typical Cost:</span>
                          <p className="font-semibold text-primary">{service.typical}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-muted-foreground">Timeline:</span>
                          <p className="font-semibold">{service.timeline}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            );
          })}
        </StaggerContainer>

        <ScrollReveal>
          <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground mb-4">
              <strong>Note:</strong> Costs and timelines are estimates based on typical residential projects. Your actual project will be priced after a site visit.
            </p>
            <Button asChild size="lg">
              <Link to="/estimate">Get Your Free Estimate</Link>
            </Button>
          </div>
        </ScrollReveal>
      </Section>

      {/* How It Works */}
      <Section>
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We've made it simple to get started. Here's what you can expect when working with Ascent Group Construction.
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {processSteps.map((step, index) => (
            <ScrollReveal key={index}>
              <Card className="text-center h-full">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
                  {step.cta && (
                    <Button asChild size="sm" variant="outline">
                      <Link to="/estimate">{step.cta}</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </StaggerContainer>
      </Section>

      {/* FAQ Section for Homeowners */}
      <Section className="bg-accent">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Common Questions from Homeowners</h2>
          </div>
        </ScrollReveal>

        <div className="max-w-3xl mx-auto space-y-6">
          <ScrollReveal>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you provide free estimates?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes. We provide free, no-obligation written estimates for all residential projects. After our site visit, you'll receive a detailed quote within 2-3 business days.
                </p>
              </CardContent>
            </Card>
          </ScrollReveal>

          <ScrollReveal>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Are you insured and licensed?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes. We carry $5M commercial general liability insurance and are fully WSIB compliant. We can provide certificates of insurance upon request.
                </p>
              </CardContent>
            </Card>
          </ScrollReveal>

          <ScrollReveal>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How long will my project take?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Most residential painting projects take 3-7 days. Tile and flooring installations typically take 3-8 days depending on size. Full renovations can range from 1-4 weeks. We'll provide a detailed timeline with your estimate.
                </p>
              </CardContent>
            </Card>
          </ScrollReveal>

          <ScrollReveal>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you offer warranties?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes. We provide workmanship warranties on all residential services (typically 1-2 years depending on scope). Materials carry manufacturer warranties. Full warranty details are included in your contract.
                </p>
              </CardContent>
            </Card>
          </ScrollReveal>

          <ScrollReveal>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What areas do you serve?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We serve Toronto and the Greater Toronto Area, including Mississauga, Brampton, Vaughan, Markham, Richmond Hill, Oakville, Burlington, and surrounding communities. Contact us to confirm service in your area.
                </p>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </Section>

      {/* Final CTA */}
      <div className="relative py-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10">
          <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Home Project?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Get a free, detailed estimate in 2-3 days. No pressure, no obligation—just professional advice and transparent pricing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="default">
                <Link to="/estimate">
                  <ClipboardCheck className="w-5 h-5 mr-2" />
                  Get Free Estimate
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/contact">
                  <Phone className="w-5 h-5 mr-2" />
                  Call Us Today
                </Link>
              </Button>
            </div>
            <p className="text-sm text-white/80 mt-6">
              Or email us at <a href="mailto:info@ascentgroupconstruction.com" className="underline hover:text-white">info@ascentgroupconstruction.com</a>
            </p>
          </div>
          </ScrollReveal>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Homeowners;
