import { Link } from 'react-router-dom';

interface LandingPanelProps {
  title: string;
  subtitle?: string;
  link: string;
  onNavigate: () => void;
}

export const LandingPanel = ({ title, subtitle, link, onNavigate }: LandingPanelProps) => {
  return (
    <Link
      to={link}
      onClick={onNavigate}
      className="relative group flex-1 min-h-screen flex flex-col items-center justify-end pb-12 px-8 border-b-2 lg:border-b-0 lg:border-r-2 border-white/30 last:border-b-0 last:border-r-0 transition-all duration-500"
    >
      {/* Semi-transparent overlay - dark by default, orange on hover */}
      <div className="absolute inset-0 bg-black/60 group-hover:bg-[hsl(20,95%,50%)]/85 transition-all duration-500" />
      
      {/* Content positioned at bottom */}
      <div className="relative z-10 text-center text-white">
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-2">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm md:text-base opacity-90">
            {subtitle}
          </p>
        )}
      </div>
    </Link>
  );
};
