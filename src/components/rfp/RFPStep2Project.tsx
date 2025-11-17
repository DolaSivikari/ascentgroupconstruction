import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, MapPin, DollarSign } from "lucide-react";
import { RFPSubmission } from "@/schemas/rfp-validation";

interface RFPStep2ProjectProps {
  form: UseFormReturn<RFPSubmission>;
}

export const RFPStep2Project = ({ form }: RFPStep2ProjectProps) => {
  const { register, setValue, watch, formState: { errors } } = form;
  
  const projectType = watch("project_type");
  const estimatedValue = watch("estimated_value_range");

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-accent/10">
            <FileText className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Project Details</h2>
            <p className="text-sm text-muted-foreground">Describe your construction project</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="project_name">
              Project Name *
            </Label>
            <Input
              id="project_name"
              {...register("project_name")}
              placeholder="New Office Tower - Phase 2"
              className={errors.project_name ? "border-destructive" : ""}
            />
            {errors.project_name && (
              <p className="text-sm text-destructive">{errors.project_name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="project_type">
                Project Type *
              </Label>
              <Select 
                value={projectType} 
                onValueChange={(value) => setValue("project_type", value as any)}
              >
                <SelectTrigger className={errors.project_type ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Commercial Construction">Commercial Construction</SelectItem>
                  <SelectItem value="Multi-Family Residential">Multi-Family Residential</SelectItem>
                  <SelectItem value="Institutional">Institutional</SelectItem>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                  <SelectItem value="Renovation/Retrofit">Renovation/Retrofit</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.project_type && (
                <p className="text-sm text-destructive">{errors.project_type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimated_value_range" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Estimated Contract Value *
              </Label>
              <Select 
                value={estimatedValue} 
                onValueChange={(value) => setValue("estimated_value_range", value as any)}
              >
                <SelectTrigger className={errors.estimated_value_range ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select value range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Under $500K">Under $500K</SelectItem>
                  <SelectItem value="$500K - $1M">$500K - $1M</SelectItem>
                  <SelectItem value="$1M - $5M">$1M - $5M</SelectItem>
                  <SelectItem value="$5M - $10M">$5M - $10M</SelectItem>
                  <SelectItem value="$10M - $25M">$10M - $25M</SelectItem>
                  <SelectItem value="$25M+">$25M+</SelectItem>
                  <SelectItem value="To Be Determined">To Be Determined</SelectItem>
                </SelectContent>
              </Select>
              {errors.estimated_value_range && (
                <p className="text-sm text-destructive">{errors.estimated_value_range.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="project_location" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Project Location *
            </Label>
            <Input
              id="project_location"
              {...register("project_location")}
              placeholder="123 Main Street, Toronto, ON"
              className={errors.project_location ? "border-destructive" : ""}
            />
            {errors.project_location && (
              <p className="text-sm text-destructive">{errors.project_location.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Include full address if available, or general location/neighborhood
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
