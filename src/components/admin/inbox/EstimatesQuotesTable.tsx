import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/ui/Card";
import { Eye, Mail, Phone, Search, Trash2, FileText, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { InboxDetailDialog } from "./InboxDetailDialog";
import { useToast } from "@/hooks/use-toast";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

type QuoteRow = {
  id: string;
  quote_type: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  status: string | null;
  priority: string | null;
  lead_score: number | null;
  estimated_value: number | null;
  source: string | null;
  scope_categories: string[] | null;
  created_at: string;
};

type StatusFilter = "all" | "new" | "contacted" | "quoted" | "won" | "lost";
type TypeFilter = "all" | "estimate" | "quote";

// Estimates come from /estimate flow with source = "estimator"
// Quotes come from QuoteRequestDialog (service pages) with source != "estimator"
const isEstimate = (row: QuoteRow) => row.source === "estimator";

const STATUS_LABEL: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  won: "Won",
  lost: "Lost",
};

const getStatusVariant = (status: string | null) => {
  switch (status) {
    case "new":
      return "new" as const;
    case "contacted":
      return "warning" as const;
    case "quoted":
      return "info" as const;
    case "won":
      return "success" as const;
    case "lost":
      return "destructive" as const;
    default:
      return "secondary" as const;
  }
};

const getPriorityVariant = (priority: string | null) => {
  switch (priority) {
    case "hot":
      return "danger" as const;
    case "warm":
      return "warning" as const;
    case "cold":
      return "info" as const;
    default:
      return "secondary" as const;
  }
};

const formatCurrency = (n: number | null) => {
  if (n == null) return "-";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(n);
};

export const EstimatesQuotesTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [deleteItem, setDeleteItem] = useState<QuoteRow | null>(null);
  const { toast } = useToast();

  const { data: items, isLoading, refetch } = useQuery({
    queryKey: ["estimates-quotes", statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("quote_requests")
        .select(
          "id, quote_type, name, email, phone, company, status, priority, lead_score, estimated_value, source, scope_categories, created_at"
        )
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as QuoteRow[];
    },
  });

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("estimates-quotes-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "quote_requests" },
        (payload) => {
          refetch();
          if (payload.eventType === "INSERT") {
            const row = payload.new as QuoteRow;
            toast({
              title: isEstimate(row) ? "New estimate request" : "New quote request",
              description: `From ${row.name}${row.company ? ` (${row.company})` : ""}`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch, toast]);

  const filteredItems = useMemo(() => {
    if (!items) return [];
    return items.filter((item) => {
      // Type filter
      if (typeFilter === "estimate" && !isEstimate(item)) return false;
      if (typeFilter === "quote" && isEstimate(item)) return false;

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const haystack = [
          item.name,
          item.email,
          item.company,
          item.phone,
          item.quote_type,
          ...(item.scope_categories || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [items, searchQuery, typeFilter]);

  const stats = useMemo(() => {
    const all = items || [];
    return {
      total: all.length,
      estimates: all.filter(isEstimate).length,
      quotes: all.filter((r) => !isEstimate(r)).length,
      new: all.filter((r) => r.status === "new").length,
      contacted: all.filter((r) => r.status === "contacted").length,
      won: all.filter((r) => r.status === "won").length,
      lost: all.filter((r) => r.status === "lost").length,
    };
  }, [items]);

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      const { error } = await supabase
        .from("quote_requests")
        .delete()
        .eq("id", deleteItem.id);
      if (error) throw error;
      toast({ title: "Deleted", description: "Submission removed." });
      refetch();
      setDeleteItem(null);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Could not delete submission.",
        variant: "destructive",
      });
    }
  };

  const handleQuickStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("quote_requests")
        .update({ status: newStatus })
        .eq("id", id);
      if (error) throw error;
      toast({ title: "Status updated", description: `Marked as ${STATUS_LABEL[newStatus] || newStatus}.` });
      refetch();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Could not update status.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <StatTile label="Total" value={stats.total} />
        <StatTile label="Estimates" value={stats.estimates} icon={<DollarSign className="h-4 w-4" />} />
        <StatTile label="Quotes" value={stats.quotes} icon={<FileText className="h-4 w-4" />} />
        <StatTile label="New" value={stats.new} accent="primary" />
        <StatTile label="Contacted" value={stats.contacted} accent="warning" />
        <StatTile label="Won" value={stats.won} accent="success" />
        <StatTile label="Lost" value={stats.lost} accent="destructive" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, company, or scope..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as TypeFilter)}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="estimate">Estimates only</SelectItem>
            <SelectItem value="quote">Quotes only</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="quoted">Quoted</SelectItem>
            <SelectItem value="won">Won</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Scope</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-10 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-10 text-muted-foreground">
                  No submissions match your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => {
                const estimate = isEstimate(item);
                return (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Badge variant={estimate ? "warning" : "info"}>
                        {estimate ? "Estimate" : "Quote"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.company || "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{item.email}</TableCell>
                    <TableCell className="text-muted-foreground max-w-[200px] truncate">
                      {item.scope_categories?.length
                        ? item.scope_categories.join(", ")
                        : item.quote_type.replace(/_/g, " ")}
                    </TableCell>
                    <TableCell>{formatCurrency(item.estimated_value)}</TableCell>
                    <TableCell>
                      {item.priority ? (
                        <Badge variant={getPriorityVariant(item.priority)}>
                          {item.priority}
                        </Badge>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={item.status || "new"}
                        onValueChange={(v) => handleQuickStatusChange(item.id, v)}
                      >
                        <SelectTrigger className="h-8 w-[130px]">
                          <Badge variant={getStatusVariant(item.status)}>
                            {STATUS_LABEL[item.status || "new"] || item.status}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="quoted">Quoted</SelectItem>
                          <SelectItem value="won">Won</SelectItem>
                          <SelectItem value="lost">Lost</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {format(new Date(item.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setSelectedItem({
                              ...item,
                              type: estimate ? "Estimate" : "Quote",
                              table: "quote_requests",
                            })
                          }
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" asChild title="Email">
                          <a href={`mailto:${item.email}`}>
                            <Mail className="h-4 w-4" />
                          </a>
                        </Button>
                        {item.phone && (
                          <Button variant="ghost" size="icon" asChild title="Call">
                            <a href={`tel:${item.phone}`}>
                              <Phone className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteItem(item)}
                          className="text-destructive hover:text-destructive"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {selectedItem && (
        <InboxDetailDialog
          item={selectedItem}
          open={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          onUpdate={refetch}
        />
      )}

      <ConfirmDialog
        open={!!deleteItem}
        onOpenChange={(open) => !open && setDeleteItem(null)}
        onConfirm={handleDelete}
        title="Delete submission"
        description="This permanently removes the submission. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
};

interface StatTileProps {
  label: string;
  value: number;
  icon?: React.ReactNode;
  accent?: "primary" | "warning" | "success" | "destructive";
}

const StatTile = ({ label, value, icon, accent }: StatTileProps) => {
  const accentClass =
    accent === "primary"
      ? "text-primary"
      : accent === "warning"
      ? "text-warning"
      : accent === "success"
      ? "text-success"
      : accent === "destructive"
      ? "text-destructive"
      : "text-foreground";

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground mb-2">
        <span>{label}</span>
        {icon}
      </div>
      <div className={`text-2xl font-semibold ${accentClass}`}>{value}</div>
    </Card>
  );
};
