// Compatibility re-export for old button imports
// This file re-exports from the new design system location
export { Button, type ButtonProps } from "@/ui/Button";

// For components that use buttonVariants directly
import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-[hsl(var(--brand-accent))] text-white hover:opacity-90 shadow-lg",
        primary: "bg-[hsl(var(--brand-accent))] text-white hover:opacity-90 shadow-lg",
        secondary: "border-2 border-[hsl(var(--brand-primary))] text-[hsl(var(--brand-primary))] bg-transparent hover:bg-[hsl(var(--bg-soft))]",
        outline: "border-2 border-[hsl(var(--brand-primary))] text-[hsl(var(--brand-primary))] bg-transparent hover:bg-[hsl(var(--bg-soft))]",
        navy: "bg-[hsl(var(--brand-primary))] text-white hover:opacity-90 shadow-lg",
        ghost: "text-[hsl(var(--brand-primary))] hover:bg-[hsl(var(--bg-soft))]",
        danger: "bg-[hsl(var(--danger))] text-white hover:opacity-90",
        destructive: "bg-[hsl(var(--danger))] text-white hover:opacity-90",
        link: "text-[hsl(var(--brand-primary))] underline-offset-4 hover:underline",
        "admin-glass": "bg-[hsl(var(--admin-bg-card))] text-[hsl(var(--admin-text-primary))] border border-[hsl(var(--admin-border))] hover:bg-[hsl(var(--admin-bg-hover))] backdrop-blur-md",
        "admin-primary": "bg-gradient-to-r from-[hsl(var(--admin-primary))] to-[hsl(221_83%_53%)] text-white hover:opacity-90 shadow-lg",
        "admin-success": "bg-[hsl(var(--admin-success))] text-white hover:opacity-90 shadow-lg"
      },
      size: {
        default: "px-4 py-2.5 text-sm rounded-[var(--radius-sm)] min-h-[44px]",
        sm: "px-3 py-2 text-sm rounded-[var(--radius-xs)] min-h-[40px]",
        md: "px-4 py-2.5 text-sm rounded-[var(--radius-sm)] min-h-[44px]",
        lg: "px-5 py-3 text-base rounded-[var(--radius-md)] min-h-[48px]",
        icon: "h-9 w-9 rounded-[var(--radius-sm)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type ButtonVariant = "default" | "primary" | "secondary" | "outline" | "navy" | "ghost" | "danger" | "destructive" | "link" | "admin-glass" | "admin-primary" | "admin-success";
export type ButtonSize = "default" | "sm" | "md" | "lg" | "icon";
