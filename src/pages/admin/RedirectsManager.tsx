import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/ui/Button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Save, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface Redirect {
  id: string;
  source_path: string;
  destination_path: string;
  redirect_type: number;
  is_active: boolean;
  hit_count: number;
  notes: string | null;
  created_at: string;
}

const RedirectsManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingRedirect, setEditingRedirect] = useState<Redirect | null>(null);
  const [formData, setFormData] = useState({ source_path: "", destination_path: "", redirect_type: 301, notes: "" });

  const { data: redirects = [], isLoading } = useQuery({
    queryKey: ["redirects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("redirects" as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as Redirect[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (redirect: Omit<Redirect, "id" | "hit_count" | "created_at" | "updated_at">) => {
      const { error } = await supabase.from("redirects" as any).insert(redirect as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["redirects"] });
      setIsAdding(false);
      setFormData({ source_path: "", destination_path: "", redirect_type: 301, notes: "" });
      toast({ title: "Redirect created successfully" });
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Redirect> }) => {
      const { error } = await supabase.from("redirects" as any).update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["redirects"] });
      toast({ title: "Redirect updated successfully" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("redirects" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["redirects"] });
      toast({ title: "Redirect deleted" });
    },
  });

  const handleSave = () => {
    if (!formData.source_path || !formData.destination_path) {
      toast({ variant: "destructive", title: "Error", description: "Source and destination paths are required" });
      return;
    }

    if (editingRedirect) {
      updateMutation.mutate({ id: editingRedirect.id, updates: { ...formData } });
      setEditingRedirect(null);
    } else {
      createMutation.mutate({ ...formData, is_active: true } as any);
    }
    setFormData({ source_path: "", destination_path: "", redirect_type: 301, notes: "" });
  };

  const handleEdit = (redirect: Redirect) => {
    setEditingRedirect(redirect);
    setFormData({
      source_path: redirect.source_path,
      destination_path: redirect.destination_path,
      redirect_type: redirect.redirect_type,
      notes: redirect.notes || "",
    });
    setIsAdding(true);
  };

  const handleToggleActive = (redirect: Redirect) => {
    updateMutation.mutate({ id: redirect.id, updates: { is_active: !redirect.is_active } });
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Redirects Manager</h1>
        <p className="text-muted-foreground">Manage URL redirects (301/302) for SEO and site structure changes</p>
      </div>

      {!isAdding && (
        <Button onClick={() => setIsAdding(true)} className="mb-6">
          <Plus className="w-4 h-4 mr-2" /> Add Redirect
        </Button>
      )}

      {isAdding && (
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">{editingRedirect ? "Edit Redirect" : "Add New Redirect"}</h3>
          <div className="space-y-4">
            <div>
              <Label>Source Path</Label>
              <Input
                value={formData.source_path}
                onChange={(e) => setFormData({ ...formData, source_path: e.target.value })}
                placeholder="/old-page"
              />
              <p className="text-sm text-muted-foreground mt-1">The old URL path to redirect from</p>
            </div>
            <div>
              <Label>Destination Path</Label>
              <Input
                value={formData.destination_path}
                onChange={(e) => setFormData({ ...formData, destination_path: e.target.value })}
                placeholder="/new-page"
              />
              <p className="text-sm text-muted-foreground mt-1">The new URL path to redirect to</p>
            </div>
            <div>
              <Label>Redirect Type</Label>
              <select
                value={formData.redirect_type}
                onChange={(e) => setFormData({ ...formData, redirect_type: parseInt(e.target.value) })}
                className="w-full border rounded-md p-2"
              >
                <option value={301}>301 - Permanent</option>
                <option value={302}>302 - Temporary</option>
              </select>
            </div>
            <div>
              <Label>Notes (optional)</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Internal notes about this redirect"
                rows={2}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" /> Save
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAdding(false);
                  setEditingRedirect(null);
                  setFormData({ source_path: "", destination_path: "", redirect_type: 301, notes: "" });
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {isLoading ? (
        <p>Loading redirects...</p>
      ) : redirects.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No redirects configured yet</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {redirects.map((redirect) => (
            <Card key={redirect.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={redirect.is_active ? "default" : "secondary"}>
                      {redirect.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline">{redirect.redirect_type}</Badge>
                    {redirect.hit_count > 0 && (
                      <Badge variant="secondary">{redirect.hit_count} hits</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm mb-1">
                    <code className="bg-muted px-2 py-1 rounded">{redirect.source_path}</code>
                    <span className="text-muted-foreground">→</span>
                    <code className="bg-muted px-2 py-1 rounded">{redirect.destination_path}</code>
                  </div>
                  {redirect.notes && (
                    <p className="text-sm text-muted-foreground mt-2">{redirect.notes}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleToggleActive(redirect)}>
                    {redirect.is_active ? "Deactivate" : "Activate"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(redirect)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(redirect.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RedirectsManager;
