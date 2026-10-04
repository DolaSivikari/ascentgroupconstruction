import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, BarChart } from "lucide-react";
import { ServiceAnalyticsDashboard } from "@/components/admin/ServiceAnalyticsDashboard";
import { ServicesListManager } from "@/components/admin/ServicesListManager";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";

const ServicesManager = () => {
  const [activeTab, setActiveTab] = useState("list");

  return (
    <AdminPageLayout
      title="Services Manager"
      description="Manage all services - content and analytics"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">Services</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="business-glass-card">
            <div className="p-6 border-b border-border">
              <h3 className="business-section-title">Services List</h3>
              <p className="business-section-subtitle">
                Create, edit, and manage all service offerings
              </p>
            </div>
            <div className="p-6">
              <ServicesListManager />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="business-glass-card">
            <div className="p-6 border-b border-border">
              <h3 className="business-section-title">Service Analytics</h3>
              <p className="business-section-subtitle">
                Track service performance, engagement, and user interactions
              </p>
            </div>
            <div className="p-6">
              <ServiceAnalyticsDashboard />
            </div>
          </div>
        </TabsContent>

      </Tabs>
    </AdminPageLayout>
  );
};

export default ServicesManager;
