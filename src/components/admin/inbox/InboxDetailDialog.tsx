import {
  RequestDetailShell,
  RequestDetailCard,
  RequestDetailField,
} from "@/components/admin/requests/RequestDetailShell";
import {
  AdminSectionWorkspace,
  AdminSectionScreen,
} from "@/components/admin/AdminSectionWorkspace";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/ui/Button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Download, Trash2 } from "lucide-react";

import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { signRfpAttachment, saveInboxItem } from "@/lib/inbox/api";
import { leadType, LEAD_TYPE_LABELS } from "@/lib/leads/model";
import {
  STATUS_LABELS,
  inboxName,
  inboxStatuses,
  inboxStrings,
  inboxText,
  supportsAdminNotes,
  type InboxItem,
} from "@/lib/inbox/model";

interface InboxDetailDialogProps {
  item: InboxItem;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
  presentation?: "dialog" | "panel";
  allowDelete?: boolean;
}

const fieldsByType: Record<
  Exclude<InboxItem["type"], "Inquiry">,
  [string, string][]
> = {
  RFP: [
    ["company_name", "Company"],
    ["title", "Contact title"],
    ["project_name", "Project"],
    ["project_type", "Project type"],
    ["project_location", "Location"],
    ["estimated_value_range", "Estimated value"],
    ["estimated_timeline", "Timeline"],
    ["project_start_date", "Project start date"],
    ["estimated_start_date", "Estimated start date"],
    ["delivery_method", "Delivery method"],
    ["scope_of_work", "Scope of work"],
    ["project_description", "Project description"],
    ["additional_requirements", "Additional requirements"],
    ["special_requirements", "Special requirements"],
  ],
  Contact: [
    ["company", "Company"],
    ["submission_type", "Type"],
    ["message", "Message"],
  ],
  Resume: [
    ["position_applied", "Position applied for"],
    ["cover_letter", "Cover letter"],
  ],
  Prequal: [
    ["company_name", "Company"],
    ["project_type", "Project type"],
    ["project_value_range", "Project value"],
    ["message", "Message"],
  ],
  Quote: [
    ["company", "Company"],
    ["quote_type", "Request type"],
    ["source", "Source"],
    ["role", "Role"],
    ["service_origin", "Service"],
    ["project_address", "Project address"],
    ["city", "City"],
    ["target_deadline", "Target deadline"],
    ["access_hours", "Access hours"],
    ["priority", "Priority"],
    ["additional_notes", "Submitted notes"],
  ],
  Newsletter: [["source", "Source"]],
};

const safeFileUrl = (value: string): string | null => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
};
const fileName = (value: string) => {
  const name = value.split("?")[0].split("/").pop() || "Attachment";
  try {
    return decodeURIComponent(name);
  } catch {
    return name;
  }
};

