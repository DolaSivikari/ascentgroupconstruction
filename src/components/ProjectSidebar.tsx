import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Building2, DollarSign, User, Clock, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

interface ProjectSidebarProps {
  clientName?: string;
  location?: string;
  startDate?: string;
  completionDate?: string;
  projectSize?: string;
  budgetRange?: string;
  category?: string;
  status?: string;
}

export const ProjectSidebar = ({
  clientName,
  location,
  startDate,
  completionDate,
  projectSize,
  budgetRange,
  category,
  status,
}: ProjectSidebarProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      return format(new Date(dateString), "MMM yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-4 lg:sticky lg:top-24">
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Project Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {clientName && (
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Client</p>
                <p className="font-medium">{clientName}</p>
              </div>
            </div>
          )}

          {location && (
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{location}</p>
              </div>
            </div>
          )}

          {(startDate || completionDate) && (
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Timeline</p>
                <p className="font-medium">
                  {formatDate(startDate)} - {formatDate(completionDate)}
                </p>
              </div>
            </div>
          )}

          {projectSize && (
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Project Size</p>
                <p className="font-medium">{projectSize}</p>
              </div>
            </div>
          )}

          {budgetRange && (
            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Budget Range</p>
                <p className="font-medium">{budgetRange}</p>
              </div>
            </div>
          )}

          {category && (
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <Badge variant="primary" size="sm" icon={Building2} className="mt-1">
                  {category}
                </Badge>
              </div>
            </div>
          )}

          {status && (
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge 
                  variant={status === "completed" ? "success" : "info"}
                  size="sm"
                  icon={CheckCircle2}
                  className="mt-1"
                >
                  {status}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
