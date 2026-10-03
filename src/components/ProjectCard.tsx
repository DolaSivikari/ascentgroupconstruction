import { TYPOGRAPHY_STYLES } from "@/design-system/constants";
import { useState } from "react";
import { Link } from "react-router-dom";
import { formatProjectValue } from "@/utils/formatProjectValue";
import { Card, CardContent } from "@/design-system/components/Card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/ui/Button";
import { MapPin, Calendar, Eye, CheckCircle2, DollarSign, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveAssetPath } from "@/utils/assetResolver";

import { ProjectFeaturedImage } from "@/components/projects/ProjectFeaturedImage";

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
  image,
  slug,
  description,
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
      className="relative group overflow-hidden p-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container - shared featured image renderer */}
      <ProjectFeaturedImage
        src={resolveAssetPath(image)}
        alt={title}
        variant="card"
      >
        {/* Clean overlay on hover */}
        <div className={cn(
          "absolute inset-0 z-20 pointer-events-none bg-primary/90 flex items-center justify-center transition-opacity duration-300 group-focus-within:opacity-100",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          <div className="flex items-center gap-3 px-6">
            <span aria-hidden="true" className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "border-white bg-white text-primary")}>
              <Eye className="w-4 h-4 mr-2" />
              View Project
            </span>
            {onQuickView && (
              <Button
                variant="outline"
                size="sm"
                type="button"
                aria-label={`Quick view: ${title}`}
                className="relative pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto border-white/70 text-white hover:bg-white/20"
                onClick={() => onQuickView(slug)}
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
      </ProjectFeaturedImage>
      
      {/* Card Content - Clean PCL style */}
      <CardContent className="p-6">
        <h3 className={`${TYPOGRAPHY_STYLES.cardTitle} mb-3`}>
          <Link
            to={`/projects/${slug}`}
            aria-label={`View project: ${title}`}
            className="after:absolute after:inset-0 after:z-10 after:rounded-[var(--card-border-radius)] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-ring"
          >
            <span className="line-clamp-2">{title}</span>
          </Link>
        </h3>
        
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
