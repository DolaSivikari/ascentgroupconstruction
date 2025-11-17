import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  ChevronRight,
  Save,
  FolderTree,
  ExternalLink
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface MenuItem {
  id: string;
  menu_type: string;
  parent_id: string | null;
  label: string;
  url: string;
  description: string | null;
  badge: string | null;
  icon_name: string | null;
  display_order: number;
  is_active: boolean;
  is_mega_menu: boolean;
  mega_menu_section_title: string | null;
  children?: MenuItem[];
}

interface SortableItemProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  depth: number;
}

const SortableItem = ({ item, onEdit, onDelete, depth }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border rounded-lg p-4 bg-card mb-2 ${depth > 0 ? 'ml-8' : ''}`}
    >
      <div className="flex items-center gap-3">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </button>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">{item.label}</span>
            {item.badge && (
              <Badge variant="secondary" size="sm">{item.badge}</Badge>
            )}
            {item.is_mega_menu && (
              <Badge variant="glass" size="sm">Mega Menu</Badge>
            )}
            {!item.is_active && (
              <Badge variant="outline" size="sm">Inactive</Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{item.url}</span>
            {item.description && (
              <>
                <span>•</span>
                <span>{item.description}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(item)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>

      {item.children && item.children.length > 0 && (
        <div className="mt-2">
          {item.children.map((child) => (
            <SortableItem
              key={child.id}
              item={child}
              onEdit={onEdit}
              onDelete={onDelete}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const NavigationBuilder = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialog, setEditDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<MenuItem>>({
    menu_type: 'primary',
    is_active: true,
    is_mega_menu: false,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadNavigationItems();
  }, []);

  const loadNavigationItems = async () => {
    try {
      const { data, error } = await supabase
        .from('navigation_menu_items' as any)
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;

      // Build tree structure
      const itemMap = new Map<string, MenuItem>();
      (data || []).forEach((item: any) => {
        itemMap.set(item.id, { ...item, children: [] });
      });

      const tree: MenuItem[] = [];
      itemMap.forEach((item) => {
        if (item.parent_id) {
          const parent = itemMap.get(item.parent_id);
          if (parent) {
            parent.children!.push(item);
          }
        } else {
          tree.push(item);
        }
      });

      setItems(tree);
    } catch (error: any) {
      console.error('Error loading navigation:', error);
      toast.error('Failed to load navigation items');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      // Update display orders in database
      try {
        const updates = newItems.map((item, index) => ({
          id: item.id,
          display_order: index,
        }));

        for (const update of updates) {
          await supabase
            .from('navigation_menu_items' as any)
            .update({ display_order: update.display_order })
            .eq('id', update.id);
        }

        toast.success('Navigation order updated');
      } catch (error) {
        console.error('Error updating order:', error);
        toast.error('Failed to update navigation order');
        loadNavigationItems(); // Reload on error
      }
    }
  };

  const handleSave = async () => {
    try {
      if (!currentItem.label || !currentItem.url) {
        toast.error('Label and URL are required');
        return;
      }

      if (currentItem.id) {
        // Update existing
        const { error } = await supabase
          .from('navigation_menu_items' as any)
          .update(currentItem)
          .eq('id', currentItem.id);

        if (error) throw error;
        toast.success('Navigation item updated');
      } else {
        // Create new
        const { error } = await supabase
          .from('navigation_menu_items' as any)
          .insert([currentItem]);

        if (error) throw error;
        toast.success('Navigation item created');
      }

      setEditDialog(false);
      setCurrentItem({
        menu_type: 'primary',
        is_active: true,
        is_mega_menu: false,
      });
      loadNavigationItems();
    } catch (error: any) {
      console.error('Error saving item:', error);
      toast.error('Failed to save navigation item');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this navigation item and all its children?')) return;

    try {
      const { error } = await supabase
        .from('navigation_menu_items' as any)
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Navigation item deleted');
      loadNavigationItems();
    } catch (error: any) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete navigation item');
    }
  };

  const handleEdit = (item: MenuItem) => {
    setCurrentItem(item);
    setEditDialog(true);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">Loading navigation...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Navigation Builder</h1>
          <p className="text-muted-foreground">
            Drag to reorder, click to edit menu items
          </p>
        </div>
        <Button onClick={() => {
          setCurrentItem({
            menu_type: 'primary',
            is_active: true,
            is_mega_menu: false,
          });
          setEditDialog(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Menu Item
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <FolderTree className="h-5 w-5 text-primary" />
            <span className="font-semibold">Total Items</span>
          </div>
          <div className="text-2xl font-bold">{items.length}</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <ChevronRight className="h-5 w-5 text-green-600" />
            <span className="font-semibold">Active</span>
          </div>
          <div className="text-2xl font-bold">
            {items.filter(i => i.is_active).length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <ExternalLink className="h-5 w-5 text-blue-600" />
            <span className="font-semibold">Mega Menus</span>
          </div>
          <div className="text-2xl font-bold">
            {items.filter(i => i.is_mega_menu).length}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <FolderTree className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Navigation Items</h3>
            <p className="text-muted-foreground mb-4">
              Get started by adding your first menu item
            </p>
            <Button onClick={() => setEditDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Item
            </Button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map(i => i.id)}
              strategy={verticalListSortingStrategy}
            >
              {items.map((item) => (
                <SortableItem
                  key={item.id}
                  item={item}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  depth={0}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </Card>

      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {currentItem.id ? 'Edit' : 'Add'} Navigation Item
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Label *</Label>
                <Input
                  value={currentItem.label || ''}
                  onChange={(e) => setCurrentItem({ ...currentItem, label: e.target.value })}
                  placeholder="Services"
                />
              </div>

              <div className="space-y-2">
                <Label>URL *</Label>
                <Input
                  value={currentItem.url || ''}
                  onChange={(e) => setCurrentItem({ ...currentItem, url: e.target.value })}
                  placeholder="/services"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={currentItem.description || ''}
                onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                placeholder="Optional description"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Menu Type</Label>
                <Select
                  value={currentItem.menu_type}
                  onValueChange={(value) => setCurrentItem({ ...currentItem, menu_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="footer">Footer</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Badge</Label>
                <Select
                  value={currentItem.badge || 'none'}
                  onValueChange={(value) => setCurrentItem({ ...currentItem, badge: value === 'none' ? null : value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="popular">Popular</SelectItem>
                    <SelectItem value="important">Important</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Icon Name</Label>
                <Input
                  value={currentItem.icon_name || ''}
                  onChange={(e) => setCurrentItem({ ...currentItem, icon_name: e.target.value })}
                  placeholder="Building2"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentItem.is_active}
                  onChange={(e) => setCurrentItem({ ...currentItem, is_active: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Active</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentItem.is_mega_menu}
                  onChange={(e) => setCurrentItem({ ...currentItem, is_mega_menu: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Mega Menu</span>
              </label>
            </div>

            {currentItem.is_mega_menu && (
              <div className="space-y-2">
                <Label>Mega Menu Section Title</Label>
                <Input
                  value={currentItem.mega_menu_section_title || ''}
                  onChange={(e) => setCurrentItem({ ...currentItem, mega_menu_section_title: e.target.value })}
                  placeholder="Primary Services"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NavigationBuilder;