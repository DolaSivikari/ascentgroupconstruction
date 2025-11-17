import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Users, 
  DollarSign,
  Receipt,
  Package,
  Mail,
  Image,
  Settings,
  Shield,
  Search,
  Activity,
  ChevronLeft,
  ChevronRight,
  Folder,
  UserCircle,
  FileCheck,
  X,
  MessageSquare,
  BarChart,
  Award,
  BookOpen,
  Layout,
  Navigation,
  Wrench,
  AlertTriangle,
  ArrowRightLeft,
  Database,
  Building,
  Quote,
  FolderOpen,
  Menu,
  ImageIcon
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { GlobalSearch } from './GlobalSearch';

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

  // Close mobile menu on route change
  useEffect(() => {
    if (mobileOpen && onMobileClose) {
      onMobileClose();
    }
  }, [currentPath]);

  // Check if any route in a group is active to keep it open
  const isContentActive = ['/admin/projects', '/admin/services', '/admin/blog', '/admin/media', '/admin/testimonials', '/admin/stats', '/admin/documents'].some(p => currentPath.startsWith(p));
  const isAppearanceActive = ['/admin/homepage-builder', '/admin/navigation', '/admin/hero-images'].some(p => currentPath.startsWith(p));
  const isInboxActive = ['/admin/inbox'].some(p => currentPath.startsWith(p));
  const isToolsActive = ['/admin/seo-dashboard', '/admin/redirects', '/admin/performance-dashboard', '/admin/search-analytics'].some(p => currentPath.startsWith(p));

  const [contentOpen, setContentOpen] = useState(isContentActive);
  const [appearanceOpen, setAppearanceOpen] = useState(isAppearanceActive);
  const [inboxOpen, setInboxOpen] = useState(isInboxActive);
  const [toolsOpen, setToolsOpen] = useState(isToolsActive);

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + '/');

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
    <NavLink
      to={to}
      className={`business-nav-item ${isActive(to) ? 'active' : ''}`}
    >
      <Icon className="business-nav-icon" />
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );

  const contentItems = [
    { title: "Services", url: "/admin/services-manager", icon: Wrench },
    { title: "Projects", url: "/admin/projects", icon: Building },
    { title: "Blog Posts", url: "/admin/blog-posts", icon: FileText },
    { title: "Testimonials", url: "/admin/testimonials", icon: Quote },
    { title: "Stats & Badges", url: "/admin/stats", icon: Award },
    { title: "Documents", url: "/admin/documents-library", icon: FolderOpen },
    { title: "Media Library", url: "/admin/media-library", icon: Image },
  ];

  const appearanceItems = [
    { title: "Homepage", url: "/admin/homepage-builder", icon: Layout },
    { title: "Hero Slides", url: "/admin/hero-images", icon: ImageIcon },
    { title: "Navigation", url: "/admin/navigation-builder", icon: Menu },
  ];

  const toolsItems = [
    { title: "SEO Dashboard", url: "/admin/seo-dashboard", icon: BarChart },
    { title: "Redirects", url: "/admin/redirects", icon: ArrowRightLeft },
    { title: "Performance", url: "/admin/performance-dashboard", icon: Activity },
    { title: "Search Analytics", url: "/admin/search-analytics", icon: Database },
  ];

  const adminItems = [
    { title: "Users", url: "/admin/users", icon: Shield },
  ];

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
      <aside className={`business-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
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
            <div style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              background: 'linear-gradient(135deg, #2563eb 0%, #f97316 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: 'center'
            }}>
              A
            </div>
          ) : (
            <>
              <div style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                background: 'linear-gradient(135deg, #2563eb 0%, #f97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Ascent
              </div>
              <span style={{ fontSize: '0.875rem', color: 'var(--business-text-secondary)' }}>
                Admin Panel
              </span>
            </>
          )}
        </div>

        {/* Search */}
        {!collapsed && (
          <div style={{ padding: '0 1rem', marginBottom: '1rem' }}>
            <GlobalSearch />
          </div>
        )}

        {/* Main Dashboard */}
        <nav style={{ marginBottom: '1.5rem' }}>
          <NavItem to="/admin" icon={LayoutDashboard} label="Dashboard" />
        </nav>

        {/* Content Management Section */}
        <Collapsible open={contentOpen} onOpenChange={setContentOpen} data-tour="content">
          <CollapsibleTrigger className="business-nav-group-label">
            {!collapsed && (
              <>
                <FileText size={16} />
                <span>Content</span>
              </>
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <nav className="business-nav-group">
              <NavItem to="/admin/projects" icon={Folder} label="Projects" />
              <NavItem to="/admin/services" icon={Package} label="Services" />
              <NavItem to="/admin/blog" icon={FileText} label="Blog Posts" />
              <NavItem to="/admin/testimonials" icon={MessageSquare} label="Testimonials" />
              <NavItem to="/admin/stats" icon={BarChart} label="Stats & Badges" />
              <NavItem to="/admin/documents-library" icon={FileCheck} label="Documents" />
              <NavItem to="/admin/media" icon={Image} label="Media Library" />
            </nav>
          </CollapsibleContent>
        </Collapsible>

        {/* Appearance Section (NEW) */}
        <Collapsible open={appearanceOpen} onOpenChange={setAppearanceOpen} data-tour="appearance">
          <CollapsibleTrigger className="business-nav-group-label">
            {!collapsed && (
              <>
                <Layout size={16} />
                <span>Appearance</span>
              </>
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <nav className="business-nav-group">
              <NavItem to="/admin/homepage-builder" icon={Layout} label="Homepage Builder" />
              <NavItem to="/admin/hero-images" icon={ImageIcon} label="Hero Slides" />
              <NavItem to="/admin/navigation" icon={Menu} label="Navigation" />
              <NavItem to="/admin/footer-settings" icon={Layout} label="Footer Settings" />
              <NavItem to="/admin/about-page" icon={FileText} label="About Page" />
              <NavItem to="/admin/contact-page-settings" icon={Mail} label="Contact Page" />
            </nav>
          </CollapsibleContent>
        </Collapsible>

        {/* Inbox Section */}
        <nav style={{ marginBottom: '1.5rem' }} data-tour="inbox">
          <NavItem to="/admin/inbox" icon={Mail} label="📬 Unified Inbox" />
        </nav>

        <Collapsible open={inboxOpen} onOpenChange={setInboxOpen}>
          <CollapsibleTrigger className="business-nav-group-label">
            {!collapsed && (
              <>
                <Mail size={16} />
                <span>Direct Access</span>
              </>
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <nav className="business-nav-group">
              <NavItem to="/admin/contacts" icon={Mail} label="Contact Forms" />
              <NavItem to="/admin/resumes" icon={FileCheck} label="Resumes" />
              <NavItem to="/admin/prequalifications" icon={Package} label="Prequal" />
              <NavItem to="/admin/rfp-submissions" icon={FileText} label="RFP Submissions" />
              <NavItem to="/admin/newsletter-subscribers" icon={Mail} label="Newsletter" />
              <NavItem to="/admin/partner-permissions" icon={Shield} label="Partner Logos" />
            </nav>
          </CollapsibleContent>
        </Collapsible>

        {/* Business Tools Section */}
        {/* Tools Section (NEW) */}
        <Collapsible open={toolsOpen} onOpenChange={setToolsOpen} data-tour="tools">
          <CollapsibleTrigger className="business-nav-group-label">
            {!collapsed && (
              <>
                <Search size={16} />
                <span>Tools</span>
              </>
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <nav className="business-nav-group">
              <NavItem to="/admin/seo-dashboard" icon={Search} label="SEO Dashboard" />
              <NavItem to="/admin/redirects" icon={ArrowRightLeft} label="Redirects" />
              <NavItem to="/admin/structured-data" icon={Database} label="Structured Data" />
              <NavItem to="/admin/performance-dashboard" icon={Activity} label="Performance" />
              <NavItem to="/admin/search-analytics" icon={Search} label="Search Analytics" />
              <NavItem to="/admin/settings-health" icon={Wrench} label="Settings Health" />
            </nav>
          </CollapsibleContent>
        </Collapsible>

        {/* Settings - Top Level */}
        <nav style={{ marginBottom: '1.5rem' }} data-tour="settings">
          <NavItem to="/admin/settings" icon={Settings} label="⚙️ Settings" />
        </nav>

        {/* Admin Section */}
        <nav style={{ marginBottom: '1.5rem' }}>
          <NavItem to="/admin/users" icon={Shield} label="👥 User Management" />
        </nav>

        {onRestartOnboarding && !collapsed && (
          <button 
            onClick={onRestartOnboarding}
            className="business-nav-item"
            style={{ marginTop: 'auto', opacity: 0.7 }}
          >
            <Activity className="business-nav-icon" />
            <span>Restart Tour</span>
          </button>
        )}
      </div>

        {/* Toggle Button */}
        <button className="business-sidebar-toggle" onClick={onToggle}>
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </aside>
    </>
  );
};

