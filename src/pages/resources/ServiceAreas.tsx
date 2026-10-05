import { usePageContent } from "@/hooks/usePageContent";
import contentModule from "@/content/pages/resources-service-areas";
import {
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  Shield,
  Briefcase,
  Wrench,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { PageHero } from "@/components/shared/PageHero";
import { Card, CardContent } from "@/design-system/components/Card";
import { Button } from "@/ui/Button";
import SEO from "@/components/SEO";
import {
  serviceAreaCities,
  primaryServiceCities,
} from "@/data/service-area-cities";
import { resourceHeroes } from "@/data/hero-images";
import { Link } from "react-router-dom";
import { CTA_TEXT } from "@/design-system/constants";
import { TrustRibbon } from "@/design-system/components/TrustRibbon";
import { FAQAccordion } from "@/design-system/components/FAQAccordion";
import { RelatedLinksGrid } from "@/design-system/components/RelatedLinksGrid";
import { useSharedFaqs } from "@/hooks/useSharedContent";

const ServiceAreas = () => {
  const serviceAreasFaqs = useSharedFaqs("serviceAreasFaqs");
  const c = usePageContent(contentModule);

  const regions = [
    {
      name: c.f001,
      cities: [
        "Toronto",
        "Mississauga",
        "Brampton",
        "Vaughan",
        "Markham",
        c.f002,
      ],
      responseTime: "Same-day service available",
    },
    {
      name: c.f003,
      cities: ["Pickering", "Ajax", "Whitby", "Oshawa"],
      responseTime: "Next business day response",
    },
    {
      name: c.f004,
      cities: ["Newmarket", "Aurora", c.f005],
      responseTime: "Next business day response",
    },
    {
      name: c.f006,
      cities: ["Oakville", "Burlington", "Milton", "Hamilton"],
      responseTime: "Next business day response",
    },
  ];

  return (
    <>
      <SEO
        title={c.f007}
        description={c.f008}
        keywords="service areas, Toronto, GTA, building envelope contractor, facade remediation, specialty contractor, Mississauga, Brampton, Vaughan, Markham"
      />
      <div className="min-h-screen bg-background">
        <Navigation />

        <PageHero
          eyebrow={c.f009}
          title={c.f010}
          description={c.f011}
          image={resourceHeroes["service-areas"]}
          imageAlt={c.f012}
          height="small"
          primaryCta={{ text: c.f013, href: "/estimate" }}
          breadcrumbs={[
            { label: c.f014, href: "/" },
            { label: c.f015 },
            { label: c.f016 },
          ]}
        />

        <TrustRibbon />

        <main className="container mx-auto px-4 py-12 space-y-16">
          {/* Service Radius Section */}
          <section className="text-center max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-muted/50 to-muted/20 rounded-[var(--radius-lg)] p-8 mb-8 border-2 border-primary/10 shadow-[var(--shadow-lg)] animate-fade-in-up">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <MapPin className="h-8 w-8 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {c.f017}
              </h2>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 border border-primary/10 hover:border-primary/30 transition-colors">
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    {c.f018}
                  </h3>
                  <p className="text-muted-foreground text-sm">{c.f019}</p>
                </div>
                <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 border border-primary/10 hover:border-primary/30 transition-colors">
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    {c.f020}
                  </h3>
                  <p className="text-muted-foreground text-sm">{c.f021}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Primary Service Cities */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {c.f022}
            </h2>
            <p className="text-muted-foreground mb-8">{c.f023}</p>
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
              {primaryServiceCities.map((city, index) => {
                const slug = city.toLowerCase().replace(/\s+/g, "-");
                return (
                  <Link key={city} to={`/service-areas/${slug}`}>
                    <Card
                      className="text-center hover:shadow-[var(--shadow-lg)] hover:-translate-y-1 transition-all duration-300 group border-2 hover:border-primary/30 animate-fade-in-up p-0"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <CardContent className="p-6">
                        <CheckCircle2 className="h-8 w-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                        <h3 className="font-semibold text-foreground">
                          {city}
                        </h3>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Regional Breakdown */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-8">
              {c.f024}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {regions.map((region, index) => (
                <Card
                  key={index}
                  className="hover:shadow-[var(--shadow-lg)] hover:-translate-y-1 transition-all duration-300 border-2 hover:border-primary/30 animate-fade-in-up p-0"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-1">
                          {region.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {region.responseTime}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {region.cities.map((city) => {
                        const slug = city.toLowerCase().replace(/\s+/g, "-");
                        return (
                          <Link
                            key={city}
                            to={`/service-areas/${slug}`}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                          >
                            {city}
                          </Link>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* All Service Areas Grid */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {c.f025}
            </h2>
            <p className="text-muted-foreground mb-8">{c.f026}</p>
            <Card className="p-0">
              <CardContent className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {serviceAreaCities.map((city) => {
                    const slug = city.toLowerCase().replace(/\s+/g, "-");
                    return (
                      <Link
                        key={city}
                        to={`/service-areas/${slug}`}
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm text-foreground">{city}</span>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Coverage Details */}
          <section className="bg-muted/30 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              {c.f027}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover:shadow-[var(--shadow-lg)] hover:-translate-y-1 transition-all duration-300 group border-2 hover:border-primary/30 animate-fade-in-up p-0">
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/70 rounded-[var(--radius-lg)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Clock className="h-7 w-7 text-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {c.f028}
                  </h3>
                  <p className="text-sm text-muted-foreground">{c.f029}</p>
                </CardContent>
              </Card>
              <Card
                className="hover:shadow-[var(--shadow-lg)] hover:-translate-y-1 transition-all duration-300 group border-2 hover:border-primary/30 animate-fade-in-up p-0"
                style={{ animationDelay: "100ms" }}
              >
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/70 rounded-[var(--radius-lg)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="h-7 w-7 text-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {c.f030}
                  </h3>
                  <p className="text-sm text-muted-foreground">{c.f031}</p>
                </CardContent>
              </Card>
              <Card
                className="hover:shadow-[var(--shadow-lg)] hover:-translate-y-1 transition-all duration-300 group border-2 hover:border-primary/30 animate-fade-in-up p-0"
                style={{ animationDelay: "200ms" }}
              >
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/70 rounded-[var(--radius-lg)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle2 className="h-7 w-7 text-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {c.f032}
                  </h3>
                  <p className="text-sm text-muted-foreground">{c.f033}</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center py-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {c.f034}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              {c.f035}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/contact">
                  <Phone className="mr-2 h-5 w-5" />
                  {c.f036}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">{CTA_TEXT.project}</Link>
              </Button>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-3xl font-bold text-foreground text-center mb-4">
              {c.f037}
            </h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              {c.f038}
            </p>
            <div className="max-w-3xl mx-auto">
              <FAQAccordion faqs={serviceAreasFaqs} />
            </div>
          </section>
        </main>

        <RelatedLinksGrid
          title={c.f039}
          description={c.f040}
          links={[
            {
              title: c.f041,
              description: c.f042,
              href: "/capabilities",
              icon: Wrench,
            },
            {
              title: c.f043,
              description: c.f044,
              href: "/emergency-repair",
              icon: Shield,
            },
            {
              title: c.f045,
              description: c.f046,
              href: "/resources/contractor-portal",
              icon: Briefcase,
            },
          ]}
        />

        <Footer />
      </div>
    </>
  );
};

export default ServiceAreas;
