import { lazy, type ComponentType } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { PageTransition } from "@/components/animations/PageTransition";
import { SERVICE_REDIRECTS } from "@/data/service-redirects";
import { LegacyInboxRedirect } from "@/components/admin/LegacyInboxRedirect";
import { LegacyArticleRedirect } from "@/components/blog/LegacyArticleRedirect";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

const lazyWithFallback = (
  importer: () => Promise<{ default: ComponentType }>,
  name: string,
) =>
  lazy(() =>
    importer().catch(() => ({
      default: () => (
        <div className="min-h-screen flex items-center justify-center">
          <p>Failed to load {name}</p>
        </div>
      ),
    })),
  );

// Public pages — lazy-loaded for smaller initial bundle (only Index loads eagerly)
const About = lazyWithFallback(() => import("@/pages/About"), "About");
const Services = lazyWithFallback(() => import("@/pages/Services"), "Services");
const Markets = lazyWithFallback(() => import("@/pages/Markets"), "Markets");
const Projects = lazyWithFallback(() => import("@/pages/Projects"), "Projects");
const Contact = lazyWithFallback(() => import("@/pages/Contact"), "Contact");
const Estimate = lazyWithFallback(() => import("@/pages/Estimate"), "Estimate");
const Auth = lazyWithFallback(() => import("@/pages/Auth"), "Auth");
const OAuthConsent = lazyWithFallback(
  () => import("@/pages/OAuthConsent"),
  "Authorize access",
);
const PropertyManagers = lazyWithFallback(
  () => import("@/pages/PropertyManagers"),
  "Property Managers",
);
const Homeowners = lazyWithFallback(
  () => import("@/pages/Homeowners"),
  "Homeowners",
);
const CommercialClients = lazyWithFallback(
  () => import("@/pages/CommercialClients"),
  "Commercial Clients",
);
const OurProcess = lazyWithFallback(
  () => import("@/pages/OurProcess"),
  "Our Process",
);
const Prequalification = lazyWithFallback(
  () => import("@/pages/Prequalification"),
  "Prequalification",
);
const Capabilities = lazyWithFallback(
  () => import("@/pages/Capabilities"),
  "Capabilities",
);
const Careers = lazyWithFallback(() => import("@/pages/Careers"), "Careers");
const ServiceDetail = lazyWithFallback(
  () => import("@/pages/ServiceDetail"),
  "Service Detail",
);
const FAQ = lazyWithFallback(() => import("@/pages/FAQ"), "FAQ");
const CertificationsInsurance = lazyWithFallback(
  () => import("@/pages/company/CertificationsInsurance"),
  "Certifications & Insurance",
);
const ContractorPortal = lazyWithFallback(
  () => import("@/pages/resources/ContractorPortal"),
  "Contractor Portal",
);
const ServiceAreas = lazyWithFallback(
  () => import("@/pages/resources/ServiceAreas"),
  "Service Areas",
);
const LocationPage = lazyWithFallback(
  () => import("@/pages/resources/LocationPage"),
  "Location",
);
const Technology = lazyWithFallback(
  () => import("@/pages/company/Technology"),
  "Technology",
);
const Developers = lazyWithFallback(
  () => import("@/pages/company/Developers"),
  "Developers",
);
const ForGeneralContractors = lazyWithFallback(
  () => import("@/pages/ForGeneralContractors"),
  "For General Contractors",
);
const ForArchitects = lazyWithFallback(
  () => import("@/pages/ForArchitects"),
  "For Architects",
);
const EmergencyRepair = lazyWithFallback(
  () => import("@/pages/EmergencyRepair"),
  "Emergency Repair",
);
const SubmitRFPNew = lazyWithFallback(
  () => import("@/pages/SubmitRFPNew"),
  "Submit RFP",
);
const Privacy = lazyWithFallback(() => import("@/pages/Privacy"), "Privacy");
const Terms = lazyWithFallback(() => import("@/pages/Terms"), "Terms");
const Accessibility = lazyWithFallback(
  () => import("@/pages/Accessibility"),
  "Accessibility",
);
const Unsubscribe = lazyWithFallback(
  () => import("@/pages/Unsubscribe"),
  "Unsubscribe",
);
const EmailUnsubscribe = lazyWithFallback(
  () => import("@/pages/EmailUnsubscribe"),
  "Email Unsubscribe",
);
const WhySpecialtyContractor = lazyWithFallback(
  () => import("@/pages/WhySpecialtyContractor"),
  "Why Specialty Contractor",
);

