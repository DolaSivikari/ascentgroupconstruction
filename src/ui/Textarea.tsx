import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  (props, ref) => {
    return (
      <textarea
        ref={ref}
        {...props}
        className={cn(
          "w-full rounded-md border border-input bg-background px-4 py-3 text-base min-h-[120px]",
          "text-foreground placeholder:text-muted-foreground",
          "transition-all duration-200 ease-out",
          "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:scale-[1.005]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          props.className
        )}
      />
    );
  }
);

Textarea.displayName = "Textarea";
