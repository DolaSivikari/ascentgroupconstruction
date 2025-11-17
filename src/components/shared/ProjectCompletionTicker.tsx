import { useEffect, useState } from "react";
import { CheckCircle2, MapPin, Calendar, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecentProject {
  name: string;
  location: string;
  date: string;
  value: string;
}

interface ProjectCompletionTickerProps {
  projects?: RecentProject[];
  speed?: number;
  className?: string;
}

const defaultProjects: RecentProject[] = [
  { name: "Heritage Tower Restoration", location: "Toronto, ON", date: "2 days ago", value: "$2.4M" },
  { name: "Waterfront Condos Phase 3", location: "Mississauga, ON", date: "1 week ago", value: "$1.8M" },
  { name: "Downtown Office Renovation", location: "Toronto, ON", date: "2 weeks ago", value: "$3.2M" },
  { name: "University Residence Hall", location: "Hamilton, ON", date: "3 weeks ago", value: "$2.1M" },
  { name: "Shopping Center Facade", location: "Vaughan, ON", date: "1 month ago", value: "$1.5M" }
];

export const ProjectCompletionTicker = ({
  projects = defaultProjects,
  speed = 40,
  className
}: ProjectCompletionTickerProps) => {
  const [isPaused, setIsPaused] = useState(false);

  // Triple the array for seamless scrolling
  const duplicatedProjects = [...projects, ...projects, ...projects];

  return (
    <div className={cn("relative bg-primary/10 border-y-2 border-primary/20 py-8 overflow-hidden", className)}>
      <div className="container mx-auto px-4 mb-4">
        <div className="flex items-center justify-center gap-2 text-primary">
          <CheckCircle2 className="w-5 h-5" />
          <h4 className="font-semibold">Recently Completed Projects</h4>
        </div>
      </div>

      {/* Gradient Masks */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

      {/* Scrolling Container */}
      <div
        className="flex gap-6"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{
          animation: isPaused ? "none" : `scroll-left ${speed}s linear infinite`,
        }}
      >
        {duplicatedProjects.map((project, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-80 bg-background rounded-xl border-2 border-border p-4 hover:border-primary/30 transition-all hover:shadow-lg"
          >
            <div className="space-y-2">
              <h5 className="font-semibold text-foreground line-clamp-1">{project.name}</h5>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {project.location}
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {project.date}
                </div>
                <div className="flex items-center gap-1 text-primary font-semibold">
                  <DollarSign className="w-4 h-4" />
                  {project.value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
