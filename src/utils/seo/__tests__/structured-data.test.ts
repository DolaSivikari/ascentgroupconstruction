import { describe, expect, it } from "vitest";
import { generateServiceSchema } from "../structured-data";
import { articleSchema, breadcrumbSchema } from "@/utils/structured-data";

describe("canonical structured data", () => {
  it("gives city services their actual page URL and the existing company provider", () => {
    const service = generateServiceSchema({
      name: "Toronto services",
      description: "Existing scope",
      slug: "service-areas/toronto",
      path: "/service-areas/toronto",
      areaServed: "Toronto",
    });
    expect(service.url).toBe(
      "https://www.ascentgroupconstruction.com/service-areas/toronto",
    );
    expect(service["@id"]).toBe(`${service.url}#service`);
    expect(service.provider).toEqual({
      "@id": "https://www.ascentgroupconstruction.com/#organization",
    });
    expect(service.areaServed).toEqual({ "@type": "City", name: "Toronto" });
    expect(service.image).toBe(
      "https://www.ascentgroupconstruction.com/og-image.png",
    );
  });
  it("keeps the default canonical service route", () => {
    expect(
      generateServiceSchema({
        name: "Painting",
        description: "Scope",
        slug: "painting-services",
      }).url,
    ).toBe(
      "https://www.ascentgroupconstruction.com/services/painting-services",
    );
  });
  it("uses public URLs for article images, publisher logos and breadcrumbs", () => {
    const article = articleSchema({
      title: "Article",
      description: "Description",
      datePublished: "2026-10-01",
      image: "https://storage.example.com/public/image.webp",
      url: "https://www.ascentgroupconstruction.com/blog/example",
    });
    expect(article.image).toBe("https://storage.example.com/public/image.webp");
    expect(article.publisher.logo.url).toBe(
      "https://www.ascentgroupconstruction.com/ascent-logo.png",
    );
    expect(
      breadcrumbSchema([{ name: "Blog", url: "/blog" }]).itemListElement[0]
        .item,
    ).toBe("https://www.ascentgroupconstruction.com/blog");
  });
});
