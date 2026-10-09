import { usePageContent } from "@/hooks/usePageContent";
import contentModule from "@/content/pages/for-architects";
import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/sections/Section";
import { SectionHeader } from "@/design-system/components/SectionHeader";
import { CapabilityCard } from "@/design-system/components/CapabilityCard";
import {
  OperationalProofBar,
  DEFAULT_PROOF_ITEMS,
} from "@/components/proof/OperationalProofBar";
import { Card } from "@/design-system/components/Card";
import { Button } from "@/ui/Button";
import { Link } from "react-router-dom";
import { PhoneLink } from "@/components/shared/PhoneLink";
import { TrustRibbon } from "@/design-system/components/TrustRibbon";
import { FAQAccordion } from "@/design-system/components/FAQAccordion";
import { RelatedLinksGrid } from "@/design-system/components/RelatedLinksGrid";
import { useSharedFaqs } from "@/hooks/useSharedContent";
import {
  Layers,
  FileText,
  CheckCircle,
  Ruler,
  Paintbrush,
  Wrench,
  Shield,
  Building2,
  ClipboardList,
  ArrowRight,
  Thermometer,
  Wind,
  Droplets,
  BookOpen,
  Microscope,
} from "lucide-react";
import { audienceHeroes } from "@/data/hero-images";

const projectTypes = [
  "Façade remediation & envelope restoration",
  "New construction envelope assemblies",
  "Parking garage membrane replacement",
  "Balcony waterproofing & drainage systems",
  "Air barrier installation & remediation",
  "Sealant replacement programs",
  "Heritage & heritage-adjacent restoration",
  "Continuous insulation retrofits",
  "Thermal bridging mitigation projects",
  "Multi-unit coating & re-cladding programs",
];

