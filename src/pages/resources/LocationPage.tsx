import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/sections/Section";
import { Card } from "@/design-system/components/Card";
import { Button } from "@/ui/Button";
import { CTA_TEXT } from "@/design-system/constants";
import { MapPin, Phone, Clock, CheckCircle, Building2, Home, Factory, HardHat, ArrowRight } from "lucide-react";
import { COMPANY_PHONE, SITE_URL } from "@/constants/company";
import { PhoneLink } from "@/components/shared/PhoneLink";
import { serviceAreaCities, primaryServiceCities } from "@/data/service-area-cities";
import { 
  generateBreadcrumbSchema,
  generateServiceSchema,
  COMPANY
} from "@/utils/seo";
import { usePageAnalytics } from "@/hooks/usePageAnalytics";
import { supabase } from "@/integrations/supabase/client";

interface AreaProject {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  location: string | null;
  featured_image: string | null;
  category: string | null;
}

const RELATED_SERVICES: { name: string; slug: string }[] = [
  { name: "Building Envelope Solutions", slug: "building-envelope-solutions" },
  { name: "Waterproofing Systems", slug: "waterproofing-systems" },
  { name: "EIFS & Stucco Systems", slug: "eifs-stucco-systems" },
  { name: "Cladding Systems", slug: "cladding-systems" },
  { name: "Painting Services", slug: "painting-services" },
  { name: "Parking Garage Restoration", slug: "parking-garage-restoration" },
  { name: "Sealant Programs", slug: "sealant-programs" },
  { name: "Sustainable Building", slug: "sustainable-building" },
];

interface LocationData {
  name: string;
  slug: string;
  region: string;
  description: string;
  isPrimary: boolean;
}

