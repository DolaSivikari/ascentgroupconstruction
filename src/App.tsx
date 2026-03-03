import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, useLocation } from "react-router-dom";
import { Suspense, useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import CookieBanner from "./components/CookieBanner";
import { trackPageView } from "@/lib/analytics";
import { AppRoutes } from "@/routes/AppRoutes";

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
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
            <CookieBanner />
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
          </RouteTracker>
        </BrowserRouter>
      </TooltipProvider>
            <ScrollToTop />
            <RouteTracker>
              <CookieBanner />
              {/* Skip to main content link for accessibility - Enhanced PCL style */}
              <a
                href="#main-content"
                className="fixed top-0 left-0 -translate-y-full focus:translate-y-0 z-[100] bg-primary text-primary-foreground px-6 py-3 font-semibold transition-transform focus:outline-none focus:ring-4 focus:ring-primary/50"
                aria-label="Skip to main content"
              >
                Skip to main content
              </a>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public pages - eagerly loaded */}
                  <Route path="/" element={<LandingWrapper />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/why-specialty-contractor" element={<WhySpecialtyContractor />} />
                  <Route path="/prequalification" element={<Prequalification />} />
                  <Route path="/capabilities" element={<Capabilities />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/service-selector" element={<ServiceSelectorPage />} />
                  
            <Route path="/services" element={<Services />} />
            <Route path="/services/interior-buildouts" element={<InteriorBuildouts />} />
            <Route path="/services/building-envelope" element={<BuildingEnvelope />} />
            <Route path="/services/masonry-restoration" element={<Navigate to="/services/building-envelope" replace />} />
            <Route path="/services/protective-coatings" element={<ProtectiveCoatings />} />
            <Route path="/services/cladding-systems" element={<CladdingSystems />} />
            <Route path="/services/tile-flooring" element={<TileFlooring />} />
            <Route path="/services/painting-services" element={<PaintingServices />} />
            <Route path="/services/sustainable-construction" element={<SustainableBuilding />} />
            {/* Redirects for consolidated services */}
            <Route path="/services/exterior-envelope" element={<Navigate to="/services/building-envelope" replace />} />
            <Route path="/services/exterior-cladding" element={<Navigate to="/services/cladding-systems" replace />} />
            <Route path="/services/metal-cladding" element={<Navigate to="/services/cladding-systems" replace />} />
            <Route path="/services/eifs-stucco" element={<Navigate to="/services/cladding-systems" replace />} />
            <Route path="/services/exterior-siding" element={<Navigate to="/services/cladding-systems" replace />} />
            <Route path="/services/drywall-finishing" element={<Navigate to="/services/interior-buildouts" replace />} />
            <Route path="/services/suite-buildouts" element={<Navigate to="/services/interior-buildouts" replace />} />
            <Route path="/services/painting" element={<Navigate to="/services/painting-services" replace />} />
            <Route path="/services/condo-multi-unit" element={<Navigate to="/services/painting-services" replace />} />
            <Route path="/services/residential-painting" element={<Navigate to="/services/painting-services" replace />} />
            
            {/* Redirects for removed services */}
            <Route path="/services/general-contracting" element={<Navigate to="/services" replace />} />
            <Route path="/services/construction-management" element={<Navigate to="/services" replace />} />
            <Route path="/services/design-build" element={<Navigate to="/services" replace />} />
            <Route path="/services/facade-remediation" element={<Navigate to="/services/building-envelope" replace />} />
            <Route path="/services/parking-garage-restoration" element={<Navigate to="/services/building-envelope" replace />} />
            <Route path="/services/parking-rehabilitation" element={<Navigate to="/services/building-envelope" replace />} />
            <Route path="/services/sealant-replacement" element={<Navigate to="/services/building-envelope" replace />} />
            <Route path="/services/roofing" element={<Navigate to="/services/building-envelope" replace />} />
            <Route path="/services/windows-doors" element={<Navigate to="/services/building-envelope" replace />} />
            <Route path="/services/preconstruction-services" element={<Navigate to="/services" replace />} />
            <Route path="/services/virtual-design-construction" element={<Navigate to="/services" replace />} />
            
            <Route path="/services/:slug" element={<ServiceDetail />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/estimate" element={<Estimate />} />
                  <Route path="/submit-rfp" element={<SubmitRFPNew />} />
                  
                  {/* Specialty Landing Pages - Dynamic routing */}
                  <Route path="/for-general-contractors" element={<ForGeneralContractors />} />
                  <Route path="/insights" element={<Insights />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/accessibility" element={<Accessibility />} />
                  <Route path="/unsubscribe" element={<Unsubscribe />} />
                  <Route path="/property-managers" element={<PropertyManagers />} />
                  <Route path="/homeowners" element={<Homeowners />} />
                  <Route path="/commercial-clients" element={<CommercialClients />} />
                  <Route path="/our-process" element={<OurProcess />} />
                  <Route path="/sustainability" element={<Sustainability />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/tekev" element={<Auth />} />
                  <Route path="/company/certifications-insurance" element={<CertificationsInsurance />} />
                  <Route path="/company/equipment-resources" element={<EquipmentResources />} />
                  <Route path="/company/developers" element={<Developers />} />
                  
                  <Route path="/resources/contractor-portal" element={<ContractorPortal />} />
                  <Route path="/resources/service-areas" element={<ServiceAreas />} />
                  <Route path="/service-areas/:city" element={<LocationPage />} />
                  
                  {/* Heavy content pages - lazy loaded */}
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  {/* Redirect old case study routes to blog */}
                  <Route path="/case-studies" element={<Blog />} />
                  <Route path="/case-study/:slug" element={<BlogPost />} />
                  {/* Dedicated projects detail page */}
                  <Route path="/projects/:slug" element={<ProjectDetail />} />
                  
                  {/* Admin pages - unified layout */}
                  <Route path="/admin" element={<UnifiedAdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="services" element={<Navigate to="/admin/services-manager" replace />} />
                    <Route path="services/:id" element={<ServiceEditor />} />
                    <Route path="services-manager" element={<ServicesManager />} />
                    <Route path="projects" element={<AdminProjects />} />
                    <Route path="projects/:id" element={<ProjectEditor />} />
                    <Route path="blog" element={<AdminBlogPosts />} />
                    <Route path="blog-posts" element={<AdminBlogPosts />} />
                    <Route path="blog/:id" element={<BlogPostEditor />} />
                    <Route path="media" element={<MediaLibrary />} />
                    <Route path="media-library" element={<MediaLibrary />} />
                    <Route path="users" element={<Users />} />
                    <Route path="stats" element={<StatsManager />} />
                    <Route path="testimonials" element={<TestimonialsManager />} />
                    <Route path="documents-library" element={<DocumentsLibrary />} />
                    
                    {/* Old inbox routes - redirect to unified inbox */}
                    <Route path="contacts" element={<Navigate to="/admin/inbox" replace />} />
                    <Route path="resumes" element={<Navigate to="/admin/inbox" replace />} />
                    <Route path="prequalifications" element={<Navigate to="/admin/inbox" replace />} />
                    <Route path="rfp" element={<Navigate to="/admin/inbox" replace />} />
                    <Route path="rfp-submissions" element={<Navigate to="/admin/inbox" replace />} />
                    <Route path="newsletter-subscribers" element={<Navigate to="/admin/inbox" replace />} />
                    <Route path="quote-requests" element={<Navigate to="/admin/inbox" replace />} />
                    
                    {/* Settings - Consolidated */}
                    <Route path="settings" element={<Settings />} />
                    <Route path="site-settings" element={<Navigate to="/admin/settings?tab=general" replace />} />
                    <Route path="footer-settings" element={<Navigate to="/admin/settings?tab=footer" replace />} />
                    <Route path="contact-page-settings" element={<Navigate to="/admin/settings?tab=contact" replace />} />
                    <Route path="about-page-settings" element={<Navigate to="/admin/settings?tab=about" replace />} />
                    <Route path="about-page" element={<Navigate to="/admin/settings?tab=about" replace />} />
                    <Route path="security-settings" element={<Navigate to="/admin/settings?tab=security" replace />} />
                    <Route path="settings-health" element={<Navigate to="/admin/settings?tab=health" replace />} />
                    
                    {/* Tools */}
                    <Route path="seo-dashboard" element={<SEODashboard />} />
                    <Route path="redirects" element={<RedirectsManager />} />
                    <Route path="performance-dashboard" element={<PerformanceDashboard />} />
                    <Route path="search-analytics" element={<SearchAnalytics />} />
                    <Route path="audit" element={<AuditDashboard />} />
                    <Route path="content-versions" element={<ContentVersioning />} />
                    <Route path="monitoring" element={<Monitoring />} />
                    <Route path="quote-requests" element={<Navigate to="/admin/inbox?tab=quote" replace />} />
                    
                    {/* Inbox */}
                    <Route path="inbox" element={<UnifiedInbox />} />
                    
                    {/* Notifications & Email Templates */}
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="email-templates" element={<EmailTemplates />} />
                    <Route path="testing" element={<Testing />} />
                    
                    {/* Homepage Builder - Consolidated */}
                    <Route path="homepage-builder" element={<HomepageBuilder />} />
                    <Route path="homepage-content" element={<Navigate to="/admin/homepage-builder" replace />} />
                    <Route path="homepage-settings" element={<Navigate to="/admin/homepage-builder" replace />} />
                    <Route path="homepage-why-choose-us" element={<Navigate to="/admin/homepage-builder?tab=why-choose" replace />} />
                    <Route path="homepage-company-overview" element={<Navigate to="/admin/homepage-builder?tab=overview" replace />} />
                    <Route path="hero-slides" element={<Navigate to="/admin/homepage-builder?tab=hero" replace />} />
                    <Route path="hero-images" element={<HeroSlidesManager />} />
                    
                    {/* Navigation */}
                    <Route path="navigation" element={<NavigationBuilder />} />
                    <Route path="navigation-builder" element={<NavigationBuilder />} />
                  </Route>
                  
                  <Route path="/404" element={<NotFound />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </RouteTracker>
          </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
