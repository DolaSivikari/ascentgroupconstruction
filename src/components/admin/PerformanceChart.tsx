import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format } from 'date-fns';

interface PerformanceMetric {
  id: string;
  metric_type: string;
  metric_name: string;
  value: number;
  unit: string;
  recorded_at: string;
}

interface PerformanceChartProps {
  metrics: PerformanceMetric[];
}

export default function PerformanceChart({ metrics }: PerformanceChartProps) {
  const chartData = useMemo(() => {
    // Group metrics by day
    const grouped = metrics.reduce((acc, metric) => {
      const date = format(new Date(metric.recorded_at), 'MMM dd');
      
      if (!acc[date]) {
        acc[date] = {
          date,
          LCP: [],
          FCP: [],
          CLS: [],
          INP: [],
          TTFB: [],
          TBT: [],
          TTI: []
        };
      }
      
      if (metric.metric_type === 'web-vital' && acc[date][metric.metric_name]) {
        acc[date][metric.metric_name].push(metric.value);
      }
      
      return acc;
    }, {} as any);

    // Calculate averages
    return Object.values(grouped).map((day: any) => ({
      date: day.date,
      LCP: day.LCP.length ? day.LCP.reduce((a: number, b: number) => a + b, 0) / day.LCP.length : null,
      FCP: day.FCP.length ? day.FCP.reduce((a: number, b: number) => a + b, 0) / day.FCP.length : null,
      CLS: day.CLS.length ? (day.CLS.reduce((a: number, b: number) => a + b, 0) / day.CLS.length) / 1000 : null,
      INP: day.INP.length ? day.INP.reduce((a: number, b: number) => a + b, 0) / day.INP.length : null,
      TTFB: day.TTFB.length ? day.TTFB.reduce((a: number, b: number) => a + b, 0) / day.TTFB.length : null,
      TBT: day.TBT.length ? day.TBT.reduce((a: number, b: number) => a + b, 0) / day.TBT.length : null,
      TTI: day.TTI.length ? day.TTI.reduce((a: number, b: number) => a + b, 0) / day.TTI.length : null,
    }));
  }, [metrics]);

  return (
    <div className="space-y-6">
      {/* Core Web Vitals Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Core Web Vitals Trends</CardTitle>
          <CardDescription>Performance metrics over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))' 
                }}
              />
              <Legend />
              <ReferenceLine y={2500} stroke="hsl(var(--destructive))" strokeDasharray="3 3" label="LCP Target" />
              <Line type="monotone" dataKey="LCP" stroke="hsl(var(--primary))" name="LCP (ms)" strokeWidth={2} />
              <Line type="monotone" dataKey="FCP" stroke="hsl(var(--chart-2))" name="FCP (ms)" strokeWidth={2} />
              <Line type="monotone" dataKey="INP" stroke="hsl(var(--chart-3))" name="INP (ms)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Layout Stability */}
      <Card>
        <CardHeader>
          <CardTitle>Layout Stability (CLS)</CardTitle>
          <CardDescription>Lower is better - measures visual stability</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))' 
                }}
              />
              <Legend />
              <ReferenceLine y={0.1} stroke="hsl(var(--destructive))" strokeDasharray="3 3" label="Target" />
              <Line type="monotone" dataKey="CLS" stroke="hsl(var(--chart-4))" name="CLS" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Server Response Time */}
      <Card>
        <CardHeader>
          <CardTitle>Server Response & Load Time</CardTitle>
          <CardDescription>TTFB, TBT, and TTI metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))' 
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="TTFB" stroke="hsl(var(--chart-1))" name="TTFB (ms)" strokeWidth={2} />
              <Line type="monotone" dataKey="TBT" stroke="hsl(var(--chart-5))" name="TBT (ms)" strokeWidth={2} />
              <Line type="monotone" dataKey="TTI" stroke="hsl(var(--accent))" name="TTI (ms)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
