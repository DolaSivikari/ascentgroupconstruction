import { useEffect, useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import AIVisibilitySection from '@/components/admin/seo/AIVisibilitySection';
import { SEODashboardOverviewTab } from '@/components/admin/seo/SEODashboardOverviewTab';
// Analytics tab pulls in recharts (~90 KB gz). Lazy-load so it only ships when the user opens the Analytics tab.
const SEODashboardAnalyticsTab = lazy(() =>
  import('@/components/admin/seo/SEODashboardAnalyticsTab').then((m) => ({ default: m.SEODashboardAnalyticsTab }))
);
import { SEODashboardContentTab } from '@/components/admin/seo/SEODashboardContentTab';
import { SEODashboardSettingsTab } from '@/components/admin/seo/SEODashboardSettingsTab';
import { useSeoOverviewStats } from '@/hooks/admin/useSeoOverviewStats';
import { useSearchConsoleMetrics } from '@/hooks/admin/useSearchConsoleMetrics';
import { calculateSEOScore } from './seo/scoring';
import { DEFAULT_ROBOTS_TXT } from './seo/defaults';
import { supabase } from '@/integrations/supabase/client';
import type {
  AnalyticsSnapshot,
  SearchConsoleData,
  SeoContentItem,
  SEOSettings,
} from './seo/types';

interface ErrorWithMessage {
  message?: string;
}

const errMsg = (e: unknown, fallback: string) =>
  (typeof e === 'object' && e !== null && 'message' in e && (e as ErrorWithMessage).message) || fallback;

export default function SEODashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [seoSettings] = useState<SEOSettings[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSnapshot[]>([]);
  const [contentItems, setContentItems] = useState<SeoContentItem[]>([]);
  const [robotsTxt, setRobotsTxt] = useState('');
  const [generatingKeywords, setGeneratingKeywords] = useState(false);
  const [selectedContent, setSelectedContent] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [fetchingData, setFetchingData] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [checkingConnection, setCheckingConnection] = useState(true);
  const [searchConsoleData, setSearchConsoleData] = useState<SearchConsoleData[]>([]);
  const [dateRange, setDateRange] = useState<'7' | '30' | '90'>('30');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isSavingRobotsTxt, setIsSavingRobotsTxt] = useState(false);

  const overviewStats = useSeoOverviewStats(seoSettings, analytics, contentItems);
  const { metrics, dailyMetrics, topPages, topQueries, clicksChange, impressionsChange } =
    useSearchConsoleMetrics(searchConsoleData);

  // Auth + initial load + handle OAuth callback
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/tekev'); return; }
      setCurrentUserId(session.user.id);

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (!roleData || !['admin', 'super_admin'].includes(roleData.role)) {
        navigate('/admin');
        toast({ variant: 'destructive', title: 'Access Denied', description: 'You do not have permission to access the SEO Dashboard' });
      }
    };

    init();
    loadSEOData();
    checkGoogleConnection();

    const params = new URLSearchParams(window.location.search);
    const connected = params.get('gsc_connected');
    const error = params.get('gsc_error');

    if (connected === 'true') {
      toast({ title: 'Success', description: 'Google Search Console connected successfully!' });
      window.history.replaceState({}, '', '/admin/seo-dashboard');
      checkGoogleConnection();
    } else if (error) {
      toast({ variant: 'destructive', title: 'Connection Failed', description: decodeURIComponent(error) });
      window.history.replaceState({}, '', '/admin/seo-dashboard');
    }
  }, []);

  useEffect(() => {
    if (currentUserId) loadSearchConsoleData();
  }, [dateRange, currentUserId]);

  const loadSearchConsoleData = async () => {
    if (!currentUserId) return;
    try {
      const startDate = new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000);
      const { data, error } = await supabase
        .from('search_console_data')
        .select('*')
        .eq('user_id', currentUserId)
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (error) throw error;

      setSearchConsoleData(data || []);
      if (data && data.length > 0) {
        setLastSyncTime(new Date(data[data.length - 1].date).toLocaleDateString());
      }
    } catch (error) {
      console.error('Error loading Search Console data:', error);
    }
  };

  const checkGoogleConnection = async () => {
    try {
      setCheckingConnection(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return;

      const { data, error } = await supabase
        .from('google_auth_tokens')
        .select('user_id')
        .eq('user_id', session.user.id)
        .single();

      setIsConnected(!!data && !error);
    } catch (error) {
      console.error('Error checking Google connection:', error);
      setIsConnected(false);
    } finally {
      setCheckingConnection(false);
    }
  };

  const loadSEOData = async () => {
    try {
      setLoading(true);
      const [blogRes, servicesRes, projectsRes, analyticsRes] = await Promise.all([
        supabase.from('blog_posts').select('id, slug, title, seo_title, seo_description, seo_keywords, featured_image, content, publish_state, updated_at').eq('publish_state', 'published').order('updated_at', { ascending: false }).limit(10),
        supabase.from('services').select('id, slug, name, seo_title, seo_description, seo_keywords, featured_image, long_description, publish_state, updated_at').eq('publish_state', 'published').order('updated_at', { ascending: false }).limit(10),
        supabase.from('projects').select('id, slug, title, seo_title, seo_description, seo_keywords, featured_image, description, publish_state, updated_at').eq('publish_state', 'published').order('updated_at', { ascending: false }).limit(10),
        supabase.from('analytics_snapshots').select('*').gte('snapshot_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()).order('page_views', { ascending: false }).limit(10),
      ]);

      const items: SeoContentItem[] = [];

      blogRes.data?.forEach((post) => {
        const { score, recommendations } = calculateSEOScore(post, 'blog');
        items.push({
          id: post.id,
          type: 'Blog Post',
          displayTitle: post.title,
          seoScore: score,
          recommendations,
          url: `/blog/${post.slug}`,
        });
      });

      servicesRes.data?.forEach((service) => {
        const { score, recommendations } = calculateSEOScore(service, 'service');
        items.push({
          id: service.id,
          type: 'Service',
          displayTitle: service.name,
          seoScore: score,
          recommendations,
          url: `/services/${service.slug}`,
        });
      });

      projectsRes.data?.forEach((project) => {
        const { score, recommendations } = calculateSEOScore(project, 'project');
        items.push({
          id: project.id,
          type: 'Project',
          displayTitle: project.title,
          seoScore: score,
          recommendations,
          url: `/projects/${project.slug}`,
        });
      });

      setContentItems(items);
      if (analyticsRes.data) setAnalytics(analyticsRes.data);

      const { data: settings } = await supabase
        .from('site_settings')
        .select('robots_txt')
        .eq('is_active', true)
        .single();

      setRobotsTxt(
        settings?.robots_txt ||
          `User-agent: *\nAllow: /\nSitemap: ${window.location.origin}/sitemap.xml`,
      );
    } catch (error) {
      console.error('Error loading SEO data:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load SEO data' });
    } finally {
      setLoading(false);
    }
  };

  const generateKeywordSuggestions = async () => {
    if (!selectedContent) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter content to analyze' });
      return;
    }
    try {
      setGeneratingKeywords(true);
      const { data, error } = await supabase.functions.invoke('generate-keywords', { body: { content: selectedContent } });
      if (error) throw error;
      toast({ title: 'Keywords Generated', description: `Found ${data.keywords?.length || 0} relevant keywords` });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: errMsg(error, 'Failed to generate keywords') });
    } finally {
      setGeneratingKeywords(false);
    }
  };

  const saveRobotsTxt = async () => {
    try {
      setIsSavingRobotsTxt(true);
      if (!robotsTxt.includes('User-agent:')) {
        toast({ variant: 'destructive', title: 'Invalid robots.txt', description: 'Must contain at least one User-agent directive' });
        return;
      }
      if (!robotsTxt.includes('Sitemap:')) {
        toast({ title: 'Warning', description: 'robots.txt should include a Sitemap directive' });
      }
      const { error } = await supabase
        .from('site_settings')
        .update({ robots_txt: robotsTxt, updated_at: new Date().toISOString() })
        .eq('is_active', true);
      if (error) throw error;
      toast({ title: 'Success', description: 'Robots.txt updated successfully! Changes will be live after next deployment.' });
    } catch (error) {
      console.error('Error saving robots.txt:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save robots.txt' });
    } finally {
      setIsSavingRobotsTxt(false);
    }
  };

  const resetRobotsTxtToDefault = () => {
    setRobotsTxt(DEFAULT_ROBOTS_TXT);
    toast({ title: 'Reset Complete', description: 'Robots.txt reset to default. Click Save to apply changes.' });
  };

  const regenerateSitemap = async () => {
    try {
      toast({ title: 'Generating Sitemap', description: 'Please wait while we regenerate your sitemap...' });
      const { data, error } = await supabase.functions.invoke('generate-sitemap');
      if (error) throw error;
      await supabase.from('sitemap_logs').insert({ url_count: data.url_count, status: 'success' });
      toast({ title: 'Success', description: `Sitemap generated with ${data.url_count} URLs` });
    } catch (error) {
      const message = errMsg(error, 'Failed to generate sitemap');
      await supabase.from('sitemap_logs').insert({ url_count: 0, status: 'error', error_message: message });
      toast({ variant: 'destructive', title: 'Error', description: message });
    }
  };

  const connectGoogleSearchConsole = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('google-search-console-auth');
      if (error) {
        console.error('Error getting auth URL:', error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to initiate Google Search Console connection' });
        return;
      }
      if (data?.authUrl) {
        window.location.href = data.authUrl;
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to get authorization URL' });
      }
    } catch (error) {
      console.error('Error connecting to Google Search Console:', error);
      toast({ variant: 'destructive', title: 'Error', description: errMsg(error, 'Failed to connect to Google Search Console') });
    }
  };

  const fetchSearchConsoleData = async () => {
    if (!siteUrl) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter a website URL' });
      return;
    }
    try {
      setFetchingData(true);
      toast({ title: 'Fetching Data', description: 'Retrieving Search Console data...' });

      let formattedSiteUrl = siteUrl.trim();
      if (!formattedSiteUrl.startsWith('http') && !formattedSiteUrl.startsWith('sc-domain:')) {
        formattedSiteUrl = `sc-domain:${formattedSiteUrl}`;
      }

      const { data, error } = await supabase.functions.invoke('fetch-search-console-data', {
        body: {
          siteUrl: formattedSiteUrl,
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
        },
      });

      if (error) throw error;
      toast({ title: 'Success', description: `Fetched ${data.rowCount || 0} rows of Search Console data` });
      await loadSearchConsoleData();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: errMsg(error, 'Failed to fetch Search Console data') });
    } finally {
      setFetchingData(false);
    }
  };

  if (loading) {
    return (
      <AdminPageLayout title="SEO Dashboard" description="Optimize your content for search engines">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title="SEO Dashboard"
      description="Optimize your content for search engines and monitor search performance"
    >
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Search Analytics</TabsTrigger>
          <TabsTrigger value="content">Content SEO</TabsTrigger>
          <TabsTrigger value="ai-visibility">
            <Bot className="h-4 w-4 mr-1" />
            AI Visibility
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <SEODashboardOverviewTab stats={overviewStats} contentItems={contentItems} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            }
          >
            <SEODashboardAnalyticsTab
              isConnected={isConnected}
              checkingConnection={checkingConnection}
              lastSyncTime={lastSyncTime}
              siteUrl={siteUrl}
              setSiteUrl={setSiteUrl}
              dateRange={dateRange}
              setDateRange={setDateRange}
              fetchingData={fetchingData}
              searchConsoleData={searchConsoleData}
              metrics={metrics}
              dailyMetrics={dailyMetrics}
              topPages={topPages}
              topQueries={topQueries}
              clicksChange={clicksChange}
              impressionsChange={impressionsChange}
              onConnect={connectGoogleSearchConsole}
              onFetch={fetchSearchConsoleData}
            />
          </Suspense>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <SEODashboardContentTab
            selectedContent={selectedContent}
            setSelectedContent={setSelectedContent}
            generatingKeywords={generatingKeywords}
            onGenerateKeywords={generateKeywordSuggestions}
            onRegenerateSitemap={regenerateSitemap}
          />
        </TabsContent>

        <TabsContent value="ai-visibility" className="space-y-6">
          <AIVisibilitySection />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <SEODashboardSettingsTab
            robotsTxt={robotsTxt}
            setRobotsTxt={setRobotsTxt}
            isSaving={isSavingRobotsTxt}
            onSave={saveRobotsTxt}
            onReset={resetRobotsTxtToDefault}
          />
        </TabsContent>
      </Tabs>
    </AdminPageLayout>
  );
}
