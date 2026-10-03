/**
 * Service Registry — single source of truth for every public service page.
 *
 * Used by:
 *   - src/data/navigation-structure-enhanced.ts  (top-nav mega menu)
 *   - src/routes/AppRoutes.tsx                    (static service routes)
 *   - scripts/audit-service-pages.ts              (SEO/GEO audit)
 *
 * Adding a new static service page = one entry here + drop the page file
 * under src/pages/services/. The nav and audit pick it up automatically.
 *
 * DB-driven services (source: "db") still render via /services/:slug → ServiceDetail.tsx;
 * they're listed here only when we want them surfaced in the top nav or audit.
 */

export type ServiceCategory =
  | "envelope"
  | "restoration"
  | "interior";

export interface ServiceRegistryEntry {
  /** URL slug — last segment of /services/<slug> */
  slug: string;
  /** Full route path */
  path: string;
  /** Short label used in nav */
  navLabel: string;
  /** One-line description shown under the nav label */
  navDescription: string;
  /** Lucide icon name (string — resolved via getIcon) */
  icon: string;
  /** Which mega-menu column this belongs to */
  category: ServiceCategory;
  /** Whether it appears in the top nav (keep curated & short) */
  showInNav: boolean;
  /** Sort order within its category column */
  navOrder: number;
  /** "static" = hard-coded React page; "db" = rendered via ServiceDetail */
  source: "static" | "db";
  /** Broader service page that introduces this specialty. */
  parentSlug?: string;
}

export const SERVICE_CATEGORY_ORDER: ServiceCategory[] = ["envelope", "restoration", "interior"];

export const SERVICE_CATEGORIES: Record<
  ServiceCategory,
  { title: string; description: string }
> = {
  envelope: {
    title: "Building Envelope",
    description: "Exterior systems, cladding, waterproofing",
  },
  restoration: {
    title: "Restoration & Repair",
    description: "Façade, masonry, sealants, garages",
  },
  interior: {
    title: "Interior & Finishes",
    description: "Painting, tile, flooring, fit-outs",
  },
};

