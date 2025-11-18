import { Link } from "react-router-dom";
import { Mail, Phone, Linkedin } from "lucide-react";

interface SimpleModernFooterProps {
  logoUrl: string;
  contactInfo: {
    phone: string;
    email: string;
  };
  linkedinUrl?: string;
  foundedYear: number;
}

export function SimpleModernFooter({
  logoUrl,
  contactInfo,
  linkedinUrl,
  foundedYear,
}: SimpleModernFooterProps) {
  const currentYear = new Date().getFullYear();
  const { phone, email } = contactInfo;

  return (
    <div className="w-full">
      {/* Main Footer Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
        {/* Brand Section */}
        <div className="space-y-4">
          <img src={logoUrl} alt="Ascent Group Construction" className="h-12 w-auto" />
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            Building envelope & restoration contractor serving Ontario & GTA
          </p>
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span>WSIB Compliant</span>
            <span>•</span>
            <span>Fully Insured</span>
          </div>
        </div>

        {/* Quick Links Section */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-foreground">
            Quick Links
          </h3>
          <ul className="space-y-2.5">
            {[
              { label: 'About', href: '/about' },
              { label: 'Services', href: '/services' },
              { label: 'Projects', href: '/projects' },
              { label: 'Contact', href: '/contact' },
            ].map((link) => (
              <li key={link.label}>
                <Link
                  to={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-[150ms]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-foreground">
            Contact
          </h3>
          <div className="space-y-3">
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-[150ms]"
              >
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="break-all">{email}</span>
              </a>
            )}
            {phone && (
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-[150ms]"
              >
                <Phone className="h-4 w-4 flex-shrink-0" />
                {phone}
              </a>
            )}
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-[150ms]"
              >
                <Linkedin className="h-4 w-4 flex-shrink-0" />
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 pt-8 border-t border-border/40">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} Ascent Group Construction. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors duration-[150ms]">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors duration-[150ms]">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
