import {
  AdminSectionWorkspace,
  AdminSectionScreen,
} from "@/components/admin/AdminSectionWorkspace";
import { validateSectionForm } from "@/lib/admin/sectionValidation";
import { EditorActions } from "@/components/admin/EditorActions";
import { LocalDraftRecovery } from "@/components/admin/LocalDraftRecovery";
import { ProcessStepsEditor } from "@/components/admin/ProcessStepsEditor";
import { useLocalDraft } from "@/hooks/useLocalDraft";
import { useSlugAvailability } from "@/hooks/useSlugAvailability";
import { useEffect, useState, useRef } from "react";
import type { Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { MultiImageUpload } from "@/components/admin/MultiImageUpload";
import { savePreviewLink } from "@/lib/admin/contentPreview";
import {
  adminErrorMessage,
  normalizeSlug,
  nullableDate,
  nullableInteger,
} from "@/lib/admin/editorValues";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import DOMPurify from "dompurify";

const INITIAL_BLOG_FORM = {
  title: "",
  slug: "",
  summary: "",
  content: "",
  category: "",
  tags: "",
  featured_image: "",
  seo_title: "",
  seo_description: "",
  seo_keywords: "",
  read_time_minutes: "5",
  publish_state: "draft" as "draft" | "published" | "archived" | "scheduled",
  content_type: "article" as
    | "article"
    | "case-study"
    | "case_study"
    | "insight",
  sector: "General" as "General" | "Infrastructure" | "Buildings" | "Both",
  source: "",
  is_pinned: false,
  // Case study specific fields
  project_location: "",
  project_size: "",
  project_duration: "",
  challenge: "",
  solution: "",
  results: "",
  client_name: "",
  budget_range: "",
  before_images: [] as any[],
  after_images: [] as any[],
  process_steps: [] as any[],
  published_at: null as string | null,
};

const BlogPostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNewPost = id === "new";
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const {
    showDialog,
    confirmNavigation,
    cancelNavigation,
    markSaved,
    message,
  } = useUnsavedChanges({
    hasUnsavedChanges,
    preserveDraftQueryKeys: ["section"],
  });

  const [saving, setSaving] = useState(false);
  const [ready, setReady] = useState(isNewPost);
  const [formData, setFormData] = useState(INITIAL_BLOG_FORM);
  const loadSequence = useRef(0);
  const [serverSavedAt, setServerSavedAt] = useState<Date | null>(null);
  const draftKey = `blog-draft-${id || "new"}`;
  const localDraft = useLocalDraft(
    formData,
    draftKey,
    ready && hasUnsavedChanges,
  );
  const slugAvailability = useSlugAvailability(
    "blog_posts",
    formData.slug || normalizeSlug(formData.title),
    id,
  );

  useEffect(() => {
    void checkAuth();
    setHasUnsavedChanges(false);
    setReady(isNewPost);
    setFormData(INITIAL_BLOG_FORM);
    if (!isNewPost) void loadPost();
    return () => {
      loadSequence.current += 1;
    };
  }, [id]);

  const checkAuth = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      navigate("/tekev");
    }
  };

  const loadPost = async () => {
    if (!id) return;
    setReady(false);
    const request = ++loadSequence.current;

    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .single();

    if (request !== loadSequence.current) return;
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load blog post",
        variant: "destructive",
      });
      navigate("/admin/blog");
    } else if (data) {
      setReady(true);
      setHasUnsavedChanges(false);
      setFormData({
        title: data.title || "",
        slug: data.slug || "",
        summary: data.summary || "",
        content: data.content || "",
        category: data.category || "",
        tags: data.tags?.join(", ") || "",
        featured_image: data.featured_image || "",
        seo_title: data.seo_title || "",
        seo_description: data.seo_description || "",
        seo_keywords: data.seo_keywords?.join(", ") || "",
        read_time_minutes:
          data.read_time_minutes == null ? "" : String(data.read_time_minutes),
        publish_state:
          (data.publish_state as typeof formData.publish_state) || "draft",
        content_type: data.content_type || "article",
        sector: (data.sector as typeof formData.sector) || "General",
        source: data.source || "",
        is_pinned: data.is_pinned || false,
        project_location: data.project_location || "",
        project_size: data.project_size || "",
        project_duration: data.project_duration || "",
        challenge: data.challenge || "",
        solution: data.solution || "",
        results: data.results || "",
        client_name: data.client_name || "",
        budget_range: data.budget_range || "",
        before_images: Array.isArray(data.before_images)
          ? data.before_images
          : [],
        after_images: Array.isArray(data.after_images) ? data.after_images : [],
        process_steps: Array.isArray(data.process_steps)
          ? data.process_steps
          : [],
        published_at: data.published_at || null,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (slugAvailability.checking || !slugAvailability.available) {
      toast({
        title: "Check the slug",
        description: slugAvailability.message,
        variant: "destructive",
      });
      return;
    }
    if (!ready || saving) return;
    if (!validateSectionForm(e.currentTarget as HTMLFormElement, navigate))
      return;

    if (
      !formData.title.trim() ||
      !normalizeSlug(formData.slug || formData.title) ||
      !formData.content.trim()
    ) {
      toast({
        title: "Required fields missing",
        description: "Enter a title, a valid slug and content before saving.",
        variant: "destructive",
      });
      return;
    }
    // Validate content length (client-side check before DB constraint)
    const MAX_CONTENT_LENGTH = 50000;
    const MAX_SUMMARY_LENGTH = 500;

    if (formData.content.length > MAX_CONTENT_LENGTH) {
      toast({
        title: "Content too long",
        description: `Content must be under ${MAX_CONTENT_LENGTH.toLocaleString()} characters. Current: ${formData.content.length.toLocaleString()}`,
        variant: "destructive",
      });
      return;
    }

    if (formData.summary.length > MAX_SUMMARY_LENGTH) {
      toast({
        title: "Summary too long",
        description: `Summary must be under ${MAX_SUMMARY_LENGTH} characters. Current: ${formData.summary.length}`,
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user)
        throw new Error("Your session has expired. Sign in again to save.");

      const postData: Database["public"]["Tables"]["blog_posts"]["Insert"] = {
        title: formData.title,
        slug: normalizeSlug(formData.slug || formData.title),
        summary: formData.summary,
        content: DOMPurify.sanitize(formData.content),
        category: formData.category,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        featured_image: formData.featured_image,
        seo_title: formData.seo_title || formData.title,
        seo_description: formData.seo_description || formData.summary,
        seo_keywords: formData.seo_keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
        read_time_minutes: nullableInteger(
          formData.read_time_minutes,
          "Read time",
        ),
        sector: formData.sector,
        source: formData.source.trim() || null,
        is_pinned: formData.is_pinned,
        publish_state: formData.publish_state,
        published_at:
          formData.publish_state === "published"
            ? nullableDate(formData.published_at) || new Date().toISOString()
            : null,
        content_type: formData.content_type,
        ...((formData.content_type === "case-study" ||
          formData.content_type === "case_study") && {
          project_location: formData.project_location,
          project_size: formData.project_size,
          project_duration: formData.project_duration,
          challenge: formData.challenge,
          solution: formData.solution,
          results: formData.results,
          client_name: formData.client_name,
          budget_range: formData.budget_range,
          before_images: formData.before_images,
          after_images: formData.after_images,
          process_steps: formData.process_steps,
        }),
        ...(isNewPost ? { created_by: user.id } : { updated_by: user.id }),
      };

      const { error, data } = isNewPost
        ? await supabase.from("blog_posts").insert(postData).select().single()
        : await supabase
            .from("blog_posts")
            .update(postData)
            .eq("id", id)
            .select()
            .single();

      if (error) throw error;
      if (!data)
        throw new Error(
          "The saved post could not be verified. Your edits are retained.",
        );
      {
        toast({
          title: "Success",
          description: `Blog post ${isNewPost ? "created" : "updated"} successfully`,
        });

        if (data && formData.publish_state === "published") {
          toast({
            title: "Published!",
            description:
              "The post is saved as Published. Verify it in website preview.",
          });
        }

        setHasUnsavedChanges(false);
        markSaved();
        localDraft.clearLocalStorage();
        setServerSavedAt(new Date());
        if (isNewPost) navigate(`/admin/blog/${data.id}`, { replace: true });
      }
    } catch (error) {
      toast({
        title: "Post could not be saved",
        description: adminErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = async () => {
    if (!ready || saving) return;
    try {
      const url = await savePreviewLink(
        "blog_posts",
        id || "new",
        formData.slug,
      );
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast({
        title: "Preview unavailable",
        description: adminErrorMessage(error),
        variant: "destructive",
      });
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
        <EditorActions
          title={isNewPost ? "New blog post" : "Edit blog post"}
          state={formData.publish_state}
          onStateChange={(publish_state) => handleFormChange({ publish_state })}
          formId="blog-editor-form"
          disabled={
            !ready ||
            saving ||
            slugAvailability.checking ||
            !slugAvailability.available
          }
          onPreview={!isNewPost ? handlePreview : undefined}
          savedAt={serverSavedAt}
          draftAt={localDraft.lastSaved}
        />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <LocalDraftRecovery
            storageKey={draftKey}
            load={localDraft.loadFromLocalStorage}
            discard={localDraft.clearLocalStorage}
            restore={(value) => {
              setFormData(value);
              setHasUnsavedChanges(true);
            }}
          />
          {localDraft.error && (
            <p role="alert" className="text-destructive">
              {localDraft.error}
            </p>
          )}
          <p role="status" className="text-sm mb-3">
            {slugAvailability.message}
          </p>

          <form
            noValidate
            id="blog-editor-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <fieldset disabled={!ready || saving} className="space-y-6 min-w-0">
              <AdminSectionWorkspace
                label="Blog editor sections"
                items={[
                  { id: "basics", title: "Overview" },
                  { id: "content", title: "Content" },
                  { id: "details", title: "Details & tags" },
                  { id: "images", title: "Featured image" },
                  { id: "seo", title: "SEO" },
                  ...(["case-study", "case_study"].includes(
                    formData.content_type,
                  )
                    ? [
                        { id: "case-details", title: "Case study details" },
                        { id: "case-images", title: "Before & after images" },
                        { id: "process", title: "Process" },
                        { id: "challenge", title: "Challenge" },
                        { id: "solution", title: "Solution" },
                        { id: "results", title: "Results" },
                      ]
                    : []),
                ]}
              >
                <AdminSectionScreen id="basics" title="Overview">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        handleFormChange({ title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) =>
                        handleFormChange({
                          slug: normalizeSlug(e.target.value),
                        })
                      }
                      placeholder="Auto-generated from title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="summary">Summary</Label>
                    <Textarea
                      id="summary"
                      value={formData.summary}
                      onChange={(e) =>
                        handleFormChange({ summary: e.target.value })
                      }
                      rows={3}
                      maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.summary.length} / 500 characters
                      {formData.summary.length > 450 && (
                        <span className="text-warning ml-2">
                          ⚠️ Approaching limit
                        </span>
                      )}
                    </p>
                  </div>
                </AdminSectionScreen>
                <AdminSectionScreen id="content" title="Content">
                  <RichTextEditor
                    id="blog-content"
                    label="Content *"
                    value={formData.content || ""}
                    onChange={(value) => handleFormChange({ content: value })}
                    placeholder="Write your blog post content here..."
                    required
                    minHeight="300px"
                    maxLength={50000}
                  />
                </AdminSectionScreen>
                <AdminSectionScreen id="details" title="Details & tags">
                  <div
                    id="blog-details"
                    className="admin-editor-section grid sm:grid-cols-2 gap-4"
                  >
                    <div>
                      <Label htmlFor="content_type">Content Type</Label>
                      <Select
                        value={formData.content_type}
                        onValueChange={(value: typeof formData.content_type) =>
                          handleFormChange({ content_type: value })
                        }
                      >
                        <SelectTrigger id="content_type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="article">Article</SelectItem>
                          <SelectItem value="case-study">Case Study</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          handleFormChange({ category: value })
                        }
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Case Study">Case Study</SelectItem>
                          <SelectItem value="Painting">Painting</SelectItem>
                          <SelectItem value="Commercial">Commercial</SelectItem>
                          <SelectItem value="Residential">
                            Residential
                          </SelectItem>
                          <SelectItem value="Industrial">Industrial</SelectItem>
                          <SelectItem value="Institutional">
                            Institutional
                          </SelectItem>
                          <SelectItem value="Restoration">
                            Restoration
                          </SelectItem>
                          <SelectItem value="Waterproofing">
                            Waterproofing
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="sector">Sector</Label>
                      <Select
                        value={formData.sector}
                        onValueChange={(value: typeof formData.sector) =>
                          handleFormChange({ sector: value })
                        }
                      >
                        <SelectTrigger id="sector">
                          <SelectValue placeholder="Select sector" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="General">General</SelectItem>
                          <SelectItem value="Infrastructure">
                            Infrastructure
                          </SelectItem>
                          <SelectItem value="Buildings">Buildings</SelectItem>
                          <SelectItem value="Both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="read_time">Read Time (minutes)</Label>
                      <Input
                        id="read_time"
                        type="number"
                        value={formData.read_time_minutes}
                        onChange={(e) =>
                          handleFormChange({
                            read_time_minutes: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="source">Source Attribution</Label>
                    <Input
                      id="source"
                      value={formData.source}
                      onChange={(e) =>
                        handleFormChange({ source: e.target.value })
                      }
                      placeholder="e.g., WSP, Autodesk, Procore (leave empty if original content)"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Add source if this content references or is attributed to
                      an external source
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_pinned"
                      checked={formData.is_pinned}
                      onChange={(e) =>
                        handleFormChange({ is_pinned: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-border"
                    />
                    <Label htmlFor="is_pinned" className="cursor-pointer">
                      Pin this insight (appears first in feeds)
                    </Label>
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) =>
                        handleFormChange({ tags: e.target.value })
                      }
                      placeholder="painting, commercial, tips"
                    />
                  </div>
                </AdminSectionScreen>
                <AdminSectionScreen id="images" title="Featured image">
                  <ImageUploadField
                    value={formData.featured_image}
                    onChange={(url) =>
                      handleFormChange({ featured_image: url })
                    }
                    bucket="project-images"
                    label="Featured Image"
                  />
                </AdminSectionScreen>
                <AdminSectionScreen id="seo" title="SEO">
                  <div>
                    <Label htmlFor="seo_title">SEO Title</Label>
                    <Input
                      id="seo_title"
                      value={formData.seo_title}
                      onChange={(e) =>
                        handleFormChange({ seo_title: e.target.value })
                      }
                      placeholder="Defaults to post title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="seo_description">SEO Description</Label>
                    <Textarea
                      id="seo_description"
                      value={formData.seo_description}
                      onChange={(e) =>
                        handleFormChange({ seo_description: e.target.value })
                      }
                      rows={2}
                      placeholder="Defaults to summary"
                    />
                  </div>
                  <div>
                    <Label htmlFor="seo_keywords">
                      SEO Keywords (comma-separated)
                    </Label>
                    <Input
                      id="seo_keywords"
                      value={formData.seo_keywords}
                      onChange={(e) =>
                        handleFormChange({ seo_keywords: e.target.value })
                      }
                      placeholder="painting services, commercial painting"
                    />
                  </div>
                </AdminSectionScreen>
                {["case-study", "case_study"].includes(
                  formData.content_type,
                ) && (
                  <>
                    <AdminSectionScreen
                      id="case-details"
                      title="Case study details"
                    >
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="project_location">
                            Project Location
                          </Label>
                          <Input
                            id="project_location"
                            value={formData.project_location}
                            onChange={(e) =>
                              handleFormChange({
                                project_location: e.target.value,
                              })
                            }
                            placeholder="e.g., Toronto, ON"
                          />
                        </div>
                        <div>
                          <Label htmlFor="project_size">Project Size</Label>
                          <Input
                            id="project_size"
                            value={formData.project_size}
                            onChange={(e) =>
                              handleFormChange({ project_size: e.target.value })
                            }
                            placeholder="e.g., 50,000 sq ft"
                          />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="project_duration">Duration</Label>
                          <Input
                            id="project_duration"
                            value={formData.project_duration}
                            onChange={(e) =>
                              handleFormChange({
                                project_duration: e.target.value,
                              })
                            }
                            placeholder="e.g., 6 months"
                          />
                        </div>
                      </div>
                    </AdminSectionScreen>
                    <AdminSectionScreen
                      id="case-images"
                      title="Before & after images"
                    >
                      <MultiImageUpload
                        images={formData.before_images}
                        onChange={(before_images) =>
                          handleFormChange({ before_images })
                        }
                        title="Before images"
                      />
                      <MultiImageUpload
                        images={formData.after_images}
                        onChange={(after_images) =>
                          handleFormChange({ after_images })
                        }
                        title="After images"
                      />
                    </AdminSectionScreen>
                    <AdminSectionScreen id="process" title="Process">
                      <div>
                        <ProcessStepsEditor
                          steps={formData.process_steps}
                          onChange={(process_steps) =>
                            handleFormChange({ process_steps })
                          }
                        />
                      </div>
                    </AdminSectionScreen>
                    <AdminSectionScreen id="challenge" title="Challenge">
                      <RichTextEditor
                        id="challenge"
                        label="Challenge"
                        value={formData.challenge || ""}
                        onChange={(value) =>
                          handleFormChange({ challenge: value })
                        }
                        placeholder="What was the main challenge?"
                        minHeight="150px"
                        maxLength={2000}
                      />
                    </AdminSectionScreen>
                    <AdminSectionScreen id="solution" title="Solution">
                      <RichTextEditor
                        id="solution"
                        label="Solution"
                        value={formData.solution || ""}
                        onChange={(value) =>
                          handleFormChange({ solution: value })
                        }
                        placeholder="How did you solve it?"
                        minHeight="150px"
                        maxLength={2000}
                      />
                    </AdminSectionScreen>
                    <AdminSectionScreen id="results" title="Results">
                      <RichTextEditor
                        id="results"
                        label="Results"
                        value={formData.results || ""}
                        onChange={(value) =>
                          handleFormChange({ results: value })
                        }
                        placeholder="What were the outcomes?"
                        minHeight="150px"
                        maxLength={2000}
                      />
                    </AdminSectionScreen>
                  </>
                )}
              </AdminSectionWorkspace>
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/blog")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={!ready || saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isNewPost ? "Create" : "Update"} Blog Post
                </Button>
              </div>
            </fieldset>
          </form>
        </main>
      </div>
    </>
  );
};

export default BlogPostEditor;
