import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

const StatsManager = () => {
  const { isLoading: authLoading } = useAdminAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('stats')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setStats(data || []);
    } catch (error: any) {
      toast.error("Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const statData = {
        ...editingStat,
        updated_by: userId,
        updated_at: new Date().toISOString()
      };

      if (editingStat.id) {
        const { error } = await supabase
          .from('stats')
          .update(statData)
          .eq('id', editingStat.id);
        if (error) throw error;
        toast.success("Stat updated", {
          action: {
            label: "View on Website →",
            onClick: () => window.open('/', '_blank')
          }
        });
      } else {
        const { error } = await supabase
          .from('stats')
          .insert({ ...statData, created_by: userId });
        if (error) throw error;
        toast.success("Stat created", {
          action: {
            label: "View on Website →",
            onClick: () => window.open('/', '_blank')
          }
        });
      }

      setDialogOpen(false);
      setEditingStat(null);
      fetchStats();
    } catch (error: any) {
      toast.error("Failed to save stat");
    }
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statToDelete, setStatToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setStatToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!statToDelete) return;

    try {
      const { error } = await supabase
        .from('stats')
        .delete()
        .eq('id', statToDelete);

      if (error) throw error;
      toast.success("Stat deleted");
      fetchStats();
    } catch (error: any) {
      toast.error("Failed to delete stat");
    }
    setDeleteDialogOpen(false);
    setStatToDelete(null);
  };

  const newStat = () => {
    setEditingStat({
      label: '',
      value: 0,
      suffix: '+',
      description: '',
      icon_name: 'Building2',
      display_order: stats.length + 1,
      is_active: true
    });
    setDialogOpen(true);
  };

  const gcStatTemplates = [
    { label: 'Total Project Value', value: 50000000, suffix: 'M+', description: 'Million in completed projects', icon_name: 'DollarSign' },
    { label: 'Square Footage', value: 2000000, suffix: '+', description: 'Sq ft of construction completed', icon_name: 'Building2' },
    { label: 'Active Projects', value: 12, suffix: '', description: 'Currently under construction', icon_name: 'Hammer' },
    { label: 'Safety Record', value: 500, suffix: '+', description: 'Days without incident', icon_name: 'Shield' },
    { label: 'Projects Completed', value: 500, suffix: '+', description: 'Successfully delivered projects', icon_name: 'CheckCircle' },
    { label: 'Client Satisfaction', value: 98, suffix: '%', description: 'Client satisfaction rate', icon_name: 'Award' },
    { label: 'Years in Business', value: 15, suffix: '+', description: 'Years serving the GTA', icon_name: 'TrendingUp' },
    { label: 'Licensed Trades', value: 50, suffix: '+', description: 'Certified tradespeople', icon_name: 'Users' },
  ];

  const applyTemplate = (template: any) => {
    setEditingStat({
      ...template,
      display_order: stats.length + 1,
      is_active: true
    });
    setDialogOpen(true);
  };

  if (authLoading || loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">Manage Statistics</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/admin')}>
              Back to Dashboard
            </Button>
            <Button variant="outline" onClick={() => window.open('/', '_blank')}>
              View on Website
            </Button>
            <Button onClick={newStat}>
              <Plus className="h-4 w-4 mr-2" />
              Add Custom Stat
            </Button>
          </div>
        </div>

        {/* GC-Specific Templates */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Contractor Stat Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Click a template to quickly add GC-specific metrics to your homepage
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {gcStatTemplates.map((template, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  className="h-auto flex-col items-start p-4 text-left"
                  onClick={() => applyTemplate(template)}
                >
                  <div className="font-semibold text-sm">{template.label}</div>
                  <div className="text-2xl font-bold text-primary my-1">
                    {template.value.toLocaleString()}{template.suffix}
                  </div>
                  <div className="text-xs text-muted-foreground">{template.description}</div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.map((stat) => (
                  <TableRow key={stat.id}>
                    <TableCell>{stat.display_order}</TableCell>
                    <TableCell className="font-medium">{stat.label}</TableCell>
                    <TableCell>{stat.value}{stat.suffix}</TableCell>
                    <TableCell className="max-w-xs truncate">{stat.description}</TableCell>
                    <TableCell>{stat.is_active ? '✓' : ''}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingStat(stat);
                            setDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(stat.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingStat?.id ? 'Edit Stat' : 'New Stat'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Label *</Label>
                <Input
                  value={editingStat?.label || ''}
                  onChange={(e) => setEditingStat({ ...editingStat, label: e.target.value })}
                  placeholder="Projects Completed"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Value *</Label>
                  <Input
                    type="number"
                    value={editingStat?.value || 0}
                    onChange={(e) => setEditingStat({ ...editingStat, value: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Suffix</Label>
                  <Input
                    value={editingStat?.suffix || ''}
                    onChange={(e) => setEditingStat({ ...editingStat, suffix: e.target.value })}
                    placeholder="+ or %"
                    maxLength={3}
                  />
                </div>
                <div>
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={editingStat?.display_order || 0}
                    onChange={(e) => setEditingStat({ ...editingStat, display_order: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Input
                  value={editingStat?.description || ''}
                  onChange={(e) => setEditingStat({ ...editingStat, description: e.target.value })}
                  placeholder="Brief description"
                />
              </div>

              <div>
                <Label>Icon</Label>
                <Select
                  value={editingStat?.icon_name || 'Building2'}
                  onValueChange={(value) => setEditingStat({ ...editingStat, icon_name: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Building2">Building2 (Projects)</SelectItem>
                    <SelectItem value="DollarSign">DollarSign (Revenue)</SelectItem>
                    <SelectItem value="Hammer">Hammer (Construction)</SelectItem>
                    <SelectItem value="Shield">Shield (Safety)</SelectItem>
                    <SelectItem value="Users">Users (Team/Clients)</SelectItem>
                    <SelectItem value="Award">Award (Recognition)</SelectItem>
                    <SelectItem value="TrendingUp">TrendingUp (Growth)</SelectItem>
                    <SelectItem value="CheckCircle">CheckCircle (Completion)</SelectItem>
                    <SelectItem value="Zap">Zap (Speed)</SelectItem>
                    <SelectItem value="Star">Star (Quality)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={editingStat?.is_active || false}
                  onCheckedChange={(checked) => setEditingStat({ ...editingStat, is_active: checked })}
                />
                <Label>Active</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save Stat
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDelete}
          title="Delete Statistic"
          description="Are you sure you want to delete this statistic? This action cannot be undone."
          confirmText="Delete"
          variant="destructive"
        />
      </div>
    </div>
  );
};

export default StatsManager;
