import { describe, expect, it } from "vitest";
import { buildPageHeaders, sharedImagePaths, type HeaderMetadata } from "./page-headers";
import { SERVICE_REGISTRY } from "./service-registry";
import { SERVICE_REDIRECTS } from "./service-redirects";
import { getServiceAreaPath, serviceAreaCities } from "./service-area-cities";
import { articleHeroes, audienceHeroes, companyHeroes, mainPageHeroes, resourceHeroes, serviceHeroes } from "./hero-images";
import { enrichedHeroSlides } from "./enriched-hero-slides";

const emptyMetadata = (): HeaderMetadata => ({ services: [], projects: [], articles: [], slides: [], failed: [] });
const mainPaths = [
  "/", "/about", "/accessibility", "/blog", "/capabilities", "/careers", "/commercial-clients",
  "/company/certifications-insurance", "/company/developers", "/company/technology", "/contact", "/emergency-repair",
  "/estimate", "/faq", "/for-architects", "/for-general-contractors", "/homeowners", "/markets", "/our-process",
  "/prequalification", "/privacy", "/projects", "/property-managers", "/resources/contractor-portal",
  "/resources/service-areas", "/services", "/submit-rfp", "/terms", "/why-specialty-contractor",
];

describe("canonical page-header inventory", () => {
  it("lists exactly 68 code-known content URLs: 29 main pages, 22 services and 17 cities", () => {
    const rows = buildPageHeaders(emptyMetadata());
    expect(rows).toHaveLength(68);
    expect(new Set(rows.map(row => row.path)).size).toBe(68);
    expect(rows.map(row => row.path).sort()).toEqual([
      ...mainPaths, ...SERVICE_REGISTRY.map(service => service.path), ...serviceAreaCities.map(city => getServiceAreaPath(city)!),
    ].sort());
    expect(rows.filter(row => row.group === "Services")).toHaveLength(22);
    expect(rows.filter(row => row.group === "Cities")).toHaveLength(17);
    expect(rows.filter(row => row.group === "Legal").map(row => [row.path, row.presentation, row.image])).toEqual([
      ["/accessibility", "Plain header", undefined], ["/privacy", "Plain header", undefined], ["/terms", "Plain header", undefined],
    ]);
  });

  it("includes all 85 public content pages when eleven projects and six articles are published", () => {
    const metadata = emptyMetadata();
    metadata.projects = Array.from({ length: 11 }, (_, index) => ({ id: `project-${index}`, slug: `project-${index}`, title: `Project ${index}`, featured_image: "/media/project.jpg" }));
    metadata.articles = Array.from({ length: 6 }, (_, index) => ({ id: `article-${index}`, slug: `article-${index}`, title: `Article ${index}`, featured_image: "/media/article.jpg" }));
    const rows = buildPageHeaders(metadata);
    expect(rows).toHaveLength(85);
    expect(rows.filter(row => row.group === "Projects")).toHaveLength(11);
    expect(rows.filter(row => row.group === "Articles")).toHaveLength(6);
    expect(rows.find(row => row.path === "/projects/project-10")?.editPath).toBe("/admin/projects/project-10");
    expect(rows.find(row => row.path === "/blog/article-5")?.editPath).toBe("/admin/blog/article-5");
  });

  it("excludes redirect aliases and utility URLs even when obsolete service rows are still published", () => {
    const metadata = emptyMetadata();
    metadata.services = Object.keys(SERVICE_REDIRECTS).map(slug => ({ id: `legacy-${slug}`, slug, name: slug, featured_image: "/media/legacy.jpg", category: null }));
    const rows = buildPageHeaders(metadata);
    expect(rows).toHaveLength(68);
    const paths = rows.map(row => row.path);
    for (const slug of Object.keys(SERVICE_REDIRECTS)) expect(paths).not.toContain(`/services/${slug}`);
    for (const alias of ["/insights", "/case-studies", "/sustainability", "/service-selector", "/free-quote", "/get-estimate", "/company/equipment-resources", "/tekev", "/unsubscribe", "/email-unsubscribe", "/.lovable/oauth/consent", "/dev/tokens", "/404"]) {
      expect(paths).not.toContain(alias);
    }
  });

  it("retains genuinely new published database services instead of assuming unregistered slugs redirect", () => {
    const metadata = emptyMetadata();
    metadata.services = [{ id: "new-service", slug: "future-envelope-program", name: "Future envelope program", featured_image: null, category: "Building Envelope" }];
    const rows = buildPageHeaders(metadata);
    expect(rows).toHaveLength(69);
    expect(rows.find(row => row.path === "/services/future-envelope-program")).toMatchObject({
      image: serviceHeroes["building-envelope-solutions"], source: "Category fallback", editPath: "/admin/services/new-service",
    });
  });
});

