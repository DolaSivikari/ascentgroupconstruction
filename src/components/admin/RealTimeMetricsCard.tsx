import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MetricData {
  value: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'neutral';
  sparklineData: number[];
}

interface RealTimeMetricsCardProps {
  title: string;
  table: string;
  icon: React.ElementType;
  description?: string;
  statusField?: string;
  statusFilter?: string;
  refreshInterval?: number;
}

export const RealTimeMetricsCard = ({
  title,
  table,
  icon: Icon,
  description,
  statusField,
  statusFilter,
  refreshInterval = 30000,
}: RealTimeMetricsCardProps) => {
  const [metric, setMetric] = useState<MetricData>({
    value: 0,
    change: 0,
    changePercent: 0,
    trend: 'neutral',
    sparklineData: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadMetric = useCallback(async () => {
    try {
      let query = supabase.from(table as any).select('*', { count: 'exact', head: true });

      if (statusField && statusFilter) {
        query = query.eq(statusField, statusFilter);
      }

      const { count, error } = await query;

      if (error) throw error;

      const currentValue = count || 0;

      setMetric((prev) => {
        // Calculate change
        const previousValue = prev.value > 0 ? prev.value : currentValue;
        const change = currentValue - previousValue;
        const changePercent = previousValue > 0 ? (change / previousValue) * 100 : 0;

        // Update sparkline data
        const newSparklineData = [...prev.sparklineData, currentValue].slice(-7);

        return {
          value: currentValue,
          change,
          changePercent,
          trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
          sparklineData: newSparklineData,
        };
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading metric:', error);
      setIsLoading(false);
    }
  }, [table, statusField, statusFilter]);

  useEffect(() => {
    loadMetric();

    // Set up real-time subscription
    const channel = supabase
      .channel(`${table}-metrics-${Math.random()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
        },
        () => {
          loadMetric();
        }
      )
      .subscribe();

    // Periodic refresh
    const interval = setInterval(loadMetric, refreshInterval);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [table, refreshInterval, loadMetric]);

  const getTrendIcon = () => {
    switch (metric.trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = () => {
    switch (metric.trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              {description && (
                <CardDescription className="text-xs mt-1">{description}</CardDescription>
              )}
            </div>
          </div>
          {metric.trend !== 'neutral' && (
            <Badge variant={metric.trend === 'up' ? 'default' : 'destructive'} className="text-xs">
              {getTrendIcon()}
              <span className="ml-1">{Math.abs(metric.changePercent).toFixed(1)}%</span>
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">
              {isLoading ? '—' : metric.value.toLocaleString()}
            </span>
            {metric.change !== 0 && (
              <span className={`text-sm font-medium ${getTrendColor()}`}>
                {metric.change > 0 ? '+' : ''}
                {metric.change}
              </span>
            )}
          </div>

          {/* Mini sparkline */}
          {metric.sparklineData.length > 1 && (
            <div className="h-12 flex items-end gap-1">
              {metric.sparklineData.map((value, index) => {
                const maxValue = Math.max(...metric.sparklineData);
                const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
                return (
                  <div
                    key={index}
                    className="flex-1 bg-primary/20 rounded-t transition-all"
                    style={{ height: `${height}%`, minHeight: '4px' }}
                  />
                );
              })}
            </div>
          )}
        </div>
      </CardContent>

      {/* Animated pulse indicator for real-time updates */}
      <div className="absolute top-2 right-2">
        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
      </div>
    </Card>
  );
};
