import { useState, useMemo } from "react";
import { useImageLoad } from "@/hooks/useImageLoad";
import { cn } from "@/lib/utils";
import { addCacheBuster } from "@/utils/cacheBuster";
import { generateSrcSet, generateSizes, type ResponsiveSizes } from "@/utils/image-optimizer";

interface OptimizedImageProps {
  src: string;
  srcAvif?: string;
  srcWebp?: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string | ResponsiveSizes;
  className?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  fetchpriority?: "high" | "low" | "auto";
  /** @deprecated use lowercase fetchpriority to avoid React warnings */
  fetchPriority?: "high" | "low" | "auto";
  loading?: "eager" | "lazy";
  aspectRatio?: string; // e.g., '16/9', '4/3'
  generateSrcSet?: boolean; // Auto-generate srcset for responsive images
}

const OptimizedImage = ({
  src,
  srcAvif,
  srcWebp,
  alt,
  width,
  height,
  priority = false,
  sizes = "100vw",
  className,
  objectFit = "cover",
  fetchpriority,
  fetchPriority: fetchPriorityProp = "auto",
  loading,
  aspectRatio,
  generateSrcSet: shouldGenerateSrcSet = false,
}: OptimizedImageProps) => {
  const effectiveFetchPriority = fetchpriority ?? fetchPriorityProp;
  // Add cache-busting for public assets (not Vite-hashed build assets)
  const bustedSrc = useMemo(() => {
    if (src.startsWith('/') && !src.includes('/assets/')) {
      return addCacheBuster(src);
    }
    return src;
  }, [src]);
  
  const bustedSrcAvif = useMemo(() => {
    if (srcAvif && srcAvif.startsWith('/') && !srcAvif.includes('/assets/')) {
      return addCacheBuster(srcAvif);
    }
    return srcAvif;
  }, [srcAvif]);
  
  const bustedSrcWebp = useMemo(() => {
    if (srcWebp && srcWebp.startsWith('/') && !srcWebp.includes('/assets/')) {
      return addCacheBuster(srcWebp);
    }
    return srcWebp;
  }, [srcWebp]);

  const [imgSrc, setImgSrc] = useState(bustedSrc);
  const [hasError, setHasError] = useState(false);
  const { isLoaded, isInView, imageRef } = useImageLoad({
    rootMargin: "50px",
    threshold: 0.01,
  });

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc("/placeholder.svg");
    }
  };

  // For priority images, load immediately
  const shouldLoad = priority || isInView;

  // PHASE 2: Generate srcset for responsive images
  const srcSetValue = useMemo(() => {
    if (shouldGenerateSrcSet && bustedSrc && !bustedSrc.includes('?w=')) {
      return generateSrcSet(bustedSrc);
    }
    return undefined;
  }, [bustedSrc, shouldGenerateSrcSet]);

  // PHASE 2: Generate sizes attribute
  const sizesValue = useMemo(() => {
    if (typeof sizes === 'object') {
      return generateSizes(sizes);
    }
    return sizes;
  }, [sizes]);

  // PHASE 2: Calculate aspect ratio styles
  const containerStyle = useMemo(() => {
    const baseStyle: React.CSSProperties = {
      width: width ? `${width}px` : "100%",
      height: height ? `${height}px` : "100%",
    };

    if (aspectRatio && !height) {
      baseStyle.aspectRatio = aspectRatio;
      baseStyle.height = 'auto';
    }

    return baseStyle;
  }, [width, height, aspectRatio]);

  return (
    <div
      className={cn("relative overflow-hidden bg-muted/20", className)}
      style={containerStyle}
    >
      {/* Placeholder skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 bg-[length:200%_100%]" />
      )}

      {/* Modern image formats with picture element */}
      {shouldLoad && (bustedSrcAvif || bustedSrcWebp) ? (
        <picture>
          {bustedSrcAvif && (
            <source
              type="image/avif"
              srcSet={bustedSrcAvif}
              sizes={sizesValue}
            />
          )}
          {bustedSrcWebp && (
            <source
              type="image/webp"
              srcSet={bustedSrcWebp}
              sizes={sizesValue}
            />
          )}
          <img
            ref={imageRef}
            src={imgSrc}
            alt={alt}
            width={width}
            height={height}
            srcSet={srcSetValue}
            sizes={sizesValue}
            loading={loading || (priority ? "eager" : "lazy")}
            decoding={priority ? "sync" : "async"}
            fetchPriority={effectiveFetchPriority}
            onError={handleError}
            className={cn(
              isLoaded ? "opacity-100" : "opacity-0",
              `object-${objectFit}`,
              "w-full h-full"
            )}
            style={{
              objectFit,
              transition: 'var(--transition-slow)'
            }}
          />
        </picture>
      ) : (
        <img
          ref={imageRef}
          src={shouldLoad ? imgSrc : undefined}
          alt={alt}
          width={width}
          height={height}
          srcSet={srcSetValue}
          sizes={sizesValue}
          loading={loading || (priority ? "eager" : "lazy")}
          decoding={priority ? "sync" : "async"}
          fetchPriority={effectiveFetchPriority}
          onError={handleError}
          className={cn(
            isLoaded ? "opacity-100" : "opacity-0",
            `object-${objectFit}`,
            "w-full h-full"
          )}
          style={{
            objectFit,
            transition: 'var(--transition-slow)'
          }}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
