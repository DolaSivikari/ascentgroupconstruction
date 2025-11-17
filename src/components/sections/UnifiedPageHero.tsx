import { Link } from "react-router-dom";
import { Button } from "@/ui/Button";
import { Section } from "./Section";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface UnifiedPageHeroProps {
  title: string;
  description: string;
  primaryCTA?: { text: string; href: string };
  secondaryCTA?: { text: string; href: string };
  breadcrumbs?: BreadcrumbItem[];
}

/**
 * Unified Page Hero Component
 * Standardized page header structure across all pages
 */
export const UnifiedPageHero = ({ 
  title, 
  description, 
  primaryCTA, 
  secondaryCTA,
  breadcrumbs 
}: UnifiedPageHeroProps) => {
  return (
    <Section size="major" className="border-b border-border">
      <div className="max-w-4xl mx-auto text-center">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              {breadcrumbs.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  {item.href ? (
                    <Link 
                      to={item.href} 
                      className="hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-foreground">{item.label}</span>
                  )}
                  {index < breadcrumbs.length - 1 && (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          {title}
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          {description}
        </p>
        
        {(primaryCTA || secondaryCTA) && (
          <div className="flex flex-wrap gap-4 justify-center">
            {primaryCTA && (
              <Button asChild size="lg" variant="primary">
                <Link to={primaryCTA.href}>{primaryCTA.text}</Link>
              </Button>
            )}
            {secondaryCTA && (
              <Button asChild size="lg" variant="outline">
                <Link to={secondaryCTA.href}>{secondaryCTA.text}</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </Section>
  );
};
