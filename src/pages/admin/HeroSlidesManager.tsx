import {
  AdminSectionWorkspace,
  AdminSectionScreen,
} from "@/components/admin/AdminSectionWorkspace";
import { useNavigate } from "react-router-dom";
import { validateSectionForm } from "@/lib/admin/sectionValidation";
import { useQueryClient } from "@tanstack/react-query";
import {
  invalidateHomepageQueries,
  saveHeroOrder,
} from "@/lib/admin/homepageEditing";
import { adminErrorMessage } from "@/lib/admin/editorValues";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/ui/Card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  GripVertical,
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

interface HeroSlide {
  id: string;
  display_order: number;
  is_active: boolean;
  headline: string;
  subheadline: string;
  description?: string;
  stat_number?: string;
  stat_label?: string;
  primary_cta_text: string;
  primary_cta_url: string;
  primary_cta_icon?: string;
  secondary_cta_text?: string;
  secondary_cta_url?: string;
  video_url?: string;
  poster_url?: string;
}

const iconOptions = [
  "FileText",
  "Building2",
  "Award",
  "Shield",
  "Cpu",
  "Leaf",
  "Users",
  "Ruler",
  "ClipboardCheck",
  "Hammer",
  "Droplets",
];

const SortableSlideItem = ({
  slide,
  onEdit,
  onToggle,
  onDelete,
}: {
  slide: HeroSlide;
  onEdit: (slide: HeroSlide) => void;
  onToggle: (id: string, isActive: boolean) => void;
  onDelete: (id: string) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slide.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-card border rounded-lg p-4 mb-2"
    >
      <div className="flex items-center gap-4">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-2 hover:bg-muted rounded"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </button>

        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{slide.headline}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {slide.subheadline}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={slide.is_active}
            onCheckedChange={(checked) => onToggle(slide.id, checked)}
          />
          <span className="text-sm text-muted-foreground">
            {slide.is_active ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </span>
          <Button variant="outline" size="sm" onClick={() => onEdit(slide)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(slide.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const HeroSlidesManager = () => {
  const navigateSection = useNavigate();
  const queryClient = useQueryClient();
  const [reordering, setReordering] = useState(false);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [originalSlide, setOriginalSlide] = useState<HeroSlide | null>(null);
  const [saving, setSaving] = useState(false);
  const guard = useUnsavedChanges({
    hasUnsavedChanges:
      isDialogOpen &&
      JSON.stringify(editingSlide) !== JSON.stringify(originalSlide),
    preserveDraftQueryKeys: ["slide-section"],
  });
  const openSlide = (slide: HeroSlide) => {
    setOriginalSlide(slide);
    setEditingSlide(slide);
    setIsDialogOpen(true);
  };
  const closeEditor = () =>
    guard.requestDiscard(() => {
      setIsDialogOpen(false);
      setEditingSlide(null);
      setOriginalSlide(null);
    });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from("hero_slides")
        .select("*")
        .order("display_order");

      if (error) throw error;
      setSlides(data || []);
    } catch (error) {
      console.error("Error fetching slides:", error);
      toast.error("Failed to load hero slides");
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (reordering || !over || active.id === over.id) return;
    const oldIndex = slides.findIndex((slide) => slide.id === active.id);
    const newIndex = slides.findIndex((slide) => slide.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    setReordering(true);
    try {
      await saveHeroOrder(arrayMove(slides, oldIndex, newIndex));
      toast.success("Slide order updated");
    } catch (error) {
      toast.error(adminErrorMessage(error));
    } finally {
      invalidateHomepageQueries(queryClient);
      await fetchSlides();
      setReordering(false);
    }
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from("hero_slides")
        .update({ is_active: isActive })
        .eq("id", id);

      if (error) throw error;

      setSlides(
        slides.map((s) => (s.id === id ? { ...s, is_active: isActive } : s)),
      );
      invalidateHomepageQueries(queryClient);
      toast.success(isActive ? "Slide activated" : "Slide deactivated");
    } catch (error) {
      console.error("Error toggling slide:", error);
      toast.error(adminErrorMessage(error));
    }
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [slideToDelete, setSlideToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setSlideToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!slideToDelete) return;

    try {
      const { error } = await supabase
        .from("hero_slides")
        .delete()
        .eq("id", slideToDelete);

      if (error) throw error;

      setSlides(slides.filter((s) => s.id !== slideToDelete));
      invalidateHomepageQueries(queryClient);
      toast.success("Slide deleted");
    } catch (error) {
      console.error("Error deleting slide:", error);
      toast.error("Failed to delete slide");
    }
    setDeleteDialogOpen(false);
    setSlideToDelete(null);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingSlide || saving) return;
    if (!validateSectionForm(e.currentTarget, navigateSection)) return;
    setSaving(true);
    try {
      const { id, ...slideData } = editingSlide;

      if (id.startsWith("new-")) {
        // Create new slide
        const { error } = await supabase.from("hero_slides").insert([
          {
            ...slideData,
            display_order: slides.length + 1,
          },
        ]);

        if (error) throw error;
        toast.success("Slide created");
      } else {
        // Update existing slide
        const { error } = await supabase
          .from("hero_slides")
          .update(slideData)
          .eq("id", id)
          .select("id")
          .single();

        if (error) throw error;
        toast.success("Slide updated");
      }

      guard.markSaved();
      setIsDialogOpen(false);
      setEditingSlide(null);
      setOriginalSlide(null);
      invalidateHomepageQueries(queryClient);
      void fetchSlides();
    } catch (error) {
      console.error("Error saving slide:", error);
      toast.error(adminErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const openNewSlideDialog = () => {
    const slide: HeroSlide = {
      id: "new-" + Date.now(),
      display_order: slides.length + 1,
      is_active: true,
      headline: "",
      subheadline: "",
      description: "",
      stat_number: "",
      stat_label: "",
      primary_cta_text: "Submit RFP",
      primary_cta_url: "/submit-rfp",
      primary_cta_icon: "FileText",
      secondary_cta_text: "",
      secondary_cta_url: "",
      video_url: "/hero-clipchamp.mp4",
      poster_url: "/hero-poster-1.webp",
    };
    openSlide(slide);
  };

  return (
    <AdminPageLayout
      title="Hero Slides Manager"
      description="Manage homepage hero carousel slides - reorder, edit, and toggle visibility"
      backTo="/admin"
      backLabel="Back to Dashboard"
      actions={
        <Button onClick={openNewSlideDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Slide
        </Button>
      }
      loading={loading}
    >
      <Card className="p-6">
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Drag slides to reorder. Toggle the eye icon to show/hide slides on
            the homepage.
          </div>
          <div className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-amber-200 flex items-start gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 mt-0.5" />
            <span>
              The homepage reads active slides from this list. Check your saved
              changes in preview before publishing the website.
            </span>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={slides.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {slides.map((slide) => (
                <SortableSlideItem
                  key={slide.id}
                  slide={slide}
                  onEdit={openSlide}
                  onToggle={handleToggle}
                  onDelete={handleDeleteClick}
                />
              ))}
            </SortableContext>
          </DndContext>

          {slides.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              No slides yet. Click "Add New Slide" to create your first hero
              slide.
            </div>
          )}
        </div>
      </Card>

      <ConfirmDialog
        open={guard.showDialog}
        onOpenChange={guard.cancelNavigation}
        onConfirm={guard.confirmNavigation}
        title="Unsaved changes"
        description={guard.message}
        confirmText="Leave"
        cancelText="Stay"
      />
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open && !saving) closeEditor();
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSlide?.id.startsWith("new-")
                ? "Add New Slide"
                : "Edit Slide"}
            </DialogTitle>
          </DialogHeader>

          <form noValidate onSubmit={handleSave} className="space-y-4">
            <AdminSectionWorkspace
              queryKey="slide-section"
              label="Hero slide sections"
              items={[
                { id: "content", title: "Slide content" },
                { id: "actions", title: "Buttons & links" },
                { id: "media", title: "Video & poster" },
                { id: "visibility", title: "Visibility" },
              ]}
            >
              <AdminSectionScreen id="content" title="Slide content">
                <div>
                  <Label htmlFor="headline">Headline *</Label>
                  <Input
                    id="headline"
                    value={editingSlide?.headline || ""}
                    onChange={(e) =>
                      setEditingSlide((s) =>
                        s ? { ...s, headline: e.target.value } : null,
                      )
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subheadline">Subheadline *</Label>
                  <Input
                    id="subheadline"
                    value={editingSlide?.subheadline || ""}
                    onChange={(e) =>
                      setEditingSlide((s) =>
                        s ? { ...s, subheadline: e.target.value } : null,
                      )
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editingSlide?.description || ""}
                    onChange={(e) =>
                      setEditingSlide((s) =>
                        s ? { ...s, description: e.target.value } : null,
                      )
                    }
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="stat_number">Stat Number</Label>
                    <Input
                      id="stat_number"
                      value={editingSlide?.stat_number || ""}
                      onChange={(e) =>
                        setEditingSlide((s) =>
                          s ? { ...s, stat_number: e.target.value } : null,
                        )
                      }
                      placeholder="10+"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stat_label">Stat Label</Label>
                    <Input
                      id="stat_label"
                      value={editingSlide?.stat_label || ""}
                      onChange={(e) =>
                        setEditingSlide((s) =>
                          s ? { ...s, stat_label: e.target.value } : null,
                        )
                      }
                      placeholder="Projects Completed"
                    />
                  </div>
                </div>
              </AdminSectionScreen>
              <AdminSectionScreen id="actions" title="Buttons & links">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="primary_cta_text">Primary CTA Text *</Label>
                    <Input
                      id="primary_cta_text"
                      value={editingSlide?.primary_cta_text || ""}
                      onChange={(e) =>
                        setEditingSlide((s) =>
                          s ? { ...s, primary_cta_text: e.target.value } : null,
                        )
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="primary_cta_icon">CTA Icon</Label>
                    <select
                      id="primary_cta_icon"
                      value={editingSlide?.primary_cta_icon || "FileText"}
                      onChange={(e) =>
                        setEditingSlide((s) =>
                          s ? { ...s, primary_cta_icon: e.target.value } : null,
                        )
                      }
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    >
                      {iconOptions.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="primary_cta_url">Primary CTA URL *</Label>
                  <Input
                    id="primary_cta_url"
                    value={editingSlide?.primary_cta_url || ""}
                    onChange={(e) =>
                      setEditingSlide((s) =>
                        s ? { ...s, primary_cta_url: e.target.value } : null,
                      )
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="secondary_cta_text">Secondary CTA Text</Label>
                  <Input
                    id="secondary_cta_text"
                    value={editingSlide?.secondary_cta_text || ""}
                    onChange={(e) =>
                      setEditingSlide((s) =>
                        s ? { ...s, secondary_cta_text: e.target.value } : null,
                      )
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="secondary_cta_url">Secondary CTA URL</Label>
                  <Input
                    id="secondary_cta_url"
                    value={editingSlide?.secondary_cta_url || ""}
                    onChange={(e) =>
                      setEditingSlide((s) =>
                        s ? { ...s, secondary_cta_url: e.target.value } : null,
                      )
                    }
                  />
                </div>
              </AdminSectionScreen>
              <AdminSectionScreen id="media" title="Video & poster">
                <div>
                  <Label htmlFor="video_url">Video URL</Label>
                  <Input
                    id="video_url"
                    value={editingSlide?.video_url || ""}
                    onChange={(e) =>
                      setEditingSlide((s) =>
                        s ? { ...s, video_url: e.target.value } : null,
                      )
                    }
                    placeholder="/hero-clipchamp.mp4"
                  />
                </div>
                <div>
                  <Label htmlFor="poster_url">Poster Image URL</Label>
                  <Input
                    id="poster_url"
                    value={editingSlide?.poster_url || ""}
                    onChange={(e) =>
                      setEditingSlide((s) =>
                        s ? { ...s, poster_url: e.target.value } : null,
                      )
                    }
                    placeholder="/hero-poster-1.webp"
                  />
                </div>
              </AdminSectionScreen>
              <AdminSectionScreen id="visibility" title="Visibility">
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_active"
                    checked={editingSlide?.is_active || false}
                    onCheckedChange={(checked) =>
                      setEditingSlide((s) =>
                        s ? { ...s, is_active: checked } : null,
                      )
                    }
                  />
                  <Label htmlFor="is_active">
                    Active (visible on homepage)
                  </Label>
                </div>
              </AdminSectionScreen>
            </AdminSectionWorkspace>

            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeEditor}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                Save Slide
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Hero Slide"
        description="Are you sure you want to delete this hero slide? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
      />
    </AdminPageLayout>
  );
};

export default HeroSlidesManager;
