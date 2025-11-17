import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Edit2, GripVertical, Loader2 } from 'lucide-react';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/ui/Textarea';
import { Card } from '@/components/ui/card';
import { uploadImage } from '@/utils/imageResolver';
import { toast } from 'sonner';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export interface GalleryImage {
  url: string;
  caption: string;
  alt: string;
  order: number;
}

interface MultiImageUploadProps {
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  title: string;
  maxImages?: number;
  bucket?: string;
}

const SortableImageCard = ({ 
  image, 
  onEdit, 
  onDelete 
}: { 
  image: GalleryImage; 
  onEdit: (image: GalleryImage) => void; 
  onDelete: (order: number) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: image.order.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <Card className="overflow-hidden">
        <div className="relative aspect-video">
          <img
            src={image.url}
            alt={image.alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => onEdit(image)}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => onDelete(image.order)}
            >
              <X className="w-4 h-4" />
            </Button>
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing"
            >
              <Button type="button" variant="ghost" size="sm">
                <GripVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        {image.caption && (
          <div className="p-2">
            <p className="text-xs text-muted-foreground truncate">{image.caption}</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export const MultiImageUpload = ({
  images,
  onChange,
  title,
  maxImages = 10,
  bucket = 'project-images',
}: MultiImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [editAlt, setEditAlt] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDrop = async (acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromises = acceptedFiles.map(async (file) => {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 5MB)`);
          return null;
        }

        const { url, error } = await uploadImage(file, bucket);
        if (error) {
          toast.error(`Failed to upload ${file.name}`);
          return null;
        }

        return {
          url,
          caption: '',
          alt: file.name.replace(/\.[^/.]+$/, ''),
          order: images.length + acceptedFiles.indexOf(file),
        };
      });

      const uploadedImages = (await Promise.all(uploadPromises)).filter(
        (img): img is GalleryImage => img !== null
      );

      onChange([...images, ...uploadedImages]);
      toast.success(`${uploadedImages.length} image(s) uploaded successfully`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    multiple: true,
    maxFiles: maxImages - images.length,
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.order.toString() === active.id);
      const newIndex = images.findIndex((img) => img.order.toString() === over.id);

      const reorderedImages = arrayMove(images, oldIndex, newIndex).map((img, index) => ({
        ...img,
        order: index,
      }));

      onChange(reorderedImages);
    }
  };

  const handleDelete = (order: number) => {
    const filtered = images
      .filter((img) => img.order !== order)
      .map((img, index) => ({ ...img, order: index }));
    onChange(filtered);
    toast.success('Image removed');
  };

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setEditCaption(image.caption);
    setEditAlt(image.alt);
  };

  const saveEdit = () => {
    if (!editingImage) return;

    const updated = images.map((img) =>
      img.order === editingImage.order
        ? { ...img, caption: editCaption, alt: editAlt }
        : img
    );

    onChange(updated);
    setEditingImage(null);
    toast.success('Image updated');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-semibold">{title}</Label>
        <span className="text-sm text-muted-foreground">
          {images.length} / {maxImages} images
        </span>
      </div>

      {/* Upload Zone */}
      {images.length < maxImages && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer ${
            isDragActive ? 'border-primary bg-primary/5' : ''
          }`}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
          ) : (
            <>
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {isDragActive
                  ? 'Drop images here...'
                  : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, WEBP up to 5MB each
              </p>
            </>
          )}
        </div>
      )}

      {/* Image Grid with Drag & Drop */}
      {images.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={images.map((img) => img.order.toString())}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image) => (
                <SortableImageCard
                  key={image.order}
                  image={image}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingImage} onOpenChange={() => setEditingImage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Image Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {editingImage && (
              <img
                src={editingImage.url}
                alt={editingImage.alt}
                className="w-full h-48 object-cover rounded-lg"
              />
            )}
            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                placeholder="Describe this image..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alt">Alt Text (for SEO & accessibility)</Label>
              <Input
                id="alt"
                value={editAlt}
                onChange={(e) => setEditAlt(e.target.value)}
                placeholder="Brief description for screen readers"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={saveEdit} className="flex-1">
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingImage(null)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
