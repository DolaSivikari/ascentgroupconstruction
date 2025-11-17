import { cn } from "@/lib/utils";

interface HeroTabNavigationProps {
  slides: Array<{ headline: string }>;
  currentSlide: number;
  onSlideChange: (index: number) => void;
}

const HeroTabNavigation = ({ slides, currentSlide, onSlideChange }: HeroTabNavigationProps) => {
  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 w-full max-w-7xl px-6">
      <div className="flex gap-2 md:gap-4 justify-center flex-wrap">
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => onSlideChange(index)}
            className={cn(
              "relative px-4 py-2 text-sm md:text-base font-semibold transition-all duration-300",
              "after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[hsl(var(--brand-accent))] after:transition-transform after:duration-300",
              currentSlide === index
                ? "text-white after:scale-x-100"
                : "text-white/70 hover:text-white after:scale-x-0"
            )}
          >
            {slide.headline}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HeroTabNavigation;
