import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/ui/Button";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SEOTabProps {
  formData: any;
  onFormChange: (updates: any) => void;
}

export const SEOTab = ({ formData, onFormChange }: SEOTabProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const canGenerate = formData.title && (formData.subtitle || formData.summary || formData.description);

  const handleGenerateSEO = async () => {
    if (!canGenerate) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-seo-content', {
        body: {
          title: formData.title,
          subtitle: formData.subtitle || '',
          summary: formData.summary || '',
          description: formData.description || ''
        }
      });

      if (error) throw error;

      // Update form with generated content
      onFormChange({
        seo_title: data.seo_title,
        seo_description: data.seo_description
      });

      toast({
        title: "SEO Content Generated",
        description: "Review and adjust the generated content as needed"
      });
    } catch (error: any) {
      console.error('SEO generation error:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate SEO content",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">SEO & Publishing</h3>
        <p className="text-sm text-muted-foreground">
          Optimize for search engines and manage publication status
        </p>
      </div>

      {/* Generate Button */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleGenerateSEO}
          disabled={isGenerating || !canGenerate}
          className="flex-shrink-0"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {isGenerating ? "Generating..." : "Generate SEO Content"}
        </Button>
        <p className="text-xs text-muted-foreground">
          {canGenerate 
            ? "AI will analyze your project details to create search-optimized content" 
            : "Fill in title and at least one description field in Basic Info to enable"}
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

      {/* Publish State - Prominent */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="publish_state" className="text-base font-semibold">Publication Status *</Label>
          <Badge variant={formData.publish_state === 'published' ? 'default' : 'secondary'}>
            {formData.publish_state?.toUpperCase() || 'DRAFT'}
          </Badge>
        </div>
        <Select
          value={formData.publish_state}
          onValueChange={(value) => onFormChange({ publish_state: value })}
        >
          <SelectTrigger className="h-12 text-base font-medium">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">
              <div className="flex flex-col items-start py-2">
                <span className="font-medium text-base">📝 Draft</span>
                <span className="text-xs text-muted-foreground">Not visible to public - work in progress</span>
              </div>
            </SelectItem>
            <SelectItem value="published">
              <div className="flex flex-col items-start py-2">
                <span className="font-medium text-base">✅ Published</span>
                <span className="text-xs text-muted-foreground">Live and visible on Projects page</span>
              </div>
            </SelectItem>
            <SelectItem value="archived">
              <div className="flex flex-col items-start py-2">
                <span className="font-medium text-base">📦 Archived</span>
                <span className="text-xs text-muted-foreground">Hidden but preserved for records</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          💡 Tip: Projects must be <strong>Published</strong> to appear on the public Projects page
        </p>
      </div>

      {/* Publication Status Alerts */}
      {formData.publish_state === "draft" && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">⚠️</div>
            <div className="flex-1">
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                This project is not visible to the public
              </h4>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
                Your project is currently in <strong>Draft</strong> mode. It won't appear on the website until you change the status to <strong>Published</strong>.
              </p>
              <p className="text-xs text-warning dark:text-yellow-300">
                💡 <strong>To make it live:</strong> Select "Published" from the dropdown above and save your changes.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {formData.publish_state === "published" && (
        <div className="bg-green-50 dark:bg-green-950/20 border-2 border-success dark:border-success rounded-lg p-4">
          <p className="text-sm font-medium text-green-900 dark:text-green-100">
            ✅ This project is <strong>LIVE</strong> and visible on the Projects page
          </p>
        </div>
      )}
      
      {formData.publish_state === "draft" && (
        <div className="bg-yellow-50 dark:bg-yellow-950/20 border-2 border-warning dark:border-warning rounded-lg p-4">
          <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
            ⚠️ This project is a <strong>DRAFT</strong> and will NOT appear on the Projects page until published
          </p>
        </div>
      )}
      
      {formData.publish_state === "archived" && (
        <div className="bg-gray-50 dark:bg-gray-950/20 border-2 border-gray-400 dark:border-gray-700 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            📦 This project is <strong>ARCHIVED</strong> and hidden from the Projects page
          </p>
        </div>
      )}
    </div>
  );
};
