import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout, Home, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import HeroSlidesManager from "./HeroSlidesManager";
import { WhyChooseUsManager } from "@/components/admin/WhyChooseUsManager";
import { CompanyOverviewManager } from "@/components/admin/CompanyOverviewManager";

const HomepageBuilder = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const allowedTabs = new Set(["hero", "why-choose", "overview"]);
  const queryTab = searchParams.get("tab") || "hero";
  const initialTab = allowedTabs.has(queryTab) ? queryTab : "hero";

  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const nextTab = new Set(["hero", "why-choose", "overview"]).has(queryTab) ? queryTab : "hero";
    setActiveTab(nextTab);
  }, [queryTab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const nextParams = new URLSearchParams(searchParams);

    if (tab === "hero") {
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
        <h1 className="business-page-title">Homepage Builder</h1>
        <p className="business-page-subtitle">
          Manage all homepage content in one place - hero slides, company overview, and why choose us section
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hero" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            <span className="hidden sm:inline">Hero Slides</span>
          </TabsTrigger>
          <TabsTrigger value="why-choose" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Why Choose Us</span>
          </TabsTrigger>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Company Overview</span>
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
                Edit the key benefits and reasons customers should choose your company
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WhyChooseUsManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Overview</CardTitle>
              <CardDescription>
                Manage the company overview section including mission, vision, and values
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CompanyOverviewManager />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomepageBuilder;
