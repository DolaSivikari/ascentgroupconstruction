import { lazy, type ComponentType } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Index from "@/pages/Index";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Markets from "@/pages/Markets";
import Projects from "@/pages/Projects";
import Contact from "@/pages/Contact";
import Estimate from "@/pages/Estimate";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
import PropertyManagers from "@/pages/PropertyManagers";
import Homeowners from "@/pages/Homeowners";
import CommercialClients from "@/pages/CommercialClients";
import OurProcess from "@/pages/OurProcess";
import Prequalification from "@/pages/Prequalification";
import Capabilities from "@/pages/Capabilities";
import Careers from "@/pages/Careers";
import ServiceDetail from "@/pages/ServiceDetail";
import InteriorBuildouts from "@/pages/services/InteriorBuildouts";
import BuildingEnvelope from "@/pages/services/BuildingEnvelope";
import ProtectiveCoatings from "@/pages/services/ProtectiveCoatings";
import CladdingSystems from "@/pages/services/CladdingSystems";
import TileFlooring from "@/pages/services/TileFlooring";
import PaintingServices from "@/pages/services/PaintingServices";
import SustainableBuilding from "@/pages/services/SustainableBuilding";
import FAQ from "@/pages/FAQ";
import CertificationsInsurance from "@/pages/company/CertificationsInsurance";
import ContractorPortal from "@/pages/resources/ContractorPortal";
import ServiceAreas from "@/pages/resources/ServiceAreas";
import LocationPage from "@/pages/resources/LocationPage";
import Technology from "@/pages/company/Technology";
import Developers from "@/pages/company/Developers";
import ForGeneralContractors from "@/pages/ForGeneralContractors";
import SubmitRFPNew from "@/pages/SubmitRFPNew";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Accessibility from "@/pages/Accessibility";
import Unsubscribe from "@/pages/Unsubscribe";
import WhySpecialtyContractor from "@/pages/WhySpecialtyContractor";

const lazyWithFallback = (importer: () => Promise<{ default: ComponentType }>, name: string) =>
  lazy(() => importer().catch(() => ({
    default: () => <div className="min-h-screen flex items-center justify-center"><p>Failed to load {name}</p></div>
  })));

const Dashboard = lazyWithFallback(() => import("@/pages/admin/Dashboard"), 'Dashboard');
const AdminProjects = lazyWithFallback(() => import("@/pages/admin/Projects"), 'Projects');
const ServiceEditor = lazyWithFallback(() => import("@/pages/admin/ServiceEditor"), 'Service Editor');
const ProjectEditor = lazyWithFallback(() => import("@/pages/admin/ProjectEditor"), 'Project Editor');
const TestimonialsManager = lazyWithFallback(() => import("@/pages/admin/TestimonialsManager"), 'Testimonials Manager');
const StatsManager = lazyWithFallback(() => import("@/pages/admin/StatsManager"), 'Stats Manager');
const DocumentsLibrary = lazyWithFallback(() => import("@/pages/admin/DocumentsLibrary"), 'Documents Library');
const AdminBlogPosts = lazyWithFallback(() => import("@/pages/admin/BlogPosts"), 'Blog Posts');
const BlogPostEditor = lazyWithFallback(() => import("@/pages/admin/BlogPostEditor"), 'Blog Post Editor');
const MediaLibrary = lazyWithFallback(() => import("@/pages/admin/MediaLibraryEnhanced"), 'Media Library');
const Users = lazyWithFallback(() => import("@/pages/admin/Users"), 'Users');
const PerformanceDashboard = lazyWithFallback(() => import("@/pages/admin/PerformanceDashboard"), 'Performance Dashboard');
const UnifiedInbox = lazyWithFallback(() => import("@/pages/admin/UnifiedInbox"), 'Unified Inbox');
const AuditDashboard = lazyWithFallback(() => import("@/pages/admin/AuditDashboard"), 'Audit Dashboard');
const ContentVersioning = lazyWithFallback(() => import("@/pages/admin/ContentVersioning"), 'Content Versioning');
const Monitoring = lazyWithFallback(() => import("@/pages/admin/Monitoring"), 'Monitoring');
const NavigationBuilder = lazyWithFallback(() => import("@/pages/admin/NavigationBuilder"), 'Navigation Builder');
const RedirectsManager = lazyWithFallback(() => import("@/pages/admin/RedirectsManager"), 'Redirects Manager');
const HeroSlidesManager = lazyWithFallback(() => import("@/pages/admin/HeroSlidesManager"), 'Hero Slides Manager');
const SEODashboard = lazyWithFallback(() => import("@/pages/admin/SEODashboard"), 'SEO Dashboard');
const SearchAnalytics = lazyWithFallback(() => import("@/pages/admin/SearchAnalytics"), 'Search Analytics');
const HomepageBuilder = lazyWithFallback(() => import("@/pages/admin/HomepageBuilder"), 'Homepage Builder');
const Settings = lazyWithFallback(() => import("@/pages/admin/Settings"), 'Settings');
const ServicesManager = lazyWithFallback(() => import("@/pages/admin/ServicesManager"), 'Services Manager');
const Notifications = lazyWithFallback(() => import("@/pages/admin/Notifications"), 'Notifications');
const EmailTemplates = lazyWithFallback(() => import("@/pages/admin/EmailTemplates"), 'Email Templates');
const Testing = lazyWithFallback(() => import("@/pages/admin/Testing"), 'Testing');
const UnifiedAdminLayout = lazy(() => import("@/components/admin/UnifiedAdminLayout").then(m => ({ default: m.UnifiedAdminLayout })).catch(() => ({
  default: () => <div className="min-h-screen flex items-center justify-center"><p>Failed to load Admin Layout</p></div>
})));
const Blog = lazyWithFallback(() => import("@/pages/Blog"), 'Blog');
const BlogPost = lazyWithFallback(() => import("@/pages/BlogPost"), 'Blog Post');
const ProjectDetail = lazyWithFallback(() => import("@/pages/ProjectDetail"), 'Project Detail');

