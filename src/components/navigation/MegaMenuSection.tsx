import { Link } from "react-router-dom";
import { Section } from "@/data/navigation-structure-enhanced";
import { MegaMenuAccordionCategory } from "./MegaMenuAccordionCategory";

interface MegaMenuSectionProps {
  section: Section;
  expandedCategories: string[];
  onToggleCategory: (categoryTitle: string) => void;
  onLinkClick: () => void;
}

export const MegaMenuSection = ({
  section,
  expandedCategories,
  onToggleCategory,
  onLinkClick,
}: MegaMenuSectionProps) => {
  // Determine grid columns based on number of categories
  const columnCount = section.categories.length;
  const gridClass = columnCount === 4 
    ? "grid grid-cols-4 gap-4" 
    : columnCount === 3 
    ? "grid grid-cols-3 gap-4" 
    : "grid grid-cols-2 gap-4";

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

      <div className={gridClass}>
        {section.categories.map((category, index) => (
          <MegaMenuAccordionCategory
            key={index}
            category={category}
            isExpanded={expandedCategories.includes(category.title)}
            onToggle={() => onToggleCategory(category.title)}
            onLinkClick={onLinkClick}
          />
        ))}
      </div>
    </div>
  );
};
