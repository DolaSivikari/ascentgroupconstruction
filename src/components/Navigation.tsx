import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/ui/Button";
import OptimizedImage from "./OptimizedImage";
import { ChevronDown, Shield, Phone, ArrowRight, FileText } from "lucide-react";
import { useCompanySettings } from "@/hooks/useCompanySettings";
import { MegaMenuWithSections } from "./navigation/MegaMenuWithSections";
import { MobileNavSheet } from "./navigation/MobileNavSheet";
import ascentLogoHorizontalDark from "@/assets/ascent-logo-horizontal-dark.png";
import ascentLogoHorizontalLight from "@/assets/ascent-logo-horizontal-light.png";

import { megaMenuDataEnhanced } from "@/data/navigation-structure-enhanced";
import { cn } from "@/lib/utils";

import { useHoverTimeout } from "@/hooks/useHoverTimeout";
import { useAdminRoleCheck } from "@/hooks/useAdminRoleCheck";
import { useScrollDirection } from "@/hooks/useScrollDirection";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

// ---------------------------------------------------------------------------
// Admin dropdown data — add/reorder items here, no JSX changes needed
// ---------------------------------------------------------------------------
const ADMIN_NAV_SECTIONS = [
  {
    label: "Content",
    items: [
      { label: "Services Manager", to: "/admin/services-manager" },
      { label: "Projects", to: "/admin/projects" },
      { label: "Blog Posts", to: "/admin/blog-posts" },
      { label: "Testimonials", to: "/admin/testimonials" },
      { label: "Stats", to: "/admin/stats" },
      { label: "Awards & Certifications", to: "/admin/settings?tab=about" },
      { label: "Leadership Team", to: "/admin/settings?tab=leadership" },
      { label: "Documents Library", to: "/admin/documents-library" },
    ],
  },
  {
    label: "Page Editors",
    items: [
      { label: "Home Hero Menu", to: "/admin/homepage-builder?tab=hero" },
      { label: "About Us Page", to: "/admin/about-page" },
      { label: "Footer Content", to: "/admin/footer-settings" },
      { label: "Contact Page", to: "/admin/contact-page-settings" },
    ],
  },
  {
    label: "Submissions",
    items: [
      { label: "Contact Submissions", to: "/admin/contacts" },
      { label: "Resume Submissions", to: "/admin/resumes" },
      { label: "RFP Submissions", to: "/admin/rfp-submissions" },
      { label: "Prequalification Submissions", to: "/admin/prequalifications" },
    ],
  },
  {
    label: "Settings & Tools",
    items: [
      { label: "Homepage Settings", to: "/admin/homepage-settings" },
      { label: "Site Settings", to: "/admin/site-settings" },
      { label: "Media Library", to: "/admin/media" },
      { label: "Users", to: "/admin/users" },
      { label: "Security Center", to: "/admin/settings?tab=security" },
      { label: "SEO Dashboard", to: "/admin/seo-dashboard" },
      { label: "Performance Dashboard", to: "/admin/performance-dashboard" },
      { label: "Settings Health Check", to: "/admin/settings-health" },
    ],
  },
] as const;

const adminItemClass =
  "block w-full px-4 py-2 text-sm text-muted-foreground rounded-[var(--radius-xs)] border-l-2 border-transparent hover:bg-muted/30 hover:text-primary hover:pl-5 hover:border-l-primary focus:bg-muted/30 focus:text-primary transition-all";

// ---------------------------------------------------------------------------

