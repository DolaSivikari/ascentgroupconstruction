import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/ui/Textarea';
import { Card } from '@/components/ui/card';
import { ImageUploadField } from './ImageUploadField';
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

export interface ProcessStep {
  type: string;
  step_number: number;
  title: string;
  description: string;
  image_url?: string;
  image_alt?: string;
  duration?: string;
}

interface ProcessStepsEditorProps {
  steps: ProcessStep[];
  onChange: (steps: ProcessStep[]) => void;
}

const SortableStepCard = ({
  step,
  index,
  onUpdate,
  onDelete,
}: {
  step: ProcessStep;
  index: number;
  onUpdate: (index: number, field: keyof ProcessStep, value: any) => void;
  onDelete: (index: number) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: `step-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="p-6 relative">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-2 hover:bg-muted rounded"
          >
            <GripVertical className="w-5 h-5 text-muted-foreground" />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onDelete(index)}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>

        <div className="space-y-4 pr-20">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
              {step.step_number}
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor={`step-title-${index}`}>Step Title *</Label>
              <Input
                id={`step-title-${index}`}
                value={step.title}
                onChange={(e) => onUpdate(index, 'title', e.target.value)}
                placeholder="e.g., Surface Preparation"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`step-desc-${index}`}>Description *</Label>
            <Textarea
              id={`step-desc-${index}`}
              value={step.description}
              onChange={(e) => onUpdate(index, 'description', e.target.value)}
              placeholder="Explain what was done in this step..."
              rows={4}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`step-duration-${index}`}>Duration</Label>
              <Input
                id={`step-duration-${index}`}
                value={step.duration || ''}
                onChange={(e) => onUpdate(index, 'duration', e.target.value)}
                placeholder="e.g., 2 days"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`step-alt-${index}`}>Image Alt Text</Label>
              <Input
                id={`step-alt-${index}`}
                value={step.image_alt || ''}
                onChange={(e) => onUpdate(index, 'image_alt', e.target.value)}
                placeholder="Describe the step image"
              />
            </div>
          </div>

          <ImageUploadField
            value={step.image_url}
            onChange={(url) => onUpdate(index, 'image_url', url)}
            bucket="project-images"
            label="Step Image (optional)"
          />
        </div>
      </Card>
    </div>
  );
};

export const ProcessStepsEditor = ({ steps, onChange }: ProcessStepsEditorProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addStep = () => {
    const newStep: ProcessStep = {
      type: 'process_step',
      step_number: steps.length + 1,
      title: '',
      description: '',
      image_url: '',
      image_alt: '',
      duration: '',
    };

    onChange([...steps, newStep]);
  };

  const updateStep = (index: number, field: keyof ProcessStep, value: any) => {
    const updated = steps.map((step, i) =>
      i === index ? { ...step, [field]: value } : step
    );
    onChange(updated);
  };

  const deleteStep = (index: number) => {
    const updated = steps
      .filter((_, i) => i !== index)
      .map((step, i) => ({ ...step, step_number: i + 1 }));
    onChange(updated);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString().replace('step-', ''));
      const newIndex = parseInt(over.id.toString().replace('step-', ''));

      const reordered = arrayMove(steps, oldIndex, newIndex).map((step, i) => ({
        ...step,
        step_number: i + 1,
      }));

      onChange(reordered);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-lg font-semibold">Process Steps</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Document each major step with a description and photo. Drag to reorder.
          </p>
        </div>
        <Button type="button" onClick={addStep} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Step
        </Button>
      </div>

      {steps.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No process steps added yet</p>
          <Button type="button" onClick={addStep} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add First Step
          </Button>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={steps.map((_, i) => `step-${i}`)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {steps.map((step, index) => (
                <SortableStepCard
                  key={`step-${index}`}
                  step={step}
                  index={index}
                  onUpdate={updateStep}
                  onDelete={deleteStep}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};
