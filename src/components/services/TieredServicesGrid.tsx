import { Card, CardContent } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getIconForService } from "@/utils/serviceIcons";

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
        const IconComponent = getIconForService(service.name) || ArrowRight;

        return (
          <Card 
            key={service.id} 
            className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/20 bg-card/80 backdrop-blur-sm"
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <CardContent className="relative p-6">
              {/* Icon with enhanced styling */}
              <div className="mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <IconComponent className="w-7 h-7 text-primary" />
                </div>
              </div>

              {/* Service Name */}
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">
                {service.name}
              </h3>

              {/* Description */}
              {service.short_description && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                  {service.short_description}
                </p>
              )}

              {/* Timeline Badge */}
              {service.typical_timeline && (
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-secondary/20 text-foreground/80 font-medium border border-border/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {service.typical_timeline}
                  </span>
                </div>
              )}

              {/* CTA with enhanced styling */}
              <Link 
                to={`/services/${service.slug}`} 
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors group/link mt-2"
              >
                Learn more
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
