import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MediaBrowser } from "./MediaBrowser";
import type { MediaAsset } from "@/lib/admin/media";
export function MediaPicker({
  open,
  onOpenChange,
  onChoose,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChoose: (asset: MediaAsset) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose from library</DialogTitle>
          <DialogDescription>
            Select an existing image from project-images. Choosing a file does
            not publish your draft.
          </DialogDescription>
        </DialogHeader>
        {open && (
          <MediaBrowser
            onChoose={(asset) => {
              onChoose(asset);
              onOpenChange(false);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
