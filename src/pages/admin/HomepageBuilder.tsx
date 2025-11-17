import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout, Home, Sparkles, Award } from "lucide-react";
import HeroSlidesManager from "./HeroSlidesManager";
import StatsManager from "./StatsManager";
import { WhyChooseUsManager } from "@/components/admin/WhyChooseUsManager";
import { CompanyOverviewManager } from "@/components/admin/CompanyOverviewManager";

const HomepageBuilder = () => {
  const [activeTab, setActiveTab] = useState("hero");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Homepage Builder</h1>
        <p className="text-muted-foreground mt-2">
          Manage all homepage content in one place - hero slides, company overview, and why choose us section
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
            <CardContent>
              <StatsManager />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomepageBuilder;
