import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import type { Database } from "@/integrations/supabase/types";
import { ArrowLeft, Save, HelpCircle } from "lucide-react";
import { adminErrorMessage, normalizeSlug } from "@/lib/admin/editorValues";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const INITIAL_SERVICE_FORM = {
  slug: "",
  name: "",
  short_description: "",
  long_description: "",
  icon_name: "",
  scope_template: "",
  publish_state: "draft",
  seo_title: "",
  seo_description: "",
  featured_image: "",
};

const ServiceEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const loadSequence = useRef(0);
  const ready = id === "new" || loadedId === id;
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const {
    showDialog,
    confirmNavigation,
    cancelNavigation,
    markSaved,
    message,
  } = useUnsavedChanges({ hasUnsavedChanges });
  const [formData, setFormData] = useState(INITIAL_SERVICE_FORM);

  useEffect(() => {
    setLoadedId(null);
    setLoadError(null);
    setFormData(INITIAL_SERVICE_FORM);
    setHasUnsavedChanges(false);
    if (id && id !== "new") void loadService();
    return () => {
      loadSequence.current += 1;
    };
  }, [id]);

  const loadService = async () => {
    const request = ++loadSequence.current;
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("id", id)
      .single();

    if (request !== loadSequence.current) return;
    if (error || !data) {
      setLoadError(adminErrorMessage(error));
      toast({
        title: "Error",
        description: "Failed to load service",
        variant: "destructive",
      });
    } else if (data) {
      setLoadedId(id || null);
      setLoadError(null);
      setHasUnsavedChanges(false);
      setFormData({
        slug: data.slug || "",
        name: data.name || "",
        short_description: data.short_description || "",
        long_description: data.long_description || "",
        icon_name: data.icon_name || "",
        scope_template: data.scope_template || "",
        publish_state: data.publish_state || "draft",
        seo_title: data.seo_title || "",
        seo_description: data.seo_description || "",
        featured_image: data.featured_image || "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready || isLoading) return;
    setIsLoading(true);

    // Validate content length (client-side check before DB constraint)
    const MAX_LONG_DESC_LENGTH = 20000;
    const MAX_SHORT_DESC_LENGTH = 500;

    if (
      formData.long_description &&
      formData.long_description.length > MAX_LONG_DESC_LENGTH
    ) {
      toast({
        title: "Description too long",
        description: `Long description must be under ${MAX_LONG_DESC_LENGTH.toLocaleString()} characters. Current: ${formData.long_description.length.toLocaleString()}`,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (
      formData.short_description &&
      formData.short_description.length > MAX_SHORT_DESC_LENGTH
    ) {
      toast({
        title: "Description too long",
        description: `Short description must be under ${MAX_SHORT_DESC_LENGTH} characters. Current: ${formData.short_description.length}`,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const featuredImage = formData.featured_image.trim();
    if (featuredImage && !isServiceImageUrl(featuredImage)) {
      toast({
        title: "Invalid image URL",
        description:
          "Use an HTTPS image URL or a public asset path. Source paths beginning with /src/ cannot be used on the published website.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user)
        throw new Error("Your session has expired. Sign in again to save.");

      const serviceData: Database["public"]["Tables"]["services"]["Insert"] = {
        ...formData,
        slug: normalizeSlug(formData.slug),
        publish_state:
          formData.publish_state as Database["public"]["Enums"]["publish_state"],
        featured_image: featuredImage || null,
        updated_by: user?.id,
        ...(id === "new" && { created_by: user?.id }),
      };

      const { data: savedRow, error } =
        id === "new"
          ? await supabase
              .from("services")
              .insert([serviceData])
              .select("id")
              .single()
          : await supabase
              .from("services")
              .update(serviceData)
              .eq("id", id)
              .select("id")
              .single();
      if (!error && !savedRow)
        throw new Error(
          "The saved service could not be verified. Your edits are retained.",
        );

      if (error) {
        toast({
          title: "Error",
          description: adminErrorMessage(error),
          variant: "destructive",
        });
      } else {
        setHasUnsavedChanges(false);
        toast({
          title: "Success",
          description: `Service ${id === "new" ? "created" : "updated"} successfully`,
        });
        markSaved();
        navigate("/admin/services-manager");
      }
    } catch (error) {
      toast({
        title: "Service could not be saved",
        description: adminErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (updates: Partial<typeof formData>) => {
    setFormData((current) => ({ ...current, ...updates }));
    setHasUnsavedChanges(true);
  };

  return (
    <>
      <ConfirmDialog
        open={showDialog}
        onOpenChange={cancelNavigation}
        onConfirm={confirmNavigation}
        title="Unsaved Changes"
        description={message}
        confirmText="Leave"
        cancelText="Stay"
        variant="destructive"
      />
      <div className="min-h-screen bg-muted/30">
        <header className="border-b bg-background">
          <div className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-3">
            <div className="flex flex-wrap items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin/services-manager")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Services
              </Button>
              <h1 className="text-2xl font-bold">
                {id === "new" ? "New Service" : "Edit Service"}
              </h1>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {loadError && (
            <div role="alert" className="mb-4 space-y-3">
              <p>Could not load the complete service. {loadError}</p>
              <Button variant="outline" onClick={() => void loadService()}>
                Retry loading service
              </Button>
            </div>
          )}
          <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
            <fieldset
              disabled={!ready || isLoading}
              className="space-y-6 min-w-0"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Service Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleFormChange({ name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      handleFormChange({ slug: normalizeSlug(e.target.value) })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <ImageUploadField
                  key={`${id}-${formData.featured_image}`}
                  value={formData.featured_image}
                  onChange={(url) => handleFormChange({ featured_image: url })}
                  label="Featured Image"
                  targetAspectRatio="16/9"
                />
                <Label htmlFor="featured_image">Image URL</Label>
                <Input
                  id="featured_image"
                  value={formData.featured_image}
                  onChange={(e) =>
                    handleFormChange({ featured_image: e.target.value })
                  }
                  placeholder="https://… or /image.webp"
                />
                <p className="text-sm text-muted-foreground">
                  This image replaces the default header on database-driven
                  service pages. Upload a landscape photo or enter a public
                  image URL. Clear this field to restore the default service
                  image. Specialty landing pages use images managed in code.
                </p>
                {/^\/src(?:\/|$)/i.test(formData.featured_image.trim()) && (
                  <p role="alert" className="text-sm text-destructive">
                    This source-file path will not work after publishing. Upload
                    the image or choose a public image URL.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_description">Short Description</Label>
                <Textarea
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) =>
                    handleFormChange({ short_description: e.target.value })
                  }
                  rows={2}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.short_description.length} / 500 characters
                  {formData.short_description.length > 450 && (
                    <span className="text-warning ml-2">
                      ⚠️ Approaching limit
                    </span>
                  )}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="long_description">Long Description</Label>
                <Textarea
                  id="long_description"
                  value={formData.long_description}
                  onChange={(e) =>
                    handleFormChange({ long_description: e.target.value })
                  }
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.long_description.length.toLocaleString()} / 20,000
                  characters
                  {formData.long_description.length > 18000 && (
                    <span className="text-warning ml-2">
                      ⚠️ Approaching limit
                    </span>
                  )}
                  {formData.long_description.length >= 20000 && (
                    <span className="text-destructive ml-2">
                      ⛔ Maximum reached
                    </span>
                  )}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scope">Scope Template</Label>
                <Textarea
                  id="scope"
                  value={formData.scope_template}
                  onChange={(e) =>
                    handleFormChange({ scope_template: e.target.value })
                  }
                  rows={4}
                  placeholder="Bullet points of deliverables..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="seo_title">SEO Title</Label>
                  <Input
                    id="seo_title"
                    value={formData.seo_title}
                    onChange={(e) =>
                      handleFormChange({ seo_title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <TooltipProvider>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="publish_state">Publishing Status</Label>
                      <Tooltip>
                        <TooltipTrigger type="button">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Draft: Not visible to public
                            <br />
                            Review: Ready for approval
                            <br />
                            Published: Live on site
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                  <Select
                    value={formData.publish_state}
                    onValueChange={(value) =>
                      handleFormChange({ publish_state: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">📝 Draft</SelectItem>
                      <SelectItem value="review">
                        👀 Ready for Review
                      </SelectItem>
                      <SelectItem value="published">✅ Published</SelectItem>
                      <SelectItem value="archived">📦 Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo_description">SEO Description</Label>
                <Textarea
                  id="seo_description"
                  value={formData.seo_description}
                  onChange={(e) =>
                    handleFormChange({ seo_description: e.target.value })
                  }
                  rows={2}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={!ready || isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Service"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/services-manager")}
                >
                  Cancel
                </Button>
              </div>
            </fieldset>
          </form>
        </main>
      </div>
    </>
  );
};

export default ServiceEditor;

function isServiceImageUrl(value: string): boolean {
  if (
    /^\/src(?:\/|$)/i.test(value) ||
    Array.from(value).some(
      (character) => character.charCodeAt(0) <= 32 || character === "\\",
    )
  )
    return false;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}
