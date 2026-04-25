import { useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface GalleryThumbnailProps {
  src: string;
  alt: string;
  disableHoverScale?: boolean;
}

/**
 * Reserves aspect-square space, shows a skeleton while loading,
 * and falls back to a branded AGC placeholder on error.
 */
export const GalleryThumbnail = ({
  src,
  alt,
  disableHoverScale = false,
}: GalleryThumbnailProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="absolute inset-0">
      {!isLoaded && !hasError && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
      )}
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
          <span className="text-sm font-bold tracking-wider">AGC</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true);
          }}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-500",
            isLoaded ? "opacity-100" : "opacity-0",
            !disableHoverScale && "group-hover:scale-110"
          )}
          style={{ transition: "opacity 0.5s ease, transform 0.5s ease" }}
        />
      )}
    </div>
  );
};

export default GalleryThumbnail;
