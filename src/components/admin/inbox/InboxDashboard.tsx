import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { FileText, Mail, FileUser, Download, DollarSign, Newspaper } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const InboxDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["inbox-stats"],
    queryFn: async () => {
      const [rfp, contact, prequal, quote, newsletter] = await Promise.all([
        supabase
          .from("rfp_submissions")
          .select("*", { count: "exact", head: true })
          .eq("status", "new"),
        supabase
          .from("contact_submissions")
          .select("*", { count: "exact", head: true })
          .eq("status", "new"),
        supabase
          .from("prequalification_downloads")
          .select("*", { count: "exact", head: true })
          .eq("status", "new"),
        supabase
          .from("quote_requests")
          .select("*", { count: "exact", head: true })
          .eq("status", "new"),
        supabase
          .from("newsletter_subscribers")
          .select("*", { count: "exact", head: true })
          .eq("is_active", true),
      ]);

      return {
        rfp: rfp.count || 0,
        contact: contact.count || 0,
        prequal: prequal.count || 0,
        quote: quote.count || 0,
        newsletter: newsletter.count || 0,
      };
    },
  });

  const cards = [
    {
      title: "New RFPs",
      value: stats?.rfp || 0,
      icon: FileText,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      priority: "high",
    },
    {
      title: "New Contacts",
      value: stats?.contact || 0,
      icon: Mail,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      priority: "medium",
    },
    {
      title: "New Prequal Requests",
      value: stats?.prequal || 0,
      icon: Download,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      priority: "medium",
    },
    {
      title: "New Quote Requests",
      value: stats?.quote || 0,
      icon: DollarSign,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
      priority: "high",
    },
    {
      title: "Newsletter Subscribers",
      value: stats?.newsletter || 0,
      icon: Newspaper,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
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
                  <span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-900/20 px-2 py-1 text-xs font-medium text-red-700 dark:text-red-400 mt-2">
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
