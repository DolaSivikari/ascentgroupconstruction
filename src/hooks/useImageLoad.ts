import { useEffect, useState, useRef, RefObject } from "react";

interface UseImageLoadOptions {
  rootMargin?: string;
  threshold?: number;
}

interface UseImageLoadReturn {
  isLoaded: boolean;
  isInView: boolean;
  imageRef: RefObject<HTMLImageElement>;
}

export const useImageLoad = (
  options: UseImageLoadOptions = {}
): UseImageLoadReturn => {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const element = imageRef.current;
    if (!element) return;

    // Create intersection observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(element);
        }
      },
      {
        rootMargin: options.rootMargin || "50px",
        threshold: options.threshold || 0.01,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [options.rootMargin, options.threshold]);

  useEffect(() => {
    const element = imageRef.current;
    if (!element || !isInView) return;

    const handleLoad = () => setIsLoaded(true);
    
    if (element.complete) {
      setIsLoaded(true);
    } else {
      element.addEventListener("load", handleLoad);
      return () => element.removeEventListener("load", handleLoad);
    }
  }, [isInView]);

  return { isLoaded, isInView, imageRef };
};
