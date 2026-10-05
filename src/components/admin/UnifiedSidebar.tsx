import type { LucideIcon } from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Users,
  Mail,
  Image,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  MessageSquare,
  BarChart2,
  Wrench,
  Building,
  LogOut,
  FileCheck,
  ExternalLink,
  ChevronDown,
  Inbox,
  Layout,
  Globe,
  ShieldCheck,
  History,
  Sparkles,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { loadInboxCounts } from "@/lib/inbox/api";
import { INBOX_SOURCES } from "@/lib/inbox/model";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface UnifiedSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const UnifiedSidebar = ({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: UnifiedSidebarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { toast } = useToast();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { data: counts, error: countsError } = useQuery({
    queryKey: ["inbox-stats"],
    queryFn: loadInboxCounts,
    refetchInterval: 60_000,
  });
  const newSubmissions =
    !countsError && counts
      ? counts.rfp +
        counts.contact +
        counts.resume +
        counts.prequal +
        counts.quote
      : 0;
  const [user, setUser] = useState<{
    email?: string;
    full_name?: string;
    avatar_url?: string;
  } | null>(null);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch {
      toast({
        title: "Could not sign out",
        description: "Please try again.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Signed out",
      description: "You've been successfully signed out.",
    });
    navigate("/tekev");
  };

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, email")
        .eq("id", authUser.id)
        .maybeSingle();
      setUser({
        email: authUser.email,
        full_name: profile?.full_name || undefined,
        avatar_url: profile?.avatar_url || undefined,
      });
    };
    loadUser();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("sidebar-counts")
      .on("postgres_changes", { event: "*", schema: "public" }, (payload) => {
        if (
          Object.values(INBOX_SOURCES).some(
            (source) => source.table === payload.table,
          )
        ) {
          void queryClient.invalidateQueries({ queryKey: ["inbox-stats"] });
        }
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient]);

  useEffect(() => {
    if (mobileOpen && onMobileClose) onMobileClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPath]);

  const isActive = (path: string) =>
    path === "/admin"
      ? currentPath === "/admin"
      : currentPath === path || currentPath.startsWith(path + "/");

  const isWebsiteActive = [
    "/admin/homepage-builder",
    "/admin/seo-dashboard",
    "/admin/page-headers",
  ].some((p) => currentPath.startsWith(p));
  const isToolsActive = ["/admin/monitoring", "/admin/audit"].some((p) =>
    currentPath.startsWith(p),
  );

  const [websiteOpen, setWebsiteOpen] = useState(isWebsiteActive);
  const [toolsOpen, setToolsOpen] = useState(isToolsActive);

  useEffect(() => {
    if (isWebsiteActive) setWebsiteOpen(true);
    if (isToolsActive) setToolsOpen(true);
  }, [currentPath, isWebsiteActive, isToolsActive]);

  const userInitials = (user?.full_name || user?.email || "A")
    .split(/[\s@]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  // ── Nav item ───────────────────────────────────────────────
  const NavItem = ({
    to,
    icon: Icon,
    label,
    badge,
  }: {
    to: string;
    icon: LucideIcon;
    label: string;
    badge?: number;
  }) => {
    const active = isActive(to);
    return (
      <NavLink
        to={to}
        title={collapsed ? label : undefined}
        className={cn(
          "admin-nav-item group",
          active && "is-active",
          collapsed && "is-collapsed",
        )}
      >
        <span className="admin-nav-item__indicator" aria-hidden="true" />
        <span className="admin-nav-item__icon">
          <Icon size={18} strokeWidth={active ? 2.25 : 1.75} />
        </span>
        {!collapsed && (
          <>
            <span className="admin-nav-item__label">{label}</span>
            {badge !== undefined && badge > 0 && (
              <Badge
                variant="destructive"
                className="ml-auto h-5 min-w-[20px] rounded-full px-1.5 text-[10px] font-semibold tabular-nums shadow-sm"
              >
                {badge > 99 ? "99+" : badge}
              </Badge>
            )}
          </>
        )}
        {collapsed && badge !== undefined && badge > 0 && (
          <span className="admin-nav-item__dot" aria-hidden="true" />
        )}
      </NavLink>
    );
  };

  // ── Section label ──────────────────────────────────────────
  const SectionLabel = ({ children }: { children: string }) =>
    collapsed ? (
      <div className="admin-nav-divider" aria-hidden="true" />
    ) : (
      <div className="admin-nav-section-label">{children}</div>
    );

  // ── Collapsible group ──────────────────────────────────────
  const NavGroup = ({
    label,
    icon: Icon,
    open,
    onOpenChange,
    active,
    children,
  }: {
    label: string;
    icon: LucideIcon;
    open: boolean;
    onOpenChange: (v: boolean) => void;
    active?: boolean;
    children: React.ReactNode;
  }) => {
    if (collapsed) {
      // In collapsed mode, just render the items without group wrapper
      return <nav className="admin-nav-list">{children}</nav>;
    }
    return (
      <Collapsible open={open} onOpenChange={onOpenChange}>
        <CollapsibleTrigger
          className={cn(
            "admin-nav-group-trigger",
            active && "is-active-parent",
          )}
        >
          <span className="admin-nav-item__icon">
            <Icon size={18} strokeWidth={1.75} />
          </span>
          <span className="admin-nav-item__label">{label}</span>
          <ChevronDown
            size={14}
            className={cn("admin-nav-group-chevron", open && "is-open")}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="admin-nav-group-content">
          <nav className="admin-nav-group-items">{children}</nav>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "admin-sidebar",
          collapsed && "is-collapsed",
          mobileOpen && "is-mobile-open",
        )}
      >
        {/* Mobile close */}
        <button
          className="admin-sidebar-mobile-close"
          onClick={onMobileClose}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>

        {/* ── Brand header ── */}
        <div className="admin-sidebar-brand">
          <div className="admin-sidebar-brand__mark" aria-hidden="true">
            <span>A</span>
          </div>
          {!collapsed && (
            <div className="admin-sidebar-brand__text">
              <div className="admin-sidebar-brand__title">Ascent</div>
              <div className="admin-sidebar-brand__subtitle">Admin Console</div>
            </div>
          )}
        </div>

        {/* ── Scrollable nav ── */}
        <div className="admin-sidebar-scroll">
          {/* OVERVIEW */}
          <SectionLabel>Today</SectionLabel>
          <nav className="admin-nav-list">
            <NavItem to="/admin" icon={LayoutDashboard} label="Dashboard" />
            <NavItem
              to="/admin/inbox"
              icon={Inbox}
              label="Leads"
              badge={newSubmissions}
            />
          </nav>

          {/* CONTENT */}
          <SectionLabel>Content</SectionLabel>
          <nav className="admin-nav-list">
            <NavItem to="/admin/projects" icon={Building} label="Projects" />
            <NavItem
              to="/admin/services-manager"
              icon={Wrench}
              label="Services"
            />
            <NavItem to="/admin/blog" icon={FileText} label="Blog Posts" />
            <NavItem
              to="/admin/documents-library"
              icon={FileCheck}
              label="Documents"
            />
            <NavItem to="/admin/media" icon={Image} label="Media" />
          </nav>

          {/* WEBSITE */}
          <SectionLabel>Website</SectionLabel>
          <NavGroup
            label="Site Management"
            icon={Globe}
            open={websiteOpen}
            onOpenChange={setWebsiteOpen}
            active={isWebsiteActive}
          >
            <NavItem
              to="/admin/homepage-builder"
              icon={Layout}
              label="Homepage Builder"
            />
            <NavItem
              to="/admin/settings?tab=about"
              icon={FileText}
              label="About"
            />
            <NavItem
              to="/admin/settings?tab=contact"
              icon={Mail}
              label="Contact & Footer"
            />
            <NavItem
              to="/admin/page-headers"
              icon={Image}
              label="Page Headers"
            />
            <NavItem
              to="/admin/seo-dashboard"
              icon={Sparkles}
              label="SEO Dashboard"
            />
          </NavGroup>

          {/* SETTINGS */}
          <SectionLabel>Admin</SectionLabel>
          <nav className="admin-nav-list">
            <NavItem
              to="/admin/settings"
              icon={Settings}
              label="Site Settings"
            />
            <NavItem to="/admin/users" icon={Users} label="Users & Roles" />
          </nav>

          {/* TOOLS */}

          <NavGroup
            label="Activity"
            icon={BarChart2}
            open={toolsOpen}
            onOpenChange={setToolsOpen}
            active={isToolsActive}
          >
            <NavItem
              to="/admin/monitoring"
              icon={ShieldCheck}
              label="Site Health"
            />
            <NavItem to="/admin/audit" icon={History} label="Audit Log" />
            <NavItem
              to="/admin/email-delivery"
              icon={Mail}
              label="Email Delivery"
            />
          </NavGroup>
        </div>

        {/* ── Footer: user + actions ── */}
        <div className="admin-sidebar-footer">
          {!collapsed && user && (
            <div className="admin-sidebar-user">
              <div className="admin-sidebar-user__avatar">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt=""
                    width={40}
                    height={40}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span>{userInitials || "A"}</span>
                )}
              </div>
              <div className="admin-sidebar-user__meta">
                <div className="admin-sidebar-user__name">
                  {user.full_name || "Administrator"}
                </div>
                <div className="admin-sidebar-user__email">{user.email}</div>
              </div>
            </div>
          )}

          <div className="admin-sidebar-footer__actions">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "admin-nav-item admin-nav-item--ghost",
                collapsed && "is-collapsed",
              )}
              title={collapsed ? "View site" : undefined}
            >
              <span className="admin-nav-item__icon">
                <ExternalLink size={18} strokeWidth={1.75} />
              </span>
              {!collapsed && (
                <span className="admin-nav-item__label">View site</span>
              )}
            </a>
            <button
              onClick={handleSignOut}
              className={cn(
                "admin-nav-item admin-nav-item--ghost admin-nav-item--danger w-full text-left",
                collapsed && "is-collapsed",
              )}
              title={collapsed ? "Sign out" : undefined}
            >
              <span className="admin-nav-item__icon">
                <LogOut size={18} strokeWidth={1.75} />
              </span>
              {!collapsed && (
                <span className="admin-nav-item__label">Sign out</span>
              )}
            </button>
          </div>
        </div>

        {/* ── Collapse toggle ── */}
        <button
          className="admin-sidebar-toggle"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>
    </>
  );
};
