import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/ui/Button";
import { MapPin, Calendar, Ruler, ArrowRight, Award, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { resolveAssetPath } from "@/utils/assetResolver";

interface ProjectFeaturedCardProps {
  title: string;
  category: string;
  location: string;
  year: string;
  size: string;
  image: string;
  description: string;
  slug: string;
  featured?: boolean | string;
}

const ProjectFeaturedCard = ({
  title,
  category,
  location,
  year,
  size,
  image,
  description,
  slug,
  featured,
}: ProjectFeaturedCardProps) => {
  return (
    <Card variant="featured" className="group overflow-hidden">
      {/* Hero Image with Parallax Effect */}
      <div className="relative aspect-[3/4] sm:aspect-[4/3] md:h-96 overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center object-center hover-scale"
          style={{ backgroundImage: `url(${resolveAssetPath(image) || image})` }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        {/* Top Badges */}
        <div className="absolute top-6 left-6 flex gap-2">
          <Badge variant="primary" size="sm">
            {category}
          </Badge>
          {featured && (
            <Badge variant="warning" size="sm" icon={Star}>
              {typeof featured === 'string' ? featured : 'Featured'}
            </Badge>
          )}
        </div>
        
        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
          <h3 className="text-3xl font-bold text-foreground">{title}</h3>
          <p className="text-muted-foreground line-clamp-2">{description}</p>
          
          {/* Stats Grid */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
              <Ruler className="w-4 h-4 text-primary" />
              <span>{size}</span>
            </div>
            <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{year}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Card Footer */}
      <CardContent className="p-6">
        <Button asChild className="w-full group/btn">
          <Link to={`/blog/${slug}`}>
            View Full Case Study
            <ArrowRight className="ml-2 h-4 w-4 hover-translate-arrow" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProjectFeaturedCard;
