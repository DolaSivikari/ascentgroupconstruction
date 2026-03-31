import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PageHero from "@/components/shared/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import { supabase } from "@/integrations/supabase/client";
import { SITE_URL } from "@/constants/company";
import { Card, CardContent } from "@/design-system/components/Card";
import { Button } from "@/ui/Button";
import { Link } from "react-router-dom";
import { Phone, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { sanitizeAndValidate } from "@/utils/sanitize";
import QuickFacts from "@/components/seo/QuickFacts";
import { CTA_TEXT } from "@/design-system/constants";
import { CTABand } from "@/design-system/components/CTABand";
import PeopleAlsoAsk from "@/components/seo/PeopleAlsoAsk";
import ServiceAreaSection from "@/components/seo/ServiceAreaSection";
import DirectAnswer from "@/components/seo/DirectAnswer";
import { serviceQuickFacts } from "@/data/service-quick-facts";
import { servicePeopleAlsoAsk } from "@/data/service-people-ask";
import { serviceAreaCities } from "@/data/service-area-cities";
import { createServiceSchema, createHowToSchema } from "@/utils/schema-injector";
import { breadcrumbSchema } from "@/utils/structured-data";
import { ServicePageTemplate } from "@/components/services/ServicePageTemplate";

interface ProcessStep {
  step_number: number;
  title: string;
  description: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface Service {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  long_description: string | null;
  icon_name: string | null;
  featured_image: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[] | null;
  service_overview: string | null;
  process_steps: ProcessStep[] | null;
  what_we_provide: string[] | null;
  typical_applications: string[] | null;
  key_benefits: Array<{title: string; description: string}> | null;
  faq_items: FAQItem[] | null;
}

// Map service slugs to hero images
const serviceHeroImages: Record<string, string> = {
  // Interior Construction Services
  'basement-finishing': '/src/assets/heroes/hero-commercial.jpg',
  'carpentry-trim-work': '/src/assets/heroes/hero-equipment.jpg',
  'interior-buildouts-finishing': '/src/assets/heroes/hero-tenant-improvements.jpg',
  'suite-renovations': '/src/assets/heroes/hero-multi-family.jpg',
  'drywall-finishing': '/src/assets/heroes/hero-institutional.jpg',
  
  // Specialty Finishing Services
  'painting-services': '/src/assets/heroes/hero-painting.jpg',
  'tile-flooring': '/src/assets/heroes/hero-tile-flooring.jpg',
  'kitchen-bathroom-renovations': '/src/assets/heroes/hero-retail.jpg',
  
  // Building Envelope Services
  'building-envelope-solutions': '/src/assets/heroes/hero-facade-remediation.jpg',
  'cladding-systems': '/src/assets/heroes/hero-cladding.jpg',
  'eifs-stucco-systems': '/src/assets/heroes/hero-facade-remediation.jpg',
  'masonry-restoration': '/src/assets/heroes/hero-construction-management.jpg',
  'waterproofing-systems': '/src/assets/heroes/hero-sealant-replacement.jpg',
  
  // Protective & Specialty Services
  'protective-architectural-coatings': '/src/assets/heroes/hero-protective-coatings.jpg',
  'general-repairs-maintenance': '/src/assets/heroes/hero-general-contracting.jpg',
  'sustainable-building': '/src/assets/heroes/hero-sustainable.jpg',
};

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    loadService();
  }, [slug]);

  const loadService = async () => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('slug', slug)
      .eq('publish_state', 'published')
      .single();

    if (error || !data) {
      setNotFound(true);
    } else {
      setService(data as unknown as Service);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="container mx-auto px-4 py-32">
          <div className="max-w-4xl mx-auto space-y-8">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (notFound || !service) {
    return <Navigate to="/404" replace />;
  }

  const serviceKey = service.slug || "";
  const quickFacts = serviceQuickFacts[serviceKey] || [];
  const peopleAsk = servicePeopleAlsoAsk[serviceKey] || [];

  // Generate AEO/GEO structured data
  const serviceSchemaData = createServiceSchema({
    serviceType: service.name,
    areaServed: ["Toronto", "Mississauga", "Brampton", "Vaughan", "Markham"],
    priceRange: "$$-$$$",
    subServices: service.what_we_provide || []
  });

  const howToSchemaData = service.process_steps ? createHowToSchema({
    name: `How ${service.name} Works: Professional Process`,
    description: `Step-by-step process for ${service.name.toLowerCase()} services by Ascent Group Construction`,
    steps: service.process_steps.map(step => ({
      position: step.step_number,
      name: step.title,
      text: step.description
    })),
    totalTime: "P7D"
  }) : null;

  const breadcrumbSchemaData = breadcrumbSchema([
    { name: "Home", url: `${SITE_URL}/` },
    { name: "Services", url: `${SITE_URL}/services` },
    { name: service.name, url: `${SITE_URL}/services/${service.slug}` }
  ]);

  const structuredDataArray = [serviceSchemaData, breadcrumbSchemaData];
  if (howToSchemaData) structuredDataArray.push(howToSchemaData);

  return (
    <div className="min-h-screen">
      <SEO
        title={service.seo_title || service.name}
        description={service.seo_description || service.short_description || ""}
        keywords={service.seo_keywords?.join(", ") || ""}
        structuredData={structuredDataArray}
      />
      <Navigation />
      
      <PageHero
        title={service.name}
        description={service.short_description || ""}
        image={serviceHeroImages[service.slug]}
        imageAlt={`${service.name} services`}
        primaryCta={{ text: CTA_TEXT.primary, href: "/contact" }}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.name }
        ]}
        height="medium"
      />
      
      <main className="min-h-screen">
        {/* Direct Answer Section - "What is [Service]?" */}
        {service.short_description && (
          <DirectAnswer>
            <p className="text-lg leading-relaxed">
              <strong>What is {service.name}?</strong>{" "}
              {service.short_description} Ascent Group Construction provides professional {service.name.toLowerCase()} services throughout the Greater Toronto Area, including Toronto, Mississauga, Brampton, Vaughan, and Markham.
            </p>
          </DirectAnswer>
        )}

        {/* Quick Facts Section */}
        {quickFacts.length > 0 && (
          <section className="py-12 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <QuickFacts title={`Quick Facts: ${service.name}`} facts={quickFacts} />
              </div>
            </div>
          </section>
        )}

        {/* Service Overview Section */}
        {service.service_overview && (
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-6">Service Overview</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {service.service_overview}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Featured Image */}
        {service.featured_image && (
          <section className="py-0">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <img 
                  src={service.featured_image} 
                  alt={service.name}
                  className="w-full rounded-lg shadow-[var(--shadow-lg)]"
                />
              </div>
            </div>
          </section>
        )}

        {/* Process Steps */}
        {service.process_steps && service.process_steps.length > 0 && (
          <section className="py-16 bg-muted/50">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-8">Our Process</h2>
                <div className="space-y-6">
                  {service.process_steps.map((step, index) => (
                    <Card key={index} className="p-0">
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                            {step.step_number}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                            <p className="text-muted-foreground">{step.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* What We Provide */}
        {service.what_we_provide && service.what_we_provide.length > 0 && (
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-8">What We Provide</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {service.what_we_provide.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Typical Applications */}
        {service.typical_applications && service.typical_applications.length > 0 && (
          <section className="py-16 bg-muted/50">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-8">Typical Applications</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {service.typical_applications.map((app, index) => (
                    <Card key={index} className="p-0">
                      <CardContent className="p-6">
                        <p className="text-muted-foreground">{app}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Key Benefits */}
        {service.key_benefits && service.key_benefits.length > 0 && (
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-8">Key Benefits</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {service.key_benefits.map((benefit, index) => (
                    <Card key={index} className="p-0">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                          <div>
                            <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                            <p className="text-muted-foreground">{benefit.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FAQs */}
        {service.faq_items && service.faq_items.length > 0 && (
          <section className="py-16 bg-muted/50">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {service.faq_items.map((faq, index) => (
                    <Card key={index} className="p-0">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* People Also Ask Section */}
        {peopleAsk.length > 0 && (
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <PeopleAlsoAsk questions={peopleAsk} />
              </div>
            </div>
          </section>
        )}

        {/* Service Area Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <ServiceAreaSection cities={serviceAreaCities} radius="100km" />
          </div>
        </section>

        {/* Fallback: Long Description (for services not yet migrated) */}
        {!service.service_overview && service.long_description && (
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="prose prose-lg max-w-none mb-12">
                  <div dangerouslySetInnerHTML={{ __html: sanitizeAndValidate(service.long_description).sanitized }} />
                </div>
              </div>
            </div>
          </section>
        )}

        <CTABand
          title="Ready to Discuss Your Project?"
          description="Get a detailed proposal from our team"
          primaryCta={{ text: CTA_TEXT.project, href: "/estimate" }}
          secondaryCta={{ text: CTA_TEXT.contact, href: "/contact" }}
          variant="dark"
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default ServiceDetail;
