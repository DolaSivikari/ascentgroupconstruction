import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Section } from "@/components/sections/Section";
import { Card, CardContent } from "@/design-system/components/Card";
import { ArrowRight } from "lucide-react";
import { getIconForService } from "@/utils/serviceIcons";

interface Service {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
}

interface RelatedServicesProps {
  currentServiceSlug: string;
  currentCategory: string;
}

export const RelatedServices = ({ currentServiceSlug, currentCategory }: RelatedServicesProps) => {
  const [relatedServices, setRelatedServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRelatedServices();
  }, [currentServiceSlug, currentCategory]);

  const loadRelatedServices = async () => {
    const { data } = await supabase
      .from('services')
      .select('id, name, slug, short_description')
      .eq('publish_state', 'published')
      .eq('category', currentCategory)
      .neq('slug', currentServiceSlug)
      .limit(3);

    if (data) {
      setRelatedServices(data);
    }
    setIsLoading(false);
  };

  if (isLoading || relatedServices.length === 0) {
    return null;
  }

  return (
    <Section size="major" className="bg-muted/30">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Related Services</h2>
        <p className="text-muted-foreground">
          Explore more {currentCategory.toLowerCase()} services
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {relatedServices.map((service) => {
          const IconComponent = getIconForService(service.name);
          
          return (
            <Card 
              key={service.id} 
              variant="interactive"
              className="group p-0"
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                  {service.name}
                </h3>
                {service.short_description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {service.short_description}
                  </p>
                )}
                <Link 
                  to={`/services/${service.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Learn more
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center mt-8">
        <Link 
          to="/services" 
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to All Services
        </Link>
      </div>
    </Section>
  );
};
