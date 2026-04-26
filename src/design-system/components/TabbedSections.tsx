import { ReactNode, useState } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TabbedSection {
  /** Stable id used for URL hash and aria controls */
  id: string;
  label: string;
  icon?: LucideIcon;
  content: ReactNode;
}

export interface TabbedSectionsProps {
  sections: TabbedSection[];
  /** Initial section id (defaults to first) */
  defaultId?: string;
  /** Make the tab strip stick to top while scrolling */
  sticky?: boolean;
  /** Apply container padding to tab content */
  padContent?: boolean;
  className?: string;
}

/**
 * TabbedSections — Page-level tabbed reorganizer. Used to break long pages
 * (Capabilities, About, FAQ, ContractorPortal, ServiceDetail) into navigable
 * sections without losing any content.
 */
export const TabbedSections = ({
  sections,
  defaultId,
  sticky = true,
  padContent = false,
  className,
}: TabbedSectionsProps) => {
  const [activeId, setActiveId] = useState<string>(defaultId ?? sections[0]?.id);

  if (sections.length === 0) return null;
  const active = sections.find((s) => s.id === activeId) ?? sections[0];

  return (
    <div className={cn("w-full", className)}>
      {/* Tab strip */}
      <div
        className={cn(
          "border-b border-border bg-background/95 backdrop-blur-sm",
          sticky && "sticky top-16 md:top-20 z-30",
        )}
        role="tablist"
        aria-label="Section tabs"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide -mx-1 px-1">
            {sections.map((s) => {
              const isActive = s.id === active.id;
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`tabpanel-${s.id}`}
                  id={`tab-${s.id}`}
                  onClick={() => setActiveId(s.id)}
                  className={cn(
                    "relative inline-flex items-center gap-2 whitespace-nowrap px-4 py-4 text-sm font-medium transition-colors",
                    "border-b-2 -mb-px",
                    isActive
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
                  )}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active panel */}
      <div
        role="tabpanel"
        id={`tabpanel-${active.id}`}
        aria-labelledby={`tab-${active.id}`}
        className={cn(padContent && "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8")}
      >
        {active.content}
      </div>
    </div>
  );
};

export default TabbedSections;
