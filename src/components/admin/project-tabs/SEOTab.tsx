import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SEOTabProps {
  formData: any;
  onFormChange: (updates: any) => void;
}

export const SEOTab = ({ formData, onFormChange }: SEOTabProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">SEO & Publishing</h3>
        <p className="text-sm text-muted-foreground">
          Optimize for search engines and manage publication status
        </p>
      </div>

      {/* SEO Title */}
      <div className="space-y-2">
        <Label htmlFor="seo_title">SEO Title</Label>
        <Input
          id="seo_title"
          value={formData.seo_title}
          onChange={(e) => onFormChange({ seo_title: e.target.value })}
          placeholder="Optimized title for search engines"
          maxLength={60}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Recommended: 50-60 characters</span>
          <span>{formData.seo_title?.length || 0}/60</span>
        </div>
      </div>

      {/* SEO Description */}
      <div className="space-y-2">
        <Label htmlFor="seo_description">SEO Description</Label>
        <Textarea
          id="seo_description"
          value={formData.seo_description}
          onChange={(e) => onFormChange({ seo_description: e.target.value })}
          placeholder="Meta description for search results"
          rows={3}
          maxLength={160}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Recommended: 120-160 characters</span>
          <span>{formData.seo_description?.length || 0}/160</span>
        </div>
      </div>

      {/* Publish State */}
      <div className="space-y-2">
        <Label htmlFor="publish_state">Publication Status</Label>
        <Select
          value={formData.publish_state}
          onValueChange={(value) => onFormChange({ publish_state: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">
              <div className="flex flex-col items-start">
                <span className="font-medium">Draft</span>
                <span className="text-xs text-muted-foreground">Not visible to public</span>
              </div>
            </SelectItem>
            <SelectItem value="published">
              <div className="flex flex-col items-start">
                <span className="font-medium">Published</span>
                <span className="text-xs text-muted-foreground">Live and visible to public</span>
              </div>
            </SelectItem>
            <SelectItem value="archived">
              <div className="flex flex-col items-start">
                <span className="font-medium">Archived</span>
                <span className="text-xs text-muted-foreground">Hidden but preserved</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Publication Info */}
      {formData.publish_state === "published" && (
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-sm text-green-900 dark:text-green-100">
            ✓ This project is live and visible to the public
          </p>
        </div>
      )}
      
      {formData.publish_state === "draft" && (
        <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-sm text-yellow-900 dark:text-yellow-100">
            ⚠ This project is saved as a draft and not visible to the public
          </p>
        </div>
      )}
    </div>
  );
};
