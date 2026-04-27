import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Check, Phone, Mail, MapPin, Clock, Award, 
  ChevronRight, ChevronDown, ArrowRight 
} from 'lucide-react';
import { Button } from '@/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system/components/Card';
import { CTABand } from '@/design-system/components/CTABand';
import { CTA_TEXT } from '@/design-system/constants';
import { PhoneLink } from '@/components/shared/PhoneLink';
import { SITE_URL } from '@/constants/company';
import QuickFacts from '@/components/seo/QuickFacts';
import PeopleAlsoAsk from '@/components/seo/PeopleAlsoAsk';
import SEO from '@/components/SEO';
import { createServiceSchema } from '@/utils/schema-injector';
import { breadcrumbSchema } from '@/utils/structured-data';
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import OptimizedImage from "../OptimizedImage";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { TrustRibbon } from "@/design-system/components/TrustRibbon";
import { RelatedLinksGrid } from "@/design-system/components/RelatedLinksGrid";
import { Briefcase, Building2, Wrench } from "lucide-react";

interface ServiceBenefit {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

interface ProcessStep {
  step: number;
  title: string;
  description: string;
  details: string;
}

interface QuickFacts {
  projectTypes: string[];
  timeline: string;
  serviceArea: string;
  certifications: string[];
}

interface RelatedService {
  slug: string;
  name: string;
  image?: string;
}

interface Testimonial {
  quote: string;
  author: string;
  project: string;
  location: string;
}

export interface ServicePageTemplateProps {
  service: {
    slug: string;
    name: string;
    category: string;
    tagline: string;
    description: string;
    longDescription: string;
    heroImage?: string;
    benefits: ServiceBenefit[];
    process: ProcessStep[];
    quickFacts: QuickFacts;
    relatedServices: RelatedService[];
    testimonial?: Testimonial;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    peopleAlsoAsk?: Array<{ question: string; answer: string }>;
    faqs?: Array<{ question: string; answer: string }>;
    technicalSpecs?: {
      materials?: string[];
      standards?: string[];
      qualityAssurance?: string[];
    };
    caseStudies?: Array<{
      title: string;
      subtitle: string;
      challenge: string;
      solution: string;
      results: string[];
      stats: Array<{ label: string; value: string }>;
    }>;
  };
}

export const ServicePageTemplate = ({ service }: ServicePageTemplateProps) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<Array<{id: string; title: string; slug: string; category: string; featured_image: string}>>([]);

  // Structured data for SEO
  const serviceSchema = createServiceSchema({
    serviceType: service.name,
    areaServed: ["Toronto", "Mississauga", "Brampton", "Vaughan", "Markham"],
    priceRange: "$$-$$$",
    subServices: service.quickFacts.projectTypes
  });

  const breadcrumbSchemaData = breadcrumbSchema([
    { name: "Home", url: `${SITE_URL}/` },
    { name: "Services", url: `${SITE_URL}/services` },
    { name: service.name, url: `${SITE_URL}/services/${service.slug}` }
  ]);

  // Quick Facts data for SEO component
  const quickFactsData = [
    { label: "Timeline", value: service.quickFacts.timeline },
    { label: "Service Area", value: service.quickFacts.serviceArea },
    { label: "Project Types", value: service.quickFacts.projectTypes[0] + " and more" },
  ];

  // Fetch related projects via project_services join
  useEffect(() => {
    const fetchRelatedProjects = async () => {
      try {
        // First get the service ID by slug
        const { data: svcData } = await supabase
          .from("services")
          .select("id")
          .eq("slug", service.slug)
          .single();
        
        if (!svcData) return;
        
        // Then get projects linked to this service
        const { data: projectLinks } = await supabase
          .from("project_services")
          .select("project_id")
          .eq("service_id", svcData.id);
        
        if (!projectLinks || projectLinks.length === 0) return;
        
        const projectIds = projectLinks.map(pl => pl.project_id).filter(Boolean);
        
        const { data: projects } = await supabase
          .from("projects")
          .select("id, title, slug, category, featured_image")
          .in("id", projectIds)
          .eq("publish_state", "published")
          .order("featured", { ascending: false })
          .limit(3);
        
        if (projects) {
          setRelatedProjects(projects as any);
        }
      } catch {
        // Silently fail — section just won't render
      }
    };
    
    fetchRelatedProjects();
  }, [service.slug]);

