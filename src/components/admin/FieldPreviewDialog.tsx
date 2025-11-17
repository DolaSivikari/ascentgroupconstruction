import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/ui/Button';
import { ExternalLink } from 'lucide-react';

interface FieldPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fieldName: string;
  previewUrl: string;
  description?: string;
}

export const FieldPreviewDialog = ({
  open,
  onOpenChange,
  fieldName,
  previewUrl,
  description,
}: FieldPreviewDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Preview: {fieldName}</DialogTitle>
          <DialogDescription>
            {description || `This shows where "${fieldName}" appears on the public site`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Public page: {previewUrl}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(previewUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
          </div>
          
          <div className="border rounded-lg overflow-hidden bg-muted">
            <iframe
              src={previewUrl}
              className="w-full h-[60vh]"
              title={`Preview of ${fieldName}`}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
