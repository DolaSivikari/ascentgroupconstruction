import { useState, useRef } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Clock, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import OptimizedImage from "@/components/OptimizedImage";

interface TimelineStep {
  step: number;
  title: string;
  duration: string;
  description: string;
  details: string[];
  deliverables: string[];
  image?: string;
}

interface AnimatedProcessTimelineProps {
  steps: TimelineStep[];
}

const AnimatedProcessTimeline = ({ steps }: AnimatedProcessTimelineProps) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set([0]));
  const prefersReducedMotion = useReducedMotion();
  
  const timelineRef = useRef<HTMLDivElement>(null);
  const isIntersecting = useIntersectionObserver(timelineRef, {
    threshold: 0.1,
  });

  const handleStepClick = (stepNumber: number) => {
    setActiveStep(stepNumber);
    setCompletedSteps(prev => new Set([...prev, stepNumber]));
  };

  const handleExpandToggle = (stepNumber: number) => {
    setExpandedStep(expandedStep === stepNumber ? null : stepNumber);
  };

  const progress = ((activeStep + 1) / steps.length) * 100;

  return (
    <div ref={timelineRef} className="relative w-full py-12">
      {/* Progress Bar */}
      <div className="sticky top-20 z-10 mb-12 bg-background/95 backdrop-blur-sm p-6 rounded-[var(--radius-sm)] border [box-shadow:var(--shadow-md)]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">Project Progress</h3>
          <Badge variant="secondary" className="text-sm">
            Step {activeStep + 1} of {steps.length}
          </Badge>
        </div>
        <div className="relative h-3 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-primary/80 to-primary rounded-full",
              !prefersReducedMotion && "[box-shadow:var(--shadow-glow)]",
              "transition-all duration-700 ease-out"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Start</span>
          <span>{Math.round(progress)}% Complete</span>
          <span>Finish</span>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="relative max-w-6xl mx-auto">
        {/* Vertical Line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20 -translate-x-1/2" />
        
        {/* Active Progress Line */}
        <div
          className="absolute left-8 md:left-1/2 top-0 w-0.5 bg-gradient-to-b from-primary to-primary/60 -translate-x-1/2 [box-shadow:var(--shadow-glow)] transition-all duration-700 ease-out"
          style={{ height: `${(activeStep / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isActive = activeStep === index;
          const isCompleted = completedSteps.has(index);
          const isExpanded = expandedStep === index;
          const isLeft = index % 2 === 0;
          const delay = index * 150;

          return (
            <div
              key={step.step}
              className={cn(
                "relative mb-16 last:mb-0",
                isLeft ? "md:pr-[50%]" : "md:pl-[50%]"
              )}
            >
              {/* Checkpoint */}
              <button
                onClick={() => handleStepClick(index)}
                className={cn(
                  "absolute left-8 md:left-1/2 -translate-x-1/2 z-20 transition-all duration-300 group",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full"
                )}
                aria-label={`Go to ${step.title}`}
              >
                <div
                  className={cn(
                    "relative w-12 h-12 rounded-full border-4 transition-all duration-500",
                    isActive && "scale-125 [box-shadow:var(--shadow-glow)]",
                    isCompleted
                      ? "bg-primary border-primary"
                      : "bg-background border-muted-foreground/30",
                    !isActive && "group-hover:scale-110"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-full h-full p-2 text-primary-foreground" />
                  ) : (
                    <Circle className="w-full h-full p-2 text-muted-foreground" />
                  )}
                  
                  {/* Pulse Animation for Active */}
                  {isActive && !prefersReducedMotion && (
                    <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                  )}
                </div>
                
                {/* Step Number Badge */}
                <Badge
                  variant={isCompleted ? "default" : "outline"}
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap"
                >
                  Step {step.step}
                </Badge>
              </button>

              {/* Content Card */}
              <div
                className={cn(
                  "ml-24 md:ml-0 transition-all duration-500",
                  isIntersecting && !prefersReducedMotion && "animate-fade-in-up",
                  isLeft ? "md:mr-16" : "md:ml-16"
                )}
                style={{
                  animationDelay: !prefersReducedMotion ? `${delay}ms` : "0ms",
                }}
              >
                <Card
                  className={cn(
                    "overflow-hidden card-hover",
                    isActive && "ring-2 ring-primary [box-shadow:var(--shadow-card-elevated)] scale-[1.02]",
                    !isActive && "hover:[box-shadow:var(--shadow-md)] hover:scale-[1.01]"
                  )}
                >
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h3
                          className={cn(
                            "text-2xl font-bold mb-2 transition-colors",
                            isActive ? "text-primary" : "text-foreground"
                          )}
                        >
                          {step.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{step.duration}</span>
                        </div>
                      </div>
                      <Badge
                        variant={isCompleted ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {isCompleted ? "Completed" : "Pending"}
                      </Badge>
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Image */}
                    {step.image && (
                      <div className="mb-4 rounded-[var(--radius-sm)] overflow-hidden">
                        <OptimizedImage
                          src={step.image}
                          alt={step.title}
                          width={600}
                          height={300}
                          className="w-full"
                        />
                      </div>
                    )}

                    {/* Expand Button */}
                    <Button
                      variant="ghost"
                      onClick={() => handleExpandToggle(index)}
                      className="w-full justify-between"
                    >
                      <span className="font-medium">
                        {isExpanded ? "Show Less" : "Show More Details"}
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 icon-rotate",
                          isExpanded && "rotate-180"
                        )}
                      />
                    </Button>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-6 space-y-6 pt-6 border-t animate-accordion-down">
                        {/* What We Do */}
                        {step.details.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                              What We Do
                            </h4>
                            <ul className="space-y-2">
                              {step.details.map((detail, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-3 text-muted-foreground"
                                >
                                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                  <span>{detail}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Deliverables */}
                        {step.deliverables.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                              What You Get
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {step.deliverables.map((item, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="text-sm"
                                >
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnimatedProcessTimeline;