  return (
    <div className="min-h-screen bg-background pt-24">
      <SEO
        title={service.seoTitle || service.name}
        description={service.seoDescription || service.tagline}
        keywords={service.seoKeywords?.join(", ") || ""}
        structuredData={[serviceSchema, breadcrumbSchemaData]}
      />
      {/* Breadcrumb */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/services" className="hover:text-primary transition-colors">Services</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">{service.name}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section 
        className="relative h-[60vh] min-h-[400px] flex items-center overflow-hidden scroll-reveal"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/90 to-primary/80 z-10" />
        {service.heroImage && (
          <OptimizedImage
            src={service.heroImage}
            alt={service.name}
            aspectRatio="16:9"
            generateSrcSet
            priority
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="relative z-20 container mx-auto px-4 text-primary-foreground">
          <div className="max-w-3xl animate-fade-in">
            <div className="inline-block px-4 py-2 bg-background/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
              {service.category}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
              {service.name}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-primary-foreground/90">
              {service.tagline}
            </p>
            <Button 
              size="lg"
              variant="secondary"
              className="group hover:scale-105 transition-transform"
              asChild
            >
              <Link to="/contact">
                Request Project Quote
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <TrustRibbon />

      {/* Service Overview */}
      <section className="container mx-auto px-4 py-16 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Description */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              About {service.name}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              {service.description}
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              {service.longDescription}
            </p>
          </div>

          {/* Quick Facts Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Quick Facts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-primary font-semibold mb-2">
                    <Check className="w-5 h-5" />
                    <span>Project Types</span>
                  </div>
                  <ul className="ml-7 space-y-1 text-sm text-muted-foreground">
                    {service.quickFacts.projectTypes.map((type, index) => (
                      <li key={index}>{type}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-primary font-semibold mb-2">
                    <Clock className="w-5 h-5" />
                    <span>Typical Timeline</span>
                  </div>
                  <p className="ml-7 text-sm text-muted-foreground">{service.quickFacts.timeline}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-primary font-semibold mb-2">
                    <MapPin className="w-5 h-5" />
                    <span>Service Area</span>
                  </div>
                  <p className="ml-7 text-sm text-muted-foreground">{service.quickFacts.serviceArea}</p>
                </div>

                {service.quickFacts.certifications.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-primary font-semibold mb-2">
                      <Award className="w-5 h-5" />
                      <span>Certifications</span>
                    </div>
                    <ul className="ml-7 space-y-1 text-sm text-muted-foreground">
                      {service.quickFacts.certifications.map((cert, index) => (
                        <li key={index}>{cert}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-6 border-t space-y-3">
                  <PhoneLink className="flex items-center gap-3 text-primary hover:text-primary/80 font-semibold transition-colors" />
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/contact">
                      <Mail className="w-5 h-5 mr-2" />
                      Request Project Quote
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/30 py-12 md:py-16 animate-fade-in scroll-reveal">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Our {service.name} Services
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Quality, expertise, and dedication in every project
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {service.benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card
                  key={index}
                  className="group hover:shadow-[var(--shadow-lg)] hover:-translate-y-2 transition-all duration-500 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6 md:p-8">
                    <IconComponent className="w-12 h-12 md:w-14 md:h-14 text-primary mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg md:text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-12 md:py-16 scroll-reveal">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Process
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              A proven approach to deliver exceptional results
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {service.process.map((step) => (
              <Card
                key={step.step}
                className="overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <button
                  onClick={() => setExpandedStep(
                    expandedStep === step.step ? null : step.step
                  )}
                  className="w-full p-4 md:p-6 flex items-center justify-between hover:bg-muted/50 transition-all duration-300 text-left group"
                  aria-expanded={expandedStep === step.step}
                  aria-controls={`step-${step.step}-content`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-base md:text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                      {step.step}
                    </div>
                    <div>
                      <h3 className="text-base md:text-xl font-bold text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-sm md:text-base text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 md:w-6 md:h-6 text-muted-foreground transition-transform flex-shrink-0 ml-4 ${
                      expandedStep === step.step ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedStep === step.step && (
                  <div 
                    id={`step-${step.step}-content`}
                    className="px-4 md:px-6 pb-4 md:pb-6 animate-fade-in"
                  >
                    <div className="ml-0 md:ml-16 p-4 md:p-6 bg-muted/50 rounded-lg">
                      <p className="text-sm md:text-base text-muted-foreground">{step.details}</p>
                    </div>
                  </div>
                )}
              </Card>
            ))}

            {/* Process cross-link */}
            <div className="text-center pt-4">
              <Link 
                to="/our-process" 
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
              >
                Learn about our full process <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Testimonial */}
      {service.testimonial && (
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden relative">
                <div className="absolute top-0 right-0 text-primary-foreground/20 text-8xl md:text-9xl font-serif leading-none pr-4 md:pr-8">
                  "
                </div>
                <CardContent className="p-8 md:p-12 relative">
                  <p className="text-xl md:text-2xl font-medium mb-6 italic">
                    "{service.testimonial.quote}"
                  </p>
                  <div>
                    <p className="font-bold text-base md:text-lg">{service.testimonial.author}</p>
                    <p className="text-sm md:text-base text-primary-foreground/80">
                      {service.testimonial.project} • {service.testimonial.location}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* SEO Components */}
      {quickFactsData.length > 0 && (
        <section className="py-12 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <QuickFacts title={`${service.name} Quick Facts`} facts={quickFactsData} />
            </div>
          </div>
        </section>
      )}

      {/* Comprehensive FAQ Section */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground text-center mb-12">
                Comprehensive answers to help you make informed decisions
              </p>
              <PeopleAlsoAsk questions={service.faqs} />
            </div>
          </div>
        </section>
      )}

      {/* People Also Ask */}
      {service.peopleAlsoAsk && service.peopleAlsoAsk.length > 0 && (
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <PeopleAlsoAsk questions={service.peopleAlsoAsk} />
            </div>
          </div>
        </section>
      )}

      {/* Related Projects — only renders when real data exists */}
      {relatedProjects.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Related Projects</h2>
            <p className="text-lg text-muted-foreground text-center mb-8">
              Recent {service.name.toLowerCase()} projects we've completed
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {relatedProjects.map((project) => (
                <Link key={project.id} to={`/projects/${project.slug}`}>
                  <Card className="hover:shadow-lg transition-all group overflow-hidden">
                    {project.featured_image && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={project.featured_image}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      {project.category && (
                        <Badge variant="secondary" className="mb-2">{project.category}</Badge>
                      )}
                      <h3 className="font-bold group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Resources */}
      <RelatedLinksGrid
        title="Related Services & Resources"
        description="Other capabilities and resources you may need on this scope."
        links={[
          { title: "All Services", description: "Browse our full envelope, restoration, and interior catalog.", href: "/services", icon: Wrench },
          { title: "Recent Projects", description: "See similar projects we've delivered across the GTA.", href: "/projects", icon: Building2 },
          { title: "For General Contractors", description: "Trade-package pricing, dailies, and RFI turnaround.", href: "/for-general-contractors", icon: Briefcase },
        ]}
      />

      {/* Final CTA */}
      <CTABand
        title="Ready to Discuss Your Project?"
        description="Request a consultation and project proposal today"
        primaryCta={{ text: CTA_TEXT.primary, href: "/contact" }}
        secondaryCta={{ text: CTA_TEXT.viewProjects, href: "/projects" }}
        variant="dark"
      />
    </div>
  );
};
