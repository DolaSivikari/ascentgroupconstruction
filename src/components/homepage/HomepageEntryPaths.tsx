import { Link } from "react-router-dom";
import { ArrowRight, Building2, Home } from "lucide-react";
import contentModule, { homeEntry } from "@/content/pages/home-entry";
import { restoreStructured } from "@/content/structured";
import { useResolvedContent } from "@/lib/content/store";

export function HomepageEntryPaths() {
  const c = restoreStructured(homeEntry, useResolvedContent(contentModule));
  return (
    <section
      aria-labelledby="property-paths-heading"
      className="container mx-auto px-4 pt-10"
    >
      <h2
        id="property-paths-heading"
        className="text-xl md:text-2xl font-semibold mb-5"
      >
        {c.title}
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { ...c.commercial, icon: Building2 },
          { ...c.residential, icon: Home },
        ].map(({ icon: Icon, ...path }) => (
          <Link
            key={path.href}
            to={path.href}
            className="group rounded-[var(--radius-lg)] border border-border bg-muted/30 p-6 hover:border-primary/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <div className="flex items-center gap-3 mb-3">
              <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
              <h3 className="text-lg font-semibold">{path.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {path.description}
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              {path.action}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
