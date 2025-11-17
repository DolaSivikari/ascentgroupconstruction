import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, DollarSign, Users, CheckCircle2, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Project {
  title: string;
  category: string;
  location: string;
  year: string;
  image: string;
  description: string;
  project_value?: number;
  duration?: string;
  on_time_completion?: boolean;
  on_budget?: boolean;
  safety_incidents?: number;
  slug: string;
}

interface ProjectQuickViewProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProjectQuickView = ({ project, open, onOpenChange }: ProjectQuickViewProps) => {
  const navigate = useNavigate();

  if (!project) return null;

  const handleViewFull = () => {
    navigate(`/projects/${project.slug}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">{project.title}</DialogTitle>
        
        {/* Header Image */}
        <div className="relative aspect-video -m-6 mb-0 overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
            {project.category}
          </Badge>
        </div>

        {/* Content */}
        <div className="space-y-6 pt-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">{project.title}</h2>
            <div className="flex flex-wrap gap-3 text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {project.location}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {project.year}
              </div>
              {project.duration && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {project.duration}
                </div>
              )}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {project.project_value && (
              <div className="p-3 bg-muted rounded-lg text-center">
                <DollarSign className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="text-xs text-muted-foreground">Value</p>
                <p className="font-bold">${(project.project_value / 100000000).toFixed(1)}M</p>
              </div>
            )}
            {project.on_time_completion !== undefined && (
              <div className="p-3 bg-muted rounded-lg text-center">
                <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-green-600" />
                <p className="text-xs text-muted-foreground">On Time</p>
                <p className="font-bold">{project.on_time_completion ? "Yes" : "No"}</p>
              </div>
            )}
            {project.on_budget !== undefined && (
              <div className="p-3 bg-muted rounded-lg text-center">
                <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-green-600" />
                <p className="text-xs text-muted-foreground">On Budget</p>
                <p className="font-bold">{project.on_budget ? "Yes" : "No"}</p>
              </div>
            )}
            {project.safety_incidents !== undefined && (
              <div className="p-3 bg-muted rounded-lg text-center">
                <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-green-600" />
                <p className="text-xs text-muted-foreground">Safety</p>
                <p className="font-bold">{project.safety_incidents} Incidents</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Project Overview</h3>
            <p className="text-muted-foreground leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={handleViewFull} className="flex-1 gap-2">
              View Full Details
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
