import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { LucideIcon, ArrowRight, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/design-system/components/Card";
import { Button } from "@/ui/Button";
import { cn } from "@/lib/utils";

/**
 * Unified "Who We Serve" Card Component
 * Consistent design for client segment cards across the entire site
 */

export interface WhoWeServeCardProps {
  /** Icon component from lucide-react */
  icon: LucideIcon;
  /** Card title (e.g., "General Contractors", "Property Managers") */
  title: string;
  /** Short description or headline */
  description: string;
  /** Link destination */
  link: string;
  /** Optional list of benefits or services */
  benefits?: string[];
  /** Optional CTA text (defaults to "Learn More") */
  ctaText?: string;
  /** Card variant: 'simple' for basic cards, 'detailed' for cards with benefits */
  variant?: "simple" | "detailed";
  /** Optional custom className */
  className?: string;
}

export const WhoWeServeCard = ({
  icon: Icon,
  title,
  description,
  link,
  benefits,
  ctaText = "Learn More",
  variant = "simple",
  className,
}: WhoWeServeCardProps) => {
  const isSimple = variant === "simple";

  if (isSimple) {
    // Simple variant: Icon, title, description (used on About, Services pages)
    return (
      <Link to={link} className="group">
        <Card 
          variant="interactive" 
          hover 
          size="md"
          className={cn("h-full", className)}
        >
          <div className="flex flex-col items-center text-center">
            {/* Icon Container */}
            <div className="w-16 h-16 rounded-[var(--radius-lg)] bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
              <Icon className="w-8 h-8 text-primary" />
            </div>

            {/* Title */}
            <h3 className="text-xl md:text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
              {title}
            </h3>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        </Card>
      </Link>
    );
  }

  // Detailed variant: Icon, title, description, benefits list, CTA button
  return (
    <Card 
      variant="interactive" 
      hover 
      size="md"
      className={cn("h-full flex flex-col", className)}
    >
      <CardContent className="flex flex-col h-full">
        {/* Icon & Title */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl font-semibold mb-2 leading-tight">
              {title}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Benefits List (if provided) */}
        {benefits && benefits.length > 0 && (
          <ul className="space-y-3 mb-6 flex-1">
            {benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        )}

        {/* CTA Button */}
        <Button asChild className="w-full mt-auto">
          <Link to={link}>
            {ctaText}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
