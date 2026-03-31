import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Section } from "@/components/sections/Section";
import { SectionHeader } from "@/design-system/components/SectionHeader";
import { Card } from "@/design-system/components/Card";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ServiceRow {
  slug: string;
  name: string;
  short_description: string | null;
  category: string | null;
  icon_name: string | null;
}

export const ServicesDataGrid = () => {
  const { data: services, isLoading } = useQuery({
    queryKey: ["services-page-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("slug, name, short_description, category, icon_name")
        .eq("publish_state", "published")
        .order("category")
        .order("name");

      if (error) throw error;
      return (data ?? []) as ServiceRow[];
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <Section size="major">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </Section>
    );
  }

  if (!services || services.length === 0) return null;

  // Group by category
  const grouped = services.reduce<Record<string, ServiceRow[]>>((acc, svc) => {
    const cat = svc.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(svc);
    return acc;
  }, {});

  const categoryOrder = ["Building Envelope", "Restoration & Repair", "Interior Construction", "Specialized Services"];
  const sortedCategories = Object.keys(grouped).sort(
    (a, b) => (categoryOrder.indexOf(a) === -1 ? 99 : categoryOrder.indexOf(a)) -
              (categoryOrder.indexOf(b) === -1 ? 99 : categoryOrder.indexOf(b))
  );

  return (
    <Section size="major">
      <SectionHeader
        badge="What We Do"
        title="Our Services"
        description="Published service lines across building envelope, restoration, and interior trades."
        align="left"
        maxWidth="lg"
      />

      <div className="space-y-16">
        {sortedCategories.map((category) => (
          <div key={category}>
            <h3 className="text-xl font-bold text-foreground mb-6 border-b border-border pb-3">
              {category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {grouped[category].map((service) => (
                <Link key={service.slug} to={`/services/${service.slug}`} className="group">
                  <Card variant="elevated" hover className="h-full flex flex-col">
                    <h4 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {service.name}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                      {service.short_description || "Learn more about this service."}
                    </p>
                    <div className="flex items-center text-sm font-medium text-primary group-hover:text-accent transition-colors mt-auto">
                      View service <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};
