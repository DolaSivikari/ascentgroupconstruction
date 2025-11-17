import { useRef } from "react";
import { Building, Calendar, DollarSign, Award } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { Link } from "react-router-dom";

const responses = [
  {
    icon: Building,
    value: "500+",
    label: "Buildings Delivered",
    description: "Adding to Ontario's infrastructure capacity",
    linkText: "View Our Work",
    linkUrl: "/portfolio"
  },
  {
    icon: Calendar,
    value: "98%",
    label: "Finished On Schedule",
    description: "Efficiency that reduces costs and waste",
    linkText: "Our Process",
    linkUrl: "/about"
  },
  {
    icon: DollarSign,
    value: "$30M+",
    label: "Annual Projects",
    description: "Driving economic growth in construction",
    linkText: "Current Projects",
    linkUrl: "/portfolio"
  },
  {
    icon: Award,
    value: "15+",
    label: "Years in Business",
    description: "Deep expertise through market cycles",
    linkText: "About Us",
    linkUrl: "/about"
  }
];

const CompanyResponse = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(ref);

  return (
    <div ref={ref}>
      <h3 className="text-2xl font-bold text-foreground mb-6">
        Our Contribution to the Solution
      </h3>
      <p className="text-muted-foreground mb-8">
        Delivering quality construction that addresses Ontario's building needs
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {responses.map((response, index) => {
          const Icon = response.icon;
          return (
            <div
              key={index}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-300 group"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.6s ease-out ${index * 0.1 + 0.2}s, transform 0.6s ease-out ${index * 0.1 + 0.2}s`,
              }}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {response.value}
                  </div>
                  <div className="text-sm font-semibold text-foreground/90 mb-2">
                    {response.label}
                  </div>
                  <div className="text-xs text-muted-foreground mb-3">
                    {response.description}
                  </div>
                  <Link 
                    to={response.linkUrl}
                    className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                  >
                    {response.linkText}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompanyResponse;
