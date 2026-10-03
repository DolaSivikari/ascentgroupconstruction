import { TYPOGRAPHY_STYLES } from "@/design-system/constants";
import { LucideIcon } from "lucide-react";
import { Card } from "@/design-system/components/Card";
import { cn } from "@/lib/utils";

interface CapabilityCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Optional stat or highlight shown below the description */
  stat?: string;
  className?: string;
}

/**
 * CapabilityCard — Unified card for services, features, and differentiators.
 * Replaces FeatureCard + BenefitCard patterns.
 * 
 * Usage:
 *   <CapabilityCard icon={Shield} title="Waterproofing" description="..." />
 */
export const CapabilityCard = ({
  icon: Icon,
  title,
  description,
  stat,
  className,
}: CapabilityCardProps) => {
  return (
    <Card variant="elevated" size="md" hover className={cn("h-full", className)}>
      <div className="w-12 h-12 rounded-[var(--radius-sm)] bg-primary/10 flex items-center justify-center mb-3">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className={`${TYPOGRAPHY_STYLES.cardTitle} mb-2`}>{title}</h3>
      <p className={`${TYPOGRAPHY_STYLES.cardBody} text-muted-foreground`}>{description}</p>
      {stat && (
        <p className="text-sm font-medium text-primary mt-3">{stat}</p>
      )}
    </Card>
  );
};
