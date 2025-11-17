import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { NavBadge } from "@/components/ui/nav-badge";
import { NAVIGATION_ICONS } from "@/data/navigation-icons";

interface GridMegaMenuCardProps {
  name: string;
  link: string;
  description?: string;
  badge?: "new" | "popular" | "important";
  onLinkClick: () => void;
}

export const GridMegaMenuCard = ({
  name,
  link,
  description,
  badge,
  onLinkClick,
}: GridMegaMenuCardProps) => {
  // Get icon name from NAVIGATION_ICONS mapping
  const iconName = NAVIGATION_ICONS[link] || "Circle";
  const Icon = (Icons[iconName as keyof typeof Icons] || Icons.Circle) as LucideIcon;

  return (
    <Link
      to={link}
      onClick={onLinkClick}
      className="group relative flex flex-col gap-3 p-4 rounded-lg border border-border/40 bg-card/50 hover:bg-accent/50 hover:border-primary/20 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
    >
      {/* Icon Container */}
      <div className="flex items-start justify-between">
        <div className="flex-shrink-0 w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        {badge && <NavBadge variant={badge} />}
      </div>

      {/* Content */}
      <div className="flex-1">
        <h4 className="font-semibold text-sm text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
          {name}
        </h4>
        {description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}
      </div>

      {/* Hover Effect Line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </Link>
  );
};
