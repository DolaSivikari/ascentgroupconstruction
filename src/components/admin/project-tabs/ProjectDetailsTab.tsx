import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProjectDetailsTabProps {
  formData: any;
  onFormChange: (updates: any) => void;
}

export const ProjectDetailsTab = ({ formData, onFormChange }: ProjectDetailsTabProps) => {
  return (
    <div className="space-y-6">
      {/* Project Size, Duration, Year */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="project_size">Project Size</Label>
          <Input
            id="project_size"
            value={formData.project_size}
            onChange={(e) => onFormChange({ project_size: e.target.value })}
            placeholder="e.g., 50,000 sq ft"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={(e) => onFormChange({ duration: e.target.value })}
            placeholder="e.g., 18 months"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="year">Completion Year</Label>
          <Input
            id="year"
            value={formData.year}
            onChange={(e) => onFormChange({ year: e.target.value })}
            placeholder="e.g., 2024"
          />
        </div>
      </div>

      {/* Budget Range */}
      <div className="space-y-2">
        <Label htmlFor="budget_range">Budget Range</Label>
        <Select
          value={formData.budget_range}
          onValueChange={(value) => onFormChange({ budget_range: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select budget range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Under $500K">Under $500K</SelectItem>
            <SelectItem value="$500K - $1M">$500K - $1M</SelectItem>
            <SelectItem value="$1M - $5M">$1M - $5M</SelectItem>
            <SelectItem value="$5M - $10M">$5M - $10M</SelectItem>
            <SelectItem value="$10M - $20M">$10M - $20M</SelectItem>
            <SelectItem value="Over $20M">Over $20M</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Start & Completion Dates */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            id="start_date"
            type="date"
            value={formData.start_date}
            onChange={(e) => onFormChange({ start_date: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="completion_date">Completion Date</Label>
          <Input
            id="completion_date"
            type="date"
            value={formData.completion_date}
            onChange={(e) => onFormChange({ completion_date: e.target.value })}
          />
        </div>
      </div>

      {/* Delivery Method & Client Type */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="delivery_method">Delivery Method</Label>
          <Select
            value={formData.delivery_method}
            onValueChange={(value) => onFormChange({ delivery_method: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="General Contracting">General Contracting</SelectItem>
              <SelectItem value="Construction Management">Construction Management</SelectItem>
              <SelectItem value="Design-Build">Design-Build</SelectItem>
              <SelectItem value="CM at Risk">CM at Risk</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="client_type">Client Type</Label>
          <Select
            value={formData.client_type}
            onValueChange={(value) => onFormChange({ client_type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Developer">Developer</SelectItem>
              <SelectItem value="Property Manager">Property Manager</SelectItem>
              <SelectItem value="Owner Direct">Owner Direct</SelectItem>
              <SelectItem value="Building Owner">Building Owner</SelectItem>
              <SelectItem value="General Contractor">General Contractor</SelectItem>
              <SelectItem value="Government">Government</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
