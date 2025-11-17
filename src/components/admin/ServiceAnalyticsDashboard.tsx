import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useServiceAnalytics } from "@/hooks/useServiceAnalytics";
import { BarChart, TrendingUp, MousePointerClick, Target, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export function ServiceAnalyticsDashboard() {
  const { useAnalyticsDashboard } = useServiceAnalytics();
  const { data: analytics, isLoading } = useAnalyticsDashboard();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analytics) return null;

  const metrics = [
    {
      title: "Impressions",
      value: analytics.summary.impressions.toLocaleString(),
      icon: Eye,
      description: "Total views",
      color: "text-blue-600",
    },
    {
      title: "Clicks",
      value: analytics.summary.clicks.toLocaleString(),
      icon: MousePointerClick,
      description: `${analytics.summary.ctr}% CTR`,
      color: "text-accent",
    },
    {
      title: "Conversions",
      value: analytics.summary.conversions.toLocaleString(),
      icon: Target,
      description: `${analytics.summary.conversionRate}% rate`,
      color: "text-green-600",
    },
    {
      title: "Performance",
      value: analytics.servicePerformance.length,
      icon: TrendingUp,
      description: "Services tracked",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Service Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Service Performance (Last 7 Days)
          </CardTitle>
          <CardDescription>
            Detailed metrics for each service in Popular Services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.servicePerformance
              .sort((a, b) => b.clicks - a.clicks)
              .slice(0, 10)
              .map((service) => (
                <div
                  key={service.link}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{service.name}</h4>
                    <p className="text-xs text-muted-foreground truncate">{service.link}</p>
                  </div>
                  <div className="flex items-center gap-6 ml-4">
                    <div className="text-center">
                      <div className="text-sm font-medium">{service.impressions}</div>
                      <div className="text-xs text-muted-foreground">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">{service.clicks}</div>
                      <div className="text-xs text-muted-foreground">Clicks</div>
                    </div>
                    <div className="text-center">
                      <Badge variant={parseFloat(service.ctr) > 5 ? "default" : "secondary"}>
                        {service.ctr}% CTR
                      </Badge>
                    </div>
                    {service.conversions > 0 && (
                      <div className="text-center">
                        <Badge variant="default" className="bg-green-600">
                          {service.conversions} Conv
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
