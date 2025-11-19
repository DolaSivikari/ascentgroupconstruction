import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LandingPanelProps {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  onNavigate: () => void;
}

export const LandingPanel = ({ title, description, imageUrl, link, onNavigate }: LandingPanelProps) => {
  return (
    <Link
      to={link}
      onClick={onNavigate}
      className="group relative overflow-hidden aspect-square md:aspect-[4/3] flex items-end p-8 transition-all duration-500"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      
      {/* Overlay - Dark by default, Orange on hover */}
      <div className="absolute inset-0 bg-black/70 group-hover:bg-[hsl(20,95%,50%)]/80 transition-all duration-500" />
      
      {/* Content */}
      <div className="relative z-10 text-white transform transition-transform duration-500 group-hover:translate-y-[-8px]">
        <h3 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
          {title}
        </h3>
        <p className="text-lg md:text-xl text-white/90 mb-6 max-w-md">
          {description}
        </p>
        <div className="flex items-center gap-2 text-white font-semibold">
          <span>Explore</span>
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
        </div>
      </div>
    </Link>
  );
};
