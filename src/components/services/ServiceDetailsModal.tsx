import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { ArrowRight, Building } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ServiceCategory } from "./categoryMapping";
import { getChallengeColor } from "./challengeMapping";

interface Service {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  icon_name: string | null;
  challenge_tags?: string[] | null;
}

interface ServiceDetailsModalProps {
  open: boolean;
  onClose: () => void;
  category: ServiceCategory | null;
  services: Service[];
}

const categoryColorMap: Record<string, {
  iconBg: string;
  iconColor: string;
}> = {
  primary: {
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  terracotta: {
    iconBg: "bg-terracotta/10",
    iconColor: "text-terracotta",
  },
  sage: {
    iconBg: "bg-sage/10",
    iconColor: "text-sage",
  }
};

export const ServiceDetailsModal = ({
  open,
  onClose,
  category,
  services,
}: ServiceDetailsModalProps) => {
  if (!category) return null;

  const colors = categoryColorMap[category.color] || categoryColorMap.primary;
  const CategoryIcon = category.icon;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-2">
            <div className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center",
              colors.iconBg
            )}>
              <CategoryIcon className={cn("w-6 h-6", colors.iconColor)} />
            </div>
            <DialogTitle className="text-2xl md:text-3xl">
              {category.name}
            </DialogTitle>
          </div>
          <DialogDescription className="text-base">
            {category.description}
          </DialogDescription>
        </DialogHeader>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {services.map((service, index) => (
            <Link
              key={service.id}
              to={`/services/${service.slug}`}
              onClick={onClose}
              className="group block animate-fade-in"
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              <div className={cn(
                "h-full p-5 rounded-xl border-2 transition-all duration-300",
                "bg-card border-border",
                "hover:border-primary/30 hover:shadow-lg hover:-translate-y-1"
              )}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    {/* Service Name */}
                    <h4 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {service.name}
                    </h4>
                    
                    {/* Service Description */}
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {service.short_description}
                    </p>

                    {/* Challenge Tags */}
                    {service.challenge_tags && service.challenge_tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {service.challenge_tags.slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 rounded text-xs font-medium"
                            style={{
                              backgroundColor: `${getChallengeColor(tag)}20`,
                              color: getChallengeColor(tag),
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Learn More Link */}
                    <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                      Learn More
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {services.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Building className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No services found in this category.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