export const SERVICE_REGISTRY: ServiceRegistryEntry[] = [
  // ── Building Envelope ────────────────────────────────────────────────
  {
    slug: "building-envelope-solutions",
    path: "/services/building-envelope-solutions",
    navLabel: "Building Envelope Solutions",
    navDescription: "Complete envelope systems",
    icon: "Building2",
    category: "envelope",
    showInNav: true,
    navOrder: 1,
    source: "db",
  },
  {
    slug: "cladding-systems",
    path: "/services/cladding-systems",
    navLabel: "Cladding Systems",
    navDescription: "Metal panel & ACM installation",
    icon: "Layers",
    category: "envelope",
    showInNav: true,
    navOrder: 2,
    source: "db",
  },
  {
    slug: "waterproofing-systems",
    path: "/services/waterproofing-systems",
    navLabel: "Waterproofing Systems",
    navDescription: "Foundation to roof protection",
    icon: "Droplets",
    category: "envelope",
    showInNav: true,
    navOrder: 3,
    source: "db",
  },
  {
    slug: "eifs-stucco-systems",
    path: "/services/eifs-stucco-systems",
    navLabel: "EIFS & Stucco",
    navDescription: "Sto Listed Installer",
    icon: "Square",
    category: "envelope",
    showInNav: true,
    navOrder: 4,
    source: "db",
  },

  // ── Restoration & Repair ─────────────────────────────────────────────
  {
    slug: "facade-remediation",
    path: "/services/facade-remediation",
    navLabel: "Façade Remediation",
    navDescription: "Exterior restoration",
    icon: "Hammer",
    category: "restoration",
    showInNav: true,
    navOrder: 1,
    source: "db",
  },
  {
    slug: "masonry-restoration",
    path: "/services/masonry-restoration",
    navLabel: "Masonry Restoration",
    navDescription: "Brick and stone repair",
    icon: "Landmark",
    category: "restoration",
    showInNav: true,
    navOrder: 2,
    source: "db",
  },
  {
    slug: "parking-garage-restoration",
    path: "/services/parking-garage-restoration",
    navLabel: "Parking Garage Restoration",
    navDescription: "Structural concrete repair",
    icon: "Car",
    category: "restoration",
    showInNav: true,
    navOrder: 3,
    source: "db",
  },
  {
    slug: "caulking-sealants-toronto",
    path: "/services/caulking-sealants-toronto",
    navLabel: "Caulking & Sealants",
    navDescription: "Envelope joints, sealant programs",
    icon: "Wrench",
    category: "restoration",
    showInNav: true,
    navOrder: 4,
    source: "static",
  },

  // ── Interior & Finishes ──────────────────────────────────────────────
  // Painting is a single nav entry that points to the painting roll-up
  // page; the five painting sub-pages remain indexable via /services/*.
  {
    slug: "painting-services",
    path: "/services/painting-services",
    navLabel: "Painting Services",
    navDescription: "Commercial, interior, exterior, fire-rated",
    icon: "Paintbrush",
    category: "interior",
    showInNav: true,
    navOrder: 1,
    source: "db",
  },
  {
    slug: "interior-buildouts-finishing",
    path: "/services/interior-buildouts-finishing",
    navLabel: "Interior Finishing",
    navDescription: "Drywall, taping, fit-outs",
    icon: "Home",
    category: "interior",
    showInNav: true,
    navOrder: 2,
    source: "db",
  },
  {
    slug: "tile-flooring",
    path: "/services/tile-flooring",
    navLabel: "Tile & Flooring",
    navDescription: "Porcelain, stone, LVT, hardwood",
    icon: "Grid2X2",
    category: "interior",
    showInNav: true,
    navOrder: 3,
    source: "db",
  },
  {
    slug: "handyman-patching-toronto",
    path: "/services/handyman-patching-toronto",
    navLabel: "Patching & Handyman",
    navDescription: "Drywall, turnovers, punch-list",
    icon: "Wrench",
    category: "interior",
    showInNav: true,
    navOrder: 4,
    source: "static",
  },

  // ── Hidden from nav, but still part of the site / audit ──────────────
  {
    slug: "interior-finishing-renovations",
    path: "/services/interior-finishing-renovations",
    navLabel: "Interior Finishing & Renovations",
    navDescription: "Interior renovation and finishing work",
    icon: "Home",
    category: "interior",
    showInNav: false,
    navOrder: 17,
    source: "db",
    parentSlug: "interior-buildouts-finishing",
  },
  {
    slug: "commercial-painting-gta",
    path: "/services/commercial-painting-gta",
    navLabel: "Commercial Painting (GTA)",
    navDescription: "Offices, warehouses, ICI",
    icon: "Paintbrush",
    category: "interior",
    showInNav: false,
    navOrder: 10,
    source: "static",
    parentSlug: "painting-services",
  },
  {
    slug: "interior-painting-toronto",
    path: "/services/interior-painting-toronto",
    navLabel: "Interior Painting (Toronto)",
    navDescription: "Low-VOC, off-hours scheduling",
    icon: "Paintbrush",
    category: "interior",
    showInNav: false,
    navOrder: 11,
    source: "static",
    parentSlug: "painting-services",
  },
  {
    slug: "exterior-painting-toronto",
    path: "/services/exterior-painting-toronto",
    navLabel: "Exterior Painting (Toronto)",
    navDescription: "Stucco, EIFS, brick, metal",
    icon: "Paintbrush",
    category: "interior",
    showInNav: false,
    navOrder: 12,
    source: "static",
    parentSlug: "painting-services",
  },
  {
    slug: "residential-exterior-painting-gta",
    path: "/services/residential-exterior-painting-gta",
    navLabel: "Residential Exterior (GTA)",
    navDescription: "Whole-house repaints",
    icon: "Home",
    category: "interior",
    showInNav: false,
    navOrder: 13,
    source: "static",
    parentSlug: "painting-services",
  },
  {
    slug: "fire-retardant-coatings-ontario",
    path: "/services/fire-retardant-coatings-ontario",
    navLabel: "Fire Retardant Coatings",
    navDescription: "Intumescent & rated paint",
    icon: "Flame",
    category: "interior",
    showInNav: false,
    navOrder: 14,
    source: "static",
    parentSlug: "painting-services",
  },
  {
    slug: "tile-installation-toronto",
    path: "/services/tile-installation-toronto",
    navLabel: "Tile Installation (Toronto)",
    navDescription: "Porcelain, stone, waterproofing",
    icon: "Grid2X2",
    category: "interior",
    showInNav: false,
    navOrder: 15,
    source: "static",
    parentSlug: "tile-flooring",
  },
  {
    slug: "flooring-installation-gta",
    path: "/services/flooring-installation-gta",
    navLabel: "Flooring Installation (GTA)",
    navDescription: "LVT, laminate, hardwood",
    icon: "Grid2X2",
    category: "interior",
    showInNav: false,
    navOrder: 16,
    source: "static",
    parentSlug: "tile-flooring",
  },
  {
    slug: "sealant-programs",
    path: "/services/sealant-programs",
    navLabel: "Sealant Programs",
    navDescription: "Joint maintenance programs",
    icon: "Wrench",
    category: "restoration",
    showInNav: false,
    navOrder: 10,
    source: "db",
    parentSlug: "caulking-sealants-toronto",
  },
  {
    slug: "sustainable-building",
    path: "/services/sustainable-building",
    navLabel: "Sustainable Construction",
    navDescription: "Green building practices",
    icon: "Leaf",
    category: "envelope",
    showInNav: false,
    navOrder: 10,
    source: "db",
    parentSlug: "building-envelope-solutions",
  },
];

