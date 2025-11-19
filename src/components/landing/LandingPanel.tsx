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
      className="relative group w-full aspect-square md:aspect-[4/3] flex items-center justify-center p-8 rounded-lg overflow-hidden transition-all duration-500 hover:scale-105"
    >
      {/* Semi-transparent overlay - dark by default, orange on hover */}
      <div className="absolute inset-0 bg-black/60 group-hover:bg-[hsl(20,95%,50%)]/85 transition-all duration-500" />
      
      {/* Content */}
      <div className="relative z-10 text-center text-white transform transition-transform duration-300 group-hover:-translate-y-2">
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-2">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm md:text-base lg:text-lg opacity-90">
            {subtitle}
          </p>
        )}
      </div>
    </Link>
  );
};
