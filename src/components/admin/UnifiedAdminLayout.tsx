import { useState, useEffect, useRef } from "react";
import {
  Outlet,
  Navigate,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { UnifiedSidebar } from "./UnifiedSidebar";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import { AdminTopBar } from "./AdminTopBar";
import { IdleTimeoutWrapper } from "./IdleTimeoutWrapper";
import {
  readAdminPreference,
  writeAdminPreference,
  type AdminTheme,
} from "@/lib/admin/preferences";
import { Button } from "@/ui/Button";
import "@/styles/admin-theme.css";
import "@/styles/admin-sidebar.css";
import "@/styles/admin-page-shell.css";
import "@/styles/admin-workspace.css";

export const UnifiedAdminLayout = () => {
  const { isLoading, isAdmin, isVerifying, status, user, retry } =
    useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [loadingTime, setLoadingTime] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => readAdminPreference("admin-sidebar-collapsed", "false") === "true",
  );
  const [theme, setTheme] = useState<AdminTheme>(() =>
    readAdminPreference("admin-theme", "light") === "dark" ? "dark" : "light",
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState(false);
  const pageContent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    pageContent.current?.scrollTo?.({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  const handleSignOut = async () => {
    setSigningOut(true);
    setSignOutError(false);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/", { replace: true });
    } catch {
      setSignOutError(true);
    } finally {
      setSigningOut(false);
    }
  };

  useEffect(() => {
    document.body.dataset.adminTheme = theme;
    writeAdminPreference("admin-theme", theme);
    return () => {
      delete document.body.dataset.adminTheme;
    };
  }, [theme]);
  useEffect(() => {
    writeAdminPreference("admin-sidebar-collapsed", String(sidebarCollapsed));
  }, [sidebarCollapsed]);
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", close);
    };
  }, [mobileMenuOpen]);

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
              <p className="text-sm text-warning">
                Taking longer than usual...
              </p>
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
    if (status === "signed-out") {
      const destination = location.pathname + location.search + location.hash;
      return (
        <Navigate
          to={`/tekev?next=${encodeURIComponent(destination)}`}
          replace
        />
      );
    }
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <Helmet>
          <title>Admin access | Ascent Group Construction</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="max-w-md w-full rounded-lg border border-border bg-card p-8 space-y-5">
          <h1 className="text-2xl font-semibold">
            {status === "denied"
              ? "Admin access required"
              : "Unable to verify admin access"}
          </h1>
          <p className="text-muted-foreground">
            {status === "denied"
              ? "You are signed in, but this account does not have permission to use the admin panel."
              : "We could not verify your permissions. Check your connection and try again."}
          </p>
          <div className="flex flex-wrap gap-3">
            {status === "error" && <Button onClick={retry}>Try again</Button>}
            <Button asChild variant="outline">
              <Link to="/">Return to website</Link>
            </Button>
            {user && (
              <Button onClick={handleSignOut} disabled={signingOut}>
                {signingOut ? "Signing out…" : "Sign out"}
              </Button>
            )}
          </div>
          {signOutError && (
            <p role="alert" className="text-sm text-destructive">
              Could not sign out. Please try again.
            </p>
          )}
        </div>
      </main>
    );
  }

  return (
    <IdleTimeoutWrapper>
      <div className="business-admin-container" data-admin-theme={theme}>
        <Helmet>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <UnifiedSidebar
          collapsed={sidebarCollapsed && !mobileMenuOpen}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />
        <div
          className={`business-main-content ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}
        >
          <AdminTopBar
            theme={theme}
            onThemeChange={() => setTheme(theme === "light" ? "dark" : "light")}
            onOpenMenu={() => setMobileMenuOpen(true)}
            email={user?.email}
            onSignOut={handleSignOut}
            signingOut={signingOut}
          />
          {isVerifying && (
            <span role="status" className="sr-only">
              Verifying admin access
            </span>
          )}
          {signOutError && (
            <p role="alert" className="p-4 text-destructive">
              Could not sign out. Please try again.
            </p>
          )}
          <div className="business-page-content" ref={pageContent}>
            <Outlet />
          </div>
        </div>
      </div>
    </IdleTimeoutWrapper>
  );
};