describe("inventory reflects the public presentation", () => {
  it("uses the service editor image for database services while static specialties retain their code image", () => {
    const metadata = emptyMetadata();
    metadata.services = [
      { id: "envelope", slug: "building-envelope-solutions", name: "Envelope", featured_image: "/media/admin-envelope.jpg", category: "Building Envelope" },
      { id: "painting", slug: "commercial-painting-gta", name: "Painting", featured_image: "/media/ignored-specialty.jpg", category: "Interior Construction" },
    ];
    const rows = buildPageHeaders(metadata);
    expect(rows.find(row => row.path === "/services/building-envelope-solutions")).toMatchObject({ image: "/media/admin-envelope.jpg", source: "Service editor", editPath: "/admin/services/envelope" });
    expect(rows.find(row => row.path === "/services/commercial-painting-gta")).toMatchObject({ image: serviceHeroes["commercial-painting-gta"], source: "Service image registry" });
    expect(rows.find(row => row.path === "/services/commercial-painting-gta")?.editPath).toBeUndefined();
  });

  it("warns about undeployable service images and missing project imagery while keeping honest article fallbacks", () => {
    const metadata = emptyMetadata();
    metadata.services = [{ id: "service", slug: "interior-finishing-renovations", name: "Interior", featured_image: "/src/assets/unbuilt.jpg", category: "Interior Construction" }];
    metadata.projects = [{ id: "project", slug: "missing-image", title: "Missing image", featured_image: null }];
    metadata.articles = [{ id: "article", slug: "missing-image", title: "A case study", featured_image: "/placeholder.svg" }];
    const rows = buildPageHeaders(metadata);
    expect(rows.find(row => row.path === "/services/interior-finishing-renovations")).toMatchObject({ image: serviceHeroes["interior-finishing-renovations"], source: "Service image registry", warning: expect.stringContaining("unusable") });
    expect(rows.find(row => row.path === "/projects/missing-image")).toMatchObject({ presentation: "Content image", source: "Branded project fallback", warning: expect.stringContaining("No usable featured image") });
    expect(rows.find(row => row.path === "/projects/missing-image")?.image).toBeUndefined();
    expect(rows.find(row => row.path === "/blog/missing-image")).toMatchObject({ image: mainPageHeroes.blog, source: "Contextual article fallback" });
  });

  it("matches the actual contact, audience, technology and contractor portal image lookups", () => {
    const rows = buildPageHeaders(emptyMetadata());
    for (const [path, image] of [
      ["/contact", mainPageHeroes.contact], ["/careers", mainPageHeroes.careers], ["/blog", mainPageHeroes.blog],
      ["/company/technology", companyHeroes.technology], ["/for-architects", audienceHeroes["for-architects"]],
      ["/property-managers", audienceHeroes["property-managers"]], ["/company/developers", audienceHeroes.developers],
      ["/resources/contractor-portal", resourceHeroes["contractor-portal"]],
    ]) expect(rows.find(row => row.path === path)?.image).toBe(image);
  });

  it("shows the active homepage poster, with the protected carousel fallback when slide metadata is absent", () => {
    const metadata = emptyMetadata();
    metadata.slides = [{ poster_url: "https://images.example/active-poster.webp" }];
    expect(buildPageHeaders(metadata).find(row => row.path === "/")).toMatchObject({ image: "https://images.example/active-poster.webp", source: "Active homepage slides (first poster)", editPath: "/admin/homepage-builder?tab=hero" });
    expect(buildPageHeaders(emptyMetadata()).find(row => row.path === "/")).toMatchObject({ image: enrichedHeroSlides[0].poster, source: "Homepage fallback slides" });
    metadata.slides = [];
    metadata.failed = ["Homepage slides"];
    expect(buildPageHeaders(metadata).find(row => row.path === "/")).toMatchObject({ image: enrichedHeroSlides[0].poster, source: "Slide source unavailable" });
  });

  it.each([null, "", "/src/assets/unbuilt-poster.jpg", "javascript:alert(1)"])("labels the active slide poster fallback honestly when the stored poster is %s", poster => {
    const metadata = emptyMetadata();
    metadata.slides = [{ poster_url: poster }];
    const homepage = buildPageHeaders(metadata).find(row => row.path === "/");
    expect(homepage).toMatchObject({ image: enrichedHeroSlides[0].poster, source: "Active homepage slides (fallback poster)" });
    if (poster) expect(homepage?.warning).toContain("unusable");
  });

  it("distinguishes a genuinely absent published service from an unavailable service lookup", () => {
    const metadata = emptyMetadata();
    const absent = buildPageHeaders(metadata).find(row => row.path === "/services/building-envelope-solutions");
    expect(absent).toMatchObject({ source: "No published service record", warning: expect.stringContaining("public detail page may be unavailable") });
    expect(absent?.editPath).toBeUndefined();
    metadata.failed = ["Published services"];
    const failed = buildPageHeaders(metadata).find(row => row.path === "/services/building-envelope-solutions");
    expect(failed).toMatchObject({ source: "Service metadata unavailable", warning: expect.stringContaining("lookup failed") });
    expect(failed?.warning).not.toContain("No published service record");
    const staticSpecialty = buildPageHeaders(metadata).find(row => row.path === "/services/commercial-painting-gta");
    expect(staticSpecialty).toMatchObject({ source: "Service image registry", image: serviceHeroes["commercial-painting-gta"] });
    expect(staticSpecialty?.warning).toBeUndefined();
  });

  it("groups identical images by actual canonical paths and leaves plain headers out", () => {
    const rows = buildPageHeaders(emptyMetadata());
    const groups = sharedImagePaths(rows);
    expect(groups.get(mainPageHeroes.services)?.sort()).toEqual([
      "/services",
    ].sort());
    const mapPaths = groups.get(resourceHeroes["service-areas"]);
    expect(mapPaths).toHaveLength(1);
    expect(mapPaths).toContain("/resources/service-areas");
    expect(mapPaths).not.toContain("/service-areas/toronto");
    expect(groups.has("")).toBe(false);
    expect([...groups.values()].flat()).not.toContain("/privacy");
    expect([...groups.values()].flat()).not.toContain("/projects");
  });

  it("gives every one of the 69 current image-hero pages a distinct bundled default", () => {
    const metadata = emptyMetadata();
    metadata.services = SERVICE_REGISTRY.filter(service => service.source === "db").map(service => ({
      id: service.slug, slug: service.slug, name: service.navLabel, category: service.category, featured_image: null,
    }));
    metadata.articles = Object.keys(articleHeroes).map(slug => ({
      id: slug, slug, title: slug, featured_image: null,
    }));
    const rows = buildPageHeaders(metadata).filter(row => row.presentation === "Image hero");
    expect(rows).toHaveLength(69);
    expect(rows.every(row => row.image)).toBe(true);
    const groups = sharedImagePaths(rows);
    expect([...groups.values()].filter(paths => paths.length > 1)).toEqual([]);
    expect(groups.size).toBe(69);
    expect(rows.find(row => row.path === "/emergency-repair")?.image).toBe(mainPageHeroes["emergency-repair"]);
    expect(mainPageHeroes["emergency-repair"]).not.toBe(serviceHeroes["waterproofing-systems"]);
  });
});