export const InboxDetailDialog = ({
  item: incomingItem,
  open,
  onClose,
  onUpdate,
  presentation = "panel",
  allowDelete = true,
}: InboxDetailDialogProps) => {
  // Freeze the edit baseline. A realtime refetch must not silently move our
  // optimistic-concurrency check forward while staff are editing old values.
  const [item] = useState(incomingItem);
  const [status, setStatus] = useState(item.status || "new");
  const [adminNotes, setAdminNotes] = useState(inboxText(item, "admin_notes"));
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [openingFile, setOpeningFile] = useState<string | null>(null);
  const [attachmentLink, setAttachmentLink] = useState<{
    name: string;
    url: string;
  } | null>(null);
  const { toast } = useToast();
  const statuses = inboxStatuses(item.table);
  const hasNotes = supportsAdminNotes(item);
  const changed =
    status !== (item.status || "new") ||
    (hasNotes && adminNotes !== inboxText(item, "admin_notes"));
  const isPanel = presentation === "panel";
  const hasAttachments =
    inboxStrings(item, "attachment_urls").length > 0 ||
    inboxStrings(item, "uploaded_files").length > 0 ||
    !!inboxText(item, "resume_url");
  const requestClose = () => {
    if (isSaving) return;
    if (changed) setShowDiscardConfirm(true);
    else onClose();
  };

  const handleSave = async () => {
    if (isSaving || !changed) return;
    setIsSaving(true);
    try {
      await saveInboxItem(item, status, adminNotes);
      toast({ title: "Saved", description: "Request updated successfully." });
      onUpdate();
      onClose();
    } catch (error) {
      toast({
        title: "Could not save",
        description:
          error instanceof Error &&
          error.message.startsWith("This request changed")
            ? `${error.message} Your unsaved edits remain here.`
            : "Your changes have not been saved. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  const handleDelete = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      if (item.table === "inquiries")
        throw new Error("Archive inquiries from Leads instead.");
      const { error } = await supabase
        .from(item.table)
        .delete()
        .eq("id", item.id)
        .select("id")
        .single();
      if (error) throw error;
      toast({ title: "Deleted", description: "Submission removed." });
      onUpdate();
      onClose();
    } catch {
      toast({
        title: "Could not delete",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  const openAttachment = async (path: string) => {
    if (openingFile) return;
    // Open during the click, before awaiting the signed URL, to avoid popup blocking.
    const tab = window.open("about:blank", "_blank");
    if (tab) tab.opener = null;
    setOpeningFile(path);
    setAttachmentLink(null);
    try {
      const url = await signRfpAttachment(path);
      if (tab && !tab.closed) tab.location.replace(url);
      else setAttachmentLink({ name: fileName(path), url });
    } catch {
      tab?.close();
      toast({
        title: "Attachment unavailable",
        description: "Could not open this file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setOpeningFile(null);
    }
  };

  return (
    <>
      {" "}
      <RequestDetailShell
        open={open}
        onClose={requestClose}
        name={inboxName(item)}
        type={
          isPanel
            ? LEAD_TYPE_LABELS[leadType(item)]
            : leadType(item) === "estimate"
              ? "Estimate"
              : item.type
        }
        status={
          item.type === "Newsletter"
            ? item.is_active
              ? "active"
              : "inactive"
            : item.status || "new"
        }
        receivedAt={item.created_at}
        email={item.email}
        phone={inboxText(item, "phone")}
        company={inboxText(item, "company_name") || inboxText(item, "company")}
        dirty={changed}
        footer={
          <div className="flex flex-wrap justify-between items-center gap-3">
            {allowDelete && (
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isSaving}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={requestClose}
                disabled={isSaving}
              >
                Close
              </Button>
              {statuses.length > 0 && (
                <Button
                  onClick={() => void handleSave()}
                  disabled={isSaving || !changed}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              )}
            </div>
          </div>
        }
      >
        <AdminSectionWorkspace
          queryKey="lead-section"
          label="Request sections"
          items={[
            { id: "request", title: "Submitted request" },
            { id: "workflow", title: "Status & notes" },
            { id: "attachments", title: "Attachments" },
          ]}
        >
          <AdminSectionScreen id="request">
            <RequestDetailCard title="Contact information">
              <dl className="grid gap-4 sm:grid-cols-2">
                <DetailRow
                  label="Email"
                  value={item.email}
                  link={`mailto:${item.email}`}
                />
                {inboxText(item, "phone") && (
                  <DetailRow
                    label="Phone"
                    value={inboxText(item, "phone")}
                    link={`tel:${inboxText(item, "phone")}`}
                  />
                )}
              </dl>
            </RequestDetailCard>
            <RequestDetailCard title="Request details">
              <dl className="grid gap-5 sm:grid-cols-2">
                {fieldsByType[item.type].map(([field, label]) =>
                  inboxText(item, field) ? (
                    <DetailRow
                      key={field}
                      wide={[
                        "message",
                        "scope_of_work",
                        "additional_notes",
                        "cover_letter",
                      ].includes(field)}
                      label={
                        field === "company" &&
                        item.table === "contact_submissions" &&
                        leadType(item) === "estimate"
                          ? "Property / address"
                          : label
                      }
                      value={inboxText(item, field)}
                    />
                  ) : null,
                )}
                {item.type === "RFP" &&
                  (
                    [
                      ["bonding_required", "Bonding required"],
                      ["plans_available", "Plans available"],
                      ["site_visit_required", "Site visit required"],
                      [
                        "prequalification_complete",
                        "Prequalification complete",
                      ],
                    ] as const
                  ).map(([field, label]) =>
                    typeof item[field] === "boolean" ? (
                      <DetailRow
                        key={field}
                        label={label}
                        value={item[field] ? "Yes" : "No"}
                      />
                    ) : null,
                  )}
                {item.type === "Quote" && (
                  <>
                    {inboxStrings(item, "scope_categories").length > 0 && (
                      <DetailRow
                        label="Scope categories"
                        value={inboxStrings(item, "scope_categories").join(
                          ", ",
                        )}
                      />
                    )}
                    {[
                      ["estimated_value", "Estimated value"],
                      ["nte_budget", "Budget limit"],
                    ].map(([field, label]) =>
                      typeof item[field] === "number" ? (
                        <DetailRow
                          key={field}
                          label={label}
                          value={new Intl.NumberFormat("en-CA", {
                            style: "currency",
                            currency: "CAD",
                          }).format(item[field] as number)}
                        />
                      ) : null,
                    )}
                    {typeof item.after_hours_required === "boolean" && (
                      <DetailRow
                        label="After hours required"
                        value={item.after_hours_required ? "Yes" : "No"}
                      />
                    )}
                  </>
                )}
                {item.type === "Newsletter" && (
                  <DetailRow
                    label="Subscription"
                    value={item.is_active ? "Active" : "Inactive"}
                  />
                )}
              </dl>
            </RequestDetailCard>
          </AdminSectionScreen>
          <AdminSectionScreen id="attachments" title="Attachments">
            <RequestDetailCard title="Files & drawings">
              {item.type === "RFP" &&
                inboxStrings(item, "attachment_urls").length > 0 && (
                  <section className="space-y-3">
                    <h3 className="text-sm font-semibold">Attachments</h3>
                    <p className="text-xs text-muted-foreground">
                      Private files open with a link that expires in five
                      minutes.
                    </p>
                    {inboxStrings(item, "attachment_urls").map((path) => (
                      <Button
                        key={path}
                        variant="outline"
                        className="w-full justify-start h-auto whitespace-normal text-left break-all"
                        disabled={!!openingFile}
                        onClick={() => void openAttachment(path)}
                      >
                        <Download className="mr-2 h-4 w-4 shrink-0" />
                        {openingFile === path ? "Opening..." : fileName(path)}
                      </Button>
                    ))}
                    {attachmentLink && (
                      <a
                        className="block text-sm underline break-all"
                        href={attachmentLink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open {attachmentLink.name}
                      </a>
                    )}
                  </section>
                )}
              {item.type === "Resume" &&
                inboxText(item, "resume_url") &&
                (safeFileUrl(inboxText(item, "resume_url")) ? (
                  <Button variant="outline" asChild>
                    <a
                      href={safeFileUrl(inboxText(item, "resume_url"))!}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download resume
                    </a>
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Resume link unavailable.
                  </p>
                ))}
              {item.type === "Quote" &&
                inboxStrings(item, "uploaded_files").map((file) =>
                  safeFileUrl(file) ? (
                    <a
                      key={file}
                      className="block text-sm underline break-all"
                      href={safeFileUrl(file)!}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {fileName(file)}
                    </a>
                  ) : (
                    <DetailRow
                      key={file}
                      label="Attached file reference"
                      value={file}
                    />
                  ),
                )}
              {!hasAttachments && (
                <p className="text-sm text-muted-foreground">
                  No attachments were submitted with this request.
                </p>
              )}
            </RequestDetailCard>
          </AdminSectionScreen>
          <AdminSectionScreen id="workflow">
            {statuses.length > 0 && (
              <section className="request-detail-card space-y-3 rounded-xl border bg-card p-5">
                <h3 className="text-sm font-semibold">Update status</h3>
                <Select
                  value={status}
                  onValueChange={setStatus}
                  disabled={isSaving}
                >
                  <SelectTrigger aria-label="Request status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {!statuses.includes(status) && (
                      <SelectItem value={status} disabled>
                        {status}
                      </SelectItem>
                    )}
                    {statuses.map((value) => (
                      <SelectItem key={value} value={value}>
                        {STATUS_LABELS[value]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </section>
            )}
            {hasNotes ? (
              <section className="space-y-3">
                <label
                  htmlFor="inbox-admin-notes"
                  className="text-sm font-semibold"
                >
                  Admin notes
                </label>
                <Textarea
                  id="inbox-admin-notes"
                  placeholder="Add internal notes..."
                  value={adminNotes}
                  onChange={(event) => setAdminNotes(event.target.value)}
                  rows={4}
                  disabled={isSaving}
                />
              </section>
            ) : (
              statuses.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Internal notes are not available for this request type yet.
                  Submitted information is read-only.
                </p>
              )
            )}
          </AdminSectionScreen>
        </AdminSectionWorkspace>
      </RequestDetailShell>
      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={handleDelete}
        title="Delete item"
        description="This permanently deletes the submission. This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
      />
      <ConfirmDialog
        open={showDiscardConfirm}
        onOpenChange={setShowDiscardConfirm}
        onConfirm={onClose}
        title="Discard unsaved changes?"
        description="Your status and note changes have not been saved. Keep editing to preserve them."
        confirmText="Discard changes"
        cancelText="Keep editing"
      />
    </>
  );
};

const DetailRow = RequestDetailField;
