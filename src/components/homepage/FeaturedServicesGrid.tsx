import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getIconForService } from "@/utils/serviceIcons";
import { Button } from "@/ui/Button";

interface Service {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  icon_name: string | null;
}

export const FeaturedServicesGrid = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("services")
        .select("id, name, slug, short_description, icon_name")
        .eq("publish_state", "published")
        .eq("featured", true)
        .order("name")
        .limit(6);
      setServices(data || []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-52 bg-muted/30 animate-pulse rounded-lg border border-border/30" />
        ))}
      </div>
    );
  }

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-6 md:px-8 max-w-7xl">
        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
            Our Services
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Specialty envelope, restoration, and construction services across Ontario.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {services.map((service) => {
            const IconComponent = getIconForService(service.name);
            return (
              <Link
                key={service.id}
                to={`/services/${service.slug}`}
                className="group p-6 rounded-lg border border-border/50 hover:border-primary/20 bg-card transition-colors duration-200"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {service.name}
                </h3>
                {service.short_description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {service.short_description}
                  </p>
                )}
              </Link>
            );
          })}
        </div>

        <div>
          <Button asChild variant="outline" size="lg">
            <Link to="/services" className="gap-2">
              View All Services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
