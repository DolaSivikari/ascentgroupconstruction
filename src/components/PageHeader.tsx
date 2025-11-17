import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Button } from "@/ui/Button";
import { cn } from "@/lib/utils";

import { ProgressiveImage } from "@/components/ui/ProgressiveImage";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface Stat {
  value: string;
  label: string;
}

interface CTA {
  label: string;
  href: string;
  variant?: "default" | "secondary" | "outline";
}

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  variant?: "standard" | "with-cta" | "with-stats" | "minimal";
  cta?: CTA;
  stats?: Stat[];
  backgroundImage?: string;
  className?: string;
}

const PageHeader = ({
  eyebrow,
  title,
  description,
  breadcrumbs,
  variant = "standard",
  cta,
  stats,
  backgroundImage,
  className
}: PageHeaderProps) => {
  const location = useLocation();

  // Auto-generate breadcrumbs if not provided
  const finalBreadcrumbs = breadcrumbs || [
    { label: "Home", href: "/" },
    { label: title }
  ];

  // Determine if we're using dark overlay mode (with background image)
  const isDarkMode = !!backgroundImage;
  
  return (
    <section className={cn(
      "relative pt-24 pb-16 flex items-center overflow-hidden",
      !backgroundImage && "bg-background",
      backgroundImage && "min-h-[400px]",
      className
    )}>
      {/* Background Image with Dark Overlay */}
      {backgroundImage && (
        <>
          <div className="absolute inset-0 z-0">
            <ProgressiveImage
              src={backgroundImage}
              alt=""
              className="w-full h-full object-cover"
              style={{ backgroundAttachment: 'fixed' }}
            />
          </div>
          <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/80 via-black/70 to-black/60" />
        </>
      )}

      <div className={cn("container mx-auto px-6 sm:px-4", backgroundImage && "relative z-10")}>
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          <nav aria-label="breadcrumb" className="mb-6">
            <ol className={cn(
              "flex flex-wrap items-center gap-2 text-sm",
              isDarkMode ? "text-white/80" : "text-muted-foreground"
            )}>
              {finalBreadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center gap-2">
                  {crumb.href ? (
                    <Link 
                      to={crumb.href} 
                      className={cn(
                        "transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center -m-2 p-2",
                        isDarkMode ? "hover:text-white" : "hover:text-foreground"
                      )}
                      aria-label={`Navigate to ${crumb.label}`}
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={cn(
                      "font-medium min-h-[44px] flex items-center",
                      isDarkMode ? "text-white" : "text-foreground"
                    )}>{crumb.label}</span>
                  )}
                  {index < finalBreadcrumbs.length - 1 && (
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  )}
                </li>
              ))}
            </ol>
          </nav>

          {/* Header Content */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              {/* Eyebrow */}
              {eyebrow && (
                <div className={cn(
                  "text-sm uppercase tracking-wider mb-2 font-semibold",
                  isDarkMode ? "text-white/80" : "text-muted-foreground"
                )}>
                  {eyebrow}
                </div>
              )}

              {/* Title */}
              <h1 className={cn(
                "text-4xl md:text-5xl font-bold mb-4 leading-tight",
                isDarkMode && "text-white"
              )}>
                {title}
              </h1>

              {/* Accent Line */}
              <div className="w-16 h-1 bg-primary mb-6" aria-hidden="true" />

              {/* Description */}
              {description && (
                <p className={cn(
                  "text-lg max-w-2xl",
                  isDarkMode ? "text-white/90" : "text-muted-foreground"
                )}>
                  {description}
                </p>
              )}

              {/* Stats (inline with description on with-stats variant) */}
              {variant === "with-stats" && stats && (
                <div className={cn(
                  "flex flex-wrap gap-8 mt-8 p-6 rounded-lg border",
                  isDarkMode 
                    ? "bg-white/10 backdrop-blur-md border-white/20" 
                    : "bg-background/80 border-border"
                )}>
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-primary">
                        {stat.value}
                      </div>
                      <div className={cn(
                        "text-sm mt-1",
                        isDarkMode ? "text-white/70" : "text-muted-foreground"
                      )}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CTA Button (right-aligned on with-cta variant) */}
            {variant === "with-cta" && cta && (
              <div className="md:pt-12">
                <Button 
                  size="lg" 
                  variant={cta.variant || "default"} 
                  asChild
                  className="w-full md:w-auto"
                >
                  <Link to={cta.href}>
                    {cta.label}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageHeader;
