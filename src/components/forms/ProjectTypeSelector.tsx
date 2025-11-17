import { Building2, Home, School, Factory, Hotel, ShoppingCart, Hospital, Building } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface ProjectType {
  id: string;
  label: string;
  icon: any;
  description: string;
}

interface ProjectTypeSelectorProps {
  selected: string;
  onChange: (type: string) => void;
  className?: string;
}

const projectTypes: ProjectType[] = [
  {
    id: "commercial",
    label: "Commercial",
    icon: Building2,
    description: "Office buildings, retail spaces"
  },
  {
    id: "residential",
    label: "Residential",
    icon: Home,
    description: "Multi-family, condos"
  },
  {
    id: "institutional",
    label: "Institutional",
    icon: School,
    description: "Schools, government buildings"
  },
  {
    id: "industrial",
    label: "Industrial",
    icon: Factory,
    description: "Warehouses, manufacturing"
  },
  {
    id: "hospitality",
    label: "Hospitality",
    icon: Hotel,
    description: "Hotels, resorts"
  },
  {
    id: "retail",
    label: "Retail",
    icon: ShoppingCart,
    description: "Shopping centers, stores"
  },
  {
    id: "healthcare",
    label: "Healthcare",
    icon: Hospital,
    description: "Hospitals, medical facilities"
  },
  {
    id: "other",
    label: "Other",
    icon: Building,
    description: "Custom project type"
  }
];

export const ProjectTypeSelector = ({ selected, onChange, className }: ProjectTypeSelectorProps) => {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
      {projectTypes.map((type, index) => {
        const Icon = type.icon;
        const isSelected = selected === type.id;

        return (
          <button
            key={type.id}
            type="button"
            onClick={() => onChange(type.id)}
            className={cn(
              "text-left animate-fade-in"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <Card className={cn(
              "p-4 h-full border-2 transition-all duration-300 hover:scale-105",
              isSelected
                ? "border-primary bg-primary/10 shadow-lg ring-4 ring-primary/20"
                : "border-border hover:border-primary/30 hover:shadow-md"
            )}>
              <div className="flex flex-col items-center text-center gap-3">
                <div className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center transition-all",
                  isSelected
                    ? "bg-primary/20"
                    : "bg-muted"
                )}>
                  <Icon className={cn(
                    "w-7 h-7",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                <div>
                  <h4 className={cn(
                    "font-semibold mb-1 transition-colors",
                    isSelected ? "text-primary" : "text-foreground"
                  )}>
                    {type.label}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {type.description}
                  </p>
                </div>
              </div>
            </Card>
          </button>
        );
      })}
    </div>
  );
};
