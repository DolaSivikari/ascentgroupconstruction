import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  Users, 
  Mail,
  LogOut,
  DollarSign,
  AlertCircle,
  TrendingUp,
  Shield,
  Settings,
  Activity,
  Search,
  Layout,
  Package,
  Image,
  Navigation,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import MetricCard from "@/components/admin/MetricCard";
import QuickActions from "@/components/admin/QuickActions";
import ActivityFeed from "@/components/admin/ActivityFeed";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { ScrollReveal } from "@/components/animations/ScrollReveal";


const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoading: authLoading, isAdmin } = useAdminAuth();
  const [user, setUser] = useState<any>(null);
  const [statsLoaded, setStatsLoaded] = useState(false);
  const [stats, setStats] = useState({
    projects: 0,
    services: 0,
    blogPosts: 0,
    caseStudies: 0,
    contactSubmissions: 0,
    newSubmissions: 0,
    prequalRequests: 0,
    newPrequalRequests: 0,
    draftProjects: 0,
    draftPosts: 0,
  });
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);

  useEffect(() => {
    if (!isAdmin) return;

    loadUser();
    loadStats();
    loadRecentSubmissions();

    // Set up real-time subscription for new submissions (fixed memory leak)
    const channel = supabase
      .channel('contact-submissions-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'contact_submissions'
        },
        (payload) => {
          toast({
            title: "New Submission! 🔔",
            description: `${payload.new.name} sent a ${payload.new.submission_type} request`,
          });
          loadStats();
          loadRecentSubmissions();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'prequalification_downloads'
        },
        (payload) => {
          toast({
            title: "New Prequalification Request! 📦",
            description: `${payload.new.company_name} requested a package`,
          });
          loadStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]); // Re-run when isAdmin changes

  const loadUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setUser(session.user);
    }
  };

  const loadStats = async (attempt = 0): Promise<void> => {
    try {
      const { data, error } = await supabase.rpc('get_admin_dashboard_stats' as any);
      
      if (error || !data) {
        // Retry up to 2 times with backoff
        if (attempt < 2) {
          await new Promise(resolve => setTimeout(resolve, 300 * (attempt + 1)));
          return loadStats(attempt + 1);
        }
        
        console.error('RPC Error:', error);
        
        // Show specific error messages
        if (error?.message?.includes('does not exist')) {
          toast({
            variant: "destructive",
            title: "Database Setup Incomplete",
            description: "Dashboard statistics function not found. Please contact support.",
          });
        } else if (error?.message?.includes('Access denied')) {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You don't have permission to view dashboard statistics.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Failed to load dashboard stats",
            description: error?.message || "Please refresh the page to try again.",
          });
        }
        return;
      }
      
      if (data && typeof data === 'object') {
        const stats = data as any;
        
        // Load prequalification stats separately
        const { data: prequalData } = await supabase
          .from("prequalification_downloads")
          .select("status", { count: 'exact' });
        
        const prequalTotal = prequalData?.length || 0;
        const prequalNew = prequalData?.filter(p => p.status === 'new').length || 0;
        
        setStats({
          projects: (stats.projects_published || 0) + (stats.projects_draft || 0),
          services: stats.services_total || 0,
          blogPosts: (stats.blog_posts_published || 0) + (stats.blog_posts_draft || 0),
          caseStudies: (stats.projects_published || 0) + (stats.projects_draft || 0),
          contactSubmissions: stats.contact_submissions_total || 0,
          newSubmissions: stats.contact_submissions_new || 0,
          prequalRequests: prequalTotal,
          newPrequalRequests: prequalNew,
          draftProjects: stats.projects_draft || 0,
          draftPosts: stats.blog_posts_draft || 0,
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      toast({
        variant: "destructive",
        title: "Error loading dashboard",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setStatsLoaded(true);
    }
  };

  const loadRecentSubmissions = async () => {
    try {
      // Load contact submissions
      const { data: contactData, error: contactError } = await supabase
        .from("contact_submissions")
        .select("id, name, email, message, status, created_at, submission_type")
        .order("created_at", { ascending: false })
        .limit(10);

      // Load prequalification requests
      const { data: prequalData, error: prequalError } = await supabase
        .from("prequalification_downloads")
        .select("id, company_name, contact_name, email, message, status, downloaded_at")
        .order("downloaded_at", { ascending: false })
        .limit(10);

      if (contactError || prequalError) {
        console.error('Error loading submissions:', { contactError, prequalError });
      }

      // Normalize and merge all submissions
      const allSubmissions = [
        ...(contactData || []).map(s => ({
          ...s,
          created_at: s.created_at,
          submission_type: s.submission_type || 'contact'
        })),
        ...(prequalData || []).map(s => ({
          ...s,
          id: s.id,
          company_name: s.company_name,
          email: s.email,
          message: s.message,
          status: s.status,
          created_at: s.downloaded_at,
          submission_type: 'prequal_request'
        }))
      ];

      // Sort by created_at and take top 5
      const sorted = allSubmissions
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);
      
      setRecentSubmissions(sorted);
    } catch (error) {
      console.error('Error loading recent submissions:', error);
      setRecentSubmissions([]);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You've been successfully signed out.",
    });
    navigate("/auth");
  };

  if (authLoading) {
    return null;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div>
      {/* Welcome Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="business-page-title">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}!
        </h1>
        <p className="business-page-subtitle">
          Here's your project overview • {user?.email}
        </p>
      </div>

      {/* KPI Metrics */}
      {!statsLoaded ? (
        <div className="business-stats-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="business-glass-card" style={{ padding: '1.5rem' }}>
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      ) : statsLoaded && stats.projects === 0 && stats.blogPosts === 0 && stats.services === 0 ? (
        <div className="business-glass-card" style={{ padding: '2rem' }}>
          <div className="text-center space-y-4 py-8">
            <Briefcase className="h-16 w-16 mx-auto" style={{ color: 'var(--business-text-secondary)' }} />
            <div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--business-text-primary)' }}>No content yet</h3>
              <p className="mb-6" style={{ color: 'var(--business-text-secondary)' }}>
                Get started by creating your first project, blog post, or service
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <button className="business-btn business-btn-primary" onClick={() => navigate("/admin/projects")}>
                  Create Project
                </button>
                <button className="business-btn business-btn-ghost" onClick={() => navigate("/admin/blog")}>
                  Write Blog Post
                </button>
                <button className="business-btn business-btn-ghost" onClick={() => navigate("/admin/services")}>
                  Add Service
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <StaggerContainer type="fade" className="business-stats-grid">
          <MetricCard
            title="Published Projects"
            value={stats.projects}
            icon={Briefcase}
            trend={{ value: `${stats.draftProjects} drafts`, isPositive: false }}
            onClick={() => navigate("/admin/projects")}
          />
          <MetricCard
            title="Published Blog Posts"
            value={stats.blogPosts}
            icon={FileText}
            trend={{ value: `${stats.draftPosts} drafts`, isPositive: false }}
            onClick={() => navigate("/admin/blog")}
          />
          <MetricCard
            title="Contact Forms"
            value={stats.contactSubmissions}
            icon={Mail}
            badge={stats.newSubmissions}
            onClick={() => navigate("/admin/inbox")}
          />
          <MetricCard
            title="Services"
            value={stats.services}
            icon={TrendingUp}
            onClick={() => navigate("/admin/services-manager")}
          />
        </StaggerContainer>
      )}

      {/* Secondary Metrics */}
      <div style={{ marginBottom: '2rem' }}>
        <StaggerContainer type="fade" className="business-stats-grid">
          <MetricCard
            title="Services"
            value={stats.services}
            icon={TrendingUp}
            onClick={() => navigate("/admin/services")}
          />
          <MetricCard
            title="Prequalification Requests"
            value={stats.prequalRequests}
            icon={Package}
            badge={stats.newPrequalRequests}
            onClick={() => navigate("/admin/prequalifications")}
          />
        </StaggerContainer>
      </div>

      {/* Quick Actions & Activity Feed */}
      <ScrollReveal direction="up">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ marginBottom: '2rem' }}>
          <QuickActions />
          <ActivityFeed 
            submissions={recentSubmissions} 
            newCount={stats.newSubmissions}
          />
        </div>
      </ScrollReveal>

      {/* Settings & Tools Card */}
      <div className="business-glass-card" style={{ padding: '1.5rem' }}>
        <h2 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '700', 
          color: 'var(--business-text-primary)',
          marginBottom: '0.5rem'
        }}>
          Settings & Tools
        </h2>
        <p style={{ 
          fontSize: '0.875rem', 
          color: 'var(--business-text-secondary)',
          marginBottom: '1rem'
        }}>
          Manage content, users, and site configuration
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <button
            className="business-btn business-btn-ghost"
            style={{ justifyContent: 'flex-start', height: 'auto', padding: '1rem' }}
            onClick={() => navigate("/admin/homepage-builder")}
            aria-label="Homepage Builder"
          >
            <Layout size={20} style={{ marginRight: '0.75rem', color: 'var(--business-primary)' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Homepage Builder</span>
          </button>
          <button
            className="business-btn business-btn-ghost"
            style={{ justifyContent: 'flex-start', height: 'auto', padding: '1rem' }}
            onClick={() => navigate("/admin/navigation-builder")}
            aria-label="Navigation Builder"
          >
            <Navigation size={20} style={{ marginRight: '0.75rem', color: 'var(--business-primary)' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Navigation</span>
          </button>
          <button
            className="business-btn business-btn-ghost"
            style={{ justifyContent: 'flex-start', height: 'auto', padding: '1rem' }}
            onClick={() => navigate("/admin/seo-dashboard")}
            aria-label="Open SEO Dashboard"
          >
            <Search size={20} style={{ marginRight: '0.75rem', color: 'var(--business-primary)' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>SEO Tools</span>
          </button>
          <button
            className="business-btn business-btn-ghost"
            style={{ justifyContent: 'flex-start', height: 'auto', padding: '1rem' }}
            onClick={() => navigate("/admin/media")}
            aria-label="Open Media Library"
          >
            <Image size={20} style={{ marginRight: '0.75rem', color: 'var(--business-primary)' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Media Library</span>
          </button>
          <button
            className="business-btn business-btn-ghost"
            style={{ justifyContent: 'flex-start', height: 'auto', padding: '1rem' }}
            onClick={() => navigate("/admin/users")}
            aria-label="Manage Users"
          >
            <Users size={20} style={{ marginRight: '0.75rem', color: 'var(--business-primary)' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Users</span>
          </button>
          <button
            className="business-btn business-btn-ghost"
            style={{ justifyContent: 'flex-start', height: 'auto', padding: '1rem' }}
            onClick={() => navigate("/admin/site-settings")}
            aria-label="Open Site Settings"
          >
            <Settings size={20} style={{ marginRight: '0.75rem', color: 'var(--business-primary)' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Site Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
