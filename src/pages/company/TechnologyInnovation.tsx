import { SITE_URL } from "@/constants/company";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/sections/Section";
import { SectionHeader } from "@/design-system/components/SectionHeader";
import { CapabilityCard } from "@/design-system/components/CapabilityCard";
import { CTABand } from "@/design-system/components/CTABand";
import { resourceHeroes } from "@/data/hero-images";
import {
  FileSearch, Camera, ClipboardList, FolderCheck,
  Box, MonitorSmartphone, Rocket, Info, ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const CURRENT_TOOLS = [
  {
    icon: FileSearch,
    title: "Digital Markup & Plan Review",
    description:
      "We use Bluebeam for takeoffs, document markup, and collaborative plan review. This allows our estimating and project teams to work from a single coordinated set of documents.",
  },
  {
    icon: Camera,
    title: "Photo Documentation",
    description:
      "Systematic progress photos and condition documentation on every project. Visual records support quality assurance, client reporting, and warranty claims.",
  },
  {
    icon: ClipboardList,
    title: "Digital Reporting",
    description:
      "Daily reports, progress tracking, and client-facing project updates delivered digitally. Our teams log site activity, labour, materials, and weather conditions daily.",
  },
  {
    icon: FolderCheck,
    title: "Closeout Packages",
    description:
      "Digital assembly of warranty certificates, product data sheets, as-built records, and lien releases. Organized packages delivered to clients on project completion.",
  },
];

const COORDINATION_CAPABILITIES = [
  {
    icon: Box,
    title: "BIM & 3D Coordination",
    description:
      "Our team has experience working within BIM workflows and 3D coordination processes on GC-led projects. We can receive, interpret, and work from BIM models when provided by the project team.",
  },
  {
    icon: MonitorSmartphone,
    title: "Project Management Platforms",
    description:
      "We integrate with Procore, BIM 360, and other PM platforms when required by the project team. Our staff can navigate these systems for document management, RFIs, and submittals.",
  },
];

const TechnologyInnovation = () => {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://ascentgroupconstruction.com/" },
      { "@type": "ListItem", position: 2, name: "Company", item: "https://ascentgroupconstruction.com/about" },
      { "@type": "ListItem", position: 3, name: "Technology & Digital Tools" },
    ],
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Technology & Digital Tools | Ascent Group Construction"
        description="How Ascent Group Construction uses digital tools for plan review, documentation, closeout packages, and project coordination across the GTA."
        keywords="construction technology, Bluebeam, BIM coordination, digital closeout, project documentation"
        structuredData={[breadcrumbSchema]}
      />
      <Navigation />

      <PageHero
        title="Technology & Digital Tools"
        description="How we use digital tools to improve coordination, documentation, and project quality"
        image={resourceHeroes["service-areas"]}
        imageAlt="Digital tools used in construction project coordination"
        height="small"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Company", href: "/about" },
          { label: "Technology & Digital Tools" },
        ]}
      />

      <main>
        {/* Intro */}
        <Section size="subsection">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              How We Work Digitally
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Ascent Group Construction uses digital tools to support accurate estimating,
              clear documentation, and coordinated project delivery. These tools help us
              reduce errors, communicate effectively with project teams, and deliver
              complete closeout packages on every project.
            </p>
          </div>
        </Section>

        {/* Current Practice */}
        <Section size="major" className="bg-muted/30">
          <SectionHeader
            title="Current Practice"
            description="Tools and workflows we use on our projects today"
          />
          <div className="grid md:grid-cols-2 gap-8">
            {CURRENT_TOOLS.map((tool, i) => (
              <CapabilityCard
                key={i}
                icon={tool.icon}
                title={tool.title}
                description={tool.description}
              />
            ))}
          </div>
        </Section>

        {/* Coordination Capabilities */}
        <Section size="major">
          <SectionHeader
            title="Coordination Capabilities"
            description="What our team can integrate with when the project requires it"
          />
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {COORDINATION_CAPABILITIES.map((cap, i) => (
              <CapabilityCard
                key={i}
                icon={cap.icon}
                title={cap.title}
                description={cap.description}
              />
            ))}
          </div>
        </Section>

        {/* Cross-links */}
        <Section size="subsection" className="bg-muted/30">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-6 bg-background rounded-lg border">
              <h3 className="text-xl font-bold mb-3">See How We Apply These Tools</h3>
              <p className="text-muted-foreground mb-4">
                Our 7-step delivery process integrates digital documentation at every stage — from site assessment through closeout.
              </p>
              <Link
                to="/our-process"
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                View Our Process <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-6 bg-background rounded-lg border">
              <h3 className="text-xl font-bold mb-3">Pre-Qualification Documents</h3>
              <p className="text-muted-foreground mb-4">
                Download our capability statement, insurance certificates, and safety documentation.
              </p>
              <Link
                to="/prequalification"
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                View Pre-Qualification <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Section>

        {/* Future Investment — clearly labeled */}
        <Section size="subsection" className="bg-muted/20">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-start gap-3 mb-6">
              <div className="p-2 rounded-lg bg-accent/10 mt-1">
                <Rocket className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                  Future Investment
                </h2>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  Development roadmap — not current standard practice
                </p>
              </div>
            </div>
            <p className="text-base text-muted-foreground leading-relaxed">
              We are actively evaluating expanded digital capabilities including
              drone-based progress monitoring, digital twin documentation, and advanced
              scheduling integration. As we grow, we plan to invest in these tools where
              they deliver measurable value to our clients and project teams. These
              represent our development roadmap, not current standard practice.
            </p>
          </div>
        </Section>

        {/* CTA */}
        <CTABand
          title="Ready to Discuss Your Project?"
          description="Contact our team to learn how we coordinate and deliver projects."
          primaryCta={{ text: "Contact Us", href: "/contact" }}
          secondaryCta={{ text: "View Our Process", href: "/our-process" }}
          variant="dark"
        />
      </main>

      <Footer />
    </div>
  );
};

export default TechnologyInnovation;
