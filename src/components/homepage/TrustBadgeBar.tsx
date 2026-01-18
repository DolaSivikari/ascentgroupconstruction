import { Shield, Users, Award } from "lucide-react";
import { cn } from "@/lib/utils";

// Reduced to 3 key trust indicators for cleaner UX
const trustBadges = [
  {
    icon: Shield,
    label: "$2M Insured",
    detail: "CGL Coverage",
  },
  {
    icon: Users,
    label: "15+ Years",
    detail: "Crew Experience",
  },
  {
    icon: Award,
    label: "WSIB Compliant",
    detail: "Active Clearance",
  },
];

export const TrustBadgeBar = () => {
  return (
    <section className="py-6 bg-muted/30 border-y border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {trustBadges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 text-center"
              >
                <div className="p-2 rounded-full bg-primary/10">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-sm text-foreground">
                    {badge.label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {badge.detail}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
