import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Eye, RefreshCw } from "lucide-react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { MultiImageUpload, GalleryImage } from "@/components/admin/MultiImageUpload";
import { ProcessStepsEditor, ProcessStep } from "@/components/admin/ProcessStepsEditor";
import { ProjectImageManager } from "@/components/admin/ProjectImageManager";
import { ServiceMultiSelect } from "@/components/admin/ServiceMultiSelect";
import { generatePreviewToken } from "@/utils/routeHelpers";
import { resolveImagePath } from "@/utils/imageResolver";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

interface ProjectImage {
  id: string;
  url: string;
  category: 'before' | 'after' | 'process' | 'gallery';
  caption?: string;
  order: number;
  featured: boolean;
}

const ProjectEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { showDialog, confirmNavigation, cancelNavigation, message } = useUnsavedChanges({ hasUnsavedChanges });
  const [slugStatus, setSlugStatus] = useState<{
    isChecking: boolean;
    isAvailable: boolean;
    message: string;
  }>({ isChecking: false, isAvailable: true, message: "" });
  const [formData, setFormData] = useState<any>({
    slug: "",
    title: "",
    subtitle: "",
    summary: "",
    description: "",
    featured_image: "",
    client_name: "",
    location: "",
    category: "",
    project_size: "",
    duration: "",
    year: "",
    budget_range: "",
    start_date: "",
    completion_date: "",
    project_status: "Completed",
    process_notes: "",
    featured: false,
    publish_state: "draft",
    seo_title: "",
    seo_description: "",
    before_images: [],
    after_images: [],
    content_blocks: [],
    project_images: [] as ProjectImage[],
    service_ids: [] as string[],
    // GC Tracking Metrics
    project_value: "",
    square_footage: "",
    your_role: "",
    delivery_method: "",
    client_type: "",
    trades_coordinated: "",
    peak_workforce: "",
    on_time_completion: false,
    on_budget: false,
    safety_incidents: "",
    scope_of_work: "",
    team_credits: [] as Array<{ role: string; name: string; company?: string }>,
  });

  // Auto-generate slug from title when title changes and slug is empty
  useEffect(() => {
    if (formData.title && !formData.slug && id === "new") {
      const autoSlug = formData.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      setFormData((prev: any) => ({ ...prev, slug: autoSlug }));
    }
  }, [formData.title, id]);

  // Debounced slug uniqueness check
  useEffect(() => {
    const checkSlugUniqueness = async () => {
      if (!formData.slug) {
        setSlugStatus({ isChecking: false, isAvailable: true, message: "" });
        return;
      }
      
      setSlugStatus({ isChecking: true, isAvailable: true, message: "Checking..." });
      
      const { data, error } = await supabase
        .from("projects")
        .select("id, slug")
        .eq("slug", formData.slug);
      
      if (error) {
        setSlugStatus({ 
          isChecking: false, 
          isAvailable: false, 
          message: "Error checking slug" 
        });
        return;
      }
      
      // If editing existing project, ignore current project's slug
      const isDuplicate = data && data.some((p: any) => p.id !== id);
      
      setSlugStatus({
        isChecking: false,
        isAvailable: !isDuplicate,
        message: isDuplicate 
          ? "⚠️ This slug is already in use" 
          : "✓ Available"
      });
    };
    
    const timer = setTimeout(checkSlugUniqueness, 500);
    return () => clearTimeout(timer);
  }, [formData.slug, id]);

  useEffect(() => {
    if (id && id !== "new") {
      loadProject();
    }
  }, [id]);

  const loadProject = async () => {
    // Fetch project and its images
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load project",
        variant: "destructive",
      });
      return;
    }

    // Fetch project images from new table
    const { data: images, error: imagesError } = await supabase
      .from("project_images")
      .select("*")
      .eq("project_id", id)
      .order("display_order");

    // Fetch associated services
    const { data: projectServices } = await supabase
      .from("project_services")
      .select("service_id")
      .eq("project_id", id);

    if (data) {
      setHasUnsavedChanges(false);
      setFormData({
        slug: data.slug || "",
        title: data.title || "",
        subtitle: data.subtitle || "",
        summary: data.summary || "",
        description: data.description || "",
        featured_image: data.featured_image || "",
        client_name: data.client_name || "",
        location: data.location || "",
        category: data.category || "",
        project_size: data.project_size || "",
        duration: data.duration || "",
        year: data.year || "",
        budget_range: data.budget_range || "",
        start_date: data.start_date || "",
        completion_date: data.completion_date || "",
        project_status: data.project_status || "Completed",
        process_notes: data.process_notes || "",
        featured: data.featured || false,
        publish_state: (data.publish_state as any) || "draft",
        seo_title: data.seo_title || "",
        seo_description: data.seo_description || "",
        before_images: data.before_images || [],
        after_images: data.after_images || [],
        content_blocks: data.content_blocks || [],
        project_images: images?.map((img: any) => ({
          id: img.id,
          url: img.url,
          category: img.category,
          caption: img.caption,
          order: img.display_order,
          featured: img.featured
        })) || [],
        service_ids: projectServices?.map((ps: any) => ps.service_id) || [],
        // GC Tracking Metrics
        project_value: data.project_value || "",
        square_footage: data.square_footage || "",
        your_role: data.your_role || "",
        delivery_method: data.delivery_method || "",
        client_type: data.client_type || "",
        trades_coordinated: data.trades_coordinated || "",
        peak_workforce: data.peak_workforce || "",
        on_time_completion: data.on_time_completion || false,
        on_budget: data.on_budget || false,
        safety_incidents: data.safety_incidents || "",
        scope_of_work: data.scope_of_work || "",
        team_credits: data.team_credits || [],
      });
      setHasUnsavedChanges(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasUnsavedChanges(false);

    // Check slug availability before saving
    if (!slugStatus.isAvailable) {
      toast({
        title: "Error",
        description: "Please choose a unique slug before saving",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    
    // Remove project_images and service_ids from projectData (handled separately)
    const { project_images, service_ids, ...projectData } = formData;
    
    const finalProjectData: any = {
      ...projectData,
      updated_by: user?.id,
      ...(id === "new" && { created_by: user?.id }),
    };

    const { error, data } = id === "new"
      ? await supabase.from("projects").insert([finalProjectData]).select().single()
      : await supabase.from("projects").update(finalProjectData).eq("id", id).select().single();

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Save project images to project_images table
    const projectId = data.id;
    
    // Delete existing images
    await supabase
      .from("project_images")
      .delete()
      .eq("project_id", projectId);
    
    // Insert new images
    if (formData.project_images.length > 0) {
      const imagesToInsert = formData.project_images.map((img, idx) => ({
        project_id: projectId,
        url: img.url,
        category: img.category,
        caption: img.caption,
        display_order: idx,
        featured: img.featured,
      }));

      const { error: imagesError } = await supabase
        .from("project_images")
        .insert(imagesToInsert);

      if (imagesError) {
        console.error("Error saving images:", imagesError);
        toast({
          title: "Warning",
          description: "Project saved but some images failed to save",
          variant: "destructive",
        });
      }
    }

    // Save project-service relationships
    if (formData.service_ids.length > 0) {
      // Delete existing relationships
      await supabase
        .from("project_services")
        .delete()
        .eq("project_id", projectId);

      // Insert new relationships
      const serviceLinks = formData.service_ids.map(serviceId => ({
        project_id: projectId,
        service_id: serviceId
      }));

      const { error: servicesError } = await supabase
        .from("project_services")
        .insert(serviceLinks);

      if (servicesError) {
        console.error("Error saving services:", servicesError);
        toast({
          title: "Warning",
          description: "Project saved but some services failed to link",
          variant: "destructive",
        });
      }
    } else {
      // If no services selected, remove all existing relationships
      await supabase
        .from("project_services")
        .delete()
        .eq("project_id", projectId);
    }

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Project ${id === "new" ? "created" : "updated"} successfully`,
      });
      
      if (data && formData.publish_state === "published") {
        toast({
          title: "Live!",
          description: "Project is now visible on the public site",
        });
      }
      
      navigate("/admin/projects");
    }
    setIsLoading(false);
  };

  const handlePreview = async () => {
    if (!formData.slug) {
      toast({
        title: "Slug required",
        description: "Please add a slug before previewing",
        variant: "destructive",
      });
      return;
    }

    const token = generatePreviewToken();
    
    // Save preview token to database
    if (id && id !== "new") {
      await supabase
        .from("projects")
        .update({ preview_token: token })
        .eq("id", id);
    }

    const previewUrl = `/blog/${formData.slug}?preview=true&token=${token}`;
    window.open(previewUrl, "_blank");
  };

  const handleFormChange = (updates: Partial<typeof formData>) => {
    setFormData({ ...formData, ...updates } as any);
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
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/projects")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
            <h1 className="text-2xl font-bold">
              {id === "new" ? "New Project" : "Edit Project"}
            </h1>
          </div>
          <div className="flex gap-2">
            {id !== "new" && (
              <Button variant="outline" onClick={handlePreview} type="button">
                <Eye className="h-4 w-4 mr-2" />
                Preview Draft
              </Button>
            )}
            <Button type="submit" disabled={isLoading} onClick={handleSubmit}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : "Save Project"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleFormChange({ title: e.target.value })}
                required
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
                    const autoSlug = formData.title
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9-]/g, "");
                    setFormData({ ...formData, slug: autoSlug });
                  }}
                  disabled={!formData.title}
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Generate from Title
                </Button>
              </div>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => {
                  const sanitized = e.target.value
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-]/g, "");
                  setFormData({ ...formData, slug: sanitized });
                }}
                required
                placeholder="95-calvington-drive"
                className={!slugStatus.isAvailable ? "border-destructive" : ""}
              />
              
              {/* Status indicator */}
              <div className="flex items-center justify-between text-sm">
                <p className="text-muted-foreground">
                  URL: https://ascentgroupconstruction.com/blog/
                  <span className="font-semibold text-foreground">
                    {formData.slug || "project-slug"}
                  </span>
                </p>
                {formData.slug && (
                  <p className={cn(
                    "text-xs font-medium",
                    slugStatus.isChecking && "text-muted-foreground",
                    slugStatus.isAvailable && !slugStatus.isChecking && "text-green-600",
                    !slugStatus.isAvailable && !slugStatus.isChecking && "text-destructive"
                  )}>
                    {slugStatus.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Project Story & Scope</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={8}
              placeholder="Tell the story: What was the challenge? What did the client need?"
            />
          </div>

          <ImageUploadField
            value={formData.featured_image}
            onChange={(url) => setFormData({ ...formData, featured_image: url })}
            bucket="project-images"
            label="Featured Image (Main hero image for cards)"
          />

          {/* Enhanced Project Gallery Manager - Unified Image Management */}
          <Card className="p-6">
            <ProjectImageManager
              projectId={id || 'new'}
              images={formData.project_images}
              onImagesUpdate={(images) => setFormData({ ...formData, project_images: images })}
            />
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="client_name">Client Name</Label>
              <Input
                id="client_name"
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Toronto, ON"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                  <SelectItem value="Institutional">Institutional</SelectItem>
                  <SelectItem value="Residential">Residential</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Project sector/market</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="project_size">Project Size</Label>
              <Input
                id="project_size"
                value={formData.project_size}
                onChange={(e) => setFormData({ ...formData, project_size: e.target.value })}
                placeholder="e.g., 50,000 sq ft"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget_range">Budget Range</Label>
              <Input
                id="budget_range"
                value={formData.budget_range}
                onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                placeholder="e.g., $5M-$8M"
              />
            </div>
          </div>

          {/* Service Type Selection */}
          <Card className="p-6 bg-card">
            <ServiceMultiSelect
              selectedServiceIds={formData.service_ids}
              onChange={(ids) => setFormData({ ...formData, service_ids: ids })}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Select all services that were provided for this project (e.g., Stucco, Painting, Metal Cladding, etc.)
            </p>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="e.g., 2024"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 6 months"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="featured">Featured Project</Label>
              <Select
                value={formData.featured ? "true" : "false"}
                onValueChange={(value) => setFormData({ ...formData, featured: value === "true" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">No</SelectItem>
                  <SelectItem value="true">Yes (Show in Spotlight)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="completion_date">Completion Date</Label>
              <Input
                id="completion_date"
                type="date"
                value={formData.completion_date}
                onChange={(e) => setFormData({ ...formData, completion_date: e.target.value })}
              />
            </div>
          </div>

          {/* GC Tracking Metrics Section */}
          <Card className="p-6 bg-muted/30">
            <h3 className="text-lg font-bold mb-4">GC Project Metrics</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Track key project performance indicators and team information
            </p>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="project_value">Contract Value ($)</Label>
                  <Input
                    id="project_value"
                    type="number"
                    step="0.01"
                    value={formData.project_value}
                    onChange={(e) => setFormData({ ...formData, project_value: e.target.value })}
                    placeholder="e.g., 2500000.00"
                  />
                  <p className="text-xs text-muted-foreground">Total contract value in dollars</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="square_footage">Square Footage</Label>
                  <Input
                    id="square_footage"
                    type="number"
                    value={formData.square_footage}
                    onChange={(e) => setFormData({ ...formData, square_footage: e.target.value })}
                    placeholder="e.g., 50000"
                  />
                  <p className="text-xs text-muted-foreground">Total building area in sq ft</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="your_role">Our Role</Label>
                  <Select
                    value={formData.your_role}
                    onValueChange={(value) => setFormData({ ...formData, your_role: value })}
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
                <div className="space-y-2">
                  <Label htmlFor="delivery_method">Delivery Method</Label>
                  <Select
                    value={formData.delivery_method}
                    onValueChange={(value) => setFormData({ ...formData, delivery_method: value })}
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
                    onValueChange={(value) => setFormData({ ...formData, client_type: value })}
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

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="trades_coordinated">Trades Coordinated</Label>
                  <Input
                    id="trades_coordinated"
                    type="number"
                    value={formData.trades_coordinated}
                    onChange={(e) => setFormData({ ...formData, trades_coordinated: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, peak_workforce: e.target.value })}
                    placeholder="e.g., 45"
                  />
                  <p className="text-xs text-muted-foreground">Maximum workers on site</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="on_time_completion">On-Time Completion</Label>
                  <Select
                    value={formData.on_time_completion ? "true" : "false"}
                    onValueChange={(value) => setFormData({ ...formData, on_time_completion: value === "true" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="on_budget">On Budget</Label>
                  <Select
                    value={formData.on_budget ? "true" : "false"}
                    onValueChange={(value) => setFormData({ ...formData, on_budget: value === "true" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="safety_incidents">Safety Incidents</Label>
                  <Input
                    id="safety_incidents"
                    type="number"
                    value={formData.safety_incidents}
                    onChange={(e) => setFormData({ ...formData, safety_incidents: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scope_of_work">Scope of Work</Label>
                <Textarea
                  id="scope_of_work"
                  value={formData.scope_of_work}
                  onChange={(e) => setFormData({ ...formData, scope_of_work: e.target.value })}
                  rows={6}
                  placeholder="Detailed description of all work performed..."
                />
                <p className="text-xs text-muted-foreground">
                  Comprehensive description of work completed (supports HTML)
                </p>
              </div>

              <div className="space-y-2">
                <Label>Team Credits</Label>
                <div className="space-y-3">
                  {formData.team_credits.map((member: any, index: number) => (
                    <div key={index} className="grid grid-cols-12 gap-3">
                      <Input
                        placeholder="Role (e.g., Project Manager)"
                        value={member.role}
                        onChange={(e) => {
                          const updated = [...formData.team_credits];
                          updated[index].role = e.target.value;
                          setFormData({ ...formData, team_credits: updated });
                        }}
                        className="col-span-3"
                      />
                      <Input
                        placeholder="Name"
                        value={member.name}
                        onChange={(e) => {
                          const updated = [...formData.team_credits];
                          updated[index].name = e.target.value;
                          setFormData({ ...formData, team_credits: updated });
                        }}
                        className="col-span-3"
                      />
                      <Input
                        placeholder="Company (optional)"
                        value={member.company || ""}
                        onChange={(e) => {
                          const updated = [...formData.team_credits];
                          updated[index].company = e.target.value;
                          setFormData({ ...formData, team_credits: updated });
                        }}
                        className="col-span-5"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const updated = formData.team_credits.filter((_: any, i: number) => i !== index);
                          setFormData({ ...formData, team_credits: updated });
                        }}
                        className="col-span-1"
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        team_credits: [...formData.team_credits, { role: "", name: "", company: "" }]
                      });
                    }}
                  >
                    + Add Team Member
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  List key team members and their roles on this project
                </p>
              </div>
            </div>
          </Card>

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
              <div className="flex items-center gap-2">
                <Label htmlFor="publish_state">Publishing Status</Label>
                <span className="text-xs text-muted-foreground">
                  {(formData.publish_state as any) === 'draft' && '(Not visible to public)'}
                  {(formData.publish_state as any) === 'review' && '(Awaiting approval)'}
                  {(formData.publish_state as any) === 'published' && '(Live on site)'}
                </span>
              </div>
              <Select
                value={formData.publish_state}
                onValueChange={(value: any) => setFormData({ ...formData, publish_state: value as any })}
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
              {isLoading ? "Saving..." : "Save Project"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/admin/projects")}>
              Cancel
            </Button>
          </div>
        </form>
      </main>
    </div>
    </>
  );
};

export default ProjectEditor;
