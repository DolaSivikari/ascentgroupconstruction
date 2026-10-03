import { describe, expect, it } from "vitest";
import { SERVICE_REGISTRY } from "./service-registry";
import { serviceAreaCities } from "./service-area-cities";
import {
  getCityHero,
  isUsableHeroImage,
  mainPageHeroes,
  resolveBlogHero,
  resolveServiceHero,
  resourceHeroes,
  serviceHeroes,
} from "./hero-images";

describe("service hero coverage", () => {
  it("covers every canonical service route, with no redirect-only keys", () => {
    expect(Object.keys(serviceHeroes).sort()).toEqual(SERVICE_REGISTRY.map(service => service.slug).sort());
    for (const service of SERVICE_REGISTRY) {
      const hero = resolveServiceHero(service.slug);
      expect(hero.source).toBe("service");
      expect(hero.image).toBeTruthy();
      expect(hero.imageAlt).toBeTruthy();
    }
  });

  it("shows an admin-selected image instead of silently ignoring the saved image", () => {
    const selected = "https://storage.example/services/new-envelope-photo.jpg";
    expect(resolveServiceHero("building-envelope-solutions", selected)).toMatchObject({ image: selected, source: "database" });
    expect(resolveServiceHero("building-envelope-solutions", "/media/envelope.jpg")).toMatchObject({ image: "/media/envelope.jpg", source: "database" });
  });

  it.each([null, "", "/src/assets/unbuilt.jpg", "/placeholder.svg", "javascript:alert(1)"])("keeps a usable local service image when a stored image is %s", stored => {
    expect(resolveServiceHero("interior-finishing-renovations", stored)).toMatchObject({
      image: serviceHeroes["interior-finishing-renovations"],
      source: "service",
    });
  });

  it("provides category illustrations for new database services", () => {
    expect(resolveServiceHero("future-envelope-service", null, "Building Envelope").image).toBe(serviceHeroes["building-envelope-solutions"]);
    expect(resolveServiceHero("future-interior-service", null, "Interior Construction").image).toBe(serviceHeroes["interior-buildouts-finishing"]);
    expect(resolveServiceHero("future-restoration-service", null, "Restoration & Repair").image).toBe(serviceHeroes["facade-remediation"]);
    expect(resolveServiceHero("future-service", null, "Future Category")).toMatchObject({ image: mainPageHeroes.services, source: "category" });
  });
});

describe("deployable stored images", () => {
  it.each([
    "/src/assets/missing.jpg", "/SRC/missing.jpg", "/src%2Fassets/missing.jpg",
    "/placeholder.svg?cache=1", "https://images.example/placeholder.svg",
    "//images.example/image.jpg", "http://images.example/image.jpg",
    "https://images.example\\image.jpg", "data:image/svg+xml,<svg/>",
    "blob:https://images.example/id", " /media/image.jpg", "image.jpg", "/media/%ZZ.jpg",
  ])("rejects undeployable or unsafe image values: %s", value => {
    expect(isUsableHeroImage(value)).toBe(false);
  });
});

describe("city and article fallbacks", () => {
  it("supplies an illustrated regional map for every city without claiming a city project photo", () => {
    for (const city of serviceAreaCities) {
      const hero = getCityHero(city.toLowerCase().replace(/\s+/g, "-"));
      expect(hero).toEqual({ image: resourceHeroes["service-areas"], imageAlt: "Illustrated regional service-area map", source: "regional" });
    }
  });

  it("replaces empty or placeholder article images with a contextual illustration", () => {
    expect(resolveBlogHero("/placeholder.svg", "A real project case study")).toEqual({
      image: mainPageHeroes.blog,
      imageAlt: "Building exterior used as an article illustration",
      source: "fallback",
    });
    expect(resolveBlogHero(null).image).toBeTruthy();
    expect(resolveBlogHero("https://images.example/article.jpg", "Envelope maintenance")).toEqual({
      image: "https://images.example/article.jpg", imageAlt: "Envelope maintenance", source: "database",
    });
  });
});
