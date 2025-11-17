import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface UnifiedFormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Unified Form Field Component
 * Consistent form styling across all forms
 */
export const UnifiedFormField = ({ 
  label, 
  error, 
  required, 
  children,
  className 
}: UnifiedFormFieldProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <span aria-hidden="true">⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
};
