import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, Building, Calendar, FileText, Download } from "lucide-react";
import { format } from "date-fns";

interface InboxDetailDialogProps {
  item: any;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const InboxDetailDialog = ({ item, open, onClose, onUpdate }: InboxDetailDialogProps) => {
  const [status, setStatus] = useState(item.status || "new");
  const [adminNotes, setAdminNotes] = useState(item.admin_notes || "");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from(item.table)
        .update({
          status,
          admin_notes: adminNotes,
        })
        .eq("id", item.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item updated successfully",
      });

      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating item:", error);
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderDetails = () => {
    switch (item.type) {
      case "RFP":
        return (
          <div className="space-y-4">
            <DetailRow icon={<Building />} label="Company" value={item.company_name} />
            <DetailRow icon={<FileText />} label="Project" value={item.project_name} />
            <DetailRow icon={<FileText />} label="Project Type" value={item.project_type} />
            <DetailRow icon={<FileText />} label="Estimated Value" value={item.estimated_value_range} />
            {item.project_description && (
              <div>
                <p className="text-sm font-medium mb-2">Project Description:</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{item.project_description}</p>
              </div>
            )}
          </div>
        );

      case "Contact":
        return (
          <div className="space-y-4">
            {item.company && <DetailRow icon={<Building />} label="Company" value={item.company} />}
            <DetailRow icon={<FileText />} label="Type" value={item.submission_type} />
            <div>
              <p className="text-sm font-medium mb-2">Message:</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{item.message}</p>
            </div>
          </div>
        );

      case "Resume":
        return (
          <div className="space-y-4">
            {item.resume_url && (
              <Button variant="outline" asChild className="w-full">
                <a href={item.resume_url} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  Download Resume
                </a>
              </Button>
            )}
            {item.cover_message && (
              <div>
                <p className="text-sm font-medium mb-2">Cover Message:</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{item.cover_message}</p>
              </div>
            )}
          </div>
        );

      case "Prequal":
        return (
          <div className="space-y-4">
            <DetailRow icon={<Building />} label="Company" value={item.company_name} />
            {item.project_type && <DetailRow icon={<FileText />} label="Project Type" value={item.project_type} />}
            {item.project_value_range && <DetailRow icon={<FileText />} label="Project Value" value={item.project_value_range} />}
            {item.message && (
              <div>
                <p className="text-sm font-medium mb-2">Message:</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{item.message}</p>
              </div>
            )}
          </div>
        );

      case "Quote":
        return (
          <div className="space-y-4">
            {item.company && <DetailRow icon={<Building />} label="Company" value={item.company} />}
            <DetailRow icon={<FileText />} label="Quote Type" value={item.quote_type} />
            {item.priority && (
              <DetailRow 
                icon={<FileText />} 
                label="Priority" 
                value={<Badge variant={item.priority === "hot" ? "destructive" : "secondary"}>{item.priority}</Badge>}
              />
            )}
            {item.additional_notes && (
              <div>
                <p className="text-sm font-medium mb-2">Additional Notes:</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{item.additional_notes}</p>
              </div>
            )}
          </div>
        );

      case "Newsletter":
        return (
          <div className="space-y-4">
            <DetailRow icon={<FileText />} label="Source" value={item.source || "Website"} />
            <DetailRow 
              icon={<FileText />} 
              label="Status" 
              value={item.is_active ? "Active" : "Inactive"}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Badge>{item.type}</Badge>
            {item.contact_name || item.name || item.applicant_name || item.company_name}
          </DialogTitle>
          <DialogDescription>
            Submitted on {format(new Date(item.created_at), "MMMM d, yyyy 'at' HH:mm")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Contact Information</h3>
            <div className="space-y-2">
              <DetailRow icon={<Mail />} label="Email" value={item.email} link={`mailto:${item.email}`} />
              {item.phone && (
                <DetailRow icon={<Phone />} label="Phone" value={item.phone} link={`tel:${item.phone}`} />
              )}
            </div>
          </div>

          {/* Type-specific Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Details</h3>
            {renderDetails()}
          </div>

          {/* Status Update */}
          {item.type !== "Newsletter" && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Update Status</h3>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Admin Notes */}
          {item.type !== "Newsletter" && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Admin Notes</h3>
              <Textarea
                placeholder="Add internal notes..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {item.type !== "Newsletter" && (
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DetailRow = ({ icon, label, value, link }: { icon: React.ReactNode; label: string; value: any; link?: string }) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 text-muted-foreground">{icon}</div>
    <div className="flex-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      {link ? (
        <a href={link} className="text-sm font-medium hover:underline">
          {value}
        </a>
      ) : (
        <p className="text-sm font-medium">{typeof value === 'string' ? value : value}</p>
      )}
    </div>
  </div>
);
