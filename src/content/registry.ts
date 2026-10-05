import { aboutDetailsModule } from "./aboutDetails";
import { cityContentModule } from "./cityModule";
import { CITY_DESCRIPTION_FIELDS } from "./shared/city-fields";
import { faqModules, waveModules } from "./shared/modules";
import type { ContentModule } from "./types";
import { pageId } from "./types";
const loaders = import.meta.glob<{ default: ContentModule }>("./pages/*.ts");
export async function loadContentModules() {
  const loaded = await Promise.all(
    Object.values(loaders).map((load) => load()),
  );
  return new Map([
    ["about-details", aboutDetailsModule()] as const,
    ...loaded
      .filter((item) => item.default.id !== "city-page")
      .map((item) => [item.default.id, item.default] as const),
    ...Object.keys(CITY_DESCRIPTION_FIELDS).map((city) => {
      const m = cityContentModule(city);
      return [m.id, m] as const;
    }),
    ...Object.values(faqModules).map((m) => [m.id, m] as const),
    ...Object.values(waveModules).map((m) => [m.id, m] as const),
  ]);
}
export function moduleForPath(
  modules: Map<string, ContentModule>,
  path: string,
) {
  return (
    modules.get(pageId(path)) ||
    (path.startsWith("/service-areas/") ? modules.get("city-page") : undefined)
  );
}
const faqByPath: Record<string, string> = {
  "/about": "aboutFaqs",
  "/contact": "contactFaqs",
  "/services": "servicesFaqs",
  "/markets": "marketsFaqs",
  "/projects": "projectsFaqs",
  "/careers": "careersFaqs",
  "/our-process": "ourProcessFaqs",
  "/property-managers": "propertyManagersFaqs",
  "/commercial-clients": "commercialClientsFaqs",
  "/homeowners": "homeownersFaqs",
  "/for-general-contractors": "generalContractorsFaqs",
  "/for-architects": "architectsFaqs",
  "/emergency-repair": "emergencyRepairFaqs",
  "/company/developers": "developersFaqs",
  "/resources/service-areas": "serviceAreasFaqs",
};
export function relatedModulesForPath(
  modules: Map<string, ContentModule>,
  path: string,
) {
  const primary = moduleForPath(modules, path);
  const faq =
    faqByPath[path] ||
    (path.startsWith("/projects/")
      ? "projectDetailFaqs"
      : path.startsWith("/blog/")
        ? "blogPostFaqs"
        : path.startsWith("/services/") && !primary
          ? "serviceDetailFaqs"
          : undefined);
  const shared = faq ? faqModules[faq] : undefined;
  return [
    ...(primary ? [primary] : []),
    ...(path === "/about" && modules.has("about-details")
      ? [modules.get("about-details")!]
      : []),
    ...(shared ? [shared] : []),
    ...(path === "/"
      ? [...modules.values()].filter((m) => m.id.startsWith("home-"))
      : []),
  ];
}
