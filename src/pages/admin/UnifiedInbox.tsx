import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
import { InboxDashboard } from "@/components/admin/inbox/InboxDashboard";
import { InboxTable } from "@/components/admin/inbox/InboxTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function UnifiedInbox() {
  const [searchParams, setSearchParams] = useSearchParams();
  const allowedTabs = new Set(["all", "rfp", "contact", "resume", "prequal", "quote", "newsletter"]);
  const queryTab = searchParams.get("tab") || "all";
  const initialTab = allowedTabs.has(queryTab) ? queryTab : "all";

  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const nextTab = new Set(["all", "rfp", "contact", "resume", "prequal", "quote", "newsletter"]).has(queryTab) ? queryTab : "all";
    setActiveTab(nextTab);
  }, [queryTab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const nextParams = new URLSearchParams(searchParams);

    if (tab === "all") {
      nextParams.delete("tab");
      setSearchParams(nextParams, { replace: true });
      return;
    }

    nextParams.set("tab", tab);
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <AdminPageLayout
      title="Unified Inbox"
      description="All communications in one place - RFPs, contacts, resumes, and more"
    >
      <div className="space-y-6">
        <InboxDashboard />

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="rfp">RFPs</TabsTrigger>
            <TabsTrigger value="contact">Contacts</TabsTrigger>
            <TabsTrigger value="resume">Resumes</TabsTrigger>
            <TabsTrigger value="prequal">Prequalifications</TabsTrigger>
            <TabsTrigger value="quote">Quote Requests</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <InboxTable type="all" />
          </TabsContent>

          <TabsContent value="rfp" className="mt-6">
            <InboxTable type="rfp" />
          </TabsContent>

          <TabsContent value="contact" className="mt-6">
            <InboxTable type="contact" />
          </TabsContent>

          <TabsContent value="resume" className="mt-6">
            <InboxTable type="resume" />
          </TabsContent>

          <TabsContent value="prequal" className="mt-6">
            <InboxTable type="prequal" />
          </TabsContent>

          <TabsContent value="quote" className="mt-6">
            <InboxTable type="quote" />
          </TabsContent>

          <TabsContent value="newsletter" className="mt-6">
            <InboxTable type="newsletter" />
          </TabsContent>
        </Tabs>
      </div>
    </AdminPageLayout>
  );
}
