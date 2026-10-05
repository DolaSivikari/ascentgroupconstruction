import type { LeadFilters } from "@/lib/leads/model";
import { useSearchParams } from "react-router-dom";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
import { InboxDashboard } from "@/components/admin/inbox/InboxDashboard";
import { InboxTable } from "@/components/admin/inbox/InboxTable";
import { LeadsWorkspace } from "@/components/admin/leads/LeadsWorkspace";
import {
  isLeadSource,
  isLeadStatus,
  type LeadTypeFilter,
  type LeadRef,
} from "@/lib/leads/model";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const allowedTabs = new Set([
  "leads",
  "all",
  "work",
  "rfp",
  "contact",
  "resume",
  "prequal",
  "quote",
  "newsletter",
]);

export default function UnifiedInbox() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryTab = searchParams.get("tab") || "leads";
  const activeTab =
    queryTab === "work"
      ? "leads"
      : allowedTabs.has(queryTab)
        ? queryTab
        : "leads";
  const source = searchParams.get("source");
  const requestedType = searchParams.get("type");
  const requestedStatus = searchParams.get("status");
  const requestedSource = searchParams.get("lead_source");
  const initialType: LeadTypeFilter =
    requestedType &&
    [
      "all",
      "commercial",
      "estimate",
      "quote",
      "general",
      "rfp",
      "prequal",
      "bid",
    ].includes(requestedType)
      ? (requestedType as LeadTypeFilter)
      : queryTab === "work"
        ? "commercial"
        : "all";
  const handleSelectionChange = (ref: LeadRef | null) => {
    const next = new URLSearchParams(searchParams);
    if (ref) {
      next.set("highlight", ref.id);
      next.set("source", ref.source);
    } else {
      next.delete("highlight");
      next.delete("source");
    }
    setSearchParams(next, { replace: true });
  };

  const handleTabChange = (tab: string) => {
    const nextParams = new URLSearchParams(searchParams);

    if (tab === "leads") {
      nextParams.delete("tab");
      setSearchParams(nextParams, { replace: true });
      return;
    }

    nextParams.set("tab", tab);
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <AdminPageLayout
      title="Leads & Inbox"
      description="Review incoming requests, follow up with clients and manage all website communications"
    >
      <div className="space-y-6">
        <InboxDashboard />

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <div className="max-w-full overflow-x-auto pb-1">
            <TabsList className="w-max min-w-full justify-start">
              <TabsTrigger value="leads">Leads</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="rfp">RFPs</TabsTrigger>
              <TabsTrigger value="contact">Contacts</TabsTrigger>
              <TabsTrigger value="resume">Resumes</TabsTrigger>
              <TabsTrigger value="prequal">Prequalifications</TabsTrigger>
              <TabsTrigger value="quote">Quote Requests</TabsTrigger>
              <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="leads" className="mt-6">
            <LeadsWorkspace
              highlightId={searchParams.get("highlight")}
              source={isLeadSource(source) ? source : undefined}
              initialType={initialType}
              initialStatus={
                isLeadStatus(requestedStatus) ? requestedStatus : "open"
              }
              initialAttention={
                ["due", "overdue", "unassigned", "alerts"].includes(
                  searchParams.get("attention") || "",
                )
                  ? (searchParams.get("attention") as LeadFilters["attention"])
                  : undefined
              }
              initialSource={
                isLeadSource(requestedSource) ? requestedSource : undefined
              }
              onSelectionChange={handleSelectionChange}
            />
          </TabsContent>

          <TabsContent value="all" className="mt-6">
            <InboxTable
              type="all"
              highlightId={searchParams.get("highlight")}
            />
          </TabsContent>

          <TabsContent value="rfp" className="mt-6">
            <InboxTable
              type="rfp"
              highlightId={searchParams.get("highlight")}
            />
          </TabsContent>

          <TabsContent value="contact" className="mt-6">
            <InboxTable
              type="contact"
              highlightId={searchParams.get("highlight")}
            />
          </TabsContent>

          <TabsContent value="resume" className="mt-6">
            <InboxTable
              type="resume"
              highlightId={searchParams.get("highlight")}
            />
          </TabsContent>

          <TabsContent value="prequal" className="mt-6">
            <InboxTable
              type="prequal"
              highlightId={searchParams.get("highlight")}
            />
          </TabsContent>

          <TabsContent value="quote" className="mt-6">
            <InboxTable
              type="quote"
              highlightId={searchParams.get("highlight")}
            />
          </TabsContent>

          <TabsContent value="newsletter" className="mt-6">
            <InboxTable
              type="newsletter"
              highlightId={searchParams.get("highlight")}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AdminPageLayout>
  );
}
