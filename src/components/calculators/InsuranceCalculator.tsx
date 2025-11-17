import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const InsuranceCalculator = () => {
  const [projectValue, setProjectValue] = useState(500000);
  const [projectType, setProjectType] = useState("commercial");
  const [duration, setDuration] = useState(6);

  const calculateCoverage = () => {
    // Industry standard rates based on project type and complexity
    const baseRate = projectType === "commercial" ? 2.0 : projectType === "residential" ? 1.5 : 2.5;
    const durationMultiplier = duration > 12 ? 1.2 : 1.0; // Longer projects need more coverage
    
    const recommendedCoverage = projectValue * baseRate * durationMultiplier;
    const minimumCoverage = projectValue * 1.5; // Industry minimum
    
    // Ascent Group's actual coverage
    const ourCoverage = 5000000;
    
    return {
      recommended: Math.round(recommendedCoverage),
      minimum: Math.round(minimumCoverage),
      ourCoverage,
      adequate: ourCoverage >= recommendedCoverage
    };
  };

  const coverage = calculateCoverage();

  const formatCurrency = (amount: number) => {
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Insurance Coverage Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Project Value */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Project Value</Label>
            <span className="font-bold text-primary">{formatCurrency(projectValue)}</span>
          </div>
          <Slider
            value={[projectValue]}
            onValueChange={([value]) => setProjectValue(value)}
            min={50000}
            max={15000000}
            step={50000}
          />
        </div>

        {/* Project Type */}
        <div className="space-y-2">
          <Label>Project Type</Label>
          <Select value={projectType} onValueChange={setProjectType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="institutional">Institutional</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Duration */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Project Duration</Label>
            <span className="font-bold">{duration} months</span>
          </div>
          <Slider
            value={[duration]}
            onValueChange={([value]) => setDuration(value)}
            min={1}
            max={24}
            step={1}
          />
        </div>

        {/* Results */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-semibold">Coverage Analysis</h4>
          
          <div className="grid gap-3">
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-sm">Minimum Required</span>
              <span className="font-semibold">{formatCurrency(coverage.minimum)}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-sm">Recommended Coverage</span>
              <span className="font-semibold">{formatCurrency(coverage.recommended)}</span>
            </div>
            
            <div className={cn(
              "flex justify-between items-center p-4 rounded-lg border-2",
              coverage.adequate ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"
            )}>
              <div className="flex items-center gap-2">
                {coverage.adequate ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="font-semibold">Our Coverage</span>
              </div>
              <span className="font-bold text-lg">{formatCurrency(coverage.ourCoverage)}</span>
            </div>
          </div>

          {coverage.adequate && (
            <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary/20">
              <p className="text-sm font-medium text-center">
                ✓ Our $5M liability coverage is adequate for this project
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
