import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface Step2EnhancedProps {
  service: string;
  data: {
    prepComplexity: string;
    finishQuality: string;
    region: string;
    // Commercial painting specific
    buildingType?: string;
    accessibility?: string;
    businessHoursConstraint?: string;
    // Condo specific
    unitCount?: string;
    includeCommonAreas?: boolean;
    // Material specific
    materialType?: string;
  };
  onChange: (field: string, value: any) => void;
}

const EstimatorStep2Enhanced = ({ service, data, onChange }: Step2EnhancedProps) => {
  const isCommercialPainting = service === "commercial_painting";
  const isCondoPainting = service === "condo_multi_unit_painting";
  const isSiding = service === "exterior_siding_cladding";
  const isStucco = service === "stucco_eifs";
  const isDrywall = service === "drywall_interior_finishing";
  const isResidential = service === "residential_painting";

  return (
    <div className="space-y-6">
      {/* Standard fields for all services */}
      <div>
        <Label htmlFor="prepComplexity" className="text-lg font-semibold mb-2 block">
          Surface Preparation *
        </Label>
        <Select value={data.prepComplexity} onValueChange={(value) => onChange("prepComplexity", value)}>
          <SelectTrigger id="prepComplexity" className="h-12">
            <SelectValue placeholder="Select prep work needed" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None - New Surface</SelectItem>
            <SelectItem value="standard">Standard - Light Sanding & Cleaning</SelectItem>
            <SelectItem value="heavy">Heavy - Extensive Repairs Needed</SelectItem>
            <SelectItem value="structural_repair_required">Structural Repair Required</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="finishQuality" className="text-lg font-semibold mb-2 block">
          Finish Quality *
        </Label>
        <Select value={data.finishQuality} onValueChange={(value) => onChange("finishQuality", value)}>
          <SelectTrigger id="finishQuality" className="h-12">
            <SelectValue placeholder="Select finish level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard - Builder Grade</SelectItem>
            <SelectItem value="premium">Premium - High Quality</SelectItem>
            <SelectItem value="luxury">Luxury - Top Tier</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Commercial Painting Specific Fields */}
      {isCommercialPainting && (
        <>
          <div>
            <Label htmlFor="buildingType" className="text-lg font-semibold mb-2 block">
              Building Type *
            </Label>
            <Select value={data.buildingType} onValueChange={(value) => onChange("buildingType", value)}>
              <SelectTrigger id="buildingType" className="h-12">
                <SelectValue placeholder="Select building type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="office">Office Building</SelectItem>
                <SelectItem value="retail">Retail Space</SelectItem>
                <SelectItem value="industrial">Industrial / Warehouse</SelectItem>
                <SelectItem value="institutional">Institutional (School, Hospital)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="accessibility" className="text-lg font-semibold mb-2 block">
              Building Height *
            </Label>
            <Select value={data.accessibility} onValueChange={(value) => onChange("accessibility", value)}>
              <SelectTrigger id="accessibility" className="h-12">
                <SelectValue placeholder="Select building height" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ground_floor">Ground Floor / Low-Rise (1-3 stories)</SelectItem>
                <SelectItem value="mid_rise">Mid-Rise (4-8 stories)</SelectItem>
                <SelectItem value="high_rise">High-Rise (9+ stories)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="businessHours" className="text-lg font-semibold mb-2 block">
              Work Schedule Preference *
            </Label>
            <Select value={data.businessHoursConstraint} onValueChange={(value) => onChange("businessHoursConstraint", value)}>
              <SelectTrigger id="businessHours" className="h-12">
                <SelectValue placeholder="Select work schedule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular_hours">Regular Business Hours</SelectItem>
                <SelectItem value="after_hours">After Hours (Evenings)</SelectItem>
                <SelectItem value="weekends_only">Weekends Only</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              After-hours and weekend work incurs additional costs
            </p>
          </div>
        </>
      )}

      {/* Condo/Multi-Unit Specific Fields */}
      {isCondoPainting && (
        <>
          <div>
            <Label htmlFor="unitCount" className="text-lg font-semibold mb-2 block">
              Number of Units *
            </Label>
            <Select value={data.unitCount} onValueChange={(value) => onChange("unitCount", value)}>
              <SelectTrigger id="unitCount" className="h-12">
                <SelectValue placeholder="Select unit count" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1_5">1-5 Units</SelectItem>
                <SelectItem value="6_10">6-10 Units (5% discount)</SelectItem>
                <SelectItem value="11_20">11-20 Units (10% discount)</SelectItem>
                <SelectItem value="21_plus">21+ Units (15% discount)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              Bulk pricing applied for larger projects
            </p>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="commonAreas">Include Common Areas</Label>
              <p className="text-sm text-muted-foreground">
                Hallways, lobbies, stairwells (+15%)
              </p>
            </div>
            <Switch
              id="commonAreas"
              checked={data.includeCommonAreas || false}
              onCheckedChange={(checked) => onChange("includeCommonAreas", checked)}
            />
          </div>
        </>
      )}

      {/* Exterior Siding Specific Fields */}
      {isSiding && (
        <div>
          <Label htmlFor="materialType" className="text-lg font-semibold mb-2 block">
            Siding Material *
          </Label>
          <Select value={data.materialType} onValueChange={(value) => onChange("materialType", value)}>
            <SelectTrigger id="materialType" className="h-12">
              <SelectValue placeholder="Select siding material" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vinyl">Vinyl Siding</SelectItem>
              <SelectItem value="fiber_cement">Fiber Cement (Hardie Board)</SelectItem>
              <SelectItem value="wood">Wood Siding</SelectItem>
              <SelectItem value="metal">Metal Panels</SelectItem>
              <SelectItem value="brick_veneer">Brick Veneer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Region (for all services) */}
      <div>
        <Label htmlFor="region" className="text-lg font-semibold mb-2 block">
          Location Type *
        </Label>
        <Select value={data.region} onValueChange={(value) => onChange("region", value)}>
          <SelectTrigger id="region" className="h-12">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gta_default">GTA Metro (Toronto, Mississauga, Brampton)</SelectItem>
            <SelectItem value="inner_city">Downtown Toronto (+15%)</SelectItem>
            <SelectItem value="suburban">Suburban GTA (-5%)</SelectItem>
            <SelectItem value="rural">Rural / Remote (-15%)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default EstimatorStep2Enhanced;
