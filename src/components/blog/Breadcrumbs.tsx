import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { breadcrumbSchema } from "@/utils/structured-data";
import SEO from "@/components/SEO";

interface BreadcrumbsProps {
  items: Array<{
    label: string;
    href?: string;
  }>;
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
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
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
        {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.href ? (
            <Link to={item.href} className="hover:text-primary transition-colors">
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}
          {index < items.length - 1 && <ChevronRight className="w-4 h-4" />}
        </div>
      ))}
      </nav>
    </>
  );
};

export default Breadcrumbs;
