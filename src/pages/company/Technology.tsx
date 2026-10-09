import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/constants/company";
import SEO from "@/components/SEO";
import { lazy, Suspense } from "react";
import { DeferredContent } from "@/pages/redesign/DeferredContent";
import { Card } from "@/design-system/components/Card";
import { SectionHeader } from "@/design-system/components/SectionHeader";
import { BEFORE_AFTER, AUDIENCE_TABS } from "./technology/data";
import ProcessExplorer from "./technology/sections/ProcessExplorer";
import "./technology/technology.css";
import { CTABand } from "@/design-system/components/CTABand";
import { PageHero } from "@/components/shared/PageHero";
import { companyHeroes } from "@/data/hero-images";
import { CrossLinks } from "./technology/sections/CrossLinks";
import { FAQAccordion } from "@/design-system/components/FAQAccordion";
import { technologyFaqs } from "@/data/page-faqs";

const TOOL_STRIP = [
  "Bluebeam",
  "PlanSwift",
  "ZZTAKEOFF",
  "Procore",
  "AutoCAD / DWG",
  "BIM 360",
];

const InteractiveModels = lazy(
  () => import("./technology/sections/InteractiveModels"),
);
const ClientDeliverables = lazy(
  () => import("./technology/sections/ClientDeliverables"),
);

const Technology = () => {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Company",
        item: `${SITE_URL}/about`,
      },
      { "@type": "ListItem", position: 3, name: "Technology & Digital Tools" },
    ],
  };

  return (
    <div className="technology-redesign">
      <SEO
        title="Technology & Digital Tools"
        description="Ascent Group Construction uses Bluebeam, Procore, BIM 360, and digital documentation workflows to deliver coordinated, accountable specialty trade projects across the GTA."
        keywords="construction technology, Bluebeam, Procore, BIM coordination, digital closeout, specialty contractor documentation, GTA construction"
        structuredData={[breadcrumbSchema]}
      />
      <Navigation />

      <main>
        <div className="relative">
          <PageHero
            eyebrow="Technology & Documentation"
            title="Built on Digital Precision"
            description="From the first site assessment to the final closeout package — every step of our process is documented, coordinated, and accountable. No verbal-only updates, no retroactive records."
            image={companyHeroes.technology}
            imageAlt="Ascent Group digital construction technology"
            height="small"
            overlay="gradient"
            stats={[
              { value: "5 Steps", label: "Documented from start to finish" },
              { value: "Daily", label: "Field reports with photos" },
              { value: "Digital", label: "Closeout package" },
            ]}
            breadcrumbs={[
              { label: "Home", href: "/" },
              { label: "Company", href: "/about" },
              { label: "Technology & Digital Tools" },
            ]}
            primaryCta={{
              text: "Explore the interactive models",
              href: "#models",
            }}
            secondaryCta={{ text: "Try the workflow demos", href: "#workflow" }}
          />

          <div className="border-b border-border bg-muted/30 py-4">
            <div className="container mx-auto flex flex-wrap gap-2 px-6 text-foreground">
              <span className="mr-2 self-center text-xs font-semibold uppercase tracking-wider">
                Tools we use
              </span>
              {TOOL_STRIP.map((tool) => (
                <span
                  key={tool}
                  className="rounded border border-border bg-background px-2 py-1 text-xs"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        <section
          id="models"
          className="scroll-mt-24 bg-primary py-12 text-primary-foreground"
        >
          <div className="container px-4 md:px-6">
            <div className="mb-8 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground/70">
                Interactive models
              </p>
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                See how we read a building
              </h2>
              <p className="mx-auto max-w-2xl text-primary-foreground/80">
                Turn a blueprint into a building, take a wall apart layer by
                layer, or explore the project record. Start with Build it, or
                drag to look around.
              </p>
            </div>
            <DeferredContent>
              <Suspense
                fallback={<p role="status">Loading construction models…</p>}
              >
                <InteractiveModels />
              </Suspense>
            </DeferredContent>
          </div>
        </section>
        <section id="workflow" className="scroll-mt-24 py-12">
          <div className="container px-4 md:px-6">
            <SectionHeader
              badge="See the workflow"
              title="Try what our clients receive"
              description="The bid, the measured takeoff, the working-day report and the handover package. Every example is a clearly labelled sample."
              className="mb-8"
            />
            <DeferredContent>
              <Suspense
                fallback={<p role="status">Loading sample documents…</p>}
              >
                <ClientDeliverables />
              </Suspense>
            </DeferredContent>
          </div>
        </section>
        <section id="process" className="scroll-mt-24 bg-muted/30 py-10">
          <div className="container px-4 md:px-6">
            <SectionHeader
              badge="From site walk to closeout"
              title="Five steps, all on record"
              className="mb-8"
            />
            <ProcessExplorer />
          </div>
        </section>
        <section className="py-10 md:py-12">
          <div className="container space-y-6 px-4 md:px-6">
            <div className="grid gap-6 md:grid-cols-2">
              {[BEFORE_AFTER.before, BEFORE_AFTER.after].map(
                (column, index) => (
                  <Card
                    key={column.label}
                    className={
                      index ? "border-[hsl(var(--brand-accent))]/50" : ""
                    }
                  >
                    <h2 className="mb-4 text-xl font-semibold">
                      {index ? "Ascent standard" : "Typical practice"}
                    </h2>
                    <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                      {column.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </Card>
                ),
              )}
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {AUDIENCE_TABS.map((role) => (
                <Card key={role.label}>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">
                    {role.label}
                  </p>
                  <h3 className="mb-3 text-xl font-semibold">
                    {role.headline}
                  </h3>
                  <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                    {role.points.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <CTABand
          title="The Ascent Standard"
          description="We assess before we estimate. We document before we mobilize. We report every day we're on site. We close out with a full digital package."
          primaryCta={{ text: "Start A Conversation", href: "/contact" }}
          secondaryCta={{ text: "Get Prequalified", href: "/prequalification" }}
          variant="dark"
        />

        {/* FAQ (auto schema) */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-4">
              Technology & Documentation FAQ
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              How we use digital tools to keep every project coordinated and
              accountable.
            </p>
            <FAQAccordion faqs={technologyFaqs} />
          </div>
        </section>

        <CrossLinks />
      </main>

      <Footer />
    </div>
  );
};

export default Technology;
