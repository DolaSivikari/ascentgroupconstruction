import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebVitalThresholds {
  good: number;
  needsImprovement: number;
}

const thresholds: Record<string, WebVitalThresholds> = {
  'LCP': { good: 2500, needsImprovement: 4000 },
  'FCP': { good: 1800, needsImprovement: 3000 },
  'CLS': { good: 0.1, needsImprovement: 0.25 },
  'INP': { good: 200, needsImprovement: 500 },
  'TTFB': { good: 800, needsImprovement: 1800 },
  'TBT': { good: 200, needsImprovement: 600 },
  'TTI': { good: 3800, needsImprovement: 7300 }
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('[Analyze Performance] Starting analysis...');

    // Get metrics from last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    
    const { data: metrics, error: metricsError } = await supabase
      .from('performance_metrics')
      .select('*')
      .eq('metric_type', 'web-vital')
      .gte('recorded_at', sevenDaysAgo);

    if (metricsError) throw metricsError;

    console.log(`[Analyze Performance] Found ${metrics?.length || 0} metrics`);

    const recommendations: any[] = [];

    // Analyze each Web Vital
    for (const [metricName, threshold] of Object.entries(thresholds)) {
      const metricData = metrics?.filter(m => m.metric_name === metricName) || [];
      
      if (metricData.length === 0) continue;

      const avgValue = metricData.reduce((sum, m) => sum + m.value, 0) / metricData.length;
      const rating = avgValue <= threshold.good ? 'good' : avgValue <= threshold.needsImprovement ? 'needs-improvement' : 'poor';

      console.log(`[Analyze Performance] ${metricName}: ${avgValue.toFixed(2)} (${rating})`);

      // Generate recommendations for poor or needs-improvement metrics
      if (rating !== 'good') {
        const priority = rating === 'poor' ? 'critical' : 'high';
        
        const rec = generateRecommendation(metricName, avgValue, threshold, priority);
        if (rec) recommendations.push(rec);
      }
    }

    console.log(`[Analyze Performance] Generated ${recommendations.length} recommendations`);

    // Clear old auto-generated recommendations before inserting new ones
    await supabase
      .from('optimization_recommendations')
      .delete()
      .eq('status', 'pending')
      .like('description', '%auto-generated%');

    // Insert new recommendations
    if (recommendations.length > 0) {
      const { error: insertError } = await supabase
        .from('optimization_recommendations')
        .insert(recommendations);

      if (insertError) throw insertError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        recommendations: recommendations.length,
        message: recommendations.length > 0 
          ? `Generated ${recommendations.length} optimization recommendations`
          : 'All metrics are performing well!'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('[Analyze Performance] Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateRecommendation(
  metricName: string, 
  avgValue: number, 
  threshold: WebVitalThresholds,
  priority: string
): any {
  const recommendations: Record<string, any> = {
    'LCP': {
      category: 'images',
      title: 'Optimize Largest Contentful Paint (LCP)',
      description: `Your LCP is ${avgValue.toFixed(0)}ms (target: <2500ms). Consider: lazy loading images, optimizing hero images, using modern image formats (WebP/AVIF), implementing CDN, and preloading critical resources. [auto-generated]`,
    },
    'FCP': {
      category: 'caching',
      title: 'Improve First Contentful Paint (FCP)',
      description: `Your FCP is ${avgValue.toFixed(0)}ms (target: <1800ms). Consider: reducing server response time, eliminating render-blocking resources, minifying CSS/JS, and using browser caching. [auto-generated]`,
    },
    'CLS': {
      category: 'layout',
      title: 'Fix Cumulative Layout Shift (CLS)',
      description: `Your CLS is ${(avgValue / 1000).toFixed(3)} (target: <0.1). Consider: adding width/height to images, reserving space for ads/embeds, avoiding injecting content above existing content, and using CSS aspect-ratio. [auto-generated]`,
    },
    'INP': {
      category: 'javascript',
      title: 'Optimize Interaction to Next Paint (INP)',
      description: `Your INP is ${avgValue.toFixed(0)}ms (target: <200ms). Consider: breaking up long tasks, debouncing input handlers, optimizing JavaScript execution, and using web workers for heavy computations. [auto-generated]`,
    },
    'TTFB': {
      category: 'database',
      title: 'Reduce Time to First Byte (TTFB)',
      description: `Your TTFB is ${avgValue.toFixed(0)}ms (target: <800ms). Consider: optimizing database queries, implementing server-side caching, using a CDN, reducing server processing time, and upgrading hosting. [auto-generated]`,
    },
    'TBT': {
      category: 'javascript',
      title: 'Minimize Total Blocking Time (TBT)',
      description: `Your TBT is ${avgValue.toFixed(0)}ms (target: <200ms). Consider: code splitting, removing unused JavaScript, optimizing third-party scripts, and deferring non-critical JS. [auto-generated]`,
    },
    'TTI': {
      category: 'javascript',
      title: 'Improve Time to Interactive (TTI)',
      description: `Your TTI is ${avgValue.toFixed(0)}ms (target: <3800ms). Consider: minimizing main thread work, reducing JavaScript execution time, code splitting, and optimizing resource loading. [auto-generated]`,
    }
  };

  const base = recommendations[metricName];
  if (!base) return null;

  return {
    ...base,
    priority,
    status: 'pending'
  };
}
