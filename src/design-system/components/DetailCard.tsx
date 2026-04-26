import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { LucideIcon, ChevronDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/design-system/components/Card";
import { Badge } from "@/components/ui/badge";

export interface DetailCardStat {
  label: string;
  value: string;
}

export interface DetailCardProps {
  icon?: LucideIcon;
  iconImage?: string;
  title: string;
  description: string;
  /** Optional badge (e.g. "Primary", "Trade Partner", "New") */
  badge?: string;
  /** Optional small stats row shown below description */
  stats?: DetailCardStat[];
  /** Bullet list shown unconditionally below description */
  bullets?: string[];
  /** Detail content revealed inside an expandable accordion */
  expandable?: { label?: string; content: ReactNode };
  /** Optional CTA shown at bottom */
  cta?: { label: string; href: string };
  /** Visual emphasis */
  variant?: "default" | "elevated" | "interactive";
  /** Highlight stripe along the left edge */
  accent?: boolean;
  className?: string;
  children?: ReactNode;
}

/**
 * DetailCard — Unified rich card for audience, service, capability, and
 * comparison surfaces. Replaces ad-hoc card markup across pages.
 */
export const DetailCard = ({
  icon: Icon,
  iconImage,
  title,
  description,
  badge,
  stats,
  bullets,
  expandable,
  cta,
  variant = "elevated",
  accent = false,
  className,
  children,
}: DetailCardProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Card
      variant={variant}
      size="md"
      hover
      className={cn(
        "h-full flex flex-col",
        accent && "border-l-4 border-l-primary",
        className,
      )}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3">
          {Icon && (
            <div className="p-2.5 bg-primary/10 rounded-lg flex-shrink-0">
              <Icon className="w-5 h-5 text-primary" />
            </div>
          )}
          {iconImage && !Icon && (
            <img
              src={iconImage}
              alt=""
              aria-hidden="true"
              className="w-10 h-10 object-contain flex-shrink-0"
              loading="lazy"
            />
          )}
        </div>
        {badge && (
          <Badge variant="secondary" className="flex-shrink-0">
            {badge}
          </Badge>
        )}
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2 leading-tight">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        {description}
      </p>

      {bullets && bullets.length > 0 && (
        <ul className="space-y-2 mb-4">
          {bullets.map((b, i) => (
            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
              <span
                aria-hidden="true"
                className="mt-2 inline-block w-1 h-1 rounded-full bg-primary flex-shrink-0"
              />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}

      {stats && stats.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4 mt-auto">
          {stats.map((s, i) => (
            <div key={i} className="bg-muted/40 rounded-md px-3 py-2">
              <div className="text-base font-semibold text-foreground leading-tight">
                {s.value}
              </div>
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground mt-0.5">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {children}

      {expandable && (
        <div className="mt-auto pt-3 border-t border-border/60">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="w-full inline-flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors py-1"
          >
            <span>{expandable.label ?? (open ? "Hide details" : "More details")}</span>
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform duration-200",
                open && "rotate-180",
              )}
            />
          </button>
          {open && (
            <div className="text-sm text-muted-foreground mt-3 leading-relaxed animate-fade-in">
              {expandable.content}
            </div>
          )}
        </div>
      )}

      {cta && (
        <div className="mt-4">
          <Link
            to={cta.href}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            {cta.label}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </Card>
  );
};

export default DetailCard;
