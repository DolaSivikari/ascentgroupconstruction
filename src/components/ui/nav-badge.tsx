import { Badge } from "@/components/ui/badge";
import { Star, Sparkles } from "lucide-react";

interface NavBadgeProps {
  variant: "new" | "popular" | "important";
  className?: string;
}

export const NavBadge = ({ variant, className }: NavBadgeProps) => {
  const variantMap = {
    new: { variant: "new" as const, label: "New", icon: Sparkles },
    popular: { variant: "warning" as const, label: "★", icon: Star },
    important: { variant: "primary" as const, label: "★", icon: Star },
  };

  const config = variantMap[variant];

  return (
    <Badge 
      variant={config.variant} 
      size="xs" 
      icon={config.icon}
      className={className}
    >
      {config.label}
    </Badge>
  );
};
