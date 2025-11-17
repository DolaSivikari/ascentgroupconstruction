import { useState } from 'react';
import { Button } from '@/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Download, Edit, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onDelete?: () => Promise<void>;
  onExport?: () => void;
  onStatusChange?: (status: string) => Promise<void>;
  statusOptions?: { label: string; value: string }[];
  className?: string;
}

export const BulkActionsBar = ({
  selectedCount,
  onClearSelection,
  onDelete,
  onExport,
  onStatusChange,
  statusOptions = [],
  className = '',
}: BulkActionsBarProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  if (selectedCount === 0) return null;

  const handleDelete = async () => {
    if (!onDelete) return;

    setIsDeleting(true);
    try {
      await onDelete();
      toast.success(`${selectedCount} items deleted successfully`);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Bulk delete error:', error);
      toast.error('Failed to delete items');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!onStatusChange) return;

    setIsUpdating(true);
    try {
      await onStatusChange(status);
      toast.success(`${selectedCount} items updated successfully`);
    } catch (error) {
      console.error('Bulk status change error:', error);
      toast.error('Failed to update items');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 ${className}`}
      >
        <div className="bg-primary text-primary-foreground rounded-full shadow-lg px-6 py-4 flex items-center gap-4">
          <Badge variant="glass" size="md">
            {selectedCount} selected
          </Badge>

          <div className="h-6 w-px bg-primary-foreground/20" />

          <div className="flex items-center gap-2">
            {statusOptions.length > 0 && onStatusChange && (
              <Select onValueChange={handleStatusChange} disabled={isUpdating}>
                <SelectTrigger className="h-9 w-[160px] bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                  <SelectValue placeholder="Change status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {onExport && (
              <Button
                size="sm"
                variant="secondary"
                onClick={onExport}
                className="h-9"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}

            {onDelete && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
                className="h-9"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}

            <Button
              size="sm"
              variant="ghost"
              onClick={onClearSelection}
              className="h-9 hover:bg-primary-foreground/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedCount} items?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedCount} items from
              the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
