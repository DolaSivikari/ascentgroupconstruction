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
import { CTA_TEXT, TYPOGRAPHY_STYLES } from "@/design-system/constants";
import heroServicesImage from "@/assets/heroes/hero-general-contracting.jpg";
import { usePageAnalytics } from "@/hooks/usePageAnalytics";

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
        <Section size="subsection" className="bg-muted/30">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className={`${TYPOGRAPHY_STYLES.subsectionTitle} mb-4`}>Why Work with a Specialty Contractor?</h3>
            <p className="text-muted-foreground">
              Specialty contractors like Ascent Group bring focused expertise, specialized equipment, and proven methodologies to complex construction challenges. We self-perform our work, ensuring quality control and accountability on every project.
            </p>
          </div>
        </Section>

        {/* Certifications Section */}
        <Section size="subsection">
          <CertificationBadges />
        </Section>

        {/* Why Choose Us */}
        <Section size="major" className="bg-muted/30">
          <div className="text-center mb-12">
            <h2 className={`${TYPOGRAPHY_STYLES.sectionTitle} mb-4`}>Why Choose Ascent Group</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your reliable specialty construction partner in Ontario & GTA
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
        <Section size="major" className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className={`${TYPOGRAPHY_STYLES.pageTitle} mb-6`}>
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
        </Section>

        {/* Market-Segmented Services Display */}
        <MarketSegmentedServices />
      </main>

      <Footer />
    </div>
  );
};

export default Services;
