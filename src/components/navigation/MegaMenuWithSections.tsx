import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Section, MegaMenuConfig } from "@/data/navigation-structure-enhanced";
import { MegaMenuSection } from "./MegaMenuSection";
import { Button } from "@/ui/Button";
import { cn } from "@/lib/utils";

interface MegaMenuWithSectionsProps {
  sections: Section[];
  isOpen: boolean;
  onClose: () => void;
  config?: MegaMenuConfig;
}

export const MegaMenuWithSections = ({
  sections,
  isOpen,
  onClose,
  config,
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

  // Get width from config or default
  const menuWidth = config?.width || 800;

  return (
    <div
      ref={menuRef}
      className={cn(
        "mega-menu-sections",
        isOpen && "mega-menu-sections--open"
      )}
      style={{ width: `${menuWidth}px` }}
      aria-hidden={!isOpen}
    >
      <div className="mega-menu-sections-wrapper">
        {sections.map((section, index) => (
          <div key={index}>
            <MegaMenuSection
              section={section}
              expandedCategories={expandedCategories}
              onToggleCategory={handleToggleCategory}
              onLinkClick={onClose}
              columns={config?.columns || 3}
            />
            
            {/* Section CTA */}
            {section.cta && (
              <div className="mt-5 pt-4 border-t border-border/50 flex justify-end">
                <Button
                  asChild
                  variant={section.cta.variant === "outline" ? "outline" : "default"}
                  size="sm"
                  className="gap-2"
                >
                  <Link to={section.cta.link} onClick={onClose}>
                    {section.cta.text}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