// Wave 1 + Wave 2 AEO/GEO landing pages — static routes registered BEFORE /services/:slug catch-all
const CommercialPaintingGTA = lazyWithFallback(
  () => import("@/pages/services/CommercialPaintingGTA"),
  "Commercial Painting GTA",
);
const FireRetardantCoatingsOntario = lazyWithFallback(
  () => import("@/pages/services/FireRetardantCoatingsOntario"),
  "Fire Retardant Coatings",
);
const ExteriorPaintingToronto = lazyWithFallback(
  () => import("@/pages/services/ExteriorPaintingToronto"),
  "Exterior Painting Toronto",
);
const CaulkingSealantsToronto = lazyWithFallback(
  () => import("@/pages/services/CaulkingSealantsToronto"),
  "Caulking & Sealants Toronto",
);
const InteriorPaintingToronto = lazyWithFallback(
  () => import("@/pages/services/InteriorPaintingToronto"),
  "Interior Painting Toronto",
);
const ResidentialExteriorPaintingGTA = lazyWithFallback(
  () => import("@/pages/services/ResidentialExteriorPaintingGTA"),
  "Residential Exterior Painting GTA",
);
const TileInstallationToronto = lazyWithFallback(
  () => import("@/pages/services/TileInstallationToronto"),
  "Tile Installation Toronto",
);
const FlooringInstallationGTA = lazyWithFallback(
  () => import("@/pages/services/FlooringInstallationGTA"),
  "Flooring Installation GTA",
);
const HandymanPatchingToronto = lazyWithFallback(
  () => import("@/pages/services/HandymanPatchingToronto"),
  "Handyman & Patching Toronto",
);

const CredentialPackage = lazyWithFallback(
  () => import("@/pages/CredentialPackage"),
  "Credential Package",
);
const AdminPages = lazyWithFallback(
  () => import("@/pages/admin/Pages"),
  "Pages",
);
const CredentialsVault = lazyWithFallback(
  () => import("@/pages/admin/CredentialsVault"),
  "Credentials Vault",
);

// Admin pages
const PageHeaders = lazyWithFallback(
  () => import("@/pages/admin/PageHeaders"),
  "Page Headers",
);
const Dashboard = lazyWithFallback(
  () => import("@/pages/admin/Dashboard"),
  "Dashboard",
);
const AdminProjects = lazyWithFallback(
  () => import("@/pages/admin/Projects"),
  "Projects",
);
const ServiceEditor = lazyWithFallback(
  () => import("@/pages/admin/ServiceEditor"),
  "Service Editor",
);
const ProjectEditor = lazyWithFallback(
  () => import("@/pages/admin/ProjectEditor"),
  "Project Editor",
);
const DocumentsLibrary = lazyWithFallback(
  () => import("@/pages/admin/DocumentsLibrary"),
  "Documents Library",
);
const AdminBlogPosts = lazyWithFallback(
  () => import("@/pages/admin/BlogPosts"),
  "Blog Posts",
);
const BlogPostEditor = lazyWithFallback(
  () => import("@/pages/admin/BlogPostEditor"),
  "Blog Post Editor",
);
const EmailDelivery = lazyWithFallback(
  () => import("@/pages/admin/EmailDelivery"),
  "Email Delivery",
);
const MediaLibrary = lazyWithFallback(
  () => import("@/pages/admin/MediaLibraryEnhanced"),
  "Media Library",
);
const Users = lazyWithFallback(() => import("@/pages/admin/Users"), "Users");
const UnifiedInbox = lazyWithFallback(
  () => import("@/pages/admin/UnifiedInbox"),
  "Unified Inbox",
);
const EstimatesQuotes = lazyWithFallback(
  () => import("@/pages/admin/EstimatesQuotes"),
  "Estimates & Quotes",
);
const AuditDashboard = lazyWithFallback(
  () => import("@/pages/admin/AuditDashboard"),
  "Audit Dashboard",
);
const Monitoring = lazyWithFallback(
  () => import("@/pages/admin/Monitoring"),
  "Monitoring",
);
const HeroSlidesManager = lazyWithFallback(
  () => import("@/pages/admin/HeroSlidesManager"),
  "Hero Slides Manager",
);
const SEODashboard = lazyWithFallback(
  () => import("@/pages/admin/SEODashboard"),
  "SEO Dashboard",
);
const HomepageBuilder = lazyWithFallback(
  () => import("@/pages/admin/HomepageBuilder"),
  "Homepage Builder",
);
const Settings = lazyWithFallback(
  () => import("@/pages/admin/Settings"),
  "Settings",
);
const ServicesManager = lazyWithFallback(
  () => import("@/pages/admin/ServicesManager"),
  "Services Manager",
);
const QAQuickContactForm = lazyWithFallback(
  () => import("@/pages/admin/QAQuickContactForm"),
  "QA Quick Contact Form",
);
const UnifiedAdminLayout = lazy(() =>
  import("@/components/admin/UnifiedAdminLayout")
    .then((m) => ({ default: m.UnifiedAdminLayout }))
    .catch(() => ({
      default: () => (
        <div className="min-h-screen flex items-center justify-center">
          <p>Failed to load Admin Layout</p>
        </div>
      ),
    })),
);
const Blog = lazyWithFallback(() => import("@/pages/Blog"), "Blog");
const BlogPost = lazyWithFallback(
  () => import("@/pages/BlogPost"),
  "Blog Post",
);
const ProjectDetail = lazyWithFallback(
  () => import("@/pages/ProjectDetail"),
  "Project Detail",
);
const TokenPreview = lazyWithFallback(
  () => import("@/pages/dev/TokenPreview"),
  "Token Preview",
);

