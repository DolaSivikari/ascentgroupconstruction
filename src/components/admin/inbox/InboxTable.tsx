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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Mail, Phone, Search } from "lucide-react";
import { format } from "date-fns";
import { InboxDetailDialog } from "./InboxDetailDialog";
import { useToast } from "@/hooks/use-toast";

interface InboxTableProps {
  type: "all" | "rfp" | "contact" | "resume" | "prequal" | "quote" | "newsletter";
}

export const InboxTable = ({ type }: InboxTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { toast } = useToast();

  const { data: items, isLoading, refetch } = useQuery({
    queryKey: ["inbox-items", type, statusFilter],
    queryFn: async () => {
      const allItems: any[] = [];

      const fetchFromTable = async (
        table: string,
        typeLabel: string,
        selectFields: string
      ) => {
        // Use type assertion to handle dynamic table queries
        const baseQuery: any = supabase.from(table as any);
        let query = baseQuery.select(selectFields).order("created_at", { ascending: false });
        
        if (statusFilter !== "all" && table !== "newsletter_subscribers") {
          query = query.eq("status", statusFilter);
        }

        const { data, error } = await query;
        if (error) throw error;

        return data?.map((item: any) => ({
          ...item,
          type: typeLabel,
          table: table,
        })) || [];
      };

      if (type === "all" || type === "rfp") {
        const rfps = await fetchFromTable(
          "rfp_submissions",
          "RFP",
          "id, contact_name, company_name, email, phone, project_name, status, created_at, estimated_value_range"
        );
        allItems.push(...rfps);
      }

      if (type === "all" || type === "contact") {
        const contacts = await fetchFromTable(
          "contact_submissions",
          "Contact",
          "id, name, email, phone, company, message, status, created_at, submission_type"
        );
        allItems.push(...contacts);
      }

      if (type === "all" || type === "resume") {
        const resumes = await fetchFromTable(
          "resume_submissions",
          "Resume",
          "id, applicant_name, email, phone, status, created_at, resume_url"
        );
        allItems.push(...resumes);
      }

      if (type === "all" || type === "prequal") {
        const prequals = await fetchFromTable(
          "prequalification_downloads",
          "Prequal",
          "id, contact_name, company_name, email, phone, status, created_at, project_type"
        );
        allItems.push(...prequals);
      }

      if (type === "all" || type === "quote") {
        const quotes = await fetchFromTable(
          "quote_requests",
          "Quote",
          "id, name, email, phone, company, status, created_at, quote_type, priority"
        );
        allItems.push(...quotes);
      }

      if (type === "all" || type === "newsletter") {
        const newsletters = await fetchFromTable(
          "newsletter_subscribers",
          "Newsletter",
          "id, email, created_at, is_active, source"
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
    const channels = [];

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "in_progress":
      case "contacted":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "completed":
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "RFP":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "Contact":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "Resume":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Prequal":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      case "Quote":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "Newsletter":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
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
                    <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {item.contact_name || item.name || item.applicant_name || item.company_name}
                  </TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.phone || "-"}</TableCell>
                  {type !== "newsletter" && (
                    <TableCell>
                      <Badge className={getStatusColor(item.status || "new")}>
                        {item.status || "new"}
                      </Badge>
                    </TableCell>
                  )}
                  <TableCell>
                    {format(new Date(item.created_at), "MMM d, yyyy HH:mm")}
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
    </div>
  );
};
