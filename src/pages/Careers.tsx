import { usePageContent } from "@/hooks/usePageContent";
import contentModule from "@/content/pages/careers";
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { PageHero } from "@/components/shared/PageHero";
import { Card, CardContent } from "@/design-system/components/Card";
import { Button } from "@/ui/Button";
import { Link } from "react-router-dom";
import ResumeSubmissionDialog from "@/components/ResumeSubmissionDialog";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { mainPageHeroes } from "@/data/hero-images";
import { Section } from "@/components/sections/Section";
import { TrustRibbon } from "@/design-system/components/TrustRibbon";
import { FAQAccordion } from "@/design-system/components/FAQAccordion";
import { RelatedLinksGrid } from "@/design-system/components/RelatedLinksGrid";
import { useSharedFaqs } from "@/hooks/useSharedContent";
import {
  Shield,
  Target,
  HardHat,
  TrendingUp,
  ArrowRight,
  Paintbrush,
  Wrench,
  ClipboardList,
  Calculator,
  Briefcase,
  Users,
  Building2,
} from "lucide-react";

const Careers = () => {
  const careersFaqs = useSharedFaqs("careersFaqs");
  const c = usePageContent(contentModule);

  const [dialogOpen, setDialogOpen] = useState(false);

  const values = [
    {
      icon: Shield,
      title: c.f001,
      description: c.f002,
    },
    {
      icon: Target,
      title: c.f003,
      description: c.f004,
    },
    {
      icon: HardHat,
      title: c.f005,
      description: c.f006,
    },
    {
      icon: TrendingUp,
      title: c.f007,
      description: c.f008,
    },
  ];

  const tradeCategories = [
    {
      icon: Paintbrush,
      title: c.f009,
      description: c.f010,
    },
    {
      icon: Wrench,
      title: c.f011,
      description: c.f012,
    },
    {
      icon: HardHat,
      title: c.f013,
      description: c.f014,
    },
    {
      icon: ClipboardList,
      title: c.f015,
      description: c.f016,
    },
    {
      icon: Calculator,
      title: c.f017,
      description: c.f018,
    },
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title={c.f019}
        description={c.f020}
        keywords="construction careers GTA, envelope restoration jobs, specialty contractor careers, painting jobs toronto, construction trades ontario, masonry jobs GTA"
      />
      <Navigation />

      <PageHero
        title={c.f021}
        description={c.f022}
        image={mainPageHeroes.careers}
        imageAlt={c.f023}
        height="medium"
        primaryCta={{ text: c.f024, href: "#connect" }}
        breadcrumbs={[{ label: c.f025, href: "/" }, { label: c.f026 }]}
      />

      <TrustRibbon />

      <main>
        {/* Who We Are */}
        <Section>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">{c.f027}</h2>
            <div className="space-y-4 text-lg text-muted-foreground">
              <p>{c.f028}</p>
              <p>{c.f029}</p>
            </div>
          </div>
        </Section>

        {/* What We Value */}
        <Section className="bg-muted/30">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{c.f030}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {c.f031}
            </p>
          </div>

          <ScrollReveal direction="up">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {values.map((value, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow p-0"
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <value.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollReveal>
        </Section>

        {/* Trades & Roles */}
        <Section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{c.f032}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {c.f033}
            </p>
          </div>

          <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tradeCategories.map((category, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow p-0"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <category.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{category.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        {/* How to Connect */}
        <div id="connect">
          <Section className="bg-muted/30">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6">{c.f034}</h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>{c.f035}</p>
                    <p>{c.f036}</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        {c.f037}
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        {c.f038}
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        {c.f039}
                      </li>
                    </ul>
                  </div>
                </div>

                <Card className="bg-primary text-primary-foreground p-0">
                  <CardContent className="p-8">
                    <HardHat className="w-12 h-12 mb-6 text-secondary" />
                    <h3 className="text-2xl font-bold mb-4">{c.f040}</h3>
                    <p className="mb-6 opacity-90">{c.f041}</p>
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={() => setDialogOpen(true)}
                    >
                      {c.f042}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Section>
        </div>

        {/* FAQ */}
        <Section className="bg-muted/30">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">{c.f043}</h2>
            <p className="text-center text-muted-foreground mb-8">{c.f044}</p>
            <FAQAccordion faqs={careersFaqs} />
          </div>
        </Section>

        {/* Related Resources */}
        <RelatedLinksGrid
          title={c.f045}
          description={c.f046}
          links={[
            { title: c.f047, description: c.f048, href: "/about", icon: Users },
            {
              title: c.f049,
              description: c.f050,
              href: "/our-process",
              icon: Briefcase,
            },
            {
              title: c.f051,
              description: c.f052,
              href: "/capabilities",
              icon: Building2,
            },
          ]}
        />
      </main>

      <ResumeSubmissionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        jobTitle="General Application"
      />

      <Footer />
    </div>
  );
};

export default Careers;
