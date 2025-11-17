import { useState } from "react";
import { useWhyChooseUsAdmin } from "@/hooks/useWhyChooseUsAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableItem = ({ item, onEdit, onDelete, onToggle }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 p-4 border rounded-lg bg-card">
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </button>
      <div className="flex-1">
        <h4 className="font-semibold">{item.title}</h4>
        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
        {item.stats_badge && (
          <span className="text-xs text-primary mt-1 inline-block">{item.stats_badge}</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={item.is_active} onCheckedChange={() => onToggle(item.id, !item.is_active)} />
        <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export const WhyChooseUsManager = () => {
  const { items, isLoading, createItem, updateItem, deleteItem, reorderItems } = useWhyChooseUsAdmin();
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", stats_badge: "", icon_name: "" });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item: any) => item.id === active.id);
      const newIndex = items.findIndex((item: any) => item.id === over.id);
      const newOrder = arrayMove(items, oldIndex, newIndex);
      reorderItems.mutate(newOrder.map((item: any, index: number) => ({ id: item.id, display_order: index })));
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) return;

    if (editingItem) {
      await updateItem.mutateAsync({ id: editingItem.id, ...formData });
      setEditingItem(null);
    } else {
      await createItem.mutateAsync({ ...formData, display_order: items.length });
      setIsCreating(false);
    }
    setFormData({ title: "", description: "", stats_badge: "", icon_name: "" });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {(isCreating || editingItem) && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Licensed & Bonded"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this benefit..."
                rows={3}
              />
            </div>
            <div>
              <Label>Stats Badge (optional)</Label>
              <Input
                value={formData.stats_badge}
                onChange={(e) => setFormData({ ...formData, stats_badge: e.target.value })}
                placeholder="e.g., 500+ Projects"
              />
            </div>
            <div>
              <Label>Icon Name (optional)</Label>
              <Input
                value={formData.icon_name}
                onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                placeholder="e.g., Shield, Award, CheckCircle"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSubmit}>{editingItem ? "Update" : "Create"}</Button>
              <Button variant="outline" onClick={() => { setIsCreating(false); setEditingItem(null); setFormData({ title: "", description: "", stats_badge: "", icon_name: "" }); }}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!isCreating && !editingItem && (
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((item: any) => item.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {items.map((item: any) => (
              <SortableItem
                key={item.id}
                item={item}
                onEdit={(item: any) => { setEditingItem(item); setFormData({ title: item.title, description: item.description, stats_badge: item.stats_badge || "", icon_name: item.icon_name || "" }); }}
                onDelete={(id: string) => { if (confirm("Delete this item?")) deleteItem.mutate(id); }}
                onToggle={(id: string, isActive: boolean) => updateItem.mutate({ id, is_active: isActive })}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
