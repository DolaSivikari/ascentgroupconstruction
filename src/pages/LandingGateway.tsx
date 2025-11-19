import { useEffect } from 'react';
import { LandingSection } from '@/components/landing/LandingSection';
import { NumberedNavigation } from '@/components/landing/NumberedNavigation';
import { useLandingScroll } from '@/hooks/useLandingScroll';
import { Button } from '@/ui/Button';
import { ArrowRight } from 'lucide-react';

const sections = [
  {
    number: "00",
    title: "WELCOME",
    headline: "ASCENT RESTORATION & CONTRACTING",
    description: "Building Excellence. Delivering Results.",
    isIntro: true
  },
  {
    number: "01",
    title: "OUR EXPERTISE",
    headline: "Building Envelope & Restoration Specialists",
    description: "15+ years combined team experience in façade remediation, waterproofing, and exterior restoration"
  },
  {
    number: "02",
    title: "OUR APPROACH",
    headline: "Direct Execution. Clear Accountability.",
    description: "85% self-performed work. One team, one point of contact, one responsible party"
  },
  {
    number: "03",
    title: "OUR VISION",
    headline: "Building Toward Full GC Capabilities",
    description: "Strategic 3-5 year expansion path from specialty contractor to full general contracting services"
  },
  {
    number: "04",
    title: "OUR STANDARDS",
    headline: "Professional Execution at Every Scale",
    description: "$2M CGL coverage, WSIB compliant, working toward COR certification"
  }
];

interface LandingGatewayProps {
  onEnter: () => void;
}

export const LandingGateway = ({ onEnter }: LandingGatewayProps) => {
  const { activeSection, scrollToSection } = useLandingScroll(sections.length);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' && activeSection < sections.length - 1) {
        e.preventDefault();
        scrollToSection(activeSection + 1);
      } else if (e.key === 'ArrowUp' && activeSection > 0) {
        e.preventDefault();
        scrollToSection(activeSection - 1);
      } else if (e.key === 'Enter') {
        onEnter();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection, onEnter, scrollToSection]);

  // Touch gestures for mobile
  useEffect(() => {
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;
      
      if (Math.abs(diff) > 50) {
        if (diff > 0 && activeSection < sections.length - 1) {
          scrollToSection(activeSection + 1);
        } else if (diff < 0 && activeSection > 0) {
          scrollToSection(activeSection - 1);
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeSection, scrollToSection]);

  return (
    <div className="relative bg-background">
      {/* Skip button */}
      <button
        onClick={onEnter}
        className="fixed top-4 right-4 z-50 text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
      >
        Skip Intro →
      </button>

      {/* Sections */}
      {sections.map((section, index) => (
        <LandingSection
          key={section.number}
          {...section}
          isActive={activeSection === index}
        >
          {/* Enter Site CTA on last section */}
          {index === sections.length - 1 && (
            <div className="mt-12 flex flex-col items-center gap-4">
              <Button
                onClick={onEnter}
                variant="primary"
                size="lg"
                className="group"
              >
                Enter Site
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <p className="text-sm text-muted-foreground">
                Or continue exploring
              </p>
            </div>
          )}
        </LandingSection>
      ))}

      {/* Navigation */}
      <NumberedNavigation
        sections={sections}
        activeSection={activeSection}
        onSectionClick={scrollToSection}
      />
    </div>
  );
};
