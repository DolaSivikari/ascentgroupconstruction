import { useSettingsData } from "@/hooks/useSettingsData";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPhoneDisplay, formatPhoneTel } from "@/utils/formatPhone";

interface PhoneLinkProps {
  className?: string;
  showIcon?: boolean;
  variant?: "text" | "button" | "large";
  children?: React.ReactNode;
}

export const PhoneLink = ({ 
  className, 
  showIcon = true, 
  variant = "text",
  children 
}: PhoneLinkProps) => {
  const { data: settings } = useSettingsData('site_settings');
  const phone = formatPhoneDisplay(settings?.phone);

  const baseClasses = "inline-flex items-center gap-2 transition-colors";
  
  const variantClasses = {
    text: "text-foreground hover:text-primary",
    button: "bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium",
    large: "text-xl font-bold text-primary hover:text-primary/80"
  };

  return (
    <a
      href={formatPhoneTel(settings?.phone)}
      className={cn(baseClasses, variantClasses[variant], className)}
      aria-label="Call Ascent Group Construction"
    >
      {showIcon && <Phone className="h-4 w-4" />}
      {children || phone}
    </a>
  );
};

// Convenience component for consistent usage
export const AscentPhoneLink = ({ 
  className, 
  showIcon = true,
  variant = "text"
}: Omit<PhoneLinkProps, 'children'>) => (
  <PhoneLink className={className} showIcon={showIcon} variant={variant} />
);
