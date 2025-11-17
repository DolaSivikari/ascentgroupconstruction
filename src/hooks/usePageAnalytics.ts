import { useEffect, useRef } from 'react';
import { trackScrollDepth, trackTimeOnPage } from '@/lib/analytics';

export const usePageAnalytics = (pageName: string) => {
  const scrollDepthsTracked = useRef<Set<number>>(new Set());
  const pageStartTime = useRef<number>(Date.now());

  useEffect(() => {
    // Track scroll depth
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const scrollPercentage = Math.round((scrolled / documentHeight) * 100);

      // Track at 25%, 50%, 75%, 100%
      [25, 50, 75, 100].forEach(milestone => {
        if (scrollPercentage >= milestone && !scrollDepthsTracked.current.has(milestone)) {
          scrollDepthsTracked.current.add(milestone);
          trackScrollDepth(milestone);
        }
      });
    };

    // Track time on page milestones (30s, 60s, 120s)
    const timeIntervals = [30, 60, 120];
    const timers = timeIntervals.map(seconds => 
      setTimeout(() => {
        const actualTime = Math.round((Date.now() - pageStartTime.current) / 1000);
        trackTimeOnPage(pageName, actualTime);
      }, seconds * 1000)
    );

    // Track on page unload
    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - pageStartTime.current) / 1000);
      trackTimeOnPage(pageName, timeSpent);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Initial scroll check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      timers.forEach(clearTimeout);
    };
  }, [pageName]);
};
