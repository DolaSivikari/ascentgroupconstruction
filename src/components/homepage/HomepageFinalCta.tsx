import { Link } from "react-router-dom";
import { FileText, Calculator, MessageSquare, ArrowRight } from "lucide-react";
import { LAYOUT, TYPOGRAPHY_STYLES } from "@/design-system/constants";

const CTA_PATHS = [
  {
    icon: FileText,
    title: "Submit an RFP",
    description: "Send us your project documents for a detailed scope review and pricing proposal.",
    route: "/submit-rfp",
    label: "Submit RFP",
  },
  {
    icon: Calculator,
    title: "Request an Estimate",
    description: "Get a preliminary estimate for your commercial, multi-unit, or residential scope.",
    route: "/estimate",
    label: "Get Estimate",
  },
  {
    icon: MessageSquare,
    title: "Contact Our Team",
    description: "Reach our project team to discuss timelines, capabilities, or general inquiries.",
    route: "/contact",
    label: "Contact Us",
  },
] as const;

const HomepageFinalCta = () => {
  return (
    <section className={`${LAYOUT.sectionSpacing.major} bg-primary/5`}>
      <div className={`container mx-auto ${LAYOUT.containerPadding} ${LAYOUT.maxWidth}`}>
        <div className="text-center mb-12">
          <h2 className={`${TYPOGRAPHY_STYLES.sectionTitle} text-foreground mb-4`}>
            Ready to Start Your Project?
          </h2>
          <p className={`${TYPOGRAPHY_STYLES.bodyDefault} text-muted-foreground max-w-2xl mx-auto`}>
            Whether you have drawings ready or need to discuss scope, we're here to help move your project forward.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {CTA_PATHS.map((path) => {
            const Icon = path.icon;
            return (
              <Link
                key={path.route}
                to={path.route}
                className="group flex flex-col items-center text-center p-8 rounded-[var(--radius-lg)] bg-card border hover:border-primary/50 hover:shadow-[var(--shadow-lg)] transition-all"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{path.title}</h3>
                <p className="text-sm text-muted-foreground mb-5 flex-1">{path.description}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:text-accent transition-colors">
                  {path.label} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomepageFinalCta;
