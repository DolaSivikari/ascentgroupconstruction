import { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  title: string;
  description?: string;
  content: ReactNode;
  validate?: () => boolean | Promise<boolean>;
}

interface MultiStepFormProps {
  steps: Step[];
  onComplete: () => void | Promise<void>;
  onStepChange?: (step: number) => void;
  className?: string;
}

export const MultiStepForm = ({ steps, onComplete, onStepChange, className }: MultiStepFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isValidating, setIsValidating] = useState(false);

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = async () => {
    const step = steps[currentStep];
    
    if (step.validate) {
      setIsValidating(true);
      const isValid = await step.validate();
      setIsValidating(false);
      
      if (!isValid) return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      onStepChange?.(currentStep + 1);
    } else {
      await onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      onStepChange?.(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className={cn("space-y-8", className)}>
      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">
              Step {currentStep + 1} of {steps.length}
            </h3>
            <p className="text-sm text-muted-foreground">{currentStepData.title}</p>
          </div>
          <span className="text-sm font-medium text-primary">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <Progress value={progress} className="h-3 animate-fade-in" />
        
        {/* Step Indicators */}
        <div className="flex gap-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className={cn(
                "flex-1 h-2 rounded-full transition-all duration-500",
                index <= currentStep 
                  ? "bg-primary scale-105" 
                  : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="animate-fade-in">
        {currentStepData.description && (
          <p className="text-muted-foreground mb-6">{currentStepData.description}</p>
        )}
        <div className="min-h-[300px]">
          {currentStepData.content}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          type="button"
          onClick={handleNext}
          disabled={isValidating}
          className="ml-auto gap-2 min-w-[120px]"
        >
          {isValidating ? (
            "Validating..."
          ) : currentStep === steps.length - 1 ? (
            "Complete"
          ) : (
            <>
              Next
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
