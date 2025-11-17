import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import * as LucideIcons from "lucide-react";
import { LucideIcon } from "lucide-react";

interface ValuePillar {
  id: string;
  title: string;
  description: string;
  icon_name: string | null;
  display_order: number;
}

const ValuePillars = () => {
  const { data: pillars, isLoading } = useQuery({
    queryKey: ["value-pillars"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("value_pillars")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (error) throw error;
      return data as ValuePillar[];
    },
  });

  if (isLoading) {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!pillars || pillars.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-background via-construction-orange/5 to-background">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar) => {
            const IconComponent = pillar.icon_name
              ? (LucideIcons[pillar.icon_name as keyof typeof LucideIcons] as LucideIcon)
              : null;

            return (
              <Card 
                key={pillar.id} 
                className="group border border-construction-orange/20 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md hover:border-construction-orange/40 hover:shadow-xl hover:shadow-construction-orange/20 transition-all duration-300 hover:scale-105 rounded-xl overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-construction-orange/0 to-construction-orange/0 group-hover:from-construction-orange/10 group-hover:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardContent className="p-6 relative z-10">
                  <div className="flex flex-col items-start gap-4">
                    {IconComponent && (
                      <div className="w-12 h-12 rounded-xl bg-construction-orange/10 flex items-center justify-center group-hover:bg-construction-orange/15 transition-colors duration-300">
                        <IconComponent className="w-6 h-6 text-construction-orange" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {pillar.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ValuePillars;
