import { cn } from '@/lib/utils';

interface Section {
  number: string;
  title: string;
}

interface NumberedNavigationProps {
  sections: Section[];
  activeSection: number;
  onSectionClick: (index: number) => void;
}

export const NumberedNavigation = ({
  sections,
  activeSection,
  onSectionClick
}: NumberedNavigationProps) => {
  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-background/90 backdrop-blur-sm rounded-full px-8 py-4 shadow-lg border border-border">
        <div className="flex items-center gap-6">
          {sections.map((section, index) => (
            <button
              key={section.number}
              onClick={() => onSectionClick(index)}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300 group",
                activeSection === index 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-primary"
              )}
              aria-label={`Go to section ${section.number}: ${section.title}`}
            >
              <span className="text-xs font-bold tracking-wider">
                {section.number}.
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap">
                {section.title}
              </span>
              <div 
                className={cn(
                  "h-0.5 w-full rounded-full transition-all duration-300",
                  activeSection === index 
                    ? "bg-primary scale-x-100" 
                    : "bg-transparent scale-x-0 group-hover:bg-primary/30 group-hover:scale-x-100"
                )}
              />
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Navigation - Vertical Dots */}
      <nav className="md:hidden fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {sections.map((section, index) => (
          <button
            key={section.number}
            onClick={() => onSectionClick(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              activeSection === index 
                ? "bg-primary scale-125" 
                : "bg-muted-foreground/30 hover:bg-primary/50"
            )}
            aria-label={`Go to section ${section.number}`}
          />
        ))}
      </nav>
    </>
  );
};
