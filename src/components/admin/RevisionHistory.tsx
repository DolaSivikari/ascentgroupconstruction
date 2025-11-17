import { useState, useEffect } from 'react';
import { Button } from '@/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { History, RotateCcw, User, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
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

interface RevisionHistoryProps {
  entityType: string;
  entityId: string;
  onRestore?: (versionId: string) => void;
}

interface Version {
  id: string;
  version_number: number;
  content_snapshot: any;
  changed_by: string;
  change_summary: string | null;
  created_at: string;
  user_email?: string;
}

export const RevisionHistory = ({ entityType, entityId, onRestore }: RevisionHistoryProps) => {
  const [open, setOpen] = useState(false);
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);

  const loadVersions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('content_versions' as any)
        .select(`
          *,
          profiles!changed_by(email)
        `)
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('version_number', { ascending: false }) as any;

      if (error) throw error;

      const versionsWithEmails = (data as any)?.map((v: any) => ({
        ...v,
        user_email: v.profiles?.email || 'Unknown'
      })) || [];

      setVersions(versionsWithEmails as any);
    } catch (error) {
      console.error('Error loading versions:', error);
      toast.error('Failed to load revision history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadVersions();
    }
  }, [open, entityType, entityId]);

  const handleRestore = async (version: Version) => {
    try {
      if (onRestore) {
        await onRestore(version.id);
      }
      toast.success(`Restored to version ${version.version_number}`);
      setRestoreDialogOpen(false);
      setOpen(false);
    } catch (error) {
      console.error('Error restoring version:', error);
      toast.error('Failed to restore version');
    }
  };

  const getChangedFields = (version: Version, previousVersion?: Version) => {
    if (!previousVersion) return [];
    
    const current = version.content_snapshot;
    const previous = previousVersion.content_snapshot;
    
    const changedFields: string[] = [];
    Object.keys(current).forEach(key => {
      if (JSON.stringify(current[key]) !== JSON.stringify(previous[key])) {
        changedFields.push(key);
      }
    });
    
    return changedFields;
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
      >
        <History className="h-4 w-4 mr-2" />
        View History
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Revision History</DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading history...
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No revision history available
            </div>
          ) : (
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {versions.map((version, index) => {
                  const previousVersion = versions[index + 1];
                  const changedFields = getChangedFields(version, previousVersion);

                  return (
                    <div
                      key={version.id}
                      className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant={index === 0 ? 'default' : 'secondary'}>
                              Version {version.version_number}
                            </Badge>
                            {index === 0 && (
                              <Badge variant="glass">Current</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {version.user_email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(version.created_at), 'MMM d, yyyy h:mm a')}
                            </span>
                          </div>
                        </div>

                        {index !== 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedVersion(version);
                              setRestoreDialogOpen(true);
                            }}
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Restore
                          </Button>
                        )}
                      </div>

                      {version.change_summary && (
                        <p className="text-sm mb-2">{version.change_summary}</p>
                      )}

                      {changedFields.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Changed fields: {changedFields.join(', ')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Version {selectedVersion?.version_number}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will restore the content to version {selectedVersion?.version_number} created on{' '}
              {selectedVersion && format(new Date(selectedVersion.created_at), 'MMM d, yyyy h:mm a')}.
              The current version will be saved in history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedVersion && handleRestore(selectedVersion)}
            >
              Restore Version
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
