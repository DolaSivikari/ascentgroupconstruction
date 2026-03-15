import { lazy, type ComponentType } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

// ── Critical path — loaded synchronously (homepage, auth, 404) ──────────────
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Auth from "@/pages/Auth";

// ── Lazy loader helper — wraps import() with an error boundary fallback ──────
const lazyWithFallback = (importer: () => Promise<{ default: ComponentType }>, name: string) =>
  lazy(() =>
    importer().catch(() => ({
      default: () => (
        <div className="min-h-screen flex items-center justify-center">
          <p>Failed to load {name}</p>
        </div>
      ),
    }))
  );

// ── Main public pages ─────────────────────────────────────────────────────────
const About                = lazyWithFallback(() => import("@/pages/About"),                  'About');
const Services             = lazyWithFallback(() => import("@/pages/Services"),               'Services');
const Markets              = lazyWithFallback(() => import("@/pages/Markets"),                'Markets');
const Projects             = lazyWithFallback(() => import("@/pages/Projects"),               'Projects');
const Contact              = lazyWithFallback(() => import("@/pages/Contact"),                'Contact');
const Estimate             = lazyWithFallback(() => import("@/pages/Estimate"),               'Estimate');
const SubmitRFPNew         = lazyWithFallback(() => import("@/pages/SubmitRFPNew"),           'Submit RFP');
const OurProcess           = lazyWithFallback(() => import("@/pages/OurProcess"),             'Our Process');
const Capabilities         = lazyWithFallback(() => import("@/pages/Capabilities"),           'Capabilities');
const Prequalification     = lazyWithFallback(() => import("@/pages/Prequalification"),       'Prequalification');
const FAQ                  = lazyWithFallback(() => import("@/pages/FAQ"),                    'FAQ');
const Careers              = lazyWithFallback(() => import("@/pages/Careers"),                'Careers');

// ── Audience pages ────────────────────────────────────────────────────────────
const ForGeneralContractors = lazyWithFallback(() => import("@/pages/ForGeneralContractors"), 'For GCs');
const ForArchitects         = lazyWithFallback(() => import("@/pages/ForArchitects"),         'For Architects');
const PropertyManagers      = lazyWithFallback(() => import("@/pages/PropertyManagers"),      'Property Managers');
const Homeowners            = lazyWithFallback(() => import("@/pages/Homeowners"),            'Homeowners');
const CommercialClients     = lazyWithFallback(() => import("@/pages/CommercialClients"),     'Commercial Clients');
const WhySpecialtyContractor = lazyWithFallback(() => import("@/pages/WhySpecialtyContractor"), 'Why Specialty Contractor');
const EmergencyRepair       = lazyWithFallback(() => import("@/pages/EmergencyRepair"),       'Emergency Repair');

// ── Service detail pages ──────────────────────────────────────────────────────
const ServiceDetail       = lazyWithFallback(() => import("@/pages/ServiceDetail"),                   'Service Detail');
const InteriorBuildouts   = lazyWithFallback(() => import("@/pages/services/InteriorBuildouts"),      'Interior Buildouts');
const BuildingEnvelope    = lazyWithFallback(() => import("@/pages/services/BuildingEnvelope"),       'Building Envelope');
const ProtectiveCoatings  = lazyWithFallback(() => import("@/pages/services/ProtectiveCoatings"),     'Protective Coatings');
const CladdingSystems     = lazyWithFallback(() => import("@/pages/services/CladdingSystems"),        'Cladding Systems');
const TileFlooring        = lazyWithFallback(() => import("@/pages/services/TileFlooring"),           'Tile & Flooring');
const PaintingServices    = lazyWithFallback(() => import("@/pages/services/PaintingServices"),       'Painting Services');
const SustainableBuilding = lazyWithFallback(() => import("@/pages/services/SustainableBuilding"),    'Sustainable Building');

// ── Company pages ─────────────────────────────────────────────────────────────
const CertificationsInsurance = lazyWithFallback(() => import("@/pages/company/CertificationsInsurance"), 'Certifications & Insurance');
const Technology              = lazyWithFallback(() => import("@/pages/company/Technology"),              'Technology');
const Developers              = lazyWithFallback(() => import("@/pages/company/Developers"),              'Developers');

// ── Resource pages ────────────────────────────────────────────────────────────
const ContractorPortal = lazyWithFallback(() => import("@/pages/resources/ContractorPortal"), 'Contractor Portal');
const ServiceAreas     = lazyWithFallback(() => import("@/pages/resources/ServiceAreas"),     'Service Areas');
const LocationPage     = lazyWithFallback(() => import("@/pages/resources/LocationPage"),     'Location');

