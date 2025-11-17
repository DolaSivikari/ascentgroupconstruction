import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// Placeholder logos - replace with actual client logos
const clientLogos = [
  { name: "Property Management Co.", alt: "Client Logo 1" },
  { name: "Construction Group", alt: "Client Logo 2" },
  { name: "Development Corp", alt: "Client Logo 3" },
  { name: "Real Estate Partners", alt: "Client Logo 4" },
  { name: "Building Services", alt: "Client Logo 5" },
  { name: "Facilities Management", alt: "Client Logo 6" },
];

export const ClientLogosCarousel = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % clientLogos.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={ref}
      className={cn(
        "py-12 bg-background/50 border-y border-border/30",
        "transition-all duration-700",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Trusted By Industry Leaders
          </h3>
          <p className="text-foreground font-semibold">
            500+ Projects Delivered for Ontario's Leading Organizations
          </p>
        </div>

        {/* Logo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
          {clientLogos.map((logo, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center justify-center p-4 rounded-lg",
                "border border-border/20 bg-background/80",
                "transition-all duration-500",
                "hover:border-construction-orange/30 hover:shadow-lg hover:shadow-construction-orange/5",
                activeIndex === index ? "scale-105 border-construction-orange/50" : "scale-100 opacity-70"
              )}
            >
              {/* Placeholder for logo - replace with actual logo images */}
              <div className="text-center">
                <div className="w-24 h-12 flex items-center justify-center text-xs font-semibold text-muted-foreground">
                  {logo.name}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-8 grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-construction-orange">500+</div>
            <div className="text-sm text-muted-foreground">Projects</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-construction-orange">98%</div>
            <div className="text-sm text-muted-foreground">Satisfaction</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-construction-orange">15+</div>
            <div className="text-sm text-muted-foreground">Years</div>
          </div>
        </div>
      </div>
    </section>
  );
};
