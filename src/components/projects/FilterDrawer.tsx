import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal, X, Save, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterPreset {
  name: string;
  filters: any;
}

interface FilterDrawerProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
  onClose?: () => void;
}

export const FilterDrawer = ({ filters, onFiltersChange, onClose }: FilterDrawerProps) => {
  const [presets, setPresets] = useState<FilterPreset[]>([
    { name: "High Value Projects", filters: { minValue: 1000000, onBudget: true } },
    { name: "Recent Completions", filters: { year: "2024", onTime: true } },
    { name: "Commercial Only", filters: { category: "Commercial", clientType: "Commercial" } }
  ]);
  const [presetName, setPresetName] = useState("");
  const [showPresetInput, setShowPresetInput] = useState(false);

  const savePreset = () => {
    if (presetName.trim()) {
      setPresets([...presets, { name: presetName, filters: { ...filters } }]);
      setPresetName("");
      setShowPresetInput(false);
    }
  };

  const loadPreset = (preset: FilterPreset) => {
    onFiltersChange({ ...filters, ...preset.filters });
  };

  const deletePreset = (index: number) => {
    setPresets(presets.filter((_, i) => i !== index));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          Advanced Filters
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Filter Projects</span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                onFiltersChange({});
                onClose?.();
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Saved Presets */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="font-semibold">Saved Filters</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPresetInput(!showPresetInput)}
              >
                <Save className="w-4 h-4" />
              </Button>
            </div>
            
            {showPresetInput && (
              <div className="flex gap-2 animate-fade-in">
                <input
                  type="text"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  placeholder="Preset name..."
                  className="flex-1 px-3 py-2 text-sm border rounded-lg"
                />
                <Button size="sm" onClick={savePreset}>
                  Save
                </Button>
              </div>
            )}

            <div className="space-y-2">
              {presets.map((preset, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/70 transition-colors"
                >
                  <button
                    onClick={() => loadPreset(preset)}
                    className="flex-1 text-left text-sm font-medium"
                  >
                    {preset.name}
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deletePreset(index)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Range */}
          <div className="space-y-3">
            <Label className="font-semibold">Budget Range</Label>
            <Slider
              value={[filters.minValue || 0]}
              onValueChange={([value]) => onFiltersChange({ ...filters, minValue: value })}
              min={0}
              max={10000000}
              step={100000}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>$0</span>
              <span className="font-medium text-primary">
                ${((filters.minValue || 0) / 1000000).toFixed(1)}M+
              </span>
              <span>$10M</span>
            </div>
          </div>

          {/* Year Range Slider */}
          <div className="space-y-3">
            <Label className="font-semibold">Completion Year</Label>
            <Slider
              value={[filters.minYear || 2020]}
              onValueChange={([value]) => onFiltersChange({ ...filters, minYear: value })}
              min={2020}
              max={2024}
              step={1}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>2020</span>
              <span className="font-medium text-primary">{filters.minYear || 2020}+</span>
              <span>2024</span>
            </div>
          </div>

          {/* Performance Badges */}
          <div className="space-y-3">
            <Label className="font-semibold">Performance Indicators</Label>
            <div className="space-y-2">
              {[
                { key: "onTime", label: "Completed On Time" },
                { key: "onBudget", label: "Completed On Budget" },
                { key: "zeroIncidents", label: "Zero Safety Incidents" }
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={filters[key] || false}
                    onCheckedChange={(checked) =>
                      onFiltersChange({ ...filters, [key]: checked })
                    }
                  />
                  <Label htmlFor={key} className="cursor-pointer text-sm">
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Apply & Clear Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                onFiltersChange({});
              }}
            >
              Clear All
            </Button>
            <Button className="flex-1" onClick={onClose}>
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
