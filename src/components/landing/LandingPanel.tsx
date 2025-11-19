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
      className="relative group w-full flex items-center justify-center py-12 md:py-16 px-8 transition-all duration-500"
    >
      {/* Semi-transparent overlay - dark by default, orange on hover */}
      <div className="absolute inset-0 bg-black/60 group-hover:bg-[hsl(20,95%,50%)]/85 transition-all duration-500" />
      
      {/* Content */}
      <div className="relative z-10 text-center text-white transform transition-transform duration-300 group-hover:-translate-y-1">
        <h3 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">
          {title}
        </h3>
        {subtitle && (
          <p className="text-lg md:text-xl opacity-90">
            {subtitle}
          </p>
        )}
      </div>
    </Link>
  );
};
