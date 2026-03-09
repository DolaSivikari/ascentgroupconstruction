import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/ui/Button";
import { ProgressiveImage } from "@/components/ui/ProgressiveImage";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export type HeroVariant = "standard" | "compact" | "minimal" | "centered";
export type HeroHeight = "large" | "medium" | "small" | "mini";
export type HeroOverlay = "gradient" | "dark" | "brand" | "light" | "none";
export type HeroTextAlign = "left" | "center";
export type HeroMaxWidth = "narrow" | "default" | "wide" | "full";

export interface PageHeroBreadcrumb {
  label: string;
  href?: string;
}

export interface PageHeroStat {
  value: string;
  label: string;
}

export interface PageHeroCTA {
  text: string;
  href: string;
  variant?: "primary" | "secondary" | "outline";
}

export interface PageHeroProps {
  // Content
  title: string;
  subtitle?: string;
  description?: string;
  eyebrow?: string;
  breadcrumbs?: PageHeroBreadcrumb[];
  
  // Visual
  variant?: HeroVariant;
  height?: HeroHeight;
  image?: string;
  imageAlt?: string;
  imagePosition?: "center" | "top" | "bottom";
  overlay?: HeroOverlay;
  
  // Layout
  textAlign?: HeroTextAlign;
  maxWidth?: HeroMaxWidth;
  
  // CTAs
  primaryCta?: PageHeroCTA;
  secondaryCta?: PageHeroCTA;
  
  // Extras
  stats?: PageHeroStat[];
  badge?: string;
  showScrollIndicator?: boolean;
  
  // Styling
  className?: string;
  contentClassName?: string;
}

// ============================================================================
// Style Mappings
// ============================================================================

const heightClasses: Record<HeroHeight, string> = {
  large: "min-h-[70vh]",
  medium: "min-h-[50vh] md:min-h-[400px]",
  small: "min-h-[35vh] md:min-h-[300px]",
  mini: "min-h-[25vh] md:min-h-[200px]",
};

const overlayClasses: Record<HeroOverlay, string> = {
  gradient: "bg-gradient-to-r from-[hsl(var(--ink))]/90 via-[hsl(var(--ink))]/75 to-[hsl(var(--ink))]/50",
  dark: "bg-[hsl(var(--ink))]/70",
  brand: "bg-gradient-to-br from-[hsl(var(--primary))]/90 to-[hsl(var(--primary))]/70",
  light: "bg-[hsl(var(--bg))]/40",
  none: "",
};

const maxWidthClasses: Record<HeroMaxWidth, string> = {
  narrow: "max-w-2xl",
  default: "max-w-4xl",
  wide: "max-w-6xl",
  full: "max-w-full",
};

const imagePositionClasses: Record<string, string> = {
  center: "object-center",
  top: "object-top",
  bottom: "object-bottom",
};

// ============================================================================
// Component
// ============================================================================

// Helper for staggered animation styles (respects prefers-reduced-motion via CSS)
const staggerStyle = (delayMs: number): React.CSSProperties => ({
  animation: `fade-in 0.5s ease-out ${delayMs}ms both`,
});

