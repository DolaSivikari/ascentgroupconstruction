import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Service {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  category: string | null;
  icon_name: string | null;
  publish_state?: string;
}

interface CategoryGroup {
  category: string;
  services: Service[];
}

export const FeaturedServicesGrid = () => {
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedServices();
  }, []);

  const loadFeaturedServices = async () => {
    const { data } = await supabase
      .from('services')
      .select('id, name, slug, short_description, category, icon_name, publish_state')
      .in('publish_state', ['published', 'archived'])
      .order('publish_state', { ascending: false }) // published first, then archived
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (data) {
      // Group by category
      const grouped = data.reduce((acc, service) => {
        const cat = service.category || 'Other Services';
        const existing = acc.find(g => g.category === cat);
        if (existing) {
          existing.services.push(service);
        } else {
          acc.push({ category: cat, services: [service] });
        }
        return acc;
      }, [] as CategoryGroup[]);

      setCategoryGroups(grouped);
    }
    setLoading(false);
  };

  const getIcon = (iconName: string | null): LucideIcon => {
    if (!iconName) return Icons.Box;
    return (Icons as any)[iconName] || Icons.Box;
  };

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-muted animate-pulse rounded w-64 mx-auto mb-4" />
            <div className="h-4 bg-muted animate-pulse rounded w-96 mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            All Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Complete range of specialty construction solutions, including our legacy services
          </p>
        </motion.div>

        <div className="space-y-16">
          {categoryGroups.map((group, groupIndex) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: groupIndex * 0.1 }}
            >
              {/* Category Header */}
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-foreground mb-2">
                  {group.category}
                </h3>
                <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full" />
              </div>

              {/* Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.services.map((service, serviceIndex) => {
                  const Icon = getIcon(service.icon_name);
                  return (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: serviceIndex * 0.05 }}
                    >
                      <Link
                        to={`/services/${service.slug}`}
                        className="group block h-full"
                      >
                        <div className="h-full p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                          {/* Icon */}
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4 group-hover:from-primary/20 group-hover:to-accent/20 transition-all">
                            <Icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                          </div>

                          {/* Service Name with Legacy Badge */}
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <h4 className="text-xl font-semibold group-hover:text-primary transition-colors">
                              {service.name}
                            </h4>
                            {service.publish_state === 'archived' && (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground shrink-0">
                                Legacy
                              </span>
                            )}
                          </div>

                          {/* Description */}
                          {service.short_description && (
                            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                              {service.short_description}
                            </p>
                          )}

                          {/* Hover Arrow */}
                          <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            Learn more
                            <Icons.ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-muted-foreground mb-6">
            Don't see what you're looking for?
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Contact Us for Custom Solutions
            <Icons.ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
