import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
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
  Search,
  ExternalLink,
  ChevronDown,
  Inbox,
  Layout,
  Globe,
  ShieldCheck,
  History,
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState, useEffect } from 'react';
import { GlobalSearch } from './GlobalSearch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface UnifiedSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  onRestartOnboarding?: () => void;
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

  const [newSubmissions, setNewSubmissions] = useState(0);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({ title: "Signed out", description: "You've been successfully signed out." });
    navigate("/tekev");
  };

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const { count } = await supabase
          .from('contact_submissions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'new');
        setNewSubmissions(count || 0);
      } catch { /* silent */ }
    };

    loadCounts();

    const channel = supabase
      .channel('sidebar-counts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_submissions' }, loadCounts)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    if (mobileOpen && onMobileClose) onMobileClose();
  }, [currentPath]);

  const isActive = (path: string) =>
    currentPath === path || currentPath.startsWith(path + '/');

  const isWebsiteActive = ['/admin/homepage-builder', '/admin/seo-dashboard'].some(p => currentPath.startsWith(p));
  const isToolsActive = ['/admin/monitoring', '/admin/audit'].some(p => currentPath.startsWith(p));

  const [websiteOpen, setWebsiteOpen] = useState(isWebsiteActive);
  const [toolsOpen, setToolsOpen] = useState(isToolsActive);

  // Nav item
  const NavItem = ({
    to,
    icon: Icon,
    label,
    badge,
  }: {
    to: string;
    icon: any;
    label: string;
    badge?: number;
  }) => (
    <NavLink
      to={to}
      className={cn("business-nav-item", isActive(to) && "active")}
    >
      <Icon className="business-nav-icon" />
      {!collapsed && (
        <>
          <span className="flex-1">{label}</span>
          {badge !== undefined && badge > 0 && (
            <Badge variant="destructive" className="ml-auto h-5 min-w-[20px] px-1.5 text-[10px] font-bold">
              {badge > 99 ? '99+' : badge}
            </Badge>
          )}
        </>
      )}
    </NavLink>
  );

  // Section label
  const SectionLabel = ({ children }: { children: string }) => (
    <div className="business-nav-section-label">
      {!collapsed && <span>{children}</span>}
    </div>
  );

  // Collapsible group
  const NavGroup = ({
    label,
    icon: Icon,
    open,
    onOpenChange,
    children,
  }: {
    label: string;
    icon: any;
    open: boolean;
    onOpenChange: (v: boolean) => void;
    children: React.ReactNode;
  }) => (
    <Collapsible open={open} onOpenChange={onOpenChange}>
      <CollapsibleTrigger className="business-nav-group-label">
        <div className="flex items-center gap-2.5">
          <Icon size={16} />
          {!collapsed && <span>{label}</span>}
        </div>
        {!collapsed && (
          <ChevronDown
            size={14}
            className={cn("transition-transform duration-200", open && "rotate-180")}
          />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <nav className="business-nav-group">{children}</nav>
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <>
      {mobileOpen && (
        <div className="business-sidebar-backdrop" onClick={onMobileClose} aria-hidden="true" />
      )}

      <aside className={cn("business-sidebar", collapsed && "collapsed", mobileOpen && "mobile-open")}>
        {/* Mobile close */}
        <button className="business-sidebar-mobile-close" onClick={onMobileClose} aria-label="Close menu">
          <X size={24} />
        </button>

        <div className="business-sidebar-content">
          {/* Logo */}
          <div className="business-logo">
            {collapsed ? (
              <div
                className="text-2xl font-bold text-center"
                style={{ background: 'linear-gradient(135deg, #fff 0%, hsl(25 100% 50%) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                A
              </div>
            ) : (
              <div className="flex flex-col">
                <div
                  className="text-xl font-bold"
                  style={{ background: 'linear-gradient(135deg, #fff 0%, hsl(25 100% 50%) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                >
                  Ascent Admin
                </div>
                <span className="text-xs text-white/60 mt-0.5">Content Management</span>
              </div>
            )}
          </div>

          {/* Search */}
          {!collapsed && (
            <div className="px-4 mb-4">
              <GlobalSearch />
            </div>
          )}

          {/* ── OVERVIEW ── */}
          <SectionLabel>OVERVIEW</SectionLabel>
          <nav className="mb-4">
            <NavItem to="/admin" icon={LayoutDashboard} label="Dashboard" />
            <NavItem to="/admin/inbox" icon={Inbox} label="Inbox" badge={newSubmissions} />
          </nav>

          {/* ── CONTENT ── */}
          <SectionLabel>CONTENT</SectionLabel>
          <nav className="mb-4">
            <NavItem to="/admin/projects" icon={Building} label="Projects" />
            <NavItem to="/admin/services-manager" icon={Wrench} label="Services" />
            <NavItem to="/admin/blog" icon={FileText} label="Blog Posts" />
            <NavItem to="/admin/testimonials" icon={MessageSquare} label="Testimonials" />
            <NavItem to="/admin/media" icon={Image} label="Media Library" />
            <NavItem to="/admin/documents-library" icon={FileCheck} label="Documents" />
          </nav>

          {/* ── WEBSITE ── */}
          <SectionLabel>WEBSITE</SectionLabel>
          <NavGroup label="Site Management" icon={Globe} open={websiteOpen} onOpenChange={setWebsiteOpen}>
            <NavItem to="/admin/homepage-builder" icon={Layout} label="Homepage Builder" />
            <NavItem to="/admin/seo-dashboard" icon={Search} label="SEO Dashboard" />
          </NavGroup>

          {/* ── SETTINGS ── */}
          <SectionLabel>SETTINGS</SectionLabel>
          <nav className="mb-4">
            <NavItem to="/admin/settings" icon={Settings} label="Site Settings" />
            <NavItem to="/admin/users" icon={Users} label="Users & Roles" />
            <NavItem to="/admin/email-templates" icon={Mail} label="Email Templates" />
          </nav>

          {/* ── TOOLS (collapsed by default) ── */}
          <SectionLabel>TOOLS</SectionLabel>
          <NavGroup label="Analytics & Logs" icon={BarChart2} open={toolsOpen} onOpenChange={setToolsOpen}>
            <NavItem to="/admin/monitoring" icon={ShieldCheck} label="Monitoring" />
            <NavItem to="/admin/audit" icon={History} label="Audit Log" />
          </NavGroup>

          <div className="flex-1" />

          {/* Footer */}
          <div className="mt-auto border-t border-white/10 pt-4 space-y-1">
            {!collapsed && (
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="business-nav-item opacity-80 hover:opacity-100"
              >
                <ExternalLink className="business-nav-icon" />
                <span>View Site</span>
              </a>
            )}
            <button
              onClick={handleSignOut}
              className="business-nav-item w-full text-left opacity-80 hover:opacity-100 hover:bg-red-500/20"
            >
              <LogOut className="business-nav-icon" />
              {!collapsed && <span>Sign Out</span>}
            </button>
          </div>
        </div>

        {/* Collapse toggle */}
        <button className="business-sidebar-toggle" onClick={onToggle}>
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </aside>
    </>
  );
};
