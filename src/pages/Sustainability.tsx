import { SITE_URL } from "@/constants/company";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PageHero from "@/components/shared/PageHero";
import { Card } from "@/design-system/components/Card";
import { Section } from "@/components/sections/Section";
import { SectionHeader } from "@/design-system/components/SectionHeader";
import { ProofStrip } from "@/design-system/components/ProofStrip";
import { CTABand } from "@/design-system/components/CTABand";
import { Link } from "react-router-dom";
import { companyHeroes } from "@/data/hero-images";
import {
  Leaf,
  Recycle,
  Droplet,
  CheckCircle,
  Package,
  Truck,
  AlertTriangle,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const MATERIAL_PRACTICES = [
  {
    icon: Droplet,
    title: "Low-VOC & Zero-VOC Materials",
    description:
      "We specify low- or zero-VOC paints, coatings, and sealants wherever possible — reducing indoor air quality impacts in occupied buildings and minimizing off-gassing on-site.",
    items: [
      "Low-odor, zero-VOC interior paint specification by default",
      "Low-VOC sealants and adhesives",
      "Water-based coatings preferred over solvent-borne alternatives",
    ],
  },
  {
    icon: Package,
    title: "Material Minimization & Waste",
    description:
      "Reducing material waste starts with accurate take-offs. We measure twice, order carefully, and properly dispose of all waste in compliance with Ontario environmental regulations.",
    items: [
      "Accurate digital take-offs to reduce over-ordering",
      "On-site waste segregation and recycling where available",
      "Proper disposal of hazardous materials (solvents, adhesives)",
    ],
  },
  {
    icon: Truck,
    title: "Local Sourcing",
    description:
      "We prioritize GTA-based suppliers and distributors. Shorter supply chains mean fewer transportation emissions and faster lead times.",
    items: [
      "Ontario-based paint and coating distributors",
      "Local masonry and stucco suppliers",
      "GTA-area material fabricators where available",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Occupied Building Practices",
    description:
      "Most of our work happens in occupied or partially occupied buildings. Careful material selection and containment protocols protect occupants and reduce environmental exposure.",
    items: [
      "Containment and ventilation protocols on all interior scopes",
      "Product data sheets reviewed for occupant safety",
      "Materials selected with odour and chemical sensitivity in mind",
    ],
  },
];

const WASTE_PRACTICES = [
  { icon: Recycle, label: "Waste segregation on all job sites" },
  { icon: CheckCircle, label: "Proper solvent and chemical disposal" },
  { icon: Leaf, label: "Cardboard and packaging recycling" },
  { icon: Package, label: "Unused material returned or donated" },
];

// ─── Component ───────────────────────────────────────────────────────────────

const Sustainability = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Sustainability Practices | Ascent Group Construction"
        description="Ascent Group Construction uses low-VOC materials, responsible waste disposal, and local sourcing to minimize our environmental footprint across GTA building envelope and restoration projects."
        keywords="sustainable construction, low-VOC painting, eco-friendly contractor, waste management, GTA green building practices"
        canonical={`${SITE_URL}/sustainability`}
      />
      <Navigation />

      <PageHero
        eyebrow="Sustainability"
        title="Responsible Practices on Every Site"
        description="We use low-VOC materials, minimize waste, source locally, and follow proper disposal protocols — practical environmental responsibility on every project."
        image={companyHeroes.sustainability}
        imageAlt="Sustainable building practices at Ascent Group Construction"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Sustainability" },
        ]}
        height="medium"
      />

      <main>
        {/* ── Commitment ─────────────────────────────────────────────── */}
        <Section size="major" maxWidth="narrow">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary mb-3 block">
              Our Approach
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              Practical Environmental Responsibility
            </h2>
          </div>
          <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
            <p>
              We're a specialty contractor, not an environmental consulting firm. We don't make claims we can't
              back up. What we do commit to is using the right materials, minimizing waste, sourcing locally
              where practical, and following proper disposal procedures on every job.
            </p>
            <p>
              Most of our work happens in occupied or partially occupied buildings — condo towers, commercial
              properties, institutional facilities. That means material selection isn't just an environmental
              preference; it directly affects the people living and working in the building during our scope.
              Low-VOC, low-odour materials are the standard, not an upgrade.
            </p>
            <p>
              We follow Ontario environmental regulations for hazardous material handling and disposal, and
              we're continuously improving our practices as better materials and methods become available.
            </p>
          </div>
        </Section>

        {/* ── Proof Strip ─────────────────────────────────────────────── */}
        <Section size="tight" className="bg-muted/30">
          <ProofStrip
            items={[
              { value: "Low-VOC", label: "Default Material Spec" },
              { value: "Local",   label: "GTA Supplier Priority" },
              { value: "WSIB",    label: "Safety Compliant" },
              { value: "100%",    label: "Proper Waste Disposal" },
            ]}
            variant="dark"
            columns={4}
          />
        </Section>

        {/* ── Material Practices ──────────────────────────────────────── */}
        <Section size="major">
          <SectionHeader
            badge="Material Practices"
            title="How We Approach Materials & Waste"
            description="Concrete practices we apply across building envelope, interior, and restoration scopes."
            align="left"
          />
          <div className="grid md:grid-cols-2 gap-6">
            {MATERIAL_PRACTICES.map(({ icon: Icon, title, description, items }, i) => (
              <Card key={i} variant="elevated" size="lg" hover>
                <div className="p-2.5 bg-primary/10 rounded-lg w-fit mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{description}</p>
                <ul className="space-y-2">
                  {items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </Section>

        {/* ── Waste & Site Practices ───────────────────────────────────── */}
        <Section size="major" className="bg-muted/30">
          <SectionHeader
            badge="Site Standards"
            title="On-Site Waste & Disposal"
            description="Standard practices we follow on every project site regardless of scope size."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {WASTE_PRACTICES.map(({ icon: Icon, label }, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center gap-3 p-6 bg-background rounded-xl border border-border"
              >
                <Icon className="w-7 h-7 text-primary" />
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Looking Forward ─────────────────────────────────────────── */}
        <Section size="major" maxWidth="narrow">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary mb-3 block">
              Looking Forward
            </span>
            <h2 className="text-3xl font-bold tracking-tight mb-6">
              Improving as We Grow
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              As a newer company, we're building our practices deliberately — not making commitments we can't
              keep. Our current focus is ensuring every project meets a baseline of responsible material
              selection, waste minimization, and safe disposal.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              As our project volume grows, we'll expand our tracking, formalize our environmental protocols,
              and work toward certifications that reflect genuinely demonstrated practice — not aspirational
              statements.
            </p>
          </div>
        </Section>

        {/* ── CTA ─────────────────────────────────────────────────────── */}
        <CTABand
          title="Questions About Our Material Specs?"
          description="We're happy to discuss specific material requirements, product data sheets, or environmental specifications for your project."
          primaryCta={{ text: "Contact Us", href: "/contact" }}
          secondaryCta={{ text: "View Our Services", href: "/services" }}
          variant="dark"
        />
      </main>

      <Footer />
    </div>
  );
};

export default Sustainability;
