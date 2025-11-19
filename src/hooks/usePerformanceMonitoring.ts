import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

/**
 * Performance monitoring hook
 * Tracks Core Web Vitals and logs to console in development
 */
export const usePerformanceMonitoring = (pageName: string) => {
  const metricsRef = useRef<Partial<PerformanceMetrics>>({});
  const hasLoggedRef = useRef(false);

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    const logMetrics = () => {
      if (hasLoggedRef.current) return;
      hasLoggedRef.current = true;

      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (perfData) {
        const metrics = {
          ttfb: perfData.responseStart - perfData.requestStart,
          domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
          loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
          totalLoadTime: perfData.loadEventEnd - perfData.fetchStart,
        };

        console.group(`📊 Performance Metrics - ${pageName}`);
        console.log('⚡ TTFB:', `${metrics.ttfb.toFixed(2)}ms`);
        console.log('📄 DOM Content Loaded:', `${metrics.domContentLoaded.toFixed(2)}ms`);
        console.log('✅ Load Complete:', `${metrics.loadComplete.toFixed(2)}ms`);
        console.log('🏁 Total Load Time:', `${metrics.totalLoadTime.toFixed(2)}ms`);
        console.groupEnd();

        // Performance targets
        const targets = {
          ttfb: 600, // Should be < 600ms
          totalLoadTime: 3000, // Should be < 3s
        };

        if (metrics.ttfb > targets.ttfb) {
          console.warn(`⚠️ TTFB is high (${metrics.ttfb.toFixed(0)}ms > ${targets.ttfb}ms)`);
        }
        if (metrics.totalLoadTime > targets.totalLoadTime) {
          console.warn(`⚠️ Total load time is high (${metrics.totalLoadTime.toFixed(0)}ms > ${targets.totalLoadTime}ms)`);
        }
      }
    };

    // Log metrics when page is fully loaded
    if (document.readyState === 'complete') {
      logMetrics();
    } else {
      window.addEventListener('load', logMetrics);
    }

    return () => {
      window.removeEventListener('load', logMetrics);
    };
  }, [pageName]);

  return metricsRef.current;
};
