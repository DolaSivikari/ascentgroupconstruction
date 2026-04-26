import { Link } from "react-router-dom";
import { ArrowRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Section } from "@/components/sections/Section";
import { SectionHeader } from "@/design-system/components/SectionHeader";

export interface RelatedLink {
  title: string;
  description: string;
  href: string;
  icon?: LucideIcon;
  /** External link target — defaults to internal Link */
  external?: boolean;
}

export interface RelatedLinksGridProps {
  title?: string;
  description?: string;
  links: RelatedLink[];
  /** Background variant for the wrapping section */
  background?: "default" | "muted";
  className?: string;
}

/**
 * RelatedLinksGrid — Standardized 3-up "you may also be interested in" grid
 * placed before the final CTA / Footer on every page.
 */
export const RelatedLinksGrid = ({
  title = "Related Resources",
  description,
  links,
  background = "muted",
  className,
}: RelatedLinksGridProps) => {
  if (links.length === 0) return null;

  return (
    <Section
      size="subsection"
      className={cn(
        background === "muted" && "bg-muted/30 border-t border-border/50",
        className,
      )}
    >
      {(title || description) && (
        <SectionHeader title={title} description={description} maxWidth="md" />
      )}
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {links.map(({ title, description, href, icon: Icon, external }, i) => {
          const inner = (
            <div className="h-full p-6 bg-background rounded-lg border border-border hover:border-primary/40 hover:shadow-md transition-all group">
              {Icon && (
                <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
              )}
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {description}
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                Learn more <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          );
          return external ? (
            <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="block">
              {inner}
            </a>
          ) : (
            <Link key={i} to={href} className="block">
              {inner}
            </Link>
          );
        })}
      </div>
    </Section>
  );
};

export default RelatedLinksGrid;
