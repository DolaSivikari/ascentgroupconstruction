import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ServiceMultiSelect } from "@/components/admin/ServiceMultiSelect";
import { ProcessStepsEditor, ProcessStep } from "@/components/admin/ProcessStepsEditor";

interface ServicesTabProps {
  formData: any;
  onFormChange: (updates: any) => void;
}

export const ServicesTab = ({ formData, onFormChange }: ServicesTabProps) => {
  return (
    <div className="space-y-6">
      {/* Services Multi-Select */}
      <div className="space-y-2">
        <Label>Services Provided</Label>
        <ServiceMultiSelect
          selectedServiceIds={formData.service_ids}
          onChange={(ids: string[]) => onFormChange({ service_ids: ids })}
        />
        <p className="text-sm text-muted-foreground">
          Select all services that were part of this project
        </p>
      </div>

      {/* Scope of Work */}
      <div className="space-y-2">
        <Label htmlFor="scope_of_work">Scope of Work</Label>
        <Textarea
          id="scope_of_work"
          value={formData.scope_of_work}
          onChange={(e) => onFormChange({ scope_of_work: e.target.value })}
          placeholder="Detailed description of work performed..."
          rows={8}
        />
        <p className="text-sm text-muted-foreground">
          Comprehensive overview of all work completed on this project
        </p>
      </div>

      {/* Process Steps */}
      <div className="space-y-2">
        <Label>Process Steps</Label>
        <ProcessStepsEditor
          steps={formData.content_blocks || []}
          onChange={(steps: ProcessStep[]) => onFormChange({ content_blocks: steps })}
        />
        <p className="text-sm text-muted-foreground">
          Add key phases or milestones of the project
        </p>
      </div>

      {/* Process Notes */}
      <div className="space-y-2">
        <Label htmlFor="process_notes">Process Notes</Label>
        <Textarea
          id="process_notes"
          value={formData.process_notes}
          onChange={(e) => onFormChange({ process_notes: e.target.value })}
          placeholder="Additional notes about the construction process..."
          rows={4}
        />
      </div>
    </div>
  );
};
