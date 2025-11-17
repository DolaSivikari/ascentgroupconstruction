import { useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/ui/Button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Check } from 'lucide-react';

interface ChangesDiffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  originalData: Record<string, any>;
  modifiedData: Record<string, any>;
  onConfirm: () => void;
  loading?: boolean;
}

type ChangeType = 'added' | 'modified' | 'removed';

interface Change {
  field: string;
  type: ChangeType;
  oldValue?: any;
  newValue?: any;
}

const formatValue = (value: any): string => {
  if (value === null || value === undefined) return '(empty)';
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value);
};

const getChanges = (original: Record<string, any>, modified: Record<string, any>): Change[] => {
  const changes: Change[] = [];
  const allKeys = new Set([...Object.keys(original), ...Object.keys(modified)]);

  allKeys.forEach(key => {
    const oldValue = original[key];
    const newValue = modified[key];

    if (!(key in original)) {
      changes.push({ field: key, type: 'added', newValue });
    } else if (!(key in modified)) {
      changes.push({ field: key, type: 'removed', oldValue });
    } else if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      changes.push({ field: key, type: 'modified', oldValue, newValue });
    }
  });

  return changes;
};

export const ChangesDiffDialog = ({
  open,
  onOpenChange,
  originalData,
  modifiedData,
  onConfirm,
  loading = false,
}: ChangesDiffDialogProps) => {
  const changes = useMemo(
    () => getChanges(originalData, modifiedData),
    [originalData, modifiedData]
  );

  const hasChanges = changes.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Review Changes</DialogTitle>
          <DialogDescription>
            Review the changes before saving to the public site
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[50vh] pr-4">
          {!hasChanges ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Check className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No changes detected</p>
            </div>
          ) : (
            <div className="space-y-4">
              {changes.map((change, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant={
                        change.type === 'added'
                          ? 'default'
                          : change.type === 'removed'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {change.type}
                    </Badge>
                    <span className="font-medium">{change.field}</span>
                  </div>

                  <div className="space-y-2 text-sm">
                    {change.type !== 'added' && (
                      <div className="bg-destructive/10 p-2 rounded">
                        <span className="text-destructive font-medium">- Old: </span>
                        <span className="text-muted-foreground">
                          {formatValue(change.oldValue)}
                        </span>
                      </div>
                    )}
                    {change.type !== 'removed' && (
                      <div className="bg-primary/10 p-2 rounded">
                        <span className="text-primary font-medium">+ New: </span>
                        <span>{formatValue(change.newValue)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {hasChanges && (
          <div className="flex items-start gap-2 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-500">
                {changes.length} change{changes.length !== 1 ? 's' : ''} will be applied
              </p>
              <p className="text-muted-foreground mt-1">
                These changes will be immediately visible on the public site
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={!hasChanges || loading}>
            {loading ? 'Saving...' : 'Confirm & Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