const Navigation = () => {
  const location = useLocation();
  const { scrollDirection, isAtTop } = useScrollDirection();

  // Sticky-shrink: collapse height & shrink logo after scrolling past 100px
  const [isShrunk, setIsShrunk] = useState(false);
  useEffect(() => {
    const onScroll = () => setIsShrunk(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Pages with hero backgrounds that should have transparent navigation
  const heroPagePrefixes = ['/services/', '/service-areas/', '/blog/', '/projects/', '/company/', '/resources/'];
  const heroPageExact = new Set([
    '/', '/services', '/about', '/careers', '/capabilities',
    '/contact', '/why-specialty-contractor', '/prequalification',
    '/submit-rfp', '/for-general-contractors', '/property-managers',
    '/commercial-clients', '/homeowners', '/our-process', '/markets',
    '/faq', '/blog', '/estimate', '/projects', '/for-architects',
    '/emergency-repair', '/privacy', '/terms', '/accessibility',
  ]);
  const isHeroPage = heroPageExact.has(location.pathname) ||
    heroPagePrefixes.some(prefix => location.pathname.startsWith(prefix));

  const [isOpen, setIsOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const { settings } = useCompanySettings();

  // Check admin role
  const { isAdmin } = useAdminRoleCheck();

  // Use custom hook for hover timeout management with automatic cleanup
  const megaMenuHover = useHoverTimeout();
  const adminHover = useHoverTimeout();

  // Sync mobile menu state with body data attribute
  useEffect(() => {
    document.body.dataset.mobileMenuOpen = isOpen ? "true" : "false";
  }, [isOpen]);

  // Close mega menu whenever the route changes
  useEffect(() => {
    setActiveMegaMenu(null);
    megaMenuHover.clearPendingTimeout();
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const isActive = (path: string) => location.pathname === path;

  // Memoize event handlers for better performance
  const handleMegaMenuEnter = useCallback((menuKey: string) => {
    megaMenuHover.clearPendingTimeout();
    setActiveMegaMenu(menuKey);
  }, [megaMenuHover]);

  const handleMegaMenuLeave = useCallback(() => {
    megaMenuHover.scheduleAction(() => setActiveMegaMenu(null), 300);
  }, [megaMenuHover]);

  const closeMegaMenu = useCallback(() => {
    setActiveMegaMenu(null);
    megaMenuHover.clearPendingTimeout();
  }, [megaMenuHover]);

  // Admin dropdown hover handlers
  const openAdminDropdown = useCallback(() => {
    adminHover.clearPendingTimeout();
    setAdminDropdownOpen(true);
  }, [adminHover]);

  const scheduleCloseAdminDropdown = useCallback(() => {
    adminHover.scheduleAction(() => setAdminDropdownOpen(false), 300);
  }, [adminHover]);

  // Nav link style helper
  const navLinkClass = (menuKey?: string, path?: string) =>
    cn(
      "px-2 py-2 text-sm font-semibold tracking-wide inline-flex items-center gap-1.5 transition-all duration-300",
      "relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px]",
      "after:scale-x-0 after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-300",
      isHeroPage && isAtTop ? "after:bg-white" : "after:bg-primary",
      menuKey && activeMegaMenu === menuKey
        ? "text-primary after:scale-x-100"
        : path && isActive(path)
          ? "text-primary after:scale-x-100"
          : (isHeroPage && isAtTop ? "text-white" : "text-foreground"),
      menuKey
        ? activeMegaMenu !== menuKey && "hover:text-primary"
        : path && !isActive(path) && "hover:text-primary"
    );

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-navigation transition-all duration-300",
          scrollDirection === "down" && !isAtTop ? "-translate-y-full" : "translate-y-0",
          isHeroPage && isAtTop
            ? "bg-transparent border-transparent shadow-none"
            : "bg-background/95 backdrop-blur-xl shadow-lg border-b border-border/50"
        )}
      >
        <div className="w-full max-w-none px-4 md:px-6 lg:px-10 xl:px-14">
          <div className={cn(
            "hidden md:flex items-center justify-between w-full transition-[height] duration-300 ease-out",
            isShrunk ? "h-14 lg:h-16" : "h-16 md:h-18 lg:h-20"
          )}>
            {/* Left: Logo */}
            <div className="flex items-center">
              <Link
                to="/"
                className="flex-shrink-0 group"
                aria-label="Ascent Group Construction - Home"
              >
                <img
                  src={isHeroPage && isAtTop ? ascentLogoHorizontalLight : ascentLogoHorizontalDark}
                  alt="Ascent Group Construction Logo"
                  className={cn(
                    "w-auto hover-scale-icon transition-all duration-300 origin-left",
                    isShrunk
                      ? "h-12 lg:h-14 -my-2 lg:-my-3 scale-95"
                      : "h-14 md:h-16 lg:h-20 -my-3 md:-my-4 lg:-my-6 scale-100"
                  )}
                />
              </Link>
            </div>

            {/* Center: Main Navigation — About → Services → Markets → Projects → Trade Partners → Contact */}
            <nav className="flex items-center gap-2 lg:gap-3" aria-label="Main navigation">
              {/* About Mega-Menu */}
              <div
                className="relative"
                onMouseEnter={() => handleMegaMenuEnter("company")}
                onMouseLeave={handleMegaMenuLeave}
              >
                <Link
                  to="/about"
                  className={navLinkClass("company")}
                  aria-expanded={activeMegaMenu === "company"}
                >
                  About
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-all duration-300",
                    activeMegaMenu === "company" && "rotate-180"
                  )} />
                </Link>
                <MegaMenuWithSections
                  sections={megaMenuDataEnhanced.company.sections}
                  isOpen={activeMegaMenu === "company"}
                  onClose={closeMegaMenu}
                  config={megaMenuDataEnhanced.company}
                />
              </div>

              {/* Services Mega-Menu */}
              <div
                className="relative"
                onMouseEnter={() => handleMegaMenuEnter("services")}
                onMouseLeave={handleMegaMenuLeave}
              >
                <Link
                  to="/services"
                  className={navLinkClass("services")}
                  aria-expanded={activeMegaMenu === "services"}
                >
                  Services
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-all duration-300",
                    activeMegaMenu === "services" && "rotate-180"
                  )} />
                </Link>
                <MegaMenuWithSections
                  sections={megaMenuDataEnhanced.services.sections}
                  isOpen={activeMegaMenu === "services"}
                  onClose={closeMegaMenu}
                  config={megaMenuDataEnhanced.services}
                />
              </div>


              {/* Projects */}
              <Link
                to="/projects"
                className={navLinkClass(undefined, "/projects")}
              >
                Projects
              </Link>

              {/* Trade Partners Mega-Menu */}
              <div
                className="relative"
                onMouseEnter={() => handleMegaMenuEnter("tradePartners")}
                onMouseLeave={handleMegaMenuLeave}
              >
                <Link
                  to="/for-general-contractors"
                  className={navLinkClass("tradePartners")}
                  aria-expanded={activeMegaMenu === "tradePartners"}
                >
                  Trade Partners
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-all duration-300",
                    activeMegaMenu === "tradePartners" && "rotate-180"
                  )} />
                </Link>
                <MegaMenuWithSections
                  sections={megaMenuDataEnhanced.tradePartners.sections}
                  isOpen={activeMegaMenu === "tradePartners"}
                  onClose={closeMegaMenu}
                  config={megaMenuDataEnhanced.tradePartners}
                />
              </div>

              {/* Contact */}
              <Link
                to="/contact"
                className={navLinkClass(undefined, "/contact")}
              >
                Contact
              </Link>
            </nav>

            {/* Right: Utility Items */}
            <div className="flex items-center gap-2">
              {/* Phone Number */}
              {settings?.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className={cn(
                    "hidden lg:flex items-center gap-2 text-sm font-normal hover:text-primary hover-scale whitespace-nowrap transition-colors duration-[150ms]",
                    isHeroPage && isAtTop ? "text-white" : "text-muted-foreground"
                  )}
                >
                  <Phone className="w-4 h-4" />
                  {settings.phone}
                </a>
              )}

              {/* Primary CTA — Submit RFP */}
              <Button asChild variant="primary" size="sm" className="shadow-lg">
                <Link to="/submit-rfp" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Submit RFP
                </Link>
              </Button>

              {/* Admin Dropdown - Only visible to admin users */}
              {isAdmin && (
                <DropdownMenu open={adminDropdownOpen} onOpenChange={setAdminDropdownOpen}>
                  <DropdownMenuTrigger
                    onMouseEnter={openAdminDropdown}
                    onMouseLeave={scheduleCloseAdminDropdown}
                    className={cn(
                      "px-2 py-2 text-sm font-medium hover:text-primary hover-scale inline-flex items-center gap-1 transition-colors duration-[150ms]",
                      "link-underline",
                      adminDropdownOpen && "text-primary scale-105",
                      !adminDropdownOpen && (isHeroPage && isAtTop ? "text-white" : "text-foreground")
                    )}
                    aria-expanded={adminDropdownOpen}
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-[transform] duration-[150ms]",
                      adminDropdownOpen && "rotate-180"
                    )} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    onMouseEnter={openAdminDropdown}
                    onMouseLeave={scheduleCloseAdminDropdown}
                    className="w-64 bg-background text-foreground rounded-[var(--radius-sm)] border border-border z-mega-menu mt-2 p-0 animate-enter [box-shadow:var(--shadow-dropdown)]"
                  >
                    <DropdownMenuItem asChild className="p-0 focus:bg-transparent focus:text-inherit">
                      <Link
                        to="/admin"
                        onClick={() => setAdminDropdownOpen(false)}
                        className={adminItemClass}
                      >
                        Dashboard
                      </Link>
                    </DropdownMenuItem>

                    {ADMIN_NAV_SECTIONS.map((section) => (
                      <div key={section.label}>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className="px-4 py-2 text-xs font-semibold text-muted-foreground">
                          {section.label}
                        </DropdownMenuLabel>
                        {section.items.map((item) => (
                          <DropdownMenuItem
                            key={item.to}
                            asChild
                            className="p-0 focus:bg-transparent focus:text-inherit"
                          >
                            <Link
                              to={item.to}
                              onClick={() => setAdminDropdownOpen(false)}
                              className={adminItemClass}
                            >
                              {item.label}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </div>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="flex md:hidden items-center justify-between h-16">
            {/* Mobile Logo */}
            <Link
              to="/"
              className="flex-shrink-0"
              aria-label="Ascent Group Construction - Home"
            >
              <img
                src={isHeroPage && isAtTop ? ascentLogoHorizontalLight : ascentLogoHorizontalDark}
                alt="Ascent Group Construction Logo"
                className="h-12 -my-2 w-auto"
              />
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-foreground relative flex items-center justify-center h-11 w-11 min-h-[44px] min-w-[44px] rounded-md hover:bg-muted active:bg-muted/70 active:scale-95 transition-all duration-[150ms] touch-manipulation"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <span className={`absolute inset-0 rounded-md bg-primary/10 transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-0'}`} />
              <div className="flex flex-col gap-1.5 w-6 relative z-10">
                <span className={`h-0.5 w-full bg-current rounded-full transition-all duration-300 ease-out ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`h-0.5 w-full bg-current rounded-full transition-all duration-[150ms] ease-out ${isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`} />
                <span className={`h-0.5 w-full bg-current rounded-full transition-all duration-300 ease-out ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>

          {/* Mobile Navigation Sheet */}
          <MobileNavSheet
            open={isOpen}
            onOpenChange={setIsOpen}
          />
        </div>
      </nav>
    </>
  );
};

export default Navigation;
