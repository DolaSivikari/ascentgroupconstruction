import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Section } from "./Section";

export interface RelatedLink {
  eyebrow?: string;
  title: string;
  description?: string;
  to: string;
}

interface RelatedLinksProps {
  heading?: string;
  links: RelatedLink[];
  tone?: "white" | "muted";
  className?: string;
}

/**
 * Three-card cross-link rail rendered near the bottom of every secondary page.
 * Keeps users moving between Services → Projects → Start a Project surfaces
 * so no page dead-ends.
 */
export const RelatedLinks = ({
  heading = "Continue exploring",
  links,
  tone = "muted",
  className,
}: RelatedLinksProps) => {
  if (!links?.length) return null;
  return (
    <Section tone={tone} padding="md" className={className}>
      <div className="mb-8 md:mb-10">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
          {heading}
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {links.slice(0, 3).map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={cn(
              "group flex flex-col justify-between rounded-lg border border-border bg-background p-6",
              "transition-all hover:border-primary/40 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            )}
          >
            <div>
              {link.eyebrow && (
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {link.eyebrow}
                </div>
              )}
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {link.title}
              </h3>
              {link.description && (
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {link.description}
                </p>
              )}
            </div>
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">
              Learn more
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
};

export default RelatedLinks;
