import { Link } from "react-router-dom";
import { TrendingUp, Sparkles, Flame, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { usePopularServices } from "@/hooks/usePopularServices";
import { useFeaturedServices, useServicePromotions } from "@/hooks/useFeaturedServices";
import { usePersonalizedRecommendations } from "@/hooks/usePersonalizedRecommendations";
import { useServiceAnalytics } from "@/hooks/useServiceAnalytics";
import { haptics } from "@/utils/haptics";
import { memo, useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface SmartPopularServicesProps {
  onLinkClick: () => void;
  variant?: 'default' | 'personalized' | 'featured';
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

export const SmartPopularServices = memo(({ onLinkClick, variant = 'default' }: SmartPopularServicesProps) => {
  const { data: trendingServices = [], isLoading: isTrendingLoading } = usePopularServices();
  const { data: featuredServices = [] } = useFeaturedServices();
  const { data: promotions = [] } = useServicePromotions();
  const { data: recommendations = [] } = usePersonalizedRecommendations();
  const { trackEvent, trackInteraction } = useServiceAnalytics();
  
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  // Track impressions when visible
  useEffect(() => {
    if (inView) {
      const services = variant === 'personalized' ? recommendations : variant === 'featured' ? featuredServices : trendingServices;
      services.forEach((service, index) => {
        trackEvent({
          service_link: service.link || service.service_link,
          service_name: service.name || service.service_name,
          event_type: 'impression',
          position: index,
          variant,
        });
      });
    }
  }, [inView, variant]);

  const handleClick = (service: any, index: number) => {
    haptics.light();
    
    // Track click
    trackEvent({
      service_link: service.link || service.service_link,
      service_name: service.name || service.service_name,
      event_type: 'click',
      position: index,
      variant,
    });

    // Track interaction
    trackInteraction({
      serviceLink: service.link || service.service_link,
      fromPopular: true,
    });

    onLinkClick();
  };

  // Determine which services to show
  let services: any[] = [];
  let title = "Trending This Week";
  let icon = TrendingUp;
  let badge = { text: "Hot", icon: Sparkles };

  if (variant === 'personalized' && recommendations.length > 0) {
    services = recommendations;
    title = "Recommended For You";
    icon = Sparkles;
    badge = { text: "Personal", icon: Sparkles };
  } else if (variant === 'featured' && featuredServices.length > 0) {
    services = featuredServices.map(s => ({
      ...s,
      name: s.service_name,
      link: s.service_link,
    }));
    title = "Featured Services";
    icon = Flame;
    badge = { text: "Featured", icon: Flame };
  } else {
    services = trendingServices;
  }

  // Apply promotions to services
  services = services.map(service => {
    const promotion = promotions.find(p => p.service_link === (service.link || service.service_link));
    return promotion ? { ...service, promotion } : service;
  });

  const isLoading = isTrendingLoading && services.length === 0;

  if (isLoading) {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-bold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            {title}
          </h4>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (services.length === 0) return null;

  const BadgeIcon = badge.icon;
  const TitleIcon = icon;

  return (
    <div className="mb-6" ref={ref}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-base font-bold flex items-center gap-2 text-foreground">
          <TitleIcon className="h-5 w-5 text-accent" />
          {title}
        </h4>
        <Badge variant="secondary" className="text-xs bg-accent/10 text-accent border-accent/20">
          <BadgeIcon className="h-3 w-3 mr-1" />
          {badge.text}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {services.slice(0, 4).map((service, index) => {
          const IconComponent = service.icon;
          const gradientClass = getServiceGradient(service.link || service.service_link);
          const promotion = service.promotion;
          
          return (
            <Link
              key={service.link || service.service_link}
              to={service.link || service.service_link}
              onClick={() => handleClick(service, index)}
              className="group relative overflow-hidden rounded-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] touch-manipulation min-h-[72px]"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 ${gradientClass} opacity-90 group-hover:opacity-100 transition-opacity`} />
              
              {/* Glass Morphism Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Promotion Badge */}
              {promotion && (
                <div className="absolute top-2 right-2 z-10">
                  <Badge 
                    className="text-xs font-bold shadow-lg animate-pulse"
                    style={{ backgroundColor: promotion.badge_color }}
                  >
                    {promotion.badge_text}
                  </Badge>
                </div>
              )}
              
              {/* Content */}
              <div className="relative flex items-center gap-4 p-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <IconComponent className="h-7 w-7 text-white drop-shadow-md" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white text-base leading-tight drop-shadow-md">
                    {service.name || service.service_name}
                  </div>
                  {service.searchCount && service.searchCount >= 10 && (
                    <div className="text-xs text-white/90 mt-0.5 drop-shadow-sm">
                      {service.searchCount} searches this week
                    </div>
                  )}
                  {service.reason && (
                    <div className="text-xs text-white/90 mt-0.5 drop-shadow-sm">
                      {service.reason}
                    </div>
                  )}
                  {promotion?.promotion_message && (
                    <div className="text-xs text-white/90 mt-0.5 drop-shadow-sm font-medium">
                      {promotion.promotion_message}
                    </div>
                  )}
                </div>
                
                {service.isTrending && service.trendPercentage && (
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="absolute inset-0 bg-white rounded-full blur-md opacity-50 animate-pulse" />
                      <div className="relative h-10 w-10 bg-white rounded-full flex flex-col items-center justify-center shadow-lg">
                        <Zap className="h-4 w-4 text-accent" />
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

SmartPopularServices.displayName = "SmartPopularServices";
