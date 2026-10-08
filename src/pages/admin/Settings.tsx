import { NotificationsSettingsTab } from "@/components/admin/settings/NotificationsSettingsTab";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings as SettingsIcon,
  MapPin,
  Info,
  Activity,
  FileText,
} from "lucide-react";
import { GeneralSettingsTab } from "@/components/admin/settings/GeneralSettingsTab";
import { FooterSettingsTab } from "@/components/admin/settings/FooterSettingsTab";
import { ContactPageSettingsTab } from "@/components/admin/settings/ContactPageSettingsTab";
import { AboutPageSettingsTab } from "@/components/admin/settings/AboutPageSettingsTab";
import { HealthCheckTab } from "@/components/admin/settings/HealthCheckTab";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";

const Settings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const allowedTabs = new Set([
    "general",
    "footer",
    "contact",
    "about",
    "health",
    "notifications",
  ]);
  const queryTab = searchParams.get("tab") || "general";
  const initialTab = allowedTabs.has(queryTab) ? queryTab : "general";

  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const nextTab = new Set([
      "general",
      "footer",
      "contact",
      "about",
      "health",
      "notifications",
    ]).has(queryTab)
      ? queryTab
      : "general";
    setActiveTab(nextTab);
  }, [queryTab]);

  const handleTabChange = (tab: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("section");

    if (tab === "general") {
      nextParams.delete("tab");
      setSearchParams(nextParams);
      return;
    }

    nextParams.set("tab", tab);
    setSearchParams(nextParams);
  };

  return (
    <AdminPageLayout
      title="Settings"
      description="Manage all site-wide settings and configurations"
    >
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 xl:grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-1 px-1">
            <SettingsIcon className="h-4 w-4" />
            <span className="text-xs sm:text-sm">General</span>
          </TabsTrigger>
          <TabsTrigger value="footer" className="flex items-center gap-1 px-1">
            <FileText className="h-4 w-4" />
            <span className="text-xs sm:text-sm">Footer</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-1 px-1">
            <MapPin className="h-4 w-4" />
            <span className="text-xs sm:text-sm">Contact</span>
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center gap-1 px-1">
            <Info className="h-4 w-4" />
            <span className="text-xs sm:text-sm">About</span>
          </TabsTrigger>
          <TabsTrigger value="health" className="flex items-center gap-1 px-1">
            <Activity className="h-4 w-4" />
            <span className="text-xs sm:text-sm">Health</span>
          </TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <GeneralSettingsTab />
        </TabsContent>

        <TabsContent value="footer" className="space-y-4">
          <FooterSettingsTab />
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <ContactPageSettingsTab />
        </TabsContent>

        <TabsContent value="about" className="space-y-4">
          <AboutPageSettingsTab />
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <HealthCheckTab />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationsSettingsTab />
        </TabsContent>
      </Tabs>
    </AdminPageLayout>
  );
};

export default Settings;
