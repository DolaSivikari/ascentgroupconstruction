import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { UnifiedSidebar } from './UnifiedSidebar';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Menu } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PageTransition } from '@/components/animations/PageTransition';
import { OnboardingTour } from '@/components/admin/OnboardingTour';
import { NotificationBellInbox } from './NotificationBellInbox';
import '@/styles/admin-theme.css';
import '@/styles/admin-sidebar.css';
import '@/styles/admin-page-shell.css';

export const UnifiedAdminLayout = () => {
  const { isLoading, isAdmin, retry } = useAdminAuth();
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
              <p className="text-sm text-warning">Taking longer than usual...</p>
            )}
            {loadingTime > 5000 && (
              <button 
                onClick={retry}
                className="mt-4 px-4 py-2 bg-info hover:bg-info text-white rounded-md transition-colors"
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
        <header className="bg-background border-b border-border px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 hover:bg-muted rounded-md"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4 ml-auto">
            <NotificationBellInbox />
            <span className="text-sm text-muted-foreground">{user?.email}</span>
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
