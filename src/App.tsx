import { PageVisibility } from "@/components/PageVisibility";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { DeferredBoundary } from "./components/DeferredBoundary";
import ScrollToTop from "./components/ScrollToTop";
import SkipLink from "./components/SkipLink";
import { trackPageView } from "@/lib/analytics";
import { useContactClickAnalytics } from "@/hooks/useContactClickAnalytics";
import { AppRoutes } from "@/routes/AppRoutes";
import { HeroPresenceProvider } from "@/components/shared/HeroPresenceProvider";

// Non-critical UI: lazy-loaded so they don't block initial paint or inflate the main chunk.
// Both render conditionally (cookie banner only when no consent stored, sticky bar only after scroll)
// so users almost never see a Suspense fallback for them.
const CookieBanner = lazy(() => import("./components/CookieBanner"));
const StickyInquiryBar = lazy(() => import("./components/StickyInquiryBar"));
const ScrollToTopButton = lazy(() =>
  import("./components/ui/scroll-to-top").then((m) => ({
    default: m.ScrollToTop,
  })),
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
  useContactClickAnalytics();

  useEffect(() => {
    trackPageView(location.pathname + location.search, document.title);
  }, [location]);

  return <>{children}</>;
};

// A data-router context enables the editing guard for Back/Forward and links.
// The existing public and admin route tree stays in AppRoutes.
const RouterContent = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith("/prequal-package/"))
    return (
      <Suspense fallback={<PageLoader />}>
        <AppRoutes />
      </Suspense>
    );
  return (
    <HeroPresenceProvider>
      <ScrollToTop />
      <RouteTracker>
        <DeferredBoundary name="Cookie preferences" optional>
          <Suspense fallback={null}>
            <CookieBanner />
          </Suspense>
        </DeferredBoundary>
        <SkipLink />
        <Suspense fallback={<PageLoader />}>
          <PageVisibility>
            <AppRoutes />
          </PageVisibility>
        </Suspense>
        <DeferredBoundary name="Quick inquiry bar" optional>
          <Suspense fallback={null}>
            <StickyInquiryBar />
          </Suspense>
        </DeferredBoundary>
        <DeferredBoundary name="Scroll to top" optional>
          <Suspense fallback={null}>
            <ScrollToTopButton />
          </Suspense>
        </DeferredBoundary>
      </RouteTracker>
    </HeroPresenceProvider>
  );
};
const router = createBrowserRouter([{ path: "*", element: <RouterContent /> }]);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <RouterProvider router={router} />
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
