import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Shield, MapPin, Info, Activity, FileText } from "lucide-react";
import { GeneralSettingsTab } from "@/components/admin/settings/GeneralSettingsTab";
import { FooterSettingsTab } from "@/components/admin/settings/FooterSettingsTab";
import { ContactPageSettingsTab } from "@/components/admin/settings/ContactPageSettingsTab";
import { AboutPageSettingsTab } from "@/components/admin/settings/AboutPageSettingsTab";
import { SecuritySettingsTab } from "@/components/admin/settings/SecuritySettingsTab";
import { HealthCheckTab } from "@/components/admin/settings/HealthCheckTab";

const Settings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const allowedTabs = new Set(["general", "footer", "contact", "about", "security", "health"]);
  const queryTab = searchParams.get("tab") || "general";
  const initialTab = allowedTabs.has(queryTab) ? queryTab : "general";

  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const nextTab = new Set(["general", "footer", "contact", "about", "security", "health"]).has(queryTab) ? queryTab : "general";
    setActiveTab(nextTab);
  }, [queryTab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const nextParams = new URLSearchParams(searchParams);

    if (tab === "general") {
      nextParams.delete("tab");
      setSearchParams(nextParams, { replace: true });
      return;
    }

    nextParams.set("tab", tab);
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="business-page-title">Settings</h1>
        <p className="business-page-subtitle">
          Manage all site-wide settings and configurations
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="footer" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Footer</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Contact</span>
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">About</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="health" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Health</span>
          </TabsTrigger>
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

        <TabsContent value="security" className="space-y-4">
          <SecuritySettingsTab />
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <HealthCheckTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
