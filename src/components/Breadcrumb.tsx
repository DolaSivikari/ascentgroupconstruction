import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { breadcrumbSchema } from "@/utils/structured-data";
import SEO from "@/components/SEO";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  showHomeIcon?: boolean;
}

/**
 * Universal Breadcrumb component for site-wide navigation
 * Automatically includes structured data for SEO
 */
const Breadcrumb = ({ items, className, showHomeIcon = true }: BreadcrumbProps) => {
  // Generate schema from items that have hrefs
  const schemaItems = items
    .filter(item => item.href)
    .map(item => ({
      name: item.label,
      url: item.href!,
    }));

  const schema = breadcrumbSchema(schemaItems);

  return (
    <>
      <SEO structuredData={schema} />
      <nav 
        className={cn(
          "flex items-center gap-2 text-sm text-muted-foreground mb-6 animate-fade-in",
          className
        )} 
        aria-label="Breadcrumb"
      >
        <ol className="flex flex-wrap items-center gap-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              {item.href ? (
                <Link 
                  to={item.href} 
                  className="hover:text-primary transition-colors duration-200 flex items-center gap-1.5 min-h-[44px] min-w-[44px] -m-2 p-2"
                  aria-label={`Navigate to ${item.label}`}
                >
                  {index === 0 && showHomeIcon && <Home className="w-4 h-4" />}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span className="text-foreground font-medium flex items-center gap-1.5 min-h-[44px] p-2">
                  {index === 0 && showHomeIcon && <Home className="w-4 h-4" />}
                  <span>{item.label}</span>
                </span>
              )}
              {index < items.length - 1 && (
                <ChevronRight className="w-4 h-4 text-muted-foreground/50" aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumb;
