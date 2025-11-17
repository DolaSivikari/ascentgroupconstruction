import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MapPin, Award } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";

interface HeroProject {
  title: string;
  location: string;
  category: string;
  image: string;
  value?: string;
}

interface Props {
  featuredProjects: HeroProject[];
}

export const PremiumProjectHero = ({ featuredProjects }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const projectCount = useCountUp(500, 2000);
  const totalValue = useCountUp(2, 2000);
  const satisfaction = useCountUp(98, 2000);

  // Start autoplay after initial page load is stable (15 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPlaying(true);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (featuredProjects.length > 0 && isPlaying) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredProjects.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [featuredProjects.length, isPlaying]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredProjects.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredProjects.length) % featuredProjects.length);
  };

  const currentProject = featuredProjects[currentIndex] || featuredProjects[0];

  return (
    <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
      {/* Project showcase carousel background */}
      <div className="absolute inset-0">
        {currentProject && (
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
            style={{ 
              backgroundImage: `url(${currentProject?.image || '/hero-poster-1.webp'})`,
              aspectRatio: '16/9'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary-foreground" />
              <span className="text-primary-foreground/90 text-sm md:text-base">
                {currentProject?.location || "Greater Toronto Area"}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-primary-foreground">
              {currentProject?.title || "Our Project Portfolio"}
            </h1>
            
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8">
              {currentProject?.category || "500+ Successful Projects"}
            </p>

            {/* Animated statistics dashboard */}
            <div className="flex flex-wrap gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-foreground mb-1">
                  {projectCount}+
                </div>
                <div className="text-sm text-primary-foreground/80">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-foreground mb-1">
                  ${totalValue}B+
                </div>
                <div className="text-sm text-primary-foreground/80">Total Value</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-foreground mb-1">
                  {satisfaction}%
                </div>
                <div className="text-sm text-primary-foreground/80">Satisfaction</div>
              </div>
            </div>

            <Button 
              size="lg" 
              variant="secondary"
              className="shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              View All Projects
            </Button>
          </div>
        </div>

        {/* Carousel controls */}
        {featuredProjects.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
              aria-label="Previous project"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
              aria-label="Next project"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {featuredProjects.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? "bg-primary-foreground w-8" 
                  : "bg-primary-foreground/40"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