const ForArchitects = () => {
  const architectsFaqs = useSharedFaqs("architectsFaqs");
  const c = usePageContent(contentModule);
  const materialSystems = [
    {
      icon: Layers,
      title: c.f046,
      description: c.f047,
      stat: "15+ years crew experience",
    },
    {
      icon: Building2,
      title: c.f048,
      description: c.f049,
    },
    {
      icon: Wrench,
      title: c.f050,
      description: c.f051,
    },
    {
      icon: Paintbrush,
      title: c.f052,
      description: c.f053,
    },
    {
      icon: Shield,
      title: c.f054,
      description: c.f055,
    },
    {
      icon: Ruler,
      title: c.f056,
      description: c.f057,
    },
  ];
  const buildingSciencePrinciples = [
    {
      icon: Thermometer,
      title: c.f058,
      description: c.f059,
    },
    {
      icon: Wind,
      title: c.f060,
      description: c.f061,
    },
    {
      icon: Layers,
      title: c.f062,
      description: c.f063,
    },
    {
      icon: Droplets,
      title: c.f064,
      description: c.f065,
    },
  ];
  const standards = [
    { code: "OBC SB-10 / SB-12", description: c.f066 },
    { code: "ASHRAE 90.1", description: c.f067 },
    { code: "ASHRAE 62.1", description: c.f068 },
    { code: "CSA A371", description: c.f069 },
    { code: "CSA A23.1", description: c.f070 },
    { code: "ASTM E1105", description: c.f071 },
    { code: "ASTM E2178", description: c.f072 },
    { code: "ASTM C1363", description: c.f073 },
    { code: "CCMC", description: c.f074 },
    { code: "ABAA", description: c.f075 },
  ];
  const collaborationProcess = [
    {
      step: "01",
      title: c.f076,
      description: c.f077,
    },
    {
      step: "02",
      title: c.f078,
      description: c.f079,
    },
    {
      step: "03",
      title: c.f080,
      description: c.f081,
    },
    {
      step: "04",
      title: c.f082,
      description: c.f083,
    },
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title={c.f001}
        description={c.f002}
        keywords="building science contractor Ontario, air barrier installer GTA, hygrothermal performance contractor, ASHRAE 90.1 compliant envelope, specialty contractor for architects, facade contractor specifications, EIFS installer Ontario, rainscreen cladding contractor"
      />
      <Navigation />

      <PageHero
        eyebrow={c.f003}
        title={c.f004}
        description={c.f005}
        image={audienceHeroes["for-architects"]}
        imageAlt={c.f006}
        height="medium"
        primaryCta={{ text: c.f007, href: "/contact" }}
        secondaryCta={{ text: c.f008, href: "/capabilities" }}
        breadcrumbs={[{ label: c.f009, href: "/" }, { label: c.f010 }]}
        badges={[
          { icon: Microscope, text: c.f011 },
          { icon: FileText, text: c.f012 },
          { icon: CheckCircle, text: c.f013 },
        ]}
      />

      <TrustRibbon />
      <OperationalProofBar items={DEFAULT_PROOF_ITEMS} />

      {/* Material Systems Expertise */}
      <Section size="major">
        <SectionHeader
          badge="Material Systems"
          title={c.f014}
          description={c.f015}
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materialSystems.map((system) => (
            <CapabilityCard
              key={system.title}
              icon={system.icon}
              title={system.title}
              description={system.description}
              stat={system.stat}
            />
          ))}
        </div>
      </Section>

      {/* Building Science Principles */}
      <Section size="major" className="bg-muted/30">
        <SectionHeader
          badge="Building Science"
          title={c.f016}
          description={c.f017}
        />
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {buildingSciencePrinciples.map((item) => (
            <CapabilityCard
              key={item.title}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </Section>

      {/* Standards & Specifications */}
      <Section size="major">
        <SectionHeader
          badge="Codes & Standards"
          title={c.f018}
          description={c.f019}
        />
        <div className="max-w-4xl mx-auto">
          <Card variant="elevated" size="lg">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {standards.map((s) => (
                <div key={s.code} className="flex items-start gap-3">
                  <BookOpen className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-semibold">{s.code}</span>
                    <p className="text-xs text-muted-foreground">
                      {s.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Section>

      {/* How We Work With Design Teams */}
      <Section size="major" className="bg-muted/30">
        <SectionHeader
          badge="Collaboration"
          title={c.f020}
          description={c.f021}
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collaborationProcess.map((item) => (
            <Card
              key={item.step}
              variant="elevated"
              size="md"
              className="relative"
            >
              <span aria-hidden="true" className="text-4xl font-bold text-muted-foreground absolute top-4 right-4">
                {item.step}
              </span>
              <ClipboardList className="w-8 h-8 text-primary mb-3" />
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Typical Project Types */}
      <Section size="major">
        <SectionHeader
          badge="Project Scope"
          title={c.f022}
          description={c.f023}
        />
        <div className="max-w-3xl mx-auto">
          <Card variant="elevated" size="lg">
            <div className="grid sm:grid-cols-2 gap-4">
              {projectTypes.map((type) => (
                <div key={type} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{type}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Section>

      {/* Why Specify Ascent */}
      <Section size="major" className="bg-muted/30">
        <SectionHeader badge="Why Ascent" title={c.f024} description={c.f025} />
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card variant="elevated" size="md" hover>
            <FileText className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-semibold mb-2">{c.f026}</h3>
            <p className="text-sm text-muted-foreground">{c.f027}</p>
          </Card>
          <Card variant="elevated" size="md" hover>
            <Shield className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-semibold mb-2">{c.f028}</h3>
            <p className="text-sm text-muted-foreground">{c.f029}</p>
          </Card>
          <Card variant="elevated" size="md" hover>
            <Ruler className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-semibold mb-2">{c.f030}</h3>
            <p className="text-sm text-muted-foreground">{c.f031}</p>
          </Card>
        </div>
      </Section>

      {/* FAQs */}
      <Section size="major" maxWidth="narrow">
        <SectionHeader
          badge="Architect & Consultant FAQs"
          title={c.f032}
          description={c.f033}
        />
        <FAQAccordion faqs={architectsFaqs} />
      </Section>

      {/* Contact CTA */}
      <Section size="major">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{c.f034}</h2>
          <p className="text-lg text-muted-foreground mb-4">{c.f035}</p>
          <p className="text-muted-foreground mb-8">
            {c.f036}
            <PhoneLink className="text-primary font-medium" />
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/contact">
                {c.f037}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/prequalification">{c.f038}</Link>
            </Button>
          </div>
        </div>
      </Section>

      <RelatedLinksGrid
        title={c.f039}
        links={[
          {
            icon: BookOpen,
            title: c.f040,
            description: c.f041,
            href: "/capabilities",
          },
          {
            icon: FileText,
            title: c.f042,
            description: c.f043,
            href: "/prequalification",
          },
          {
            icon: Layers,
            title: c.f044,
            description: c.f045,
            href: "/services",
          },
        ]}
      />

      <Footer />
    </div>
  );
};

export default ForArchitects;
