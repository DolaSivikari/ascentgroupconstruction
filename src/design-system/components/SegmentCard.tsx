import { LucideIcon } from "lucide-react";
import { Card } from "@/design-system/components/Card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface SegmentCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Optional link — makes the card navigable */
  href?: string;
  /** Optional badge label (e.g. "Primary", "Growing") */
  badge?: string;
  className?: string;
}

/**
 * SegmentCard — Client/market segment card.
 * Replaces ClientSegmentCard + WhoWeServeCard patterns.
 * 
 * Usage:
 *   <SegmentCard icon={Building2} title="Property Managers" description="..." href="/property-managers" badge="Primary" />
 */
export const SegmentCard = ({
  icon: Icon,
  title,
  description,
  href,
  badge,
  className,
}: SegmentCardProps) => {
  const content = (
    <Card
      variant={href ? "interactive" : "elevated"}
      size="md"
      className={cn("h-full", className)}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-[var(--radius-sm)] bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold">{title}</h3>
            {badge && (
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </Card>
  );

  if (href) {
    return <Link to={href} className="block">{content}</Link>;
  }

  return content;
};
