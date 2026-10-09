import { usePageSettings } from "@/lib/content/pageSettings";
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronDown, type LucideIcon } from "lucide-react";
import { Button } from "@/ui/Button";
import { PageHeroImage } from "./PageHeroImage";
import { isUsableHeroImage } from "@/data/hero-images";
import { getHeroPhoto } from "@/data/hero-photography";
import { cn } from "@/lib/utils";
import { useHeroRegistration } from "@/hooks/useHeroPresence";
import "./page-hero.css";

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
  icon?: LucideIcon;
}
export interface PageHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  eyebrow?: string;
  breadcrumbs?: PageHeroBreadcrumb[];
  variant?: HeroVariant;
  height?: HeroHeight;
  image?: string;
  /** Bundled image retained when a saved image cannot be fetched. */
  fallbackImage?: string;
  imageAlt?: string;
  imagePosition?: "center" | "top" | "bottom";
  overlay?: HeroOverlay;
  textAlign?: HeroTextAlign;
  maxWidth?: HeroMaxWidth;
  primaryCta?: PageHeroCTA;
  secondaryCta?: PageHeroCTA;
  stats?: PageHeroStat[];
  badge?: string;
  badges?: Array<{ icon: LucideIcon; text: string }>;
  showScrollIndicator?: boolean;
  className?: string;
  contentClassName?: string;
}

// Phones use natural content height; desktop profiles retain the page hierarchy.
const heightClasses: Record<HeroHeight, string> = {
  large: "md:min-h-[34rem]",
  medium: "md:min-h-[28rem]",
  small: "md:min-h-[24rem]",
  mini: "md:min-h-[18rem]",
};
const maxWidthClasses: Record<HeroMaxWidth, string> = {
  narrow: "max-w-2xl",
  default: "max-w-4xl",
  wide: "max-w-6xl",
  full: "max-w-full",
};
const staggerStyle = (delayMs: number): React.CSSProperties => ({
  animation: `fade-in 0.5s ease-out ${delayMs}ms both`,
});
const heroCtaLink = (cta: PageHeroCTA) => {
  const Icon = cta.icon;
  const content = (
    <>
      {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />}
      {cta.text}
    </>
  );
  return cta.href.startsWith("#") ? (
    <a href={cta.href}>{content}</a>
  ) : (
    <Link to={cta.href}>{content}</Link>
  );
};

