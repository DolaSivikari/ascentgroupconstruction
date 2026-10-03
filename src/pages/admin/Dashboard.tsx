import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
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
  CheckCircle,
  AlertCircle,
  Send,
  ClipboardList,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { loadInboxCounts } from "@/lib/inbox/api";
import { INBOX_SOURCES } from "@/lib/inbox/model";
import {
  EMPTY_DASHBOARD_STATS,
  loadDashboardStats,
  loadHomepageContentStatus,
  loadRecentInboxActivity,
} from "@/lib/inbox/dashboard";
import MetricCard from "@/components/admin/MetricCard";
import ActivityFeed from "@/components/admin/ActivityFeed";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";

const Dashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const statsQuery = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: loadDashboardStats,
    refetchInterval: 60_000,
  });
  const countsQuery = useQuery({
    queryKey: ["inbox-stats"],
    queryFn: loadInboxCounts,
    refetchInterval: 60_000,
  });
  const contentQuery = useQuery({
    queryKey: ["homepage-content-status"],
    queryFn: loadHomepageContentStatus,
    refetchInterval: 60_000,
  });
  const activityQuery = useQuery({
    queryKey: ["dashboard-activity"],
    queryFn: loadRecentInboxActivity,
    refetchInterval: 60_000,
  });
  const stats = statsQuery.data || EMPTY_DASHBOARD_STATS;
  const statsLoaded = !!statsQuery.data && !statsQuery.error;
  const contentStatus = contentQuery.data || {
    heroSlides: 0,
    whyChooseUs: 0,
    testimonials: 0,
    valuePillars: 0,
  };
  const contentStatusLoaded = !!contentQuery.data && !contentQuery.error;
  const newCounts = countsQuery.data;
  const totalNew = newCounts
    ? newCounts.contact +
      newCounts.prequal +
      newCounts.rfp +
      newCounts.quote +
      newCounts.resume
    : 0;
  const hasContent =
    stats.projectsPublished > 0 ||
    stats.blogPublished > 0 ||
    stats.services > 0;
  const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  };
  useEffect(() => {
    let cancelled = false;
    void supabase.auth.getSession().then(({ data }) => {
      if (!cancelled) setUser(data.session?.user || null);
    });
    const channel = supabase
      .channel("dashboard-realtime")
      .on("postgres_changes", { event: "*", schema: "public" }, (payload) => {
        if (
          Object.values(INBOX_SOURCES).some(
            (source) => source.table === payload.table,
          )
        ) {
          void queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
          void queryClient.invalidateQueries({ queryKey: ["inbox-stats"] });
          void queryClient.invalidateQueries({
            queryKey: ["dashboard-activity"],
          });
        } else if (
          ["projects", "services", "blog_posts"].includes(payload.table)
        ) {
          void queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        } else if (
          [
            "hero_slides",
            "why_choose_us_items",
            "testimonials",
            "value_pillars",
          ].includes(payload.table)
        ) {
          void queryClient.invalidateQueries({
            queryKey: ["homepage-content-status"],
          });
        }
      })
      .subscribe();
    return () => {
      cancelled = true;
      void supabase.removeChannel(channel);
    };
  }, [queryClient]);

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
      description={
        user?.email
          ? `${user.email} — here's what's happening on your site`
          : "Welcome to your admin dashboard"
      }
    >
      {(statsQuery.error || countsQuery.error) && (
        <div
          role="alert"
          className="rounded-md border border-destructive/50 p-4 text-sm"
        >
          Some dashboard counts are unavailable.{" "}
          <Button
            variant="outline"
            onClick={() => {
              void statsQuery.refetch();
              void countsQuery.refetch();
            }}
          >
            Retry counts
          </Button>
        </div>
      )}
      {/* Content Stats */}
      {statsQuery.error ? null : !statsLoaded ? (
        <div className="business-stats-grid">
          {[1, 2, 3, 4].map((i) => (
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
                Get started by creating your first project, blog post, or
                service
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <button
                  className="business-btn business-btn-primary"
                  onClick={() => navigate("/admin/projects/new")}
                >
                  Create Project
                </button>
                <button
                  className="business-btn business-btn-ghost"
                  onClick={() => navigate("/admin/blog")}
                >
                  Write Blog Post
                </button>
                <button
                  className="business-btn business-btn-ghost"
                  onClick={() => navigate("/admin/services-manager")}
                >
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
            trend={{
              value: `${stats.projectsDraft} drafts`,
              isPositive: false,
            }}
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
            value={
              countsQuery.error
                ? "Unavailable"
                : countsQuery.isLoading
                  ? "—"
                  : totalNew
            }
            icon={Mail}
            badge={countsQuery.error ? 0 : totalNew}
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
            <p className="business-section-subtitle mb-4">
              Total received across all channels
            </p>
            <div className="space-y-3">
              {[
                {
                  label: "Contact Forms",
                  value: stats.contactTotal,
                  newCount: countsQuery.error ? 0 : newCounts?.contact || 0,
                  icon: Mail,
                  tab: "contact",
                },
                {
                  label: "Quotes & Estimates",
                  value: stats.quoteTotal,
                  newCount: countsQuery.error ? 0 : newCounts?.quote || 0,
                  icon: ClipboardList,
                  tab: "quote",
                },
                {
                  label: "RFP Submissions",
                  value: stats.rfpTotal,
                  newCount: countsQuery.error ? 0 : newCounts?.rfp || 0,
                  icon: Send,
                  tab: "rfp",
                },
                {
                  label: "Prequalification",
                  value: stats.prequalTotal,
                  newCount: countsQuery.error ? 0 : newCounts?.prequal || 0,
                  icon: Package,
                  tab: "prequal",
                },
                {
                  label: "Resumes",
                  value: stats.resumeTotal,
                  newCount: countsQuery.error ? 0 : newCounts?.resume || 0,
                  icon: Users,
                  tab: "resume",
                },
              ].map((item) => (
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
                  <span className="text-sm font-semibold tabular-nums">
                    {statsLoaded ? item.value : "—"}
                  </span>
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
            submissions={activityQuery.data?.items || []}
            newCount={countsQuery.error ? 0 : totalNew}
            loading={activityQuery.isLoading}
            failed={
              activityQuery.data?.failed ||
              (activityQuery.error ? ["Activity"] : [])
            }
            onRetry={() => void activityQuery.refetch()}
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
          {contentQuery.error ? (
            <div
              role="alert"
              className="rounded-md border border-destructive/50 p-4 text-sm"
            >
              Could not load homepage content status.{" "}
              <Button
                variant="outline"
                onClick={() => void contentQuery.refetch()}
              >
                Retry content status
              </Button>
            </div>
          ) : !contentStatusLoaded ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-20 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {contentItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.route)}
                  className="p-4 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/30 transition-all text-left group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {item.count > 0 ? (
                      <CheckCircle className="h-4 w-4 text-success shrink-0" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-warning shrink-0" />
                    )}
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      {item.label}
                    </span>
                  </div>
                  <div className="text-2xl font-bold tabular-nums">
                    {item.count}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {item.count > 0
                      ? "active"
                      : item.warning
                        ? "using fallback"
                        : "none set"}
                  </div>
                </button>
              ))}
            </div>
          )}
          {contentStatusLoaded &&
            (contentStatus.heroSlides === 0 ||
              contentStatus.whyChooseUs === 0) && (
              <div className="mt-4 flex items-start gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <AlertCircle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                <p className="text-sm text-warning dark:text-warning">
                  Some homepage sections are showing fallback content because no
                  active records exist in the database. Go to{" "}
                  <button
                    className="underline font-medium"
                    onClick={() => navigate("/admin/homepage-builder")}
                  >
                    Homepage Builder
                  </button>{" "}
                  to add content and toggle items active.
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
              {
                label: "Homepage Builder",
                icon: Layout,
                route: "/admin/homepage-builder",
              },
              {
                label: "Page Headers",
                icon: Image,
                route: "/admin/page-headers",
              },
              { label: "Media Library", icon: Image, route: "/admin/media" },
              { label: "Users & Roles", icon: Users, route: "/admin/users" },
              {
                label: "Site Settings",
                icon: Settings,
                route: "/admin/settings",
              },
              {
                label: "SEO Dashboard",
                icon: LayoutDashboard,
                route: "/admin/seo-dashboard",
              },
            ].map((item) => (
              <button
                key={item.label}
                className="business-btn business-btn-ghost justify-start h-auto p-4"
                onClick={() => navigate(item.route)}
              >
                <item.icon size={18} className="mr-3 text-primary shrink-0" />
                <span className="text-sm font-semibold text-left">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </AdminPageLayout>
  );
};

export default Dashboard;
