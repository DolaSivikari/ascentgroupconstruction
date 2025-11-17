import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/ui/Button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import {
  Activity,
  Zap,
  Database,
  Image as ImageIcon,
  Loader2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { format } from 'date-fns';
import PerformanceChart from '@/components/admin/PerformanceChart';

interface PerformanceMetric {
  id: string;
  metric_type: string;
  metric_name: string;
  value: number;
  unit: string;
  recorded_at: string;
}

interface OptimizationRecommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'dismissed';
  created_at: string;
}

export default function PerformanceDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>([]);

  useEffect(() => {
    loadPerformanceData();
  }, []);

  const loadPerformanceData = async () => {
    try {
      setLoading(true);

      // Load recent metrics
      const { data: metricsData } = await supabase
        .from('performance_metrics')
        .select('*')
        .gte('recorded_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('recorded_at', { ascending: false })
        .limit(100);

      if (metricsData) setMetrics(metricsData);

      // Load optimization recommendations
      const { data: recsData } = await supabase
        .from('optimization_recommendations')
        .select('*')
        .order('created_at', { ascending: false });

      if (recsData) setRecommendations(recsData as OptimizationRecommendation[]);
    } catch (error: any) {
      console.error('Error loading performance data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load performance data',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRecommendationStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('optimization_recommendations')
        .update({ 
          status,
          resolved_by: status === 'completed' ? (await supabase.auth.getUser()).data.user?.id : null,
          resolved_at: status === 'completed' ? new Date().toISOString() : null,
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Recommendation status updated',
      });

      loadPerformanceData();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    }
  };

  const getWebVital = (name: string) => {
    const filtered = metrics.filter((m) => 
      m.metric_type === 'web-vital' && 
      m.metric_name === name
    );
    if (filtered.length === 0) return null;
    const average = filtered.reduce((sum, m) => sum + m.value, 0) / filtered.length;
    return {
      average,
      count: filtered.length,
      latest: filtered[0]?.value || 0,
      rating: getRating(name, average)
    };
  };

  const getRating = (metricName: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
    const thresholds: Record<string, { good: number; needsImprovement: number }> = {
      'LCP': { good: 2500, needsImprovement: 4000 },
      'FCP': { good: 1800, needsImprovement: 3000 },
      'CLS': { good: 0.1, needsImprovement: 0.25 },
      'INP': { good: 200, needsImprovement: 500 },
      'TTFB': { good: 800, needsImprovement: 1800 },
      'TBT': { good: 200, needsImprovement: 600 },
      'TTI': { good: 3800, needsImprovement: 7300 }
    };
    
    const threshold = thresholds[metricName];
    if (!threshold) return 'good';
    
    if (value <= threshold.good) return 'good';
    if (value <= threshold.needsImprovement) return 'needs-improvement';
    return 'poor';
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'text-green-600 dark:text-green-400';
      case 'needs-improvement': return 'text-yellow-600 dark:text-yellow-400';
      case 'poor': return 'text-red-600 dark:text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  const getRatingIcon = (rating: string) => {
    switch (rating) {
      case 'good': return <TrendingUp className="h-3 w-3" />;
      case 'needs-improvement': return <AlertTriangle className="h-3 w-3" />;
      case 'poor': return <TrendingDown className="h-3 w-3" />;
      default: return null;
    }
  };

  const analyzePerformance = async () => {
    if (analyzing) return;
    
    try {
      setAnalyzing(true);
      
      const { data, error } = await supabase.functions.invoke('analyze-performance', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (error) {
        console.error('Edge function error:', error);
        throw new Error(
          error.message || 
          'Failed to connect to performance analyzer. The function may not be deployed yet.'
        );
      }
      
      toast({
        title: 'Analysis Complete',
        description: data?.message || `Generated ${data?.recommendations || 0} recommendations`,
      });
      
      await loadPerformanceData();
    } catch (error: any) {
      console.error('Performance analysis error:', error);
      
      let description = 'Failed to analyze performance';
      
      if (error.message?.includes('fetch')) {
        description = 'Could not reach the performance analyzer. Please ensure the edge function is deployed.';
      } else if (error.message?.includes('CORS')) {
        description = 'CORS error: Edge function may need to be redeployed.';
      } else if (error.message) {
        description = error.message;
      }
      
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: `${description} Click "Analyze Performance" to retry.`,
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'images': return ImageIcon;
      case 'database': return Database;
      case 'caching': return Zap;
      default: return Activity;
    }
  };

  if (loading) {
    return (
      <AdminPageLayout title="Performance Dashboard" description="Monitor and optimize your site's performance">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminPageLayout>
    );
  }

  const lcp = getWebVital('LCP');
  const fcp = getWebVital('FCP');
  const cls = getWebVital('CLS');
  const inp = getWebVital('INP');
  const ttfb = getWebVital('TTFB');
  const tbt = getWebVital('TBT');
  const tti = getWebVital('TTI');

  return (
    <AdminPageLayout
      title="Performance Dashboard"
      description="Monitor and optimize your site's performance"
      actions={
        <Button 
          variant="outline" 
          onClick={analyzePerformance}
          disabled={analyzing}
        >
          {analyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze Performance'
          )}
        </Button>
      }
    >
      {/* Core Web Vitals */}
      <div className="business-stats-grid" style={{ marginBottom: '2rem' }}>
        {/* LCP */}
        <div className="business-glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)' }}>LCP</span>
            <Clock className="h-4 w-4" style={{ color: 'var(--text-secondary)' }} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            {lcp ? `${(lcp.average).toFixed(0)}ms` : 'N/A'}
          </div>
          {lcp && (
            <p className={`text-xs flex items-center gap-1 ${getRatingColor(lcp.rating)}`}>
              {getRatingIcon(lcp.rating)}
              {lcp.rating === 'good' ? 'Excellent' : lcp.rating === 'needs-improvement' ? 'Fair' : 'Poor'}
              <span style={{ marginLeft: '0.25rem', color: 'var(--text-secondary)' }}>({lcp.count} samples)</span>
            </p>
          )}
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Target: &lt;2.5s</p>
        </div>

        {/* FCP */}
        <div className="business-glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)' }}>FCP</span>
            <Zap className="h-4 w-4" style={{ color: 'var(--text-secondary)' }} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            {fcp ? `${(fcp.average).toFixed(0)}ms` : 'N/A'}
          </div>
          {fcp && (
            <p className={`text-xs flex items-center gap-1 ${getRatingColor(fcp.rating)}`}>
              {getRatingIcon(fcp.rating)}
              {fcp.rating === 'good' ? 'Excellent' : fcp.rating === 'needs-improvement' ? 'Fair' : 'Poor'}
              <span style={{ marginLeft: '0.25rem', color: 'var(--text-secondary)' }}>({fcp.count} samples)</span>
            </p>
          )}
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Target: &lt;1.8s</p>
        </div>

        {/* CLS */}
        <div className="business-glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)' }}>CLS</span>
            <Activity className="h-4 w-4" style={{ color: 'var(--text-secondary)' }} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            {cls ? `${(cls.average / 1000).toFixed(3)}` : 'N/A'}
          </div>
          {cls && (
            <p className={`text-xs flex items-center gap-1 ${getRatingColor(cls.rating)}`}>
              {getRatingIcon(cls.rating)}
              {cls.rating === 'good' ? 'Excellent' : cls.rating === 'needs-improvement' ? 'Fair' : 'Poor'}
              <span style={{ marginLeft: '0.25rem', color: 'var(--text-secondary)' }}>({cls.count} samples)</span>
            </p>
          )}
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Target: &lt;0.1</p>
        </div>

        {/* INP */}
        <div className="business-glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)' }}>INP</span>
            <Activity className="h-4 w-4" style={{ color: 'var(--text-secondary)' }} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            {inp ? `${(inp.average).toFixed(0)}ms` : 'N/A'}
          </div>
          {inp && (
            <p className={`text-xs flex items-center gap-1 ${getRatingColor(inp.rating)}`}>
              {getRatingIcon(inp.rating)}
              {inp.rating === 'good' ? 'Excellent' : inp.rating === 'needs-improvement' ? 'Fair' : 'Poor'}
              <span style={{ marginLeft: '0.25rem', color: 'var(--text-secondary)' }}>({inp.count} samples)</span>
            </p>
          )}
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Target: &lt;200ms</p>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {/* TTFB */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TTFB</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ttfb ? `${(ttfb.average).toFixed(0)}ms` : 'N/A'}
            </div>
            {ttfb && (
              <p className={`text-xs flex items-center gap-1 ${getRatingColor(ttfb.rating)}`}>
                {getRatingIcon(ttfb.rating)}
                {ttfb.rating === 'good' ? 'Excellent' : ttfb.rating === 'needs-improvement' ? 'Fair' : 'Poor'}
                <span className="text-muted-foreground ml-1">({ttfb.count} samples)</span>
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">Target: &lt;800ms</p>
          </CardContent>
        </Card>

        {/* TBT */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TBT</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tbt ? `${(tbt.average).toFixed(0)}ms` : 'N/A'}
            </div>
            {tbt && (
              <p className={`text-xs flex items-center gap-1 ${getRatingColor(tbt.rating)}`}>
                {getRatingIcon(tbt.rating)}
                {tbt.rating === 'good' ? 'Excellent' : tbt.rating === 'needs-improvement' ? 'Fair' : 'Poor'}
                <span className="text-muted-foreground ml-1">({tbt.count} samples)</span>
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">Target: &lt;200ms</p>
          </CardContent>
        </Card>

        {/* TTI */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TTI</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tti ? `${(tti.average).toFixed(0)}ms` : 'N/A'}
            </div>
            {tti && (
              <p className={`text-xs flex items-center gap-1 ${getRatingColor(tti.rating)}`}>
                {getRatingIcon(tti.rating)}
                {tti.rating === 'good' ? 'Excellent' : tti.rating === 'needs-improvement' ? 'Fair' : 'Poor'}
                <span className="text-muted-foreground ml-1">({tti.count} samples)</span>
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">Target: &lt;3.8s</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trends */}
      {metrics.length > 0 && (
        <div className="mb-6">
          <PerformanceChart metrics={metrics} />
        </div>
      )}

      {/* Optimization Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Optimization Recommendations</CardTitle>
          <CardDescription>Actions to improve your site's performance</CardDescription>
        </CardHeader>
        <CardContent>
          {recommendations.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <p className="text-lg font-medium">All optimizations complete!</p>
              <p className="text-muted-foreground">Your site is performing optimally</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map((rec) => {
                const Icon = getCategoryIcon(rec.category);
                return (
                  <div key={rec.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <Icon className="h-6 w-6 text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{rec.title}</h3>
                        <Badge variant={getPriorityColor(rec.priority) as any}>
                          {rec.priority}
                        </Badge>
                        <Badge variant="outline">{rec.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(rec.created_at), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {rec.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateRecommendationStatus(rec.id, 'in_progress')}
                        >
                          Start
                        </Button>
                      )}
                      {rec.status === 'in_progress' && (
                        <Button
                          size="sm"
                          onClick={() => updateRecommendationStatus(rec.id, 'completed')}
                        >
                          Complete
                        </Button>
                      )}
                      {rec.status !== 'dismissed' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateRecommendationStatus(rec.id, 'dismissed')}
                        >
                          Dismiss
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Metrics */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Performance Metrics</CardTitle>
          <CardDescription>Last 100 recorded measurements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {metrics.map((metric) => (
              <div key={metric.id} className="flex items-center justify-between p-2 border rounded text-sm">
                <div>
                  <span className="font-medium">{metric.metric_name}</span>
                  <span className="text-muted-foreground ml-2">({metric.metric_type})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono">
                    {metric.value.toFixed(2)} {metric.unit}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(metric.recorded_at), 'HH:mm:ss')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminPageLayout>
  );
}