export function PageHero({
  title,
  subtitle,
  description,
  eyebrow,
  breadcrumbs,
  variant = "standard",
  height = "medium",
  image,
  fallbackImage,
  imageAlt = "",
  imagePosition,
  overlay = "gradient",
  textAlign = "left",
  maxWidth = "default",
  primaryCta,
  secondaryCta,
  stats,
  badge,
  badges,
  showScrollIndicator = false,
  className,
  contentClassName,
}: PageHeroProps) {
  const isCentered = variant === "centered" || textAlign === "center";
  const isMinimal = variant === "minimal";
  const pageSettings = usePageSettings();
  const bundledFallback = fallbackImage || image;
  if (isUsableHeroImage(pageSettings.hero.url)) {
    image = pageSettings.hero.url;
    imageAlt = pageSettings.hero.alt;
  }
  const photo = getHeroPhoto(image || "");
  const hasDarkSurface =
    isMinimal || ["gradient", "dark", "brand"].includes(overlay);
  useHeroRegistration(hasDarkSurface);
  const alignment = cn(
    maxWidthClasses[maxWidth],
    isCentered && "mx-auto text-center",
    !isCentered && "mr-auto",
  );
  const hasSupportingInfo = !!(stats?.length || badges?.length);
  const overlayStyle = {
    "--hero-overlay-end": photo?.overlayOpacity ?? 0.3,
    "--hero-overlay-mobile-end": photo?.mobileOverlayOpacity ?? 0.66,
  } as React.CSSProperties;

  return (
    <section
      id="main-content"
      aria-label={title}
      data-page-hero
      className={cn(
        "page-hero relative isolate grid grid-cols-1",
        hasDarkSurface ? "text-white" : "text-[#003366]",
        className,
      )}
      style={overlayStyle}
    >
      {/* A single image surface spans the introduction/actions on phones and all rows on desktop. */}
      <div
        data-page-hero-visual
        className={cn(
          "relative col-start-1 overflow-hidden bg-[#003366] [grid-row:1_/_span_2] md:[grid-row:1_/_span_3]",
          heightClasses[height],
        )}
      >
        {image && !isMinimal && (
          <PageHeroImage
            key={image}
            src={image}
            alt={imageAlt}
            fallbackSrc={bundledFallback}
            position={imagePosition}
          />
        )}
        {!isMinimal && overlay !== "none" && (
          <div
            data-page-hero-overlay
            className={cn(
              "absolute inset-0 z-[1]",
              `page-hero-overlay-${overlay}`,
              isCentered &&
                overlay === "gradient" &&
                "page-hero-overlay-centered",
            )}
          />
        )}
        {showScrollIndicator && (
          <div className="absolute bottom-3 left-1/2 z-10 hidden -translate-x-1/2 animate-bounce motion-reduce:animate-none md:block">
            <ChevronDown className="h-6 w-6 text-white/70" aria-hidden="true" />
          </div>
        )}
      </div>

      <div
        data-page-hero-intro
        className={cn(
          "container relative z-10 col-start-1 row-start-1 mx-auto px-6 pt-28 md:pt-32",
          contentClassName,
        )}
      >
        <div
          className={cn(
            "hero-stagger flex flex-col",
            alignment,
            isCentered ? "items-center" : "items-start",
          )}
        >
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav
              aria-label="Breadcrumb"
              className="mb-4 w-full text-left"
              style={staggerStyle(0)}
            >
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm opacity-90">
                {breadcrumbs.map((crumb, index) => (
                  <li key={index} className="flex min-w-0 items-center gap-2">
                    {crumb.href ? (
                      <Link
                        to={crumb.href}
                        aria-current={
                          index === breadcrumbs.length - 1 ? "page" : undefined
                        }
                        className="rounded underline-offset-4 transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-current focus-visible:outline-offset-4"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span
                        aria-current={
                          index === breadcrumbs.length - 1 ? "page" : undefined
                        }
                        className="font-medium"
                      >
                        {crumb.label}
                      </span>
                    )}
                    {index < breadcrumbs.length - 1 && (
                      <ChevronRight
                        className="h-3.5 w-3.5 shrink-0"
                        aria-hidden="true"
                      />
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          {badge && (
            <div className="mb-3" style={staggerStyle(50)}>
              <span className="inline-flex rounded-full border border-orange-300/40 bg-orange-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-200">
                {badge}
              </span>
            </div>
          )}
          {eyebrow && (
            <p
              className="mb-2 text-xs font-semibold uppercase tracking-wider opacity-80 md:text-sm"
              style={staggerStyle(50)}
            >
              {eyebrow}
            </p>
          )}
          {subtitle && (
            <p
              className="mb-2 text-xs font-semibold uppercase tracking-wide text-orange-200 md:text-sm"
              style={staggerStyle(50)}
            >
              {subtitle}
            </p>
          )}
          <h1
            className="mb-3 max-w-[26ch] break-words text-3xl font-bold leading-[1.12] tracking-tight [text-wrap:balance] sm:text-4xl md:text-5xl lg:text-[3.5rem]"
            style={staggerStyle(100)}
          >
            {title}
          </h1>
          {!isCentered && (
            <div
              className="mb-4 h-1 w-12 shrink-0 bg-[hsl(var(--accent))] md:w-16"
              style={staggerStyle(150)}
              aria-hidden="true"
            />
          )}
          {description && (
            <p
              className="max-w-2xl text-base leading-relaxed opacity-95 md:text-lg"
              style={staggerStyle(200)}
            >
              {description}
            </p>
          )}
        </div>
      </div>

      {primaryCta || secondaryCta ? (
        <div
          data-page-hero-actions
          className="container relative z-10 col-start-1 row-start-2 mx-auto px-6 pb-12 pt-6 md:row-start-3 md:pb-12"
        >
          <div
            className={cn(
              "flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap",
              alignment,
              isCentered && "sm:justify-center",
            )}
            style={staggerStyle(250)}
          >
            {primaryCta && (
              <Button
                asChild
                size="md"
                variant="primary"
                data-hero-primary
                className="min-h-12 w-full whitespace-normal bg-[#c74a00] px-5 py-3 text-base hover:bg-[#ac4000] sm:w-auto"
              >
                {heroCtaLink(primaryCta)}
              </Button>
            )}
            {secondaryCta && (
              <Button
                asChild
                size="md"
                variant="outline"
                className={cn(
                  "min-h-12 w-full whitespace-normal px-5 py-3 text-base sm:w-auto md:min-h-12 md:px-5 md:py-3 md:text-base",
                  hasDarkSurface &&
                    "border-white/70 text-white hover:bg-white/10",
                )}
              >
                {heroCtaLink(secondaryCta)}
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div
          aria-hidden="true"
          className="col-start-1 row-start-2 h-12 md:row-start-3"
        />
      )}

      {/* One copy of each fact: below the image on phones, before the actions on desktop. */}
      {hasSupportingInfo && (
        <div
          data-page-hero-support
          className="relative z-10 col-start-1 row-start-3 border-b border-border bg-background text-foreground md:row-start-2 md:border-0 md:bg-transparent md:text-inherit"
        >
          <div className="container mx-auto px-6 py-5 md:pb-0 md:pt-6">
            <div className={cn("space-y-4", alignment)}>
              {badges && badges.length > 0 && (
                <ul
                  className={cn(
                    "flex flex-wrap gap-x-4 gap-y-2 md:gap-3",
                    isCentered && "md:justify-center",
                  )}
                >
                  {badges.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm md:rounded-full md:border md:border-white/25 md:bg-white/10 md:px-3 md:py-1.5"
                      >
                        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>{item.text}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
              {stats && stats.length > 0 && (
                <dl className="grid grid-cols-2 gap-x-6 gap-y-4 md:flex md:flex-wrap md:gap-x-8 md:rounded-lg md:border md:border-white/25 md:bg-white/10 md:p-4">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex min-w-0 flex-col",
                        isCentered ? "text-center" : "text-left",
                      )}
                    >
                      <dt className="order-2 mt-1 text-sm opacity-80">
                        {stat.label}
                      </dt>
                      <dd className="order-1 break-words text-2xl font-bold text-primary md:text-3xl md:text-[hsl(var(--accent))]">
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default PageHero;
