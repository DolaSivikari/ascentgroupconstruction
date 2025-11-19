import { useState } from "react";
import { Card, CardContent } from "@/design-system/components/Card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/ui/Button";
import { MapPin, Calendar, Ruler, Eye, CheckCircle2, DollarSign, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveAssetPath } from "@/utils/assetResolver";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import OptimizedImage from "./OptimizedImage";
import { ASPECT_RATIOS } from "@/design-system/image-system";

interface ProjectCardProps {
  title: string;
  category: string;
  location: string;
  year: string;
  size: string;
  image: string;
  slug: string;
  tags?: string[];
  description: string;
  highlights?: string[];
  onViewDetails: (slug: string) => void;
  // GC Metrics
  project_value?: number;
  your_role?: string;
  on_time_completion?: boolean;
  on_budget?: boolean;
  safety_incidents?: number;
}

const ProjectCard = ({
  title,
  category,
  location,
  year,
  size,
  image,
  slug,
  tags,
  description,
  highlights,
  onViewDetails,
  project_value,
  your_role,
  on_time_completion,
  on_budget,
  safety_incidents,
}: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      variant="interactive"
      hover
      size="sm"
      className="group cursor-pointer overflow-hidden h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails(slug)}
    >
      {/* Image Container - Modern compact aspect ratio */}
      <div className="relative overflow-hidden aspect-[16/10]">
        <ScrollReveal direction="up" threshold={0.2}>
          <OptimizedImage
            src={resolveAssetPath(image) || "/placeholder.svg"}
            alt={title}
            aspectRatio="16:10"
            generateSrcSet
            className={cn(
              "w-full h-full object-cover object-center transition-all duration-500 animate-fade-in",
              isHovered && "scale-105 brightness-90"
            )}
          />
        </ScrollReveal>
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-60" />
        
        {/* Elegant hover overlay */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/90 to-primary-foreground/95 flex items-center justify-center transition-all duration-500",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          <div className="text-center px-4 transform transition-transform duration-500" style={{ transform: isHovered ? 'translateY(0)' : 'translateY(10px)' }}>
            <Button variant="secondary" size="sm" className="shadow-lg">
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              View Project
            </Button>
          </div>
        </div>
        
        {/* Refined category badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="primary" size="sm" className="backdrop-blur-sm bg-primary/90">{category}</Badge>
        </div>
      </div>
      
      {/* Card Content - Elegant and compact */}
      <CardContent className="p-4">
        <h3 className="text-base font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">{title}</h3>
        
        {/* Refined metadata */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2.5">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{year}</span>
          </div>
        </div>
        
        {/* Compact GC Metrics Badges */}
        {(project_value || your_role || on_time_completion !== undefined || on_budget !== undefined || safety_incidents !== undefined) && (
          <div className="flex flex-wrap gap-1 mb-2">
            {project_value && (
              <Badge variant="outline" size="sm" className="text-xs px-2 py-0">
                ${(project_value / 100 / 1000000).toFixed(1)}M
              </Badge>
            )}
            {your_role && (
              <Badge variant="outline" size="sm" className="text-xs px-2 py-0">
                {your_role}
              </Badge>
            )}
            {on_time_completion && (
              <Badge variant="success" size="sm" icon={CheckCircle2} className="text-xs px-2 py-0">
                On-Time
              </Badge>
            )}
            {on_budget && (
              <Badge variant="success" size="sm" icon={DollarSign} className="text-xs px-2 py-0">
                On-Budget
              </Badge>
            )}
            {safety_incidents === 0 && (
              <Badge variant="success" size="sm" icon={Shield} className="text-xs px-2 py-0">
                Zero Incidents
              </Badge>
            )}
          </div>
        )}
        
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
