import { useState, useEffect } from "react";
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
import { Eye, Mail, Phone, Search, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { InboxDetailDialog } from "./InboxDetailDialog";
import { useToast } from "@/hooks/use-toast";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

interface InboxTableProps {
  type: "all" | "rfp" | "contact" | "resume" | "prequal" | "quote" | "newsletter";
}

// Map tables to their date column names
const dateColumnMap: Record<string, string> = {
  'rfp_submissions': 'created_at',
  'contact_submissions': 'created_at',
  'resume_submissions': 'created_at',
  'prequalification_downloads': 'downloaded_at',
  'quote_requests': 'created_at',
  'newsletter_subscribers': 'created_at',
};

export const InboxTable = ({ type }: InboxTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [deleteItem, setDeleteItem] = useState<any>(null);
  const { toast } = useToast();

  const { data: items, isLoading, refetch } = useQuery({
    queryKey: ["inbox-items", type, statusFilter],
    queryFn: async () => {
      const allItems: any[] = [];

      const fetchFromTable = async (
        table: string,
        typeLabel: string,
        selectFields: string,
        dateColumn: string = 'created_at'
      ) => {
        try {
          const baseQuery: any = supabase.from(table as any);
          let query = baseQuery.select(selectFields).order(dateColumn, { ascending: false });
          
          if (statusFilter !== "all" && table !== "newsletter_subscribers") {
            query = query.eq("status", statusFilter);
          }

          const { data, error } = await query;
          if (error) {
            console.error(`Error fetching from ${table}:`, error);
            return [];
          }

          return data?.map((item: any) => ({
            ...item,
            // Normalize the date column to created_at for consistent sorting/display
            created_at: item[dateColumn] || item.created_at,
            type: typeLabel,
            table: table,
          })) || [];
        } catch (error) {
          console.error(`Error fetching from ${table}:`, error);
          return [];
        }
      };

      if (type === "all" || type === "rfp") {
        const rfps = await fetchFromTable(
          "rfp_submissions",
          "RFP",
          "id, contact_name, company_name, email, phone, project_name, status, created_at, estimated_value_range",
          dateColumnMap['rfp_submissions']
        );
        allItems.push(...rfps);
      }

      if (type === "all" || type === "contact") {
        const contacts = await fetchFromTable(
          "contact_submissions",
          "Contact",
          "id, name, email, phone, company, message, status, created_at, submission_type",
          dateColumnMap['contact_submissions']
        );
        allItems.push(...contacts);
      }

      if (type === "all" || type === "resume") {
        const resumes = await fetchFromTable(
          "resume_submissions",
          "Resume",
          "id, applicant_name, email, phone, status, created_at, resume_url",
          dateColumnMap['resume_submissions']
        );
        allItems.push(...resumes);
      }

      if (type === "all" || type === "prequal") {
        const prequals = await fetchFromTable(
          "prequalification_downloads",
          "Prequal",
          "id, contact_name, company_name, email, phone, status, downloaded_at, project_type",
          dateColumnMap['prequalification_downloads']
        );
        allItems.push(...prequals);
      }

      if (type === "all" || type === "quote") {
        const quotes = await fetchFromTable(
          "quote_requests",
          "Quote",
          "id, name, email, phone, company, status, created_at, quote_type, priority",
          dateColumnMap['quote_requests']
        );
        allItems.push(...quotes);
      }

      if (type === "all" || type === "newsletter") {
        const newsletters = await fetchFromTable(
          "newsletter_subscribers",
          "Newsletter",
          "id, email, created_at, is_active, source",
          dateColumnMap['newsletter_subscribers']
        );
        allItems.push(...newsletters);
      }

      return allItems.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },
  });

  // Realtime subscriptions
  useEffect(() => {
    const channels: any[] = [];

    const tables = type === "all" 
      ? ["rfp_submissions", "contact_submissions", "resume_submissions", "prequalification_downloads", "quote_requests"]
      : type === "rfp" ? ["rfp_submissions"]
      : type === "contact" ? ["contact_submissions"]
      : type === "resume" ? ["resume_submissions"]
      : type === "prequal" ? ["prequalification_downloads"]
      : type === "quote" ? ["quote_requests"]
      : [];

    tables.forEach((table) => {
      const channel = supabase
        .channel(`${table}-changes`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: table,
          },
          (payload) => {
            console.log("Realtime update:", payload);
            refetch();
            
            if (payload.eventType === "INSERT") {
              toast({
                title: "New Submission",
                description: `A new ${table.replace("_", " ")} has been received.`,
              });
            }
          }
        )
        .subscribe();

      channels.push(channel);
    });

    return () => {
      channels.forEach((channel) => supabase.removeChannel(channel));
    };
  }, [type, refetch, toast]);

  const handleDelete = async () => {
    if (!deleteItem) return;

    try {
      const { error } = await supabase
        .from(deleteItem.table)
        .delete()
        .eq("id", deleteItem.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item deleted successfully",
      });

      refetch();
      setDeleteItem(null);
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredItems = items?.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    const name =
      item.contact_name ||
      item.name ||
      item.applicant_name ||
      item.company_name ||
      "";
    const email = item.email || "";
    const company = item.company || item.company_name || "";

    return (
      name.toLowerCase().includes(searchLower) ||
      email.toLowerCase().includes(searchLower) ||
      company.toLowerCase().includes(searchLower)
    );
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "new":
        return "new" as const;
      case "in_progress":
      case "contacted":
        return "warning" as const;
      case "completed":
      case "resolved":
        return "success" as const;
      default:
        return "secondary" as const;
    }
  };

  const getTypeVariant = (type: string) => {
    switch (type) {
      case "RFP":
        return "danger" as const;
      case "Contact":
        return "info" as const;
      case "Resume":
        return "success" as const;
      case "Prequal":
        return "primary" as const;
      case "Quote":
        return "warning" as const;
      case "Newsletter":
        return "info" as const;
      default:
        return "secondary" as const;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {type !== "newsletter" && (
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Name/Contact</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              {type !== "newsletter" && <TableHead>Status</TableHead>}
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredItems && filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <TableRow key={`${item.type}-${item.id}`} className="hover:bg-muted/50">
                  <TableCell>
                    <Badge variant={getTypeVariant(item.type)}>{item.type}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {item.contact_name || item.name || item.applicant_name || item.company_name}
                  </TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.phone || "-"}</TableCell>
                  {type !== "newsletter" && (
                    <TableCell>
                      <Badge variant={getStatusVariant(item.status || "new")}>
                        {item.status || "new"}
                      </Badge>
                    </TableCell>
                  )}
                  <TableCell>
                    {item.created_at ? format(new Date(item.created_at), "MMM d, yyyy HH:mm") : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedItem(item)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                      >
                        <a href={`mailto:${item.email}`}>
                          <Mail className="h-4 w-4" />
                        </a>
                      </Button>
                      {item.phone && (
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                        >
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
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No items found
                </TableCell>
              </TableRow>
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
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
};