// ── Blog / content ────────────────────────────────────────────────────────────
const Blog          = lazyWithFallback(() => import("@/pages/Blog"),          'Blog');
const BlogPost      = lazyWithFallback(() => import("@/pages/BlogPost"),       'Blog Post');
const ProjectDetail = lazyWithFallback(() => import("@/pages/ProjectDetail"),  'Project Detail');

// ── Legal / utility ───────────────────────────────────────────────────────────
const Privacy       = lazyWithFallback(() => import("@/pages/Privacy"),       'Privacy');
const Terms         = lazyWithFallback(() => import("@/pages/Terms"),         'Terms');
const Accessibility = lazyWithFallback(() => import("@/pages/Accessibility"), 'Accessibility');
const Unsubscribe   = lazyWithFallback(() => import("@/pages/Unsubscribe"),   'Unsubscribe');

// ── Admin pages (lazy-loaded as before) ───────────────────────────────────────
const Dashboard            = lazyWithFallback(() => import("@/pages/admin/Dashboard"),             'Dashboard');
const AdminProjects        = lazyWithFallback(() => import("@/pages/admin/Projects"),              'Projects');
const ServiceEditor        = lazyWithFallback(() => import("@/pages/admin/ServiceEditor"),         'Service Editor');
const ProjectEditor        = lazyWithFallback(() => import("@/pages/admin/ProjectEditor"),         'Project Editor');
const TestimonialsManager  = lazyWithFallback(() => import("@/pages/admin/TestimonialsManager"),   'Testimonials Manager');
const StatsManager         = lazyWithFallback(() => import("@/pages/admin/StatsManager"),          'Stats Manager');
const DocumentsLibrary     = lazyWithFallback(() => import("@/pages/admin/DocumentsLibrary"),      'Documents Library');
const AdminBlogPosts       = lazyWithFallback(() => import("@/pages/admin/BlogPosts"),             'Blog Posts');
const BlogPostEditor       = lazyWithFallback(() => import("@/pages/admin/BlogPostEditor"),        'Blog Post Editor');
const MediaLibrary         = lazyWithFallback(() => import("@/pages/admin/MediaLibraryEnhanced"),  'Media Library');
const Users                = lazyWithFallback(() => import("@/pages/admin/Users"),                 'Users');
const PerformanceDashboard = lazyWithFallback(() => import("@/pages/admin/PerformanceDashboard"),  'Performance Dashboard');
const UnifiedInbox         = lazyWithFallback(() => import("@/pages/admin/UnifiedInbox"),          'Unified Inbox');
const AuditDashboard       = lazyWithFallback(() => import("@/pages/admin/AuditDashboard"),        'Audit Dashboard');
const ContentVersioning    = lazyWithFallback(() => import("@/pages/admin/ContentVersioning"),     'Content Versioning');
const Monitoring           = lazyWithFallback(() => import("@/pages/admin/Monitoring"),            'Monitoring');
const NavigationBuilder    = lazyWithFallback(() => import("@/pages/admin/NavigationBuilder"),     'Navigation Builder');
const RedirectsManager     = lazyWithFallback(() => import("@/pages/admin/RedirectsManager"),      'Redirects Manager');
const HeroSlidesManager    = lazyWithFallback(() => import("@/pages/admin/HeroSlidesManager"),     'Hero Slides Manager');
const SEODashboard         = lazyWithFallback(() => import("@/pages/admin/SEODashboard"),          'SEO Dashboard');
const SearchAnalytics      = lazyWithFallback(() => import("@/pages/admin/SearchAnalytics"),       'Search Analytics');
const HomepageBuilder      = lazyWithFallback(() => import("@/pages/admin/HomepageBuilder"),       'Homepage Builder');
const Settings             = lazyWithFallback(() => import("@/pages/admin/Settings"),              'Settings');
const ServicesManager      = lazyWithFallback(() => import("@/pages/admin/ServicesManager"),       'Services Manager');
const Notifications        = lazyWithFallback(() => import("@/pages/admin/Notifications"),         'Notifications');
const EmailTemplates       = lazyWithFallback(() => import("@/pages/admin/EmailTemplates"),        'Email Templates');
const UnifiedAdminLayout   = lazy(() =>
  import("@/components/admin/UnifiedAdminLayout")
    .then(m => ({ default: m.UnifiedAdminLayout }))
    .catch(() => ({
      default: () => (
        <div className="min-h-screen flex items-center justify-center">
          <p>Failed to load Admin Layout</p>
        </div>
      ),
    }))
);

// ── Route groups ──────────────────────────────────────────────────────────────