const locationDetails: Record<string, LocationData> = {
  "toronto": {
    name: "Toronto",
    slug: "toronto",
    region: "ON",
    description: "As Ontario's largest city, Toronto is home to countless commercial, multi-family, and institutional buildings requiring expert building envelope and restoration services. From downtown high-rises to suburban complexes, Ascent Group Construction delivers professional façade remediation, waterproofing, and specialty contractor services throughout Toronto.",
    isPrimary: true
  },
  "mississauga": {
    name: "Mississauga",
    slug: "mississauga",
    region: "ON",
    description: "Mississauga's rapidly growing commercial and residential landscape demands reliable building envelope contractors. Our team provides comprehensive restoration, EIFS, masonry repair, and protective coating services to property managers and building owners throughout Mississauga.",
    isPrimary: true
  },
  "brampton": {
    name: "Brampton",
    slug: "brampton",
    region: "ON",
    description: "Brampton's expanding infrastructure requires trusted specialty contractors for building envelope maintenance and restoration. Ascent Group Construction serves commercial, industrial, and multi-family properties with professional cladding, waterproofing, and coating services.",
    isPrimary: true
  },
  "vaughan": {
    name: "Vaughan",
    slug: "vaughan",
    region: "ON",
    description: "From Woodbridge to Maple, Vaughan's commercial and residential buildings benefit from our expert building envelope services. Our crews deliver quality EIFS installation, masonry restoration, and façade repairs throughout Vaughan.",
    isPrimary: true
  },
  "markham": {
    name: "Markham",
    slug: "markham",
    region: "ON",
    description: "Markham's diverse building stock—from tech campuses to residential towers—requires specialized envelope contractors. Ascent Group provides comprehensive restoration, waterproofing, and cladding services to Markham property owners.",
    isPrimary: true
  },
  "richmond-hill": {
    name: "Richmond Hill",
    slug: "richmond-hill",
    region: "ON",
    description: "Richmond Hill's growing community includes many commercial and multi-family buildings needing professional envelope maintenance. Our team delivers quality façade remediation, coating systems, and restoration services.",
    isPrimary: false
  },
  "oakville": {
    name: "Oakville",
    slug: "oakville",
    region: "ON",
    description: "Oakville's premium commercial and residential properties deserve expert building envelope services. Ascent Group provides meticulous restoration, waterproofing, and protective coating solutions throughout Oakville.",
    isPrimary: false
  },
  "burlington": {
    name: "Burlington",
    slug: "burlington",
    region: "ON",
    description: "Burlington's lakeside commercial district and residential communities benefit from our comprehensive building envelope services. We deliver professional façade repairs, cladding installation, and waterproofing throughout Burlington.",
    isPrimary: false
  },
  "hamilton": {
    name: "Hamilton",
    slug: "hamilton",
    region: "ON",
    description: "Hamilton's industrial heritage and growing commercial sector require experienced specialty contractors. Ascent Group serves Hamilton with expert masonry restoration, protective coatings, and building envelope solutions.",
    isPrimary: false
  },
  "ajax": {
    name: "Ajax",
    slug: "ajax",
    region: "ON",
    description: "Ajax's commercial and residential buildings benefit from our professional building envelope services. We provide quality restoration, waterproofing, and cladding solutions throughout Ajax.",
    isPrimary: false
  },
  "pickering": {
    name: "Pickering",
    slug: "pickering",
    region: "ON",
    description: "Pickering's growing infrastructure requires reliable specialty contractors. Ascent Group delivers professional façade remediation, EIFS, and envelope restoration services throughout Pickering.",
    isPrimary: false
  },
  "whitby": {
    name: "Whitby",
    slug: "whitby",
    region: "ON",
    description: "Whitby's commercial and multi-family properties benefit from our comprehensive envelope solutions. We provide professional restoration, coating, and waterproofing services throughout Whitby.",
    isPrimary: false
  },
  "oshawa": {
    name: "Oshawa",
    slug: "oshawa",
    region: "ON",
    description: "Oshawa's diverse building stock requires experienced envelope contractors. Ascent Group serves Oshawa with expert façade repairs, masonry restoration, and protective coating systems.",
    isPrimary: false
  },
  "newmarket": {
    name: "Newmarket",
    slug: "newmarket",
    region: "ON",
    description: "Newmarket's commercial and residential properties benefit from our building envelope expertise. We deliver quality EIFS, cladding, and restoration services throughout Newmarket.",
    isPrimary: false
  },
  "aurora": {
    name: "Aurora",
    slug: "aurora",
    region: "ON",
    description: "Aurora's premium properties deserve expert building envelope care. Ascent Group provides professional façade remediation, waterproofing, and coating services throughout Aurora.",
    isPrimary: false
  },
  "milton": {
    name: "Milton",
    slug: "milton",
    region: "ON",
    description: "Milton's rapidly growing commercial and residential developments require reliable specialty contractors. We deliver professional envelope restoration and cladding services throughout Milton.",
    isPrimary: false
  },
  "king-city": {
    name: "King City",
    slug: "king-city",
    region: "ON",
    description: "King City's estate homes and commercial properties benefit from expert building envelope care. Ascent Group provides professional façade remediation, EIFS, masonry restoration, and protective coating services throughout King City and the surrounding area.",
    isPrimary: false
  }
};

const services = [
  "Façade Remediation & Repairs",
  "Building Envelope Solutions",
  "Waterproofing Systems",
  "EIFS & Stucco Systems",
  "Masonry Restoration",
  "Cladding Systems",
  "Protective & Architectural Coatings",
  "Parking Garage Restoration"
];

