import { Link } from "react-router-dom";
import { Shield, Users, Award, FileText } from "lucide-react";

interface StatItem {
  icon: typeof Shield;
  numericValue: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

const stats: StatItem[] = [
  {
    icon: Shield,
    numericValue: 2,
    prefix: "$",
    suffix: "M Insured",
    label: "CGL Coverage",
  },
  {
    icon: Users,
    numericValue: 15,
    suffix: "+ Years",
    label: "Crew Experience",
  },
  { icon: Award, numericValue: 0, suffix: "", label: "Active Clearance" },
];

export const HomepageProofStrip = () => {
  const values = stats.map((stat) => stat.numericValue);

  return (
    <section className="pt-10 pb-2">
      <div className="container mx-auto px-4">
        <div className="rounded-[var(--radius-lg)] py-8 px-6 bg-muted/50 border border-border">
          <div className="grid gap-6 text-center grid-cols-1 sm:grid-cols-3">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const isWSIB = index === 2;
              return (
                <div key={index} className="flex flex-col items-center gap-1">
                  <Icon
                    className="w-5 h-5 mb-1 text-primary"
                    aria-hidden="true"
                  />
                  <p className="text-xl md:text-2xl font-bold tabular-nums">
                    {isWSIB
                      ? "WSIB Compliant"
                      : `${stat.prefix || ""}${Math.round(values[index])}${stat.suffix || ""}`}
                  </p>
                  <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-border/60 flex flex-wrap justify-center gap-x-6 gap-y-3 text-center">
            <Link
              to="/prequalification"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              Download Prequal Package
            </Link>
            <Link
              to="/company/certifications-insurance"
              className="text-sm font-medium text-primary underline underline-offset-4"
            >
              Review Credentials
            </Link>
            <Link
              to="/projects"
              className="text-sm font-medium text-primary underline underline-offset-4"
            >
              See Project Work
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
