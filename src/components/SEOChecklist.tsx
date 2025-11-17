import { CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface SEOChecklistProps {
  completedItems?: string[];
}

const SEOChecklist = ({ completedItems = [] }: SEOChecklistProps) => {
  const seoTasks = [
    {
      category: "Technical SEO",
      tasks: [
        { id: "title-tags", name: "Title Tags (50-60 chars)", description: "All pages have unique, keyword-rich titles", critical: true },
        { id: "meta-desc", name: "Meta Descriptions (150-160 chars)", description: "Compelling descriptions for all pages", critical: true },
        { id: "header-tags", name: "H1 Tags", description: "Single H1 per page with primary keyword", critical: true },
        { id: "canonical", name: "Canonical URLs", description: "Prevent duplicate content issues", critical: true },
        { id: "robots-txt", name: "Robots.txt", description: "Properly configured with sitemap reference", critical: true },
        { id: "sitemap", name: "XML Sitemap", description: "Updated sitemap.xml submitted to search engines", critical: true },
        { id: "mobile", name: "Mobile Responsiveness", description: "Site works perfectly on all devices", critical: true },
        { id: "page-speed", name: "Page Speed", description: "Fast loading times (<3s)", critical: false },
        { id: "ssl", name: "HTTPS/SSL", description: "Secure connection enabled", critical: true },
        { id: "404", name: "404 Error Page", description: "Custom 404 page with navigation", critical: false },
      ]
    },
    {
      category: "On-Page SEO",
      tasks: [
        { id: "keywords", name: "Keyword Research", description: "Target keywords identified and mapped", critical: true },
        { id: "content", name: "Quality Content", description: "Original, valuable content on all pages", critical: true },
        { id: "images", name: "Image Alt Text", description: "All images have descriptive alt attributes", critical: true },
        { id: "internal-links", name: "Internal Linking", description: "Strategic internal links throughout site", critical: false },
        { id: "url-structure", name: "URL Structure", description: "Clean, descriptive URLs", critical: false },
        { id: "breadcrumbs", name: "Breadcrumb Navigation", description: "Helps users and search engines", critical: false },
      ]
    },
    {
      category: "Structured Data",
      tasks: [
        { id: "org-schema", name: "Organization Schema", description: "LocalBusiness/Organization markup", critical: true },
        { id: "service-schema", name: "Service Schema", description: "Schema for all services offered", critical: true },
        { id: "article-schema", name: "Article Schema", description: "Blog posts have Article schema", critical: false },
        { id: "breadcrumb-schema", name: "Breadcrumb Schema", description: "JSON-LD breadcrumb markup", critical: false },
        { id: "faq-schema", name: "FAQ Schema", description: "FAQ page has proper schema", critical: false },
        { id: "review-schema", name: "Review Schema", description: "Customer reviews marked up", critical: false },
      ]
    },
    {
      category: "Local SEO",
      tasks: [
        { id: "google-business", name: "Google Business Profile", description: "Claimed and optimized", critical: true },
        { id: "nap", name: "NAP Consistency", description: "Name, Address, Phone consistent everywhere", critical: true },
        { id: "local-citations", name: "Local Citations", description: "Listed in relevant directories", critical: false },
        { id: "geo-tags", name: "Geo Meta Tags", description: "Geographic targeting meta tags", critical: false },
        { id: "service-areas", name: "Service Area Pages", description: "Pages for key service locations", critical: false },
      ]
    },
    {
      category: "Social & Off-Page",
      tasks: [
        { id: "og-tags", name: "Open Graph Tags", description: "Facebook/LinkedIn sharing optimized", critical: true },
        { id: "twitter-cards", name: "Twitter Cards", description: "Twitter sharing optimized", critical: true },
        { id: "social-profiles", name: "Social Media Profiles", description: "Active on relevant platforms", critical: false },
        { id: "backlinks", name: "Quality Backlinks", description: "Building authoritative backlinks", critical: false },
      ]
    },
    {
      category: "Content Strategy",
      tasks: [
        { id: "blog", name: "Blog/News Section", description: "Regular fresh content", critical: false },
        { id: "case-studies", name: "Case Studies", description: "Showcase completed projects", critical: false },
        { id: "faq", name: "FAQ Page", description: "Answer common questions", critical: true },
        { id: "videos", name: "Video Content", description: "Engaging video content", critical: false },
      ]
    },
    {
      category: "Analytics & Monitoring",
      tasks: [
        { id: "google-analytics", name: "Google Analytics", description: "GA4 tracking installed", critical: true },
        { id: "search-console", name: "Google Search Console", description: "Property verified and monitored", critical: true },
        { id: "conversion-tracking", name: "Conversion Tracking", description: "Track form submissions, calls, etc", critical: true },
        { id: "performance", name: "Performance Monitoring", description: "Regular performance audits", critical: false },
      ]
    }
  ];

  const isCompleted = (taskId: string) => completedItems.includes(taskId);
  
  const totalTasks = seoTasks.reduce((acc, cat) => acc + cat.tasks.length, 0);
  const completedCount = seoTasks.reduce((acc, cat) => 
    acc + cat.tasks.filter(t => isCompleted(t.id)).length, 0
  );
  const criticalTasks = seoTasks.reduce((acc, cat) => 
    acc + cat.tasks.filter(t => t.critical).length, 0
  );
  const criticalCompleted = seoTasks.reduce((acc, cat) => 
    acc + cat.tasks.filter(t => t.critical && isCompleted(t.id)).length, 0
  );
  
  const progressPercent = Math.round((completedCount / totalTasks) * 100);
  const criticalProgress = Math.round((criticalCompleted / criticalTasks) * 100);

  return (
    <div className="space-y-6">
      <Card className="border-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">SEO Setup Checklist</CardTitle>
              <CardDescription>Complete all tasks to maximize search visibility</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{progressPercent}%</div>
              <div className="text-sm text-muted-foreground">
                {completedCount}/{totalTasks} Complete
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm mb-1">
              <span>Overall Progress</span>
              <span className="font-medium">{completedCount}/{totalTasks}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-sm mb-1 mt-4">
              <span className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                Critical Tasks
              </span>
              <span className="font-medium">{criticalCompleted}/{criticalTasks}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div 
                className="bg-destructive h-full transition-all duration-500 rounded-full"
                style={{ width: `${criticalProgress}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {seoTasks.map((category) => (
        <Card key={category.category}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{category.category}</span>
              <Badge variant="outline">
                {category.tasks.filter(t => isCompleted(t.id)).length}/{category.tasks.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {category.tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                    isCompleted(task.id) 
                      ? 'bg-primary/5 border-primary/20' 
                      : 'hover:bg-muted/50'
                  }`}
                >
                  {isCompleted(task.id) ? (
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-medium ${isCompleted(task.id) ? 'line-through text-muted-foreground' : ''}`}>
                        {task.name}
                      </span>
                      {task.critical && (
                        <Badge variant="destructive" className="text-xs">Critical</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {task.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="border-primary bg-primary/5">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2">🎯 Next Steps for Maximum Impact:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Submit sitemap to Google Search Console & Bing Webmaster Tools</li>
            <li>• Set up Google Business Profile with photos & regular updates</li>
            <li>• Add schema markup to all service and project pages</li>
            <li>• Create location-specific landing pages for key service areas</li>
            <li>• Build high-quality backlinks from industry directories</li>
            <li>• Optimize all images (compress, proper dimensions, alt text)</li>
            <li>• Publish new blog content weekly (1000+ words, keyword-optimized)</li>
            <li>• Get customer reviews on Google, Facebook, and industry sites</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SEOChecklist;
