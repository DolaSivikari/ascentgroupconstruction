import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/ui/Button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RefreshCw, ExternalLink, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface SitemapLog {
  id: string;
  url_count: number;
  status: string;
  error_message: string | null;
  created_at: string;
}

export const SitemapManager = () => {
  const [logs, setLogs] = useState<SitemapLog[]>([]);
  const [generating, setGenerating] = useState(false);
  const [sitemapContent, setSitemapContent] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('sitemap_logs' as any)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10) as any;

      if (error) throw error;
      setLogs((data || []) as SitemapLog[]);
    } catch (error) {
      console.error('Error loading sitemap logs:', error);
    }
  };

  const generateSitemap = async () => {
    setGenerating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('You must be logged in to generate sitemap');
        return;
      }

      const response = await supabase.functions.invoke('generate-sitemap', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) throw response.error;

      setSitemapContent(response.data);
      toast.success(`Sitemap generated with ${response.data.split('<url>').length - 1} URLs`);
      loadLogs();
    } catch (error: any) {
      console.error('Error generating sitemap:', error);
      toast.error('Failed to generate sitemap');
    } finally {
      setGenerating(false);
    }
  };

  const viewLiveSitemap = () => {
    window.open('https://ascentgroupconstruction.com/sitemap.xml', '_blank');
  };

  const latestLog = logs[0];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Dynamic Sitemap
            </CardTitle>
            <CardDescription>
              Automatically generated from published content
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={viewLiveSitemap}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Live
            </Button>
            <Button
              size="sm"
              onClick={generateSitemap}
              disabled={generating}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
              {generating ? 'Generating...' : 'Regenerate'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {latestLog && (
          <div className="border rounded-lg p-4 bg-muted/30">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {latestLog.status === 'success' ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  )}
                  <span className="font-semibold">Latest Generation</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(latestLog.created_at), 'PPpp')}
                </p>
              </div>
              <Badge variant={latestLog.status === 'success' ? 'default' : 'destructive'}>
                {latestLog.status === 'success'
                  ? `${latestLog.url_count} URLs`
                  : 'Failed'}
              </Badge>
            </div>
            {latestLog.error_message && (
              <p className="text-sm text-destructive mt-2">
                Error: {latestLog.error_message}
              </p>
            )}
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Recent Generations</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? 'Hide' : 'Show'} Preview
            </Button>
          </div>

          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {log.status === 'success' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                    )}
                    <div className="text-sm">
                      <span className="text-muted-foreground">
                        {format(new Date(log.created_at), 'PPp')}
                      </span>
                      {log.error_message && (
                        <p className="text-xs text-destructive mt-1">
                          {log.error_message}
                        </p>
                      )}
                    </div>
                  </div>
                  {log.status === 'success' && (
                    <Badge variant="secondary">{log.url_count} URLs</Badge>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {showPreview && sitemapContent && (
          <div>
            <h3 className="font-semibold mb-3">Sitemap Preview</h3>
            <ScrollArea className="h-[300px] border rounded-lg p-4 bg-muted/30">
              <pre className="text-xs font-mono">{sitemapContent}</pre>
            </ScrollArea>
          </div>
        )}

        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>📡 Auto-Sync:</strong> The sitemap is automatically regenerated
            whenever you publish/unpublish services, projects, or blog posts. You can
            manually trigger a regeneration anytime using the button above.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};