import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ascentLogoVerticalDark from "@/assets/ascent-logo-vertical-dark.png";
import OptimizedImage from "../OptimizedImage";
import { AscentEmailLink } from "../EmailLink";

interface ProfessionalFooterProps {
  companyLinks: { label: string; href: string }[];
  services: { name: string; slug: string }[];
  contactInfo: { phone: string; email: string; address: string };
  logoUrl: string;
  serviceAreaText: string;
  linkedinUrl: string;
  foundedYear: number;
}

export const ProfessionalFooter = ({
  companyLinks,
  services,
  contactInfo,
  logoUrl,
  serviceAreaText,
  linkedinUrl,
  foundedYear,
}: ProfessionalFooterProps) => {
  const currentYear = new Date().getFullYear();
  const yearsExperience = currentYear - foundedYear;

  const marketLinks = [
    { label: "Property Managers", href: "/property-managers" },
    { label: "Building Owners & Developers", href: "/commercial-clients" },
    { label: "General Contractors", href: "/for-general-contractors" },
    { label: "Building Envelope Consultants", href: "/for-general-contractors" },
    { label: "Homeowners", href: "/homeowners" },
  ];

  const partnerLinks = [
    { label: "For General Contractors", href: "/for-general-contractors" },
    { label: "Vendor Pre-qualification", href: "/prequalification" },
    { label: "Submit RFP", href: "/submit-rfp" },
    { label: "Request Unit Pricing", href: "/quote" },
  ];

  const resourceLinks = [
    { label: "About Us", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Projects", href: "/projects" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* Mobile Accordion Layout */}
      <div className="lg:hidden">
        <Accordion type="single" collapsible className="w-full space-y-2">
          {/* Brand & Contact */}
          <AccordionItem value="brand" className="border-border/40">
            <AccordionTrigger className="text-base font-semibold hover:text-primary">
              Contact & Info
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6 pt-2">
                <OptimizedImage
                  src={logoUrl}
                  alt="Ascent Group Construction"
                  width={160}
                  height={160}
                  className="h-16 w-auto"
                />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Lead specialty contractor for building envelope, interior trades, and restoration.
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <AscentEmailLink className="hover:text-primary transition-colors" showIcon={false} />
                  </div>
                  <a 
                    href={`tel:${contactInfo.phone}`} 
                    className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    <span>{contactInfo.phone}</span>
                  </a>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span>{yearsExperience}+ Years Experience</span>
                  <span>•</span>
                  <span>WSIB Compliant</span>
                  <span>•</span>
                  <span>Fully Insured</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Services */}
          <AccordionItem value="services" className="border-border/40">
            <AccordionTrigger className="text-base font-semibold hover:text-primary">
              Services
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-3 pt-2">
                {services.slice(0, 8).map((service) => (
                  <li key={service.slug}>
                    <Link
                      to={`/services/${service.slug}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Markets */}
          <AccordionItem value="markets" className="border-border/40">
            <AccordionTrigger className="text-base font-semibold hover:text-primary">
              Markets & Partners
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <ul className="space-y-3">
                  {marketLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Company */}
          <AccordionItem value="company" className="border-border/40">
            <AccordionTrigger className="text-base font-semibold hover:text-primary">
              Company
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-3 pt-2">
                {resourceLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Desktop Grid Layout */}
      <div className="hidden lg:grid lg:grid-cols-5 lg:gap-12">
        {/* Column 1: Brand & Contact */}
        <div className="lg:col-span-2 space-y-6">
          <img src={logoUrl} alt="Ascent Group Construction" className="h-20 w-auto" />
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
            Lead specialty contractor for building envelope, interior trades, and restoration serving commercial, multi-family, and residential properties across the Greater Toronto Area.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-muted-foreground group">
              <Mail className="h-4 w-4" />
              <AscentEmailLink className="hover:text-primary transition-colors" showIcon={false} />
            </div>
              <span className="group-hover:underline">{contactInfo.email}</span>
            </a>
            <a 
              href={`tel:${contactInfo.phone}`} 
              className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group"
            >
              <Phone className="h-4 w-4" />
              <span className="group-hover:underline">{contactInfo.phone}</span>
            </a>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-2">
            <span>{yearsExperience}+ Years</span>
            <span>•</span>
            <span>WSIB Compliant</span>
            <span>•</span>
            <span>$2M CGL Coverage</span>
          </div>
        </div>

        {/* Column 2: Services */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
            Services
          </h3>
          <ul className="space-y-2.5">
            {services.slice(0, 8).map((service) => (
              <li key={service.slug}>
                <Link
                  to={`/services/${service.slug}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline"
                >
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Markets */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
            Markets
          </h3>
          <ul className="space-y-2.5">
            {marketLinks.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Company */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
            Company
          </h3>
          <ul className="space-y-2.5">
            {resourceLinks.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="mt-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              For Partners
            </h3>
            <ul className="space-y-2.5">
              {partnerLinks.slice(0, 3).map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-16 pt-8 border-t border-border/40">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Ascent Group Construction. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <span className="text-muted-foreground/40">•</span>
            <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
            {linkedinUrl && (
              <>
                <span className="text-muted-foreground/40">•</span>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                  <span>LinkedIn</span>
                </a>
              </>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-6 max-w-2xl">
          {serviceAreaText}
        </p>
      </div>
    </>
  );
};
