import { usePageContent } from "@/hooks/usePageContent";
import contentModule from "@/content/pages/our-process";
import {
  Card,
  CardTitle,
  CardDescription,
} from "@/design-system/components/Card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/sections/Section";
import { SectionHeader } from "@/design-system/components/SectionHeader";
import { CTABand } from "@/design-system/components/CTABand";
import { ProofStrip } from "@/design-system/components/ProofStrip";
import { FAQAccordion, StickyPageNav } from "@/design-system/components";
import { useSharedFaqs } from "@/hooks/useSharedContent";
import { generateHowToSchema } from "@/utils/faq-schema";
import AnimatedProcessTimeline from "@/components/timeline/AnimatedProcessTimeline";
import { companyHeroes } from "@/data/hero-images";
import { Link } from "react-router-dom";
import { ArrowRight, MessageSquare, FileText, Clock } from "lucide-react";

const OurProcess = () => {
  const ourProcessFaqs = useSharedFaqs("ourProcessFaqs");
  const c = usePageContent(contentModule);
  const processSteps = [
    {
      step: 1,
      title: c.f042,
      duration: "1–2 days",
      description: c.f043,
      details: [c.f044, c.f045, c.f046, c.f047],
      deliverables: [c.f048, c.f049, c.f050],
    },
    {
      step: 2,
      title: c.f051,
      duration: "1–3 days",
      description: c.f052,
      details: [c.f053, c.f054, c.f055, c.f056, c.f057],
      deliverables: [c.f058, c.f059, c.f060],
    },
    {
      step: 3,
      title: c.f061,
      duration: "2–5 days",
      description: c.f062,
      details: [c.f063, c.f064, c.f065, c.f066, c.f067],
      deliverables: [c.f068, c.f069, c.f070],
    },
    {
      step: 4,
      title: c.f071,
      duration: "3–10 days",
      description: c.f072,
      details: [c.f073, c.f074, c.f075, c.f076, c.f077],
      deliverables: [c.f078, c.f079, c.f080],
    },
    {
      step: 5,
      title: c.f081,
      duration: "Varies by scope",
      description: c.f082,
      details: [c.f083, c.f084, c.f085, c.f086, c.f087],
      deliverables: [c.f088, c.f089, c.f090],
    },
    {
      step: 6,
      title: c.f091,
      duration: "3–5 days",
      description: c.f092,
      details: [c.f093, c.f094, c.f095, c.f096, c.f097],
      deliverables: [c.f098, c.f099, c.f100],
    },
    {
      step: 7,
      title: c.f101,
      duration: "Ongoing",
      description: c.f102,
      details: [c.f103, c.f104, c.f105, c.f106],
      deliverables: [c.f107, c.f108, c.f109],
    },
  ];

  const howToSchema = generateHowToSchema({
    name: c.f001,
    description: c.f002,
    steps: processSteps.map((step) => ({
      name: step.title,
      text: step.description + " " + step.details.join(". "),
    })),
    totalTime: "P30D",
  });

  return (
    <div className="min-h-screen">
      <SEO
        title={c.f003}
        description={c.f004}
        keywords="construction process, how we work, project delivery, site assessment, closeout documentation, construction coordination"
        structuredData={howToSchema}
      />

      <Navigation />

      <PageHero
        eyebrow={c.f005}
        title={c.f006}
        description={c.f007}
        image={companyHeroes["our-process"]}
        imageAlt={c.f008}
        primaryCta={{ text: c.f009, href: "/estimate" }}
        breadcrumbs={[{ label: c.f010, href: "/" }, { label: c.f011 }]}
        badges={[
          { icon: MessageSquare, text: c.f012 },
          { icon: FileText, text: c.f013 },
          { icon: Clock, text: c.f014 },
        ]}
      />

      <StickyPageNav
        sections={[
          { id: "process-trust", label: c.f015 },
          { id: "process-timeline", label: c.f016 },
          { id: "process-cross", label: c.f017 },
          { id: "process-faq", label: c.f018 },
        ]}
      />

      {/* Trust Badges */}
      <div id="process-trust" className="scroll-mt-24">
        <Section size="tight">
          <ProofStrip
            items={[
              { value: "WSIB", label: c.f020 },
              { value: "$2M", label: c.f022 },
              { value: "15+", label: c.f023 },
              { value: "85%", label: c.f024 },
            ]}
            variant="dark"
            columns={4}
          />
        </Section>
      </div>

      {/* 7-Step Timeline */}
      <div id="process-timeline" className="scroll-mt-24">
        <Section size="major">
          <SectionHeader title={c.f025} description={c.f026} />
          <AnimatedProcessTimeline steps={processSteps} />
        </Section>
      </div>

      {/* Cross-links */}
      <div id="process-cross" className="scroll-mt-24">
        <Section size="major" className="bg-muted/30">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardTitle className="mb-3">{c.f027}</CardTitle>
              <CardDescription className="mb-4">{c.f028}</CardDescription>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                {c.f029}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Card>
            <Card>
              <CardTitle className="mb-3">{c.f030}</CardTitle>
              <CardDescription className="mb-4">{c.f031}</CardDescription>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                {c.f032}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Card>
            <Card>
              <CardTitle className="mb-3">{c.f033}</CardTitle>
              <CardDescription className="mb-4">{c.f034}</CardDescription>
              <Link
                to="/prequalification"
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                {c.f035}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Card>
          </div>
        </Section>
      </div>

      {/* People Also Ask */}
      <div id="process-faq" className="scroll-mt-24">
        <Section size="major" className="bg-muted/30">
          <SectionHeader title={c.f036} description={c.f037} badge="FAQ" />
          <div className="max-w-3xl mx-auto">
            <FAQAccordion faqs={ourProcessFaqs} />
          </div>
        </Section>
      </div>

      {/* CTA */}
      <CTABand
        title={c.f038}
        description={c.f039}
        primaryCta={{ text: c.f040, href: "/estimate" }}
        secondaryCta={{ text: c.f041, href: "/contact" }}
        variant="dark"
      />

      <Footer />
    </div>
  );
};

export default OurProcess;
