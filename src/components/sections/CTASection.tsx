import { Link } from "react-router-dom";
import { Button } from "@/ui/Button";
import { ArrowRight } from "lucide-react";

interface CTAButton {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "navy" | "ghost" | "danger";
}

interface CTASectionProps {
  title: string;
  description: string;
  primaryCTA: CTAButton;
  secondaryCTA?: CTAButton;
  className?: string;
}

const CTASection = ({
  title,
  description,
  primaryCTA,
  secondaryCTA,
  className = ""
}: CTASectionProps) => {
  return (
    <section className={`py-20 bg-primary text-primary-foreground ${className}`}>
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {title}
        </h2>
        <p className="text-lg mb-8 text-primary-foreground/90">
          {description}
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button 
            size="lg" 
            variant={primaryCTA.variant || "primary"}
            asChild
          >
            <Link to={primaryCTA.href}>
              {primaryCTA.label}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          {secondaryCTA && (
            <Button 
              size="lg" 
              variant={secondaryCTA.variant || "secondary"}
              asChild
            >
              <Link to={secondaryCTA.href}>
                {secondaryCTA.label}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default CTASection;
