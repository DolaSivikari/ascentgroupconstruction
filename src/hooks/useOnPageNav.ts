import { useEffect, useState } from "react";

export interface OnPageNavSection {
  id: string;
  label: string;
}

/**
 * useOnPageNav — Observes a list of section ids in the DOM and returns the id
 * of the section currently most-visible in the viewport. Drives StickyPageNav.
 */
export const useOnPageNav = (sections: OnPageNavSection[]): string | null => {
  const [activeId, setActiveId] = useState<string | null>(
    sections[0]?.id ?? null,
  );

  useEffect(() => {
    if (sections.length === 0 || typeof window === "undefined") return;

    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the most-visible entry that's currently intersecting
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      {
        // Top of viewport is offset for sticky headers
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  return activeId;
};

export default useOnPageNav;