const ServiceRouteGroup = () => (
  <>
    <Route path="/services" element={<Services />} />

    {/* Legacy service aliases stay out of the canonical page inventory. */}
    {Object.entries(SERVICE_REDIRECTS).map(([slug, destination]) => (
      <Route
        key={slug}
        path={`/services/${slug}`}
        element={<Navigate to={destination} replace />}
      />
    ))}

    {/* Wave 1 + Wave 2 AEO/GEO landing pages — static, must come BEFORE /services/:slug */}
    <Route
      path="/services/commercial-painting-gta"
      element={<CommercialPaintingGTA />}
    />
    <Route
      path="/services/fire-retardant-coatings-ontario"
      element={<FireRetardantCoatingsOntario />}
    />
    <Route
      path="/services/exterior-painting-toronto"
      element={<ExteriorPaintingToronto />}
    />
    <Route
      path="/services/caulking-sealants-toronto"
      element={<CaulkingSealantsToronto />}
    />
    <Route
      path="/services/interior-painting-toronto"
      element={<InteriorPaintingToronto />}
    />
    <Route
      path="/services/residential-exterior-painting-gta"
      element={<ResidentialExteriorPaintingGTA />}
    />
    <Route
      path="/services/tile-installation-toronto"
      element={<TileInstallationToronto />}
    />
    <Route
      path="/services/flooring-installation-gta"
      element={<FlooringInstallationGTA />}
    />
    <Route
      path="/services/handyman-patching-toronto"
      element={<HandymanPatchingToronto />}
    />

    {/* All other service detail pages are DB-driven */}
    <Route path="/services/:slug" element={<ServiceDetail />} />
  </>
);

const AdminRouteGroup = () => (
  <Route path="/admin" element={<UnifiedAdminLayout />}>
    <Route index element={<Dashboard />} />
    <Route
      path="services"
      element={<Navigate to="/admin/services-manager" replace />}
    />
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
    <Route
      path="stats"
      element={<Navigate to="/admin/seo-dashboard" replace />}
    />
    <Route
      path="testimonials"
      element={<Navigate to="/admin/pages" replace />}
    />
    <Route path="documents-library" element={<DocumentsLibrary />} />
    <Route path="contacts" element={<LegacyInboxRedirect kind="contact" />} />
    <Route path="resumes" element={<LegacyInboxRedirect kind="resume" />} />
    <Route
      path="prequalifications"
      element={<LegacyInboxRedirect kind="prequal" />}
    />
    <Route path="rfp" element={<LegacyInboxRedirect kind="rfp" />} />
    <Route
      path="rfp-submissions"
      element={<LegacyInboxRedirect kind="rfp" />}
    />
    <Route
      path="newsletter-subscribers"
      element={<LegacyInboxRedirect kind="newsletter" />}
    />
    <Route
      path="quote-requests"
      element={<LegacyInboxRedirect kind="quote" />}
    />
    <Route path="estimates-quotes" element={<EstimatesQuotes />} />
    <Route path="settings" element={<Settings />} />
    <Route
      path="site-settings"
      element={<Navigate to="/admin/settings?tab=general" replace />}
    />
    <Route
      path="footer-settings"
      element={<Navigate to="/admin/settings?tab=footer" replace />}
    />
    <Route
      path="contact-page-settings"
      element={<Navigate to="/admin/settings?tab=contact" replace />}
    />
    <Route
      path="about-page-settings"
      element={<Navigate to="/admin/settings?tab=about" replace />}
    />
    <Route
      path="about-page"
      element={<Navigate to="/admin/settings?tab=about" replace />}
    />
    <Route
      path="security-settings"
      element={<Navigate to="/admin/settings?tab=security" replace />}
    />
    <Route
      path="settings-health"
      element={<Navigate to="/admin/settings?tab=health" replace />}
    />
    <Route path="seo-dashboard" element={<SEODashboard />} />
    <Route
      path="performance-dashboard"
      element={<Navigate to="/admin/monitoring" replace />}
    />
    <Route
      path="search-analytics"
      element={<Navigate to="/admin/seo-dashboard" replace />}
    />
    <Route path="email-delivery" element={<EmailDelivery />} />
    <Route path="audit" element={<AuditDashboard />} />
    <Route path="monitoring" element={<Monitoring />} />
    <Route path="inbox" element={<UnifiedInbox />} />
    <Route path="notifications" element={<LegacyInboxRedirect />} />
    <Route
      path="email-templates"
      element={<Navigate to="/admin/email-delivery" replace />}
    />
    <Route path="homepage-builder" element={<HomepageBuilder />} />
    <Route path="page-headers" element={<PageHeaders />} />
    <Route path="pages" element={<AdminPages />} />
    <Route path="credentials" element={<CredentialsVault />} />
    <Route path="qa/quick-contact-form" element={<QAQuickContactForm />} />
    <Route
      path="homepage-content"
      element={<Navigate to="/admin/homepage-builder" replace />}
    />
    <Route
      path="homepage-settings"
      element={<Navigate to="/admin/homepage-builder" replace />}
    />
    <Route
      path="homepage-why-choose-us"
      element={<Navigate to="/admin/homepage-builder?tab=why-choose" replace />}
    />
    <Route
      path="homepage-company-overview"
      element={<Navigate to="/admin/homepage-builder?tab=overview" replace />}
    />
    <Route
      path="hero-slides"
      element={<Navigate to="/admin/homepage-builder?tab=hero" replace />}
    />
    <Route
      path="hero-images"
      element={<Navigate to="/admin/homepage-builder?tab=hero" replace />}
    />
  </Route>
);

