import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";
import { Link } from "react-router-dom";

interface CTAAction {
  text: string;
  href: string;
}

interface CTABandProps {
  title: string;
  description?: string;
  primaryCta: CTAAction;
  secondaryCta?: CTAAction;
  variant?: "dark" | "light";
  className?: string;
}

/**
 * CTABand — Standardized CTA section used across pages.
 * 
 * Usage:
 *   <CTABand
 *     title="Ready to Start?"
 *     description="Request a proposal today."
 *     primaryCta={{ text: "Get Started", href: "/contact" }}
 *     variant="dark"
 *   />
 */
export const CTABand = ({
  title,
  description,
  primaryCta,
  secondaryCta,
  variant = "dark",
  className,
}: CTABandProps) => {
  return (
    <section
      className={cn(
        "py-16 md:py-20",
        variant === "dark"
          ? "bg-primary text-primary-foreground"
          : "bg-muted/30",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "text-lg mb-8 max-w-2xl mx-auto",
              variant === "dark" ? "opacity-90" : "text-muted-foreground"
            )}
          >
            {description}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            variant={variant === "dark" ? "secondary" : "default"}
            className={variant === "dark" ? "border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" : undefined}
            asChild
          >
            <Link to={primaryCta.href}>{primaryCta.text}</Link>
          </Button>
          {secondaryCta && (
            <Button
              size="lg"
              variant="outline"
              asChild
              className={
                variant === "dark"
                  ? "border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  : undefined
              }
            >
              <Link to={secondaryCta.href}>{secondaryCta.text}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};
