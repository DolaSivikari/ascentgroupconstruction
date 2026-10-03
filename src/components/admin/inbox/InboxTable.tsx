import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { loadInbox } from "@/lib/inbox/api";
import {
  INBOX_SOURCES,
  STATUS_LABELS,
  filterStatuses,
  inboxDate,
  inboxName,
  inboxText,
  matchesInboxSearch,
  type InboxFilter,
  type InboxItem,
  type InboxKind,
} from "@/lib/inbox/model";

interface InboxTableProps {
  type: InboxFilter;
  highlightId?: string | null;
}
export const InboxTable = ({ type, highlightId }: InboxTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<InboxItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<InboxItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["inbox-items", type],
    queryFn: () => loadInbox(type),
    refetchInterval: 60_000,
  });
  const items = data?.items;
  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ["inbox-items"] });
    void queryClient.invalidateQueries({ queryKey: ["inbox-stats"] });
    void queryClient.invalidateQueries({ queryKey: ["estimates-quotes"] });
  };

  useEffect(() => {
    const kinds =
      type === "all" ? (Object.keys(INBOX_SOURCES) as InboxKind[]) : [type];
    const channel = supabase
      .channel(`inbox-${type}`)
      .on("postgres_changes", { event: "*", schema: "public" }, (payload) => {
        if (kinds.some((kind) => INBOX_SOURCES[kind].table === payload.table)) {
          void queryClient.invalidateQueries({ queryKey: ["inbox-items"] });
          void queryClient.invalidateQueries({ queryKey: ["inbox-stats"] });
          if (payload.eventType === "INSERT")
            toast({
              title: "New Submission",
              description: "A new message has arrived in the inbox.",
            });
        }
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [type, queryClient, toast]);

  useEffect(() => {
    if (!highlightId || !items?.some((item) => item.id === highlightId)) return;
    setActiveHighlight(highlightId);
    const scroll = window.setTimeout(
      () =>
        document
          .getElementById(`inbox-row-${highlightId}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" }),
      100,
    );
    const clear = window.setTimeout(() => setActiveHighlight(null), 3500);
    return () => {
      window.clearTimeout(scroll);
      window.clearTimeout(clear);
    };
  }, [highlightId, items]);

  const handleDelete = async () => {
    if (!deleteItem || deleting) return;
    setDeleting(true);
    try {
      const { error } = await supabase
        .from(deleteItem.table)
        .delete()
        .eq("id", deleteItem.id)
        .select("id")
        .single();
      if (error) throw error;
      toast({ title: "Deleted", description: "Submission removed." });
      refresh();
      setDeleteItem(null);
    } catch {
      toast({
        title: "Error",
        description: "Could not delete this submission. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };
  const filteredItems = items?.filter(
    (item) =>
      matchesInboxSearch(item, searchQuery) &&
      (statusFilter === "all" || item.status === statusFilter),
  );
  const hasFailure = !!error || !!data?.failed.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search inbox"
            placeholder="Search name, company, project, or scope..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="pl-10"
          />
        </div>
        {type !== "newsletter" && (
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger
              aria-label="Filter inbox status"
              className="w-full sm:w-[180px]"
            >
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {filterStatuses(type).map((status) => (
                <SelectItem key={status} value={status}>
                  {STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Button
          variant="outline"
          onClick={() => void refetch()}
          disabled={isFetching}
        >
          {isFetching ? "Refreshing..." : "Refresh"}
        </Button>
      </div>
      {hasFailure && (
        <div
          role="alert"
          className="rounded-md border border-destructive/50 p-4 text-sm"
        >
          Could not load {data?.failed.join(", ") || "the inbox"}. Any messages
          shown below are from the sources that loaded successfully. Please
          refresh to try again.
        </div>
      )}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Name / Project</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              {type !== "newsletter" && <TableHead>Status</TableHead>}
              <TableHead>Received</TableHead>
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
            ) : filteredItems?.length ? (
              filteredItems.map((item) => (
                <TableRow
                  key={`${item.table}-${item.id}`}
                  id={`inbox-row-${item.id}`}
                  className={`hover:bg-muted/50 ${activeHighlight === item.id ? "ring-2 ring-primary ring-inset bg-primary/5" : ""}`}
                >
                  <TableCell>
                    <Badge
                      variant={
                        item.type === "RFP"
                          ? "danger"
                          : item.type === "Quote"
                            ? "warning"
                            : "info"
                      }
                    >
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {inboxName(item)}
                    {inboxText(item, "project_name") && (
                      <div className="text-xs text-muted-foreground">
                        {inboxText(item, "project_name")}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{inboxText(item, "phone") || "—"}</TableCell>
                  {type !== "newsletter" && (
                    <TableCell>
                      {item.type === "Newsletter" ? (
                        <Badge>{item.is_active ? "Active" : "Inactive"}</Badge>
                      ) : (
                        <Badge
                          variant={
                            item.status === "new"
                              ? "new"
                              : ["completed", "resolved", "won"].includes(
                                    item.status || "",
                                  )
                                ? "success"
                                : item.status === "lost"
                                  ? "destructive"
                                  : "secondary"
                          }
                        >
                          {STATUS_LABELS[item.status || "new"] || item.status}
                        </Badge>
                      )}
                    </TableCell>
                  )}
                  <TableCell>
                    {inboxDate(item.created_at)
                      ? format(inboxDate(item.created_at)!, "MMM d, yyyy HH:mm")
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`View ${inboxName(item)}`}
                        onClick={() => setSelectedItem(item)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <a
                          href={`mailto:${item.email}`}
                          aria-label={`Email ${inboxName(item)}`}
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                      </Button>
                      {inboxText(item, "phone") && (
                        <Button variant="ghost" size="icon" asChild>
                          <a
                            href={`tel:${inboxText(item, "phone")}`}
                            aria-label={`Call ${inboxName(item)}`}
                          >
                            <Phone className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${inboxName(item)}`}
                        onClick={() => setDeleteItem(item)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  {hasFailure
                    ? "Some inbox sources could not be loaded."
                    : "No messages match these filters."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {selectedItem && (
        <InboxDetailDialog
          key={`${selectedItem.table}-${selectedItem.id}`}
          item={selectedItem}
          open
          onClose={() => setSelectedItem(null)}
          onUpdate={refresh}
        />
      )}
      <ConfirmDialog
        open={!!deleteItem}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeleteItem(null);
        }}
        onConfirm={handleDelete}
        title="Delete Item"
        description="This permanently deletes the submission. This action cannot be undone."
        confirmText={deleting ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
};
