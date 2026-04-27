import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/sections/Section";
import { SectionHeader } from "@/design-system/components/SectionHeader";
import { CTABand } from "@/design-system/components/CTABand";
import { ProofStrip } from "@/design-system/components/ProofStrip";
import { FAQAccordion, StickyPageNav } from "@/design-system/components";
import { ourProcessFaqs } from "@/data/page-faqs";
import { generateHowToSchema } from "@/utils/faq-schema";
import AnimatedProcessTimeline from "@/components/timeline/AnimatedProcessTimeline";
import { companyHeroes } from "@/data/hero-images";
import { Link } from "react-router-dom";
import { ArrowRight, MessageSquare, FileText, Clock } from "lucide-react";

const processSteps = [
  {
    step: 1,
    title: "Inquiry & Scope Review",
    duration: "1–2 days",
    description:
      "You reach out with a scope, RFP, or project question. We review requirements, confirm alignment with our capabilities, and respond with initial availability and trade relevance.",
    details: [
      "Review incoming RFP, tender, or scope documents",
      "Confirm alignment with our trade capabilities (envelope, restoration, interior finishes)",
      "Identify scope boundaries and flag any items outside our core trades",
      "Respond with initial availability and next steps",
    ],
    deliverables: ["Scope Confirmation", "Initial Availability", "Next Steps Outline"],
  },
  {
    step: 2,
    title: "Site Assessment",
    duration: "1–3 days",
    description:
      "We visit the site to assess conditions, measure surfaces, identify access constraints, and document existing conditions with photos and notes.",
    details: [
      "On-site inspection and condition assessment",
      "Surface measurement and quantity takeoff",
      "Access planning: scaffolding, swing stages, lifts, occupied-building constraints",
      "Photo documentation of existing conditions",
      "Identification of potential risks or coordination requirements",
    ],
    deliverables: ["Site Photos", "Condition Report", "Access Plan"],
  },
  {
    step: 3,
    title: "Estimate & Proposal",
    duration: "2–5 days",
    description:
      "Detailed proposal with scope breakdown, material specifications, schedule options, and pricing. Line-item transparency, not lump-sum guesswork.",
    details: [
      "Line-item pricing by trade and activity",
      "Material specifications and product data",
      "Schedule options with milestone dates",
      "Exclusions and assumptions clearly stated",
      "Contract type recommendation (lump sum, unit price, T&M)",
    ],
    deliverables: ["Detailed Proposal", "Material Specs", "Schedule Options"],
  },
  {
    step: 4,
    title: "Pre-Construction Coordination",
    duration: "3–10 days",
    description:
      "Scheduling, material procurement, access planning, safety documentation, and coordination with other trades or building operations.",
    details: [
      "Material procurement and lead-time management",
      "Safety documentation: WSIB, site-specific safety plan, toolbox talks",
      "Coordination with other trades, building management, or GC superintendent",
      "Access scheduling: after-hours work, tenant notifications, phased approach",
      "Mock-ups or samples for client approval (when applicable)",
    ],
    deliverables: ["Safety Plan", "Procurement Schedule", "Coordination Plan"],
  },
  {
    step: 5,
    title: "Execution & Reporting",
    duration: "Varies by scope",
    description:
      "Our crews mobilize with daily cleanup, progress photos, and weekly reporting. Direct communication with your project manager or site contact.",
    details: [
      "Crew mobilization with dedicated project lead",
      "Daily progress photos and site cleanup",
      "Weekly written progress reports",
      "Real-time issue resolution and change order tracking",
      "Quality inspections at key milestones",
    ],
    deliverables: ["Progress Photos", "Weekly Reports", "Quality Records"],
  },
  {
    step: 6,
    title: "Closeout & Documentation",
    duration: "3–5 days",
    description:
      "Final walkthrough, punch-list resolution, warranty documentation, as-built records, and lien releases.",
    details: [
      "Final walkthrough with client or GC representative",
      "Punch-list creation and resolution",
      "Warranty documentation and manufacturer certificates",
      "Product data sheets and material compliance records",
      "Lien releases and final invoicing",
    ],
    deliverables: ["Punch List Resolution", "Warranty Package", "Closeout Binder"],
  },
  {
    step: 7,
    title: "Post-Project Support",
    duration: "Ongoing",
    description:
      "Warranty service, maintenance guidance, and availability for follow-up scopes. We stay responsive after the job is done.",
    details: [
      "Warranty service for deficiency claims",
      "Maintenance guidance and care instructions",
      "Priority scheduling for follow-up or recurring scopes",
      "Availability for emergency response (active leaks, storm damage)",
    ],
    deliverables: ["Warranty Service", "Maintenance Guide", "Priority Access"],
  },
];

