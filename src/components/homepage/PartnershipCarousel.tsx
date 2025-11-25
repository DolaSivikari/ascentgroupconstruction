import { useCarousel } from "@/hooks/useCarousel";
import { partnershipModels } from "@/data/partnership-models";
import { PartnershipModelCard } from "@/components/partnerships/PartnershipModelCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/ui/Button";
import { useEffect, useRef } from "react";

export const PartnershipCarousel = () => {
  const { 
    currentIndex, 
    next, 
    prev, 
    goToSlide, 
    pause, 
    play,
    canGoNext,
    canGoPrev 
  } = useCarousel({ 
    totalItems: partnershipModels.length, 
    autoplayInterval: 6000,
    itemsPerView: 1 
  });

  const carouselRef = useRef<HTMLDivElement>(null);

  // Pause on hover
  useEffect(() => {
    const element = carouselRef.current;
    if (!element) return;

    const handleMouseEnter = () => pause();
    const handleMouseLeave = () => play();

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [pause, play]);

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-background to-background/50">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How We Partner With You
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Flexible partnership models designed for property owners, general contractors, and consultants
          </p>
        </div>

        {/* Carousel */}
        <div ref={carouselRef} className="relative">
          {/* Main Card Display */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {partnershipModels.map((model) => (
                <div key={model.id} className="w-full flex-shrink-0 px-2">
                  <div className="max-w-2xl mx-auto">
                    <PartnershipModelCard model={model} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 pointer-events-none">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              disabled={!canGoPrev}
              className="pointer-events-auto bg-background/90 hover:bg-background border-border/50 shadow-lg"
              aria-label="Previous partnership model"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={next}
              disabled={!canGoNext}
              className="pointer-events-auto bg-background/90 hover:bg-background border-border/50 shadow-lg"
              aria-label="Next partnership model"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {partnershipModels.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? "w-8 bg-primary" 
                    : "w-2 bg-border hover:bg-border/80"
                }`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentIndex}
              />
            ))}
          </div>
        </div>

        {/* View All Link */}
        <div className="text-center mt-8">
          <a 
            href="/capabilities#partnership-models" 
            className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View All Partnership Models
            <ChevronRight className="ml-1 h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
