/**
 * Hero Image Mapping
 * Centralized configuration for all page hero images
 */

// Import hero images from assets
import heroAboutCompany from "@/assets/heroes/hero-about-company.jpg";
import heroCertifications from "@/assets/heroes/hero-certifications.jpg";
import heroCommercial from "@/assets/heroes/hero-commercial.jpg";
import heroConstructionManagement from "@/assets/heroes/hero-construction-management.jpg";
import { getServiceEntry, type ServiceCategory } from "@/data/service-registry";
import heroContractorPortal from "@/assets/heroes/hero-contractor-portal.jpg";
import heroDesignBuild from "@/assets/heroes/hero-design-build.jpg";
import heroDevelopers from "@/assets/heroes/hero-developers.jpg";
import heroEducation from "@/assets/heroes/hero-education.jpg";
import heroEquipment from "@/assets/heroes/hero-equipment.jpg";
import heroFacadeRemediation from "@/assets/heroes/hero-facade-remediation.jpg";
import heroFinancing from "@/assets/heroes/hero-financing.jpg";
import heroGeneralContracting from "@/assets/heroes/hero-general-contracting.jpg";
import heroHealthcare from "@/assets/heroes/hero-healthcare.jpg";
import heroHospitality from "@/assets/heroes/hero-hospitality.jpg";
import heroIndustrial from "@/assets/heroes/hero-industrial.jpg";
import heroInstitutional from "@/assets/heroes/hero-institutional.jpg";
import heroMarketsOverview from "@/assets/heroes/hero-markets-overview.jpg";
import heroMultiFamily from "@/assets/heroes/hero-multi-family.jpg";
import heroPainting from "@/assets/heroes/hero-painting.jpg";
import heroRetail from "@/assets/heroes/hero-retail.jpg";
import heroSealantReplacement from "@/assets/heroes/hero-sealant-replacement.jpg";
import heroServiceAreas from "@/assets/heroes/hero-service-areas.jpg";
import heroSustainable from "@/assets/heroes/hero-sustainable.jpg";
import heroTeam from "@/assets/heroes/hero-team.jpg";
import heroTileFlooring from "@/assets/heroes/hero-tile-flooring.jpg";
import heroWarranties from "@/assets/heroes/hero-warranties.jpg";

// Import additional hero images from root assets folder
import heroBuildingEnvelope from "@/assets/hero-building-envelope.jpg";
import heroEifsStucco from "@/assets/hero-eifs-stucco.jpg";
import heroExteriorCladding from "@/assets/hero-exterior-cladding.jpg";
import heroInteriorBuildouts from "@/assets/hero-interior-buildouts.jpg";
import heroMasonryRestoration from "@/assets/hero-masonry-restoration.jpg";
import heroWaterproofing from "@/assets/hero-waterproofing.jpg";
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
  about: heroAboutCompany,
  services: heroGeneralContracting,
  projects: heroConstructionManagement,
  contact: heroTeam,
  careers: heroTeam,
  faq: heroAboutCompany,
  blog: heroEducation,
  insights: heroEducation,
} as const;

/**
 * Service Pages Hero Images
 */
export const serviceHeroes = {
  // Building Envelope Category
  "building-envelope-solutions": heroBuildingEnvelope,
  "cladding-systems": heroExteriorCladding,
  "eifs-stucco-systems": heroEifsStucco,
  "masonry-restoration": heroMasonryRestoration,
  "waterproofing-systems": heroWaterproofing,
  "facade-remediation": heroFacadeRemediation,
  "parking-garage-restoration": heroParkingRehabilitation,
  "sealant-programs": heroSealantReplacement,
  
  // Interior Construction Category
  "interior-buildouts-finishing": heroInteriorBuildouts,
  "interior-finishing-renovations": heroInteriorBuildouts,
  "painting-services": heroPainting,
  "tile-flooring": heroTileFlooring,
  
  // Specialized Services Category
  "sustainable-building": heroSustainable,

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
  "for-general-contractors": heroConstructionManagement,
  "homeowners": heroPainting,
  "property-managers": heroCommercial,
  "commercial-clients": heroCommercial,
  "developers": heroDevelopers,
} as const;

/**
 * Sector/Market Pages Hero Images
 */
export const sectorHeroes = {
  "commercial": heroCommercial,
  "retail": heroRetail,
  "hospitality": heroHospitality,
  "healthcare": heroHealthcare,
  "education": heroEducation,
  "institutional": heroInstitutional,
  "industrial": heroIndustrial,
  "multi-family": heroMultiFamily,
  "markets-overview": heroMarketsOverview,
} as const;

/**
 * Company Pages Hero Images
 */
export const companyHeroes = {
  "our-process": heroGeneralContracting,
  "capabilities": heroGeneralContracting,
  "sustainability": heroSustainable,
  "why-specialty-contractor": heroGeneralContracting,
  "certifications-insurance": heroCertifications,
  "equipment-resources": heroEquipment,
  "warranties": heroWarranties,
  "financing": heroFinancing,
} as const;

/**
 * Resource Pages Hero Images
 */
