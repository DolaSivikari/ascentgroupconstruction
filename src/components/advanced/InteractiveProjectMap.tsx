import { useState } from "react";
import { MapPin, Building2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface Project {
  id: number;
  name: string;
  location: string;
  type: string;
  status: "completed" | "ongoing";
  year: number;
  value: string;
}

const projects: Project[] = [
  { id: 1, name: "Downtown Office Tower", location: "Toronto", type: "Commercial", status: "completed", year: 2023, value: "$2.5M" },
  { id: 2, name: "Residential Complex", location: "Mississauga", type: "Residential", status: "completed", year: 2023, value: "$1.8M" },
  { id: 3, name: "Shopping Center Restoration", location: "Markham", type: "Commercial", status: "ongoing", year: 2024, value: "$3.2M" },
  { id: 4, name: "Condo Building", location: "Vaughan", type: "Residential", status: "completed", year: 2022, value: "$1.5M" },
  { id: 5, name: "Industrial Facility", location: "Brampton", type: "Industrial", status: "completed", year: 2023, value: "$2.1M" },
];

const regions = [
  { name: "Toronto", count: 150, x: "50%", y: "45%" },
  { name: "Mississauga", count: 85, x: "42%", y: "48%" },
  { name: "Markham", count: 65, x: "58%", y: "42%" },
  { name: "Vaughan", count: 72, x: "48%", y: "38%" },
  { name: "Brampton", count: 48, x: "38%", y: "42%" },
  { name: "GTA", count: 80, x: "50%", y: "55%" },
];

export const InteractiveProjectMap = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "completed" | "ongoing">("all");

  const filteredProjects = projects.filter(p => 
    filter === "all" || p.status === filter
  ).filter(p => 
    !selectedRegion || p.location === selectedRegion
  );

  return (
    <section
      ref={ref}
      className={cn(
        "py-16 bg-gradient-to-b from-background to-background/50",
        "transition-all duration-700",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Project Footprint
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Serving clients across Ontario with 500+ successful projects
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Interactive Map */}
          <div className="relative aspect-square bg-gradient-to-br from-construction-orange/5 to-background rounded-lg border border-border/50 p-8">
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <MapPin className="w-48 h-48 text-construction-orange" />
            </div>
            
            {/* Region Markers */}
            {regions.map((region, index) => (
              <button
                key={index}
                onClick={() => setSelectedRegion(selectedRegion === region.name ? null : region.name)}
                className={cn(
                  "absolute group cursor-pointer transition-all duration-300",
                  selectedRegion === region.name ? "scale-125 z-10" : "scale-100"
                )}
                style={{ left: region.x, top: region.y, transform: "translate(-50%, -50%)" }}
              >
                <div className={cn(
                  "relative flex flex-col items-center",
                  "transition-all duration-300"
                )}>
                  <div className={cn(
                    "w-12 h-12 rounded-full border-2 flex items-center justify-center",
                    "transition-all duration-300",
                    selectedRegion === region.name
                      ? "bg-construction-orange border-construction-orange shadow-lg shadow-construction-orange/50"
                      : "bg-background/80 border-construction-orange/50 hover:bg-construction-orange/10"
                  )}>
                    <Building2 className={cn(
                      "w-6 h-6 transition-colors",
                      selectedRegion === region.name ? "text-white" : "text-construction-orange"
                    )} />
                  </div>
                  
                  <div className={cn(
                    "absolute -bottom-8 bg-background/95 backdrop-blur-sm px-3 py-1 rounded-md",
                    "border border-border/50 whitespace-nowrap",
                    "transition-all duration-300",
                    selectedRegion === region.name ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  )}>
                    <div className="text-xs font-semibold text-foreground">{region.name}</div>
                    <div className="text-xs text-muted-foreground">{region.count} projects</div>
                  </div>

                  {/* Pulse Animation */}
                  {selectedRegion === region.name && (
                    <div className="absolute inset-0 rounded-full border-2 border-construction-orange animate-ping opacity-75" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Project List */}
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setFilter("all")}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  filter === "all"
                    ? "bg-construction-orange text-white"
                    : "bg-background/50 text-muted-foreground hover:bg-background"
                )}
              >
                All Projects
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  filter === "completed"
                    ? "bg-construction-orange text-white"
                    : "bg-background/50 text-muted-foreground hover:bg-background"
                )}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter("ongoing")}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  filter === "ongoing"
                    ? "bg-construction-orange text-white"
                    : "bg-background/50 text-muted-foreground hover:bg-background"
                )}
              >
                Ongoing
              </button>
            </div>

            {/* Projects */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 rounded-lg bg-background/50 border border-border/50 hover:border-construction-orange/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-foreground">{project.name}</h4>
                    {project.status === "completed" ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <div className="px-2 py-1 rounded-md bg-construction-orange/10 text-xs font-medium text-construction-orange flex-shrink-0">
                        In Progress
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <MapPin className="w-4 h-4" />
                    {project.location} • {project.type}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{project.year}</span>
                    <span className="font-semibold text-construction-orange">{project.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
