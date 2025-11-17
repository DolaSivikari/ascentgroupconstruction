import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/ui/Input";
import { Label } from "@/components/ui/label";
import { Button } from "@/ui/Button";
import { Badge } from "@/components/ui/badge";

const PaintCalculator = () => {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [coats, setCoats] = useState("2");
  const [result, setResult] = useState<number | null>(null);

  const calculatePaint = () => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const h = parseFloat(height);
    const c = parseInt(coats);

    if (!l || !w || !h || !c) return;

    // Calculate wall area (4 walls)
    const wallArea = 2 * (l * h) + 2 * (w * h);
    
    // Typical coverage: 350 sq ft per gallon
    const gallonsNeeded = (wallArea * c) / 350;
    
    setResult(Math.ceil(gallonsNeeded));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Paint Coverage Calculator
          <Badge variant="info" size="sm">Free Tool</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="length">Room Length (ft)</Label>
            <Input
              id="length"
              type="number"
              placeholder="12"
              value={length}
              onChange={(e) => setLength(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="width">Room Width (ft)</Label>
            <Input
              id="width"
              type="number"
              placeholder="10"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="height">Wall Height (ft)</Label>
            <Input
              id="height"
              type="number"
              placeholder="8"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="coats">Number of Coats</Label>
            <Input
              id="coats"
              type="number"
              min="1"
              max="3"
              value={coats}
              onChange={(e) => setCoats(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={calculatePaint} className="w-full">
          Calculate Paint Needed
        </Button>

        {result !== null && (
          <div className="p-4 bg-primary/10 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-1">You'll need approximately:</p>
            <p className="text-3xl font-bold text-primary">
              {result} {result === 1 ? "Gallon" : "Gallons"}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Based on 350 sq ft coverage per gallon
            </p>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          * This calculator provides estimates. Actual coverage may vary based on surface texture,
          porosity, and application method.
        </p>
      </CardContent>
    </Card>
  );
};

export default PaintCalculator;
