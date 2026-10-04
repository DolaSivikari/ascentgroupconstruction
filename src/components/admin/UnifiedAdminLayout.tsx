import { useState, useEffect } from 'react';
import { Outlet, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { UnifiedSidebar } from './UnifiedSidebar';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Menu } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PageTransition } from '@/components/animations/PageTransition';
import { NotificationBellInbox } from './NotificationBellInbox';
import { Button } from '@/ui/Button';
import '@/styles/admin-theme.css';
import '@/styles/admin-sidebar.css';
import '@/styles/admin-page-shell.css';

export const UnifiedAdminLayout = () => {
  const { isLoading, isAdmin, isVerifying, status, user, retry } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [loadingTime, setLoadingTime] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    setSignOutError(false);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/', { replace: true });
    } catch {
      setSignOutError(true);
    } finally {
      setSigningOut(false);
    }
  };

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
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <div className="flex flex-col items-center gap-4 max-w-md text-center px-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-border border-t-info rounded-full animate-spin" />
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
    if (status === 'signed-out') {
      const destination = location.pathname + location.search + location.hash;
      return <Navigate to={`/tekev?next=${encodeURIComponent(destination)}`} replace />;
    }
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <Helmet><title>Admin access | Ascent Group Construction</title><meta name="robots" content="noindex, nofollow" /></Helmet>
        <div className="max-w-md w-full rounded-lg border border-border bg-card p-8 space-y-5">
          <h1 className="text-2xl font-semibold">{status === 'denied' ? 'Admin access required' : 'Unable to verify admin access'}</h1>
          <p className="text-muted-foreground">
            {status === 'denied'
              ? 'You are signed in, but this account does not have permission to use the admin panel.'
              : 'We could not verify your permissions. Check your connection and try again.'}
          </p>
          <div className="flex flex-wrap gap-3">
            {status === 'error' && <Button onClick={retry}>Try again</Button>}
            <Button asChild variant="outline"><Link to="/">Return to website</Link></Button>
            {user && <Button onClick={handleSignOut} disabled={signingOut}>{signingOut ? 'Signing out…' : 'Sign out'}</Button>}
          </div>
          {signOutError && <p role="alert" className="text-sm text-destructive">Could not sign out. Please try again.</p>}
        </div>
      </main>
    );
  }

  return (
    <div className="business-admin-container admin-dark-theme">
      <Helmet><meta name="robots" content="noindex, nofollow" /></Helmet>
      <UnifiedSidebar
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div className={`business-main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <header className="bg-background border-b border-border px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open admin navigation"
            className="lg:hidden p-2 hover:bg-muted rounded-md"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4 ml-auto">
            {isVerifying && <span role="status" className="sr-only">Verifying admin access</span>}
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
      

    </div>
  );
};
