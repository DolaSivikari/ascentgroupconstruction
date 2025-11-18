import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
    { label: "Service Areas", href: "/service-areas" },
    { label: "FAQs", href: "/resources/faqs" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms" },
  ];

  return (
    <>
      {/* Mobile Accordion Layout */}
      <div className="md:hidden">
        <Accordion type="single" collapsible className="w-full">
          {/* Brand & Contact */}
          <AccordionItem value="brand" className="border-border/50">
            <AccordionTrigger className="text-base font-semibold text-foreground hover:text-primary">
              Contact & Info
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <img src={logoUrl} alt="Ascent Group Construction" className="h-16 w-auto" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Lead specialty contractor for building envelope, interior trades, and restoration serving commercial, multi-family, and residential properties.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <a href={`mailto:${contactInfo.email}`} className="hover:text-primary">
                      {contactInfo.email}
                    </a>
                  </div>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <a href={`tel:${contactInfo.phone}`} className="hover:text-primary">
                      {contactInfo.phone}
                    </a>
                  </div>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{contactInfo.address}</span>
                  </div>
                </div>
                <div className="pt-2 text-xs text-muted-foreground space-y-1">
                  <p>• {yearsExperience}+ years team experience</p>
                  <p>• WSIB Compliant</p>
                  <p>• $5M+ Insured</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Services */}
          <AccordionItem value="services" className="border-border/50">
            <AccordionTrigger className="text-base font-semibold text-foreground hover:text-primary">
              Services
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 pt-2">
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

          {/* Markets & Partners */}
          <AccordionItem value="markets" className="border-border/50">
            <AccordionTrigger className="text-base font-semibold text-foreground hover:text-primary">
              Markets & Partners
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div>
                  <h4 className="text-xs font-semibold text-foreground uppercase mb-2">Markets</h4>
                  <ul className="space-y-2">
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
                <div>
                  <h4 className="text-xs font-semibold text-foreground uppercase mb-2">For Partners</h4>
                  <ul className="space-y-2">
                    {partnerLinks.map((link) => (
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
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Company & Resources */}
          <AccordionItem value="company" className="border-border/50">
            <AccordionTrigger className="text-base font-semibold text-foreground hover:text-primary">
              Company & Resources
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div>
                  <h4 className="text-xs font-semibold text-foreground uppercase mb-2">Company</h4>
                  <ul className="space-y-2">
                    {companyLinks.map((link) => (
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
                <div>
                  <h4 className="text-xs font-semibold text-foreground uppercase mb-2">Resources</h4>
                  <ul className="space-y-2">
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
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-6 pt-6 border-t border-border/50 text-center text-xs text-muted-foreground">
          <p>{serviceAreaText}</p>
        </div>
      </div>

      {/* Desktop 4-Column Grid Layout */}
      <div className="hidden md:block">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand & Contact */}
          <div className="space-y-4">
            <img src={logoUrl} alt="Ascent Group Construction" className="h-20 w-auto" />
            <p className="text-sm text-slate-300 leading-relaxed">
              Lead specialty contractor for building envelope, interior trades, and restoration serving commercial, multi-family, and residential properties across the Greater Toronto Area.
            </p>
            <div className="text-sm text-slate-300 space-y-1.5">
              <p>
                <span className="font-medium text-slate-100">Email:</span>{" "}
                <a href={`mailto:${contactInfo.email}`} className="hover:text-white transition-colors duration-[150ms]">
                  {contactInfo.email}
                </a>
              </p>
              <p>
                <span className="font-medium text-slate-100">Phone:</span>{" "}
                <a href={`tel:${contactInfo.phone}`} className="hover:text-white transition-colors duration-[150ms]">
                  {contactInfo.phone}
                </a>
              </p>
              <p>
                <span className="font-medium text-slate-100">Service Area:</span> GTA & Golden Horseshoe
              </p>
            </div>
            <div className="pt-2 text-xs text-slate-400 space-y-0.5">
              <p>• {yearsExperience}+ years team experience</p>
              <p>• WSIB Compliant & $5M+ Insured</p>
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-slate-200 uppercase mb-4">
              Services
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              {services.slice(0, 8).map((service) => (
                <li key={service.slug}>
                  <Link
                    to={`/services/${service.slug}`}
                    className="hover:text-white hover:underline transition-colors duration-[150ms]"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Markets & Partners */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold tracking-wide text-slate-200 uppercase mb-4">
                Markets
              </h3>
              <ul className="space-y-2 text-sm text-slate-300">
                {marketLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="hover:text-white hover:underline transition-colors duration-[150ms]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-wide text-slate-200 uppercase mb-4">
                For Partners
              </h3>
              <ul className="space-y-2 text-sm text-slate-300">
                {partnerLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="hover:text-white hover:underline transition-colors duration-[150ms]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 4: Company & Resources */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold tracking-wide text-slate-200 uppercase mb-4">
                Company
              </h3>
              <ul className="space-y-2 text-sm text-slate-300">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="hover:text-white hover:underline transition-colors duration-[150ms]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-wide text-slate-200 uppercase mb-4">
                Resources
              </h3>
              <ul className="space-y-2 text-sm text-slate-300">
                {resourceLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="hover:text-white hover:underline transition-colors duration-[150ms]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="mt-12 pt-6 border-t border-slate-800">
        <div className="flex flex-col gap-4 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>© {currentYear} Ascent Group Construction. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-slate-200 transition-colors duration-[150ms]">
              Privacy Policy
            </Link>
            <span className="hidden md:inline">•</span>
            <Link to="/terms" className="hover:text-slate-200 transition-colors duration-[150ms]">
              Terms of Service
            </Link>
            <span className="hidden md:inline">•</span>
            <Link to="/accessibility" className="hover:text-slate-200 transition-colors duration-[150ms]">
              Accessibility
            </Link>
            {linkedinUrl && (
              <>
                <span className="hidden md:inline">•</span>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-slate-200 transition-colors duration-[150ms]"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-3.5 w-3.5" />
                  <span>LinkedIn</span>
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
