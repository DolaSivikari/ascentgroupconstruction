import { Building2, Users, Award, TrendingUp, Shield, Clock } from "lucide-react";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { cn } from "@/lib/utils";

const quickFacts = [
  {
    icon: Clock,
    value: 15,
    suffix: "+",
    label: "Years Experience",
    color: "text-construction-orange",
  },
  {
    icon: Building2,
    value: 10,
    suffix: "+",
    label: "Projects Completed",
    color: "text-blue-500",
  },
  {
    icon: TrendingUp,
    value: 85,
    suffix: "%",
    label: "Self-Performed",
    color: "text-green-500",
  },
  {
    icon: Users,
    value: 10,
    suffix: "",
    label: "Crew Members",
    color: "text-purple-500",
  },
  {
    icon: Shield,
    value: 95,
    suffix: "%",
    label: "On-Time Delivery",
    color: "text-yellow-500",
  },
  {
    icon: Award,
    value: 98,
    suffix: "%",
    label: "Client Satisfaction",
    color: "text-red-500",
  },
];

export const QuickFactsSidebar = () => {
  return (
    <div className="space-y-6">
      <div className="sticky top-24">
        <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Award className="w-5 h-5 text-construction-orange" />
          Quick Facts
        </h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
          {quickFacts.map((fact, index) => {
            const Icon = fact.icon;
            return (
              <div
                key={index}
                className={cn(
                  "p-4 rounded-lg border border-border/50",
                  "bg-gradient-to-br from-background to-background/50",
                  "hover:border-construction-orange/50 transition-all duration-300",
                  "hover:shadow-lg hover:shadow-construction-orange/5"
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={cn("p-2 rounded-md bg-background/80", fact.color)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    <AnimatedCounter
                      target={fact.value}
                      duration={2000}
                      suffix={fact.suffix}
                    />
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {fact.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Building Credentials */}
        <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-construction-orange/5 to-construction-orange/10 border border-construction-orange/20">
          <div className="text-xs font-semibold text-construction-orange mb-2">
            BUILDING OUR CREDENTIALS
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 text-xs rounded-md bg-background/80 border border-border">
              Licensed Business
            </span>
            <span className="px-2 py-1 text-xs rounded-md bg-background/80 border border-border">
              10-Person Crew
            </span>
            <span className="px-2 py-1 text-xs rounded-md bg-background/80 border border-border">
              24/7 Emergency
            </span>
            <span className="px-2 py-1 text-xs rounded-md bg-background/80 border border-border">
              WSIB In Progress
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
