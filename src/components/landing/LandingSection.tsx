import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LandingSectionProps {
  number: string;
  title: string;
  headline: string;
  description: string;
  isActive: boolean;
  isIntro?: boolean;
  children?: ReactNode;
}

export const LandingSection = ({
  number,
  title,
  headline,
  description,
  isActive,
  isIntro,
  children
}: LandingSectionProps) => {
  return (
    <section className="h-screen flex items-center justify-center relative overflow-hidden">
      {/* Large background number */}
      <div 
        className={cn(
          "absolute text-[120px] md:text-[200px] font-bold transition-all duration-1000",
          "text-muted/10 select-none pointer-events-none",
          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}
        style={{ top: '10%', left: '50%', transform: 'translateX(-50%)' }}
      >
        {number}
      </div>
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <div 
          className={cn(
            "transition-all duration-1000 delay-150",
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {!isIntro && (
            <h3 className="text-xs md:text-sm font-bold tracking-[0.2em] text-primary mb-4 uppercase">
              {title}
            </h3>
          )}
          
          <h2 className={cn(
            "font-bold text-foreground mb-6 leading-tight",
            isIntro ? "text-4xl md:text-6xl lg:text-7xl" : "text-3xl md:text-5xl lg:text-6xl"
          )}>
            {headline}
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>
          
          {children && (
            <div className="mt-8">
              {children}
            </div>
          )}
        </div>
      </div>
      
      {/* Scroll indicator for intro section */}
      {isIntro && (
        <div 
          className={cn(
            "absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2",
            "transition-all duration-1000 delay-500",
            isActive ? "opacity-100" : "opacity-0"
          )}
        >
          <span className="text-sm text-muted-foreground font-medium tracking-wider">
            SCROLL TO EXPLORE
          </span>
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-muted-foreground/50 rounded-full animate-bounce" />
          </div>
        </div>
      )}
    </section>
  );
};