const ServiceRouteGroup = () => (
  <>
    <Route path="/services" element={<Services />} />
    <Route path="/services/interior-buildouts" element={<InteriorBuildouts />} />
    <Route path="/services/building-envelope" element={<BuildingEnvelope />} />
    <Route path="/services/protective-coatings" element={<ProtectiveCoatings />} />
    <Route path="/services/cladding-systems" element={<CladdingSystems />} />
    <Route path="/services/tile-flooring" element={<TileFlooring />} />
    <Route path="/services/painting-services" element={<PaintingServices />} />
    <Route path="/services/sustainable-construction" element={<SustainableBuilding />} />

    {/* Legacy redirects */}
    <Route path="/services/exterior-envelope"           element={<Navigate to="/services/building-envelope" replace />} />
    <Route path="/services/exterior-cladding"           element={<Navigate to="/services/cladding-systems" replace />} />
    <Route path="/services/metal-cladding"              element={<Navigate to="/services/cladding-systems" replace />} />
    <Route path="/services/eifs-stucco"                 element={<Navigate to="/services/cladding-systems" replace />} />
    <Route path="/services/exterior-siding"             element={<Navigate to="/services/cladding-systems" replace />} />
    <Route path="/services/drywall-finishing"           element={<Navigate to="/services/interior-buildouts" replace />} />
    <Route path="/services/suite-buildouts"             element={<Navigate to="/services/interior-buildouts" replace />} />
    <Route path="/services/painting"                    element={<Navigate to="/services/painting-services" replace />} />
    <Route path="/services/condo-multi-unit"            element={<Navigate to="/services/painting-services" replace />} />
    <Route path="/services/residential-painting"        element={<Navigate to="/services/painting-services" replace />} />
    <Route path="/services/general-contracting"         element={<Navigate to="/services" replace />} />
    <Route path="/services/construction-management"     element={<Navigate to="/services" replace />} />
    <Route path="/services/design-build"                element={<Navigate to="/services" replace />} />
    <Route path="/services/facade-remediation"          element={<Navigate to="/services/building-envelope" replace />} />
    <Route path="/services/waterproofing"               element={<Navigate to="/services/building-envelope" replace />} />
    <Route path="/services/waterproofing-systems"       element={<Navigate to="/services/building-envelope" replace />} />
    <Route path="/services/commercial-painting"         element={<Navigate to="/services/painting-services" replace />} />
    <Route path="/services/parking-garage-restoration"  element={<Navigate to="/services/building-envelope" replace />} />
    <Route path="/services/parking-rehabilitation"      element={<Navigate to="/services/building-envelope" replace />} />
    <Route path="/services/sealant-replacement"         element={<Navigate to="/services/building-envelope" replace />} />
    <Route path="/services/roofing"                     element={<Navigate to="/services/building-envelope" replace />} />
    <Route path="/services/windows-doors"               element={<Navigate to="/services/building-envelope" replace />} />
    <Route path="/services/preconstruction-services"    element={<Navigate to="/services" replace />} />
    <Route path="/services/virtual-design-construction" element={<Navigate to="/services" replace />} />

    <Route path="/services/:slug" element={<ServiceDetail />} />
  </>
);

const AdminRouteGroup = () => (
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
    <Route path="contacts" element={<Navigate to="/admin/inbox" replace />} />
    <Route path="resumes" element={<Navigate to="/admin/inbox" replace />} />
    <Route path="prequalifications" element={<Navigate to="/admin/inbox" replace />} />
    <Route path="rfp" element={<Navigate to="/admin/inbox" replace />} />
    <Route path="rfp-submissions" element={<Navigate to="/admin/inbox" replace />} />
    <Route path="newsletter-subscribers" element={<Navigate to="/admin/inbox" replace />} />
    <Route path="quote-requests" element={<Navigate to="/admin/inbox?tab=quote" replace />} />
    <Route path="settings" element={<Settings />} />
    <Route path="site-settings" element={<Navigate to="/admin/settings?tab=general" replace />} />
    <Route path="footer-settings" element={<Navigate to="/admin/settings?tab=footer" replace />} />
    <Route path="contact-page-settings" element={<Navigate to="/admin/settings?tab=contact" replace />} />
    <Route path="about-page-settings" element={<Navigate to="/admin/settings?tab=about" replace />} />
    <Route path="about-page" element={<Navigate to="/admin/settings?tab=about" replace />} />
    <Route path="security-settings" element={<Navigate to="/admin/settings?tab=security" replace />} />
    <Route path="settings-health" element={<Navigate to="/admin/settings?tab=health" replace />} />
    <Route path="seo-dashboard" element={<SEODashboard />} />
    <Route path="redirects" element={<RedirectsManager />} />
    <Route path="performance-dashboard" element={<PerformanceDashboard />} />
    <Route path="search-analytics" element={<SearchAnalytics />} />
    <Route path="audit" element={<AuditDashboard />} />
    <Route path="content-versions" element={<ContentVersioning />} />
    <Route path="monitoring" element={<Monitoring />} />
    <Route path="inbox" element={<UnifiedInbox />} />
    <Route path="notifications" element={<Notifications />} />
    <Route path="email-templates" element={<EmailTemplates />} />
    <Route path="homepage-builder" element={<HomepageBuilder />} />
    <Route path="homepage-content" element={<Navigate to="/admin/homepage-builder" replace />} />
    <Route path="homepage-settings" element={<Navigate to="/admin/homepage-builder" replace />} />
    <Route path="homepage-why-choose-us" element={<Navigate to="/admin/homepage-builder?tab=why-choose" replace />} />
    <Route path="homepage-company-overview" element={<Navigate to="/admin/homepage-builder?tab=overview" replace />} />
    <Route path="hero-slides" element={<Navigate to="/admin/homepage-builder?tab=hero" replace />} />
    <Route path="hero-images" element={<Navigate to="/admin/homepage-builder?tab=hero" replace />} />
    <Route path="navigation" element={<NavigationBuilder />} />
    <Route path="navigation-builder" element={<Navigate to="/admin/navigation" replace />} />
    <Route path="hero-slides-manager" element={<HeroSlidesManager />} />
  </Route>
);

