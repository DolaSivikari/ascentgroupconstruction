import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Building2, Wrench, Sparkles, ChevronRight } from "lucide-react";
import ascentLogoVerticalWhite from "@/assets/ascent-logo-vertical-white.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AscentEmailLink } from "../EmailLink";

interface Service {
  name: string;
  slug: string;
}

interface UnifiedFooterProps {
  logoUrl: string;
  contactInfo: {
    phone: string;
    email: string;
    address?: string;
  };
  linkedinUrl?: string;
  foundedYear: number;
  services: Service[];
  showLogo?: boolean;
}

export function UnifiedFooter({
  logoUrl,
  contactInfo,
  linkedinUrl,
  foundedYear,
  services,
  showLogo = true,
}: UnifiedFooterProps) {
  const currentYear = new Date().getFullYear();
  const { phone, email, address } = contactInfo;

  // Get top 6 services for featured display
  const featuredServices = services.slice(0, 6);
  const hasMoreServices = services.length > 6;

  // Company links
  const companyLinks = [
    { label: "About", href: "/about" },
    { label: "Our Process", href: "/our-process" },
    { label: "Markets", href: "/markets" },
    { label: "Trade Partners", href: "/for-general-contractors" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
  ];

  return (
    <div className="w-full">
      {/* Mobile: Accordion Layout */}
      <div className="md:hidden space-y-2">
        {/* Tagline */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Building envelope & restoration contractor serving Ontario & GTA
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-2">
          {/* Company Section */}
          <AccordionItem value="company" className="border border-border/50 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors [&[data-state=open]]:bg-muted/50">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <Building2 className="h-4 w-4 text-primary" />
                Company
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <ul className="space-y-2">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Services Section */}
          <AccordionItem value="services" className="border border-border/50 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors [&[data-state=open]]:bg-muted/50">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <Wrench className="h-4 w-4 text-primary" />
                Services
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="grid grid-cols-2 gap-2">
                {featuredServices.map((service) => (
                  <Link
                    key={service.slug}
                    to={`/services/${service.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {service.name}
                  </Link>
                ))}
              </div>
              {hasMoreServices && (
                <Link
                  to="/services"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors mt-3 group"
                >
                  View All Services
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Contact Info */}
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-bold text-foreground">Contact</h3>
            {email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <AscentEmailLink className="text-sm text-muted-foreground hover:text-primary transition-colors break-all" showIcon={false} />
              </div>
            )}
          {phone && (
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone className="h-4 w-4 flex-shrink-0" />
              {phone}
            </a>
          )}
          {address && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{address}</span>
            </div>
          )}
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our LinkedIn page"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin className="h-4 w-4 flex-shrink-0" />
              LinkedIn
            </a>
          )}
        </div>
      </div>

      {/* Desktop: Flex Layout with Logo Outside Grid */}
      <div className="hidden md:flex gap-8 items-start">
        {/* Logo - Positioned to far left, outside normal boundaries */}
        {showLogo && (
          <div className="flex-shrink-0 -ml-16">
            <img 
              src={ascentLogoVerticalWhite} 
              alt="Ascent Group Construction Logo" 
              className="h-32 w-auto object-contain"
            />
          </div>
        )}

        {/* Content Grid - Takes remaining space */}
        <div className="flex-1 grid grid-cols-11 gap-6">
          {/* Column 1-3: Company */}
          <div className="col-span-3 space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Building2 className="h-5 w-5 text-primary" />
            Company
          </h3>
          <nav>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

          {/* Column 4-8: Services */}
          <div className="col-span-5 space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Wrench className="h-5 w-5 text-primary" />
            Services
          </h3>
          <nav>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {featuredServices.map((service) => (
                <Link
                  key={service.slug}
                  to={`/services/${service.slug}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors line-clamp-1"
                  title={service.name}
                >
                  {service.name}
                </Link>
              ))}
            </div>
            {hasMoreServices && (
              <Link
                to="/services"
                className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors mt-3 group"
              >
                View All Services
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </nav>
        </div>

          {/* Column 9-11: Start Your Project + Contact */}
          <div className="col-span-3 space-y-6">
          {/* Start Your Project CTA */}
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Sparkles className="h-5 w-5 text-primary" />
              Start Your Project
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ready to discuss your project? Request a site assessment.
            </p>
            <div className="flex flex-col gap-2">
              <Link
                to="/submit-rfp"
                className="inline-flex items-center justify-center rounded-md px-4 py-3 text-sm font-semibold text-white bg-primary hover:bg-primary/90 transition-colors"
              >
                Submit RFP
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center rounded-md px-4 py-3 text-sm font-semibold text-primary border-2 border-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                View Services
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
          {email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <AscentEmailLink className="text-sm text-muted-foreground hover:text-primary transition-colors break-all" showIcon={false} />
              </div>
            )}
            {phone && (
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4 flex-shrink-0" />
                {phone}
              </a>
            )}
            {address && (
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{address}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-border/50">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <p className="text-xs md:text-sm text-muted-foreground">
              © {currentYear} Ascent Group Construction. All rights reserved.
            </p>
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
              <span>WSIB Compliant</span>
              <span>•</span>
              <span>Fully Insured</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link
              to="/privacy"
              className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/accessibility"
              className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Accessibility
            </Link>
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our LinkedIn page"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
        <div className="md:hidden flex items-center gap-2 text-xs text-muted-foreground mt-3">
          <span>WSIB Compliant</span>
          <span>•</span>
          <span>Fully Insured</span>
        </div>
      </div>
    </div>
  );
}
