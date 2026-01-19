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
  BarChart,
  Award,
  Layout,
  Navigation,
  Wrench,
  ArrowRightLeft,
  Building,
  ImageIcon,
  LogOut,
  Bell,
  FileCheck,
  Search,
  Activity,
  BookOpen,
  FolderOpen,
  ExternalLink,
  ChevronDown,
  Inbox,
  ClipboardList,
  Send,
  FileUser,
  Package,
  Palette,
  MailOpen,
  History,
  Database,
  AlertTriangle,
  TestTube
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

export const UnifiedSidebar = ({ collapsed, onToggle, mobileOpen, onMobileClose, onRestartOnboarding }: UnifiedSidebarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Notification counts
  const [unreadCount, setUnreadCount] = useState(0);
  const [newSubmissions, setNewSubmissions] = useState(0);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You've been successfully signed out.",
    });
    navigate("/tekev");
  };

  // Load notification counts
  useEffect(() => {
    const loadCounts = async () => {
      try {
        // Get unread notifications
        const { count: notifCount } = await supabase
          .from('admin_notifications')
          .select('*', { count: 'exact', head: true })
          .eq('is_read', false);
        
        // Get new submissions count
        const { count: submissionsCount } = await supabase
          .from('contact_submissions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'new');
        
        setUnreadCount(notifCount || 0);
        setNewSubmissions(submissionsCount || 0);
      } catch (error) {
        console.error('Error loading counts:', error);
      }
    };
    
    loadCounts();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('admin-counts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admin_notifications' }, loadCounts)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_submissions' }, loadCounts)
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    if (mobileOpen && onMobileClose) {
      onMobileClose();
    }
  }, [currentPath]);

  // Check if any route in a group is active to keep it open
  const isPagesActive = ['/admin/homepage-builder', '/admin/settings'].some(p => currentPath.startsWith(p));
  const isContentActive = ['/admin/projects', '/admin/services', '/admin/blog', '/admin/media', '/admin/testimonials'].some(p => currentPath.startsWith(p));
  const isLeadsActive = ['/admin/inbox'].some(p => currentPath.startsWith(p));
  const isWebsiteActive = ['/admin/navigation', '/admin/hero-images', '/admin/stats', '/admin/redirects', '/admin/seo'].some(p => currentPath.startsWith(p));
  const isAnalyticsActive = ['/admin/performance', '/admin/search-analytics', '/admin/monitoring', '/admin/audit'].some(p => currentPath.startsWith(p));

  const [pagesOpen, setPagesOpen] = useState(isPagesActive);
  const [contentOpen, setContentOpen] = useState(isContentActive);
  const [leadsOpen, setLeadsOpen] = useState(isLeadsActive);
  const [websiteOpen, setWebsiteOpen] = useState(isWebsiteActive);
  const [analyticsOpen, setAnalyticsOpen] = useState(isAnalyticsActive);

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + '/');

  // Navigation item component
  const NavItem = ({ to, icon: Icon, label, badge }: { to: string; icon: any; label: string; badge?: number }) => (
    <NavLink
      to={to}
      className={cn(
        "business-nav-item",
        isActive(to) && "active"
      )}
    >
      <Icon className="business-nav-icon" />
      {!collapsed && (
        <>
          <span className="flex-1">{label}</span>
          {badge !== undefined && badge > 0 && (
            <Badge 
              variant="destructive" 
              className="ml-auto h-5 min-w-[20px] px-1.5 text-[10px] font-bold"
            >
              {badge > 99 ? '99+' : badge}
            </Badge>
          )}
        </>
      )}
    </NavLink>
  );

  // Section header component
  const SectionLabel = ({ children, icon: Icon }: { children: string; icon?: any }) => (
    <div className="business-nav-section-label">
      {Icon && <Icon size={14} className="opacity-60" />}
      {!collapsed && <span>{children}</span>}
    </div>
  );

  // Collapsible section component
  const NavSection = ({ 
    label, 
    icon: Icon, 
    open, 
    onOpenChange, 
    children 
  }: { 
    label: string; 
    icon: any; 
    open: boolean; 
    onOpenChange: (open: boolean) => void;
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
            className={cn(
              "transition-transform duration-200",
              open && "rotate-180"
            )} 
          />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <nav className="business-nav-group">
          {children}
        </nav>
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="business-sidebar-backdrop"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "business-sidebar",
        collapsed && "collapsed",
        mobileOpen && "mobile-open"
      )}>
        {/* Mobile Close Button */}
        <button 
          className="business-sidebar-mobile-close"
          onClick={onMobileClose}
          aria-label="Close menu"
        >
          <X size={24} />
        </button>

        <div className="business-sidebar-content">
          {/* Logo */}
          <div className="business-logo">
            {collapsed ? (
              <div className="text-2xl font-bold text-center" style={{
                background: 'linear-gradient(135deg, hsl(0 0% 100%) 0%, hsl(25 100% 50%) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                A
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="text-xl font-bold" style={{
                  background: 'linear-gradient(135deg, hsl(0 0% 100%) 0%, hsl(25 100% 50%) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Ascent Admin
                </div>
                <span className="text-xs text-white/60 mt-0.5">
                  Control Panel
                </span>
              </div>
            )}
          </div>

          {/* Search */}
          {!collapsed && (
            <div className="px-4 mb-4">
              <GlobalSearch />
            </div>
          )}

          {/* ==================== MAIN ==================== */}
          <SectionLabel icon={LayoutDashboard}>MAIN</SectionLabel>
          <nav className="mb-4">
            <NavItem to="/admin" icon={LayoutDashboard} label="Dashboard" />
            <NavItem to="/admin/inbox" icon={Inbox} label="Inbox" badge={newSubmissions} />
            <NavItem to="/admin/notifications" icon={Bell} label="Notifications" badge={unreadCount} />
          </nav>

          {/* ==================== CONTENT ==================== */}
          <SectionLabel icon={FileText}>CONTENT</SectionLabel>
          
          {/* Pages Subsection */}
          <NavSection label="Pages" icon={FolderOpen} open={pagesOpen} onOpenChange={setPagesOpen}>
            <NavItem to="/admin/homepage-builder" icon={Layout} label="Homepage Builder" />
            <NavItem to="/admin/settings?tab=about" icon={BookOpen} label="About Page" />
            <NavItem to="/admin/settings?tab=contact" icon={Mail} label="Contact Settings" />
          </NavSection>
          
          <nav className="mb-4">
            <NavItem to="/admin/services-manager" icon={Wrench} label="Services" />
            <NavItem to="/admin/projects" icon={Building} label="Projects" />
            <NavItem to="/admin/blog" icon={FileText} label="Blog Posts" />
            <NavItem to="/admin/testimonials" icon={MessageSquare} label="Testimonials" />
            <NavItem to="/admin/media" icon={Image} label="Media Library" />
          </nav>

          {/* ==================== LEADS & SUBMISSIONS ==================== */}
          <NavSection label="Leads & Submissions" icon={ClipboardList} open={leadsOpen} onOpenChange={setLeadsOpen}>
            <NavItem to="/admin/inbox?tab=contact" icon={Mail} label="Contact Submissions" />
            <NavItem to="/admin/inbox?tab=quote" icon={Send} label="Quote Requests" />
            <NavItem to="/admin/inbox?tab=rfp" icon={Briefcase} label="RFP Submissions" />
            <NavItem to="/admin/inbox?tab=resume" icon={FileUser} label="Resume Submissions" />
            <NavItem to="/admin/inbox?tab=prequal" icon={Package} label="Prequal Downloads" />
          </NavSection>

          {/* ==================== WEBSITE ==================== */}
          <SectionLabel icon={Palette}>WEBSITE</SectionLabel>
          <nav className="mb-4">
            <NavItem to="/admin/navigation" icon={Navigation} label="Navigation Builder" />
            <NavItem to="/admin/hero-images" icon={ImageIcon} label="Hero Slides" />
            <NavItem to="/admin/stats" icon={Award} label="Stats & Numbers" />
            <NavItem to="/admin/redirects" icon={ArrowRightLeft} label="Redirects" />
            <NavItem to="/admin/seo-dashboard" icon={Search} label="SEO Dashboard" />
          </nav>

          {/* ==================== ANALYTICS ==================== */}
          <NavSection label="Analytics" icon={BarChart} open={analyticsOpen} onOpenChange={setAnalyticsOpen}>
            <NavItem to="/admin/performance-dashboard" icon={Activity} label="Performance" />
            <NavItem to="/admin/search-analytics" icon={Search} label="Search Analytics" />
            <NavItem to="/admin/monitoring" icon={AlertTriangle} label="Monitoring" />
            <NavItem to="/admin/audit" icon={History} label="Audit Log" />
          </NavSection>

          {/* ==================== SETTINGS ==================== */}
          <SectionLabel icon={Settings}>SETTINGS</SectionLabel>
          <nav className="mb-4">
            <NavItem to="/admin/settings" icon={Settings} label="General Settings" />
            <NavItem to="/admin/users" icon={Users} label="Users & Roles" />
            <NavItem to="/admin/email-templates" icon={MailOpen} label="Email Templates" />
            <NavItem to="/admin/documents-library" icon={FileCheck} label="Documents Library" />
            <NavItem to="/admin/testing" icon={TestTube} label="Testing Dashboard" />
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* ==================== FOOTER ==================== */}
          <div className="mt-auto border-t border-white/10 pt-4">
            {/* View Site Button */}
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
            
            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="business-nav-item w-full text-left opacity-80 hover:opacity-100 hover:bg-red-500/20"
            >
              <LogOut className="business-nav-icon" />
              {!collapsed && <span>Sign Out</span>}
            </button>
            
            {/* Restart Tour */}
            {onRestartOnboarding && !collapsed && (
              <button 
                onClick={onRestartOnboarding}
                className="business-nav-item w-full text-left opacity-60 hover:opacity-100"
              >
                <Activity className="business-nav-icon" />
                <span>Restart Tour</span>
              </button>
            )}
          </div>
        </div>

        {/* Toggle Button */}
        <button className="business-sidebar-toggle" onClick={onToggle}>
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </aside>
    </>
  );
};
