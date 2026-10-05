import { InquiryDetailPanel } from "./InquiryDetailPanel";
import { markInquiryViewed } from "@/lib/inquiry/api";
import type { Inquiry } from "@/lib/inquiry/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { InboxDetailDialog } from "@/components/admin/inbox/InboxDetailDialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
    <Sheet
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent className="w-full sm:max-w-2xl h-dvh overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Request details</SheetTitle>
          <SheetDescription>
            {isPending || isFetching
              ? "Loading the saved request…"
              : "This request could not be opened."}
          </SheetDescription>
        </SheetHeader>
        {error && (
          <div role="alert" className="mt-6 space-y-4">
            <p>
              {error instanceof Error
                ? error.message
                : "Please retry to load the saved request."}
            </p>
            <Button variant="outline" onClick={() => void refetch()}>
              Retry request
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