// ── App routes ────────────────────────────────────────────────────────────────

export const AppRoutes = () => (
  <Routes>
    {/* Homepage — sync, first paint */}
    <Route path="/" element={<Index />} />

    {/* Core pages */}
    <Route path="/about"                  element={<About />} />
    <Route path="/markets"                element={<Markets />} />
    <Route path="/projects"               element={<Projects />} />
    <Route path="/contact"                element={<Contact />} />
    <Route path="/estimate"               element={<Estimate />} />
    <Route path="/submit-rfp"             element={<SubmitRFPNew />} />
    <Route path="/our-process"            element={<OurProcess />} />
    <Route path="/capabilities"           element={<Capabilities />} />
    <Route path="/prequalification"       element={<Prequalification />} />
    <Route path="/faq"                    element={<FAQ />} />
    <Route path="/careers"               element={<Careers />} />

    {/* Audience pages */}
    <Route path="/for-general-contractors"   element={<ForGeneralContractors />} />
    <Route path="/for-architects"            element={<ForArchitects />} />
    <Route path="/property-managers"         element={<PropertyManagers />} />
    <Route path="/homeowners"                element={<Homeowners />} />
    <Route path="/commercial-clients"        element={<CommercialClients />} />
    <Route path="/why-specialty-contractor"  element={<WhySpecialtyContractor />} />
    <Route path="/emergency-repair"          element={<EmergencyRepair />} />

    {/* Company pages */}
    <Route path="/company/certifications-insurance" element={<CertificationsInsurance />} />
    <Route path="/company/technology"               element={<Technology />} />
    <Route path="/company/developers"               element={<Developers />} />
    <Route path="/company/equipment-resources"      element={<Navigate to="/company/technology" replace />} />

    {/* Resource pages */}
    <Route path="/resources/contractor-portal" element={<ContractorPortal />} />
    <Route path="/resources/service-areas"     element={<ServiceAreas />} />
    <Route path="/service-areas/:city"         element={<LocationPage />} />

    {/* Blog & content */}
    <Route path="/blog"               element={<Blog />} />
    <Route path="/blog/:slug"         element={<BlogPost />} />
    <Route path="/case-studies"       element={<Blog />} />
    <Route path="/case-study/:slug"   element={<BlogPost />} />
    <Route path="/projects/:slug"     element={<ProjectDetail />} />

    {/* Legal & utility */}
    <Route path="/privacy"       element={<Privacy />} />
    <Route path="/terms"         element={<Terms />} />
    <Route path="/accessibility" element={<Accessibility />} />
    <Route path="/unsubscribe"   element={<Unsubscribe />} />

    {/* Redirects */}
    <Route path="/sustainability" element={<Navigate to="/services/sustainable-construction" replace />} />
    <Route path="/insights"       element={<Navigate to="/blog" replace />} />
    <Route path="/service-selector" element={<Navigate to="/services" replace />} />

    {/* Auth (sync — lightweight) */}
    <Route path="/tekev" element={<Auth />} />

    {/* Services */}
    {ServiceRouteGroup()}

    {/* Admin */}
    {AdminRouteGroup()}

    {/* 404 */}
    <Route path="/404"  element={<NotFound />} />
    <Route path="*"     element={<NotFound />} />
  </Routes>
);
