import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
        <h1 className="text-3xl font-bold tracking-tight">Services Manager</h1>
        <p className="text-muted-foreground mt-2">
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
          <Card>
            <CardHeader>
              <CardTitle>Services List</CardTitle>
              <CardDescription>
                Create, edit, and manage all service offerings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ServicesListManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Analytics</CardTitle>
              <CardDescription>
                Track service performance, engagement, and user interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ServiceAnalyticsDashboard />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="featured" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Featured Services</CardTitle>
              <CardDescription>
                Manage featured services displayed on the homepage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FeaturedServicesManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promotions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Promotions</CardTitle>
              <CardDescription>
                Create and manage promotional campaigns for services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PromotionsManager />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ServicesManager;
