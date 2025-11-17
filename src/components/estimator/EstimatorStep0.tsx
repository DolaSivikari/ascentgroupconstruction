import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DollarSign, Wrench, AlertCircle, Calculator } from "lucide-react";

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
    color: "bg-primary/10 border-primary hover:border-primary/50",
  },
  {
    id: "trade_package",
    title: "Trade Package for GC",
    description: "You're the GC? We'll provide unit rates for EIFS, sealants, painting, and coatings.",
    icon: Wrench,
    range: "Fast turnaround",
    color: "bg-secondary/10 border-secondary hover:border-secondary/50",
  },
  {
    id: "emergency",
    title: "Emergency/Maintenance",
    description: "Urgent leak repair, emergency sealant work, or after-hours maintenance program.",
    icon: AlertCircle,
    range: "48–72h response",
    color: "bg-destructive/10 border-destructive hover:border-destructive/50",
  },
  {
    id: "general",
    title: "General Estimate",
    description: "Not sure which category? Start here for a general project assessment.",
    icon: Calculator,
    range: "All projects",
    color: "bg-muted border-border hover:border-primary/30",
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
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">What type of quote do you need?</h2>
        <p className="text-muted-foreground">
          Select the option that best describes your project requirements
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quoteTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = data.quoteType === type.id;

          return (
            <Card
              key={type.id}
              className={`p-6 cursor-pointer transition-all ${type.color} ${
                isSelected ? "ring-2 ring-primary shadow-lg" : ""
              }`}
              onClick={() => onChange("quoteType", type.id)}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${isSelected ? "bg-primary text-primary-foreground" : "bg-background"}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{type.title}</h3>
                    <Badge variant={isSelected ? "default" : "outline"}>
                      {type.range}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Additional Fields for Lead Scoring */}
      {data.quoteType && (
        <Card className="p-6 border-2 border-primary/20 bg-muted/30">
          <h3 className="text-lg font-semibold mb-4">Project Details (helps us prioritize your request)</h3>
          
          <div className="grid gap-6">
            {/* Company Name */}
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

            {/* Role */}
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
                  <SelectItem value="gc">Building Owner</SelectItem>
                  <SelectItem value="pm">Property Manager</SelectItem>
                  <SelectItem value="consultant">Consultant / Engineer</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Estimated Budget */}
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
      )}
    </div>
  );
};

export default EstimatorStep0;