export const AppRoutes = () => (
  <PageTransition type="fade" duration={300}>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/markets" element={<Markets />} />
      <Route
        path="/why-specialty-contractor"
        element={<WhySpecialtyContractor />}
      />
      <Route path="/prequalification" element={<Prequalification />} />
      <Route path="/capabilities" element={<Capabilities />} />
      <Route path="/careers" element={<Careers />} />

      {/* Phase 4 redirects: consolidated pages */}
      <Route
        path="/sustainability"
        element={<Navigate to="/services/sustainable-building" replace />}
      />
      <Route path="/insights" element={<Navigate to="/blog" replace />} />
      <Route
        path="/service-selector"
        element={<Navigate to="/services" replace />}
      />
      {/* Legacy CTA shortlinks (previously handled by Netlify _redirects, which Lovable hosting ignores) */}
      <Route path="/free-quote" element={<Navigate to="/contact" replace />} />
      <Route
        path="/get-estimate"
        element={<Navigate to="/contact" replace />}
      />

      {ServiceRouteGroup()}

      <Route path="/projects" element={<Projects />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/prequal-package/:token" element={<CredentialPackage />} />
      <Route path="/estimate" element={<Estimate />} />
      <Route path="/submit-rfp" element={<SubmitRFPNew />} />
      <Route
        path="/for-general-contractors"
        element={<ForGeneralContractors />}
      />
      <Route path="/for-architects" element={<ForArchitects />} />
      <Route path="/emergency-repair" element={<EmergencyRepair />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/accessibility" element={<Accessibility />} />
      <Route path="/unsubscribe" element={<Unsubscribe />} />
      <Route path="/email-unsubscribe" element={<EmailUnsubscribe />} />
      <Route path="/property-managers" element={<PropertyManagers />} />
      <Route path="/homeowners" element={<Homeowners />} />
      <Route path="/commercial-clients" element={<CommercialClients />} />
      <Route path="/our-process" element={<OurProcess />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/tekev" element={<Auth />} />
      <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />
      <Route
        path="/company/certifications-insurance"
        element={<CertificationsInsurance />}
      />
      <Route
        path="/company/equipment-resources"
        element={<Navigate to="/company/technology" replace />}
      />
      <Route path="/company/technology" element={<Technology />} />
      <Route path="/company/developers" element={<Developers />} />
      <Route
        path="/resources/contractor-portal"
        element={<ContractorPortal />}
      />
      <Route path="/resources/service-areas" element={<ServiceAreas />} />
      <Route path="/service-areas/:city" element={<LocationPage />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/case-studies" element={<Navigate to="/blog" replace />} />
      <Route path="/case-study/:slug" element={<LegacyArticleRedirect />} />
      <Route path="/projects/:slug" element={<ProjectDetail />} />

      {AdminRouteGroup()}

      {/* Internal — design token preview (DEV mode only) */}
      {import.meta.env.DEV && (
        <Route path="/dev/tokens" element={<TokenPreview />} />
      )}

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </PageTransition>
);
