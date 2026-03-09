import { AlertCircle, BarChart3, CheckCircle, FileText, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { SeoContentItem } from '@/pages/admin/seo/types';

interface Props {
  stats: {
    totalPages: number;
    avgSeoScore: number;
    totalViews: number;
    indexedPages: number;
  };
  contentItems: SeoContentItem[];
}

export const SEODashboardOverviewTab = ({ stats, contentItems }: Props) => (
  <>
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalPages}</div>
          <p className="text-xs text-muted-foreground">Pages optimized</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg SEO Score</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.avgSeoScore}</div>
          <p className="text-xs text-muted-foreground">Out of 100</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Last 30 days</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Indexed Pages</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.indexedPages}</div>
          <p className="text-xs text-muted-foreground">Published content</p>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Content SEO Status</CardTitle>
        <CardDescription>Recent pages and their SEO scores</CardDescription>
      </CardHeader>
      <CardContent>
        {contentItems.length === 0 ? (
          <div className="text-center space-y-3 py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="text-lg font-medium">No content available yet</p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Create blog posts, projects, and services to start tracking SEO performance.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {contentItems.slice(0, 10).map((item) => (
              <div key={item.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="info" className="text-xs">{item.type}</Badge>
                      <Badge variant={item.seoScore >= 80 ? 'success' : item.seoScore >= 60 ? 'warning' : 'danger'}>
                        {item.seoScore}/100
                      </Badge>
                    </div>
                    <p className="font-medium truncate">{item.displayTitle}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.url}</p>
                  </div>
                </div>
                {item.recommendations.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Recommendations:</p>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      {item.recommendations.slice(0, 3).map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  </>
);
