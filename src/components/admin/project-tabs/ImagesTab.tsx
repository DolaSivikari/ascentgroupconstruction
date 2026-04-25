import { Label } from "@/components/ui/label";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { ProjectImageManager } from "@/components/admin/ProjectImageManager";

interface ProjectImage {
  id: string;
  url: string;
  category: 'before' | 'after' | 'process' | 'gallery';
  caption?: string;
  order: number;
  featured: boolean;
}

interface ImagesTabProps {
  projectId?: string;
  formData: any;
  onFormChange: (updates: any) => void;
}

export const ImagesTab = ({ projectId, formData, onFormChange }: ImagesTabProps) => {
  return (
    <div className="space-y-8">
      {/* Featured Image */}
      <div className="space-y-2">
        <Label>Featured Image</Label>
        <ImageUploadField
          value={formData.featured_image}
          onChange={(url) => onFormChange({ featured_image: url })}
          label="Upload Featured Image"
          targetAspectRatio="16/9"
          minWidth={1200}
          minHeight={675}
          minAspectRatio={1.33}
        />
        <p className="text-sm text-muted-foreground">
          Main project hero image. Recommended: 1920×1080 (16:9). Minimum: 1200×675, landscape only.
        </p>
      </div>

      {/* Project Image Manager */}
      <div className="space-y-4">
        <div>
          <Label>Project Images</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Organize project images into categories: Before, After, Process, and Gallery
          </p>
        </div>
        <ProjectImageManager
          projectId={projectId || "new"}
          images={formData.project_images}
          onImagesUpdate={(images: ProjectImage[]) => 
            onFormChange({ project_images: images })
          }
        />
      </div>
    </div>
  );
};
