import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface ContentPageHeaderProps {
  title: string;
  subtitle?: string;
  imageUrl: string;
  breadcrumbs?: Breadcrumb[];
  className?: string;
}

const ContentPageHeader = ({
  title,
  subtitle,
  imageUrl,
  breadcrumbs,
  className
}: ContentPageHeaderProps) => {
  // Auto-generate breadcrumbs if not provided
  const finalBreadcrumbs = breadcrumbs || [
    { label: "Home", href: "/" },
    { label: title }
  ];

  return (
    <section className={cn("relative h-[40vh] sm:h-[50vh] md:h-[60vh] min-h-[350px] sm:min-h-[400px] md:min-h-[500px] pt-24", className)}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover object-[center_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--ink))]/80 via-[hsl(var(--ink))]/65 to-[hsl(var(--ink))]/80 sm:from-[hsl(var(--ink))]/70 sm:via-[hsl(var(--ink))]/50 sm:to-[hsl(var(--ink))]/70" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center container mx-auto px-6 sm:px-6">
        <div className="max-w-4xl">
          {/* Breadcrumbs */}
          <nav aria-label="breadcrumb" className="mb-4 sm:mb-6">
            <ol className="flex flex-wrap items-center gap-2 sm:gap-2 text-sm sm:text-sm text-[hsl(var(--bg))]/80">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center gap-2">
                  {index > 0 && <ChevronRight className="w-4 h-4" />}
                  {crumb.href ? (
                    <Link
                      to={crumb.href}
                      className="hover:text-[hsl(var(--bg))] transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-[hsl(var(--bg))] font-medium">{crumb.label}</span>
                  )}
                  {index < finalBreadcrumbs.length - 1 && (
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  )}
                </li>
              ))}
            </ol>
          </nav>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[hsl(var(--bg))] mb-3 sm:mb-4 break-words leading-tight">
            {title}
          </h1>
          
          {subtitle && (
            <p className="text-base sm:text-lg md:text-xl text-[hsl(var(--bg))]/90 max-w-2xl break-words">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContentPageHeader;
