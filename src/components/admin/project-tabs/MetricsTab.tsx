import { Label } from "@/components/ui/label";
import { Input } from "@/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/ui/Button";
import { Plus, Trash2 } from "lucide-react";
import { Card } from "@/ui/Card";

interface MetricsTabProps {
  formData: any;
  onFormChange: (updates: any) => void;
}

export const MetricsTab = ({ formData, onFormChange }: MetricsTabProps) => {
  const handleAddTeamCredit = () => {
    onFormChange({
      team_credits: [...(formData.team_credits || []), { role: "", name: "", company: "" }]
    });
  };

  const handleUpdateTeamCredit = (index: number, field: string, value: string) => {
    const updated = [...(formData.team_credits || [])];
    updated[index] = { ...updated[index], [field]: value };
    onFormChange({ team_credits: updated });
  };

  const handleRemoveTeamCredit = (index: number) => {
    const updated = formData.team_credits.filter((_: any, i: number) => i !== index);
    onFormChange({ team_credits: updated });
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">GC Tracking Metrics</h3>
        <p className="text-sm text-muted-foreground">
          Track key performance indicators and project metrics for internal reporting
        </p>
      </div>

      {/* Project Value & Square Footage */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="project_value">Project Value</Label>
          <Input
            id="project_value"
            value={formData.project_value}
            onChange={(e) => onFormChange({ project_value: e.target.value })}
            placeholder="e.g., $5,000,000"
          />
          <p className="text-xs text-muted-foreground">Total contract value</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="square_footage">Square Footage</Label>
          <Input
            id="square_footage"
            value={formData.square_footage}
            onChange={(e) => onFormChange({ square_footage: e.target.value })}
            placeholder="e.g., 50,000"
          />
          <p className="text-xs text-muted-foreground">Total building area in sq ft</p>
        </div>
      </div>

      {/* Our Role */}
      <div className="space-y-2">
        <Label htmlFor="your_role">Our Role</Label>
        <Select
          value={formData.your_role}
          onValueChange={(value) => onFormChange({ your_role: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Envelope & Restoration Contractor">Envelope & Restoration Contractor</SelectItem>
            <SelectItem value="General Contractor">General Contractor</SelectItem>
            <SelectItem value="Construction Manager">Construction Manager</SelectItem>
            <SelectItem value="Design-Build">Design-Build</SelectItem>
            <SelectItem value="Trade Contractor">Trade Contractor</SelectItem>
            <SelectItem value="Subcontractor">Subcontractor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Trades & Workforce */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="trades_coordinated">Trades Coordinated</Label>
          <Input
            id="trades_coordinated"
            type="number"
            value={formData.trades_coordinated}
            onChange={(e) => onFormChange({ trades_coordinated: e.target.value })}
            placeholder="e.g., 12"
          />
          <p className="text-xs text-muted-foreground">Number of subcontractor trades managed</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="peak_workforce">Peak Workforce</Label>
          <Input
            id="peak_workforce"
            type="number"
            value={formData.peak_workforce}
            onChange={(e) => onFormChange({ peak_workforce: e.target.value })}
            placeholder="e.g., 45"
          />
          <p className="text-xs text-muted-foreground">Maximum workers on site at one time</p>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="on_time_completion">On-Time Completion</Label>
          <Select
            value={formData.on_time_completion ? "yes" : "no"}
            onValueChange={(value) => onFormChange({ on_time_completion: value === "yes" })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="on_budget">On Budget</Label>
          <Select
            value={formData.on_budget ? "yes" : "no"}
            onValueChange={(value) => onFormChange({ on_budget: value === "yes" })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="safety_incidents">Safety Incidents</Label>
          <Input
            id="safety_incidents"
            type="number"
            value={formData.safety_incidents}
            onChange={(e) => onFormChange({ safety_incidents: e.target.value })}
            placeholder="0"
          />
          <p className="text-xs text-muted-foreground">Number of recorded incidents</p>
        </div>
      </div>

      {/* Team Credits */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Team Credits</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Acknowledge key team members and partners
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={handleAddTeamCredit}>
            <Plus className="w-4 h-4 mr-2" />
            Add Credit
          </Button>
        </div>

        <div className="space-y-3">
          {formData.team_credits?.map((credit: any, index: number) => (
            <Card key={index} className="p-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input
                    value={credit.role}
                    onChange={(e) => handleUpdateTeamCredit(index, "role", e.target.value)}
                    placeholder="e.g., Project Manager"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={credit.name}
                    onChange={(e) => handleUpdateTeamCredit(index, "name", e.target.value)}
                    placeholder="e.g., John Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company (Optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      value={credit.company}
                      onChange={(e) => handleUpdateTeamCredit(index, "company", e.target.value)}
                      placeholder="e.g., ABC Engineering"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveTeamCredit(index)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {(!formData.team_credits || formData.team_credits.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">
              No team credits added yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
