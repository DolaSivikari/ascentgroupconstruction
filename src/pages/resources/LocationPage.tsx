import { usePageContent } from "@/hooks/usePageContent";
import { cityContentModule } from "@/content/cityModule";
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
import {
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  Building2,
  Home,
  Factory,
  HardHat,
  ArrowRight,
} from "lucide-react";
import { COMPANY_PHONE } from "@/constants/company";
import { PhoneLink } from "@/components/shared/PhoneLink";
import {
  serviceAreaCities,
  primaryServiceCities,
} from "@/data/service-area-cities";
import {
  generateBreadcrumbSchema,
  generateServiceSchema,
  COMPANY,
} from "@/utils/seo";
import { usePageAnalytics } from "@/hooks/usePageAnalytics";
import { supabase } from "@/integrations/supabase/client";
import { getCityHero } from "@/data/hero-images";

interface AreaProject {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  location: string | null;
  featured_image: string | null;
  category: string | null;
}

interface LocationData {
  name: string;
  slug: string;
  region: string;
  description: string;
  isPrimary: boolean;
}

const services = [
  "Façade Remediation & Repairs",
  "Building Envelope Solutions",
  "Waterproofing Systems",
  "EIFS & Stucco Systems",
  "Masonry Restoration",
  "Cladding Systems",
  "Protective & Architectural Coatings",
  "Parking Garage Restoration",
];

