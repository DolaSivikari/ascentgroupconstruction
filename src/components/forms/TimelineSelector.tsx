import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TimelineSelectorProps {
  startDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  targetDate: Date | undefined;
  onTargetDateChange: (date: Date | undefined) => void;
  urgency?: "standard" | "urgent" | "flexible";
  onUrgencyChange?: (urgency: "standard" | "urgent" | "flexible") => void;
  className?: string;
}

export const TimelineSelector = ({
  startDate,
  onStartDateChange,
  targetDate,
  onTargetDateChange,
  urgency = "standard",
  onUrgencyChange,
  className
}: TimelineSelectorProps) => {
  const urgencyOptions = [
    { value: "urgent", label: "Urgent", color: "destructive", desc: "< 2 weeks" },
    { value: "standard", label: "Standard", color: "primary", desc: "2-8 weeks" },
    { value: "flexible", label: "Flexible", color: "secondary", desc: "> 8 weeks" }
  ] as const;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Urgency Selector */}
      {onUrgencyChange && (
        <div className="space-y-3">
          <Label className="text-base font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Project Urgency
          </Label>
          <div className="grid grid-cols-3 gap-3">
            {urgencyOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onUrgencyChange(option.value)}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all text-center",
                  urgency === option.value
                    ? "border-primary bg-primary/10 shadow-lg scale-105"
                    : "border-border hover:border-primary/30 hover:bg-muted/50"
                )}
              >
                <div className="font-semibold mb-1">{option.label}</div>
                <div className="text-xs text-muted-foreground">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Date Selectors */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Start Date */}
        <div className="space-y-2">
          <Label className="text-base font-semibold">Target Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-14",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-5 w-5" />
                {startDate ? format(startDate, "PPP") : "Select start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={onStartDateChange}
                disabled={(date) => date < new Date()}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Target Completion */}
        <div className="space-y-2">
          <Label className="text-base font-semibold">Target Completion</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-14",
                  !targetDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-5 w-5" />
                {targetDate ? format(targetDate, "PPP") : "Select target date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={targetDate}
                onSelect={onTargetDateChange}
                disabled={(date) => {
                  if (startDate) {
                    return date < startDate;
                  }
                  return date < new Date();
                }}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Duration Indicator */}
      {startDate && targetDate && (
        <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary/20 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Project Duration</span>
            <span className="text-lg font-bold text-primary">
              {Math.ceil((targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
