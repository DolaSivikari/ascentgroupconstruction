import { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { UnifiedSidebar } from './UnifiedSidebar';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Menu, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PageTransition } from '@/components/animations/PageTransition';
import { OnboardingTour } from '@/components/admin/OnboardingTour';
import { NotificationBellInbox } from './NotificationBellInbox';
import '@/styles/admin-theme.css';

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/inbox': 'Inbox',
  '/admin/projects': 'Projects',
  '/admin/services-manager': 'Services',
  '/admin/blog': 'Blog Posts',
  '/admin/testimonials': 'Testimonials',
  '/admin/media': 'Media Library',
  '/admin/documents-library': 'Documents',
  '/admin/homepage-builder': 'Homepage Builder',
  '/admin/navigation': 'Navigation Menu',
  '/admin/seo-dashboard': 'SEO Dashboard',
  '/admin/redirects': 'Redirects',
  '/admin/settings': 'Settings',
  '/admin/users': 'Users & Roles',
  '/admin/email-templates': 'Email Templates',
  '/admin/performance-dashboard': 'Performance',
  '/admin/search-analytics': 'Search Analytics',
  '/admin/monitoring': 'Monitoring',
  '/admin/audit': 'Audit Log',
  '/admin/notifications': 'Notifications',
};

function usePageTitle(pathname: string) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  const base = '/' + pathname.split('/').slice(0, 3).join('/').replace(/^\//, '');
  return PAGE_TITLES['/' + pathname.split('/').slice(1, 3).join('/')] || 'Admin';
}

export const UnifiedAdminLayout = () => {
  const { isLoading, isAdmin, retry } = useAdminAuth();
  const location = useLocation();
  const pageTitle = usePageTitle(location.pathname);
  const [loadingTime, setLoadingTime] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
    
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('admin-onboarding-complete');
    if (!hasSeenOnboarding) {
      // Small delay to let the page render first
      setTimeout(() => setShowOnboarding(true), 1500);
    }
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('admin-onboarding-complete', 'true');
  };

  const handleRestartOnboarding = () => {
    localStorage.removeItem('admin-onboarding-complete');
    setShowOnboarding(true);
  };

  // Apply body-level dark theme variables for portal-based components (Radix portals)
  // Apply body-level dark theme variables for portal-based components (Radix portals)
  useEffect(() => {
    document.body.classList.add('admin-dark-portal');
    return () => {
      document.body.classList.remove('admin-dark-portal');
    };
  }, []);

  // Track loading time
  useEffect(() => {
    if (isLoading) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        setLoadingTime(Date.now() - startTime);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setLoadingTime(0);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center gap-4 max-w-md text-center px-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium">Verifying access...</p>
            {loadingTime > 3000 && (
              <p className="text-sm text-yellow-500">Taking longer than usual...</p>
            )}
            {loadingTime > 5000 && (
              <button 
                onClick={retry}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="business-admin-container admin-dark-theme">
      <UnifiedSidebar
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        onRestartOnboarding={handleRestartOnboarding}
      />
      <div className={`business-main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <header className="bg-background border-b border-border px-6 py-3 flex items-center justify-between gap-4 min-h-[56px]">
          {/* Left: mobile toggle + page title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-muted rounded-md shrink-0"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-base font-semibold text-foreground truncate hidden sm:block">
              {pageTitle}
            </h2>
          </div>

          {/* Right: view site + notifications + user */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border rounded-md px-3 py-1.5 transition-colors hover:bg-muted"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Site
            </a>
            <NotificationBellInbox />
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs uppercase shrink-0">
                {user?.email?.[0] ?? '?'}
              </div>
              <span className="text-sm text-muted-foreground hidden lg:block max-w-[160px] truncate">
                {user?.email}
              </span>
            </div>
          </div>
        </header>
        <div className="business-page-content">
          <PageTransition type="fade" duration={300}>
            <Outlet />
          </PageTransition>
        </div>
      </div>
      
      {showOnboarding && (
        <OnboardingTour onComplete={handleOnboardingComplete} />
      )}
    </div>
  );
};
