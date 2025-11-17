import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { AccordionCategory } from "@/data/navigation-structure-enhanced";
import { cn } from "@/lib/utils";
import { NavBadge } from "@/components/ui/nav-badge";

interface MegaMenuAccordionCategoryProps {
  category: AccordionCategory;
  isExpanded: boolean;
  onToggle: () => void;
  onLinkClick: () => void;
}

export const MegaMenuAccordionCategory = ({
  category,
  isExpanded,
  onToggle,
  onLinkClick,
}: MegaMenuAccordionCategoryProps) => {
  return (
    <div className="mega-menu-accordion-category">
      <button
        className={cn(
          "mega-menu-accordion-trigger",
          isExpanded && "mega-menu-accordion-trigger--expanded"
        )}
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-label={`${category.title} menu`}
      >
        <div>
          <span className="mega-menu-accordion-title">{category.title}</span>
          {category.description && (
            <p className="text-xs text-muted-foreground mt-0.5">{category.description}</p>
          )}
        </div>
        <ChevronDown
          className={cn(
            "mega-menu-accordion-icon",
            isExpanded && "mega-menu-accordion-icon--expanded"
          )}
        />
      </button>
      
      <div
        className={cn(
          "mega-menu-accordion-content",
          isExpanded && "mega-menu-accordion-content--expanded"
        )}
      >
        <ul className="mega-menu-accordion-list">
          {category.subItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.link}
                className="mega-menu-accordion-link inline-flex items-center"
                onClick={onLinkClick}
              >
                {item.name}
                {item.badge && <NavBadge variant={item.badge} />}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
