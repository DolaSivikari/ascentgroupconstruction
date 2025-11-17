import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/ui/Button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Clock, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ServiceQuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    title: string;
    description: string;
    category?: string;
    estimatedTimeline?: string;
    priceRange?: string;
    features?: string[];
    slug?: string;
  } | null;
}

export const ServiceQuickViewModal = ({ isOpen, onClose, service }: ServiceQuickViewModalProps) => {
  if (!service) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between mb-4">
            <DialogTitle className="text-2xl font-bold text-foreground">
              {service.title}
            </DialogTitle>
            {service.category && (
              <Badge variant="secondary" className="ml-2">
                {service.category}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          <div>
            <p className="text-muted-foreground leading-relaxed">
              {service.description}
            </p>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            {service.estimatedTimeline && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-border/50">
                <div className="p-2 rounded-md bg-construction-orange/10">
                  <Clock className="w-4 h-4 text-construction-orange" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">Timeline</div>
                  <div className="text-sm text-muted-foreground">{service.estimatedTimeline}</div>
                </div>
              </div>
            )}

            {service.priceRange && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-border/50">
                <div className="p-2 rounded-md bg-construction-orange/10">
                  <DollarSign className="w-4 h-4 text-construction-orange" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">Price Range</div>
                  <div className="text-sm text-muted-foreground">{service.priceRange}</div>
                </div>
              </div>
            )}
          </div>

          {/* Features */}
          {service.features && service.features.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-3">What's Included</h4>
              <div className="space-y-2">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-construction-orange mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
            <Button asChild className="flex-1" size="lg">
              <Link to="/estimate">
                Get Free Quote
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>

            {service.slug && (
              <Button asChild variant="outline" className="flex-1" size="lg">
                <Link to={`/services/${service.slug}`}>
                  View Full Details
                </Link>
              </Button>
            )}
          </div>

          {/* Trust Indicator */}
          <div className="text-center pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Free consultation</span> • 
              <span className="font-semibold text-foreground"> 24-hour response</span> • 
              <span className="font-semibold text-foreground"> No obligation</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
