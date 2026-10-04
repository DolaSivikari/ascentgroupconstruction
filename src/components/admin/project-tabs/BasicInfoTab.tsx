import { normalizeSlug } from "@/lib/admin/editorValues";
import { Label } from "@/components/ui/label";
import { Input } from "@/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/ui/Button";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

interface BasicInfoTabProps {
  formData: any;
  slugStatus: {
    isChecking: boolean;
    isAvailable: boolean;
    message: string;
  };
  onFormChange: (updates: any) => void;
}

export const BasicInfoTab = ({ formData, slugStatus, onFormChange }: BasicInfoTabProps) => {
  return (
    <div className="space-y-6">
      {/* Title & Slug */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Project Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => onFormChange({ title: e.target.value })}
            required
            placeholder="Enter project title"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="slug">URL Slug *</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                const autoSlug = normalizeSlug(formData.title);
                onFormChange({ slug: autoSlug });
              }}
              disabled={!formData.title}
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Generate
            </Button>
          </div>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => {
              const sanitized = normalizeSlug(e.target.value);
              onFormChange({ slug: sanitized });
            }}
            required
            placeholder="project-url-slug"
            className={!slugStatus.isAvailable ? "border-destructive" : ""}
          />
          <div className="flex items-center justify-between text-sm">
            <p className="text-muted-foreground">
              URL: /projects/<span className="font-semibold text-foreground">{formData.slug || "..."}</span>
            </p>
            {formData.slug && (
              <p className={cn(
                "text-xs font-medium",
                slugStatus.isChecking && "text-muted-foreground",
                slugStatus.isAvailable && !slugStatus.isChecking && "text-success",
                !slugStatus.isAvailable && !slugStatus.isChecking && "text-destructive"
              )}>
                {slugStatus.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Subtitle */}
      <div className="space-y-2">
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input
          id="subtitle"
          value={formData.subtitle}
          onChange={(e) => onFormChange({ subtitle: e.target.value })}
          placeholder="Brief tagline or subtitle"
        />
      </div>

      {/* Summary */}
      <div className="space-y-2">
        <Label htmlFor="summary">Summary</Label>
        <Textarea
          id="summary"
          value={formData.summary}
          onChange={(e) => onFormChange({ summary: e.target.value })}
          placeholder="Brief project overview (1-2 sentences)"
          rows={3}
        />
      </div>

      {/* Description */}
      <RichTextEditor
        id="description"
        label="Full Description"
        value={formData.description || ''}
        onChange={(value) => onFormChange({ description: value })}
        placeholder="Detailed project description with rich formatting..."
        minHeight="250px"
        maxLength={10000}
      />

      {/* Category, Status, Featured */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => onFormChange({ category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Commercial">Commercial</SelectItem>
              <SelectItem value="Residential">Residential</SelectItem>
              <SelectItem value="Multi-Family">Multi-Family</SelectItem>
              <SelectItem value="Institutional">Institutional</SelectItem>
              <SelectItem value="Industrial">Industrial</SelectItem>
              <SelectItem value="Retail">Retail</SelectItem>
              <SelectItem value="Office">Office</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="project_status">Project Status</Label>
          <Select
            value={formData.project_status}
            onValueChange={(value) => onFormChange({ project_status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Planned">Planned</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="featured">Featured Project</Label>
          <Select
            value={formData.featured ? "yes" : "no"}
            onValueChange={(value) => onFormChange({ featured: value === "yes" })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Client Name & Location */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="client_name">Client Name</Label>
          <Input
            id="client_name"
            value={formData.client_name}
            onChange={(e) => onFormChange({ client_name: e.target.value })}
            placeholder="Client or property name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => onFormChange({ location: e.target.value })}
            placeholder="City, Province"
          />
        </div>
      </div>
    </div>
  );
};
