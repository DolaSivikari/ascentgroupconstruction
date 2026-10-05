import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "./ConfirmDialog";
import {
  duplicateContent,
  type ContentTable,
} from "@/lib/admin/contentActions";
import { savePreviewLink } from "@/lib/admin/contentPreview";
import { adminErrorMessage } from "@/lib/admin/editorValues";
import { getStaticServiceEntries } from "@/data/service-registry";
import { openDocumentUrl } from "@/utils/documentUrl";
import { toast } from "sonner";
export function ContentRowActions({
  table,
  id,
  title,
  slug,
  state,
  documentUrl,
  onEdit,
  onDelete,
  onDone,
}: {
  table: ContentTable;
  id: string;
  title: string;
  slug?: string;
  state: string;
  documentUrl?: string;
  onEdit?: () => void;
  onDelete: () => void;
  onDone: () => void;
}) {
  const navigate = useNavigate();
  const codeManaged =
    table === "services" &&
    getStaticServiceEntries().some((entry) => entry.slug === slug);
  const actionLabel =
    table === "documents_library"
      ? state === "published"
        ? "Deactivate"
        : "Activate"
      : codeManaged
        ? state === "published"
          ? "Hide directory entry"
          : "Publish directory entry"
        : state === "published"
          ? "Unpublish"
          : "Publish";
  const [busy, setBusy] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const editPath =
    table === "projects"
      ? "/admin/projects"
      : table === "services"
        ? "/admin/services"
        : "/admin/blog";
  const run = async (action: () => Promise<void>) => {
    if (busy) return;
    setBusy(true);
    try {
      await action();
    } catch (error) {
      toast.error(adminErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };
  const preview = async () => {
    if (table === "documents_library") {
      if (documentUrl) await openDocumentUrl(documentUrl);
      return;
    }
    if (!slug) throw new Error("Save a slug before previewing.");
    const codeManaged =
      table === "services" &&
      getStaticServiceEntries().some((entry) => entry.slug === slug);
    const url =
      state === "published" || codeManaged
        ? `${table === "projects" ? "/projects" : table === "services" ? "/services" : "/blog"}/${slug}`
        : await savePreviewLink(table, id, slug);
    window.open(url, "_blank", "noopener,noreferrer");
  };
  const publish = async () => {
    const result =
      table === "documents_library"
        ? await supabase
            .from("documents_library")
            .update({ is_active: state !== "published" })
            .eq("id", id)
            .select("id")
            .single()
        : await supabase
            .from(table)
            .update({
              publish_state: state === "published" ? "draft" : "published",
            })
            .eq("id", id)
            .select("id")
            .single();
    if (result.error) throw result.error;
    if (!result.data) throw new Error("Could not verify the updated status.");
    onDone();
    toast.success(
      codeManaged
        ? "Directory visibility updated"
        : table === "documents_library"
          ? "Document listing updated"
          : "Publication status updated",
    );
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy}
            aria-label={`Actions for ${title}`}
          >
            Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => (onEdit ? onEdit() : navigate(`${editPath}/${id}`))}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => void run(preview)}>
            Preview
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() =>
              void run(async () => {
                const duplicateId = await duplicateContent(table, id);
                onDone();
                toast.success("Created a hidden draft copy");
                if (table !== "documents_library")
                  navigate(`${editPath}/${duplicateId}`);
              })
            }
          >
            Duplicate as draft
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setPublishOpen(true)}>
            {actionLabel}
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive" onSelect={onDelete}>
            Delete…
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        open={publishOpen}
        onOpenChange={setPublishOpen}
        title={`${actionLabel}?`}
        description={
          codeManaged
            ? `Change the service directory entry for “${title}”? The dedicated public page remains managed in code.`
            : table === "documents_library"
              ? `Change the listing status for “${title}”? Restricted files retain their access permissions.`
              : `Change public visibility for “${title}”?`
        }
        confirmText={actionLabel}
        onConfirm={() => void run(publish)}
      />
    </>
  );
}