export function PageHero({
  // Content
  title,
  subtitle,
  description,
  eyebrow,
  breadcrumbs,
  
  // Visual
  variant = "standard",
  height = "medium",
  image,
  imageAlt = "",
  imagePosition = "center",
  overlay = "gradient",
  
  // Layout
  textAlign = "left",
  maxWidth = "default",
  
  // CTAs
  primaryCta,
  secondaryCta,
  
  // Extras
  stats,
  badge,
  showScrollIndicator = false,
  
  // Styling
  className,
  contentClassName,
}: PageHeroProps) {
  const isCentered = variant === "centered" || textAlign === "center";
  const isMinimal = variant === "minimal";
  
  return (
    <section
      className={cn(
        "relative flex items-end overflow-hidden pt-24",
        heightClasses[height],
        isMinimal && "bg-[hsl(var(--primary))]",
        className
      )}
    >
      {/* Background Image */}
      {image && !isMinimal && (
        <div className="absolute inset-0 z-0">
          <ProgressiveImage
            src={image}
            alt={imageAlt}
            className={cn(
              "w-full h-full object-cover",
              imagePositionClasses[imagePosition]
            )}
          />
        </div>
      )}
      
      {/* Overlay */}
      {!isMinimal && overlay !== "none" && (
        <div className={cn("absolute inset-0 z-[1]", overlayClasses[overlay])} />
      )}
      
      {/* Content Container */}
      <div className={cn("container mx-auto px-6 relative z-10 py-12 md:py-16", contentClassName)}>
        <div
          className={cn(
            "flex flex-col hero-stagger",
            maxWidthClasses[maxWidth],
            isCentered && "mx-auto text-center items-center",
            !isCentered && "items-start"
          )}
        >
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="mb-4 md:mb-6" style={staggerStyle(0)}>
              <ol className="flex flex-wrap items-center gap-2 text-sm text-[hsl(var(--bg))]/80">
                {breadcrumbs.map((crumb, index) => (
                  <li key={index} className="flex items-center gap-2">
                    {crumb.href ? (
                      <Link
                        to={crumb.href}
                        className="hover:text-[hsl(var(--bg))] transition-colors underline-offset-4 hover:underline"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-[hsl(var(--bg))] font-medium">
                        {crumb.label}
                      </span>
                    )}
                    {index < breadcrumbs.length - 1 && (
                      <ChevronRight className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          
          {/* Badge */}
          {badge && (
            <div className="mb-4" style={staggerStyle(50)}>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[hsl(var(--accent))]/20 text-[hsl(var(--accent))] border border-[hsl(var(--accent))]/30">
                {badge}
              </span>
            </div>
          )}
          
          {/* Eyebrow */}
          {eyebrow && (
            <p className="text-sm md:text-base uppercase tracking-wider text-[hsl(var(--bg))]/80 font-semibold mb-2" style={staggerStyle(50)}>
              {eyebrow}
            </p>
          )}
          
          {/* Subtitle (above title) */}
          {subtitle && (
            <p className="text-sm md:text-base uppercase tracking-wider text-[hsl(var(--accent))] font-semibold mb-2" style={staggerStyle(50)}>
              {subtitle}
            </p>
          )}
          
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[hsl(var(--bg))] mb-4 leading-tight tracking-tight" style={staggerStyle(100)}>
            {title}
          </h1>
          
          {/* Accent Line (for left-aligned variants) */}
          {!isCentered && (
            <div className="w-16 h-1 bg-[hsl(var(--accent))] mb-6" style={staggerStyle(150)} aria-hidden="true" />
          )}
          
          {/* Description */}
          {description && (
            <p className={cn(
              "text-base sm:text-lg md:text-xl text-[hsl(var(--bg))]/90 leading-relaxed motion-safe:animate-fade-in",
              isCentered ? "max-w-3xl" : "max-w-2xl"
            )} style={staggerStyle(200)}>
              {description}
            </p>
          )}
          
          {/* Stats */}
          {stats && stats.length > 0 && (
            <div className={cn(
              "flex flex-wrap gap-6 md:gap-10 mt-8 p-6 rounded-lg motion-safe:animate-fade-in",
              "bg-[hsl(var(--bg))]/10 backdrop-blur-sm border border-[hsl(var(--bg))]/20"
            )} style={staggerStyle(250)}>
              {stats.map((stat, index) => (
                <div key={index} className={cn("text-center", !isCentered && "text-left")}>
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-[hsl(var(--accent))]">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[hsl(var(--bg))]/70 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* CTAs */}
          {(primaryCta || secondaryCta) && (
            <div className={cn(
              "flex flex-wrap gap-4 mt-8 motion-safe:animate-fade-in",
              isCentered && "justify-center"
            )} style={staggerStyle(300)}>
              {primaryCta && (
                <Button
                  asChild
                  size="lg"
                  variant={primaryCta.variant === "outline" ? "outline" : "primary"}
                  className={cn(
                    primaryCta.variant === "outline" && 
                    "border-[hsl(var(--bg))] text-[hsl(var(--bg))] hover:bg-[hsl(var(--bg))]/10"
                  )}
                >
                  <Link to={primaryCta.href}>{primaryCta.text}</Link>
                </Button>
              )}
              {secondaryCta && (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-[hsl(var(--bg))] text-[hsl(var(--bg))] hover:bg-[hsl(var(--bg))]/10"
                >
                  <Link to={secondaryCta.href}>{secondaryCta.text}</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown className="w-8 h-8 text-[hsl(var(--bg))]/60" />
        </div>
      )}
    </section>
  );
}

export default PageHero;