const OurProcess = () => {
  const howToSchema = generateHowToSchema({
    name: "How Ascent Group Construction Delivers Your Project",
    description:
      "Our 7-step process from inquiry through post-project support ensures clear communication, quality execution, and complete documentation on every scope.",
    steps: processSteps.map((step) => ({
      name: step.title,
      text: step.description + " " + step.details.join(". "),
    })),
    totalTime: "P30D",
  });

  return (
    <div className="min-h-screen">
      <SEO
        title="How We Work — From Inquiry to Closeout | Ascent Group Construction"
        description="Our 7-step process covers inquiry, site assessment, estimating, pre-construction, execution, closeout, and post-project support. Transparent communication and documentation at every stage."
        keywords="construction process, how we work, project delivery, site assessment, closeout documentation, construction coordination"
        structuredData={howToSchema}
      />

      <Navigation />

      <PageHero
        eyebrow="How We Work"
        title="From Inquiry to Closeout"
        description="A clear, repeatable process for every project — transparent communication, documented progress, and accountability at every stage."
        image={companyHeroes["our-process"]}
        imageAlt="Ascent Group Construction project execution"
        primaryCta={{ text: "Start a Project", href: "/estimate" }}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "How We Work" },
        ]}
        badges={[
          { icon: MessageSquare, text: "Transparent Communication" },
          { icon: FileText, text: "Documented Progress" },
          { icon: Clock, text: "On-Time Delivery" },
        ]}
      />

      <StickyPageNav
        sections={[
          { id: "process-trust", label: "Trust" },
          { id: "process-timeline", label: "7-Step Process" },
          { id: "process-cross", label: "Related" },
          { id: "process-faq", label: "FAQ" },
        ]}
      />

      {/* Trust Badges */}
      <div id="process-trust" className="scroll-mt-24">
      <Section size="tight">
        <ProofStrip
          items={[
            { value: "WSIB", label: "Active Registration" },
            { value: "$2M", label: "CGL Coverage" },
            { value: "15+", label: "Years Team Experience" },
            { value: "85%", label: "Self-Performed Work" },
          ]}
          variant="dark"
          columns={4}
        />
      </Section>
      </div>

      {/* 7-Step Timeline */}
      <div id="process-timeline" className="scroll-mt-24">
      <Section size="major">
        <SectionHeader
          title="7 Steps, Start to Finish"
          description="Every project follows this sequence — from initial scope review through warranty support"
        />
        <AnimatedProcessTimeline steps={processSteps} />
      </Section>
      </div>

      {/* Cross-links */}
      <div id="process-cross" className="scroll-mt-24">
      <Section size="major" className="bg-muted/30">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-6 bg-background rounded-lg border">
            <h3 className="text-xl font-bold mb-3">View Our Services</h3>
            <p className="text-muted-foreground mb-4">
              Building envelope, restoration, interior finishes, and specialty coatings — see the full scope of what we execute.
            </p>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              Explore Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-6 bg-background rounded-lg border">
            <h3 className="text-xl font-bold mb-3">See Our Project Work</h3>
            <p className="text-muted-foreground mb-4">
              Browse completed envelope, restoration, and interior projects across the GTA.
            </p>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              View Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-6 bg-background rounded-lg border">
            <h3 className="text-xl font-bold mb-3">Pre-Qualification Docs</h3>
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
      </div>

      {/* People Also Ask */}
      <div id="process-faq" className="scroll-mt-24">
      <Section size="major" className="bg-muted/30">
        <SectionHeader
          title="People Also Ask"
          description="Common questions about our project process and timelines."
          badge="FAQ"
        />
        <div className="max-w-3xl mx-auto">
          <FAQAccordion faqs={ourProcessFaqs} />
        </div>
      </Section>
      </div>

      {/* CTA */}
      <CTABand
        title="Ready to Start a Project?"
        description="Request a consultation and detailed proposal. No pressure — just honest advice and transparent pricing."
        primaryCta={{ text: "Request a Quote", href: "/estimate" }}
        secondaryCta={{ text: "Contact Us", href: "/contact" }}
        variant="dark"
      />

      <Footer />
    </div>
  );
};

export default OurProcess;
