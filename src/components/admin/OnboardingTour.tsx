import { useState, useEffect } from 'react';
import { Button } from '@/ui/Button';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TourStep {
  target: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    target: '[data-tour="content"]',
    title: 'Content Section',
    description: 'Create and manage all your website content: Projects, Services, Blog Posts, Testimonials, and more.',
    position: 'right',
  },
  {
    target: '[data-tour="appearance"]',
    title: 'Appearance Section',
    description: 'Control how your site looks: Homepage Builder, Navigation Menus, Footer, and page layouts.',
    position: 'right',
  },
  {
    target: '[data-tour="inbox"]',
    title: 'Inbox',
    description: 'Review contact form submissions, RFPs, resumes, and prequalification requests from potential clients.',
    position: 'right',
  },
  {
    target: '[data-tour="business"]',
    title: 'Business Tools',
    description: 'Manage clients, projects, estimates, and invoices for your business operations.',
    position: 'right',
  },
  {
    target: '[data-tour="tools"]',
    title: 'SEO & Tools',
    description: 'Optimize your site with SEO Dashboard, Redirects, Structured Data, and Performance monitoring.',
    position: 'right',
  },
  {
    target: '[data-tour="settings"]',
    title: 'Settings',
    description: 'Configure site-wide settings, user management, and security options.',
    position: 'right',
  },
];

interface OnboardingTourProps {
  onComplete: () => void;
}

export const OnboardingTour = ({ onComplete }: OnboardingTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [targetPosition, setTargetPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });

  useEffect(() => {
    updateTargetPosition();
    window.addEventListener('resize', updateTargetPosition);
    return () => window.removeEventListener('resize', updateTargetPosition);
  }, [currentStep]);

  const updateTargetPosition = () => {
    const step = tourSteps[currentStep];
    const element = document.querySelector(step.target);
    
    if (element) {
      const rect = element.getBoundingClientRect();
      setTargetPosition({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
      
      // Scroll element into view
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible) return null;

  const step = tourSteps[currentStep];
  const tooltipPosition = getTooltipPosition(step.position, targetPosition);

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-[9998] pointer-events-none">
        {/* Spotlight */}
        {targetPosition.width > 0 && (
          <div
            className="absolute border-4 border-primary rounded-lg shadow-2xl pointer-events-auto"
            style={{
              top: targetPosition.top - 8,
              left: targetPosition.left - 8,
              width: targetPosition.width + 16,
              height: targetPosition.height + 16,
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
            }}
          />
        )}
      </div>

      {/* Tooltip */}
      <Card
        className="fixed z-[9999] w-80 shadow-2xl"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
        }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg">{step.title}</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleComplete}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="text-sm text-muted-foreground">{step.description}</p>
        </CardContent>
        <CardFooter className="flex items-center justify-between pt-3 border-t">
          <div className="text-xs text-muted-foreground">
            Step {currentStep + 1} of {tourSteps.length}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <Button size="sm" onClick={handleNext}>
              {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
              {currentStep < tourSteps.length - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

function getTooltipPosition(
  position: 'top' | 'bottom' | 'left' | 'right',
  target: { top: number; left: number; width: number; height: number }
) {
  const offset = 24;
  const tooltipWidth = 320;
  const tooltipHeight = 200; // approximate

  switch (position) {
    case 'right':
      return {
        top: target.top + target.height / 2 - tooltipHeight / 2,
        left: target.left + target.width + offset,
      };
    case 'left':
      return {
        top: target.top + target.height / 2 - tooltipHeight / 2,
        left: target.left - tooltipWidth - offset,
      };
    case 'top':
      return {
        top: target.top - tooltipHeight - offset,
        left: target.left + target.width / 2 - tooltipWidth / 2,
      };
    case 'bottom':
      return {
        top: target.top + target.height + offset,
        left: target.left + target.width / 2 - tooltipWidth / 2,
      };
  }
}
