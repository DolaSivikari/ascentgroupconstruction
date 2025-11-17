import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export const ProjectTimelineEstimator = () => {
  const [squareFeet, setSquareFeet] = useState(25000);
  const [projectType, setProjectType] = useState("restoration");
  const [complexity, setComplexity] = useState("medium");
  const [weatherSensitive, setWeatherSensitive] = useState(true);

  const calculateTimeline = () => {
    // Realistic production rates based on Ascent Group's historical data (days per 1000 sq ft)
    const baseRates: Record<string, number> = {
      painting: 1.5,           // Faster with experienced crews
      waterproofing: 2.0,      // Weather-dependent application
      cladding: 4.5,           // Installation + structural work
      masonry: 4.0,            // Detailed craftsmanship
      eifs: 3.0                // Multi-layer application
    };

    const complexityMultipliers: Record<string, number> = {
      low: 0.75,      // Simple, repetitive work
      medium: 1.0,    // Standard complexity
      high: 1.4       // Complex details, access challenges
    };

    // Calculate base timeline
    const baseTime = (squareFeet / 1000) * (baseRates[projectType] || 3);
    const complexityAdjusted = baseTime * (complexityMultipliers[complexity] || 1);
    
    // Add buffers for real-world factors
    const weatherBuffer = weatherSensitive ? complexityAdjusted * 0.20 : 0; // 20% for weather
    const contingencyBuffer = complexityAdjusted * 0.15; // 15% general contingency

    return {
      minimum: Math.ceil(complexityAdjusted * 0.80),        // Best case (20% faster)
      typical: Math.ceil(complexityAdjusted),               // Expected timeline
      maximum: Math.ceil(complexityAdjusted + weatherBuffer + contingencyBuffer), // With delays
      weatherBuffer: Math.ceil(weatherBuffer),
      productionRate: Math.round(squareFeet / complexityAdjusted)
    };
  };

  const timeline = calculateTimeline();

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Project Timeline Estimator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Square Footage */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Project Size (sq ft)</Label>
            <span className="font-bold">{squareFeet.toLocaleString()}</span>
          </div>
          <Slider
            value={[squareFeet]}
            onValueChange={([value]) => setSquareFeet(value)}
            min={5000}
            max={200000}
            step={5000}
          />
        </div>

        {/* Project Type */}
        <div className="space-y-2">
          <Label>Service Type</Label>
          <Select value={projectType} onValueChange={setProjectType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="painting">Painting & Coating</SelectItem>
              <SelectItem value="waterproofing">Waterproofing</SelectItem>
              <SelectItem value="cladding">Exterior Cladding</SelectItem>
              <SelectItem value="masonry">Masonry Work</SelectItem>
              <SelectItem value="eifs">EIFS/Stucco</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Complexity */}
        <div className="space-y-2">
          <Label>Project Complexity</Label>
          <Select value={complexity} onValueChange={setComplexity}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low - Standard application</SelectItem>
              <SelectItem value="medium">Medium - Some complexity</SelectItem>
              <SelectItem value="high">High - Complex details</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Weather Sensitive Toggle */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium">Weather-Dependent Work</span>
          </div>
          <button
            onClick={() => setWeatherSensitive(!weatherSensitive)}
            className={cn(
              "w-12 h-6 rounded-full transition-colors relative",
              weatherSensitive ? "bg-primary" : "bg-muted-foreground/30"
            )}
          >
            <div
              className={cn(
                "absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform",
                weatherSensitive ? "translate-x-6" : "translate-x-0.5"
              )}
            />
          </button>
        </div>

        {/* Timeline Results */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Estimated Timeline
          </h4>

          {/* Timeline Bar */}
          <div className="relative h-24 bg-muted rounded-xl overflow-hidden border-2">
            {/* Minimum */}
            <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-green-500/20 border-r-2 border-green-500/30 flex flex-col items-center justify-center">
              <p className="text-xs text-muted-foreground">Best Case</p>
              <p className="text-lg font-bold text-green-700">{timeline.minimum}d</p>
            </div>
            
            {/* Typical */}
            <div className="absolute left-1/3 top-0 bottom-0 w-1/3 bg-primary/20 border-r-2 border-primary/30 flex flex-col items-center justify-center">
              <p className="text-xs text-muted-foreground">Typical</p>
              <p className="text-lg font-bold text-primary">{timeline.typical}d</p>
            </div>
            
            {/* Maximum */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-yellow-500/20 flex flex-col items-center justify-center">
              <p className="text-xs text-muted-foreground">With Delays</p>
              <p className="text-lg font-bold text-yellow-700">{timeline.maximum}d</p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between p-2 bg-muted/50 rounded">
              <span className="text-muted-foreground">Average Production Rate</span>
              <span className="font-semibold">{timeline.productionRate.toLocaleString()} sq ft/day</span>
            </div>
            {weatherSensitive && (
              <div className="flex justify-between p-2 bg-yellow-500/10 rounded border border-yellow-500/20">
                <span className="text-muted-foreground">Weather Buffer</span>
                <span className="font-semibold text-yellow-700">+{timeline.weatherBuffer} days</span>
              </div>
            )}
          </div>

          {/* Recommendation */}
          <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary/20">
            <p className="text-sm font-medium text-center">
              We recommend planning for <strong>{timeline.typical} working days</strong> for this project
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
