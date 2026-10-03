import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { generatePreviewToken } from "@/utils/routeHelpers";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useFormCompletion } from "@/hooks/useFormCompletion";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ProjectEditorHeader } from "@/components/admin/ProjectEditorHeader";
import { CompletionChecklist } from "@/components/admin/CompletionChecklist";
import { BasicInfoTab } from "@/components/admin/project-tabs/BasicInfoTab";
import { ImagesTab } from "@/components/admin/project-tabs/ImagesTab";
import { ProjectDetailsTab } from "@/components/admin/project-tabs/ProjectDetailsTab";
import { ServicesTab } from "@/components/admin/project-tabs/ServicesTab";
import { MetricsTab } from "@/components/admin/project-tabs/MetricsTab";
import { SEOTab } from "@/components/admin/project-tabs/SEOTab";
import { projectSavePayload, type ProjectFormData } from "@/lib/admin/projectEditor";
import { loadProjectRelationships, saveProjectRelationships, type ProjectRelationships } from "@/lib/admin/projectPersistence";
import { Button } from "@/ui/Button";


const INITIAL_PROJECT_FORM: ProjectFormData = {
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
  project_images: [],
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
};

const ProjectEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [loadedProjectId, setLoadedProjectId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [autoSaveError, setAutoSaveError] = useState<string | null>(null);
  const [createdProjectId, setCreatedProjectId] = useState<string | null>(null);
  const [relationships, setRelationships] = useState<ProjectRelationships>({ images: [], serviceIds: [] });
  const loadSequence = useRef(0);
  const canEditProject = id === "new" || loadedProjectId === id;
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { showDialog, confirmNavigation, cancelNavigation, message } = useUnsavedChanges({ hasUnsavedChanges });
  const [slugStatus, setSlugStatus] = useState<{
    isChecking: boolean;
    isAvailable: boolean;
    message: string;
  }>({ isChecking: false, isAvailable: true, message: "" });

  const [formData, setFormData] = useState<ProjectFormData>(INITIAL_PROJECT_FORM);

  useEffect(() => {
    if (formData.title && !formData.slug && id === "new") {
      const autoSlug = formData.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      setFormData((prev) => ({ ...prev, slug: autoSlug }));
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
      const existingProject = data?.find((p) => p.id !== (id === "new" ? createdProjectId : id));
      setSlugStatus({
        isChecking: false,
        isAvailable: !existingProject,
        message: existingProject ? "⚠ Slug already in use" : "✓ Available"
      });
    };
    const timer = setTimeout(checkSlugUniqueness, 500);
    return () => clearTimeout(timer);
  }, [formData.slug, id, createdProjectId]);

  useEffect(() => {
    setCreatedProjectId(null);
    setLoadedProjectId(null);
    setLoadError(null);
    setSaveError(null);
    setAutoSaveError(null);
    setRelationships({ images: [], serviceIds: [] });
    if (id && id !== "new") {
      void loadProject();
    } else if (id === "new") {
      setFormData(INITIAL_PROJECT_FORM);
      setHasUnsavedChanges(false);
      // Show reminder for new projects
      toast({
        title: "📝 Remember to publish",
        description: "Set Publication Status to 'Published' in the SEO tab to make your project visible on the website.",
        duration: 6000,
      });
    }
    return () => { loadSequence.current += 1; };
  }, [id]);

  const loadProject = async () => {
    if (!id || id === "new") return;
    const request = ++loadSequence.current;
    setIsLoading(true);
    setLoadedProjectId(null);
    setLoadError(null);
    try {
      const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();
      if (error || !data) throw new Error("Could not load this project.");
      const related = await loadProjectRelationships(id);
      if (request !== loadSequence.current) return;
      const loadedForm: ProjectFormData = { ...data, project_images: related.images, service_ids: related.serviceIds, team_credits: data.team_credits || [] };
      const draft = loadFromLocalStorage();
      const draftAge = draft ? Date.now() - new Date(draft.timestamp).getTime() : Infinity;
      const restore = draft && draftAge >= 0 && draftAge < 24 * 60 * 60 * 1000
        && draft.data && Array.isArray(draft.data.project_images) && Array.isArray(draft.data.service_ids);
      setFormData(restore ? { ...loadedForm, ...draft.data } : loadedForm);
      setRelationships(related);
      setHasUnsavedChanges(!!restore);
      setLoadedProjectId(id);
      if (restore) toast({ title: "Draft Restored", description: "Your unsaved changes have been restored" });
    } catch (error) {
      if (request !== loadSequence.current) return;
      setLoadError(error instanceof Error ? error.message : "Could not load the complete project.");
    } finally {
      if (request === loadSequence.current) setIsLoading(false);
    }
  };

  // Form completion tracking
  const completion = useFormCompletion(formData);

  // Auto-save functionality
  const autoSaveHandler = useCallback(async (data: ProjectFormData) => {
    if (!id || id === "new" || loadedProjectId !== id) return;
    try {
      const { error } = await supabase.from("projects").update(projectSavePayload(data)).eq("id", id).select("id").single();
      if (error) throw error;
      setAutoSaveError(null);
    } catch (error) {
      setAutoSaveError("Project details could not be autosaved. Your unsaved form is retained; use Save Project to retry.");
      throw error;
    }
  }, [id, loadedProjectId]);

  const { lastSaved, isSaving, loadFromLocalStorage, clearLocalStorage } = useAutoSave(
    formData,
    autoSaveHandler,
    { 
      interval: 30000, 
      enabled: id !== "new" && loadedProjectId === id && hasUnsavedChanges && !isLoading,
      storageKey: `project-draft-${id}` 
    }
  );

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 's',
      ctrl: true,
      handler: (e) => {
        e.preventDefault();
        void handleSubmit();
      }
    }
  ]);

  const handleFormChange = (updates: Partial<ProjectFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!canEditProject || isLoading || isSaving) return;
    if (!slugStatus.isAvailable) {
      toast({ title: "Error", description: "Please choose a unique slug", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setSaveError(null);
    let projectDetailsSaved = false;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "Authentication Error", description: "You must be logged in", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      const savedId = id === "new" ? createdProjectId : id;
      const finalProjectData = { ...projectSavePayload(formData), updated_by: user.id, ...(!savedId && { created_by: user.id }) };
      const { error, data } = !savedId
        ? await supabase.from("projects").insert([finalProjectData]).select().single()
        : await supabase.from("projects").update(finalProjectData).eq("id", savedId).select().single();
      if (error || !data) throw new Error(error?.message || "Could not save project details.");
      projectDetailsSaved = true;
      const projectId = data.id;
      if (id === "new") setCreatedProjectId(projectId);
      const savedRelationships = await saveProjectRelationships(projectId, { images: formData.project_images, serviceIds: formData.service_ids }, relationships);
      setRelationships(savedRelationships);
      setFormData((current) => ({ ...current, project_images: savedRelationships.images, service_ids: savedRelationships.serviceIds }));
      toast({ title: "Success", description: id === "new" ? "Project created" : "Project updated" });
      setHasUnsavedChanges(false);
      setAutoSaveError(null);
      clearLocalStorage();
      if (id === "new") navigate(`/admin/projects/${projectId}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
      const description = projectDetailsSaved ? `Project details were saved, but the full save is incomplete. ${message}` : message;
      setSaveError(description);
      setHasUnsavedChanges(true);
      toast({ title: "Project Save Incomplete", description, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = async () => {
    if (!id || id === "new") {
      toast({ title: "Save First", description: "Please save before previewing", variant: "destructive" });
      return;
    }
    if (!canEditProject) return;
    const token = generatePreviewToken();
    await supabase.from("projects").update({ preview_token: token, preview_token_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() }).eq("id", id);
    window.open(`/projects/${formData.slug}?preview=${token}`, "_blank");
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
        <ProjectEditorHeader
          isNew={id === "new"}
          isLoading={isLoading}
          saveDisabled={!canEditProject}
          isSaving={isSaving}
          lastSaved={lastSaved}
          completionPercentage={completion.overall.percentage}
          publishState={formData.publish_state}
          onBack={() => navigate("/admin/projects")}
          onSave={() => handleSubmit()}
          onPreview={handlePreview}
        />
        
        <main className="container mx-auto px-4 py-8">
          {autoSaveError && <p role="alert" className="mb-4 rounded-lg border border-destructive/40 p-4 text-sm text-destructive">{autoSaveError}</p>}
          {saveError && <p role="alert" className="mb-4 rounded-lg border border-destructive/40 p-4 text-sm text-destructive">{saveError} Your unsaved form is retained. Retry with Save Project.</p>}
          {!canEditProject ? (
            loadError ? <div role="alert" className="rounded-lg border border-destructive/40 p-4 space-y-3"><p>{loadError} Editing is unavailable until the full project loads.</p><Button variant="outline" onClick={() => void loadProject()}>Retry loading project</Button></div>
              : <p className="text-muted-foreground">Loading complete project…</p>
          ) : <fieldset disabled={isLoading || isSaving} className="min-w-0">
          <div className="flex gap-6">
            {/* Main Content */}
            <div className="flex-1">
              <Tabs defaultValue="basic" className="space-y-6">
                <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
                  <TabsTrigger value="basic" className="relative">
                    Basic Info
                    {completion.tabs.basic && completion.tabs.basic.percentage === 100 && (
                      <Badge variant="success" className="ml-2 h-4 w-4 p-0 rounded-full" />
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="images" className="relative">
                    Images
                    {completion.tabs.images && completion.tabs.images.percentage === 100 && (
                      <Badge variant="success" className="ml-2 h-4 w-4 p-0 rounded-full" />
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="details" className="relative">
                    Details
                    {completion.tabs.details && completion.tabs.details.percentage === 100 && (
                      <Badge variant="success" className="ml-2 h-4 w-4 p-0 rounded-full" />
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="services" className="relative">
                    Services
                    {completion.tabs.services && completion.tabs.services.percentage === 100 && (
                      <Badge variant="success" className="ml-2 h-4 w-4 p-0 rounded-full" />
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="metrics">Metrics</TabsTrigger>
                  <TabsTrigger value="seo" className="relative">
                    SEO
                    {completion.tabs.seo && completion.tabs.seo.percentage === 100 && (
                      <Badge variant="success" className="ml-2 h-4 w-4 p-0 rounded-full" />
                    )}
                  </TabsTrigger>
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
            </div>

            {/* Sidebar - Completion Checklist */}
            <div className="hidden xl:block w-80">
              <CompletionChecklist completion={completion} />
            </div>
          </div>
          </fieldset>}
        </main>
      </div>
    </>
  );
};

export default ProjectEditor;
