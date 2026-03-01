import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/design-system/components/Card";
import { Button } from "@/ui/Button";
import { Building2, Home, Building, Wrench, Calendar, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

/**
 * Service Selector Tool - Interactive Quiz
 * Helps visitors identify their needs and recommends appropriate services
 * Phase 4: Smart Feature Integration
 */

type PropertyType = "commercial" | "residential" | "multi-family" | null;
type IssueType = "water-damage" | "appearance" | "preventive" | "restoration" | null;
type UrgencyType = "emergency" | "planned" | "long-term" | null;

interface ServiceRecommendation {
  title: string;
  description: string;
  services: string[];
  cta: string;
  link: string;
  icon: React.ComponentType<any>;
}

export const ServiceSelector = () => {
  const [step, setStep] = useState(1);
  const [propertyType, setPropertyType] = useState<PropertyType>(null);
  const [issueType, setIssueType] = useState<IssueType>(null);
  const [urgency, setUrgency] = useState<UrgencyType>(null);
  const [showResults, setShowResults] = useState(false);

  const resetQuiz = () => {
    setStep(1);
    setPropertyType(null);
    setIssueType(null);
    setUrgency(null);
    setShowResults(false);
  };

  const getRecommendation = (): ServiceRecommendation => {
    // Emergency scenarios
    if (urgency === "emergency") {
      return {
        title: "Emergency Response Required",
        description: "We provide 48-72 hour emergency site visits for active water intrusion and urgent facade issues.",
        services: [
          "Emergency Water Intrusion Response",
          "Temporary Weatherproofing",
          "Façade Damage Assessment",
          "Urgent Sealant Repairs",
        ],
        cta: "Request Emergency Site Visit",
        link: "/contact",
        icon: AlertCircle,
      };
    }

    // Building envelope / water damage
    if (issueType === "water-damage" || issueType === "restoration") {
      return {
        title: "Building Envelope & Restoration Services",
        description: "We specialize in façade remediation, waterproofing, and envelope repairs for occupied buildings.",
        services: [
          "Façade Remediation & Cladding Repairs",
          "Sealant (Caulking) Replacement Programs",
          "Waterproofing Systems",
          "Masonry Restoration",
          "EIFS & Stucco Repair",
          "Concrete & Parking Garage Rehabilitation",
        ],
        cta: "Request a Proposal",
        link: "/services/building-envelope",
        icon: Building2,
      };
    }

    // Appearance / Preventive for commercial/multi-family
    if ((propertyType === "commercial" || propertyType === "multi-family") && 
        (issueType === "appearance" || issueType === "preventive")) {
      return {
        title: "Commercial Property Maintenance",
        description: "Scheduled maintenance programs for multi-property portfolios and commercial buildings.",
        services: [
          "Protective & Architectural Coatings",
          "Commercial Painting Programs",
          "Preventive Sealant Maintenance",
          "Common Area Refresh",
          "Exterior Cladding Maintenance",
        ],
        cta: "Request Maintenance Quote",
        link: "/property-managers",
        icon: Building,
      };
    }

    // Residential services
    if (propertyType === "residential") {
      return {
        title: "Residential Services",
        description: "Professional painting, tile, flooring, and renovation services for homeowners across the GTA.",
        services: [
          "Interior & Exterior Painting",
          "Tile & Flooring Installation",
          "Stucco & EIFS Repair",
          "Basement Finishing",
          "Bathroom & Kitchen Renovations",
          "Drywall & Finishing",
        ],
        cta: "Start Your Project",
        link: "/homeowners",
        icon: Home,
      };
    }

    // Default recommendation
    return {
      title: "Specialty Trade Services",
      description: "We deliver envelope, interior, and restoration services across commercial and residential projects.",
      services: [
        "Building Envelope Systems",
        "Interior Buildouts",
        "Masonry & Concrete Repair",
        "Protective Coatings",
        "Tile & Flooring",
        "Commercial Painting",
      ],
      cta: "Explore All Services",
      link: "/services",
      icon: Wrench,
    };
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setShowResults(true);
    }
  };

  const recommendation = showResults ? getRecommendation() : null;
  const Icon = recommendation?.icon;

  return (
    <Card variant="elevated" size="lg" className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl md:text-3xl">
          {showResults ? "Your Recommended Services" : "Find the Right Service for Your Project"}
        </CardTitle>
        {!showResults && (
          <p className="text-center text-muted-foreground mt-2">
            Answer 3 quick questions to get personalized service recommendations
          </p>
        )}
      </CardHeader>

      <CardContent>
        {/* Progress Indicator */}
        {!showResults && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className={cn(
                    "flex-1 h-2 rounded-full transition-all duration-300",
                    num === step ? "bg-primary" : num < step ? "bg-primary/60" : "bg-muted",
                    num !== 3 && "mr-2"
                  )}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Step {step} of 3
            </p>
          </div>
        )}

        {/* Step 1: Property Type */}
        {step === 1 && !showResults && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center mb-6">
              What type of property is this?
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { value: "commercial", label: "Commercial", icon: Building, desc: "Office, retail, industrial" },
                { value: "multi-family", label: "Multi-Family", icon: Building2, desc: "Condos, apartments" },
                { value: "residential", label: "Residential", icon: Home, desc: "Single-family home" },
              ].map((option) => {
                const OptionIcon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      setPropertyType(option.value as PropertyType);
                      handleNext();
                    }}
                    className={cn(
                      "p-6 rounded-[var(--radius-lg)] border-2 transition-all duration-300 text-left hover:shadow-lg",
                      propertyType === option.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <OptionIcon className="w-8 h-8 text-primary mb-3" />
                    <h4 className="font-semibold text-lg mb-1">{option.label}</h4>
                    <p className="text-sm text-muted-foreground">{option.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Issue Type */}
        {step === 2 && !showResults && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center mb-6">
              What's the main issue or need?
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { value: "water-damage", label: "Water Damage / Leaks", desc: "Active or past water intrusion" },
                { value: "appearance", label: "Appearance / Refresh", desc: "Cosmetic improvements" },
                { value: "preventive", label: "Preventive Maintenance", desc: "Scheduled upkeep" },
                { value: "restoration", label: "Façade Restoration", desc: "Envelope repair needs" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setIssueType(option.value as IssueType);
                    handleNext();
                  }}
                  className={cn(
                    "p-6 rounded-[var(--radius-lg)] border-2 transition-all duration-300 text-left hover:shadow-lg",
                    issueType === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <h4 className="font-semibold text-lg mb-1">{option.label}</h4>
                  <p className="text-sm text-muted-foreground">{option.desc}</p>
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              className="w-full mt-4"
            >
              Back
            </Button>
          </div>
        )}

        {/* Step 3: Urgency */}
        {step === 3 && !showResults && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center mb-6">
              What's your project timeline?
            </h3>
            <div className="grid gap-4">
              {[
                { value: "emergency", label: "Emergency (Within 72 hours)", icon: AlertCircle, desc: "Active damage or urgent safety issue" },
                { value: "planned", label: "Planned (Within 3 months)", icon: Calendar, desc: "Scheduled project with some flexibility" },
                { value: "long-term", label: "Long-Term Planning (3+ months)", icon: CheckCircle2, desc: "Capital planning or future projects" },
              ].map((option) => {
                const OptionIcon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      setUrgency(option.value as UrgencyType);
                      handleNext();
                    }}
                    className={cn(
                      "p-6 rounded-[var(--radius-lg)] border-2 transition-all duration-300 text-left hover:shadow-lg flex items-start gap-4",
                      urgency === option.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <OptionIcon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-lg mb-1">{option.label}</h4>
                      <p className="text-sm text-muted-foreground">{option.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            <Button
              variant="outline"
              onClick={() => setStep(2)}
              className="w-full mt-4"
            >
              Back
            </Button>
          </div>
        )}

        {/* Results */}
        {showResults && recommendation && Icon && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">{recommendation.title}</h3>
                <p className="text-muted-foreground">{recommendation.description}</p>
              </div>
            </div>

            <div className="bg-muted/30 rounded-[var(--radius-lg)] p-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                Recommended Services:
              </h4>
              <ul className="space-y-2">
                {recommendation.services.map((service, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{service}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-4">
              <Button asChild className="flex-1">
                <Link to={recommendation.link}>
                  {recommendation.cta}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" onClick={resetQuiz} className="flex-1">
                Start Over
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Not sure? <Link to="/contact" className="text-primary hover:underline">Start your project</Link> with a complimentary consultation.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
