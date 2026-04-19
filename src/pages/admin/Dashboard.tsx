import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/ui/Button";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Users,
  Mail,
  TrendingUp,
  Settings,
  Layout,
  Package,
  Image,
  Navigation,
  CheckCircle,
  AlertCircle,
  Send,
  ClipboardList,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import MetricCard from "@/components/admin/MetricCard";
import ActivityFeed from "@/components/admin/ActivityFeed";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";

interface Stats {
  projectsPublished: number;
  projectsDraft: number;
  services: number;
  blogPublished: number;
  blogDraft: number;
  contactTotal: number;
  contactNew: number;
  prequalTotal: number;
  prequalNew: number;
  rfpTotal: number;
  quoteTotal: number;
}

interface ContentStatus {
  heroSlides: number;
  whyChooseUs: number;
  testimonials: number;
  valuePillars: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoading: authLoading, isAdmin } = useAdminAuth();
  const [user, setUser] = useState<any>(null);
  const [statsLoaded, setStatsLoaded] = useState(false);
  const [contentStatusLoaded, setContentStatusLoaded] = useState(false);
  const [stats, setStats] = useState<Stats>({
    projectsPublished: 0,
    projectsDraft: 0,
    services: 0,
    blogPublished: 0,
    blogDraft: 0,
    contactTotal: 0,
    contactNew: 0,
    prequalTotal: 0,
    prequalNew: 0,
    rfpTotal: 0,
    quoteTotal: 0,
  });
  const [contentStatus, setContentStatus] = useState<ContentStatus>({
    heroSlides: 0,
    whyChooseUs: 0,
    testimonials: 0,
    valuePillars: 0,
  });
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    if (!isAdmin) return;
    loadUser();
    loadStats();
    loadContentStatus();
    loadRecentSubmissions();

    const channel = supabase
      .channel("dashboard-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "contact_submissions" }, (payload) => {
        toast({
          title: "New submission",
          description: `${payload.new.name} sent a message`,
        });
        loadStats();
        loadRecentSubmissions();
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "prequalification_downloads" }, () => {
        loadStats();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [isAdmin]);

  const loadUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) setUser(session.user);
  };

  const loadStats = async () => {
    try {
      const [
        projPublished,
        projDraft,
        svc,
        blogPub,
        blogDraft,
        contactAll,
        contactNew,
        prequalAll,
        prequalNew,
        rfp,
        quotes,
      ] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }).eq("publish_state", "published"),
        supabase.from("projects").select("*", { count: "exact", head: true }).eq("publish_state", "draft"),
        supabase.from("services").select("*", { count: "exact", head: true }),
        supabase.from("blog_posts").select("*", { count: "exact", head: true }).eq("publish_state", "published"),
        supabase.from("blog_posts").select("*", { count: "exact", head: true }).neq("publish_state", "published"),
        supabase.from("contact_submissions").select("*", { count: "exact", head: true }),
        supabase.from("contact_submissions").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("prequalification_downloads").select("*", { count: "exact", head: true }),
        supabase.from("prequalification_downloads").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("rfp_submissions").select("*", { count: "exact", head: true }),
        supabase.from("quote_requests").select("*", { count: "exact", head: true }),
      ]);

      setStats({
        projectsPublished: projPublished.count ?? 0,
        projectsDraft: projDraft.count ?? 0,
        services: svc.count ?? 0,
        blogPublished: blogPub.count ?? 0,
        blogDraft: blogDraft.count ?? 0,
        contactTotal: contactAll.count ?? 0,
        contactNew: contactNew.count ?? 0,
        prequalTotal: prequalAll.count ?? 0,
        prequalNew: prequalNew.count ?? 0,
        rfpTotal: rfp.count ?? 0,
        quoteTotal: quotes.count ?? 0,
      });
    } catch (err) {
      console.error("Error loading stats:", err);
      toast({ variant: "destructive", title: "Could not load dashboard stats", description: "Please refresh." });
    } finally {
      setStatsLoaded(true);
    }
  };

  const loadContentStatus = async () => {
    try {
      const heroSlides = await supabase.from("hero_slides").select("*", { count: "exact", head: true }).eq("is_active", true);
      const whyChooseUs = await supabase.from("why_choose_us_items").select("*", { count: "exact", head: true }).eq("is_active", true);
      const testimonials = await (supabase.from("testimonials") as any).select("*", { count: "exact", head: true }).eq("is_active", true);
      const valuePillars = await supabase.from("value_pillars").select("*", { count: "exact", head: true }).eq("is_active", true);
      setContentStatus({
        heroSlides: heroSlides.count ?? 0,
        whyChooseUs: whyChooseUs.count ?? 0,
        testimonials: testimonials.count ?? 0,
        valuePillars: valuePillars.count ?? 0,
      });
    } catch (err) {
      console.error("Error loading content status:", err);
    } finally {
      setContentStatusLoaded(true);
    }
  };

  const loadRecentSubmissions = async () => {
    try {
      const [{ data: contacts }, { data: prequals }] = await Promise.all([
        supabase
          .from("contact_submissions")
          .select("id, name, email, message, status, created_at, submission_type")
          .order("created_at", { ascending: false })
          .limit(8),
        supabase
          .from("prequalification_downloads")
          .select("id, company_name, contact_name, email, message, status, downloaded_at")
          .order("downloaded_at", { ascending: false })
          .limit(5),
      ]);

      const all = [
        ...(contacts || []).map(s => ({ ...s, submission_type: s.submission_type || "contact" })),
        ...(prequals || []).map(s => ({
          ...s, name: s.contact_name, created_at: s.downloaded_at, submission_type: "prequal_request",
        })),
      ]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

      setRecentSubmissions(all);
    } catch (err) {
      console.error("Error loading recent submissions:", err);
    }
  };

  if (authLoading || !isAdmin) return null;

  const totalNew = stats.contactNew + stats.prequalNew;
  const hasContent = stats.projectsPublished > 0 || stats.blogPublished > 0 || stats.services > 0;

  const contentItems = [
    {
      label: "Hero Slides",
      count: contentStatus.heroSlides,
      route: "/admin/homepage-builder?tab=hero",
      warning: contentStatus.heroSlides === 0,
    },
    {
      label: "Why Choose Us",
      count: contentStatus.whyChooseUs,
      route: "/admin/homepage-builder?tab=why-choose",
      warning: contentStatus.whyChooseUs === 0,
    },
    {
      label: "Testimonials",
      count: contentStatus.testimonials,
      route: "/admin/testimonials",
      warning: false,
    },
    {
      label: "Value Pillars",
      count: contentStatus.valuePillars,
      route: "/admin/homepage-builder",
      warning: false,
    },
  ];

  return (
    <AdminPageLayout
      title={`${greeting()}!`}
      description={user?.email ? `${user.email} — here's what's happening on your site` : "Welcome to your admin dashboard"}
    >

      {/* Content Stats */}
      {!statsLoaded ? (
        <div className="business-stats-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="business-glass-card p-6">
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      ) : !hasContent ? (
        <div className="business-glass-card p-8">
          <div className="text-center space-y-4 py-8">
            <Briefcase className="h-16 w-16 mx-auto text-muted-foreground" />
            <div>
              <h3 className="business-section-title mb-2">No content yet</h3>
              <p className="business-section-subtitle mb-6">
                Get started by creating your first project, blog post, or service
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <button className="business-btn business-btn-primary" onClick={() => navigate("/admin/projects/new")}>
                  Create Project
                </button>
                <button className="business-btn business-btn-ghost" onClick={() => navigate("/admin/blog")}>
                  Write Blog Post
                </button>
                <button className="business-btn business-btn-ghost" onClick={() => navigate("/admin/services-manager")}>
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
            value={stats.projectsPublished}
            icon={Briefcase}
            trend={{ value: `${stats.projectsDraft} drafts`, isPositive: false }}
            onClick={() => navigate("/admin/projects")}
          />
          <MetricCard
            title="Blog Posts"
            value={stats.blogPublished}
            icon={FileText}
            trend={{ value: `${stats.blogDraft} drafts`, isPositive: false }}
            onClick={() => navigate("/admin/blog")}
          />
          <MetricCard
            title="Services"
            value={stats.services}
            icon={TrendingUp}
            onClick={() => navigate("/admin/services-manager")}
          />
          <MetricCard
            title="New Submissions"
            value={totalNew}
            icon={Mail}
            badge={totalNew}
            onClick={() => navigate("/admin/inbox")}
          />
        </StaggerContainer>
      )}

      {/* Submissions breakdown + Activity */}
      <ScrollReveal direction="up">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Submissions breakdown */}
          <div className="business-glass-card p-6">
            <h2 className="business-section-title mb-1">All Submissions</h2>
            <p className="business-section-subtitle mb-4">Total received across all channels</p>
            <div className="space-y-3">
              {[
                { label: "Contact Forms", value: stats.contactTotal, newCount: stats.contactNew, icon: Mail, tab: "contact" },
                { label: "Quote Requests", value: stats.quoteTotal, newCount: 0, icon: ClipboardList, tab: "quote" },
                { label: "RFP Submissions", value: stats.rfpTotal, newCount: 0, icon: Send, tab: "rfp" },
                { label: "Prequalification", value: stats.prequalTotal, newCount: stats.prequalNew, icon: Package, tab: "prequal" },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => navigate(`/admin/inbox?tab=${item.tab}`)}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/40 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.newCount > 0 && (
                      <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {item.newCount} new
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-semibold tabular-nums">{statsLoaded ? item.value : "—"}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <button
                className="business-btn business-btn-ghost w-full text-sm"
                onClick={() => navigate("/admin/inbox")}
              >
                Open Inbox
              </button>
            </div>
          </div>

          {/* Activity feed */}
          <ActivityFeed
            submissions={recentSubmissions}
            newCount={stats.contactNew}
          />
        </div>
      </ScrollReveal>

      {/* Live Content Status */}
      <ScrollReveal direction="up">
        <div className="business-glass-card p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="business-section-title">Live Content Status</h2>
            <button
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => navigate("/admin/homepage-builder")}
            >
              Manage →
            </button>
          </div>
          <p className="business-section-subtitle mb-5">
            What's currently active and showing on your public website
          </p>
          {!contentStatusLoaded ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 rounded-lg" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {contentItems.map(item => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.route)}
                  className="p-4 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/30 transition-all text-left group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {item.count > 0
                      ? <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                      : <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                    }
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      {item.label}
                    </span>
                  </div>
                  <div className="text-2xl font-bold tabular-nums">{item.count}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {item.count > 0 ? "active" : item.warning ? "using fallback" : "none set"}
                  </div>
                </button>
              ))}
            </div>
          )}
          {contentStatusLoaded && (contentStatus.heroSlides === 0 || contentStatus.whyChooseUs === 0) && (
            <div className="mt-4 flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Some homepage sections are showing fallback content because no active records exist in the database.
                Go to <button className="underline font-medium" onClick={() => navigate("/admin/homepage-builder")}>Homepage Builder</button> to add content and toggle items active.
              </p>
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Quick navigation */}
      <ScrollReveal direction="up">
        <div className="business-glass-card p-6">
          <h2 className="business-section-title mb-1">Quick Access</h2>
          <p className="business-section-subtitle mb-4">Jump to common tasks</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Homepage Builder", icon: Layout, route: "/admin/homepage-builder" },
              { label: "Navigation Menu", icon: Navigation, route: "/admin/navigation" },
              { label: "Media Library", icon: Image, route: "/admin/media" },
              { label: "Users & Roles", icon: Users, route: "/admin/users" },
              { label: "Site Settings", icon: Settings, route: "/admin/settings" },
              { label: "SEO Dashboard", icon: LayoutDashboard, route: "/admin/seo-dashboard" },
            ].map(item => (
              <button
                key={item.label}
                className="business-btn business-btn-ghost justify-start h-auto p-4"
                onClick={() => navigate(item.route)}
              >
                <item.icon size={18} className="mr-3 text-primary shrink-0" />
                <span className="text-sm font-semibold text-left">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </AdminPageLayout>
  );
};

export default Dashboard;
