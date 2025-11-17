import { useRef } from "react";
import { Building, Building2, Users, Hammer } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const challenges = [
  {
    icon: Building,
    value: "1.8M",
    label: "Homes Needed by 2030",
    description: "CMHC projection for Ontario housing demand",
    source: "Canada Mortgage and Housing Corporation",
    sourceUrl: "https://www.cmhc-schl.gc.ca"
  },
  {
    icon: Building2,
    value: "$150B+",
    label: "Infrastructure Gap",
    description: "Investment required in Ontario infrastructure",
    source: "Infrastructure Canada Reports",
    sourceUrl: "https://www.infrastructure.gc.ca"
  },
  {
    icon: Users,
    value: "15%",
    label: "Skilled Labor Shortage",
    description: "Construction trades workforce gap",
    source: "BuildForce Canada",
    sourceUrl: "https://www.buildforce.ca"
  },
  {
    icon: Hammer,
    value: "30%",
    label: "Buildings Need Major Repairs",
    description: "Commercial buildings requiring envelope work",
    source: "OGCA Industry Report",
    sourceUrl: "https://www.ogca.ca"
  }
];

const MarketChallenge = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(ref);

  return (
    <div ref={ref}>
      <h3 className="text-2xl font-bold text-foreground mb-6">
        Ontario's Construction Challenge
      </h3>
      <p className="text-muted-foreground mb-8">
        Understanding the market context driving demand for construction excellence
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {challenges.map((challenge, index) => {
          const Icon = challenge.icon;
          return (
            <div
              key={index}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-300"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.6s ease-out ${index * 0.1 + 0.2}s, transform 0.6s ease-out ${index * 0.1 + 0.2}s`,
              }}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <Icon className="h-6 w-6 text-destructive" />
                </div>
                <div className="flex-1">
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {challenge.value}
                  </div>
                  <div className="text-sm font-semibold text-foreground/90 mb-2">
                    {challenge.label}
                  </div>
                  <div className="text-xs text-muted-foreground mb-3">
                    {challenge.description}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <a 
                      href={challenge.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="underline hover:text-primary"
                    >
                      {challenge.source}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarketChallenge;
