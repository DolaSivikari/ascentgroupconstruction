import { useState, useEffect } from 'react';
import { Button } from '@/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Star, Plus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/ui/Input';
import { Label } from '@/components/ui/label';
import { TableFilters } from '@/hooks/useTableFilters';
import { toast } from 'sonner';

interface FilterPreset {
  id: string;
  name: string;
  filters: TableFilters;
  pageType: string;
}

interface FilterPresetsProps {
  pageType: string;
  currentFilters: TableFilters;
  onApplyPreset: (filters: TableFilters) => void;
  className?: string;
}

export const FilterPresets = ({
  pageType,
  currentFilters,
  onApplyPreset,
  className = '',
}: FilterPresetsProps) => {
  const [presets, setPresets] = useState<FilterPreset[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [presetName, setPresetName] = useState('');

  // Load presets from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`filter-presets-${pageType}`);
    if (saved) {
      try {
        setPresets(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading presets:', error);
      }
    }
  }, [pageType]);

  // Save presets to localStorage whenever they change
  useEffect(() => {
    if (presets.length > 0) {
      localStorage.setItem(`filter-presets-${pageType}`, JSON.stringify(presets));
    }
  }, [presets, pageType]);

  const savePreset = () => {
    if (!presetName.trim()) {
      toast.error('Please enter a preset name');
      return;
    }

    const newPreset: FilterPreset = {
      id: Date.now().toString(),
      name: presetName.trim(),
      filters: currentFilters,
      pageType,
    };

    setPresets([...presets, newPreset]);
    setPresetName('');
    setIsDialogOpen(false);
    toast.success(`Preset "${newPreset.name}" saved`);
  };

  const applyPreset = (preset: FilterPreset) => {
    onApplyPreset(preset.filters);
    toast.success(`Applied preset: ${preset.name}`);
  };

  const deletePreset = (id: string) => {
    const preset = presets.find((p) => p.id === id);
    setPresets(presets.filter((p) => p.id !== id));
    if (preset) {
      toast.success(`Deleted preset: ${preset.name}`);
    }
  };

  const hasActiveFilters =
    currentFilters.search !== '' ||
    currentFilters.dateRange.from !== undefined ||
    currentFilters.dateRange.to !== undefined ||
    currentFilters.status.length > 0 ||
    currentFilters.tags.length > 0 ||
    Object.keys(currentFilters.customFilters).some(
      (key) =>
        currentFilters.customFilters[key] !== undefined &&
        currentFilters.customFilters[key] !== ''
    );

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {presets.length > 0 && (
        <>
          <span className="text-sm text-muted-foreground">Presets:</span>
          <div className="flex items-center gap-2 flex-wrap">
            {presets.map((preset) => (
              <div key={preset.id} className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset(preset)}
                  className="h-8 gap-2"
                >
                  <Star className="h-3 w-3" />
                  {preset.name}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deletePreset(preset.id)}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={!hasActiveFilters}
            className="h-8 gap-2"
          >
            <Plus className="h-4 w-4" />
            Save Preset
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Filter Preset</DialogTitle>
            <DialogDescription>
              Save your current filters for quick access later.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="preset-name">Preset Name</Label>
              <Input
                id="preset-name"
                placeholder="e.g., New Quote Requests"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    savePreset();
                  }
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Current Filters</Label>
              <div className="bg-muted p-3 rounded-lg space-y-2 text-sm">
                {currentFilters.search && (
                  <div className="flex gap-2">
                    <Badge variant="secondary">Search</Badge>
                    <span className="text-muted-foreground">{currentFilters.search}</span>
                  </div>
                )}
                {(currentFilters.dateRange.from || currentFilters.dateRange.to) && (
                  <div className="flex gap-2">
                    <Badge variant="secondary">Date Range</Badge>
                    <span className="text-muted-foreground">
                      {currentFilters.dateRange.from?.toLocaleDateString()} -{' '}
                      {currentFilters.dateRange.to?.toLocaleDateString()}
                    </span>
                  </div>
                )}
                {currentFilters.status.length > 0 && (
                  <div className="flex gap-2">
                    <Badge variant="secondary">Status</Badge>
                    <span className="text-muted-foreground">
                      {currentFilters.status.join(', ')}
                    </span>
                  </div>
                )}
                {currentFilters.tags.length > 0 && (
                  <div className="flex gap-2">
                    <Badge variant="secondary">Tags</Badge>
                    <span className="text-muted-foreground">{currentFilters.tags.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={savePreset}>Save Preset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
