import { useState } from "react";
import { Input } from "@/ui/Input";
import { ActivityTabs } from "@/components/admin/ActivityTabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
import { Card } from "@/ui/Card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Activity, AlertCircle, TrendingUp, Zap } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/ui/Button";
import { adminErrorMessage } from "@/lib/admin/editorValues";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteHealthWorkspace } from "@/components/admin/SiteHealthWorkspace";

export default function Monitoring() {
  const performanceEnabled =
    import.meta.env.VITE_ENABLE_PERFORMANCE_TRACKING === "true";
  const [errorSearch, setErrorSearch] = useState("");
  const [groupErrors, setGroupErrors] = useState(true);
  const [errorPeriod, setErrorPeriod] = useState("7");

  const {
    data: errorLogs,
    isLoading: errorsLoading,
    error: logsError,
    refetch: refreshLogs,
  } = useQuery({
    queryKey: ["error-logs", errorPeriod],
    queryFn: async () => {
      let query = supabase
        .from("error_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (errorPeriod !== "all") {
        query = query.gte(
          "created_at",
          new Date(
            Date.now() - Number(errorPeriod) * 24 * 60 * 60 * 1000,
          ).toISOString(),
        );
      }
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const {
    data: performanceMetrics,
    isLoading: metricsLoading,
    error: metricsError,
    refetch: refreshMetrics,
  } = useQuery({
    queryKey: ["performance-metrics"],
    enabled: performanceEnabled,
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

  const {
    data: dayErrors,
    isLoading: countLoading,
    error: countError,
    refetch: refreshCount,
  } = useQuery({
    queryKey: ["monitoring-errors-24h"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("error_logs")
        .select("id", { count: "exact", head: true })
        .gte(
          "created_at",
          new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        );
      if (error) throw error;
      if (count == null)
        throw new Error("The last 24 hours' error count is unavailable.");
      return count;
    },
  });
  const statusUnavailable = !!countError || !!logsError;
  const matchingErrors = (errorLogs || []).filter((error) =>
    `${error.message} ${error.url}`
      .toLowerCase()
      .includes(errorSearch.toLowerCase()),
  );
  const groups = new Map<
    string,
    {
      message: string;
      count: number;
      latest: string;
      urls: Set<string>;
      sample: NonNullable<typeof errorLogs>[number];
    }
  >();
  for (const error of matchingErrors) {
    const group = groups.get(error.message) || {
      message: error.message,
      count: 0,
      latest: error.created_at,
      urls: new Set<string>(),
      sample: error,
    };
    group.count++;
    if (error.url) group.urls.add(error.url);
    groups.set(error.message, group);
  }

  return (
    <AdminPageLayout
      title="Site Health"
      description="Nightly visitor checks, recorded errors and performance metrics"
      actions={
        <Button
          variant="outline"
          onClick={() => {
            void refreshLogs();
            if (performanceEnabled) void refreshMetrics();
            void refreshCount();
          }}
        >
          Refresh monitoring
        </Button>
      }
    >
      <div className="space-y-6">
        <ActivityTabs />
        <SiteHealthWorkspace />
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <AlertCircle className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Recorded errors loaded
                </p>
                <p className="text-2xl font-bold">
                  {logsError
                    ? "Unavailable"
                    : errorsLoading
                      ? "Loading…"
                      : (errorLogs?.length ?? 0)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Errors in last 24 hours
                </p>
                <p className="text-2xl font-bold">
                  {countError
                    ? "Unavailable"
                    : countLoading
                      ? "Loading…"
                      : dayErrors}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[hsl(var(--steel-blue)/0.1)] rounded-lg">
                <Zap className="h-5 w-5 text-[hsl(var(--steel-blue))]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Recorded error status
                </p>
                <Badge
                  variant={
                    statusUnavailable
                      ? "secondary"
                      : dayErrors
                        ? "destructive"
                        : "outline"
                  }
                  className="mt-1"
                >
                  {statusUnavailable
                    ? "Unavailable"
                    : countLoading || errorsLoading
                      ? "Checking…"
                      : dayErrors
                        ? "Errors reported"
                        : "No errors reported in 24 hours"}
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        {(logsError || countError) && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/40 p-4 text-sm"
          >
            Error monitoring is unavailable.{" "}
            {adminErrorMessage(logsError || countError)}
          </div>
        )}
        {performanceEnabled && metricsError && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/40 p-4 text-sm"
          >
            Performance metrics are unavailable.{" "}
            {adminErrorMessage(metricsError)}
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          <select
            aria-label="Recorded error period"
            className="rounded border bg-background px-3 py-2 text-sm"
            value={errorPeriod}
            onChange={(event) => setErrorPeriod(event.target.value)}
          >
            <option value="1">Past 24 hours</option>
            <option value="7">Past 7 days</option>
            <option value="all">Older records included</option>
          </select>
          <Input
            className="max-w-sm"
            aria-label="Filter recorded errors"
            placeholder="Filter loaded errors by message or URL"
            value={errorSearch}
            onChange={(event) => setErrorSearch(event.target.value)}
          />
          <Button
            variant="outline"
            onClick={() => setGroupErrors(!groupErrors)}
          >
            {groupErrors ? "Show individual errors" : "Group by message"}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Showing up to 50 latest records in the selected period. Counts below
          describe these loaded records, not all occurrences. A recorded error
          does not confirm that the issue still occurs; no records are deleted
          when you change the period.
        </p>
        {groupErrors && !logsError && (
          <div className="space-y-3">
            {[...groups.values()].map((group) => (
              <div
                key={group.message}
                className="rounded-lg border p-4 space-y-2"
              >
                <p className="break-words font-medium">{group.message}</p>
                <p className="text-sm text-muted-foreground">
                  {group.count} recorded event(s) · latest{" "}
                  {new Date(group.latest).toLocaleString()}
                </p>
                {Date.parse(group.latest) <
                  Date.now() - 24 * 60 * 60 * 1000 && (
                  <p className="text-sm text-muted-foreground">
                    Last recorded more than 24 hours ago.
                  </p>
                )}
                <p className="text-xs break-all">
                  {[...group.urls].join(", ")}
                </p>
                <details className="text-sm">
                  <summary className="cursor-pointer">
                    Latest event details
                  </summary>
                  <p className="mt-2 break-words">
                    Browser: {group.sample.user_agent || "Not recorded"}
                  </p>
                  <pre className="mt-2 whitespace-pre-wrap break-words text-xs">
                    {group.sample.stack || "No stack trace recorded."}
                  </pre>
                  {group.sample.context != null && (
                    <pre className="mt-2 whitespace-pre-wrap break-words text-xs">
                      {typeof group.sample.context === "string"
                        ? group.sample.context
                        : JSON.stringify(group.sample.context, null, 2)}
                    </pre>
                  )}
                </details>
              </div>
            ))}
            {!groups.size && !errorsLoading && (
              <p>No errors match the filter.</p>
            )}
          </div>
        )}
        {!groupErrors && (
          <>
            {/* Error Logs */}
            <Card>
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-danger" />
                  <h3 className="text-lg font-semibold">Recorded Errors</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Browser errors in the selected period
                </p>
              </div>
              <div className="overflow-x-auto">
                {logsError ? (
                  <p className="p-6">Could not load recent errors.</p>
                ) : errorsLoading ? (
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
                      {matchingErrors.slice(0, 20).map((error) => (
                        <TableRow key={error.id}>
                          <TableCell className="text-sm whitespace-nowrap">
                            {format(
                              new Date(error.created_at),
                              "MMM dd, HH:mm:ss",
                            )}
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
          </>
        )}
        {/* Performance Metrics */}
        {performanceEnabled && (
          <Card>
            <div className="p-6 border-b border-border">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Performance Metrics</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Application performance data
              </p>
            </div>
            <div className="overflow-x-auto">
              {metricsError ? (
                <p className="p-6">Could not load performance metrics.</p>
              ) : metricsLoading ? (
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
                          {format(
                            new Date(metric.recorded_at),
                            "MMM dd, HH:mm:ss",
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {metric.metric_name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="info">{metric.metric_type}</Badge>
                        </TableCell>
                        <TableCell className="font-mono">
                          {Number(metric.value).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {metric.unit || "N/A"}
                        </TableCell>
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
        )}
      </div>
    </AdminPageLayout>
  );
}