export const resourceHeroes = {
  "prequalification": heroCertifications,
  "contractor-portal": heroContractorPortal,
  "service-areas": heroServiceAreas,
  "estimate": heroDesignBuild,
  "submit-rfp": heroGeneralContracting,
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
  
  return allHeroes[pageKey as keyof typeof allHeroes] || heroAboutCompany;
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
    image: heroAboutCompany,
    imageAlt: "Ascent Group Construction team at work",
    defaultHeight: "large",
  },
  services: {
    image: heroGeneralContracting,
    imageAlt: "Professional construction services",
    defaultHeight: "large",
  },
  contact: {
    image: heroAboutCompany,
    imageAlt: "Contact Ascent Group Construction",
    defaultHeight: "medium",
  },
  careers: {
    image: heroTeam,
    imageAlt: "Join the Ascent Group Construction team",
    defaultHeight: "medium",
  },
  
  // Service Pages
  "building-envelope-solutions": {
    image: heroBuildingEnvelope,
    imageAlt: "Building envelope restoration and repair services",
    defaultHeight: "medium",
  },
  "cladding-systems": {
    image: heroExteriorCladding,
    imageAlt: "Exterior cladding installation and repair",
    defaultHeight: "medium",
  },
  "eifs-stucco-systems": {
    image: heroEifsStucco,
    imageAlt: "EIFS and stucco system installation",
    defaultHeight: "medium",
  },
  "masonry-restoration": {
    image: heroMasonryRestoration,
    imageAlt: "Masonry restoration and brick repair",
    defaultHeight: "medium",
  },
  "waterproofing-systems": {
    image: heroWaterproofing,
    imageAlt: "Waterproofing and moisture protection",
    defaultHeight: "medium",
  },
  "interior-buildouts-finishing": {
    image: heroInteriorBuildouts,
    imageAlt: "Commercial interior construction",
    defaultHeight: "medium",
  },
  "painting-services": {
    image: heroPainting,
    imageAlt: "Professional painting services",
    defaultHeight: "medium",
  },
  "tile-flooring": {
    image: heroTileFlooring,
    imageAlt: "Tile and flooring installation",
    defaultHeight: "medium",
  },
  "sustainable-building": {
    image: heroSustainable,
    imageAlt: "Sustainable building practices",
    defaultHeight: "medium",
  },
  
  // Audience Pages
  "for-general-contractors": {
    image: heroConstructionManagement,
    imageAlt: "Construction management for general contractors",
    defaultHeight: "large",
  },
  "homeowners": {
    image: heroPainting,
    imageAlt: "Quality home improvement services",
    defaultHeight: "medium",
  },
  "property-managers": {
    image: heroCommercial,
    imageAlt: "Property management construction services",
    defaultHeight: "medium",
  },
  "commercial-clients": {
    image: heroCommercial,
    imageAlt: "Commercial construction services",
    defaultHeight: "medium",
  },
  "developers": {
    image: heroDevelopers,
    imageAlt: "Development and construction partnership",
    defaultHeight: "medium",
  },
};


/** A stored image must be deployable, rather than a development source path. */
export function isUsableHeroImage(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim() || value !== value.trim()) return false;
  if (value.includes("\\") || [...value].some(character => character.charCodeAt(0) < 32) || value.startsWith("//")) return false;
  try {
    const parsed = new URL(value, "https://site.example");
    if (!value.startsWith("/") && !value.startsWith("https://")) return false;
    if (parsed.protocol !== "https:") return false;
    const pathname = decodeURIComponent(parsed.pathname).toLowerCase();
    return !pathname.startsWith("/src/") && !pathname.endsWith("/placeholder.svg");
  } catch {
    return false;
  }
}

export interface ResolvedHeroImage {
  image: string;
  imageAlt: string;
}

const categoryHeroes: Record<ServiceCategory, ResolvedHeroImage> = {
  envelope: { image: heroBuildingEnvelope, imageAlt: "Building envelope exterior" },
  restoration: { image: heroFacadeRemediation, imageAlt: "Building exterior restoration" },
  interior: { image: heroInteriorBuildouts, imageAlt: "Interior construction and finishing" },
};

/** Admin-selected images take precedence; every service retains a local fallback. */
export function resolveServiceHero(slug: string, featuredImage?: string | null, category?: string | null): ResolvedHeroImage & { source: "database" | "service" | "category" } {
  const entry = getServiceEntry(slug);
  if (isUsableHeroImage(featuredImage)) {
    return { image: featuredImage, imageAlt: entry?.navLabel ?? "Construction services", source: "database" };
  }
  const mapped = (serviceHeroes as Record<string, string>)[slug];
  if (mapped) {
    return { image: mapped, imageAlt: entry?.navLabel ?? "Construction services", source: "service" };
  }
  // Registered categories are authoritative; newer database services may use legacy labels.
  const categoryKey = entry?.category ?? (
    category === "Building Envelope" || category === "envelope" ? "envelope" :
    category === "Restoration & Repair" || category === "restoration" ? "restoration" :
    category === "Interior Construction" || category === "Interior & Finishes" || category === "interior" ? "interior" : null
  );
  return {
    ...(categoryKey ? categoryHeroes[categoryKey] : { image: mainPageHeroes.services, imageAlt: "Construction services illustration" }),
    source: "category",
  };
}

/** Add only verified city-specific imagery, with an accurate description of the photo. */
export const cityHeroes: Record<string, ResolvedHeroImage> = {};

export function getCityHero(citySlug: string): ResolvedHeroImage & { source: "city" | "regional" } {
  const cityImage = cityHeroes[citySlug];
  return cityImage
    ? { ...cityImage, source: "city" }
    : { image: resourceHeroes["service-areas"], imageAlt: "Illustrated regional service-area map", source: "regional" };
}

/** Missing article imagery gets an illustration, never a claimed case-study project photo. */
export function resolveBlogHero(featuredImage?: string | null, title?: string): ResolvedHeroImage & { source: "database" | "fallback" } {
  return isUsableHeroImage(featuredImage)
    ? { image: featuredImage, imageAlt: title ?? "Article illustration", source: "database" }
    : { image: mainPageHeroes.blog, imageAlt: "Building exterior used as an article illustration", source: "fallback" };
}
