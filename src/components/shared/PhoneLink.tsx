import { trackPhoneClick } from "@/lib/analytics";
import { useSettingsData } from "@/hooks/useSettingsData";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const { data: settings } = useSettingsData('company_settings');
  const phone = settings?.phone || "647-528-6804";

  const handleClick = () => {
    trackPhoneClick();
  };

  const baseClasses = "inline-flex items-center gap-2 transition-colors";
  
  const variantClasses = {
    text: "text-foreground hover:text-primary",
    button: "bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium",
    large: "text-xl font-bold text-primary hover:text-primary/80"
  };

  return (
    <a
      href={`tel:${phone.replace(/\D/g, '')}`}
      onClick={handleClick}
      className={cn(baseClasses, variantClasses[variant], className)}
      aria-label="Call Ascent Group Construction"
    >
      {showIcon && <Phone className="h-4 w-4" />}
      {children || phone}
    </a>
  );
};
