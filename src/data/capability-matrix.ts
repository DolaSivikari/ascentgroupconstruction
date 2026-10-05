export type BuildingType =
  | "high-rise"
  | "commercial"
  | "institutional"
  | "low-rise";
export const BUILDING_TYPES: { id: BuildingType; label: string }[] = [
  { id: "high-rise", label: "High-rise residential" },
  { id: "commercial", label: "Commercial" },
  { id: "institutional", label: "Institutional" },
  { id: "low-rise", label: "Low-rise / homes" },
];
export interface Capability {
  code: string;
  title: string;
  category: "envelope" | "restoration" | "interior";
  delivery: "Self-performed" | "Coordinated";
  buildingTypes: BuildingType[];
  included: string[];
  access: string;
  deliverables: string;
  serviceHref: string;
}
const all: BuildingType[] = [
  "high-rise",
  "commercial",
  "institutional",
  "low-rise",
];
const multi: BuildingType[] = ["high-rise", "commercial", "institutional"];
// Illustrative scope matrix based on the existing service offering. Confirm project
// suitability, delivery and access in the written scope; this is not a guarantee.
export const CAPABILITY_MATRIX: Capability[] = [
  {
    code: "07 24 00",
    title: "Exterior insulation & finish systems (EIFS)",
    category: "envelope",
    delivery: "Self-performed",
    buildingTypes: all,
    included: [
      "Localized system repairs",
      "Base coat, mesh and finish",
      "Manufacturer systems installed",
    ],
    access: "Swing stage · boom lift · scaffold",
    deliverables:
      "Mock-up approval, inspection records and manufacturer system documentation",
    serviceHref: "/services/eifs-stucco-systems",
  },
  {
    code: "09 24 00",
    title: "Cement plastering (stucco)",
    category: "envelope",
    delivery: "Self-performed",
    buildingTypes: ["commercial", "institutional", "low-rise"],
    included: [
      "Crack and patch repairs",
      "Paper and lath at damaged areas",
      "Three-coat stucco finishes",
    ],
    access: "Scaffold · boom lift · ladders",
    deliverables: "Photo record, curing log and colour approval",
    serviceHref: "/services/eifs-stucco-systems",
  },
  {
    code: "07 92 00",
    title: "Joint sealants",
    category: "envelope",
    delivery: "Self-performed",
    buildingTypes: all,
    included: [
      "Window perimeter and control joints",
      "Joint preparation, primer and backer rod",
      "Replacement sealants",
    ],
    access: "Swing stage · boom lift · ladders",
    deliverables:
      "Field adhesion records (ASTM C1521 where specified) and quantities by drop",
    serviceHref: "/services/caulking-sealants-toronto",
  },
  {
    code: "04 01 20",
    title: "Masonry restoration & repointing",
    category: "restoration",
    delivery: "Self-performed",
    buildingTypes: all,
    included: [
      "Repointing brick, block and stone",
      "Localized unit replacement",
      "Masonry repairs and cleaning",
    ],
    access: "Swing stage · scaffold · mast climber",
    deliverables: "Mortar match approval and inspection records",
    serviceHref: "/services/masonry-restoration",
  },
  {
    code: "09 91 13",
    title: "Exterior painting",
    category: "envelope",
    delivery: "Self-performed",
    buildingTypes: all,
    included: [
      "Surface preparation and priming",
      "Architectural and masonry coatings",
      "Colour mock-ups",
    ],
    access: "Swing stage · boom lift · ladders",
    deliverables:
      "Wet film thickness records (ASTM D4414 where applicable) and product data",
    serviceHref: "/services/exterior-painting-toronto",
  },
  {
    code: "09 96 00",
    title: "High-performance coatings",
    category: "interior",
    delivery: "Self-performed",
    buildingTypes: multi,
    included: [
      "Epoxy and urethane systems",
      "Protective and anti-graffiti coatings",
    ],
    access: "Ground · scissor lift",
    deliverables: "Coating thickness records and product data",
    serviceHref: "/services/painting-services",
  },
  {
    code: "07 18 00",
    title: "Traffic coatings",
    category: "restoration",
    delivery: "Self-performed",
    buildingTypes: multi,
    included: [
      "Parking deck and balcony coatings",
      "Line marking and related repairs",
    ],
    access: "Ground · traffic management",
    deliverables: "Membrane thickness and curing records",
    serviceHref: "/services/parking-garage-restoration",
  },
  {
    code: "07 14 00",
    title: "Fluid-applied waterproofing",
    category: "restoration",
    delivery: "Self-performed",
    buildingTypes: all,
    included: [
      "Balcony and podium membranes",
      "Flashing and transition details",
    ],
    access: "Ground · scaffold",
    deliverables: "Installation records and testing where specified",
    serviceHref: "/services/waterproofing-systems",
  },
  {
    code: "03 01 30",
    title: "Concrete repair",
    category: "restoration",
    delivery: "Coordinated",
    buildingTypes: multi,
    included: [
      "Slab edge and soffit repair coordination",
      "Parking structure repair scopes",
    ],
    access: "Ground · swing stage",
    deliverables: "Repair quantities and photo documentation",
    serviceHref: "/services/parking-garage-restoration",
  },
  {
    code: "09 91 23",
    title: "Interior painting",
    category: "interior",
    delivery: "Self-performed",
    buildingTypes: all,
    included: [
      "Common areas and suites",
      "Preparation and finish painting",
      "Occupied-building scheduling",
    ],
    access: "Ground · scaffold towers",
    deliverables: "Colour schedule and touch-up information",
    serviceHref: "/services/interior-painting-toronto",
  },
  {
    code: "09 29 00",
    title: "Gypsum board & finishing",
    category: "interior",
    delivery: "Self-performed",
    buildingTypes: all,
    included: [
      "Drywall repairs and buildouts",
      "Board and finish work to specified level",
    ],
    access: "Ground · scaffold towers",
    deliverables: "Deficiency walk-through records",
    serviceHref: "/services/interior-buildouts-finishing",
  },
  {
    code: "09 30 00",
    title: "Tiling",
    category: "interior",
    delivery: "Self-performed",
    buildingTypes: ["high-rise", "commercial", "low-rise"],
    included: ["Floor and wall tile", "Waterproofed wet-area installations"],
    access: "Ground",
    deliverables: "Product data and maintenance information",
    serviceHref: "/services/tile-installation-toronto",
  },
  {
    code: "09 65 00",
    title: "Resilient flooring",
    category: "interior",
    delivery: "Self-performed",
    buildingTypes: all,
    included: ["LVT and sheet vinyl", "Substrate preparation"],
    access: "Ground",
    deliverables: "Moisture test records where specified and product data",
    serviceHref: "/services/flooring-installation-gta",
  },
];
