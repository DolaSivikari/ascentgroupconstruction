import { Building2, Layers, Blocks, Hammer, Paintbrush, Grid3X3, Home, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ServicePillar {
  title: string;
  description: string;
  scopes: readonly string[];
  route: string;
  icon: LucideIcon;
}

export const SERVICE_PILLARS: readonly ServicePillar[] = [
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
    description: "Interior finishing and turnover packages for occupied condominiums, apartment buildings, and multi-unit residential properties.",
    scopes: ["Suite turnover finishing", "Corridor & amenity upgrades", "Phased multi-floor execution"],
    route: "/services/interior-buildouts",
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
