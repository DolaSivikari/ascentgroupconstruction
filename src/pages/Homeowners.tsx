import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/sections/Section";
import { SectionHeader } from "@/design-system/components/SectionHeader";
import { CapabilityCard } from "@/design-system/components/CapabilityCard";
import { CTABand } from "@/design-system/components/CTABand";
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
  DollarSign,
  Award,
  Clock,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { audienceHeroes } from "@/data/hero-images";
import { usePageAnalytics } from "@/hooks/usePageAnalytics";
import { Card } from "@/design-system/components/Card";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { H2 } from "@/design-system/components/Typography";

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
      description: "$2M CGL liability coverage and full WSIB compliance protect you and your property."
    },
    {
      icon: Award,
      title: "15+ Years Team Experience",
      description: "Our crew brings hands-on experience from a wide range of residential and commercial projects across the GTA."
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
      icon: DollarSign,
      title: "Request an Estimate",
      description: "Fill out our estimate form or call us directly. Describe your project and upload photos if available."
    },
    {
      icon: Home,
      title: "Site Visit & Estimate",
      description: "We'll visit your home to assess the work, take measurements, and answer your questions. You'll receive a detailed written estimate within 2-3 days."
    },
    {
      icon: Hammer,
      title: "Schedule & Execute",
      description: "Once you approve the estimate, we'll schedule your project (typically 1-3 weeks out). We arrive on time, work cleanly, and communicate throughout."
    },
    {
      icon: CheckCircle,
      title: "Final Walkthrough",
      description: "We'll walk through the completed work with you, address any concerns, and provide care instructions and warranty information."
    }
  ];

  return (
    <div className="min-h-screen">
      <SEO 
        title="Residential Services for Homeowners | Painting, Renovations, Tile, Flooring | Ascent Group Construction"
        description="Professional residential construction services in Toronto and the GTA. Interior/exterior painting, stucco repair, tile & flooring, renovations, waterproofing. 15+ years experience, fully insured. Serving Toronto & GTA."
        keywords="residential painting Toronto, home renovation GTA, tile installation Toronto, flooring contractor, stucco repair homeowners, basement finishing, bathroom renovation, EIFS repair residential"
      />

      <Navigation />

      <PageHero
        title="Residential Services for Homeowners"
        description="Professional Painting, Renovations, Tile, Flooring & More • 15+ Years Experience • Fully Insured • Serving Toronto & GTA"
        image={audienceHeroes["homeowners"]}
        imageAlt="Quality home improvement services"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Homeowners" }
        ]}
        badges={[
          { icon: User, text: "Owner-Operated" },
          { icon: Shield, text: "Fully Insured" },
          { icon: DollarSign, text: "Free Estimates" },
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
            {whyChooseUs.map((item, index) => (
              <ScrollReveal key={index}>
                <CapabilityCard
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                />
              </ScrollReveal>
            ))}
          </div>
        </StaggerContainer>
      </Section>

      {/* Residential Services Grid */}
      <Section className="bg-muted/30">
        <ScrollReveal>
          <div className="text-center mb-12">
            <H2 className="mb-4">Our Residential Services</H2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              From simple repairs to complete renovations, we handle a wide range of residential construction services with professional execution and fair pricing.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {residentialServices.map((service, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <ResidentialServiceCard
                icon={service.icon}
                title={service.title}
                description={service.description}
                scope={service.scope}
                typical={service.typical}
                timeline={service.timeline}
              />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground mb-4">
              <strong>Note:</strong> Costs and timelines are estimates based on typical residential projects. Your actual project will be priced after a site visit.
            </p>
            <Button asChild size="lg">
              <Link to="/estimate">Request an Estimate</Link>
            </Button>
          </div>
        </ScrollReveal>
      </Section>

      {/* How It Works */}
      <Section>
        <ScrollReveal>
          <SectionHeader
            title="How It Works"
            description="We've made it simple to get started. Here's what you can expect when working with Ascent Group Construction."
          />
        </ScrollReveal>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {processSteps.map((step, index) => (
            <ScrollReveal key={index}>
              <CapabilityCard
                icon={step.icon}
                title={step.title}
                description={step.description}
              />
            </ScrollReveal>
          ))}
        </StaggerContainer>
      </Section>

      {/* FAQ Section for Homeowners */}
      <Section className="bg-accent">
        <ScrollReveal>
          <div className="text-center mb-12">
            <H2 className="mb-4">Common Questions from Homeowners</H2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know before getting started
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border border-border rounded-lg px-6 bg-card">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3 text-left">
                    <DollarSign className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="font-semibold">Do you provide estimates?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  Yes. We provide no-obligation written estimates for all residential projects. After our site visit, you'll receive a detailed quote within 2-3 business days.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-border rounded-lg px-6 bg-card">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3 text-left">
                    <Shield className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="font-semibold">Are you insured and licensed?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  Yes. We carry $2M commercial general liability (CGL) insurance and are fully WSIB compliant. We can provide certificates of insurance upon request.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-border rounded-lg px-6 bg-card">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3 text-left">
                    <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="font-semibold">How long will my project take?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  Most residential painting projects take 3-7 days. Tile and flooring installations typically take 3-8 days depending on size. Full renovations can range from 1-4 weeks. We'll provide a detailed timeline with your estimate.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-border rounded-lg px-6 bg-card">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3 text-left">
                    <Award className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="font-semibold">Do you offer warranties?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  Yes. We provide workmanship warranties on all residential services (typically 1-2 years depending on scope). Materials carry manufacturer warranties. Full warranty details are included in your contract.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border border-border rounded-lg px-6 bg-card">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3 text-left">
                    <Home className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="font-semibold">What areas do you serve?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  We serve Toronto and the Greater Toronto Area, including Mississauga, Brampton, Vaughan, Markham, Richmond Hill, Oakville, Burlington, and surrounding communities. Contact us to confirm service in your area.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </ScrollReveal>
        </div>
      </Section>

      {/* Final CTA */}
      <CTABand
        title="Ready to Start Your Home Project?"
        description="Get a detailed estimate in 2-3 days. No pressure, no obligation—just professional advice and transparent pricing."
        primaryCta={{ text: "Request an Estimate", href: "/estimate" }}
        secondaryCta={{ text: "Contact Us", href: "/contact" }}
        variant="dark"
      />

      <Footer />
    </div>
  );
};

export default Homeowners;
