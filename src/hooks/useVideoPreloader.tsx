import { useState, useEffect, useRef } from 'react';

interface UseVideoPreloaderProps {
  videoUrls: string[];
  currentIndex: number;
  prefetchCount?: number;
}

interface UseVideoPreloaderReturn {
  getVideoUrl: (url: string) => string;
  isPreloaded: (url: string) => boolean;
}

/**
 * Hook to preload videos for smooth transitions
 * Preloads current video + adjacent videos based on prefetchCount
 */
export function useVideoPreloader({
  videoUrls,
  currentIndex,
  prefetchCount = 2
}: UseVideoPreloaderProps): UseVideoPreloaderReturn {
  const [preloadedUrls, setPreloadedUrls] = useState<Set<string>>(new Set());
  const videoElementsRef = useRef<Map<string, HTMLVideoElement>>(new Map());

  useEffect(() => {
    // Calculate which videos to preload
    const urlsToPreload: string[] = [];
    
    // Add current video
    if (videoUrls[currentIndex]) {
      urlsToPreload.push(videoUrls[currentIndex]);
    }
    
    // Add videos ahead
    for (let i = 1; i <= prefetchCount; i++) {
      const nextIndex = (currentIndex + i) % videoUrls.length;
      if (videoUrls[nextIndex]) {
        urlsToPreload.push(videoUrls[nextIndex]);
      }
    }
    
    // Add one video behind
    const prevIndex = (currentIndex - 1 + videoUrls.length) % videoUrls.length;
    if (videoUrls[prevIndex]) {
      urlsToPreload.push(videoUrls[prevIndex]);
    }

    // Preload videos
    urlsToPreload.forEach(url => {
      if (!videoElementsRef.current.has(url)) {
        const video = document.createElement('video');
        video.src = url;
        video.preload = 'auto';
        video.muted = true;
        videoElementsRef.current.set(url, video);

        // Mark as preloaded when ready
        video.addEventListener('loadeddata', () => {
          setPreloadedUrls(prev => new Set(prev).add(url));
        });
      }
    });

    // Cleanup old videos that are far from current index
    videoElementsRef.current.forEach((video, url) => {
      if (!urlsToPreload.includes(url)) {
        video.src = '';
        videoElementsRef.current.delete(url);
        setPreloadedUrls(prev => {
          const newSet = new Set(prev);
          newSet.delete(url);
          return newSet;
        });
      }
    });
  }, [currentIndex, videoUrls, prefetchCount]);

  const getVideoUrl = (url: string): string => {
    return url;
  };

  const isPreloaded = (url: string): boolean => {
    return preloadedUrls.has(url);
  };

  return { getVideoUrl, isPreloaded };
}
