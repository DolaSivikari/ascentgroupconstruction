import { SERVICE_REDIRECTS } from "./service-redirects";
import { SERVICE_REGISTRY } from "./service-registry";
import { serviceAreaCities, getServiceAreaPath } from "./service-area-cities";
import {
  audienceHeroes,
  companyHeroes,
  mainPageHeroes,
  resourceHeroes,
  sectorHeroes,
  serviceHeroes,
  getCityHero,
  isUsableHeroImage,
  resolveBlogHero,
  resolveServiceHero,
} from "./hero-images";
import { enrichedHeroSlides } from "./enriched-hero-slides";

export interface PageHeaderRow {
  path: string;
  title: string;
  group:
    | "Main & company"
    | "Services"
    | "Cities"
    | "Projects"
    | "Articles"
    | "Legal";
  presentation:
    | "Image hero"
    | "Video carousel"
    | "Project carousel"
    | "Content image"
    | "Plain header";
  image?: string;
  source: string;
  editPath?: string;
  warning?: string;
}
export interface HeaderService {
  id: string;
  slug: string;
  name: string;
  featured_image: string | null;
  category: string | null;
}
export interface HeaderProject {
  id: string;
  slug: string;
  title: string;
  featured_image: string | null;
}
export interface HeaderArticle {
  id: string;
  slug: string;
  title: string;
  featured_image: string | null;
}
export interface HeaderSlide {
  poster_url: string | null;
}
export interface HeaderMetadata {
  services: HeaderService[];
  projects: HeaderProject[];
  articles: HeaderArticle[];
  slides: HeaderSlide[];
  failed: string[];
}

const staticImages: Array<[string, string, string]> = [
  ["/about", "About", mainPageHeroes.about],
  ["/services", "Services", mainPageHeroes.services],
  ["/markets", "Markets", sectorHeroes["markets-overview"]],
  ["/contact", "Contact / Site Assessment", mainPageHeroes.contact],
  ["/careers", "Careers", mainPageHeroes.careers],
  ["/faq", "FAQ", mainPageHeroes.faq],
  ["/blog", "Insights", mainPageHeroes.blog],
  [
    "/property-managers",
    "Property Managers",
    audienceHeroes["property-managers"],
  ],
  ["/homeowners", "Homeowners", audienceHeroes.homeowners],
  [
    "/commercial-clients",
    "Commercial Clients",
    audienceHeroes["commercial-clients"],
  ],
  [
    "/for-general-contractors",
    "For General Contractors",
    audienceHeroes["for-general-contractors"],
  ],
  [
    "/for-architects",
    "For Architects",
    serviceHeroes["building-envelope-solutions"],
  ],
  ["/company/developers", "Developers", audienceHeroes.developers],
  [
    "/company/technology",
    "Technology & Innovation",
    companyHeroes["our-process"],
  ],
  ["/our-process", "Our Process", companyHeroes["our-process"]],
  ["/capabilities", "Capabilities", companyHeroes.capabilities],
  [
    "/why-specialty-contractor",
    "Why Specialty Contractor",
    companyHeroes["why-specialty-contractor"],
  ],
  [
    "/company/certifications-insurance",
    "Certifications & Insurance",
    companyHeroes["certifications-insurance"],
  ],
  ["/prequalification", "Prequalification", resourceHeroes.prequalification],
  [
    "/resources/contractor-portal",
    "Contractor Portal",
    resourceHeroes["contractor-portal"],
  ],
  [
    "/resources/service-areas",
    "Service Areas",
    resourceHeroes["service-areas"],
  ],
  ["/estimate", "Request Estimate", resourceHeroes.estimate],
  ["/submit-rfp", "Submit RFP", resourceHeroes["submit-rfp"]],
  [
    "/emergency-repair",
    "Emergency Repair",
    serviceHeroes["waterproofing-systems"],
  ],
];

