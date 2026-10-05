import { InquiryWorkflowActions } from "./InquiryWorkflowActions";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Download, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  INBOX_SOURCES,
  STATUS_LABELS,
  inboxName,
  inboxText,
  type InboxItem,
} from "@/lib/inbox/model";
import { downloadInboxCsv } from "@/lib/inbox/workspace";
import { loadLeadPage } from "@/lib/leads/api";
import {
  LEAD_SOURCES,
  LEAD_TYPE_LABELS,
  formatLeadReceived,
  leadPreview,
  leadSource,
  leadType,
  type LeadCursor,
  type LeadFilters,
  type LeadRef,
  type LeadSource,
  type LeadTypeFilter,
} from "@/lib/leads/model";
import { LeadDetailPanel } from "./LeadDetailPanel";

interface LeadsWorkspaceProps {
  highlightId?: string | null;
  source?: LeadSource;
  initialType?: LeadTypeFilter;
  initialStatus?: string;
  initialSource?: LeadSource;
  initialAttention?: LeadFilters["attention"];
  onSelectionChange: (ref: LeadRef | null) => void;
}
export function LeadsWorkspace({
  highlightId,
  source,
  initialType = "all",
  initialStatus = "open",
  initialSource,
  initialAttention,
  onSelectionChange,
}: LeadsWorkspaceProps) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<LeadFilters>({
    search: "",
    attention: initialAttention,
    type: initialType,
    status: initialStatus,
    ...(initialSource ? { source: initialSource } : {}),
  });
  const [cursors, setCursors] = useState<Array<LeadCursor | null>>([null]);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const cursor = cursors[cursors.length - 1];
  const { data, isPending, isFetching, error, refetch } = useQuery({
    queryKey: ["lead-pages", filters, cursor],
    queryFn: ({ signal }) => loadLeadPage(filters, cursor, signal, 50, true),
    refetchInterval: 60_000,
    retry: false,
  });
  const changeFilters = (patch: Partial<LeadFilters>) => {
    setFilters((previous) => ({ ...previous, ...patch }));
    setCursors([null]);
  };
  useEffect(() => {
    if (search === filters.search) return;
    const timer = setTimeout(() => {
      setFilters((previous) => ({ ...previous, search }));
      setCursors([null]);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, filters.search]);
  useEffect(() => {
    setFilters((previous) => ({
      ...previous,
      type: initialType,
      attention: initialAttention,
      status: initialStatus,
      source: initialSource,
    }));
    setCursors([null]);
  }, [initialType, initialStatus, initialSource, initialAttention]);
  const refresh = () => {
    for (const key of [
      "lead-pages",
      "lead-detail",
      "inbox-items",
      "inbox-stats",
      "dashboard-stats",
      "dashboard-activity",
      "dashboard-leads",
      "estimates-quotes",
    ])
      void queryClient.invalidateQueries({ queryKey: [key] });
  };
  useEffect(() => {
    const channel = supabase.channel("admin-leads");
    for (const key of LEAD_SOURCES)
      channel.on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: INBOX_SOURCES[key].table,
        },
        (payload) => {
          void queryClient.invalidateQueries({ queryKey: ["lead-pages"] });
          void queryClient.invalidateQueries({ queryKey: ["lead-detail"] });
          void queryClient.invalidateQueries({ queryKey: ["inbox-stats"] });
          if (payload.eventType === "INSERT")
            toast({
              title: "New request received",
              description:
                "The list is refreshing. Use Newest requests when viewing an older page.",
            });
        },
      );
    channel.on(
      "postgres_changes",
      { event: "*", schema: "public", table: "inquiries" },
      () => {
        void queryClient.invalidateQueries({ queryKey: ["lead-pages"] });
        void queryClient.invalidateQueries({ queryKey: ["lead-detail"] });
        void queryClient.invalidateQueries({ queryKey: ["dashboard-leads"] });
      },
    );
    channel.subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);
  const failed = !!error || !!data?.failed.length;
  const busy = isFetching || search !== filters.search;
  const items = data?.items || [];
  const open = (item: InboxItem) =>
    onSelectionChange({ id: item.id, source: leadSource(item) });
  const clearFilters = () => {
    setSearch("");
    changeFilters({
      search: "",
      type: "all",
      status: "all",
      source: undefined,
      attention: undefined,
    });
  };
  const typeBadge = (item: InboxItem) => (
    <Badge variant="info">{LEAD_TYPE_LABELS[leadType(item)]}</Badge>
  );
  const statusBadge = (item: InboxItem) => (
    <Badge
      variant={item.status === "new" || !item.status ? "warning" : "secondary"}
    >
      {STATUS_LABELS[item.status || "new"] || item.status}
    </Badge>
  );

  return (
    <section aria-label="Leads workspace" className="min-w-0 space-y-4">
      <p className="text-sm text-muted-foreground">
        Estimates, service quotes, RFPs, general inquiries and prequalification
        requests from every current website form.
      </p>
      {data && data.inquiryAvailable === false && (
        <p className="text-sm text-muted-foreground">
          New inquiry workflow awaits database setup; all current website
          requests remain available below.
        </p>
      )}
      <div className="flex flex-col gap-3 xl:flex-row xl:flex-wrap">
        <select
          aria-label="Lead attention filter"
          className="rounded border bg-background p-2"
          value={filters.attention || "all"}
          onChange={(event) =>
            changeFilters({
              attention:
                event.target.value === "all"
                  ? undefined
                  : (event.target.value as LeadFilters["attention"]),
            })
          }
        >
          <option value="all">All attention states</option>
          <option value="due">Bids due within 7 days</option>
          <option value="overdue">Overdue bids</option>
          <option value="unassigned">Unassigned inquiries</option>
          <option value="alerts">Alerts needing attention</option>
        </select>
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search leads"
            placeholder="Search name, company, project or message"
            value={search}
            maxLength={120}
            onChange={(event) => setSearch(event.target.value)}
            className="!pl-10"
          />
        </div>
        <Select
          value={filters.type}
          onValueChange={(type) =>
            changeFilters({ type: type as LeadTypeFilter })
          }
        >
          <SelectTrigger
            aria-label="Filter lead type"
            className="w-full xl:w-[190px]"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All request types</SelectItem>
            <SelectItem value="commercial">
              Bids, estimates &amp; quotes
            </SelectItem>
            {Object.entries(LEAD_TYPE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.status}
          onValueChange={(status) => changeFilters({ status })}
        >
          <SelectTrigger
            aria-label="Filter lead status"
            className="w-full xl:w-[180px]"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open requests</SelectItem>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="closed">Closed requests</SelectItem>
            <SelectItem value="archived">Archived new inquiries</SelectItem>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.source || "all"}
          onValueChange={(value) =>
            changeFilters({
              source: value === "all" ? undefined : (value as LeadSource),
            })
          }
        >
          <SelectTrigger
            aria-label="Filter lead source"
            className="w-full xl:w-[180px]"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All form sources</SelectItem>
            {data?.inquiryAvailable && (
              <SelectItem value="inquiry">New inquiries</SelectItem>
            )}
            {LEAD_SOURCES.map((source) => (
              <SelectItem key={source} value={source}>
                {INBOX_SOURCES[source].label} requests
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={() => void refetch()}
          disabled={busy}
        >
          {isFetching ? "Refreshing…" : "Refresh"}
        </Button>
        <Button
          variant="outline"
          onClick={() => downloadInboxCsv(items, "leads")}
          disabled={isPending || busy || failed || !items.length}
        >
          <Download className="mr-2 h-4 w-4" />
          Export this page
        </Button>
      </div>
      {failed && (
        <div
          role="alert"
          className="space-y-2 rounded-md border border-destructive/50 p-4 text-sm"
        >
          <p>
            Could not load {data?.failed.join(", ") || "the Leads list"}.
            Requests shown here may be incomplete. Retry before opening an older
            page or exporting.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
            disabled={isFetching}
          >
            Retry unavailable sources
          </Button>
        </div>
      )}
      <div aria-live="polite" className="text-sm text-muted-foreground">
        {isPending
          ? "Loading requests…"
          : `Page ${cursors.length} · ${items.length} requests shown · Received times are in Toronto`}
      </div>
      {!isPending && !items.length && (
        <div className="space-y-3 rounded-lg border p-8 text-center">
          <p>
            {failed
              ? "Requests are unavailable from one or more sources."
              : "No requests match these filters."}
          </p>
          <Button variant="outline" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      )}
      <InquiryWorkflowActions items={items} onRefresh={refresh} onOpen={open} />
      {!!items.length && (
        <>
          <div className="hidden rounded-lg border sm:block">
            <Table className="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[16%]">Type</TableHead>
                  <TableHead className="w-[27%]">Contact / project</TableHead>
                  <TableHead className="w-[25%]">Message</TableHead>
                  <TableHead className="w-[14%]">Status</TableHead>
                  <TableHead className="w-[18%]">Received</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={`${item.table}-${item.id}`}>
                    <TableCell className="break-words">
                      {typeBadge(item)}
                    </TableCell>
                    <TableCell className="break-words">
                      <button
                        className="text-left font-semibold underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                        aria-label={`View ${inboxName(item)}`}
                        onClick={() => open(item)}
                      >
                        {inboxName(item)}
                      </button>
                      <p className="text-xs text-muted-foreground break-all">
                        {item.email}
                      </p>
                      <p className="mt-1 text-xs">
                        {inboxText(item, "project_name") ||
                          inboxText(item, "company_name") ||
                          inboxText(item, "company")}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="line-clamp-3 break-words">
                        {leadPreview(item)}
                      </p>
                    </TableCell>
                    <TableCell className="break-words">
                      {statusBadge(item)}
                    </TableCell>
                    <TableCell className="break-words text-xs">
                      {formatLeadReceived(item.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="space-y-3 sm:hidden">
            {items.map((item) => (
              <article
                key={`${item.table}-${item.id}`}
                className="space-y-3 rounded-lg border p-4"
              >
                <div className="flex flex-wrap gap-2">
                  {typeBadge(item)}
                  {statusBadge(item)}
                </div>
                <h3 className="font-semibold break-words">{inboxName(item)}</h3>
                <p className="text-sm break-all text-muted-foreground">
                  {item.email}
                </p>
                <p className="line-clamp-3 break-words text-sm">
                  {leadPreview(item)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatLeadReceived(item.created_at)}
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  aria-label={`View ${inboxName(item)}`}
                  onClick={() => open(item)}
                >
                  View request
                </Button>
              </article>
            ))}
          </div>
        </>
      )}
      <nav
        aria-label="Leads pagination"
        className="flex flex-wrap items-center justify-between gap-3"
      >
        <Button
          variant="outline"
          onClick={() => setCursors([null])}
          disabled={cursors.length === 1 || busy}
        >
          Newest requests
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCursors((previous) => previous.slice(0, -1))}
            disabled={cursors.length === 1 || busy}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (data?.nextCursor)
                setCursors((previous) => [...previous, data.nextCursor]);
            }}
            disabled={!data?.nextCursor || busy || failed}
          >
            Older
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </nav>
      {highlightId && (
        <LeadDetailPanel
          key={`${source ?? "all"}-${highlightId}`}
          id={highlightId}
          source={source}
          onClose={() => onSelectionChange(null)}
          onUpdate={refresh}
        />
      )}
    </section>
  );
}
