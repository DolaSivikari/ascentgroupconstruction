import { getServiceEntry } from "@/data/service-registry";

export interface DirectoryService {
  slug: string;
  name: string;
  short_description: string | null;
  category: string | null;
  icon_name: string | null;
}

export const SERVICE_HUB_GUIDANCE: Record<string, string> = {
  "painting-services":
    "Start here for painting work involving several areas or property types. Choose commercial, interior, exterior or residential painting below for a more specific scope.",
  "tile-flooring":
    "Compare tile and flooring options for your project. Choose tile installation for tiled finishes, or flooring installation for hardwood, laminate and resilient flooring.",
  "interior-buildouts-finishing":
    "Start here for coordinated interior trade packages and fit-outs. Interior finishing and renovations covers updates to an existing interior.",
  "caulking-sealants-toronto":
    "Choose caulking and sealants for joint repairs and replacement work. Sealant programs focuses on planned maintenance across a property or portfolio.",
};

export function filterDirectory(services: DirectoryService[], search: string) {
  const words = search
    .trim()
    .toLocaleLowerCase("en-CA")
    .split(/\s+/)
    .filter(Boolean);
  return services.filter((service) => {
    const entry = getServiceEntry(service.slug);
    const text = [
      service.name,
      service.short_description,
      entry?.navDescription,
      service.category,
    ]
      .join(" ")
      .toLocaleLowerCase("en-CA");
    return words.every((word) => text.includes(word));
  });
}

/** Keep each published hub and its specialties together without removing URLs. */
export function orderDirectory(services: DirectoryService[]) {
  const available = new Map(services.map((service) => [service.slug, service]));
  const parent = (service: DirectoryService) => {
    const slug = getServiceEntry(service.slug)?.parentSlug;
    return slug ? available.get(slug) : undefined;
  };
  return [...services].sort((a, b) => {
    const aParent = parent(a),
      bParent = parent(b);
    const group = (aParent?.name || a.name).localeCompare(
      bParent?.name || b.name,
      "en-CA",
    );
    return (
      group ||
      Number(Boolean(aParent)) - Number(Boolean(bParent)) ||
      a.name.localeCompare(b.name, "en-CA")
    );
  });
}
