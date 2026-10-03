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
import type { ProjectFormData } from "@/lib/admin/projectEditor";

interface SEOTabProps {
  formData: ProjectFormData;
  onFormChange: (updates: Partial<ProjectFormData>) => void;
}

interface SEOSuggestions {
  seo_title: string;
  seo_description: string;
}

function readSuggestions(value: unknown): SEOSuggestions {
  if (!value || typeof value !== "object" || !("seo_title" in value) || !("seo_description" in value)
      || typeof value.seo_title !== "string" || !value.seo_title.trim()
      || typeof value.seo_description !== "string" || !value.seo_description.trim()
      || value.seo_title.trim().length > 60 || value.seo_description.trim().length > 160) {
    throw new Error("The AI service returned invalid SEO suggestions. Your current SEO fields are unchanged.");
  }
  return { seo_title: value.seo_title.trim(), seo_description: value.seo_description.trim() };
}

function generationErrorMessage(error: unknown): string {
  const context = error && typeof error === "object" && "context" in error ? error.context : null;
  const status = context && typeof context === "object" && "status" in context ? context.status : undefined;
  if (status === 402) return "AI generation requires additional credits. You can keep editing SEO manually or try again when credits are available.";
  if (status === 429) return "The AI service is rate limited. Wait a moment and try again. Your current SEO fields are unchanged.";
  return error instanceof Error ? error.message : "Could not generate SEO suggestions. Your current SEO fields are unchanged.";
}

export const SEOTab = ({ formData, onFormChange }: SEOTabProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<SEOSuggestions | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const { toast } = useToast();

  const canGenerate = formData.title && (formData.subtitle || formData.summary || formData.description);

  const handleGenerateSEO = async () => {
    if (!canGenerate || isGenerating) return;

    setIsGenerating(true);
    setSuggestions(null);
    setGenerationError(null);
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

      // Review first: asynchronous responses must not replace current manual edits.
      setSuggestions(readSuggestions(data));

      toast({
        title: "SEO Suggestions Ready",
        description: "Review the suggestions before applying them. Your current SEO fields are unchanged."
      });
    } catch (error) {
      const description = generationErrorMessage(error);
      setGenerationError(description);
      toast({
        title: "Generation Failed",
        description,
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
            ? "AI uses your project details to suggest SEO content and may require credits. Suggestions are applied only when you choose Apply."
            : "Fill in title and at least one description field in Basic Info to enable"}
        </p>
      </div>

      {generationError && <p role="alert" className="text-sm text-destructive">{generationError}</p>}
      {suggestions && (
        <section aria-label="Generated SEO suggestions" className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
          <h3 className="font-semibold">Review SEO suggestions</h3>
          <dl className="space-y-3 text-sm">
            <div><dt className="font-medium">Suggested title</dt><dd className="mt-1 break-words">{suggestions.seo_title}</dd></div>
            <div><dt className="font-medium">Suggested description</dt><dd className="mt-1 break-words">{suggestions.seo_description}</dd></div>
          </dl>
          <p className="text-xs text-muted-foreground">Apply replaces the current SEO title and description with these suggestions.</p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={() => { onFormChange(suggestions); setSuggestions(null); }}>Apply suggestions</Button>
            <Button type="button" variant="outline" onClick={() => setSuggestions(null)}>Discard suggestions</Button>
          </div>
        </section>
      )}

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
          onValueChange={(value) => {
            if (value === "draft" || value === "published" || value === "archived") onFormChange({ publish_state: value });
          }}
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
        <div className="bg-warning/10 dark:bg-warning/20 border border-warning/30 dark:border-warning/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">⚠️</div>
            <div className="flex-1">
              <h4 className="font-semibold text-warning dark:text-warning mb-1">
                This project is not visible to the public
              </h4>
              <p className="text-sm text-warning dark:text-warning mb-2">
                Your project is currently in <strong>Draft</strong> mode. It won't appear on the website until you change the status to <strong>Published</strong>.
              </p>
              <p className="text-xs text-warning dark:text-warning">
                💡 <strong>To make it live:</strong> Select "Published" from the dropdown above and save your changes.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {formData.publish_state === "published" && (
        <div className="bg-success/10 dark:bg-success/20 border-2 border-success dark:border-success rounded-lg p-4">
          <p className="text-sm font-medium text-success dark:text-success">
            ✅ This project is <strong>LIVE</strong> and visible on the Projects page
          </p>
        </div>
      )}
      
      {formData.publish_state === "draft" && (
        <div className="bg-warning/10 dark:bg-warning/20 border-2 border-warning dark:border-warning rounded-lg p-4">
          <p className="text-sm font-medium text-warning dark:text-warning">
            ⚠️ This project is a <strong>DRAFT</strong> and will NOT appear on the Projects page until published
          </p>
        </div>
      )}
      
      {formData.publish_state === "archived" && (
        <div className="bg-muted/50 dark:bg-muted/20 border-2 border-border dark:border-border rounded-lg p-4">
          <p className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
            📦 This project is <strong>ARCHIVED</strong> and hidden from the Projects page
          </p>
        </div>
      )}
    </div>
  );
};
