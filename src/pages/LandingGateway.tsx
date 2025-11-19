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
      
      {/* Horizontal grid layout - vertical panels side-by-side */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
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
