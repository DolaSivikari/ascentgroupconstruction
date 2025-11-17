import { useState, useEffect, useCallback } from "react";

interface UseCarouselProps {
  totalItems: number;
  autoplayInterval?: number;
  itemsPerView?: number;
}

export const useCarousel = ({ 
  totalItems, 
  autoplayInterval = 0, 
  itemsPerView = 1 
}: UseCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplayInterval > 0);

  const maxIndex = Math.max(0, totalItems - itemsPerView);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(Math.min(Math.max(0, index), maxIndex));
  }, [maxIndex]);

  useEffect(() => {
    if (!isPlaying || autoplayInterval <= 0) return;

    const interval = setInterval(next, autoplayInterval);
    return () => clearInterval(interval);
  }, [isPlaying, autoplayInterval, next]);

  const pause = useCallback(() => setIsPlaying(false), []);
  const play = useCallback(() => setIsPlaying(true), []);

  return {
    currentIndex,
    next,
    prev,
    goToSlide,
    isPlaying,
    pause,
    play,
    canGoNext: currentIndex < maxIndex,
    canGoPrev: currentIndex > 0,
  };
};
