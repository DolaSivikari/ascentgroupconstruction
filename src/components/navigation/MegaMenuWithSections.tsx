import { useRef, useEffect, useState } from "react";
import { Section } from "@/data/navigation-structure-enhanced";
import { MegaMenuSection } from "./MegaMenuSection";
import { cn } from "@/lib/utils";

interface MegaMenuWithSectionsProps {
  sections: Section[];
  isOpen: boolean;
  onClose: () => void;
}

export const MegaMenuWithSections = ({
  sections,
  isOpen,
  onClose,
}: MegaMenuWithSectionsProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const handleToggleCategory = (categoryTitle: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryTitle)
        ? prev.filter(title => title !== categoryTitle)
        : [...prev, categoryTitle]
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!sections || sections.length === 0) return null;

  return (
    <div
      ref={menuRef}
      className={cn("mega-menu-sections", isOpen && "mega-menu-sections--open")}
      aria-hidden={!isOpen}
    >
      <div className="mega-menu-sections-wrapper p-8 max-w-7xl mx-auto">
        {sections.map((section, index) => (
          <MegaMenuSection
            key={index}
            section={section}
            expandedCategories={expandedCategories}
            onToggleCategory={handleToggleCategory}
            onLinkClick={onClose}
          />
        ))}
      </div>
    </div>
  );
};
