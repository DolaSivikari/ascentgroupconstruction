import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import { trackPageView } from "@/lib/analytics";
import { AppRoutes } from "@/routes/AppRoutes";

// Non-critical UI: lazy-loaded so they don't block initial paint or inflate the main chunk.
// Both render conditionally (cookie banner only when no consent stored, sticky bar only after scroll)
// so users almost never see a Suspense fallback for them.
const CookieBanner = lazy(() => import("./components/CookieBanner"));
const StickyInquiryBar = lazy(() => import("./components/StickyInquiryBar"));
const ScrollToTopButton = lazy(() =>
  import("./components/ui/scroll-to-top").then(m => ({ default: m.ScrollToTop }))
);

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background">
    <div className="relative h-20 w-20">
      {/* Static monument inside spinning ring */}
      <img
        src="/brand/icon-monument.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 m-auto h-12 w-12 object-contain"
      />
      <div className="absolute inset-0 rounded-full border-2 border-primary/15 border-t-primary animate-spin" />
    </div>
    <span className="sr-only">Loading…</span>
  </div>
);

const RouteTracker = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search, document.title);
  }, [location]);

  return <>{children}</>;
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <RouteTracker>
            <Suspense fallback={null}>
              <CookieBanner />
            </Suspense>
            <a
              href="#main-content"
              className="fixed top-0 left-0 -translate-y-full focus:translate-y-0 z-[100] bg-primary text-primary-foreground px-6 py-3 font-semibold transition-transform focus:outline-none focus:ring-4 focus:ring-primary/50"
              aria-label="Skip to main content"
            >
              Skip to main content
            </a>
            <Suspense fallback={<PageLoader />}>
              <AppRoutes />
            </Suspense>
            <Suspense fallback={null}>
              <StickyInquiryBar />
            </Suspense>
          </RouteTracker>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
