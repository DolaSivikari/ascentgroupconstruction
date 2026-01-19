import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { Section, SubItem } from "@/data/navigation-structure-enhanced";
import { NavBadge } from "@/components/ui/nav-badge";
import { cn } from "@/lib/utils";

interface MegaMenuSectionProps {
  section: Section;
  expandedCategories: string[];
  onToggleCategory: (categoryTitle: string) => void;
  onLinkClick: () => void;
  columns?: number;
}

// Get icon component from name
const getIcon = (iconName?: string) => {
  if (!iconName) return null;
  const Icon = (LucideIcons as any)[iconName];
  return Icon || null;
};

export const MegaMenuSection = ({
  section,
  expandedCategories,
  onToggleCategory,
  onLinkClick,
  columns = 3,
}: MegaMenuSectionProps) => {
  // Determine grid columns class
  const gridClass = 
    columns === 4 ? "grid-cols-4" :
    columns === 3 ? "grid-cols-3" :
    "grid-cols-2";

  return (
    <div className="mega-menu-section">
      {/* Section header with optional link */}
      {section.sectionLink ? (
        <Link
          to={section.sectionLink}
          onClick={onLinkClick}
          className="mega-menu-section-header-link"
        >
          {section.sectionTitle}
        </Link>
      ) : (
        <h3 className="mega-menu-section-header">{section.sectionTitle}</h3>
      )}

      <div className={cn("grid gap-6", gridClass)}>
        {section.categories.map((category, catIndex) => (
          <div key={catIndex} className="space-y-2">
            {/* Column header */}
            <h4 className="mega-menu-column-header">{category.title}</h4>
            
            {/* Items list */}
            <ul className="space-y-1">
              {category.subItems.map((item: SubItem, itemIndex) => {
                const IconComponent = getIcon(item.icon);
                
                return (
                  <li key={itemIndex}>
                    <Link
                      to={item.link}
                      onClick={onLinkClick}
                      className={cn(
                        "group flex items-start gap-2.5 px-2 py-2 rounded-md transition-all duration-200",
                        "text-foreground hover:text-primary hover:bg-muted/50",
                        item.isFeatured && "bg-accent/10 border border-accent/20 hover:bg-accent/20"
                      )}
                    >
                      {IconComponent && (
                        <IconComponent 
                          className={cn(
                            "w-4 h-4 mt-0.5 flex-shrink-0 transition-colors",
                            item.isFeatured ? "text-accent" : "text-muted-foreground group-hover:text-primary"
                          )} 
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <span className={cn(
                          "text-sm font-medium block",
                          item.isFeatured && "text-accent"
                        )}>
                          {item.name}
                          {item.badge && (
                            <NavBadge variant={item.badge} className="ml-2" />
                          )}
                        </span>
                        {item.description && (
                          <span className="text-xs text-muted-foreground block mt-0.5">
                            {item.description}
                          </span>
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
