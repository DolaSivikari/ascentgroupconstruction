import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/ui/Button";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { generatePreviewToken } from "@/utils/routeHelpers";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicInfoTab } from "@/components/admin/project-tabs/BasicInfoTab";
import { ImagesTab } from "@/components/admin/project-tabs/ImagesTab";
import { ProjectDetailsTab } from "@/components/admin/project-tabs/ProjectDetailsTab";
import { ServicesTab } from "@/components/admin/project-tabs/ServicesTab";
import { MetricsTab } from "@/components/admin/project-tabs/MetricsTab";
import { SEOTab } from "@/components/admin/project-tabs/SEOTab";

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
    content_blocks: [],
    project_images: [] as ProjectImage[],
    service_ids: [] as string[],
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

  useEffect(() => {
    if (formData.title && !formData.slug && id === "new") {
      const autoSlug = formData.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      setFormData((prev: any) => ({ ...prev, slug: autoSlug }));
    }
  }, [formData.title, id]);

  useEffect(() => {
    const checkSlugUniqueness = async () => {
      if (!formData.slug) {
        setSlugStatus({ isChecking: false, isAvailable: true, message: "" });
        return;
      }
      setSlugStatus({ isChecking: true, isAvailable: true, message: "Checking..." });
      const { data } = await supabase.from("projects").select("id, slug").eq("slug", formData.slug);
      const existingProject = data?.find((p: any) => p.id !== id);
      setSlugStatus({
        isChecking: false,
        isAvailable: !existingProject,
        message: existingProject ? "⚠ Slug already in use" : "✓ Available"
      });
    };
    const timer = setTimeout(checkSlugUniqueness, 500);
    return () => clearTimeout(timer);
  }, [formData.slug, id]);

  useEffect(() => {
    if (id && id !== "new") loadProject();
  }, [id]);

  const loadProject = async () => {
    if (!id || id === "new") return;
    setIsLoading(true);
    const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();
    if (error || !data) {
      toast({ title: "Error", description: "Failed to load project", variant: "destructive" });
      setIsLoading(false);
      return;
    }
    const { data: images } = await supabase.from("project_images").select("*").eq("project_id", id).order("display_order");
    const { data: projectServices } = await supabase.from("project_services").select("service_id").eq("project_id", id);
    setFormData({
      ...data,
      project_images: images?.map((img: any) => ({ id: img.id, url: img.url, category: img.category, caption: img.caption, order: img.display_order, featured: img.featured })) || [],
      service_ids: projectServices?.map((ps: any) => ps.service_id) || [],
      team_credits: data.team_credits || [],
    });
    setHasUnsavedChanges(false);
    setIsLoading(false);
  };

  const handleFormChange = (updates: any) => {
    setFormData((prev: any) => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slugStatus.isAvailable) {
      toast({ title: "Error", description: "Please choose a unique slug", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setHasUnsavedChanges(false);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "Authentication Error", description: "You must be logged in", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      const { project_images, service_ids, ...projectData } = formData;
      const finalProjectData: any = { ...projectData, updated_by: user.id, ...(id === "new" && { created_by: user.id }) };
      const { error, data } = id === "new"
        ? await supabase.from("projects").insert([finalProjectData]).select().single()
        : await supabase.from("projects").update(finalProjectData).eq("id", id).select().single();
      if (error) {
        toast({ title: "Error Saving Project", description: error.message, variant: "destructive" });
        setIsLoading(false);
        return;
      }
      const projectId = data.id;
      await supabase.from("project_images").delete().eq("project_id", projectId);
      if (formData.project_images.length > 0) {
        await supabase.from("project_images").insert(formData.project_images.map((img: any, idx: number) => ({
          project_id: projectId, url: img.url, category: img.category, caption: img.caption, display_order: idx, featured: img.featured
        })));
      }
      await supabase.from("project_services").delete().eq("project_id", projectId);
      if (formData.service_ids.length > 0) {
        await supabase.from("project_services").insert(formData.service_ids.map((serviceId: string) => ({ project_id: projectId, service_id: serviceId })));
      }
      toast({ title: "Success", description: id === "new" ? "Project created" : "Project updated" });
      if (id === "new") navigate(`/admin/projects/edit/${projectId}`);
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = async () => {
    if (!id || id === "new") {
      toast({ title: "Save First", description: "Please save before previewing", variant: "destructive" });
      return;
    }
    const token = generatePreviewToken();
    await supabase.from("projects").update({ preview_token: token, preview_token_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() }).eq("id", id);
    window.open(`/blog/${formData.slug}?preview=${token}`, "_blank");
  };

  return (
    <>
      <ConfirmDialog 
        open={showDialog} 
        onOpenChange={cancelNavigation}
        onConfirm={confirmNavigation} 
        title="Unsaved Changes"
        description={message}
      />
      <div className="min-h-screen bg-muted/30">
        <header className="sticky top-0 z-10 border-b bg-background shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate("/admin/projects")}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
              <h1 className="text-2xl font-bold">{id === "new" ? "New Project" : "Edit Project"}</h1>
            </div>
            <div className="flex gap-2">
              {id !== "new" && <Button variant="outline" onClick={handlePreview}><Eye className="h-4 w-4 mr-2" />Preview</Button>}
              <Button onClick={handleSubmit} disabled={isLoading}><Save className="h-4 w-4 mr-2" />{isLoading ? "Saving..." : "Save"}</Button>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>
            <div className="bg-background rounded-lg border p-6">
              <TabsContent value="basic" className="mt-0"><BasicInfoTab formData={formData} slugStatus={slugStatus} onFormChange={handleFormChange} /></TabsContent>
              <TabsContent value="images" className="mt-0"><ImagesTab projectId={id} formData={formData} onFormChange={handleFormChange} /></TabsContent>
              <TabsContent value="details" className="mt-0"><ProjectDetailsTab formData={formData} onFormChange={handleFormChange} /></TabsContent>
              <TabsContent value="services" className="mt-0"><ServicesTab formData={formData} onFormChange={handleFormChange} /></TabsContent>
              <TabsContent value="metrics" className="mt-0"><MetricsTab formData={formData} onFormChange={handleFormChange} /></TabsContent>
              <TabsContent value="seo" className="mt-0"><SEOTab formData={formData} onFormChange={handleFormChange} /></TabsContent>
            </div>
          </Tabs>
        </main>
      </div>
    </>
  );
};

export default ProjectEditor;
