import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { PageHero } from "@/components/shared/PageHero";
import SEO from "@/components/SEO";
import { Section } from "@/components/sections/Section";
import { SectionHeader } from "@/design-system/components/SectionHeader";
import { CapabilityCard } from "@/design-system/components/CapabilityCard";
import { CTABand } from "@/design-system/components/CTABand";
import { Card } from "@/design-system/components/Card";
import { Button } from "@/ui/Button";
import { Link } from "react-router-dom";
import { TrustRibbon } from "@/design-system/components/TrustRibbon";
import { FAQAccordion } from "@/design-system/components/FAQAccordion";
import { RelatedLinksGrid } from "@/design-system/components/RelatedLinksGrid";
import { developersFaqs } from "@/data/page-faqs";
import { 
  ShieldCheck, 
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  Award,
  FileText,
  Users,
  Briefcase,
  Building2
} from "lucide-react";
import { audienceHeroes } from "@/data/hero-images";

const Developers = () => {
  const benefits = [
    {
      icon: ShieldCheck,
      title: "Professional Standards",
      description: "15+ years of combined team experience in commercial and multi-unit construction"
    },
    {
      icon: Award,
      title: "GTA Project Experience",
      description: "15+ years of combined team experience across GTA commercial projects"
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
      icon: FileText,
      title: "Pre-Qualification",
      description: "Submit comprehensive documentation including insurance, safety records, and references"
    },
    {
      icon: CheckCircle,
      title: "RFP Response",
      description: "Detailed proposals with material specifications, crew schedules, and value engineering options"
    },
    {
      icon: Users,
      title: "Contract & Coordination",
      description: "Formalized agreements with milestone schedules integrated with your project timeline"
    },
    {
      icon: Award,
      title: "Execution & Delivery",
      description: "On-site project management, daily reporting, and quality assurance throughout construction"
    }
  ];

  return (
    <>
      <SEO 
        title="Developers & Contractors | Partnership Solutions"
        description="Partner with Ascent Group Construction for your development projects. 15+ years combined team experience supporting multi-unit residential and commercial projects across the GTA. Fully insured and WSIB compliant."
        canonical="/company/developers"
      />
      <div className="min-h-screen flex flex-col">
        <Navigation />
        
        <PageHero
          eyebrow="For Developers & GCs"
          title="Build With a Trusted Partner"
          description="Reliable subcontracting for painting, EIFS, stucco, and building envelope systems on mid-rise and commercial projects"
          image={audienceHeroes.developers}
          imageAlt="Development and construction partnership"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Company", href: "/about" },
            { label: "Developers" }
          ]}
          primaryCta={{ text: "Contact Us", href: "/contact" }}
          height="medium"
        />

        <TrustRibbon />

        <main>
          
          {/* Why Partner Section */}
          <Section size="major">
            <SectionHeader
              title="Why Developers Choose Ascent"
              description="Technical capability and professional standards you can count on"
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {benefits.map((benefit, index) => (
                <CapabilityCard
                  key={index}
                  icon={benefit.icon}
                  title={benefit.title}
                  description={benefit.description}
                />
              ))}
            </div>
          </Section>

          {/* Services Section */}
          <Section size="major" className="bg-muted/30">
            <SectionHeader
              title="Specialized Developer Services"
              description="Painting and building envelope services for new construction"
            />
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {services.map((service, index) => (
                <Card key={index} variant="elevated" size="lg">
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
                </Card>
              ))}
            </div>
          </Section>

          {/* Process Section */}
          <Section size="major">
            <SectionHeader
              title="Partnership Process"
              description="From RFP to project completion—a streamlined approach"
            />
            <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {process.map((item, index) => (
                <CapabilityCard
                  key={index}
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
          </Section>

          {/* Documentation Section */}
          <Section size="major" className="bg-muted/30">
            <div className="max-w-4xl mx-auto">
              <Card variant="elevated" size="lg" className="border-l-4 border-l-primary">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-20 h-20 bg-primary/10 rounded-[var(--radius-lg)] flex items-center justify-center shrink-0">
                    <FileText className="w-10 h-10 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-4">Ready to Evaluate Us?</h2>
                    <p className="text-muted-foreground mb-6 text-lg">
                      Access our complete contractor documentation including insurance certificates, 
                      WSIB clearance, safety certifications, and project references.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3 mb-8">
                      {[
                        "Insurance: $2M CGL",
                        "WSIB Clearance Certificate",
                        "Working Toward COR",
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
              </Card>
            </div>
          </Section>

          {/* FAQ */}
          <Section size="subsection" className="bg-muted/30">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-4">Developer FAQ</h2>
              <p className="text-center text-muted-foreground mb-8">
                Common questions from developers and construction managers.
              </p>
              <FAQAccordion faqs={developersFaqs} />
            </div>
          </Section>

          {/* Related Resources */}
          <RelatedLinksGrid
            title="Resources for Developers"
            description="Capability and procurement resources for development partners."
            links={[
              { title: "Capabilities", description: "What we self-perform on mid-rise and commercial.", href: "/capabilities", icon: Building2 },
              { title: "Certifications & Insurance", description: "$2M CGL, WSIB, manufacturer listings.", href: "/company/certifications-insurance", icon: Award },
              { title: "Contractor Portal", description: "Vendor packet and unit rates for your team.", href: "/resources/contractor-portal", icon: Briefcase },
            ]}
          />

          {/* Contact CTA */}
          <CTABand
            title="Let's Build Together"
            description="Discuss your upcoming development project and how we can contribute to its success"
            primaryCta={{ text: "Contact Us", href: "/contact" }}
            secondaryCta={{ text: "Submit an RFP", href: "/contact" }}
            variant="dark"
          />

        </main>
        <Footer />
      </div>
    </>
  );
};

export default Developers;
