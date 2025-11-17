import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface Step1Props {
  data: {
    service: string;
    sqft: string;
    stories: string;
  };
  onChange: (field: string, value: string) => void;
}

const EstimatorStep1 = ({ data, onChange }: Step1Props) => {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="service" className="text-lg font-semibold mb-2 block">
          Project Type *
        </Label>
        <Select value={data.service} onValueChange={(value) => onChange("service", value)}>
          <SelectTrigger id="service" className="h-12">
            <SelectValue placeholder="Select project type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Painting Services (Instant Estimate)</SelectLabel>
              <SelectItem value="commercial_painting">Commercial Painting</SelectItem>
              <SelectItem value="condo_multi_unit_painting">Condo / Multi-Unit Painting</SelectItem>
              <SelectItem value="residential_painting">Residential Painting</SelectItem>
            </SelectGroup>
            
            <SelectGroup>
              <SelectLabel>Exterior Services (Instant Estimate)</SelectLabel>
              <SelectItem value="exterior_siding_cladding">Exterior Siding & Cladding</SelectItem>
              <SelectItem value="stucco_eifs">Stucco / EIFS</SelectItem>
              <SelectItem value="drywall_interior_finishing">Drywall & Interior Finishing</SelectItem>
            </SelectGroup>
            
            <SelectGroup>
              <SelectLabel>Construction Services (Quote Required)</SelectLabel>
              <SelectItem value="commercial_construction">Commercial Construction</SelectItem>
              <SelectItem value="multi_family_construction">Multi-Family Construction</SelectItem>
              <SelectItem value="institutional_construction">Institutional Construction</SelectItem>
            </SelectGroup>
            
            <SelectGroup>
              <SelectLabel>Specialty Services (Quote Required)</SelectLabel>
              <SelectItem value="masonry">Masonry</SelectItem>
              <SelectItem value="roofing">Roofing Services</SelectItem>
              <SelectItem value="metal_cladding">Metal Cladding & Panels</SelectItem>
              <SelectItem value="waterproofing">Waterproofing & Restoration</SelectItem>
              <SelectItem value="sealants">Sealants & Caulking</SelectItem>
              <SelectItem value="parking_garage">Parking Garage Coating</SelectItem>
              <SelectItem value="windows_doors">Window & Door Installation</SelectItem>
            </SelectGroup>
            
            
            <SelectGroup>
              <SelectLabel>Additional Services (Quote Required)</SelectLabel>
              <SelectItem value="suite_buildouts">Suite Buildouts</SelectItem>
              <SelectItem value="tile_flooring">Tile & Flooring</SelectItem>
              <SelectItem value="sustainable_building">Sustainable Building</SelectItem>
              <SelectItem value="general_contracting">General Contracting</SelectItem>
              <SelectItem value="design_build">Design-Build Services</SelectItem>
              <SelectItem value="construction_management">Construction Management</SelectItem>
              <SelectItem value="preconstruction">Preconstruction Services</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="sqft" className="text-lg font-semibold mb-2 block">
          Approximate Square Footage *
        </Label>
        <Input
          id="sqft"
          type="number"
          placeholder="e.g., 1200"
          value={data.sqft}
          onChange={(e) => onChange("sqft", e.target.value)}
          className="h-12"
          min="100"
        />
        <p className="text-sm text-muted-foreground mt-1">
          Exterior wall area or total area to be painted/finished
        </p>
      </div>

      <div>
        <Label htmlFor="stories" className="text-lg font-semibold mb-2 block">
          Number of Stories *
        </Label>
        <Select value={data.stories} onValueChange={(value) => onChange("stories", value)}>
          <SelectTrigger id="stories" className="h-12">
            <SelectValue placeholder="Select number of stories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 Story</SelectItem>
            <SelectItem value="2">2 Stories</SelectItem>
            <SelectItem value="3_plus">3+ Stories</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default EstimatorStep1;
