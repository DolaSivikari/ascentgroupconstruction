import { useEffect, useState } from "react";
import { Button } from "@/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog } from "./ConfirmDialog";
export function EditorActions({
  title,
  state,
  onStateChange,
  formId,
  disabled,
  onPreview,
  savedAt,
  draftAt,
}: {
  title: string;
  state: string;
  onStateChange: (state: "published" | "draft") => void;
  formId: string;
  disabled?: boolean;
  onPreview?: () => void;
  savedAt?: Date | null;
  draftAt?: Date | null;
}) {
  const [validation, setValidation] = useState("");
  useEffect(() => {
    const invalid = (event: Event) => {
      const field = event.target as HTMLInputElement;
      if (field.form?.id !== formId) return;
      const label =
        field.labels?.[0]?.textContent?.trim() ||
        field.getAttribute("aria-label")?.replace(/ validation$/, "") ||
        "Required field";
      setValidation(
        `${label}: ${field.validationMessage || "Review this field before saving."}`,
      );
    };
    const clear = (event: Event) => {
      if ((event.target as HTMLElement).closest?.("form")?.id === formId)
        setValidation("");
    };
    document.addEventListener("invalid", invalid, true);
    document.addEventListener("input", clear);
    return () => {
      document.removeEventListener("invalid", invalid, true);
      document.removeEventListener("input", clear);
    };
  }, [formId]);
  const [nextState, setNextState] = useState<"published" | "draft" | null>(
    null,
  );
  return (
    <div className="admin-editor-actions space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3 items-center">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <Badge variant={state === "published" ? "success" : "secondary"}>
            {state}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <Switch
              checked={state === "published"}
              disabled={disabled}
              onCheckedChange={(checked) =>
                setNextState(checked ? "published" : "draft")
              }
            />
            Published on Save
          </label>
          {onPreview && (
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              onClick={onPreview}
            >
              Preview
            </Button>
          )}
          <Button type="submit" form={formId} disabled={disabled}>
            {state === "published" ? "Save & publish" : "Save draft"}
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        {savedAt ? `Saved to website at ${savedAt.toLocaleTimeString()}. ` : ""}
        {draftAt
          ? `Unsaved draft stored on this device at ${draftAt.toLocaleTimeString()}. `
          : ""}
        {state === "published"
          ? "Saving updates the public page."
          : "Drafts stay hidden from visitors."}
      </p>
      {validation && (
        <p role="alert" className="text-sm text-destructive">
          Fix before saving: {validation}
        </p>
      )}
      <ConfirmDialog
        open={nextState !== null}
        onOpenChange={(open) => {
          if (!open) setNextState(null);
        }}
        onConfirm={() => {
          if (nextState) onStateChange(nextState);
          setNextState(null);
        }}
        title={
          nextState === "published"
            ? "Publish when saved?"
            : "Unpublish when saved?"
        }
        description="The status is staged in this editor. Use Save to apply it to the website."
        confirmText="Stage status"
      />
    </div>
  );
}
