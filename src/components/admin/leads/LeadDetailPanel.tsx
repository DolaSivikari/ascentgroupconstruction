import { InquiryDetailPanel } from "./InquiryDetailPanel";
import { markInquiryViewed } from "@/lib/inquiry/api";
import type { Inquiry } from "@/lib/inquiry/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { InboxDetailDialog } from "@/components/admin/inbox/InboxDetailDialog";
import { RequestDetailShell } from "@/components/admin/requests/RequestDetailShell";
import { Button } from "@/ui/Button";
import { loadLeadDetail } from "@/lib/leads/api";
import type { LeadSource } from "@/lib/leads/model";
import type { InboxItem } from "@/lib/inbox/model";

interface LeadDetailPanelProps {
  id: string;
  source?: LeadSource;
  onClose: () => void;
  onUpdate: () => void;
}
export function LeadDetailPanel({
  id,
  source,
  onClose,
  onUpdate,
}: LeadDetailPanelProps) {
  const [loadedItem, setLoadedItem] = useState<InboxItem | null>(null);
  const { data, isPending, isFetching, error, refetch } = useQuery({
    queryKey: ["lead-detail", source ?? "all", id],
    queryFn: async ({ signal }) => {
      if (source === "inquiry") await markInquiryViewed(id);
      return loadLeadDetail({ id, source }, signal);
    },
    staleTime: 0,
    refetchOnMount: "always",
    retry: false,
  });
  useEffect(() => {
    // Never initialize an editor from cached data while its fresh read is still
    // running. Once opened, retain its baseline and draft through background reads.
    if (!isFetching && data && !error)
      setLoadedItem((previous) => previous ?? data);
  }, [data, error, isFetching]);
  if (loadedItem?.table === "inquiries")
    return (
      <InquiryDetailPanel
        inquiry={loadedItem as unknown as Inquiry}
        onClose={onClose}
        onUpdate={onUpdate}
      />
    );
  if (loadedItem)
    return (
      <InboxDetailDialog
        key={`${loadedItem.table}-${loadedItem.id}`}
        item={loadedItem}
        open
        onClose={onClose}
        onUpdate={onUpdate}
        presentation="panel"
        allowDelete={false}
      />
    );
  return (
    <RequestDetailShell
      name="Request details"
      onClose={onClose}
      type="Request"
      description={
        isPending || isFetching
          ? "Loading the saved request…"
          : "This request could not be opened."
      }
      footer={
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      }
    >
      {isPending || isFetching ? (
        <div
          className="space-y-3 py-6"
          role="status"
          aria-label="Loading request"
        >
          <div className="h-36 animate-pulse rounded-xl bg-muted" />
          <div className="h-56 animate-pulse rounded-xl bg-muted" />
        </div>
      ) : (
        error && (
          <div
            role="alert"
            className="my-6 space-y-4 rounded-xl border border-destructive/40 bg-card p-5"
          >
            <p>
              {error instanceof Error
                ? error.message
                : "Please retry to load the saved request."}
            </p>
            <Button variant="outline" onClick={() => void refetch()}>
              Retry request
            </Button>
          </div>
        )
      )}
    </RequestDetailShell>
  );
}
