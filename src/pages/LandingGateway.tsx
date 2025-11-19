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
      
      {/* Vertical column layout - single column running top to bottom */}
      <div className="relative z-10 min-h-screen flex flex-col">
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
  );
};
