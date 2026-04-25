import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
import { Card } from "@/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, AlertCircle, TrendingUp, Zap } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function Monitoring() {
  const { data: errorLogs, isLoading: errorsLoading } = useQuery({
    queryKey: ["error-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("error_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data || [];
    },
  });

  const { data: performanceMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["performance-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("performance_metrics")
        .select("*")
        .order("recorded_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data || [];
    },
  });

  const todayErrors = errorLogs?.filter(log =>
    new Date(log.created_at).toDateString() === new Date().toDateString()
  ).length || 0;

  const avgMetric = (metricName: string) => {
    const metrics = performanceMetrics?.filter(m => m.metric_name === metricName);
    if (!metrics || metrics.length === 0) return 0;
    return (metrics.reduce((sum, m) => sum + Number(m.value), 0) / metrics.length).toFixed(2);
  };

  return (
    <AdminPageLayout
      title="📊 System Monitoring"
      description="Real-time performance metrics and error tracking"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <AlertCircle className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Errors</p>
                <p className="text-2xl font-bold">{errorLogs?.length || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Errors</p>
                <p className="text-2xl font-bold">{todayErrors}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Activity className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Load Time</p>
                <p className="text-2xl font-bold">{avgMetric("page_load")}ms</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[hsl(var(--steel-blue)/0.1)] rounded-lg">
                <Zap className="h-5 w-5 text-[hsl(var(--steel-blue))]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">System Status</p>
                <Badge variant="success" className="mt-1">Healthy</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Error Logs */}
        <Card>
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-danger" />
              <h3 className="text-lg font-semibold">Recent Errors</h3>
            </div>
            <p className="text-sm text-muted-foreground">Client-side and server errors</p>
          </div>
          <div className="overflow-x-auto">
            {errorsLoading ? (
              <div className="p-6 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : errorLogs && errorLogs.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Error Message</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>User Agent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {errorLogs.slice(0, 20).map((error) => (
                    <TableRow key={error.id}>
                      <TableCell className="text-sm whitespace-nowrap">
                        {format(new Date(error.created_at), "MMM dd, HH:mm:ss")}
                      </TableCell>
                      <TableCell className="font-mono text-xs max-w-[300px] truncate">
                        {error.message}
                      </TableCell>
                      <TableCell className="text-xs max-w-[200px] truncate">
                        {error.url || "N/A"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                        {error.user_agent || "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-12 text-center text-muted-foreground">
                No errors logged
              </div>
            )}
          </div>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Performance Metrics</h3>
            </div>
            <p className="text-sm text-muted-foreground">Application performance data</p>
          </div>
          <div className="overflow-x-auto">
            {metricsLoading ? (
              <div className="p-6 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : performanceMetrics && performanceMetrics.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Metric Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Unit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {performanceMetrics.slice(0, 20).map((metric) => (
                    <TableRow key={metric.id}>
                      <TableCell className="text-sm whitespace-nowrap">
                        {format(new Date(metric.recorded_at), "MMM dd, HH:mm:ss")}
                      </TableCell>
                      <TableCell className="font-medium">{metric.metric_name}</TableCell>
                      <TableCell>
                        <Badge variant="info">{metric.metric_type}</Badge>
                      </TableCell>
                      <TableCell className="font-mono">{Number(metric.value).toFixed(2)}</TableCell>
                      <TableCell className="text-muted-foreground">{metric.unit || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-12 text-center text-muted-foreground">
                No performance metrics recorded
              </div>
            )}
          </div>
        </Card>
      </div>
    </AdminPageLayout>
  );
}
