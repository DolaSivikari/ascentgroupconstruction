import { cityPhotography } from "./hero-photography";
import { generatedHeroScenes } from "./hero-scenes";
/**
 * Hero Image Mapping
 * Centralized configuration for all page hero images
 */

// Import hero images from assets
import heroCommercial from "@/assets/heroes/hero-commercial.jpg";
import heroConstructionManagement from "@/assets/heroes/hero-construction-management.jpg";
import { getServiceEntry, type ServiceCategory } from "@/data/service-registry";
import heroEducation from "@/assets/heroes/hero-education.jpg";
import heroEquipment from "@/assets/heroes/hero-equipment.jpg";
import heroFinancing from "@/assets/heroes/hero-financing.jpg";
import heroHealthcare from "@/assets/heroes/hero-healthcare.jpg";
import heroHospitality from "@/assets/heroes/hero-hospitality.jpg";
import heroIndustrial from "@/assets/heroes/hero-industrial.jpg";
import heroInstitutional from "@/assets/heroes/hero-institutional.jpg";
import heroMultiFamily from "@/assets/heroes/hero-multi-family.jpg";
import heroRetail from "@/assets/heroes/hero-retail.jpg";
import heroServiceAreas from "@/assets/heroes/hero-service-areas.jpg";
import heroSustainable from "@/assets/heroes/hero-sustainable.jpg";
import heroWarranties from "@/assets/heroes/hero-warranties.jpg";

/**
 * Main Pages Hero Images
 */
export const mainPageHeroes = {
  about: generatedHeroScenes["about"].image,
  services: generatedHeroScenes["services"].image,
  contact: generatedHeroScenes["contact"].image,
  careers: generatedHeroScenes["careers"].image,
  faq: generatedHeroScenes["faq"].image,
  blog: generatedHeroScenes["blog"].image,
  insights: generatedHeroScenes["blog"].image,
  "emergency-repair": generatedHeroScenes["emergency-repair"].image,
  projects: heroConstructionManagement,
} as const;

/**
 * Service Pages Hero Images
 */
export const serviceHeroes = {
  "building-envelope-solutions":
    generatedHeroScenes["building-envelope-solutions"].image,
  "cladding-systems": generatedHeroScenes["cladding-systems"].image,
  "waterproofing-systems": generatedHeroScenes["waterproofing-systems"].image,
  "eifs-stucco-systems": generatedHeroScenes["eifs-stucco-systems"].image,
  "facade-remediation": generatedHeroScenes["facade-remediation"].image,
  "masonry-restoration": generatedHeroScenes["masonry-restoration"].image,
  "parking-garage-restoration":
    generatedHeroScenes["parking-garage-restoration"].image,
  "sealant-programs": generatedHeroScenes["sealant-programs"].image,
  "interior-buildouts-finishing":
    generatedHeroScenes["interior-buildouts-finishing"].image,
  "interior-finishing-renovations":
    generatedHeroScenes["interior-finishing-renovations"].image,
  "painting-services": generatedHeroScenes["painting-services"].image,
  "tile-flooring": generatedHeroScenes["tile-flooring"].image,
  "sustainable-building": generatedHeroScenes["sustainable-building"].image,
  "commercial-painting-gta":
    generatedHeroScenes["commercial-painting-gta"].image,
  "exterior-painting-toronto":
    generatedHeroScenes["exterior-painting-toronto"].image,
  "caulking-sealants-toronto":
    generatedHeroScenes["caulking-sealants-toronto"].image,
  "fire-retardant-coatings-ontario":
    generatedHeroScenes["fire-retardant-coatings-ontario"].image,
  "interior-painting-toronto":
    generatedHeroScenes["interior-painting-toronto"].image,
  "residential-exterior-painting-gta":
    generatedHeroScenes["residential-exterior-painting-gta"].image,
  "tile-installation-toronto":
    generatedHeroScenes["tile-installation-toronto"].image,
  "flooring-installation-gta":
    generatedHeroScenes["flooring-installation-gta"].image,
  "handyman-patching-toronto":
    generatedHeroScenes["handyman-patching-toronto"].image,
} as const;

/**
 * Audience Pages Hero Images
 */
export const audienceHeroes = {
  "for-general-contractors":
    generatedHeroScenes["for-general-contractors"].image,
  "for-architects": generatedHeroScenes["for-architects"].image,
  homeowners: generatedHeroScenes["homeowners"].image,
  "property-managers": generatedHeroScenes["property-managers"].image,
  "commercial-clients": generatedHeroScenes["commercial-clients"].image,
  developers: generatedHeroScenes["developers"].image,
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
  "markets-overview": generatedHeroScenes.markets.image,
} as const;

/**
 * Company Pages Hero Images
 */
export const companyHeroes = {
  "our-process": generatedHeroScenes["our-process"].image,
  technology: generatedHeroScenes["technology"].image,
  capabilities: generatedHeroScenes["capabilities"].image,
  sustainability: heroSustainable,
  "why-specialty-contractor":
    generatedHeroScenes["why-specialty-contractor"].image,
  "certifications-insurance":
    generatedHeroScenes["certifications-insurance"].image,
  "equipment-resources": heroEquipment,
  warranties: heroWarranties,
  financing: heroFinancing,
} as const;

/**
 * Resource Pages Hero Images
 */
export const resourceHeroes = {
  prequalification: generatedHeroScenes["prequalification"].image,
  "contractor-portal": generatedHeroScenes["contractor-portal"].image,
  "service-areas": heroServiceAreas,
  estimate: generatedHeroScenes["estimate"].image,
  "submit-rfp": generatedHeroScenes["submit-rfp"].image,
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
    imageAlt: generatedHeroScenes.about.alt,
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
    image: serviceHeroes["masonry-restoration"],
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
    image: serviceHeroes["tile-flooring"],
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
    generatedHeroScenes["article-envelope-signs"],
  "eifs-vs-stucco-what-building-owners-need-to-know":
    generatedHeroScenes["article-eifs-stucco"],
  "how-general-contractors-should-evaluate-specialty-trade-partner":
    generatedHeroScenes["article-trade-partner"],
  "toronto-property-manager-maintenance-guide":
    generatedHeroScenes["article-pm-maintenance"],
  "what-property-managers-should-prepare-before-envelope-restoration":
    generatedHeroScenes["article-envelope-preparation"],
  "why-self-performed-work-changes-quality-cost-accountability":
    generatedHeroScenes["article-self-performed"],
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
        imageAlt: generatedHeroScenes.blog.alt,
        source: "fallback",
      };
}
