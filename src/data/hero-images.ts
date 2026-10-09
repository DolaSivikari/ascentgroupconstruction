import { cityPhotography, portfolioPhotography } from "./hero-photography";
/**
 * Hero Image Mapping
 * Centralized configuration for all page hero images
 */

// Import hero images from assets
import heroCommercial from "@/assets/heroes/hero-commercial.jpg";
import heroConstructionManagement from "@/assets/heroes/hero-construction-management.jpg";
import { getServiceEntry, type ServiceCategory } from "@/data/service-registry";
import heroContractorPortal from "@/assets/heroes/hero-contractor-portal.jpg";
import heroEducation from "@/assets/heroes/hero-education.jpg";
import heroEquipment from "@/assets/heroes/hero-equipment.jpg";
import heroFinancing from "@/assets/heroes/hero-financing.jpg";
import heroHealthcare from "@/assets/heroes/hero-healthcare.jpg";
import heroHospitality from "@/assets/heroes/hero-hospitality.jpg";
import heroIndustrial from "@/assets/heroes/hero-industrial.jpg";
import heroInstitutional from "@/assets/heroes/hero-institutional.jpg";
import heroMultiFamily from "@/assets/heroes/hero-multi-family.jpg";
import heroRetail from "@/assets/heroes/hero-retail.jpg";
import heroSealantReplacement from "@/assets/heroes/hero-sealant-replacement.jpg";
import heroServiceAreas from "@/assets/heroes/hero-service-areas.jpg";
import heroSustainable from "@/assets/heroes/hero-sustainable.jpg";
import heroTileFlooring from "@/assets/heroes/hero-tile-flooring.jpg";
import heroWarranties from "@/assets/heroes/hero-warranties.jpg";

// Import additional hero images from root assets folder
import heroMasonryRestoration from "@/assets/hero-masonry-restoration.jpg";
import heroParkingRehabilitation from "@/assets/hero-parking-rehabilitation.jpg";

// Static specialty services use the same registry as database-driven services.
import heroCommercialPainting from "@/assets/heroes/wave-commercial-painting.jpg";
import heroExteriorPainting from "@/assets/heroes/wave-exterior-painting.jpg";
import heroCaulkingSealants from "@/assets/heroes/wave-caulking-sealants.jpg";
import heroFireRetardant from "@/assets/heroes/wave-fire-retardant.jpg";
import heroInteriorPainting from "@/assets/heroes/wave-interior-painting.jpg";
import heroResidentialExterior from "@/assets/heroes/wave-residential-exterior.jpg";
import heroTileInstallation from "@/assets/heroes/wave-tile-installation.jpg";
import heroFlooringInstallation from "@/assets/heroes/wave-flooring-installation.jpg";
import heroHandymanPatching from "@/assets/heroes/wave-handyman-patching.jpg";

/**
 * Main Pages Hero Images
 */
export const mainPageHeroes = {
  about: portfolioPhotography["residential-amenities"].image,
  services: portfolioPhotography["structural-coatings"].image,
  projects: heroConstructionManagement,
  contact: portfolioPhotography["housing-exterior"].image,
  careers: portfolioPhotography["interior-progress"].image,
  faq: portfolioPhotography["envelope-opening"].image,
  blog: portfolioPhotography["envelope-staging"].image,
  insights: portfolioPhotography["envelope-staging"].image,
} as const;

/**
 * Service Pages Hero Images
 */
export const serviceHeroes = {
  // Building Envelope Category
  "building-envelope-solutions":
    portfolioPhotography["envelope-complete"].image,
  "cladding-systems": portfolioPhotography["cladding-residential"].image,
  "eifs-stucco-systems": portfolioPhotography["stucco-finish"].image,
  "masonry-restoration": heroMasonryRestoration,
  "waterproofing-systems": portfolioPhotography["envelope-opening"].image,
  "facade-remediation": portfolioPhotography["envelope-staging"].image,
  "parking-garage-restoration": heroParkingRehabilitation,
  "sealant-programs": heroSealantReplacement,

  // Interior Construction Category
  "interior-buildouts-finishing":
    portfolioPhotography["interior-finishes"].image,
  "interior-finishing-renovations":
    portfolioPhotography["residential-interior"].image,
  "painting-services": portfolioPhotography["institutional-finishes"].image,
  "tile-flooring": heroTileFlooring,

  // Specialized Services Category
  "sustainable-building": portfolioPhotography["housing-exterior"].image,

  // Static specialty pages
  "commercial-painting-gta": heroCommercialPainting,
  "exterior-painting-toronto": heroExteriorPainting,
  "caulking-sealants-toronto": heroCaulkingSealants,
  "fire-retardant-coatings-ontario": heroFireRetardant,
  "interior-painting-toronto": heroInteriorPainting,
  "residential-exterior-painting-gta": heroResidentialExterior,
  "tile-installation-toronto": heroTileInstallation,
  "flooring-installation-gta": heroFlooringInstallation,
  "handyman-patching-toronto": heroHandymanPatching,
} as const;

/**
 * Audience Pages Hero Images
 */
