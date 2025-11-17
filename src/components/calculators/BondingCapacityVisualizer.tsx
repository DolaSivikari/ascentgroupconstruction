import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Award, TrendingUp, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const BondingCapacityVisualizer = () => {
  const [projectValue, setProjectValue] = useState(1500000);
  
  // Ascent Group's actual single-project bonding capacity
  const maxBonding = 10000000;
  const availableCapacity = Math.max(0, maxBonding - projectValue);
  const utilizationPercent = Math.min(100, (projectValue / maxBonding) * 100);

  const formatCurrency = (amount: number) => {
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  const getUtilizationColor = () => {
    if (utilizationPercent <= 60) return "text-green-600 bg-green-500/10 border-green-500/30";
    if (utilizationPercent <= 85) return "text-yellow-600 bg-yellow-500/10 border-yellow-500/30";
    return "text-red-600 bg-red-500/10 border-red-500/30";
  };

  const getUtilizationStatus = () => {
    if (utilizationPercent <= 60) return "Excellent Capacity Available";
    if (utilizationPercent <= 85) return "Good Capacity Available";
    if (utilizationPercent <= 100) return "Approaching Capacity Limit";
    return "Exceeds Single-Project Limit";
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          Bonding Capacity Visualizer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input */}
        <div className="space-y-2">
          <Label>Your Project Value</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              type="number"
              value={projectValue}
              onChange={(e) => setProjectValue(Number(e.target.value))}
              className="pl-7"
              min={0}
              max={maxBonding}
            />
          </div>
        </div>

        {/* Visual Capacity Bar */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Bonding Utilization</span>
            <span className="font-bold text-primary">{utilizationPercent.toFixed(1)}%</span>
          </div>
          
          <div className="relative h-16 bg-muted rounded-xl overflow-hidden border-2">
            {/* Used Capacity */}
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center transition-all duration-500"
              style={{ width: `${utilizationPercent}%` }}
            >
              {utilizationPercent > 15 && (
                <span className="text-sm font-semibold text-primary-foreground">
                  {formatCurrency(projectValue)}
                </span>
              )}
            </div>
            
            {/* Available Capacity */}
            <div
              className="absolute inset-y-0 right-0 bg-muted/50 flex items-center justify-center"
              style={{ width: `${100 - utilizationPercent}%` }}
            >
              {utilizationPercent < 85 && (
                <span className="text-sm font-medium text-muted-foreground">
                  {formatCurrency(availableCapacity)} Available
                </span>
              )}
            </div>
          </div>

          {/* Labels */}
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$0</span>
            <span className="font-semibold">{formatCurrency(maxBonding)} Max Capacity</span>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-xs text-muted-foreground mb-1">Your Project</p>
            <p className="text-xl font-bold text-primary">{formatCurrency(projectValue)}</p>
          </div>
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-xs text-muted-foreground mb-1">Remaining</p>
            <p className="text-xl font-bold">{formatCurrency(availableCapacity)}</p>
          </div>
        </div>

        {/* Status Message */}
        <div className={cn("p-4 rounded-lg border-2 flex items-center gap-3", getUtilizationColor())}>
          {utilizationPercent <= 100 ? (
            <>
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-semibold">{getUtilizationStatus()}</p>
                <p className="text-sm opacity-90">
                  {utilizationPercent <= 100 
                    ? "We can bond your project with our $10M capacity"
                    : "Your project exceeds our single-project bonding limit"}
                </p>
              </div>
            </>
          ) : (
            <>
              <TrendingUp className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Contact Us</p>
                <p className="text-sm opacity-90">For projects over $10M, we can arrange aggregate bonding</p>
              </div>
            </>
          )}
        </div>

        {/* Additional Info */}
        <div className="space-y-2">
          <div className="p-3 bg-primary/5 rounded-lg text-sm text-muted-foreground text-center">
            <strong className="text-foreground">Single Project Capacity:</strong> $10M | <strong className="text-foreground">Aggregate Capacity:</strong> $30M+ available
          </div>
          <div className="p-3 bg-muted/50 rounded-lg text-xs text-center">
            Bonding provided by A-rated surety companies with 40+ years of partnership
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
