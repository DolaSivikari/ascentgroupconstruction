import { useState } from "react";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
import { InboxDashboard } from "@/components/admin/inbox/InboxDashboard";
import { InboxTable } from "@/components/admin/inbox/InboxTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function UnifiedInbox() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <AdminPageLayout
      title="📬 Unified Inbox"
      description="All communications in one place - RFPs, contacts, resumes, and more"
    >
      <div className="space-y-6">
        <InboxDashboard />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