export const audienceHeroes = {
  "for-general-contractors": portfolioPhotography["coatings-progress"].image,
  "for-architects": portfolioPhotography["project-documentation"].image,
  homeowners: portfolioPhotography["cladding-residential"].image,
  "property-managers": portfolioPhotography["condominium-exterior"].image,
  "commercial-clients": portfolioPhotography["commercial-interior"].image,
  developers: portfolioPhotography["housing-exterior"].image,
} as const;

/**
 * Sector/Market Pages Hero Images
 */
export const sectorHeroes = {
  commercial: heroCommercial,
  retail: heroRetail,
  hospitality: heroHospitality,
  healthcare: heroHealthcare,
  education: heroEducation,
  institutional: heroInstitutional,
  industrial: heroIndustrial,
  "multi-family": heroMultiFamily,
  "markets-overview": portfolioPhotography["condominium-exterior"].image,
} as const;

/**
 * Company Pages Hero Images
 */
export const companyHeroes = {
  "our-process": portfolioPhotography["project-planning"].image,
  technology: portfolioPhotography["project-documentation"].image,
  capabilities: portfolioPhotography["institutional-finishes"].image,
  sustainability: heroSustainable,
  "why-specialty-contractor": portfolioPhotography["stucco-installation"].image,
  "certifications-insurance": portfolioPhotography["school-corridor"].image,
  "equipment-resources": heroEquipment,
  warranties: heroWarranties,
  financing: heroFinancing,
} as const;

/**
 * Resource Pages Hero Images
 */
export const resourceHeroes = {
  prequalification: portfolioPhotography["structural-coatings"].image,
  "contractor-portal": heroContractorPortal,
  "service-areas": heroServiceAreas,
  estimate: portfolioPhotography["project-planning"].image,
  "submit-rfp": portfolioPhotography["school-corridor"].image,
} as const;

/**
 * Get hero image by page key
 * Searches all hero categories to find the matching image
 */
export function getHeroImage(pageKey: string): string {
  // Check all hero mappings
  const allHeroes = {
    ...mainPageHeroes,
    ...serviceHeroes,
    ...audienceHeroes,
    ...sectorHeroes,
    ...companyHeroes,
    ...resourceHeroes,
  };

  return allHeroes[pageKey as keyof typeof allHeroes] || mainPageHeroes.about;
}

/**
 * Hero configuration with additional metadata
 */
export interface HeroConfig {
  image: string;
  imageAlt: string;
  defaultHeight?: "large" | "medium" | "small" | "mini";
  defaultOverlay?: "gradient" | "dark" | "brand" | "light";
}

/**
 * Full hero configurations with alt text
 */
export const heroConfigs: Record<string, HeroConfig> = {
  // Main Pages
  about: {
    image: mainPageHeroes.about,
    imageAlt: "Ascent Group Construction team at work",
    defaultHeight: "large",
  },
  services: {
    image: mainPageHeroes.services,
    imageAlt: "Professional construction services",
    defaultHeight: "large",
  },
  contact: {
    image: mainPageHeroes.contact,
    imageAlt: "Contact Ascent Group Construction",
    defaultHeight: "medium",
  },
  careers: {
    image: mainPageHeroes.careers,
    imageAlt: "Join the Ascent Group Construction team",
    defaultHeight: "medium",
  },

  // Service Pages
  "building-envelope-solutions": {
    image: serviceHeroes["building-envelope-solutions"],
    imageAlt: "Building envelope restoration and repair services",
    defaultHeight: "medium",
  },
  "cladding-systems": {
    image: serviceHeroes["cladding-systems"],
    imageAlt: "Exterior cladding installation and repair",
    defaultHeight: "medium",
  },
  "eifs-stucco-systems": {
    image: serviceHeroes["eifs-stucco-systems"],
    imageAlt: "EIFS and stucco system installation",
    defaultHeight: "medium",
  },
  "masonry-restoration": {
    image: heroMasonryRestoration,
    imageAlt: "Masonry restoration and brick repair",
    defaultHeight: "medium",
  },
  "waterproofing-systems": {
    image: serviceHeroes["waterproofing-systems"],
    imageAlt: "Waterproofing and moisture protection",
    defaultHeight: "medium",
  },
  "interior-buildouts-finishing": {
    image: serviceHeroes["interior-buildouts-finishing"],
    imageAlt: "Commercial interior construction",
    defaultHeight: "medium",
  },
  "painting-services": {
    image: serviceHeroes["painting-services"],
    imageAlt: "Professional painting services",
    defaultHeight: "medium",
  },
  "tile-flooring": {
    image: heroTileFlooring,
    imageAlt: "Tile and flooring installation",
    defaultHeight: "medium",
  },
  "sustainable-building": {
    image: serviceHeroes["sustainable-building"],
    imageAlt: "Sustainable building practices",
    defaultHeight: "medium",
  },

  // Audience Pages
  "for-general-contractors": {
    image: audienceHeroes["for-general-contractors"],
    imageAlt: "Construction management for general contractors",
    defaultHeight: "large",
  },
  homeowners: {
    image: audienceHeroes.homeowners,
    imageAlt: "Quality home improvement services",
    defaultHeight: "medium",
  },
  "property-managers": {
    image: audienceHeroes["property-managers"],
    imageAlt: "Property management construction services",
    defaultHeight: "medium",
  },
  "commercial-clients": {
    image: audienceHeroes["commercial-clients"],
    imageAlt: "Commercial construction services",
    defaultHeight: "medium",
  },
  developers: {
    image: audienceHeroes.developers,
    imageAlt: "Development and construction partnership",
    defaultHeight: "medium",
  },
};

