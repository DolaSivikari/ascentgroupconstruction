import { Shield, Award, CheckCircle2, FileCheck, Building2, HardHat } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface Certification {
  name: string;
  icon: any;
  description: string;
  validUntil?: string;
  verified: boolean;
}

interface CertificationBadgesProps {
  certifications?: Certification[];
  className?: string;
  size?: "sm" | "md" | "lg";
}

const defaultCertifications: Certification[] = [
  {
    name: "COR Certified",
    icon: Shield,
    description: "Certificate of Recognition for health and safety management systems",
    validUntil: "Dec 2025",
    verified: true
  },
  {
    name: "$10M Bonding",
    icon: Award,
    description: "Bonding capacity up to $10M per project",
    verified: true
  },
  {
    name: "WSIB Clearance",
    icon: CheckCircle2,
    description: "Current Workplace Safety & Insurance Board clearance certificate",
    validUntil: "Valid",
    verified: true
  },
  {
    name: "$5M Liability",
    icon: FileCheck,
    description: "Commercial general liability insurance coverage",
    verified: true
  },
  {
    name: "Licensed Contractor",
    icon: Building2,
    description: "Licensed building contractor in Ontario",
    verified: true
  },
  {
    name: "Safety Excellence",
    icon: HardHat,
    description: "Zero lost-time incidents for 3+ years",
    verified: true
  }
];

const sizeClasses = {
  sm: "w-16 h-16",
  md: "w-20 h-20",
  lg: "w-24 h-24"
};

const iconSizeClasses = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-10 h-10"
};

export const CertificationBadges = ({
  certifications = defaultCertifications,
  className,
  size = "md"
}: CertificationBadgesProps) => {
  return (
    <TooltipProvider>
      <div className={cn("flex flex-wrap items-center justify-center gap-6", className)}>
        {certifications.map((cert, index) => {
          const Icon = cert.icon;
          
          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "relative rounded-2xl border-2 border-border bg-card hover:border-primary/50 transition-all hover:scale-110 hover:shadow-xl cursor-pointer flex items-center justify-center animate-fade-in",
                    sizeClasses[size]
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Verified Badge */}
                  {cert.verified && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-background">
                      <CheckCircle2 className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                  
                  <Icon className={cn("text-primary", iconSizeClasses[size])} />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <div className="space-y-1">
                  <p className="font-semibold">{cert.name}</p>
                  <p className="text-sm text-muted-foreground">{cert.description}</p>
                  {cert.validUntil && (
                    <p className="text-xs text-primary font-medium mt-2">
                      Valid until: {cert.validUntil}
                    </p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
};
