import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { ArrowRight } from "lucide-react";

interface Service {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  category: string | null;
  icon_name: string | null;
  featured?: boolean;
  typical_timeline?: string | null;
  project_types?: string[] | null;
  service_tier?: string | null;
  challenge_tags?: string[] | null;
}

interface TieredServicesGridProps {
  services: Service[];
}

export const TieredServicesGrid = ({ services }: TieredServicesGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => {
        const IconComponent = service.icon_name
          ? (LucideIcons[service.icon_name as keyof typeof LucideIcons] as any)
          : null;

        return (
          <Card key={service.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              {/* Icon */}
              {IconComponent && (
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                </div>
              )}

              {/* Service Name */}
              <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {service.name}
              </h3>

              {/* Description */}
              {service.short_description && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {service.short_description}
                </p>
              )}

              {/* Timeline Badge */}
              {service.typical_timeline && (
                <div className="mb-4">
                  <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                    {service.typical_timeline}
                  </span>
                </div>
              )}

              {/* CTA */}
              <Button asChild variant="ghost" size="sm" className="p-0 h-auto">
                <Link to={`/services/${service.slug}`} className="inline-flex items-center gap-1 text-sm">
                  Learn more
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