/** Canonical content pages only: aliases and utilities do not inflate coverage. */
export function buildPageHeaders(metadata: HeaderMetadata): PageHeaderRow[] {
  const rows: PageHeaderRow[] = staticImages.map(([path, title, image]) => ({
    path,
    title,
    image,
    group: "Main & company",
    presentation: "Image hero",
    source: "Shared image registry",
  }));
  const firstSlide = metadata.slides[0]?.poster_url?.trim();
  rows.push({
    path: "/",
    title: "Home",
    group: "Main & company",
    presentation: "Video carousel",
    image: isUsableHeroImage(firstSlide)
      ? firstSlide
      : enrichedHeroSlides[0].poster,
    source: metadata.failed.includes("Homepage slides")
      ? "Slide source unavailable"
      : metadata.slides.length
        ? isUsableHeroImage(firstSlide)
          ? "Active homepage slides (first poster)"
          : "Active homepage slides (fallback poster)"
        : "Homepage fallback slides",
    editPath: "/admin/homepage-builder?tab=hero",
    warning:
      firstSlide && !isUsableHeroImage(firstSlide)
        ? "The first active poster is unusable; this preview uses the local fallback."
        : undefined,
  });
  rows.push({
    path: "/projects",
    title: "Projects",
    group: "Main & company",
    presentation: "Project carousel",
    source: "Rotating published project images",
    editPath: "/admin/projects",
  });
  for (const [path, title] of [
    ["/privacy", "Privacy"],
    ["/terms", "Terms"],
    ["/accessibility", "Accessibility"],
  ]) {
    rows.push({
      path,
      title,
      group: "Legal",
      presentation: "Plain header",
      source: "Intentional text header",
    });
  }
  const servicesBySlug = new Map(
    metadata.services.map((service) => [service.slug, service]),
  );
  const serviceSlugs = new Set([
    ...SERVICE_REGISTRY.map((service) => service.slug),
    ...servicesBySlug.keys(),
  ]);
  for (const slug of serviceSlugs) {
    if (Object.prototype.hasOwnProperty.call(SERVICE_REDIRECTS, slug)) continue;
    const entry = SERVICE_REGISTRY.find((service) => service.slug === slug);
    const record = servicesBySlug.get(slug);
    // Specialty landing pages are static and do not read a service's database image.
    const staticPage = entry?.source === "static";
    const hero = resolveServiceHero(
      slug,
      staticPage ? null : record?.featured_image,
      record?.category,
    );
    rows.push({
      path: `/services/${slug}`,
      title: entry?.navLabel || record?.name || slug,
      group: "Services",
      presentation: "Image hero",
      image: hero.image,
      source:
        !staticPage && !record
          ? metadata.failed.includes("Published services")
            ? "Service metadata unavailable"
            : "No published service record"
          : hero.source === "database"
            ? "Service editor"
            : hero.source === "category"
              ? "Category fallback"
              : "Service image registry",
      editPath:
        !staticPage && record ? `/admin/services/${record.id}` : undefined,
      warning:
        !staticPage && !record
          ? metadata.failed.includes("Published services")
            ? "Published service lookup failed; showing its configured fallback."
            : "No published service record was found; the public detail page may be unavailable."
          : !staticPage &&
              record?.featured_image &&
              !isUsableHeroImage(record.featured_image)
            ? "Stored image is unusable; showing the service fallback."
            : undefined,
    });
  }
  for (const city of serviceAreaCities) {
    const path = getServiceAreaPath(city)!;
    const hero = getCityHero(path.split("/").pop()!);
    rows.push({
      path,
      title: city,
      group: "Cities",
      presentation: "Image hero",
      image: hero.image,
      source:
        hero.source === "regional"
          ? "Illustrated regional map"
          : "City image registry",
    });
  }
  for (const project of metadata.projects) {
    const usable = isUsableHeroImage(project.featured_image);
    rows.push({
      path: `/projects/${project.slug}`,
      title: project.title,
      group: "Projects",
      presentation: "Content image",
      image: usable ? project.featured_image! : undefined,
      source: usable
        ? "Project editor (below title)"
        : "Branded project fallback",
      editPath: `/admin/projects/${project.id}`,
      warning: usable
        ? undefined
        : "No usable featured image; the public page uses its branded fallback.",
    });
  }
  for (const article of metadata.articles) {
    const hero = resolveBlogHero(article.featured_image, article.title);
    rows.push({
      path: `/blog/${article.slug}`,
      title: article.title,
      group: "Articles",
      presentation: "Image hero",
      image: hero.image,
      source:
        hero.source === "database"
          ? "Article editor"
          : "Contextual article fallback",
      editPath: `/admin/blog/${article.id}`,
    });
  }
  return rows.sort((a, b) => a.path.localeCompare(b.path));
}

export function sharedImagePaths(rows: PageHeaderRow[]): Map<string, string[]> {
  const groups = new Map<string, string[]>();
  for (const row of rows) {
    if (row.image)
      groups.set(row.image, [...(groups.get(row.image) || []), row.path]);
  }
  return groups;
}
