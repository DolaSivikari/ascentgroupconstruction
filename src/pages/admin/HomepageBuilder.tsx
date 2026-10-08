import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";

import HeroSlidesManager from "./HeroSlidesManager";
import { WhyChooseUsManager } from "@/components/admin/WhyChooseUsManager";

const HomepageBuilder = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const allowedTabs = new Set(["hero", "why-choose"]);
  const queryTab = searchParams.get("tab") || "hero";
  const initialTab = allowedTabs.has(queryTab) ? queryTab : "hero";

  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const nextTab = new Set(["hero", "why-choose"]).has(queryTab)
      ? queryTab
      : "hero";
    setActiveTab(nextTab);
  }, [queryTab]);

  const handleTabChange = (tab: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("section");
    nextParams.delete("slide-section");

    if (tab === "hero") {
      nextParams.delete("tab");
      setSearchParams(nextParams);
      return;
    }

    nextParams.set("tab", tab);
    setSearchParams(nextParams);
  };

  return (
    <AdminPageLayout
      title="Homepage Builder"
      description="Manage all homepage content in one place — hero slides and why choose us section"
    >
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="hero" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            <span className="hidden sm:inline">Hero Slides</span>
          </TabsTrigger>
          <TabsTrigger value="why-choose" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Why Choose Us</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Carousel</CardTitle>
              <CardDescription>
                Manage the main carousel slides that appear on the homepage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HeroSlidesManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="why-choose" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Why Choose Us Section</CardTitle>
              <CardDescription>
                Edit the key benefits and reasons customers should choose your
                company
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WhyChooseUsManager />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminPageLayout>
  );
};

export default HomepageBuilder;