const LocationPage = () => {
  const { city } = useParams<{ city: string }>();
  const c = usePageContent(cityContentModule(city || "unknown"));
  const RELATED_SERVICES: { name: string; slug: string }[] = [
    { name: c.f045, slug: "building-envelope-solutions" },
    { name: c.f046, slug: "waterproofing-systems" },
    { name: c.f047, slug: "eifs-stucco-systems" },
    { name: c.f048, slug: "cladding-systems" },
    { name: c.f049, slug: "painting-services" },
    { name: c.f050, slug: "parking-garage-restoration" },
    { name: c.f051, slug: "sealant-programs" },
    { name: c.f052, slug: "sustainable-building" },
  ];
  const locationDetails: Record<string, LocationData> = {
    toronto: {
      name: c.f053,
      slug: "toronto",
      region: "ON",
      description: c.f054,
      isPrimary: true,
    },
    mississauga: {
      name: c.f055,
      slug: "mississauga",
      region: "ON",
      description: c.f056,
      isPrimary: true,
    },
    brampton: {
      name: c.f057,
      slug: "brampton",
      region: "ON",
      description: c.f058,
      isPrimary: true,
    },
    vaughan: {
      name: c.f059,
      slug: "vaughan",
      region: "ON",
      description: c.f060,
      isPrimary: true,
    },
    markham: {
      name: c.f061,
      slug: "markham",
      region: "ON",
      description: c.f062,
      isPrimary: true,
    },
    "richmond-hill": {
      name: c.f063,
      slug: "richmond-hill",
      region: "ON",
      description: c.f064,
      isPrimary: false,
    },
    oakville: {
      name: c.f065,
      slug: "oakville",
      region: "ON",
      description: c.f066,
      isPrimary: false,
    },
    burlington: {
      name: c.f067,
      slug: "burlington",
      region: "ON",
      description: c.f068,
      isPrimary: false,
    },
    hamilton: {
      name: c.f069,
      slug: "hamilton",
      region: "ON",
      description: c.f070,
      isPrimary: false,
    },
    ajax: {
      name: c.f071,
      slug: "ajax",
      region: "ON",
      description: c.f072,
      isPrimary: false,
    },
    pickering: {
      name: c.f073,
      slug: "pickering",
      region: "ON",
      description: c.f074,
      isPrimary: false,
    },
    whitby: {
      name: c.f075,
      slug: "whitby",
      region: "ON",
      description: c.f076,
      isPrimary: false,
    },
    oshawa: {
      name: c.f077,
      slug: "oshawa",
      region: "ON",
      description: c.f078,
      isPrimary: false,
    },
    newmarket: {
      name: c.f079,
      slug: "newmarket",
      region: "ON",
      description: c.f080,
      isPrimary: false,
    },
    aurora: {
      name: c.f081,
      slug: "aurora",
      region: "ON",
      description: c.f082,
      isPrimary: false,
    },
    milton: {
      name: c.f083,
      slug: "milton",
      region: "ON",
      description: c.f084,
      isPrimary: false,
    },
    "king-city": {
      name: c.f085,
      slug: "king-city",
      region: "ON",
      description: c.f086,
      isPrimary: false,
    },
  };

  const location = city ? locationDetails[city] : null;
  const locationName = location?.name;
  const [areaProjects, setAreaProjects] = useState<AreaProject[]>([]);

  usePageAnalytics(`service-area-${city}`);

  useEffect(() => {
    if (!locationName) return;
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select(
            "id, title, slug, summary, location, featured_image, category",
          )
          .eq("publish_state", "published")
          .ilike("location", `%${locationName}%`)
          .order("completion_date", { ascending: false, nullsFirst: false })
          .limit(3);
        if (!cancelled && !error && data)
          setAreaProjects(data as AreaProject[]);
      } catch {
        /* projects section is optional — silently degrade */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [locationName]);

  if (!location) {
    return (
      <div className="min-h-screen">
        <SEO title={c.f001} description={c.f002} noindex />
        <Navigation />
        <Section size="major">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{c.f003}</h1>
            <p className="text-muted-foreground mb-8">{c.f004}</p>
            <Button asChild>
              <Link to="/resources/service-areas">{c.f005}</Link>
            </Button>
          </div>
        </Section>
        <Footer />
      </div>
    );
  }

  // Generate structured data
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: c.f006, url: "/" },
    { name: c.f007, url: "/resources/service-areas" },
    { name: location.name, url: `/service-areas/${location.slug}` },
  ]);

  const serviceSchema = generateServiceSchema({
    name: `Building Envelope Services in ${location.name}`,
    description: `Professional building envelope, façade remediation, and restoration services in ${location.name}, ${location.region}. WSIB compliant, $2M insured specialty contractor.`,
    slug: `service-areas/${location.slug}`,
    path: `/service-areas/${location.slug}`,
    areaServed: location.name,
  });

  const hero = getCityHero(location.slug);

  const otherCities = Object.values(locationDetails)
    .filter((l) => l.slug !== location.slug)
    .slice(0, 6);

  return (
    <div className="min-h-screen">
      <SEO
        title={`Building Envelope Contractor in ${location.name} | Ascent Group`}
        description={`Professional building envelope, façade remediation, waterproofing, and restoration services in ${location.name}, ${location.region}. WSIB compliant, $2M insured. Call ${COMPANY_PHONE}.`}
        keywords={`building envelope contractor ${location.name}, facade remediation ${location.name}, waterproofing ${location.name}, EIFS contractor ${location.name}, masonry restoration ${location.name}`}
        structuredData={[breadcrumbSchema, serviceSchema]}
      />
      <Navigation />

      <PageHero
        title={`Building Envelope Services in ${location.name}`}
        description={`Professional façade remediation, waterproofing, and restoration services for ${location.name} properties. WSIB compliant, $2M CGL insured specialty contractor.`}
        height="medium"
        image={hero.image}
        imageAlt={hero.imageAlt}
        primaryCta={{ text: CTA_TEXT.contact, href: "/contact" }}
        secondaryCta={{ text: c.f008, href: "/estimate" }}
        breadcrumbs={[
          { label: c.f009, href: "/" },
          { label: c.f010, href: "/resources/service-areas" },
          { label: location.name },
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
        <Card
          variant="elevated"
          size="lg"
          className="mt-8 border-l-4 border-primary"
        >
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <Phone className="w-6 h-6 text-primary" />
              <div>
                <p className="font-semibold">{c.f011}</p>
                <PhoneLink
                  showIcon={false}
                  className="text-primary hover:underline"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-primary" />
              <div>
                <p className="font-semibold">{c.f012}</p>
                <p className="text-muted-foreground">{c.f013}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-primary" />
              <div>
                <p className="font-semibold">{c.f014}</p>
                <p className="text-muted-foreground">
                  {location.name} {c.f015}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </Section>

      {/* Services We Offer */}
      <Section size="major" className="bg-muted/50">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {c.f016}
            {location.name}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {c.f017}
            {location.name} {c.f018}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <Card
              key={index}
              variant="default"
              size="md"
              className="hover:border-primary/50 transition-colors"
            >
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
            {c.f019}
            {location.name}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <Card variant="elevated" size="md" hover>
            <Building2 className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-semibold mb-2">{c.f020}</h3>
            <p className="text-sm text-muted-foreground">{c.f021}</p>
          </Card>
          <Card variant="elevated" size="md" hover>
            <Factory className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-semibold mb-2">{c.f022}</h3>
            <p className="text-sm text-muted-foreground">{c.f023}</p>
          </Card>
          <Card variant="elevated" size="md" hover>
            <HardHat className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-semibold mb-2">{c.f024}</h3>
            <p className="text-sm text-muted-foreground">{c.f025}</p>
          </Card>
          <Card variant="elevated" size="md" hover>
            <Home className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-semibold mb-2">{c.f026}</h3>
            <p className="text-sm text-muted-foreground">{c.f027}</p>
          </Card>
        </div>
      </Section>

      {/* Coverage Map */}
      <Section size="major" className="bg-muted/50">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {c.f028}
            {location.name}, {location.region}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {c.f029}
          </p>
        </div>
        <Card
          variant="elevated"
          size="lg"
          className="overflow-hidden p-0 max-w-5xl mx-auto"
        >
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
            {c.f030}
            {location.name}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {c.f031}
            {location.name} {c.f032}
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
                {c.f033}
                {location.name}
              </p>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button asChild variant="outline">
            <Link to="/services">{c.f034}</Link>
          </Button>
        </div>
      </Section>

      {/* Featured Projects in Area */}
      {areaProjects.length > 0 && (
        <Section size="major" className="bg-muted/50">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {c.f035}
              {location.name}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {c.f036}
              {location.name}.
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
              <Link to="/projects">{c.f037}</Link>
            </Button>
          </div>
        </Section>
      )}

      {/* Other Service Areas */}
      <Section size="major" className="bg-muted/50">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{c.f038}</h2>
          <p className="text-lg text-muted-foreground">{c.f039}</p>
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
            <Link to="/resources/service-areas">{c.f040}</Link>
          </Button>
        </div>
      </Section>

      {/* CTA */}
      <Section size="major" className="bg-primary text-primary-foreground">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {c.f041}
            {location.name} {c.f042}
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8">{c.f043}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/contact">{CTA_TEXT.contact}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Link to="/estimate">{c.f044}</Link>
            </Button>
          </div>
        </div>
      </Section>

      <Footer />
    </div>
  );
};

export default LocationPage;
