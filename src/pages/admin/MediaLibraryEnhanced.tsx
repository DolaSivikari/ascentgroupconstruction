import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/ui/Button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface MediaAsset {
  id: string;
  title: string;
  file_url: string;
  file_name: string;
  file_type: string | null;
  file_size: number | null;
  alt_text: string | null;
  focal_point_x: number;
  focal_point_y: number;
  created_at: string;
}

const MediaLibraryEnhanced = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingAsset, setEditingAsset] = useState<MediaAsset | null>(null);
  const [focalPoint, setFocalPoint] = useState({ x: 0.5, y: 0.5 });
  const [altText, setAltText] = useState("");

  const { data: assets = [], isLoading } = useQuery({
    queryKey: ["media-library-enhanced"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents_library" as any)
        .select("id, title, file_url, file_name, file_type, file_size, alt_text, focal_point_x, focal_point_y, created_at")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return (data as any[]).map(item => ({
        ...item,
        focal_point_x: item.focal_point_x || 0.5,
        focal_point_y: item.focal_point_y || 0.5,
      })) as MediaAsset[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase.from("documents_library" as any).update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media-library-enhanced"] });
      toast({ title: "Media asset updated" });
      setEditingAsset(null);
    },
  });

  const handleEditAsset = (asset: MediaAsset) => {
    setEditingAsset(asset);
    setFocalPoint({ x: asset.focal_point_x, y: asset.focal_point_y });
    setAltText(asset.alt_text || "");
  };

  const handleSave = () => {
    if (editingAsset) {
      updateMutation.mutate({
        id: editingAsset.id,
        updates: {
          focal_point_x: focalPoint.x,
          focal_point_y: focalPoint.y,
          alt_text: altText,
        },
      });
    }
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setFocalPoint({ x, y });
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "Unknown";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Media Library</h1>
        <p className="text-muted-foreground">Enhanced media management with focal points and alt text</p>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : assets.length === 0 ? (
        <Card className="p-12 text-center">
          <Image className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No media assets found</p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {assets.map((asset) => (
            <Card key={asset.id} className="p-3 cursor-pointer hover:border-primary" onClick={() => handleEditAsset(asset)}>
              <div className="aspect-square bg-muted rounded mb-2 overflow-hidden">
                {asset.file_url && <img src={asset.file_url} alt={asset.alt_text || asset.title} width={400} height={400} className="w-full h-full object-cover" />}
              </div>
              <p className="text-sm font-medium truncate">{asset.title}</p>
              <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                <span>{formatFileSize(asset.file_size)}</span>
                {asset.alt_text && <Badge variant="secondary" className="text-xs">ALT</Badge>}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!editingAsset} onOpenChange={() => setEditingAsset(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Media Asset</DialogTitle>
          </DialogHeader>
          {editingAsset && (
            <div className="space-y-4">
              <div>
                <Label>Focal Point (Click to set)</Label>
                <div className="relative aspect-video bg-muted rounded overflow-hidden cursor-crosshair mt-2" onClick={handleImageClick}>
                  <img src={editingAsset.file_url} alt={editingAsset.title} width={400} height={400} className="w-full h-full object-cover" />
                  <div
                    className="absolute w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${focalPoint.x * 100}%`, top: `${focalPoint.y * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <Label>Alt Text</Label>
                <Input value={altText} onChange={(e) => setAltText(e.target.value)} placeholder="Describe the image" />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave}>Save</Button>
                <Button variant="outline" onClick={() => setEditingAsset(null)}>Cancel</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediaLibraryEnhanced;
