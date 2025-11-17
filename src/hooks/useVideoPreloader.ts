import { useState, useEffect, useRef } from 'react';

interface VideoCache {
  [url: string]: string; // Maps video URL to blob URL
}

interface UseVideoPreloaderOptions {
  videoUrls: string[];
  currentIndex: number;
  prefetchCount?: number; // How many videos ahead to prefetch
}

export const useVideoPreloader = ({ 
  videoUrls, 
  currentIndex, 
  prefetchCount = 2 
}: UseVideoPreloaderOptions) => {
  const [cache, setCache] = useState<VideoCache>({});
  const [loadingUrls, setLoadingUrls] = useState<Set<string>>(new Set());
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());

  // Prefetch a single video
  const prefetchVideo = async (url: string) => {
    // Skip if already cached or currently loading
    if (cache[url] || loadingUrls.has(url)) {
      return;
    }

    // Create abort controller for this request
    const controller = new AbortController();
    abortControllersRef.current.set(url, controller);

    setLoadingUrls(prev => new Set(prev).add(url));

    try {
      const response = await fetch(url, { 
        signal: controller.signal,
        // Use no-cors if needed, but prefer same-origin for better control
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch video: ${response.statusText}`);
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      setCache(prev => ({ ...prev, [url]: blobUrl }));
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Fetch was aborted, ignore
        return;
      }
      console.warn(`Failed to prefetch video ${url}:`, error);
    } finally {
      setLoadingUrls(prev => {
        const next = new Set(prev);
        next.delete(url);
        return next;
      });
      abortControllersRef.current.delete(url);
    }
  };

  // Get URLs to prefetch based on current index
  const getUrlsToPrefetch = (index: number): string[] => {
    const urls: string[] = [];
    const uniqueUrls = new Set<string>();

    // Add current video
    if (videoUrls[index]) {
      uniqueUrls.add(videoUrls[index]);
    }

    // Add next videos (with wrap-around)
    for (let i = 1; i <= prefetchCount; i++) {
      const nextIndex = (index + i) % videoUrls.length;
      if (videoUrls[nextIndex]) {
        uniqueUrls.add(videoUrls[nextIndex]);
      }
    }

    // Add previous video (for back navigation)
    const prevIndex = (index - 1 + videoUrls.length) % videoUrls.length;
    if (videoUrls[prevIndex]) {
      uniqueUrls.add(videoUrls[prevIndex]);
    }

    return Array.from(uniqueUrls);
  };

  // Prefetch videos when currentIndex changes
  useEffect(() => {
    const urlsToPrefetch = getUrlsToPrefetch(currentIndex);

    // Start prefetching
    urlsToPrefetch.forEach(url => {
      prefetchVideo(url);
    });

    // Cleanup: abort any fetches for URLs we no longer need
    return () => {
      const urlsToKeep = new Set(urlsToPrefetch);
      abortControllersRef.current.forEach((controller, url) => {
        if (!urlsToKeep.has(url)) {
          controller.abort();
        }
      });
    };
  }, [currentIndex, videoUrls]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(cache).forEach(blobUrl => {
        URL.revokeObjectURL(blobUrl);
      });
    };
  }, []);

  // Get the cached (or original) URL for a video
  const getVideoUrl = (originalUrl: string): string => {
    return cache[originalUrl] || originalUrl;
  };

  // Check if a video is preloaded
  const isPreloaded = (url: string): boolean => {
    return !!cache[url];
  };

  // Check if a video is currently loading
  const isLoading = (url: string): boolean => {
    return loadingUrls.has(url);
  };

  return {
    getVideoUrl,
    isPreloaded,
    isLoading,
    preloadedCount: Object.keys(cache).length,
  };
};
