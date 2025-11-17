import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface FooterNavLink {
  to: string;
  label: string;
}

interface FooterNavCardProps {
  title: string;
  icon?: LucideIcon;
  links: FooterNavLink[];
}

const FooterNavCard = ({ title, icon: Icon, links }: FooterNavCardProps) => {
  return (
    <div className="footer-glass-card p-5">
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon className="h-5 w-5 text-secondary" aria-hidden="true" />}
        <h3 className="font-semibold text-primary-foreground">{title}</h3>
      </div>
      <nav aria-label={`${title} navigation`}>
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.to}>
              <Link 
                to={link.to} 
                className="footer-link-animated text-sm text-primary-foreground/80"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default FooterNavCard;
