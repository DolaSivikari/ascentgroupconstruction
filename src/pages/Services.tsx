import { Link } from "react-router-dom";
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/ui/Button";
import { CertificationBadges } from "@/components/shared/CertificationBadges";
import { MarketSegmentedServices } from "@/components/services/MarketSegmentedServices";
import { ServicePromotionsSection } from "@/components/services/ServicePromotionsSection";
import { CheckCircle2, Users, Building, Briefcase, Home, Shield, Award, HardHat } from "lucide-react";
import { WhoWeServeCard, WhoWeServeSection, FeatureCard } from "@/components/unified";
import { CardGrid } from "@/components/shared/CardGrid";
import { Section } from "@/components/sections/Section";
import { CTA_TEXT } from "@/design-system/constants";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import heroServicesImage from "@/assets/heroes/hero-general-contracting.jpg";
import { usePageAnalytics } from "@/hooks/usePageAnalytics";
import { ParallaxSection } from "@/components/animations/ParallaxSection";
import { ArrowRight } from "lucide-react";

const Services = () => {
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // Analytics tracking
  usePageAnalytics('services');

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Services"
        description="Ascent Group Construction — Main specialty contractor for building envelope, interior trades, and residential renovations. Serving commercial properties, multi-family buildings, and homeowners across Ontario. Self-performed work with 15+ years team experience."
        keywords="specialty contractor services, building envelope contractor, residential renovation, interior trades, painting contractor, tile flooring, EIFS contractor, masonry repair, waterproofing contractor"
        canonical="https://ascentgroupconstruction.com/services"
      />
      <Navigation />
      
      <ParallaxSection speed="slow">
        <PageHeader
          title="Our Services"
          description="Main specialty contractor for building envelope, interior trades, and residential renovations. Serving commercial properties, multi-family buildings, and homeowners across Ontario with 15+ years team experience."
          backgroundImage={heroServicesImage}
          cta={{ label: CTA_TEXT.primary, href: "/estimate" }}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Services" }
          ]}
        />
      </ParallaxSection>

      <main className="flex-1 relative">

        {/* Who We Serve Section - Using Unified Components */}
        <WhoWeServeSection
          title="Who We Serve"
          description="Building envelope, restoration, and interior trades—self-performed by our experienced crew across Ontario & GTA"
          columns={4}
          background="default"
        >
          <WhoWeServeCard
            icon={Building}
            title="Commercial Clients"
            description="Retail, office, and industrial buildings"
            link="/commercial-clients"
            variant="simple"
          />
          <WhoWeServeCard
            icon={Users}
            title="Property Managers"
            description="Multi-family and commercial properties"
            link="/property-managers"
            variant="simple"
          />
          <WhoWeServeCard
            icon={Home}
            title="Homeowners"
            description="Residential painting, renovations, and repairs"
            link="/homeowners"
            variant="simple"
          />
          <WhoWeServeCard
            icon={Briefcase}
            title="General Contractors"
            description="Reliable subcontractor partnerships"
            link="/for-general-contractors"
            variant="simple"
          />
        </WhoWeServeSection>

        {/* Service Promotions Section */}
        <ServicePromotionsSection />

        {/* Specialty Contractor Information */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Why Work with a Specialty Contractor?</h3>
              <p className="text-muted-foreground">
                Specialty contractors like Ascent Group bring focused expertise, specialized equipment, and proven methodologies to complex construction challenges. We self-perform our work, ensuring quality control and accountability on every project.
              </p>
            </div>
          </div>
        </section>

        {/* Certifications Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <CertificationBadges />
          </div>
        </section>

        {/* Why Choose Us */}
        <Section className="bg-muted/30">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose Ascent Group</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ontario's trusted specialty construction partner
            </p>
          </div>

          <CardGrid columns={4} stagger="standard">
            <FeatureCard 
              icon={CheckCircle2} 
              title="Self-Performed Work" 
              description="85% self-performed—direct control of quality, timeline, and cost. No subcontractor markups."
            />
            <FeatureCard 
              icon={Shield} 
              title="Licensed & Insured" 
              description="$2M CGL coverage, WSIB compliant, working toward COR safety certification"
            />
            <FeatureCard 
              icon={Award} 
              title="Manufacturer-Aligned" 
              description="Certified installer for EIFS, sealants, and protective coatings. Work backed by product warranties."
            />
            <FeatureCard 
              icon={HardHat} 
              title="Experienced Crew" 
              description="10-person dedicated team with 15+ years combined experience in envelope and restoration"
            />
          </CardGrid>
        </Section>

        {/* Final CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Start Your Project?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Let's discuss how our specialized services can bring your construction vision to life
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg px-8">
                  <Link to="/contact">Request a Consultation</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8">
                  <Link to="/projects">View Our Projects</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Market-Segmented Services Display */}
        <MarketSegmentedServices />
      </main>

      <Footer />
    </div>
  );
};

export default Services;
