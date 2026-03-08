import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card } from "@/design-system/components/Card";
import { SERVICE_PILLARS } from "@/data/service-pillars";
import { LAYOUT, TYPOGRAPHY_STYLES } from "@/design-system/constants";

const HomepageServiceHighlights = () => {
  return (
    <section className={LAYOUT.sectionSpacing.major}>
      <div className={`container mx-auto ${LAYOUT.containerPadding} ${LAYOUT.maxWidth}`}>
        <div className="mb-12">
          <p className={`${TYPOGRAPHY_STYLES.label} text-accent mb-3`}>What We Do</p>
          <h2 className={`${TYPOGRAPHY_STYLES.sectionTitle} text-foreground mb-4`}>
            Core Service Pillars
          </h2>
          <p className={`${TYPOGRAPHY_STYLES.bodyDefault} text-muted-foreground max-w-3xl`}>
            Eight focused trade categories covering the building envelope, interior finishes, and renovation scopes we deliver across Ontario.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICE_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Link key={pillar.title} to={pillar.route} className="group">
                <Card variant="elevated" hover className="h-full flex flex-col">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                    {pillar.description}
                  </p>
                  <div className="flex items-center text-sm font-medium text-primary group-hover:text-accent transition-colors mt-auto">
                    Learn more <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomepageServiceHighlights;
