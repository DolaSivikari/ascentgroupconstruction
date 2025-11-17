import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
import { Button } from "@/ui/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, GripVertical, Eye, EyeOff, Trash2 } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
  'FileText', 'Building2', 'Award', 'Shield', 'Cpu', 'Leaf', 
  'Users', 'Ruler', 'ClipboardCheck', 'Hammer', 'Droplets'
];

const SortableSlideItem = ({ slide, onEdit, onToggle, onDelete }: { 
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
          <p className="text-sm text-muted-foreground line-clamp-1">{slide.subheadline}</p>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={slide.is_active}
            onCheckedChange={(checked) => onToggle(slide.id, checked)}
          />
          <span className="text-sm text-muted-foreground">
            {slide.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(slide)}
          >
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
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setSlides(data || []);
    } catch (error) {
      console.error('Error fetching slides:', error);
      toast.error('Failed to load hero slides');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = slides.findIndex((s) => s.id === active.id);
      const newIndex = slides.findIndex((s) => s.id === over.id);
      
      const newSlides = arrayMove(slides, oldIndex, newIndex);
      setSlides(newSlides);

      // Update display_order in database
      try {
        const updates = newSlides.map((slide, index) => ({
          id: slide.id,
          display_order: index + 1
        }));

        for (const update of updates) {
          await supabase
            .from('hero_slides')
            .update({ display_order: update.display_order })
            .eq('id', update.id);
        }

        toast.success('Slide order updated');
      } catch (error) {
        console.error('Error updating order:', error);
        toast.error('Failed to update slide order');
        fetchSlides(); // Revert on error
      }
    }
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('hero_slides')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;
      
      setSlides(slides.map(s => s.id === id ? { ...s, is_active: isActive } : s));
      toast.success(isActive ? 'Slide activated' : 'Slide deactivated');
    } catch (error) {
      console.error('Error toggling slide:', error);
      toast.error('Failed to update slide');
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
        .from('hero_slides')
        .delete()
        .eq('id', slideToDelete);

      if (error) throw error;
      
      setSlides(slides.filter(s => s.id !== slideToDelete));
      toast.success('Slide deleted');
    } catch (error) {
      console.error('Error deleting slide:', error);
      toast.error('Failed to delete slide');
    }
    setDeleteDialogOpen(false);
    setSlideToDelete(null);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingSlide) return;

    try {
      const { id, ...slideData } = editingSlide;
      
      if (id.startsWith('new-')) {
        // Create new slide
        const { error } = await supabase
          .from('hero_slides')
          .insert([{ 
            ...slideData,
            display_order: slides.length + 1 
          }]);

        if (error) throw error;
        toast.success('Slide created');
      } else {
        // Update existing slide
        const { error } = await supabase
          .from('hero_slides')
          .update(slideData)
          .eq('id', id);

        if (error) throw error;
        toast.success('Slide updated');
      }

      setIsDialogOpen(false);
      setEditingSlide(null);
      fetchSlides();
    } catch (error) {
      console.error('Error saving slide:', error);
      toast.error('Failed to save slide');
    }
  };

  const openNewSlideDialog = () => {
    setEditingSlide({
      id: 'new-' + Date.now(),
      display_order: slides.length + 1,
      is_active: true,
      headline: '',
      subheadline: '',
      description: '',
      stat_number: '',
      stat_label: '',
      primary_cta_text: 'Submit RFP',
      primary_cta_url: '/submit-rfp',
      primary_cta_icon: 'FileText',
      secondary_cta_text: '',
      secondary_cta_url: '',
      video_url: '/hero-clipchamp.mp4',
      poster_url: '/hero-poster-1.webp'
    });
    setIsDialogOpen(true);
  };

  return (
    <AdminPageLayout
      title="Hero Slides Manager"
      description="Manage homepage hero carousel slides - reorder, edit, and toggle visibility"
      backTo="/admin/dashboard"
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
            Drag slides to reorder. Toggle the eye icon to show/hide slides on the homepage.
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={slides.map(s => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {slides.map((slide) => (
                <SortableSlideItem
                  key={slide.id}
                  slide={slide}
                  onEdit={(s) => { setEditingSlide(s); setIsDialogOpen(true); }}
                  onToggle={handleToggle}
                  onDelete={handleDeleteClick}
                />
              ))}
            </SortableContext>
          </DndContext>

          {slides.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              No slides yet. Click "Add New Slide" to create your first hero slide.
            </div>
          )}
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSlide?.id.startsWith('new-') ? 'Add New Slide' : 'Edit Slide'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="headline">Headline *</Label>
                <Input
                  id="headline"
                  value={editingSlide?.headline || ''}
                  onChange={(e) => setEditingSlide(s => s ? { ...s, headline: e.target.value } : null)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="subheadline">Subheadline *</Label>
                <Input
                  id="subheadline"
                  value={editingSlide?.subheadline || ''}
                  onChange={(e) => setEditingSlide(s => s ? { ...s, subheadline: e.target.value } : null)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingSlide?.description || ''}
                  onChange={(e) => setEditingSlide(s => s ? { ...s, description: e.target.value } : null)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stat_number">Stat Number</Label>
                  <Input
                    id="stat_number"
                    value={editingSlide?.stat_number || ''}
                    onChange={(e) => setEditingSlide(s => s ? { ...s, stat_number: e.target.value } : null)}
                    placeholder="500+"
                  />
                </div>
                <div>
                  <Label htmlFor="stat_label">Stat Label</Label>
                  <Input
                    id="stat_label"
                    value={editingSlide?.stat_label || ''}
                    onChange={(e) => setEditingSlide(s => s ? { ...s, stat_label: e.target.value } : null)}
                    placeholder="Projects Completed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="primary_cta_text">Primary CTA Text *</Label>
                  <Input
                    id="primary_cta_text"
                    value={editingSlide?.primary_cta_text || ''}
                    onChange={(e) => setEditingSlide(s => s ? { ...s, primary_cta_text: e.target.value } : null)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="primary_cta_icon">CTA Icon</Label>
                  <select
                    id="primary_cta_icon"
                    value={editingSlide?.primary_cta_icon || 'FileText'}
                    onChange={(e) => setEditingSlide(s => s ? { ...s, primary_cta_icon: e.target.value } : null)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    {iconOptions.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="primary_cta_url">Primary CTA URL *</Label>
                <Input
                  id="primary_cta_url"
                  value={editingSlide?.primary_cta_url || ''}
                  onChange={(e) => setEditingSlide(s => s ? { ...s, primary_cta_url: e.target.value } : null)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="secondary_cta_text">Secondary CTA Text</Label>
                <Input
                  id="secondary_cta_text"
                  value={editingSlide?.secondary_cta_text || ''}
                  onChange={(e) => setEditingSlide(s => s ? { ...s, secondary_cta_text: e.target.value } : null)}
                />
              </div>

              <div>
                <Label htmlFor="secondary_cta_url">Secondary CTA URL</Label>
                <Input
                  id="secondary_cta_url"
                  value={editingSlide?.secondary_cta_url || ''}
                  onChange={(e) => setEditingSlide(s => s ? { ...s, secondary_cta_url: e.target.value } : null)}
                />
              </div>

              <div>
                <Label htmlFor="video_url">Video URL</Label>
                <Input
                  id="video_url"
                  value={editingSlide?.video_url || ''}
                  onChange={(e) => setEditingSlide(s => s ? { ...s, video_url: e.target.value } : null)}
                  placeholder="/hero-clipchamp.mp4"
                />
              </div>

              <div>
                <Label htmlFor="poster_url">Poster Image URL</Label>
                <Input
                  id="poster_url"
                  value={editingSlide?.poster_url || ''}
                  onChange={(e) => setEditingSlide(s => s ? { ...s, poster_url: e.target.value } : null)}
                  placeholder="/hero-poster-1.webp"
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="is_active"
                  checked={editingSlide?.is_active || false}
                  onCheckedChange={(checked) => setEditingSlide(s => s ? { ...s, is_active: checked } : null)}
                />
                <Label htmlFor="is_active">Active (visible on homepage)</Label>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
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