/** All entries shown in the top nav, grouped & ordered by category. */
export function getNavServicesByCategory(): Record<
  ServiceCategory,
  ServiceRegistryEntry[]
> {
  const out: Record<ServiceCategory, ServiceRegistryEntry[]> = {
    envelope: [],
    restoration: [],
    interior: [],
  };
  for (const entry of SERVICE_REGISTRY) {
    if (!entry.showInNav) continue;
    out[entry.category].push(entry);
  }
  (Object.keys(out) as ServiceCategory[]).forEach((k) => {
    out[k].sort((a, b) => a.navOrder - b.navOrder);
  });
  return out;
}

/** Only the statically-routed entries (used by AppRoutes registration). */
export function getStaticServiceEntries(): ServiceRegistryEntry[] {
  return SERVICE_REGISTRY.filter((e) => e.source === "static");
}

export const getServiceEntry = (slug: string): ServiceRegistryEntry | undefined =>
  SERVICE_REGISTRY.find((entry) => entry.slug === slug);

export const getServiceParent = (slug: string): ServiceRegistryEntry | undefined => {
  const parentSlug = getServiceEntry(slug)?.parentSlug;
  return parentSlug ? getServiceEntry(parentSlug) : undefined;
};

export const getServiceSpecialties = (slug: string): ServiceRegistryEntry[] =>
  SERVICE_REGISTRY.filter((entry) => entry.parentSlug === slug)
    .sort((a, b) => a.navOrder - b.navOrder);

/** Registered services use the same grouping in the menu and directory. */
export const getServiceCategoryTitle = (slug: string, databaseCategory: string | null): string => {
  const entry = getServiceEntry(slug);
  if (entry) return SERVICE_CATEGORIES[entry.category].title;
  if (databaseCategory === "Interior Construction") return SERVICE_CATEGORIES.interior.title;
  return databaseCategory || "Other";
};
