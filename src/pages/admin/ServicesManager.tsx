import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, BarChart, Star, Megaphone } from "lucide-react";
import { ServiceAnalyticsDashboard } from "@/components/admin/ServiceAnalyticsDashboard";
import { FeaturedServicesManager } from "@/components/admin/FeaturedServicesManager";
import { PromotionsManager } from "@/components/admin/PromotionsManager";
import { ServicesListManager } from "@/components/admin/ServicesListManager";

const ServicesManager = () => {
  const [activeTab, setActiveTab] = useState("list");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="business-page-title">Services Manager</h1>
        <p className="business-page-subtitle">
          Manage all services - content, analytics, featured services, and promotions
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">Services</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="featured" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            <span className="hidden sm:inline">Featured</span>
          </TabsTrigger>
          <TabsTrigger value="promotions" className="flex items-center gap-2">
            <Megaphone className="h-4 w-4" />
            <span className="hidden sm:inline">Promotions</span>
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

        <TabsContent value="featured" className="space-y-4">
          <div className="business-glass-card">
            <div className="p-6 border-b border-border">
              <h3 className="business-section-title">Featured Services</h3>
              <p className="business-section-subtitle">
                Manage featured services displayed on the homepage
              </p>
            </div>
            <div className="p-6">
              <FeaturedServicesManager />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="promotions" className="space-y-4">
          <div className="business-glass-card">
            <div className="p-6 border-b border-border">
              <h3 className="business-section-title">Service Promotions</h3>
              <p className="business-section-subtitle">
                Create and manage promotional campaigns for services
              </p>
            </div>
            <div className="p-6">
              <PromotionsManager />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ServicesManager;
