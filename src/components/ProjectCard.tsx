import { useState } from "react";
import { formatProjectValue } from "@/utils/formatProjectValue";
import { Card, CardContent } from "@/design-system/components/Card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/ui/Button";
import { MapPin, Calendar, Ruler, Eye, CheckCircle2, DollarSign, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveAssetPath } from "@/utils/assetResolver";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import OptimizedImage from "./OptimizedImage";
import { ASPECT_RATIOS } from "@/design-system/image-system";

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '').trim();

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
  onQuickView?: (slug: string) => void;
  // GC Metrics
  project_value?: number;
  your_role?: string;
  on_time_completion?: boolean;
  on_budget?: boolean;
  safety_incidents?: number;
  /** Client type badge (e.g. "Property Manager", "General Contractor") */
  client_type?: string;
  /** Short challenge one-liner */
  challenge?: string;
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
  onQuickView,
  project_value,
  your_role,
  on_time_completion,
  on_budget,
  safety_incidents,
  client_type,
  challenge,
}: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      variant="interactive"
      hover
      size="sm"
      className="group cursor-pointer overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails(slug)}
    >
      {/* Image Container - PCL style with entrance animation */}
      <div className={cn("relative overflow-hidden", ASPECT_RATIOS.card)}>
          <OptimizedImage
            src={resolveAssetPath(image) || "/placeholder.svg"}
            alt={title}
            aspectRatio="4:3"
            generateSrcSet
            className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        
        {/* Clean overlay on hover */}
        <div className={cn(
          "absolute inset-0 bg-primary/90 flex items-center justify-center transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          <div className="flex items-center gap-3 px-6">
            <Button variant="secondary" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View Project
            </Button>
            {onQuickView && (
              <Button
                variant="outline"
                size="sm"
                className="border-secondary/50 text-secondary hover:bg-secondary/20"
                onClick={(e) => { e.stopPropagation(); onQuickView(slug); }}
              >
                Quick View
              </Button>
            )}
          </div>
        </div>
        
        {/* Simple category badge */}
        <div className="absolute top-4 right-4">
          <Badge variant="primary" size="sm">{category}</Badge>
        </div>
      </div>
      
      {/* Card Content - Clean PCL style */}
      <CardContent className="p-6">
        <h3 className="text-lg font-bold mb-3 line-clamp-2">{title}</h3>
        
        {/* Compact stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{year}</span>
          </div>
        </div>
        
        {/* GC Metrics Badges */}
        {(project_value || your_role || client_type || on_time_completion !== undefined || on_budget !== undefined || safety_incidents !== undefined) && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {client_type && (
              <Badge variant="outline" size="sm">
                {client_type}
              </Badge>
            )}
            {formatProjectValue(project_value) && (
              <Badge variant="outline" size="sm">
                {formatProjectValue(project_value)}
              </Badge>
            )}
            {your_role && (
              <Badge variant="outline" size="sm">
                {your_role}
              </Badge>
            )}
            {on_time_completion && (
              <Badge variant="success" size="sm" icon={CheckCircle2}>
                On-Time
              </Badge>
            )}
            {on_budget && (
              <Badge variant="success" size="sm" icon={DollarSign}>
                On-Budget
              </Badge>
            )}
            {safety_incidents === 0 && (
              <Badge variant="success" size="sm" icon={Shield}>
                Zero Incidents
              </Badge>
            )}
          </div>
        )}

        {challenge && (
          <p className="text-sm italic text-muted-foreground line-clamp-1 mb-2">{challenge}</p>
        )}
        
        <p className="text-sm text-muted-foreground line-clamp-2">{stripHtml(description)}</p>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
