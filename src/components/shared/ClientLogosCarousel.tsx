import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ClientLogo {
  name: string;
  logo: string;
}

interface ClientLogosCarouselProps {
  logos?: ClientLogo[];
  speed?: number;
  className?: string;
}

const defaultLogos: ClientLogo[] = [
  { name: "Oxford Properties", logo: "/placeholder.svg" },
  { name: "Cadillac Fairview", logo: "/placeholder.svg" },
  { name: "Brookfield", logo: "/placeholder.svg" },
  { name: "RioCan", logo: "/placeholder.svg" },
  { name: "Dream", logo: "/placeholder.svg" },
  { name: "Tridel", logo: "/placeholder.svg" },
  { name: "Daniels", logo: "/placeholder.svg" },
  { name: "Menkes", logo: "/placeholder.svg" }
];

export const ClientLogosCarousel = ({
  logos = defaultLogos,
  speed = 30,
  className
}: ClientLogosCarouselProps) => {
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate logos for seamless loop
  const duplicatedLogos = [...logos, ...logos, ...logos];

  return (
    <div className={cn("relative overflow-hidden bg-muted/30 py-12", className)}>
      <div className="container mx-auto px-4 mb-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">Trusted By Industry Leaders</h3>
          <p className="text-muted-foreground">Proudly serving Ontario's top developers and property managers</p>
        </div>
      </div>

      {/* Gradient Masks */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

      {/* Scrolling Container */}
      <div
        className="flex gap-12"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{
          animation: isPaused ? "none" : `scroll-left ${speed}s linear infinite`,
        }}
      >
        {duplicatedLogos.map((logo, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-40 h-24 flex items-center justify-center bg-background rounded-lg border-2 border-border p-4 hover:border-primary/30 transition-all hover:scale-105"
          >
            <div className="text-center">
              <div className="w-full h-16 flex items-center justify-center mb-1 text-muted-foreground font-semibold">
                {logo.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
