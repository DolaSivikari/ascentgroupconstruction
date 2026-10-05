import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Folder, Image as ImageIcon } from "lucide-react";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import {
  listMedia,
  uploadMedia,
  saveMediaAlt,
  findMediaReferences,
  deleteUnusedMedia,
  type MediaAsset,
} from "@/lib/admin/media";
import { adminErrorMessage } from "@/lib/admin/editorValues";
import { ConfirmDialog } from "./ConfirmDialog";
import { toast } from "sonner";

export function MediaBrowser({
  onChoose,
  manage = false,
  initialFolder = "",
  initialSearch = "",
}: {
  onChoose?: (asset: MediaAsset) => void;
  manage?: boolean;
  initialFolder?: string;
  initialSearch?: string;
}) {
  const [folder, setFolder] = useState(
    initialFolder.split("/").includes("..") ? "" : initialFolder,
  );
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState(initialSearch);
  const [altText, setAltText] = useState("");
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");
  const [selected, setSelected] = useState<MediaAsset | null>(null);
  const [removing, setRemoving] = useState<MediaAsset | null>(null);
  const client = useQueryClient();
  const query = useQuery({
    queryKey: ["media-storage", folder, page, search],
    queryFn: () => listMedia(folder, page, search),
    retry: false,
  });
  const refresh = () =>
    client.invalidateQueries({ queryKey: ["media-storage"] });
  const upload = async (files: File[]) => {
    if (busy) return;
    setBusy(true);
    setFailure("");
    const failures: string[] = [];
    let uploaded = 0;
    for (const file of files)
      try {
        const path = await uploadMedia(file, folder, altText);
        uploaded++;
        if (query.data?.metadataReady) await saveMediaAlt(path, altText);
      } catch (error) {
        failures.push(adminErrorMessage(error));
      }
    if (uploaded) toast.success(`${uploaded} image(s) uploaded`);
    if (failures.length) setFailure(failures.join(" "));
    await refresh();
    setBusy(false);
  };
  const inspectRemoval = async (asset: MediaAsset) => {
    setBusy(true);
    setFailure("");
    try {
      const uses = await findMediaReferences(asset.url);
      if (uses.length)
        setFailure(
          `Retained — used by ${uses.map((use) => `${use.table}: ${use.title}`).join(", ")}.`,
        );
      else setRemoving(asset);
    } catch (error) {
      setFailure(adminErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="space-y-4 min-w-0">
      <div className="flex flex-wrap gap-2 items-center">
        <Button
          variant="outline"
          disabled={!folder}
          onClick={() => {
            setFolder(folder.split("/").slice(0, -1).join("/"));
            setPage(0);
          }}
        >
          Up one folder
        </Button>
        <span className="text-sm break-all">
          project-images / {folder || "root"}
        </span>
      </div>
      <Input
        aria-label="Search filenames in this folder"
        placeholder="Search this folder by filename"
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
          setPage(0);
        }}
      />
      {manage && (
        <div
          className="rounded-lg border border-dashed p-4 space-y-3"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            void upload(Array.from(event.dataTransfer.files));
          }}
        >
          <p>
            Upload images or drop files here (JPG, PNG, WebP, AVIF, GIF; up to
            10 MB each).
          </p>
          <Input
            aria-label="Alt text for uploaded images"
            placeholder="Describe the uploaded image(s)"
            value={altText}
            onChange={(event) => setAltText(event.target.value)}
          />
          <input
            aria-label="Upload media images"
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
            disabled={busy}
            onChange={(event) => {
              void upload(Array.from(event.target.files || []));
              event.target.value = "";
            }}
          />
        </div>
      )}
      {failure && (
        <p
          role="alert"
          className="rounded-lg border p-3 text-destructive break-words"
        >
          {failure}
        </p>
      )}
      {query.isLoading ? (
        <p role="status">Loading storage…</p>
      ) : query.error ? (
        <div role="alert">
          <p>Could not load media: {adminErrorMessage(query.error)}</p>
          <Button variant="outline" onClick={() => void query.refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <>
          {manage && query.data && !query.data.metadataReady && (
            <p className="text-sm text-muted-foreground">
              Editing alt text for existing files needs the reviewed
              0004_admin_media_and_audit.sql. Uploads already store their
              supplied alt text in storage metadata.
            </p>
          )}
          {!query.data?.files.length && (
            <p>
              No matching files in this folder. Choose another folder or upload
              an image.
            </p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {query.data?.files.map((asset) => (
              <div
                key={asset.path}
                className="rounded-lg border bg-card p-2 space-y-2 min-w-0"
              >
                {asset.folder ? (
                  <Button
                    variant="ghost"
                    className="w-full h-28 flex-col"
                    onClick={() => {
                      setFolder(asset.path);
                      setPage(0);
                      setSearch("");
                    }}
                  >
                    <Folder size={35} />
                    {asset.name}
                  </Button>
                ) : (
                  <>
                    <img
                      src={asset.url}
                      alt={asset.altText || asset.name}
                      loading="lazy"
                      className="w-full h-28 object-cover rounded-md"
                    />
                    <p className="text-xs break-all">{asset.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(asset.size / 1024)} KB
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {onChoose && (
                        <Button size="sm" onClick={() => onChoose(asset)}>
                          Choose
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          void navigator.clipboard
                            .writeText(asset.url)
                            .then(() => toast.success("Image URL copied"))
                            .catch(() =>
                              setFailure(
                                "Could not copy. Open the image and copy its URL.",
                              ),
                            )
                        }
                      >
                        Copy URL
                      </Button>
                      {manage && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={!query.data?.metadataReady || busy}
                            onClick={() => {
                              setSelected(asset);
                              setAltText(asset.altText);
                            }}
                          >
                            Alt text
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={busy}
                            onClick={() => void inspectRemoval(asset)}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-3 items-center">
            <Button
              variant="outline"
              disabled={page === 0 || busy}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <span>Page {page + 1}</span>
            <Button
              variant="outline"
              disabled={!query.data?.hasNext || busy}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}
      {selected && (
        <div className="rounded-lg border p-4 space-y-3">
          <p>Edit alt text: {selected.name}</p>
          <Input
            aria-label="Image alt text"
            value={altText}
            maxLength={500}
            onChange={(event) => setAltText(event.target.value)}
          />
          <div className="flex gap-2">
            <Button
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await saveMediaAlt(selected.path, altText);
                  setSelected(null);
                  await refresh();
                  toast.success("Alt text saved");
                } catch (error) {
                  setFailure(adminErrorMessage(error));
                } finally {
                  setBusy(false);
                }
              }}
            >
              Save alt text
            </Button>
            <Button variant="outline" onClick={() => setSelected(null)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
      <ConfirmDialog
        open={!!removing}
        onOpenChange={(open) => {
          if (!open) setRemoving(null);
        }}
        title="Delete unused image?"
        description="References in projects, galleries, services, blog posts and hero slides will be checked again immediately before removal. This deletes the storage file."
        confirmText="Delete image"
        variant="destructive"
        onConfirm={async () => {
          if (!removing || busy) return;
          const asset = removing;
          setBusy(true);
          try {
            const warning = await deleteUnusedMedia(asset);
            await refresh();
            toast.success("Unused file removed");
            if (warning) setFailure(warning);
          } catch (error) {
            setFailure(adminErrorMessage(error));
          } finally {
            setBusy(false);
            setRemoving(null);
          }
        }}
      />
    </div>
  );
}
