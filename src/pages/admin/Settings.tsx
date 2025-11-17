import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Shield, MapPin, Info, Activity, FileText } from "lucide-react";
import { GeneralSettingsTab } from "@/components/admin/settings/GeneralSettingsTab";
import { FooterSettingsTab } from "@/components/admin/settings/FooterSettingsTab";
import { ContactPageSettingsTab } from "@/components/admin/settings/ContactPageSettingsTab";
import { AboutPageSettingsTab } from "@/components/admin/settings/AboutPageSettingsTab";
import { SecuritySettingsTab } from "@/components/admin/settings/SecuritySettingsTab";
import { HealthCheckTab } from "@/components/admin/settings/HealthCheckTab";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage all site-wide settings and configurations
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
