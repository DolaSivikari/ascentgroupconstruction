import { useState } from "react";
import { cn } from "@/lib/utils";
import OptimizedImage from "@/components/OptimizedImage";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Shared featured-image renderer for projects.
 *
 * Single source of truth so every project (existing and newly posted) gets
 * the same treatment: locked aspect ratio (no layout shift / letterboxing),
 * skeleton placeholder while loading, and a branded AGC fallback when the
 * image is missing or fails to load.
 *
 * Used by:
 *  - ProjectDetail (banner)
 *  - HomepageFeaturedProjects, FeaturedProjects, ServicesFeaturedWork,
 *    ProjectCard, Projects grid (card)
 *  - Future thumbnails / related projects (thumbnail)
 */

export type ProjectFeaturedImageVariant = "banner" | "card" | "thumbnail";

interface ProjectFeaturedImageProps {
  src?: string | null;
  alt: string;
  variant?: ProjectFeaturedImageVariant;
  /** Eager-load + high fetch priority. Use for above-the-fold imagery. */
  priority?: boolean;
  /** Disable hover zoom (e.g. when wrapper handles its own animation). */
  disableHover?: boolean;
  /** Extra classes appended to the outer container. */
  className?: string;
  /** Optional badge / overlay rendered on top of the image. */
  children?: React.ReactNode;
}

const variantAspect: Record<ProjectFeaturedImageVariant, string> = {
  // Detail page hero — wide cinematic on desktop, 16:9 on mobile
  banner: "aspect-[16/9] md:aspect-[21/9]",
  // Grid cards — universal 4:3
  card: "aspect-[4/3]",
  // Small lists / related — square
  thumbnail: "aspect-square",
};

const variantHover: Record<ProjectFeaturedImageVariant, string> = {
  banner: "group-hover:scale-[1.03]",
  card: "group-hover:scale-105",
  thumbnail: "group-hover:scale-110",
};

export const ProjectFeaturedImage = ({
  src,
  alt,
  variant = "card",
  priority = false,
  disableHover = false,
  className,
  children,
}: ProjectFeaturedImageProps) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const showFallback = !src || hasError;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted",
        variantAspect[variant],
        className
      )}
    >
      {/* Skeleton while loading */}
      {!showFallback && !isLoaded && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
      )}

      {/* Branded AGC fallback */}
      {showFallback ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted text-muted-foreground">
          <span
            className={cn(
              "font-bold tracking-wider",
              variant === "banner"
                ? "text-2xl md:text-3xl"
                : variant === "card"
                ? "text-xl"
                : "text-sm"
            )}
          >
            AGC
          </span>
          {variant === "banner" && (
            <span className="text-xs mt-1">Project imagery coming soon</span>
          )}
        </div>
      ) : (
        <img
          src={src!}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "auto"}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true);
          }}
          className={cn(
            "absolute inset-0 w-full h-full object-cover object-center transition-[opacity,transform] duration-500 ease-out",
            isLoaded ? "opacity-100" : "opacity-0",
            !disableHover && variantHover[variant]
          )}
        />
      )}

      {children}
    </div>
  );
};

export default ProjectFeaturedImage;
