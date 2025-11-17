import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, ExternalLink, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface HealthIssue {
  severity: "error" | "warning" | "info";
  category: string;
  title: string;
  description: string;
  count?: number;
  affectedItems?: Array<{ id: string; title: string; url?: string }>;
}

export const ContentHealthCheck = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [issues, setIssues] = useState<HealthIssue[]>([]);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    runHealthCheck();
  }, []);

  const runHealthCheck = async () => {
    setIsLoading(true);
    const foundIssues: HealthIssue[] = [];

    try {
      // Check 1: Missing SEO Data
      const { data: servicesNoSEO } = await supabase
        .from("services")
        .select("id, name, slug")
        .or("seo_title.is.null,seo_description.is.null")
        .eq("publish_state", "published");

      if (servicesNoSEO && servicesNoSEO.length > 0) {
        foundIssues.push({
          severity: "warning",
          category: "SEO",
          title: "Services Missing SEO Data",
          description: `${servicesNoSEO.length} published services are missing SEO title or description`,
          count: servicesNoSEO.length,
          affectedItems: servicesNoSEO.map(s => ({ id: s.id, title: s.name, url: `/admin/services/${s.id}` }))
        });
      }

      const { data: postsNoSEO } = await supabase
        .from("blog_posts")
        .select("id, title, slug")
        .or("seo_title.is.null,seo_description.is.null")
        .eq("publish_state", "published");

      if (postsNoSEO && postsNoSEO.length > 0) {
        foundIssues.push({
          severity: "warning",
          category: "SEO",
          title: "Blog Posts Missing SEO Data",
          description: `${postsNoSEO.length} published posts are missing SEO title or description`,
          count: postsNoSEO.length,
          affectedItems: postsNoSEO.map(p => ({ id: p.id, title: p.title, url: `/admin/blog/${p.id}` }))
        });
      }

      const { data: projectsNoSEO } = await supabase
        .from("projects")
        .select("id, title, slug")
        .or("seo_title.is.null,seo_description.is.null")
        .eq("publish_state", "published");

      if (projectsNoSEO && projectsNoSEO.length > 0) {
        foundIssues.push({
          severity: "warning",
          category: "SEO",
          title: "Projects Missing SEO Data",
          description: `${projectsNoSEO.length} published projects are missing SEO title or description`,
          count: projectsNoSEO.length,
          affectedItems: projectsNoSEO.map(p => ({ id: p.id, title: p.title, url: `/admin/projects/${p.id}` }))
        });
      }

      // Check 2: Missing Featured Images
      const { data: postsNoImage } = await supabase
        .from("blog_posts")
        .select("id, title, slug")
        .or("featured_image.is.null,featured_image.eq.")
        .eq("publish_state", "published");

      if (postsNoImage && postsNoImage.length > 0) {
        foundIssues.push({
          severity: "info",
          category: "Content",
          title: "Blog Posts Without Featured Images",
          description: `${postsNoImage.length} published posts are missing featured images`,
          count: postsNoImage.length,
          affectedItems: postsNoImage.map(p => ({ id: p.id, title: p.title, url: `/admin/blog/${p.id}` }))
        });
      }

      // Check 3: Images Without Alt Text
      const { data: imagesNoAlt } = await supabase
        .from("documents_library")
        .select("id, title, file_url")
        .eq("category", "image")
        .or("alt_text.is.null,alt_text.eq.")
        .eq("is_active", true);

      if (imagesNoAlt && imagesNoAlt.length > 0) {
        foundIssues.push({
          severity: "warning",
          category: "Accessibility",
          title: "Images Missing Alt Text",
          description: `${imagesNoAlt.length} active images don't have alt text for screen readers`,
          count: imagesNoAlt.length,
          affectedItems: imagesNoAlt.map(i => ({ id: i.id, title: i.title, url: `/admin/media` }))
        });
      }

      // Check 4: Draft Content Older Than 30 Days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: staleDrafts } = await supabase
        .from("blog_posts")
        .select("id, title, created_at")
        .eq("publish_state", "draft")
        .lt("created_at", thirtyDaysAgo.toISOString());

      if (staleDrafts && staleDrafts.length > 0) {
        foundIssues.push({
          severity: "info",
          category: "Content",
          title: "Stale Draft Content",
          description: `${staleDrafts.length} drafts haven't been updated in over 30 days`,
          count: staleDrafts.length,
          affectedItems: staleDrafts.map(d => ({ id: d.id, title: d.title, url: `/admin/blog/${d.id}` }))
        });
      }

      // Check 5: Content Awaiting Review
      const { data: pendingReview } = await supabase
        .from("blog_posts")
        .select("id, title")
        .eq("publish_state", "review");

      if (pendingReview && pendingReview.length > 0) {
        foundIssues.push({
          severity: "info",
          category: "Workflow",
          title: "Content Awaiting Review",
          description: `${pendingReview.length} items are ready for admin approval`,
          count: pendingReview.length,
          affectedItems: pendingReview.map(p => ({ id: p.id, title: p.title, url: `/admin/blog/${p.id}` }))
        });
      }

      setIssues(foundIssues);
      setLastChecked(new Date());
    } catch (error) {
      console.error("Health check error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: HealthIssue["severity"]) => {
    switch (severity) {
      case "error": return "bg-destructive text-destructive-foreground";
      case "warning": return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "info": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    }
  };

  const getSeverityIcon = (severity: HealthIssue["severity"]) => {
    return severity === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Content Health Check</CardTitle>
            <CardDescription>
              {lastChecked && `Last checked: ${lastChecked.toLocaleTimeString()}`}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={runHealthCheck} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : issues.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <p className="font-semibold">All Clear!</p>
            <p className="text-sm text-muted-foreground">No issues found with your content</p>
          </div>
        ) : (
          <div className="space-y-4">
            {issues.map((issue, idx) => (
              <div key={idx} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(issue.severity)}
                    <div>
                      <p className="font-semibold">{issue.title}</p>
                      <p className="text-sm text-muted-foreground">{issue.description}</p>
                    </div>
                  </div>
                  <Badge className={getSeverityColor(issue.severity)}>
                    {issue.category}
                  </Badge>
                </div>
                
                {issue.affectedItems && issue.affectedItems.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Affected Items:</p>
                    <div className="space-y-1">
                      {issue.affectedItems.slice(0, 3).map(item => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <span className="truncate">{item.title}</span>
                          {item.url && (
                            <Button variant="ghost" size="sm" asChild>
                              <a href={item.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          )}
                        </div>
                      ))}
                      {issue.affectedItems.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{issue.affectedItems.length - 3} more
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
