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
  return (
    <div className="mega-menu-section">
      <div className="mega-menu-section-categories">
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
