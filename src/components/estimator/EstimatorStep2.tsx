import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Step2Props {
  data: {
    prepComplexity: string;
    finishQuality: string;
    region: string;
  };
  onChange: (field: string, value: string) => void;
}

const EstimatorStep2 = ({ data, onChange }: Step2Props) => {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="prepComplexity" className="text-lg font-semibold mb-2 block">
          Surface Preparation Required *
        </Label>
        <Select
          value={data.prepComplexity}
          onValueChange={(value) => onChange("prepComplexity", value)}
        >
          <SelectTrigger id="prepComplexity" className="h-12">
            <SelectValue placeholder="Select prep complexity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Minimal / None</SelectItem>
            <SelectItem value="standard">Standard Prep</SelectItem>
            <SelectItem value="heavy">Heavy Prep (cracks, peeling)</SelectItem>
            <SelectItem value="structural_repair_required">Structural Repair Required</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground mt-1">
          Level of surface preparation needed before application
        </p>
      </div>

      <div>
        <Label htmlFor="finishQuality" className="text-lg font-semibold mb-2 block">
          Finish Quality *
        </Label>
        <Select
          value={data.finishQuality}
          onValueChange={(value) => onChange("finishQuality", value)}
        >
          <SelectTrigger id="finishQuality" className="h-12">
            <SelectValue placeholder="Select finish quality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="luxury">Luxury</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground mt-1">
          Material and coating quality level
        </p>
      </div>

      <div>
        <Label htmlFor="region" className="text-lg font-semibold mb-2 block">
          Location Type *
        </Label>
        <Select value={data.region} onValueChange={(value) => onChange("region", value)}>
          <SelectTrigger id="region" className="h-12">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gta_default">GTA Standard</SelectItem>
            <SelectItem value="inner_city">Inner City Toronto</SelectItem>
            <SelectItem value="suburban">Suburban</SelectItem>
            <SelectItem value="rural">Rural</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default EstimatorStep2;
