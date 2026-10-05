import * as faqDefaults from "./faq-defaults";
import { WAVE1_PAGES } from "./wave1-defaults";
import { structuredContent } from "../structured";
export const faqModules = Object.fromEntries(
  Object.entries(faqDefaults).map(([name, items]) => [
    name,
    structuredContent(
      `shared-${name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}`,
      items,
    ),
  ]),
);
export const waveModules = Object.fromEntries(
  Object.entries(WAVE1_PAGES).map(([slug, page]) => [
    slug,
    structuredContent(`services-${slug}`, page),
  ]),
);
export { faqDefaults };
