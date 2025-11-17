import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Shield } from "lucide-react";
import { RFPSubmission } from "@/schemas/rfp-validation";

interface RFPStep3TimelineProps {
  form: UseFormReturn<RFPSubmission>;
}

export const RFPStep3Timeline = ({ form }: RFPStep3TimelineProps) => {
  const { register, setValue, watch, formState: { errors } } = form;
  
  const deliveryMethod = watch("delivery_method");
  const bondingRequired = watch("bonding_required");
  const prequalComplete = watch("prequalification_complete");

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <Calendar className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Timeline & Requirements</h2>
            <p className="text-sm text-muted-foreground">Project schedule and delivery preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="estimated_timeline" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Estimated Timeline *
            </Label>
            <Input
              id="estimated_timeline"
              {...register("estimated_timeline")}
              placeholder="e.g., 6 months, 12-18 months"
              className={errors.estimated_timeline ? "border-destructive" : ""}
            />
            {errors.estimated_timeline && (
              <p className="text-sm text-destructive">{errors.estimated_timeline.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="project_start_date">
              Target Start Date
            </Label>
            <Input
              id="project_start_date"
              type="date"
              {...register("project_start_date")}
              className={errors.project_start_date ? "border-destructive" : ""}
            />
            {errors.project_start_date && (
              <p className="text-sm text-destructive">{errors.project_start_date.message}</p>
            )}
            <p className="text-xs text-muted-foreground">Optional - if known</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="delivery_method">
            Preferred Delivery Method *
          </Label>
          <Select 
            value={deliveryMethod} 
            onValueChange={(value) => setValue("delivery_method", value as any)}
          >
            <SelectTrigger className={errors.delivery_method ? "border-destructive" : ""}>
              <SelectValue placeholder="Select delivery method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Specialty Contracting">Specialty Contracting</SelectItem>
              <SelectItem value="Design-Assist">Design-Assist</SelectItem>
              <SelectItem value="Multi-Trade Integration">Multi-Trade Integration</SelectItem>
              <SelectItem value="To Be Determined">To Be Determined</SelectItem>
            </SelectContent>
          </Select>
          {errors.delivery_method && (
            <p className="text-sm text-destructive">{errors.delivery_method.message}</p>
          )}
        </div>

        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-start gap-3">
            <Checkbox 
              id="bonding_required"
              checked={bondingRequired}
              onCheckedChange={(checked) => setValue("bonding_required", checked as boolean)}
            />
            <div className="flex-1">
              <Label 
                htmlFor="bonding_required" 
                className="text-base font-medium cursor-pointer flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Bonding Required
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Performance and payment bonds will be required for this project
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox 
              id="prequalification_complete"
              checked={prequalComplete}
              onCheckedChange={(checked) => setValue("prequalification_complete", checked as boolean)}
            />
            <div className="flex-1">
              <Label 
                htmlFor="prequalification_complete" 
                className="text-base font-medium cursor-pointer"
              >
                Pre-qualification Completed
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Check if you've already downloaded and reviewed our pre-qualification package
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