const LocationPage = () => {
  const { city } = useParams<{ city: string }>();
  const location = city ? locationDetails[city] : null;
  const [areaProjects, setAreaProjects] = useState<AreaProject[]>([]);

  usePageAnalytics(`service-area-${city}`);

  useEffect(() => {
    if (!location) return;
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("id, title, slug, summary, location, featured_image, category")
          .eq("publish_state", "published")
          .ilike("location", `%${location.name}%`)
          .order("completion_date", { ascending: false, nullsFirst: false })
          .limit(3);
        if (!cancelled && !error && data) setAreaProjects(data as AreaProject[]);
      } catch {
        /* projects section is optional — silently degrade */
      }
    })();
    return () => { cancelled = true; };
  }, [location]);

  if (!location) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <Section size="major">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Location Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The service area you're looking for doesn't exist.
            </p>
            <Button asChild>
              <Link to="/resources/service-areas">View All Service Areas</Link>
            </Button>
          </div>
        </Section>
        <Footer />
      </div>
    );
  }

  // Generate structured data
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Service Areas", url: "/resources/service-areas" },
    { name: location.name, url: `/service-areas/${location.slug}` }
  ]);
  
  const serviceSchema = generateServiceSchema({
    name: `Building Envelope Services in ${location.name}`,
    description: `Professional building envelope, façade remediation, and restoration services in ${location.name}, ${location.region}. WSIB compliant, $2M insured specialty contractor.`,
    slug: `service-areas/${location.slug}`,
  });

  // LocalBusiness schema for this location
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${SITE_URL}/service-areas/${location.slug}#business`,
    "name": `Ascent Group Construction - ${location.name}`,
    "description": `Building envelope and restoration contractor serving ${location.name}, ${location.region}`,
    "url": `${SITE_URL}/service-areas/${location.slug}`,
    "telephone": COMPANY.phone,
    "email": COMPANY.email,
    "areaServed": {
      "@type": "City",
      "name": location.name,
      "addressRegion": location.region,
      "addressCountry": "CA"
    },
    "serviceType": services,
    "parentOrganization": {
      "@id": `${SITE_URL}/#organization`
    }
  };

  const otherCities = Object.values(locationDetails)
    .filter(l => l.slug !== location.slug)
    .slice(0, 6);

  return (
    <div className="min-h-screen">
      <SEO 
        title={`Building Envelope Contractor in ${location.name} | Ascent Group`}
        description={`Professional building envelope, façade remediation, waterproofing, and restoration services in ${location.name}, ${location.region}. WSIB compliant, $2M insured. Call ${COMPANY_PHONE}.`}
        keywords={`building envelope contractor ${location.name}, facade remediation ${location.name}, waterproofing ${location.name}, EIFS contractor ${location.name}, masonry restoration ${location.name}`}
        structuredData={[breadcrumbSchema, serviceSchema, localBusinessSchema]}
      />
      <Navigation />

      <PageHero
        title={`Building Envelope Services in ${location.name}`}
        description={`Professional façade remediation, waterproofing, and restoration services for ${location.name} properties. WSIB compliant, $2M CGL insured specialty contractor.`}
        height="medium"
        primaryCta={{ text: CTA_TEXT.contact, href: "/contact" }}
        secondaryCta={{ text: "Get Estimate", href: "/estimate" }}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Service Areas", href: "/resources/service-areas" },
          { label: location.name }
        ]}
      />

      {/* Location Overview */}
      <Section size="major" maxWidth="narrow">
        <div className="prose prose-lg max-w-none">
          <p className="text-lg md:text-xl leading-relaxed">
            {location.description}
          </p>
        </div>

        {/* Contact Info */}
        <Card variant="elevated" size="lg" className="mt-8 border-l-4 border-primary">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <Phone className="w-6 h-6 text-primary" />
              <div>
                <p className="font-semibold">Call Us</p>
                <PhoneLink showIcon={false} className="text-primary hover:underline" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-primary" />
              <div>
                <p className="font-semibold">Hours</p>
                <p className="text-muted-foreground">Mon-Fri 8AM-6PM</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-primary" />
              <div>
                <p className="font-semibold">Serving</p>
                <p className="text-muted-foreground">{location.name} & Area</p>
              </div>
            </div>
          </div>
        </Card>
      </Section>

      {/* Services We Offer */}
      <Section size="major" className="bg-muted/50">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Services in {location.name}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Complete building envelope and restoration solutions for {location.name} properties
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <Card key={index} variant="default" size="md" className="hover:border-primary/50 transition-colors">
              <CheckCircle className="w-5 h-5 text-primary mb-2" />
              <span className="font-medium">{service}</span>
            </Card>
          ))}
        </div>
      </Section>

      {/* Who We Serve */}
      <Section size="major">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Who We Serve in {location.name}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <Card variant="elevated" size="md" hover>
            <Building2 className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Property Managers</h3>
            <p className="text-sm text-muted-foreground">
              Multi-family and commercial building maintenance
            </p>
          </Card>
          <Card variant="elevated" size="md" hover>
            <Factory className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-semibold mb-2">General Contractors</h3>
            <p className="text-sm text-muted-foreground">
              Trade partner for envelope scopes
            </p>
          </Card>
          <Card variant="elevated" size="md" hover>
            <HardHat className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Developers</h3>
            <p className="text-sm text-muted-foreground">
              New construction envelope systems
            </p>
          </Card>
          <Card variant="elevated" size="md" hover>
            <Home className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Homeowners</h3>
            <p className="text-sm text-muted-foreground">
              Residential exterior services
            </p>
          </Card>
        </div>
      </Section>

      {/* Coverage Map */}
      <Section size="major" className="bg-muted/50">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Serving {location.name}, {location.region}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Crews dispatched from our GTA base. Same-day response available for emergency envelope failures within the core service radius.
          </p>
        </div>
        <Card variant="elevated" size="lg" className="overflow-hidden p-0 max-w-5xl mx-auto">
          <div className="aspect-[16/9] w-full bg-muted">
            <iframe
              title={`Map of ${location.name}, ${location.region} service area`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(`${location.name}, ${location.region}, Canada`)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full border-0"
              allowFullScreen
            />
          </div>
        </Card>
      </Section>

      {/* Related Services */}
      <Section size="major">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Popular Services in {location.name}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our most-requested specialty trade services for {location.name} properties.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {RELATED_SERVICES.map((svc) => (
            <Link
              key={svc.slug}
              to={`/services/${svc.slug}`}
              className="group p-5 rounded-lg border bg-background hover:border-primary hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {svc.name}
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
              </div>
              <p className="text-xs text-muted-foreground">
                Available in {location.name}
              </p>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button asChild variant="outline">
            <Link to="/services">View All Services</Link>
          </Button>
        </div>
      </Section>

      {/* Featured Projects in Area */}
      {areaProjects.length > 0 && (
        <Section size="major" className="bg-muted/50">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Recent Projects in {location.name}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A selection of completed work in and around {location.name}.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {areaProjects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.slug}`}
                className="group block bg-background rounded-lg border overflow-hidden hover:border-primary hover:shadow-lg transition-all"
              >
                <div className="aspect-[16/10] bg-muted overflow-hidden">
                  {project.featured_image ? (
                    <img
                      src={project.featured_image}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Building2 className="w-10 h-10" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  {project.category && (
                    <span className="text-xs uppercase tracking-wide text-primary font-medium">
                      {project.category}
                    </span>
                  )}
                  <h3 className="font-semibold text-lg mt-1 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {project.title}
                  </h3>
                  {project.location && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      {project.location}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link to="/projects">View All Projects</Link>
            </Button>
          </div>
        </Section>
      )}

      {/* Other Service Areas */}
      <Section size="major" className="bg-muted/50">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Other Service Areas
          </h2>
          <p className="text-lg text-muted-foreground">
            We also serve these nearby communities
          </p>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
          {otherCities.map((otherLocation) => (
            <Link
              key={otherLocation.slug}
              to={`/service-areas/${otherLocation.slug}`}
              className="p-4 bg-background rounded-lg border hover:border-primary transition-colors text-center"
            >
              <MapPin className="w-5 h-5 text-primary mx-auto mb-2" />
              <span className="font-medium">{otherLocation.name}</span>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button asChild variant="outline">
            <Link to="/resources/service-areas">View All Service Areas</Link>
          </Button>
        </div>
      </Section>

      {/* CTA */}
      <Section size="major" className="bg-primary text-primary-foreground">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your {location.name} Project?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8">
            Get a detailed proposal from our team. Free site assessments for commercial projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/contact">{CTA_TEXT.contact}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link to="/estimate">Get Estimate</Link>
            </Button>
          </div>
        </div>
      </Section>

      <Footer />
    </div>
  );
};

export default LocationPage;
