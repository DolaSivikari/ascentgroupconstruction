import { LandingPanel } from '@/components/landing/LandingPanel';
import { RotatingBackground } from '@/components/landing/RotatingBackground';
import { landingPanels } from '@/data/landing-panels';

interface LandingGatewayProps {
  onEnter: () => void;
}

export const LandingGateway = ({ onEnter }: LandingGatewayProps) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Animated rotating background layer */}
      <RotatingBackground />
      
      {/* Horizontal grid layout */}
      <div className="relative z-10 min-h-screen p-4 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {landingPanels.map((panel) => (
            <LandingPanel
              key={panel.id}
              title={panel.title}
              subtitle={panel.subtitle}
              link={panel.link}
              onNavigate={onEnter}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
