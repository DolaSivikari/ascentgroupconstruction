import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { savePreviewLink } from "@/lib/admin/contentPreview";
import { adminErrorMessage, normalizeSlug } from "@/lib/admin/editorValues";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { useLocalDraft, type LocalDraft } from "@/hooks/useLocalDraft";
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
import {
  projectSavePayload,
  type ProjectFormData,
} from "@/lib/admin/projectEditor";
import {
  loadProjectRelationships,
  saveProjectRelationships,
  type ProjectRelationships,
  removeSavedGalleryFiles,
} from "@/lib/admin/projectPersistence";
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
  on_time_completion: null,
  on_budget: null,
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
  const [restoreDraft, setRestoreDraft] =
    useState<LocalDraft<ProjectFormData> | null>(null);
  const [createdProjectId, setCreatedProjectId] = useState<string | null>(null);
  const [relationships, setRelationships] = useState<ProjectRelationships>({
    images: [],
    serviceIds: [],
  });
  const loadSequence = useRef(0);
  const canEditProject = id === "new" || loadedProjectId === id;
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const {
    showDialog,
    confirmNavigation,
    cancelNavigation,
    markSaved,
    message,
  } = useUnsavedChanges({ hasUnsavedChanges });
  const [slugStatus, setSlugStatus] = useState<{
    isChecking: boolean;
    isAvailable: boolean;
    message: string;
  }>({ isChecking: false, isAvailable: true, message: "" });

  const [formData, setFormData] =
    useState<ProjectFormData>(INITIAL_PROJECT_FORM);

  useEffect(() => {
    if (formData.title && !formData.slug && id === "new") {
      const autoSlug = normalizeSlug(formData.title);
      setFormData((prev) => ({ ...prev, slug: autoSlug }));
    }
  }, [formData.title, id]);

  useEffect(() => {
    const checkSlugUniqueness = async () => {
      if (!formData.slug) {
        setSlugStatus({ isChecking: false, isAvailable: true, message: "" });
        return;
      }
      setSlugStatus({
        isChecking: true,
        isAvailable: true,
        message: "Checking...",
      });
      const { data } = await supabase
        .from("projects")
        .select("id, slug")
        .eq("slug", formData.slug);
      const existingProject = data?.find(
        (p) => p.id !== (id === "new" ? createdProjectId : id),
      );
      setSlugStatus({
        isChecking: false,
        isAvailable: !existingProject,
        message: existingProject ? "⚠ Slug already in use" : "✓ Available",
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
    setRestoreDraft(null);
    setRelationships({ images: [], serviceIds: [] });
    if (id && id !== "new") {
      void loadProject();
    } else if (id === "new") {
      setFormData(INITIAL_PROJECT_FORM);
      const savedDraft = loadFromLocalStorage();
      if (validDraft(savedDraft)) setRestoreDraft(savedDraft);
      setHasUnsavedChanges(false);
      // Show reminder for new projects
      toast({
        title: "📝 Remember to publish",
        description:
          "Set Publication Status to 'Published' in the SEO tab to make your project visible on the website.",
        duration: 6000,
      });
    }
    return () => {
      loadSequence.current += 1;
    };
  }, [id]);

  const loadProject = async () => {
    if (!id || id === "new") return;
    const request = ++loadSequence.current;
    setIsLoading(true);
    setLoadedProjectId(null);
    setLoadError(null);
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();
      if (error || !data) throw new Error("Could not load this project.");
      const related = await loadProjectRelationships(id);
      if (request !== loadSequence.current) return;
      const loadedForm: ProjectFormData = {
        ...data,
        project_images: related.images,
        service_ids: related.serviceIds,
        team_credits: data.team_credits || [],
      };
      const draft = loadFromLocalStorage();
      setFormData(loadedForm);
      setRelationships(related);
      setHasUnsavedChanges(false);
      setLoadedProjectId(id);
      if (validDraft(draft)) setRestoreDraft(draft);
    } catch (error) {
      if (request !== loadSequence.current) return;
      setLoadError(
        error instanceof Error
          ? error.message
          : "Could not load the complete project.",
      );
    } finally {
      if (request === loadSequence.current) setIsLoading(false);
    }
  };

  // Form completion tracking
  const completion = useFormCompletion(formData);

  const {
    lastSaved,
    error: draftError,
    loadFromLocalStorage,
    clearLocalStorage,
  } = useLocalDraft(
    formData,
    `project-draft-${id}`,
    canEditProject && hasUnsavedChanges && !isLoading,
  );
  const isSaving = false;
  const validDraft = (draft: LocalDraft<ProjectFormData> | null) =>
    !!draft &&
    typeof draft.data.title === "string" &&
    typeof draft.data.slug === "string" &&
    Array.isArray(draft.data.project_images) &&
    Array.isArray(draft.data.service_ids);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: "s",
      ctrl: true,
      handler: (e) => {
        e.preventDefault();
        document
          .querySelector<HTMLFormElement>("#project-editor-form")
          ?.requestSubmit();
      },
    },
  ]);

  const handleFormChange = (updates: Partial<ProjectFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!canEditProject || isLoading || isSaving) return;
    if (!slugStatus.isAvailable) {
      toast({
        title: "Error",
        description: "Please choose a unique slug",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setSaveError(null);
    let projectDetailsSaved = false;
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      const savedId = id === "new" ? createdProjectId : id;
      const finalProjectData = {
        ...projectSavePayload(formData),
        updated_by: user.id,
        ...(!savedId && { created_by: user.id }),
      };
      const { error, data } = !savedId
        ? await supabase
            .from("projects")
            .insert([finalProjectData])
            .select()
            .single()
        : await supabase
            .from("projects")
            .update(finalProjectData)
            .eq("id", savedId)
            .select()
            .single();
      if (error) throw error;
      if (!data) throw new Error("Could not save project details.");
      projectDetailsSaved = true;
      const projectId = data.id;
      if (id === "new") setCreatedProjectId(projectId);
      const savedRelationships = await saveProjectRelationships(
        projectId,
        { images: formData.project_images, serviceIds: formData.service_ids },
        relationships,
      );
      const removedImages = relationships.images.filter(
        (image) =>
          !savedRelationships.images.some((saved) => saved.url === image.url),
      );
      setRelationships(savedRelationships);
      const cleanupWarning = await removeSavedGalleryFiles(removedImages);
      setFormData((current) => ({
        ...current,
        project_images: savedRelationships.images,
        service_ids: savedRelationships.serviceIds,
      }));
      toast({
        title: "Success",
        description: id === "new" ? "Project created" : "Project updated",
      });
      setHasUnsavedChanges(false);
      markSaved();
      setRestoreDraft(null);
      if (cleanupWarning)
        toast({
          title: "Project saved; file cleanup needs attention",
          description: cleanupWarning,
          variant: "destructive",
        });
      clearLocalStorage();
      if (id === "new") navigate(`/admin/projects/${projectId}`);
    } catch (error) {
      const message = adminErrorMessage(error);
      const description = projectDetailsSaved
        ? `Project details were saved, but the full save is incomplete. ${message}`
        : message;
      setSaveError(description);
      setHasUnsavedChanges(true);
      toast({
        title: "Project Save Incomplete",
        description,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = async () => {
    if (!id || id === "new") {
      toast({
        title: "Save First",
        description: "Please save before previewing",
        variant: "destructive",
      });
      return;
    }
    if (!canEditProject) return;
    try {
      const url = await savePreviewLink("projects", id, formData.slug);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast({
        title: "Preview unavailable",
        description: adminErrorMessage(error),
        variant: "destructive",
      });
    }
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
          onSave={() =>
            document
              .querySelector<HTMLFormElement>("#project-editor-form")
              ?.requestSubmit()
          }
          onPreview={handlePreview}
        />

        <main className="container mx-auto px-4 py-8">
          {draftError && (
            <p
              role="alert"
              className="mb-4 rounded-lg border border-destructive/40 p-4 text-sm text-destructive"
            >
              {draftError}
            </p>
          )}
          {restoreDraft && (
            <div className="mb-4 rounded-lg border p-4 flex flex-wrap items-center gap-3">
              <p className="text-sm">
                Unsaved changes from{" "}
                {new Date(restoreDraft.timestamp).toLocaleString()} are
                available on this device.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData((current) => ({
                    ...current,
                    ...restoreDraft.data,
                  }));
                  setHasUnsavedChanges(true);
                  setRestoreDraft(null);
                }}
              >
                Restore unsaved changes
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  clearLocalStorage();
                  setRestoreDraft(null);
                }}
              >
                Discard local draft
              </Button>
            </div>
          )}
          {saveError && (
            <p
              role="alert"
              className="mb-4 rounded-lg border border-destructive/40 p-4 text-sm text-destructive"
            >
              {saveError} Your unsaved form is retained. Retry with Save
              Project.
            </p>
          )}
          {!canEditProject ? (
            loadError ? (
              <div
                role="alert"
                className="rounded-lg border border-destructive/40 p-4 space-y-3"
              >
                <p>
                  {loadError} Editing is unavailable until the full project
                  loads.
                </p>
                <Button variant="outline" onClick={() => void loadProject()}>
                  Retry loading project
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground">Loading complete project…</p>
            )
          ) : (
            <form id="project-editor-form" onSubmit={handleSubmit}>
              <fieldset disabled={isLoading || isSaving} className="min-w-0">
                <div className="flex gap-6">
                  {/* Main Content */}
                  <div className="flex-1">
                    <Tabs defaultValue="basic" className="space-y-6">
                      <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 h-auto lg:w-auto lg:inline-grid">
                        <TabsTrigger value="basic" className="relative">
                          Basic Info
                          {completion.tabs.basic &&
                            completion.tabs.basic.percentage === 100 && (
                              <Badge
                                variant="success"
                                className="ml-2 h-4 w-4 p-0 rounded-full"
                              />
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="images" className="relative">
                          Images
                          {completion.tabs.images &&
                            completion.tabs.images.percentage === 100 && (
                              <Badge
                                variant="success"
                                className="ml-2 h-4 w-4 p-0 rounded-full"
                              />
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="details" className="relative">
                          Details
                          {completion.tabs.details &&
                            completion.tabs.details.percentage === 100 && (
                              <Badge
                                variant="success"
                                className="ml-2 h-4 w-4 p-0 rounded-full"
                              />
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="services" className="relative">
                          Services
                          {completion.tabs.services &&
                            completion.tabs.services.percentage === 100 && (
                              <Badge
                                variant="success"
                                className="ml-2 h-4 w-4 p-0 rounded-full"
                              />
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="metrics">Metrics</TabsTrigger>
                        <TabsTrigger value="seo" className="relative">
                          SEO
                          {completion.tabs.seo &&
                            completion.tabs.seo.percentage === 100 && (
                              <Badge
                                variant="success"
                                className="ml-2 h-4 w-4 p-0 rounded-full"
                              />
                            )}
                        </TabsTrigger>
                      </TabsList>

                      <div className="bg-background rounded-lg border p-6">
                        <TabsContent value="basic" className="mt-0">
                          <BasicInfoTab
                            formData={formData}
                            slugStatus={slugStatus}
                            onFormChange={handleFormChange}
                          />
                        </TabsContent>
                        <TabsContent value="images" className="mt-0">
                          <ImagesTab
                            projectId={id}
                            formData={formData}
                            onFormChange={handleFormChange}
                          />
                        </TabsContent>
                        <TabsContent value="details" className="mt-0">
                          <ProjectDetailsTab
                            formData={formData}
                            onFormChange={handleFormChange}
                          />
                        </TabsContent>
                        <TabsContent value="services" className="mt-0">
                          <ServicesTab
                            formData={formData}
                            onFormChange={handleFormChange}
                          />
                        </TabsContent>
                        <TabsContent value="metrics" className="mt-0">
                          <MetricsTab
                            formData={formData}
                            onFormChange={handleFormChange}
                          />
                        </TabsContent>
                        <TabsContent value="seo" className="mt-0">
                          <SEOTab
                            formData={formData}
                            onFormChange={handleFormChange}
                          />
                        </TabsContent>
                      </div>
                    </Tabs>
                  </div>

                  {/* Sidebar - Completion Checklist */}
                  <div className="hidden xl:block w-80">
                    <CompletionChecklist completion={completion} />
                  </div>
                </div>
              </fieldset>
            </form>
          )}
        </main>
      </div>
    </>
  );
};

export default ProjectEditor;
