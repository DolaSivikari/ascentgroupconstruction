import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  (props, ref) => {
    return (
      <select
        ref={ref}
        {...props}
        className={cn(
          "w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm min-h-[44px]",
          "text-foreground",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
          "disabled:cursor-not-allowed disabled:opacity-50",
          props.className
        )}
      />
    );
  }
);

Select.displayName = "Select";
