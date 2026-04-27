import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/ui/Button";
import { ChevronLeft, ChevronRight, MapPin, Award } from "lucide-react";

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
    <section className="relative min-h-[60vh] md:min-h-[75vh] md:h-[80vh] overflow-hidden pt-20 md:pt-0">
      {/* Project showcase carousel background */}
      <div className="absolute inset-0">
        {currentProject && (
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
            style={{ backgroundImage: `url(${currentProject?.image || '/hero-poster-1.webp'})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-[60vh] md:min-h-0 md:h-full flex items-center py-10 md:py-0">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl animate-fade-in">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground" />
              <span className="text-primary-foreground/90 text-sm md:text-base">
                {currentProject?.location || "Greater Toronto Area"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 text-primary-foreground leading-tight">
              {currentProject?.title || "Our Project Portfolio"}
            </h1>

            <p className="text-base sm:text-lg md:text-2xl text-primary-foreground/90 mb-5 md:mb-8">
              {currentProject?.category || "Professional Project Execution"}
            </p>

            {/* Qualitative Value Proposition — compact on mobile, no backdrop-blur to avoid washed-out look */}
            <div className="flex flex-wrap gap-2 md:gap-3 mb-6 md:mb-8">
              <div className="flex items-center gap-1.5 md:gap-2 bg-primary-foreground/15 border border-primary-foreground/20 rounded-full px-3 py-1.5 md:px-4 md:py-2">
                <Award className="w-3.5 h-3.5 md:w-5 md:h-5 text-primary-foreground" />
                <span className="text-xs md:text-sm font-medium text-primary-foreground whitespace-nowrap">Quality Craftsmanship</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 bg-primary-foreground/15 border border-primary-foreground/20 rounded-full px-3 py-1.5 md:px-4 md:py-2">
                <Award className="w-3.5 h-3.5 md:w-5 md:h-5 text-primary-foreground" />
                <span className="text-xs md:text-sm font-medium text-primary-foreground whitespace-nowrap">On-Time Delivery</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 bg-primary-foreground/15 border border-primary-foreground/20 rounded-full px-3 py-1.5 md:px-4 md:py-2">
                <Award className="w-3.5 h-3.5 md:w-5 md:h-5 text-primary-foreground" />
                <span className="text-xs md:text-sm font-medium text-primary-foreground whitespace-nowrap">Safety-First Approach</span>
              </div>
            </div>

            <Button
              asChild
              size="lg"
              variant="secondary"
              className="shadow-[var(--shadow-lg)] hover:shadow-[var(--shadow-lg)] hover:scale-105 transition-all"
            >
              <Link to="#all-projects">View All Projects</Link>
            </Button>
          </div>
        </div>

        {/* Carousel controls — hidden on mobile to reduce visual clutter */}
        {featuredProjects.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
              aria-label="Previous project"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
              aria-label="Next project"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Slide indicators */}
        {featuredProjects.length > 1 && (
          <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {featuredProjects.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-primary-foreground w-8"
                    : "bg-primary-foreground/40 w-2"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
