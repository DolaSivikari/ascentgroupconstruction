import { cn } from "@/lib/utils";
import { useOnPageNav, type OnPageNavSection } from "@/hooks/useOnPageNav";

export interface StickyPageNavProps {
  sections: OnPageNavSection[];
  /** Layout placement on desktop */
  placement?: "right" | "top";
  className?: string;
}

const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 96;
  window.scrollTo({ top, behavior: "smooth" });
  // Update hash without jump
  if (history.replaceState) history.replaceState(null, "", `#${id}`);
};

/**
 * StickyPageNav — In-page anchor nav for long pages. Renders as a right rail
 * on lg+ and a sticky top strip on small screens.
 */
export const StickyPageNav = ({
  sections,
  placement = "right",
  className,
}: StickyPageNavProps) => {
  const activeId = useOnPageNav(sections);
  if (sections.length === 0) return null;

  // Top strip (mobile and tablet, or when explicit)
  const topStrip = (
    <div
      className={cn(
        "lg:hidden sticky top-16 z-20 -mx-4 px-4 sm:-mx-6 sm:px-6 bg-background/95 backdrop-blur-sm border-b border-border",
      )}
    >
      <nav aria-label="On this page" className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
        {sections.map((s) => {
          const isActive = activeId === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollToId(s.id)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              {s.label}
            </button>
          );
        })}
      </nav>
    </div>
  );

  // Right rail (desktop only)
  const rightRail = placement === "right" && (
    <nav
      aria-label="On this page"
      className="hidden lg:block fixed right-6 top-1/2 -translate-y-1/2 z-20 max-w-[14rem]"
    >
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-3">
        On this page
      </p>
      <ul className="space-y-1.5 border-l border-border pl-3">
        {sections.map((s) => {
          const isActive = activeId === s.id;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => scrollToId(s.id)}
                className={cn(
                  "text-left text-sm transition-colors w-full",
                  isActive
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "inline-block w-1.5 h-1.5 rounded-full mr-2 transition-colors",
                    isActive ? "bg-primary" : "bg-border",
                  )}
                />
                {s.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <div className={className}>
      {topStrip}
      {rightRail}
    </div>
  );
};

export default StickyPageNav;
