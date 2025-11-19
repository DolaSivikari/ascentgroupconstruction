import { Link } from 'react-router-dom';
import { use3DTilt } from '@/hooks/use3DTilt';

interface LandingPanelProps {
  title: string;
  subtitle?: string;
  link: string;
  onNavigate: () => void;
}

export const LandingPanel = ({ title, subtitle, link, onNavigate }: LandingPanelProps) => {
  const { tiltStyle, handleMouseMove, handleMouseLeave } = use3DTilt({
    maxTilt: 5,
    perspective: 2000,
    scale: 1.02,
    speed: 400
  });

  return (
    <Link
      to={link}
      onClick={onNavigate}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={tiltStyle}
      className="relative group flex-1 min-h-screen flex flex-col items-center justify-end pb-12 px-8 border-b-2 lg:border-b-0 lg:border-r-2 border-white/60 hover:border-white last:border-b-0 last:border-r-0 transition-all duration-500 cursor-pointer hover:-translate-y-1"
    >
      {/* Semi-transparent overlay - dark by default, orange on hover */}
      <div className="absolute inset-0 bg-black/60 group-hover:bg-[hsl(20,95%,50%)]/85 transition-all duration-500" />
      
      {/* Content positioned at bottom */}
      <div className="relative z-10 text-center text-white">
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-2 group-hover:scale-105 transition-transform duration-300">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm md:text-base opacity-90 group-hover:opacity-100 transition-opacity duration-300">
            {subtitle}
          </p>
        )}
      </div>
    </Link>
  );
};
