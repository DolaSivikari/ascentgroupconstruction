import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout, Home, Sparkles, Award } from "lucide-react";
import HeroSlidesManager from "./HeroSlidesManager";
import StatsManager from "./StatsManager";
import { WhyChooseUsManager } from "@/components/admin/WhyChooseUsManager";
import { CompanyOverviewManager } from "@/components/admin/CompanyOverviewManager";

const HomepageBuilder = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const allowedTabs = new Set(["hero", "why-choose", "overview", "stats"]);
  const queryTab = searchParams.get("tab") || "hero";
  const initialTab = allowedTabs.has(queryTab) ? queryTab : "hero";

  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const nextTab = new Set(["hero", "why-choose", "overview", "stats"]).has(queryTab) ? queryTab : "hero";
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
        <TabsList className="grid w-full grid-cols-4">
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
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            <span className="hidden sm:inline">Stats & Badges</span>
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

        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stats & Badges</CardTitle>
              <CardDescription>
                Manage company statistics and certification badges displayed on the homepage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5" />
                <span>Truth label: Stats content is not currently displayed on the public homepage composition.</span>
                <span>
                  Truth label: Stats content is not currently rendered on the public homepage in the active page composition.
                </span>
              </div>
              <StatsManager />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomepageBuilder;
