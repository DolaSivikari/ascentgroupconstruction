import { Label } from "@/components/ui/label";
import { ServiceMultiSelect } from "@/components/admin/ServiceMultiSelect";
import {
  ProcessStepsEditor,
  type ProcessStep,
} from "@/components/admin/ProcessStepsEditor";
import type { ProjectFormData } from "@/lib/admin/projectEditor";
export const ServicesTab = ({
  formData,
  onFormChange,
}: {
  formData: ProjectFormData;
  onFormChange: (updates: Partial<ProjectFormData>) => void;
}) => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Label>Services provided</Label>
      <ServiceMultiSelect
        selectedServiceIds={formData.service_ids}
        onChange={(service_ids) => onFormChange({ service_ids })}
      />
    </div>
    <div className="space-y-2">
      <Label>Process steps</Label>
      <ProcessStepsEditor
        steps={(formData.content_blocks || []) as unknown as ProcessStep[]}
        onChange={(steps) =>
          onFormChange({
            content_blocks:
              steps as unknown as ProjectFormData["content_blocks"],
          })
        }
      />
    </div>
  </div>
);
