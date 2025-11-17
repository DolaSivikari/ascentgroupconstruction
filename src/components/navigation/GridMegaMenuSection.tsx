import { Section } from "@/data/navigation-structure-enhanced";
import { GridMegaMenuCard } from "./GridMegaMenuCard";

interface GridMegaMenuSectionProps {
  section: Section;
  onLinkClick: () => void;
}

export const GridMegaMenuSection = ({
  section,
  onLinkClick,
}: GridMegaMenuSectionProps) => {
  return (
    <div className="space-y-8">
      {section.categories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="space-y-4">
          {/* Category Header */}
          <div className="border-b border-border/50 pb-2">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">
              {category.title}
            </h3>
            {category.description && (
              <p className="text-xs text-muted-foreground mt-1">
                {category.description}
              </p>
            )}
          </div>

          {/* Grid of Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.subItems.map((item, itemIndex) => (
              <GridMegaMenuCard
                key={itemIndex}
                name={item.name}
                link={item.link}
                description={item.description}
                badge={item.badge}
                onLinkClick={onLinkClick}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
