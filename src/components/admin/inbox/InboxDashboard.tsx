import { useQuery } from "@tanstack/react-query";
import { loadInboxCounts } from "@/lib/inbox/api";
import { Card } from "@/ui/Card";
import { FileText, Mail, FileUser, Download, DollarSign, Newspaper } from "lucide-react";
import { Button } from "@/ui/Button";
import { Skeleton } from "@/components/ui/skeleton";

export const InboxDashboard = () => {
  const { data: stats, isLoading, error, refetch } = useQuery({
    queryKey: ["inbox-stats"],
    refetchInterval: 60_000,
    queryFn: loadInboxCounts,
  });

  const cards = [
    {
      title: "New RFPs",
      value: stats?.rfp || 0,
      icon: FileText,
      color: "text-accent",
      bgColor: "bg-accent/10",
      priority: "high",
    },
    {
      title: "New Contacts",
      value: stats?.contact || 0,
      icon: Mail,
      color: "text-primary",
      bgColor: "bg-primary/10",
      priority: "medium",
    },
    {
      title: "New Resumes",
      value: stats?.resume || 0,
      icon: FileUser,
      color: "text-[hsl(var(--steel-blue))]",
      bgColor: "bg-[hsl(var(--steel-blue)/0.1)]",
      priority: "medium",
    },
    {
      title: "New Prequal Requests",
      value: stats?.prequal || 0,
      icon: Download,
      color: "text-primary",
      bgColor: "bg-primary/10",
      priority: "medium",
    },
    {
      title: "New Quote Requests",
      value: stats?.quote || 0,
      icon: DollarSign,
      color: "text-accent",
      bgColor: "bg-accent/10",
      priority: "high",
    },
    {
      title: "Newsletter Subscribers",
      value: stats?.newsletter || 0,
      icon: Newspaper,
      color: "text-[hsl(var(--steel-blue))]",
      bgColor: "bg-[hsl(var(--steel-blue)/0.1)]",
      priority: "low",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-20 w-full" />
          </Card>
        ))}
      </div>
    );
  }

  if (error) return <div role="alert" className="rounded-md border border-destructive/50 p-4 text-sm">Inbox counts are unavailable. <Button variant="outline" onClick={() => void refetch()}>Retry counts</Button></div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {card.title}
                </p>
                <p className="text-3xl font-bold">{card.value}</p>
                {card.priority === "high" && card.value > 0 && (
                  <span className="inline-flex items-center rounded-full bg-danger/10 dark:bg-danger/20 px-2 py-1 text-xs font-medium text-danger dark:text-danger mt-2">
                    High Priority
                  </span>
                )}
              </div>
              <div className={`rounded-lg p-3 ${card.bgColor}`}>
                <Icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
