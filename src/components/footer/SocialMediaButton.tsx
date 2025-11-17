import { LucideIcon } from "lucide-react";

interface SocialMediaButtonProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const SocialMediaButton = ({ href, icon: Icon, label }: SocialMediaButtonProps) => {
  return (
    <a
      href={href}
      className="footer-icon-circle group"
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon className="h-5 w-5 text-primary-foreground transition-colors group-hover:text-secondary" aria-hidden="true" />
    </a>
  );
};

export default SocialMediaButton;
