import { Home, Building2, HardHat, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useRef } from "react";

const clientTypes = [
  {
    icon: Building2,
    title: "Property Owners",
    headline: "Multi-Family Solutions",
    description: "Multi-family and residential property solutions",
    benefits: ["Quality Construction", "Professional Service", "Reliable Delivery"],
    cta: "View Services",
    link: "/services",
    color: "from-blue-500/10 to-blue-600/5",
  },
  {
    icon: Building2,
    title: "Property Managers",
    headline: "Multi-Property Solutions",
    description: "Commercial construction and maintenance programs",
    benefits: ["After-hours work", "Minimal disruption", "Maintenance contracts"],
    cta: "Request Consultation",
    link: "/property-managers",
    color: "from-green-500/10 to-green-600/5",
  },
  {
    icon: HardHat,
    title: "Contractors & Developers",
    headline: "Subcontractor Partnership",
    description: "Reliable, certified partner for large-scale commercial projects",
    benefits: ["Fast response", "Bonded & insured", "Large project capacity"],
    cta: "Download Prequalification",
    link: "#prequalification",
    color: "from-orange-500/10 to-orange-600/5",
  },
];

const ClientSelector = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useIntersectionObserver(sectionRef);

  return (
    <section ref={sectionRef} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Who We Serve
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose your path to see how we can help with your specific needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {clientTypes.map((client, index) => {
            const Icon = client.icon;
            return (
              <Card
                key={index}
                className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${client.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2 text-foreground">
                    {client.headline}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6">
                    {client.description}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {client.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>

                  <Button asChild className="w-full group-hover:bg-primary/90">
                    <Link to={client.link}>
                      {client.cta}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ClientSelector;
