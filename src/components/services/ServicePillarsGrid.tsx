import { Link } from "react-router-dom";
import { Card } from "@/design-system/components/Card";
import { Section } from "@/components/sections/Section";
import { TYPOGRAPHY_STYLES } from "@/design-system/constants";
import { ArrowRight, Building2, Layers, Blocks, Hammer, Paintbrush, Grid3X3, Home, Wrench } from "lucide-react";

const SERVICE_PILLARS = [
  {
    title: "Building Envelope & Restoration",
    description: "Full-scope envelope assessment, repair, and restoration for aging and damaged building exteriors.",
    scopes: ["Balcony & facade restoration", "Waterproofing & below-grade systems", "Window & door replacement"],
    route: "/services/building-envelope",
    icon: Building2,
  },
  {
    title: "EIFS, Stucco & Cladding",
    description: "Installation and remediation of exterior insulation finish systems, stucco, and panel cladding.",
    scopes: ["EIFS installation & repair", "Stucco application & patching", "Composite & metal panel systems"],
    route: "/services/cladding-systems",
    icon: Layers,
  },
  {
    title: "Masonry & Concrete Repair",
    description: "Structural and cosmetic masonry restoration, tuckpointing, and concrete rehabilitation.",
    scopes: ["Brick replacement & tuckpointing", "Concrete spall repair", "Parging & stone restoration"],
    route: "/services/masonry-restoration",
    icon: Blocks,
  },
  {
    title: "Interior Buildouts & Finish Trades",
    description: "Drywall, framing, millwork, and finish carpentry for commercial and multi-unit interior spaces.",
    scopes: ["Drywall & steel stud framing", "Suite turnover packages", "Millwork & trim installation"],
    route: "/services/interior-buildouts",
    icon: Hammer,
  },
  {
    title: "Painting & Protective Coatings",
    description: "Interior and exterior painting programs for commercial properties, corridors, suites, and common areas.",
    scopes: ["Common area repaints", "Suite painting programs", "Elastomeric & specialty coatings"],
    route: "/services/painting-services",
    icon: Paintbrush,
  },
  {
    title: "Tile, Flooring & Surface Finishes",
    description: "Ceramic, porcelain, vinyl, and engineered flooring for lobbies, corridors, and unit interiors.",
    scopes: ["Lobby & corridor tile", "Vinyl plank & sheet goods", "Grouting & waterproof membranes"],
    route: "/services/tile-flooring",
    icon: Grid3X3,
  },
  {
    title: "Condo & Multi-Unit Work",
    description: "Coordinated trade packages for occupied condominiums, apartment buildings, and multi-unit residential properties.",
    scopes: ["Occupied-unit painting programs", "Corridor & amenity upgrades", "Phased multi-floor execution"],
    route: "/services/painting-services",
    icon: Home,
  },
  {
    title: "Renovation & Retrofit Packages",
    description: "Turnkey renovation scopes for residential and light commercial retrofit projects across Ontario.",
    scopes: ["Kitchen & bathroom renovations", "Basement & unit finishing", "Accessibility upgrades"],
    route: "/services/interior-finishing-renovations",
    icon: Wrench,
  },
] as const;

export const ServicePillarsGrid = () => {
  return (
    <Section size="major">
      <div className="mb-12">
        <p className={`${TYPOGRAPHY_STYLES.label} text-accent mb-3`}>What We Do</p>
        <h2 className={`${TYPOGRAPHY_STYLES.sectionTitle} text-foreground mb-4`}>
          Core Service Pillars
        </h2>
        <p className={`${TYPOGRAPHY_STYLES.bodyDefault} text-muted-foreground max-w-3xl`}>
          Eight focused trade categories covering the building envelope, interior finishes, and renovation scopes we deliver across Ontario.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SERVICE_PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <Link key={pillar.title} to={pillar.route} className="group">
              <Card variant="elevated" hover className="h-full flex flex-col">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                  {pillar.description}
                </p>
                <ul className="space-y-1.5 mb-4">
                  {pillar.scopes.map((scope) => (
                    <li key={scope} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      {scope}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center text-sm font-medium text-primary group-hover:text-accent transition-colors mt-auto">
                  View service <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </Section>
  );
};
