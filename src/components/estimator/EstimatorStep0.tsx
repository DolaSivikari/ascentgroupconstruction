import { Card } from "@/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/ui/Input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DollarSign, Wrench, AlertCircle, Calculator, Check, ClipboardList } from "lucide-react";

interface EstimatorStep0Props {
  data: {
    quoteType: string;
    company: string;
    role: string;
    nteBudget: string;
    scopeCategories: string[];
  };
  onChange: (field: string, value: any) => void;
}

const quoteTypes = [
  {
    id: "specialty_prime",
    title: "Prime Specialty Project",
    description: "Building envelope, façade restoration, waterproofing — we'll prime contract the full project.",
    icon: DollarSign,
    range: "$25k–$150k",
    number: "01",
  },
  {
    id: "trade_package",
    title: "Trade Package for GC",
    description: "You're the GC? We'll provide unit rates for EIFS, sealants, painting, and coatings.",
    icon: Wrench,
    range: "Fast turnaround",
    number: "02",
  },
  {
    id: "emergency",
    title: "Emergency/Maintenance",
    description: "Urgent leak repair, emergency sealant work, or after-hours maintenance program.",
    icon: AlertCircle,
    range: "48–72h response",
    number: "03",
  },
  {
    id: "general",
    title: "General Estimate",
    description: "Not sure which category? Start here for a general project assessment.",
    icon: Calculator,
    range: "All projects",
    number: "04",
  },
];

const scopeOptions = [
  { id: "building_envelope", label: "Building Envelope Restoration" },
  { id: "facade_restoration", label: "Façade Remediation" },
  { id: "parking_garage", label: "Parking Garage Restoration" },
  { id: "waterproofing", label: "Waterproofing & Sealants" },
  { id: "eifs_stucco", label: "EIFS / Stucco Systems" },
  { id: "metal_cladding", label: "Metal Cladding" },
  { id: "painting", label: "Painting / Coatings" },
];

const EstimatorStep0 = ({ data, onChange }: EstimatorStep0Props) => {
  const handleScopeToggle = (scopeId: string) => {
    const currentScopes = data.scopeCategories || [];
    const newScopes = currentScopes.includes(scopeId)
      ? currentScopes.filter((s) => s !== scopeId)
      : [...currentScopes, scopeId];
    onChange("scopeCategories", newScopes);
  };

  return (
    <div className="space-y-10">
      {/* Header — left-aligned, editorial style */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">What type of quote do you need?</h2>
        <p className="text-muted-foreground text-sm">
          No obligation — estimates provided within 24 hours
        </p>
      </div>

      {/* Quote Type Cards — vertical layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {quoteTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = data.quoteType === type.id;

          return (
            <Card
              key={type.id}
              className={`relative p-6 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "border-l-4 border-l-primary border-t border-r border-b border-border shadow-[var(--shadow-card-elevated)]"
                  : "border border-border hover:border-primary/30 hover:shadow-[var(--shadow-card-hover)]"
              }`}
              onClick={() => onChange("quoteType", type.id)}
            >
              {/* Number indicator */}
              <span className="absolute top-4 right-4 text-xs font-medium text-muted-foreground/50 tracking-wider">
                {type.number}
              </span>

              {/* Selected checkmark */}
              {isSelected && (
                <div className="absolute top-4 right-12 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}

              <div className="flex flex-col items-start gap-4">
                {/* Icon container */}
                <div
                  className={`w-12 h-12 rounded-[var(--radius)] flex items-center justify-center transition-colors ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                {/* Text content */}
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-1">{type.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {type.description}
                  </p>
                  <Badge variant={isSelected ? "default" : "outline"} className="text-xs">
                    {type.range}
                  </Badge>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Project Details Section */}
      {data.quoteType && (
        <>
          <div className="border-t border-border" />

          <Card className="p-6 border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-[var(--radius)] bg-muted flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Project Details</h3>
                <p className="text-sm text-muted-foreground">Helps us prioritize your request</p>
              </div>
            </div>

            <div className="grid gap-6">
              {/* Row 1: Company + Role */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-medium">
                    Company Name <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="company"
                    type="text"
                    placeholder="Your company or organization"
                    value={data.company}
                    onChange={(e) => onChange("company", e.target.value)}
                    maxLength={100}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium">
                    Your Role <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Select value={data.role} onValueChange={(value) => onChange("role", value)}>
                    <SelectTrigger id="role" className="bg-background">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Building Owner</SelectItem>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="gc">General Contractor</SelectItem>
                      <SelectItem value="pm">Property Manager</SelectItem>
                      <SelectItem value="homeowner">Homeowner</SelectItem>
                      <SelectItem value="consultant">Consultant / Engineer</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 2: Budget */}
              <div className="space-y-2">
                <Label htmlFor="nteBudget" className="text-sm font-medium">
                  Estimated Budget Range <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Select value={data.nteBudget} onValueChange={(value) => onChange("nteBudget", value)}>
                  <SelectTrigger id="nteBudget" className="bg-background">
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under_25k">Under $25k</SelectItem>
                    <SelectItem value="25k_50k">$25k - $50k</SelectItem>
                    <SelectItem value="50k_100k">$50k - $100k</SelectItem>
                    <SelectItem value="100k_250k">$100k - $250k</SelectItem>
                    <SelectItem value="250k_500k">$250k - $500k</SelectItem>
                    <SelectItem value="500k_plus">$500k+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Project Scope */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Project Scope <span className="text-muted-foreground">(select all that apply)</span>
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {scopeOptions.map((scope) => (
                    <div key={scope.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={scope.id}
                        checked={data.scopeCategories?.includes(scope.id) || false}
                        onCheckedChange={() => handleScopeToggle(scope.id)}
                      />
                      <label
                        htmlFor={scope.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {scope.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default EstimatorStep0;
