import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { ArrowLeft, Save, HelpCircle } from "lucide-react";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ServiceEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { showDialog, confirmNavigation, cancelNavigation, message } = useUnsavedChanges({ hasUnsavedChanges });
  const [formData, setFormData] = useState({
    slug: "",
    name: "",
    short_description: "",
    long_description: "",
    icon_name: "",
    scope_template: "",
    publish_state: "draft",
    seo_title: "",
    seo_description: "",
  });

  useEffect(() => {
    if (id && id !== "new") {
      loadService();
    }
  }, [id]);

  const loadService = async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load service",
        variant: "destructive",
      });
    } else if (data) {
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
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setHasUnsavedChanges(false);

    // Validate content length (client-side check before DB constraint)
    const MAX_LONG_DESC_LENGTH = 20000;
    const MAX_SHORT_DESC_LENGTH = 500;

    if (formData.long_description && formData.long_description.length > MAX_LONG_DESC_LENGTH) {
      toast({
        title: "Description too long",
        description: `Long description must be under ${MAX_LONG_DESC_LENGTH.toLocaleString()} characters. Current: ${formData.long_description.length.toLocaleString()}`,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (formData.short_description && formData.short_description.length > MAX_SHORT_DESC_LENGTH) {
      toast({
        title: "Description too long",
        description: `Short description must be under ${MAX_SHORT_DESC_LENGTH} characters. Current: ${formData.short_description.length}`,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    const serviceData: any = {
      ...formData,
      updated_by: user?.id,
      ...(id === "new" && { created_by: user?.id }),
    };

    const { error } = id === "new"
      ? await supabase.from("services").insert([serviceData])
      : await supabase.from("services").update(serviceData).eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Service ${id === "new" ? "created" : "updated"} successfully`,
      });
      navigate("/admin/services");
    }
    setIsLoading(false);
  };

  const handleFormChange = (updates: Partial<typeof formData>) => {
    setFormData({ ...formData, ...updates });
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
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/services")}>
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
        <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
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
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="short_description">Short Description</Label>
            <Textarea
              id="short_description"
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              rows={2}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              {formData.short_description.length} / 500 characters
              {formData.short_description.length > 450 && (
                <span className="text-warning ml-2">⚠️ Approaching limit</span>
              )}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="long_description">Long Description</Label>
            <Textarea
              id="long_description"
              value={formData.long_description}
              onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
              rows={6}
            />
            <p className="text-xs text-muted-foreground">
              {formData.long_description.length.toLocaleString()} / 20,000 characters
              {formData.long_description.length > 18000 && (
                <span className="text-warning ml-2">⚠️ Approaching limit</span>
              )}
              {formData.long_description.length >= 20000 && (
                <span className="text-destructive ml-2">⛔ Maximum reached</span>
              )}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scope">Scope Template</Label>
            <Textarea
              id="scope"
              value={formData.scope_template}
              onChange={(e) => setFormData({ ...formData, scope_template: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <TooltipProvider>
                <div className="flex items-center gap-2">
                  <Label htmlFor="publish_state">Publishing Status</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Draft: Not visible to public<br/>Review: Ready for approval<br/>Published: Live on site</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
              <Select
                value={formData.publish_state}
                onValueChange={(value: any) => setFormData({ ...formData, publish_state: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">📝 Draft</SelectItem>
                  <SelectItem value="review">👀 Ready for Review</SelectItem>
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
              onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
              rows={2}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : "Save Service"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/admin/services")}>
              Cancel
            </Button>
          </div>
        </form>
      </main>
    </div>
    </>
  );
};

export default ServiceEditor;