const ServiceRouteGroup = () => (
  <>
    <Route path="/services" element={<Services />} />
    <Route path="/services/interior-buildouts" element={<InteriorBuildouts />} />
    <Route path="/services/building-envelope" element={<BuildingEnvelope />} />
    {/* masonry-restoration falls through to /services/:slug → ServiceDetail (published DB record) */}
    <Route path="/services/protective-coatings" element={<ProtectiveCoatings />} />
    <Route path="/services/cladding-systems" element={<CladdingSystems />} />
    <Route path="/services/tile-flooring" element={<TileFlooring />} />
    <Route path="/services/painting-services" element={<PaintingServices />} />
    <Route path="/services/sustainable-construction" element={<SustainableBuilding />} />

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
    <Route path="testing" element={<Testing />} />
    <Route path="homepage-builder" element={<HomepageBuilder />} />
    <Route path="homepage-content" element={<Navigate to="/admin/homepage-builder" replace />} />
    <Route path="homepage-settings" element={<Navigate to="/admin/homepage-builder" replace />} />
    <Route path="homepage-why-choose-us" element={<Navigate to="/admin/homepage-builder?tab=why-choose" replace />} />
    <Route path="homepage-company-overview" element={<Navigate to="/admin/homepage-builder?tab=overview" replace />} />
    <Route path="hero-slides" element={<Navigate to="/admin/homepage-builder?tab=hero" replace />} />
    <Route path="hero-images" element={<Navigate to="/admin/homepage-builder?tab=hero" replace />} />
    <Route path="navigation" element={<NavigationBuilder />} />
    <Route path="navigation-builder" element={<Navigate to="/admin/navigation" replace />} />
  </Route>
);

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/about" element={<About />} />
    <Route path="/markets" element={<Markets />} />
    <Route path="/why-specialty-contractor" element={<WhySpecialtyContractor />} />
    <Route path="/prequalification" element={<Prequalification />} />
    <Route path="/capabilities" element={<Capabilities />} />
    <Route path="/careers" element={<Careers />} />

    {/* Phase 4 redirects: consolidated pages */}
    <Route path="/sustainability" element={<Navigate to="/services/sustainable-construction" replace />} />
    <Route path="/insights" element={<Navigate to="/blog" replace />} />
    <Route path="/service-selector" element={<Navigate to="/services" replace />} />

    {ServiceRouteGroup()}

    <Route path="/projects" element={<Projects />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/estimate" element={<Estimate />} />
    <Route path="/submit-rfp" element={<SubmitRFPNew />} />
    <Route path="/for-general-contractors" element={<ForGeneralContractors />} />
    <Route path="/privacy" element={<Privacy />} />
    <Route path="/terms" element={<Terms />} />
    <Route path="/accessibility" element={<Accessibility />} />
    <Route path="/unsubscribe" element={<Unsubscribe />} />
    <Route path="/property-managers" element={<PropertyManagers />} />
    <Route path="/homeowners" element={<Homeowners />} />
    <Route path="/commercial-clients" element={<CommercialClients />} />
    <Route path="/our-process" element={<OurProcess />} />
    <Route path="/faq" element={<FAQ />} />
    <Route path="/tekev" element={<Auth />} />
    <Route path="/company/certifications-insurance" element={<CertificationsInsurance />} />
    <Route path="/company/equipment-resources" element={<Navigate to="/company/technology" replace />} />
    <Route path="/company/technology" element={<Technology />} />
    <Route path="/company/developers" element={<Developers />} />
    <Route path="/resources/contractor-portal" element={<ContractorPortal />} />
    <Route path="/resources/service-areas" element={<ServiceAreas />} />
    <Route path="/service-areas/:city" element={<LocationPage />} />
    <Route path="/blog" element={<Blog />} />
    <Route path="/blog/:slug" element={<BlogPost />} />
    <Route path="/case-studies" element={<Blog />} />
    <Route path="/case-study/:slug" element={<BlogPost />} />
    <Route path="/projects/:slug" element={<ProjectDetail />} />

    {AdminRouteGroup()}

    <Route path="/404" element={<NotFound />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);
