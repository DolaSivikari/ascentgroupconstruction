import { LandingPanel } from '@/components/landing/LandingPanel';
import { landingPanels } from '@/data/landing-panels';
import { Button } from '@/ui/Button';
import { ArrowRight } from 'lucide-react';

interface LandingGatewayProps {
  onEnter: () => void;
}

export const LandingGateway = ({ onEnter }: LandingGatewayProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="relative z-20 p-6 md:p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              ASCENT RESTORATION & CONTRACTING
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              Building Excellence. Delivering Results.
            </p>
          </div>
          <Button
            onClick={onEnter}
            variant="outline"
            size="sm"
            className="hidden md:flex items-center gap-2"
          >
            Skip
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Grid of Panels */}
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto h-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 h-full">
            {landingPanels.map((panel) => (
              <LandingPanel
                key={panel.id}
                title={panel.title}
                description={panel.description}
                imageUrl={panel.imageUrl}
                link={panel.link}
                onNavigate={onEnter}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Skip Button */}
      <div className="md:hidden p-6 flex justify-center">
        <Button
          onClick={onEnter}
          variant="outline"
          className="w-full max-w-sm"
        >
          Enter Site
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
