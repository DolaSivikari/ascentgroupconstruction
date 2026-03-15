import { Shield, Users, Award } from "lucide-react";

const stats = [
  { icon: Shield, value: "$2M Insured", label: "CGL Coverage" },
  { icon: Users, value: "15+ Years", label: "Crew Experience" },
  { icon: Award, value: "WSIB Compliant", label: "Active Clearance" },
];

export const HomepageProofStrip = () => {
  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <div className="rounded-[var(--radius-lg)] py-8 px-6 bg-muted/50 border border-border">
          <div className="grid gap-6 text-center grid-cols-1 sm:grid-cols-3">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="flex flex-col items-center gap-1">
                  <Icon className="w-5 h-5 mb-1 text-primary" aria-hidden="true" />
                  <p className="text-xl md:text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
