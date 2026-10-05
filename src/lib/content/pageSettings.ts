import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import {
  defineContent,
  pageId,
  PROTECTED_PAGES,
  PROTECTED_CONTENT_PAGES,
} from "@/content/types";
import { useResolvedContent } from "./store";
export type PageSettings = {
  seo: { title: string; description: string; image: string; noindex: boolean };
  hero: { url: string; alt: string };
  hidden: boolean;
};
export function pageSettingsModule(path: string) {
  return defineContent(
    pageId(path),
    {
      seo: { title: "", description: "", image: "", noindex: false },
      hero: { url: "", alt: "" },
      hidden: false,
    },
    {
      seo: {
        label: "Search and sharing",
        section: "SEO",
        kind: "seo",
        help: "An empty field uses the current page metadata.",
      },
      hero: {
        label: "Header image",
        section: "Header",
        kind: "image",
        locked:
          path === "/" ||
          path === "/projects" ||
          path.startsWith("/projects/") ||
          PROTECTED_CONTENT_PAGES.has(path),
        help: "Protected carousels and code-owned presentations use their existing editor.",
      },
      hidden: {
        label: "Hide page",
        section: "Visibility",
        kind: "flag",
        locked: PROTECTED_PAGES.has(path),
        help: "Hidden pages show an unavailable screen and noindex. Navigation and sitemap changes require separate publication.",
      },
    },
  );
}
export function usePageSettings() {
  const { pathname } = useLocation();
  const module = useMemo(() => pageSettingsModule(pathname), [pathname]);
  const values = useResolvedContent<PageSettings>(module);
  return PROTECTED_PAGES.has(pathname)
    ? { ...values, hidden: false, seo: { ...values.seo, noindex: false } }
    : values;
}
