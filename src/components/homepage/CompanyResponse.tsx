import { useRef } from "react";
import { Building, Calendar, DollarSign, Award } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { Link } from "react-router-dom";

const responses = [
  {
    icon: Award,
    value: "15+",
    label: "Years Team Experience",
    description: "Seasoned professionals bringing proven expertise",
    linkText: "About Us",
    linkUrl: "/about"
  },
  {
    icon: Building,
    value: "85%",
    label: "Self-Performed Work",
    description: "Direct execution, clear accountability",
    linkText: "View Our Services",
    linkUrl: "/services"
  },
  {
    icon: Calendar,
    value: "2025",
    label: "Newly Established",
    description: "Building our track record with professional execution",
    linkText: "Our Process",
    linkUrl: "/our-process"
  },
  {
    icon: DollarSign,
    value: "$5M+",
    label: "Liability Coverage",
    description: "Comprehensive insurance and WSIB compliance",
    linkText: "Contact Us",
    linkUrl: "/contact"
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
