import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Badge } from "@/components/ui/badge";
import { Search, X, Building2, Home, School, Factory, Grid3x3, List, Filter, DollarSign, CheckCircle2, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedYear: string;
  onYearChange: (year: string) => void;
  categories: Array<{ label: string; value: string; icon: any }>;
  years: string[];
  projectCount: number;
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
  // Advanced filters
  selectedDeliveryMethod?: string;
  onDeliveryMethodChange?: (method: string) => void;
  selectedClientType?: string;
  onClientTypeChange?: (type: string) => void;
  selectedValueRange?: string;
  onValueRangeChange?: (range: string) => void;
  performanceBadges?: {
    onTime: boolean;
    onBudget: boolean;
    zeroIncidents: boolean;
  };
  onPerformanceBadgesChange?: (badges: { onTime: boolean; onBudget: boolean; zeroIncidents: boolean }) => void;
}

const FilterBar = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedYear,
  onYearChange,
  categories,
  years,
  projectCount,
  viewMode = "grid",
  onViewModeChange,
  selectedDeliveryMethod = "All",
  onDeliveryMethodChange,
  selectedClientType = "All",
  onClientTypeChange,
  selectedValueRange = "All",
  onValueRangeChange,
  performanceBadges = { onTime: false, onBudget: false, zeroIncidents: false },
  onPerformanceBadgesChange,
}: FilterBarProps) => {
  const activeFiltersCount = [
    selectedCategory !== "All",
    selectedYear !== "All",
    searchTerm !== "",
    selectedDeliveryMethod !== "All",
    selectedClientType !== "All",
    selectedValueRange !== "All",
    performanceBadges.onTime,
    performanceBadges.onBudget,
    performanceBadges.zeroIncidents,
  ].filter(Boolean).length;

  const clearFilters = () => {
    onSearchChange("");
    onCategoryChange("All");
    onYearChange("All");
    onDeliveryMethodChange?.("All");
    onClientTypeChange?.("All");
    onValueRangeChange?.("All");
    onPerformanceBadgesChange?.({ onTime: false, onBudget: false, zeroIncidents: false });
  };

  return (
    <div className="sticky top-20 z-30 bg-background/95 backdrop-blur-lg border-b shadow-sm">
      <div className="container mx-auto px-4 py-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="Search projects by name, location, or description..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-12 text-base"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Button
                key={cat.value}
                variant={selectedCategory === cat.value ? "default" : "outline"}
                onClick={() => onCategoryChange(cat.value)}
                className={cn(
                  "rounded-full transition-all",
                  selectedCategory === cat.value && "shadow-lg"
                )}
              >
                <Icon className="w-4 h-4 mr-2" />
                {cat.label}
              </Button>
            );
          })}
        </div>

        {/* Year Filter and Advanced Filters */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex flex-wrap gap-2">
            {years.map((year) => (
              <Button
                key={year}
                variant={selectedYear === year ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onYearChange(year)}
                className="rounded-full"
              >
                {year}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Delivery Method Filter */}
            {onDeliveryMethodChange && (
              <Select value={selectedDeliveryMethod} onValueChange={onDeliveryMethodChange}>
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder="Delivery Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Methods</SelectItem>
                  <SelectItem value="Specialty Contracting">Specialty Contracting</SelectItem>
                  <SelectItem value="Design-Assist">Design-Assist</SelectItem>
                  <SelectItem value="Multi-Trade Integration">Multi-Trade Integration</SelectItem>
                </SelectContent>
              </Select>
            )}

            {/* Client Type Filter */}
            {onClientTypeChange && (
              <Select value={selectedClientType} onValueChange={onClientTypeChange}>
                <SelectTrigger className="w-[160px] h-9">
                  <SelectValue placeholder="Client Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Clients</SelectItem>
                  <SelectItem value="Developer">Developer</SelectItem>
                  <SelectItem value="Property Manager">Property Manager</SelectItem>
                  <SelectItem value="Owner Direct">Owner Direct</SelectItem>
                  <SelectItem value="Building Owner">Building Owner</SelectItem>
                  <SelectItem value="Government">Government</SelectItem>
                </SelectContent>
              </Select>
            )}

            {/* Project Value Range Filter */}
            {onValueRangeChange && (
              <Select value={selectedValueRange} onValueChange={onValueRangeChange}>
                <SelectTrigger className="w-[160px] h-9">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Project Value" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Values</SelectItem>
                  <SelectItem value="0-500000">Under $500K</SelectItem>
                  <SelectItem value="500000-1000000">$500K - $1M</SelectItem>
                  <SelectItem value="1000000-2500000">$1M - $2.5M</SelectItem>
                  <SelectItem value="2500000-5000000">$2.5M - $5M</SelectItem>
                  <SelectItem value="5000000+">$5M+</SelectItem>
                </SelectContent>
              </Select>
            )}

            {/* Performance Badges Filter */}
            {onPerformanceBadgesChange && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={cn(
                      "h-9",
                      (performanceBadges.onTime || performanceBadges.onBudget || performanceBadges.zeroIncidents) && "border-primary"
                    )}
                  >
                    <Award className="w-4 h-4 mr-2" />
                    Performance
                    {(performanceBadges.onTime || performanceBadges.onBudget || performanceBadges.zeroIncidents) && (
                      <Badge variant="primary" size="xs" className="ml-2">
                        {[performanceBadges.onTime, performanceBadges.onBudget, performanceBadges.zeroIncidents].filter(Boolean).length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm">Performance Badges</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="onTime"
                          checked={performanceBadges.onTime}
                          onCheckedChange={(checked) =>
                            onPerformanceBadgesChange({
                              ...performanceBadges,
                              onTime: checked as boolean,
                            })
                          }
                        />
                        <label
                          htmlFor="onTime"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            On-Time Completion
                          </div>
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="onBudget"
                          checked={performanceBadges.onBudget}
                          onCheckedChange={(checked) =>
                            onPerformanceBadgesChange({
                              ...performanceBadges,
                              onBudget: checked as boolean,
                            })
                          }
                        />
                        <label
                          htmlFor="onBudget"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-blue-600" />
                            On-Budget
                          </div>
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="zeroIncidents"
                          checked={performanceBadges.zeroIncidents}
                          onCheckedChange={(checked) =>
                            onPerformanceBadgesChange({
                              ...performanceBadges,
                              zeroIncidents: checked as boolean,
                            })
                          }
                        />
                        <label
                          htmlFor="zeroIncidents"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-700" />
                            Zero Safety Incidents
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {onViewModeChange && (
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onViewModeChange("grid")}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onViewModeChange("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Active Filters and Results Count */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {projectCount} {projectCount === 1 ? "project" : "projects"} found
            </span>
            {activeFiltersCount > 0 && (
              <Badge variant="info" size="sm">
                {activeFiltersCount} {activeFiltersCount === 1 ? "filter" : "filters"} active
              </Badge>
            )}
          </div>
          
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
