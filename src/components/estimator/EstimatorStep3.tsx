import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Step3Props {
  data: {
    scaffolding: string;
    colorConsultation: boolean;
    rushScheduling: boolean;
    warrantyExtension: boolean;
    siteCleanup: boolean;
  };
  sqft: number;
  onChange: (field: string, value: any) => void;
}

const EstimatorStep3 = ({ data, sqft, onChange }: Step3Props) => {
  const needsScaffolding = sqft > 400;

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-semibold mb-3 block">Add-Ons & Services</Label>
        <p className="text-muted-foreground mb-4">Select any additional services you need</p>
      </div>

      {needsScaffolding && (
        <div>
          <Label htmlFor="scaffolding" className="text-base font-medium mb-2 block">
            Scaffolding Required
          </Label>
          <Select
            value={data.scaffolding}
            onValueChange={(value) => onChange("scaffolding", value)}
          >
            <SelectTrigger id="scaffolding" className="h-12">
              <SelectValue placeholder="Select scaffolding level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low Level ($400-$800)</SelectItem>
              <SelectItem value="mid">Mid Level ($800-$1,200)</SelectItem>
              <SelectItem value="high">High Level ($1,200-$2,500)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground mt-1">
            Recommended for projects over 400 sq ft
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
          <Checkbox
            id="colorConsultation"
            checked={data.colorConsultation}
            onCheckedChange={(checked) => onChange("colorConsultation", checked)}
          />
          <div className="flex-1">
            <Label
              htmlFor="colorConsultation"
              className="text-base font-medium cursor-pointer"
            >
              Color Consultation
            </Label>
            <p className="text-sm text-muted-foreground">
              Professional color selection guidance (Free with full job, $0-$150 standalone)
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
          <Checkbox
            id="rushScheduling"
            checked={data.rushScheduling}
            onCheckedChange={(checked) => onChange("rushScheduling", checked)}
          />
          <div className="flex-1">
            <Label htmlFor="rushScheduling" className="text-base font-medium cursor-pointer">
              Rush Scheduling
            </Label>
            <p className="text-sm text-muted-foreground">
              Expedited project start (10-35% premium)
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
          <Checkbox
            id="warrantyExtension"
            checked={data.warrantyExtension}
            onCheckedChange={(checked) => onChange("warrantyExtension", checked)}
          />
          <div className="flex-1">
            <Label htmlFor="warrantyExtension" className="text-base font-medium cursor-pointer">
              Extended Warranty
            </Label>
            <p className="text-sm text-muted-foreground">
              Additional coverage beyond standard warranty ($200-$800)
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
          <Checkbox
            id="siteCleanup"
            checked={data.siteCleanup}
            onCheckedChange={(checked) => onChange("siteCleanup", checked)}
          />
          <div className="flex-1">
            <Label htmlFor="siteCleanup" className="text-base font-medium cursor-pointer">
              Premium Site Cleanup
            </Label>
            <p className="text-sm text-muted-foreground">
              Thorough cleaning and debris removal ($100-$400)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstimatorStep3;
