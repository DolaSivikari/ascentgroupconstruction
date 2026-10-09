import { Link, useSearchParams } from "react-router-dom";
import { useId } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Section } from "@/components/sections/Section";
import { SectionHeader } from "@/design-system/components/SectionHeader";
import { Card } from "@/design-system/components/Card";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/ui/Input";
import { Button } from "@/ui/Button";
import { filterDirectory, orderDirectory } from "@/lib/services/directory";
import {
  SERVICE_REGISTRY,
  SERVICE_CATEGORIES,
  SERVICE_CATEGORY_ORDER,
  getServiceCategoryTitle,
  getServiceParent,
} from "@/data/service-registry";

interface ServiceRow {
  slug: string;
  name: string;
  short_description: string | null;
  category: string | null;
  icon_name: string | null;
}

export const ServicesDataGrid = () => {
  const [params, setParams] = useSearchParams();
  const search = params.get("search") || "";
  const searchId = useId();
  const setSearch = (value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set("search", value);
    else next.delete("search");
    setParams(next, { replace: true });
  };
  const {
    data: services,
    isLoading,
    isError,
  } = useQuery({
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

  // Merge DB services with the static registry pages so Wave 1+2 landing
  // pages appear alongside DB-driven services.
  const dbBySlug = new Map((services ?? []).map((s) => [s.slug, s]));
  const registryRows: ServiceRow[] = SERVICE_REGISTRY.filter(
    (e) => e.source === "static" && !dbBySlug.has(e.slug),
  ).map((e) => ({
    slug: e.slug,
    name: e.navLabel,
    short_description: e.navDescription,
    category: SERVICE_CATEGORIES[e.category].title,
    icon_name: e.icon,
  }));
  const allServices: ServiceRow[] = [...(services ?? []), ...registryRows];

  if (allServices.length === 0) return null;

  // Group by category
  const filtered = filterDirectory(allServices, search);
  const grouped = orderDirectory(filtered).reduce<Record<string, ServiceRow[]>>(
    (acc, svc) => {
      const cat = getServiceCategoryTitle(svc.slug, svc.category);
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(svc);
      return acc;
    },
    {},
  );

  const categoryOrder = SERVICE_CATEGORY_ORDER.map(
    (category) => SERVICE_CATEGORIES[category].title,
  );
  const sortedCategories = Object.keys(grouped).sort(
    (a, b) =>
      (categoryOrder.indexOf(a) === -1 ? 99 : categoryOrder.indexOf(a)) -
      (categoryOrder.indexOf(b) === -1 ? 99 : categoryOrder.indexOf(b)),
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

      <div className="mb-10 max-w-2xl">
        <label htmlFor={searchId} className="block text-sm font-semibold mb-2">
          Find a service
        </label>
        <div className="flex gap-2">
          <Input
            id={searchId}
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search painting, tile, restoration…"
            aria-describedby={`${searchId}-results`}
            className="min-w-0 h-11"
          />
          {search && (
            <Button
              variant="outline"
              onClick={() => setSearch("")}
              className="h-11"
            >
              Clear
            </Button>
          )}
        </div>
        <p
          id={`${searchId}-results`}
          role="status"
          className="mt-3 text-sm text-muted-foreground"
        >
          {filtered.length} {filtered.length === 1 ? "service" : "services"}
          {search ? ` matching “${search}”` : " available"}.
        </p>
        {isError && (
          <p className="mt-3 text-sm text-muted-foreground">
            Some service details could not be loaded. Browse the available pages
            or{" "}
            <Link to="/contact" className="underline underline-offset-4">
              contact us
            </Link>{" "}
            about your scope.
          </p>
        )}
        {filtered.length === 0 && (
          <p className="mt-3 text-sm">
            Try a broader search or{" "}
            <Link
              to="/contact"
              className="text-primary underline underline-offset-4"
            >
              tell us about your project
            </Link>
            .
          </p>
        )}
      </div>

      <div className="space-y-16">
        {sortedCategories.map((category) => (
          <div key={category}>
            <h3 className="text-xl font-bold text-foreground mb-6 border-b border-border pb-3">
              {category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {grouped[category].map((service) => (
                <Link
                  key={service.slug}
                  to={`/services/${service.slug}`}
                  className="group"
                >
                  <Card
                    variant="elevated"
                    hover
                    className="h-full flex flex-col"
                  >
                    <h4 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {service.name}
                    </h4>
                    {getServiceParent(service.slug) &&
                      allServices.some(
                        (item) =>
                          item.slug === getServiceParent(service.slug)?.slug,
                      ) && (
                        <p className="text-xs font-semibold text-primary mb-2">
                          Specialty of{" "}
                          {getServiceParent(service.slug)?.navLabel}
                        </p>
                      )}
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                      {service.short_description ||
                        "Learn more about this service."}
                    </p>
                    <div className="flex items-center text-sm font-medium text-primary group-hover:text-accent transition-colors mt-auto">
                      View service{" "}
                      <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
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
