import { useState, useEffect, useRef, CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface ProgressiveImageProps {
  src: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  placeholderClassName?: string;
  loading?: "lazy" | "eager";
}

/**
 * Progressive Image Loading Component
 * 
 * Features:
 * - Lazy loading with Intersection Observer
 * - Low-quality placeholder with blur effect
 * - Smooth fade transition to full image
 * - Optimized performance with decoding="async"
 * 
 * @example
 * ```tsx
 * <ProgressiveImage 
 *   src={heroImage} 
 *   alt="Hero background"
 *   className="w-full h-full object-cover"
 *   style={{ transform: `translateY(${parallaxOffset}px)` }}
 * />
 * ```
 */
export const ProgressiveImage = ({
  src,
  alt = "",
  className,
  style,
  placeholderClassName,
  loading = "lazy"
}: ProgressiveImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (loading === "eager") {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "50px", // Start loading 50px before entering viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [loading]);

  // Handle image load
  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div ref={imgRef} className={cn("relative overflow-hidden", className)}>
      {/* Low-quality placeholder with blur */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br from-muted/50 to-muted transition-opacity duration-700",
          isLoaded ? "opacity-0" : "opacity-100",
          placeholderClassName
        )}
        style={style}
      >
        <div className="absolute inset-0 backdrop-blur-xl bg-muted/30" />
      </div>

      {/* Full resolution image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-700",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          style={style}
          onLoad={handleImageLoad}
          loading={loading}
          decoding="async"
        />
      )}
    </div>
  );
};