/** A stored image must be deployable, rather than a development source path. */
export function isUsableHeroImage(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim() || value !== value.trim())
    return false;
  if (
    value.includes("\\") ||
    [...value].some((character) => character.charCodeAt(0) < 32) ||
    value.startsWith("//")
  )
    return false;
  try {
    const parsed = new URL(value, "https://site.example");
    if (!value.startsWith("/") && !value.startsWith("https://")) return false;
    if (parsed.protocol !== "https:") return false;
    const pathname = decodeURIComponent(parsed.pathname).toLowerCase();
    return (
      !pathname.startsWith("/src/") && !pathname.endsWith("/placeholder.svg")
    );
  } catch {
    return false;
  }
}

export interface ResolvedHeroImage {
  image: string;
  imageAlt: string;
}

const categoryHeroes: Record<ServiceCategory, ResolvedHeroImage> = {
  envelope: {
    image: serviceHeroes["building-envelope-solutions"],
    imageAlt: "Building envelope exterior",
  },
  restoration: {
    image: serviceHeroes["facade-remediation"],
    imageAlt: "Building exterior restoration",
  },
  interior: {
    image: serviceHeroes["interior-buildouts-finishing"],
    imageAlt: "Interior construction and finishing",
  },
};

/** Admin-selected images take precedence; every service retains a local fallback. */
export function resolveServiceHero(
  slug: string,
  featuredImage?: string | null,
  category?: string | null,
): ResolvedHeroImage & { source: "database" | "service" | "category" } {
  const entry = getServiceEntry(slug);
  if (isUsableHeroImage(featuredImage)) {
    return {
      image: featuredImage,
      imageAlt: entry?.navLabel ?? "Construction services",
      source: "database",
    };
  }
  const mapped = (serviceHeroes as Record<string, string>)[slug];
  if (mapped) {
    return {
      image: mapped,
      imageAlt: entry?.navLabel ?? "Construction services",
      source: "service",
    };
  }
  // Registered categories are authoritative; newer database services may use legacy labels.
  const categoryKey =
    entry?.category ??
    (category === "Building Envelope" || category === "envelope"
      ? "envelope"
      : category === "Restoration & Repair" || category === "restoration"
        ? "restoration"
        : category === "Interior Construction" ||
            category === "Interior & Finishes" ||
            category === "interior"
          ? "interior"
          : null);
  return {
    ...(categoryKey
      ? categoryHeroes[categoryKey]
      : {
          image: mainPageHeroes.services,
          imageAlt: "Construction services illustration",
        }),
    source: "category",
  };
}

/** Add only verified city-specific imagery, with an accurate description of the photo. */
export const cityHeroes: Record<string, ResolvedHeroImage> = Object.fromEntries(
  Object.entries(cityPhotography).map(([slug, photo]) => [
    slug,
    { image: photo.image, imageAlt: photo.alt },
  ]),
);

export function getCityHero(
  citySlug: string,
): ResolvedHeroImage & { source: "city" | "regional" } {
  const cityImage = cityHeroes[citySlug];
  return cityImage
    ? { ...cityImage, source: "city" }
    : {
        image: resourceHeroes["service-areas"],
        imageAlt: "Illustrated regional service-area map",
        source: "regional",
      };
}

/** Explicit topic assignments; a valid editor image always wins. */
export const articleHeroes = {
  "early-signs-your-building-envelope-needs-attention":
    portfolioPhotography["envelope-opening"],
  "eifs-vs-stucco-what-building-owners-need-to-know":
    portfolioPhotography["stucco-finish"],
  "how-general-contractors-should-evaluate-specialty-trade-partner":
    portfolioPhotography["coatings-progress"],
  "toronto-property-manager-maintenance-guide":
    portfolioPhotography["condominium-exterior"],
  "what-property-managers-should-prepare-before-envelope-restoration":
    portfolioPhotography["envelope-staging"],
  "why-self-performed-work-changes-quality-cost-accountability":
    portfolioPhotography["envelope-flashing"],
} as const;

export function resolveBlogHero(
  featuredImage?: string | null,
  title?: string,
  slug?: string,
): ResolvedHeroImage & { source: "database" | "article" | "fallback" } {
  if (isUsableHeroImage(featuredImage)) {
    return {
      image: featuredImage,
      imageAlt: title ?? "Article illustration",
      source: "database",
    };
  }
  const topic = slug
    ? (articleHeroes as Record<string, { image: string; alt: string }>)[slug]
    : undefined;
  return topic
    ? { image: topic.image, imageAlt: topic.alt, source: "article" }
    : {
        image: mainPageHeroes.blog,
        imageAlt: "Construction photograph used to illustrate this article",
        source: "fallback",
      };
}
