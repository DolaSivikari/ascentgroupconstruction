import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface BudgetSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  className?: string;
}

export const BudgetSlider = ({
  value,
  onChange,
  min = 25000,
  max = 10000000,
  step = 25000,
  label = "Project Budget",
  className
}: BudgetSliderProps) => {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">{label}</Label>
        <div className="flex items-center gap-2 text-primary font-bold text-xl">
          <DollarSign className="w-5 h-5" />
          {formatCurrency(value)}
        </div>
      </div>

      {/* Visual Budget Bar */}
      <div className="relative h-12 bg-muted rounded-xl overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/70 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium mix-blend-difference text-white">
            {formatCurrency(value)}
          </span>
        </div>
      </div>

      <Slider
        value={[value]}
        onValueChange={([newValue]) => onChange(newValue)}
        min={min}
        max={max}
        step={step}
        className="cursor-pointer"
      />

      {/* Budget Range Labels */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatCurrency(min)}</span>
        <span>{formatCurrency(max)}</span>
      </div>

      {/* Budget Bracket Indicators */}
      <div className="grid grid-cols-5 gap-2 text-center text-xs">
        {[
          { label: "Small", max: 250000, threshold: 0 },
          { label: "Medium", max: 750000, threshold: 250000 },
          { label: "Large", max: 2000000, threshold: 750000 },
          { label: "Major", max: 5000000, threshold: 2000000 },
          { label: "Enterprise", max: 10000000, threshold: 5000000 }
        ].map((bracket, index) => (
          <div
            key={index}
            className={cn(
              "p-2 rounded-lg transition-all",
              value > bracket.threshold && value <= bracket.max
                ? "bg-primary/20 text-primary font-semibold"
                : "bg-muted/50 text-muted-foreground"
            )}
          >
            {bracket.label}
          </div>
        ))}
      </div>
    </div>
  );
};
