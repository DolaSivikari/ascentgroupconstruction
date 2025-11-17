import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ChevronDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface Service {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  service_tier: 'primary_delivery' | 'self_perform' | null;
}

interface DynamicServicesMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DynamicServicesMegaMenu = ({ isOpen, onClose }: DynamicServicesMegaMenuProps) => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase
        .from('services')
        .select('id, slug, name, short_description, service_tier')
        .eq('publish_state', 'published')
        .order('name');
      
      if (data) {
        setServices(data as Service[]);
      }
    };

    if (isOpen) {
      fetchServices();
    }
  }, [isOpen]);

  const primaryDelivery = services.filter(s => s.service_tier === 'primary_delivery');
  const selfPerform = services.filter(s => s.service_tier === 'self_perform');

  

  return (
    <div 
      className={cn(
        "absolute left-0 top-full mt-0 w-[760px] bg-background border border-border rounded-[var(--radius-sm)] [box-shadow:var(--shadow-dropdown)] z-mega-menu",
        "mega-menu-transition origin-top",
        isOpen ? "opacity-100 visible scale-y-100" : "opacity-0 invisible scale-y-95"
      )}
      onMouseEnter={() => {}}
      onMouseLeave={onClose}
    >
      <div className="grid grid-cols-[1fr_1fr_240px] gap-6 p-6">
        {/* Primary Delivery Column */}
        <div>
          <div className="text-xs font-bold text-primary mb-3 uppercase tracking-wider">
            Primary Delivery
          </div>
          <div className="space-y-1">
            {primaryDelivery.map((service) => (
              <Link
                key={service.id}
                to={`/services/${service.slug}`}
                onClick={onClose}
                className="block px-3 py-2.5 text-sm text-foreground hover:text-primary hover:bg-muted/30 menu-item-hover rounded-[var(--radius-xs)] border-l-2 border-transparent hover:border-l-primary hover:pl-4"
              >
                <div className="font-semibold">{service.name}</div>
                {service.short_description && (
                  <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {service.short_description}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Self-Perform Trades Column */}
        <div>
          <div className="text-xs font-bold text-primary mb-3 uppercase tracking-wider">
            Self-Perform Trades
          </div>
          <div className="space-y-1 max-h-[380px] overflow-y-auto">
            {selfPerform.map((service) => (
              <Link
                key={service.id}
                to={`/services/${service.slug}`}
                onClick={onClose}
                className="block px-3 py-2.5 text-sm text-foreground hover:text-primary hover:bg-muted/30 menu-item-hover rounded-[var(--radius-xs)] border-l-2 border-transparent hover:border-l-primary hover:pl-4"
              >
                <div className="font-semibold">{service.name}</div>
                {service.short_description && (
                  <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {service.short_description}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Feature Card */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-4 space-y-3">
            <div className="text-xs font-bold text-primary uppercase tracking-wider">
              Why Ascent
            </div>
            <div className="text-sm font-semibold text-foreground leading-tight">
              GC + Self-Perform = Schedule Certainty
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              By delivering both general contracting and self-perform trades, we control quality, timelines, and costs.
            </p>
            <Link
              to="/about"
              onClick={onClose}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:gap-2 link-hover"
            >
              Learn More
              <ArrowRight className="w-3 h-3" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border bg-muted/20 px-6 py-3 rounded-b-[var(--radius-sm)]">
        <Link
          to="/services"
          onClick={onClose}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 link-hover"
        >
          View All Services
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
