import { expect, it } from "vitest";
import { getServiceCategoryTitle, getServiceParent, getServiceSpecialties, SERVICE_REGISTRY } from "./service-registry";

it("uses menu categories when database labels differ, keeping future categories visible", () => {
  expect(getServiceCategoryTitle("masonry-restoration", "Building Envelope")).toBe("Restoration & Repair");
  expect(getServiceCategoryTitle("sustainable-building", "Specialized Services")).toBe("Building Envelope");
  expect(getServiceCategoryTitle("future-service", "New Category")).toBe("New Category");
});
it("connects painting specialties and the missing renovations page to broader services", () => {
  expect(getServiceSpecialties("painting-services")).toHaveLength(5);
  expect(getServiceParent("interior-finishing-renovations")?.path).toBe("/services/interior-buildouts-finishing");
  expect(getServiceParent("painting-services")).toBeUndefined();
  // Every curated specialty has a real parent, without cycles or duplicate destinations.
  expect(new Set(SERVICE_REGISTRY.map(entry => entry.path)).size).toBe(SERVICE_REGISTRY.length);
  for (const entry of SERVICE_REGISTRY.filter(service => service.parentSlug)) {
    const parent = getServiceParent(entry.slug);
    expect(parent).toBeDefined();
    expect(parent?.slug).not.toBe(entry.slug);
    expect(parent?.parentSlug).toBeUndefined();
  }
});
