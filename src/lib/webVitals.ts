import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals';
import { supabase } from '@/integrations/supabase/client';

// Performance metrics storage for enhanced tracking
interface PerformanceMetrics {
  [key: string]: {
    value: number;
    rating: string;
    timestamp: number;
  };
}

const performanceMetrics: PerformanceMetrics = {};

// Batch queue for metrics
let metricsQueue: any[] = [];
let flushTimeout: any;

// Log metrics to database with batching
const logToDatabase = async (metric: any) => {
  // In production: default OFF (requires explicit enable). In dev: default ON (requires explicit disable)
  const enableTracking = import.meta.env.PROD 
    ? import.meta.env.VITE_ENABLE_PERFORMANCE_TRACKING === 'true'
    : import.meta.env.VITE_ENABLE_PERFORMANCE_TRACKING !== 'false';
  if (!enableTracking) return;
  
  // Verify we have a valid session before attempting to write
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    console.log('[Web Vitals] Skipping metric logging - no authenticated session');
    return;
  }
  
  const metricData = {
    metric_type: 'web-vital',
    metric_name: metric.name,
    value: metric.value,
    unit: metric.name === 'CLS' ? 'score' : 'ms',
    metadata: {
      id: metric.id,
      rating: metric.rating,
      navigationType: metric.navigationType,
      page_path: window.location.pathname,
      environment: import.meta.env.MODE
    }
  };
  
  queueMetric(metricData);
};

const queueMetric = (metricData: any) => {
  metricsQueue.push(metricData);
  
  // Flush after 5 seconds or when 10 metrics collected
  clearTimeout(flushTimeout);
  if (metricsQueue.length >= 10) {
    flushMetrics();
  } else {
    flushTimeout = setTimeout(flushMetrics, 5000);
  }
};

const flushMetrics = async () => {
  if (metricsQueue.length === 0) return;
  
  const batch = [...metricsQueue];
  metricsQueue = [];
  
  try {
    await supabase.from('performance_metrics').insert(batch);
    console.log(`[Web Vitals] Flushed ${batch.length} metrics to database`);
  } catch (error) {
    console.error('Failed to flush metrics:', error);
    // Re-queue failed metrics
    metricsQueue.push(...batch);
  }
};

// Send Web Vitals metrics to Google Analytics
const sendToAnalytics = (metric: any) => {
  // Store metric for analysis
  performanceMetrics[metric.name] = {
    value: metric.value,
    rating: metric.rating,
    timestamp: Date.now(),
  };
  
  // Log to database
  logToDatabase(metric);

  // Check if gtag is available
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }

  // Log to console in development
  if (import.meta.env.DEV) {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      timestamp: new Date().toISOString(),
    });
  }

  // Alert on poor performance
  if (metric.rating === 'poor') {
    console.warn(`⚠️ Poor ${metric.name} performance detected:`, metric.value);
  }
};

// Calculate Total Blocking Time (TBT) - approximation
const calculateTBT = () => {
  if (typeof window !== 'undefined' && (window as any).performance) {
    const perfEntries = (window as any).performance.getEntriesByType('measure');
    let tbt = 0;
    
    perfEntries.forEach((entry: any) => {
      if (entry.duration > 50) {
        tbt += entry.duration - 50;
      }
    });

    const tbtMetric = {
      name: 'TBT',
      value: tbt,
      rating: tbt < 200 ? 'good' : tbt < 600 ? 'needs-improvement' : 'poor',
      id: `tbt-${Date.now()}`,
    };

    sendToAnalytics(tbtMetric);
  }
};

// Calculate Time to Interactive (TTI) - approximation
const calculateTTI = () => {
  if (typeof window !== 'undefined' && (window as any).performance) {
    const navTiming = (window as any).performance.timing;
    const tti = navTiming.domInteractive - navTiming.navigationStart;

    const ttiMetric = {
      name: 'TTI',
      value: tti,
      rating: tti < 3800 ? 'good' : tti < 7300 ? 'needs-improvement' : 'poor',
      id: `tti-${Date.now()}`,
    };

    sendToAnalytics(ttiMetric);
  }
};

export const reportWebVitals = () => {
  // Core Web Vitals
  onCLS(sendToAnalytics);  // Cumulative Layout Shift
  onINP(sendToAnalytics);  // Interaction to Next Paint
  onLCP(sendToAnalytics);  // Largest Contentful Paint
  
  // Additional Core Metrics
  onFCP(sendToAnalytics);  // First Contentful Paint
  onTTFB(sendToAnalytics); // Time to First Byte
  
  // Calculate additional metrics after page load
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      setTimeout(() => {
        calculateTBT();
        calculateTTI();
      }, 3000); // Wait 3s after load for accurate measurements
    });
  }
};

// Export metrics for debugging
export const getPerformanceMetrics = () => performanceMetrics;
