import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as LucideIcons from "lucide-react";
import { Building2, Home, Factory, Clock, ArrowRight, Star } from "lucide-react";

interface ServiceCardProps {
  id: string;
  name: string;
  slug: string;
  category: string;
  short_description: string | null;
  icon_name: string | null;
  featured?: boolean;
  typical_timeline?: string | null;
  project_types?: string[] | null;
}

const projectTypeIcons = {
  residential: Home,
  commercial: Building2,
  industrial: Factory,
};

export const ServiceCard = ({
  name,
  slug,
  category,
  short_description,
  icon_name,
  featured,
  typical_timeline,
  project_types,
}: ServiceCardProps) => {
  const IconComponent = icon_name && LucideIcons[icon_name as keyof typeof LucideIcons]
    ? (LucideIcons[icon_name as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>)
    : LucideIcons.Wrench;

  return (
    <Link to={`/services/${slug}`} className="group">
      <Card variant="interactive" className="h-full relative overflow-hidden">
        {featured && (
          <div className="absolute top-4 right-4 z-10">
            <Badge variant="warning" size="sm" icon={Star} className="animate-pulse">
              Popular
            </Badge>
          </div>
        )}
        
        <CardContent className="p-8 flex flex-col h-full">
          {/* Icon with Steel Blue Accent */}
          <div className="mb-6">
            <div className="w-14 h-14 rounded-lg bg-steel-blue/10 flex items-center justify-center group-hover:bg-steel-blue/20 hover-scale-icon">
              <IconComponent className="w-7 h-7 text-steel-blue" />
            </div>
          </div>

          {/* Service Name */}
          <h3 className="text-xl md:text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors leading-tight">
            {name}
          </h3>

          {/* Category Badge */}
          <div className="mb-4">
            <span className="text-xs font-semibold text-steel-blue uppercase tracking-wider">
              {category}
            </span>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-sm mb-6 line-clamp-3 flex-grow leading-relaxed">
            {short_description || "Professional construction service tailored to your project requirements"}
          </p>

          {/* Project Types & Timeline */}
          <div className="space-y-3 pt-6 border-t border-border">
            {project_types && project_types.length > 0 && (
              <div className="flex items-center gap-3 flex-wrap">
                {project_types.map((type) => {
                  const Icon = projectTypeIcons[type as keyof typeof projectTypeIcons];
                  return Icon ? (
                    <div
                      key={type}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground"
                      title={type.charAt(0).toUpperCase() + type.slice(1)}
                    >
                      <Icon className="w-4 h-4 text-steel-blue" />
                      <span className="capitalize font-medium">{type}</span>
                    </div>
                  ) : null;
                })}
              </div>
            )}

            {typical_timeline && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-4 h-4 text-steel-blue" />
                <span className="font-medium">{typical_timeline}</span>
              </div>
            )}
          </div>

          {/* Hover CTA with Steel Blue */}
          <div className="flex items-center gap-2 mt-6 text-steel-blue text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>Learn More</span>
            <ArrowRight className="w-4 h-4 hover-translate-arrow" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
