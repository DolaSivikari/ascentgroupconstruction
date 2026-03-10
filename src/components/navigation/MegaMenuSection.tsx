import { Link } from "react-router-dom";
import { Section, SubItem } from "@/data/navigation-structure-enhanced";

import { getIcon } from "@/utils/getIcon";
import { cn } from "@/lib/utils";

interface MegaMenuSectionProps {
  section: Section;
  onLinkClick: () => void;
  columns?: number;
}

export const MegaMenuSection = ({
  section,
  onLinkClick,
  columns = 3,
}: MegaMenuSectionProps) => {
  const gridClass = 
    columns === 4 ? "grid-cols-4" :
    columns === 3 ? "grid-cols-3" :
    "grid-cols-2";

  return (
    <div className="mega-menu-section">
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
            <h4 className="mega-menu-column-header">{category.title}</h4>
            
            <ul className="space-y-1">
              {category.subItems.map((item: SubItem, itemIndex) => {
                const IconComponent = getIcon(item.icon);
                
                return (
                  <li key={itemIndex}>
                    <Link
                      to={item.link}
                      onClick={onLinkClick}
                      className={cn(
                        "group flex items-center gap-2 px-2 py-1.5 rounded-md transition-all duration-200",
                        "text-foreground hover:text-primary hover:bg-muted/50",
                        item.isFeatured && "bg-accent/10 border border-accent/20 hover:bg-accent/20"
                      )}
                    >
                      {IconComponent && (
                        <IconComponent 
                          className={cn(
                            "w-4 h-4 flex-shrink-0 transition-colors",
                            item.isFeatured ? "text-accent" : "text-muted-foreground group-hover:text-primary"
                          )} 
                        />
                      )}
                      <span className={cn(
                        "text-sm font-medium",
                        item.isFeatured && "text-accent"
                      )}>
                        {item.name}
                      </span>
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
