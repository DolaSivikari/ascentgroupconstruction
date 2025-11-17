import { Link } from "react-router-dom";
import { TrendingUp, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { usePopularServices } from "@/hooks/usePopularServices";
import { haptics } from "@/utils/haptics";
import { memo } from "react";

interface EnhancedPopularServicesProps {
  onLinkClick: () => void;
}

const serviceGradients: Record<string, string> = {
  "building-envelope": "bg-gradient-to-br from-accent to-accent/80",
  "cladding-systems": "bg-gradient-to-br from-[hsl(336,84%,60%)] to-[hsl(346,87%,50%)]",
  "waterproofing": "bg-gradient-to-br from-steel-blue to-steel-blue/80",
  "protective-coatings": "bg-gradient-to-br from-[hsl(158,64%,52%)] to-[hsl(173,58%,39%)]",
  "interior-buildouts": "bg-gradient-to-br from-primary to-primary/80",
  "painting-services": "bg-gradient-to-br from-[hsl(280,70%,65%)] to-[hsl(290,75%,60%)]",
  "tile-flooring": "bg-gradient-to-br from-[hsl(45,90%,60%)] to-[hsl(35,85%,55%)]",
  "sustainable-construction": "bg-gradient-to-br from-[hsl(140,70%,50%)] to-[hsl(150,65%,45%)]",
};

const getServiceGradient = (link: string): string => {
  const serviceKey = link.split('/').pop() || '';
  return serviceGradients[serviceKey] || "bg-gradient-to-br from-accent to-accent/80";
};

const LoadingSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

export const EnhancedPopularServices = memo(({ onLinkClick }: EnhancedPopularServicesProps) => {
  const { data: popularServices = [], isLoading, isError } = usePopularServices();

  if (isLoading) {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-bold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Popular Services
          </h4>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (isError || popularServices.length === 0) return null;

  const handleClick = () => {
    haptics.light();
    onLinkClick();
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-base font-bold flex items-center gap-2 text-foreground">
          <TrendingUp className="h-5 w-5 text-accent" />
          Trending This Week
        </h4>
        <Badge variant="secondary" className="text-xs bg-accent/10 text-accent border-accent/20">
          <Sparkles className="h-3 w-3 mr-1" />
          Hot
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {popularServices.map((service) => {
          const IconComponent = service.icon;
          const gradientClass = getServiceGradient(service.link);
          
          return (
            <Link
              key={service.link}
              to={service.link}
              onClick={handleClick}
              className="group relative overflow-hidden rounded-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] touch-manipulation min-h-[72px]"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 ${gradientClass} opacity-90 group-hover:opacity-100 transition-opacity`} />
              
              {/* Glass Morphism Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Content */}
              <div className="relative flex items-center gap-4 p-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <IconComponent className="h-7 w-7 text-white drop-shadow-md" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white text-base leading-tight drop-shadow-md">
                    {service.name}
                  </div>
                  {service.searchCount && service.searchCount >= 10 && (
                    <div className="text-xs text-white/90 mt-0.5 drop-shadow-sm">
                      {service.searchCount} searches this week
                    </div>
                  )}
                </div>
                
                {service.isTrending && service.trendPercentage && (
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="absolute inset-0 bg-white rounded-full blur-md opacity-50 animate-pulse" />
                      <div className="relative h-10 w-10 bg-white rounded-full flex flex-col items-center justify-center shadow-lg">
                        <TrendingUp className="h-4 w-4 text-accent" />
                        <span className="text-[9px] font-bold text-accent">
                          +{service.trendPercentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Shine Effect on Hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:left-full transition-all duration-700" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
});

EnhancedPopularServices.displayName = "EnhancedPopularServices";
