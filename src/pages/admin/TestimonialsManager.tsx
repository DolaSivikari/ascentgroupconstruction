import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Plus, Pencil, Trash2, Star } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

const TestimonialsManager = () => {
  const { isLoading: authLoading } = useAdminAuth();
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error: any) {
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const testimonialData = {
        ...editingTestimonial,
        updated_by: userId,
        updated_at: new Date().toISOString()
      };

      if (editingTestimonial.id) {
        const { error } = await supabase
          .from('testimonials')
          .update(testimonialData)
          .eq('id', editingTestimonial.id);
        if (error) throw error;
        toast.success("Testimonial updated");
      } else {
        const { error } = await supabase
          .from('testimonials')
          .insert({ ...testimonialData, created_by: userId });
        if (error) throw error;
        toast.success("Testimonial created");
      }

      setDialogOpen(false);
      setEditingTestimonial(null);
      fetchTestimonials();
    } catch (error: any) {
      toast.error("Failed to save testimonial");
    }
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setTestimonialToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!testimonialToDelete) return;

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', testimonialToDelete);

      if (error) throw error;
      toast.success("Testimonial deleted");
      fetchTestimonials();
    } catch (error: any) {
      toast.error("Failed to delete testimonial");
    }
    setDeleteDialogOpen(false);
    setTestimonialToDelete(null);
  };

  const newTestimonial = () => {
    setEditingTestimonial({
      quote: '',
      author_name: '',
      author_position: '',
      company_name: '',
      project_name: '',
      rating: 5.0,
      is_featured: false,
      display_order: testimonials.length + 1,
      publish_state: 'published'
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
            <h1 className="text-3xl font-bold">Manage Testimonials</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/admin')}>
              Back to Dashboard
            </Button>
            <Button onClick={newTestimonial}>
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Author</TableHead>
                  <TableHead>Quote</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((testimonial) => (
                  <TableRow key={testimonial.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{testimonial.author_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {testimonial.author_position} at {testimonial.company_name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md truncate">{testimonial.quote}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {testimonial.rating} <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      </div>
                    </TableCell>
                    <TableCell>{testimonial.is_featured ? '✓' : ''}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${testimonial.publish_state === 'published' ? 'bg-[hsl(142_76%_85%)] text-[hsl(142_76%_25%)]' : 'bg-muted text-muted-foreground'}`}>
                        {testimonial.publish_state}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingTestimonial(testimonial);
                            setDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(testimonial.id)}
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
                {editingTestimonial?.id ? 'Edit Testimonial' : 'New Testimonial'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Quote *</Label>
                <Textarea
                  value={editingTestimonial?.quote || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })}
                  rows={4}
                  maxLength={500}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Author Name *</Label>
                  <Input
                    value={editingTestimonial?.author_name || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, author_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Position</Label>
                  <Input
                    value={editingTestimonial?.author_position || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, author_position: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Company</Label>
                  <Input
                    value={editingTestimonial?.company_name || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, company_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Project Name</Label>
                  <Input
                    value={editingTestimonial?.project_name || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, project_name: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Rating</Label>
                  <Input
                    type="number"
                    min="0"
                    max="5"
                    step="0.5"
                    value={editingTestimonial?.rating || 5}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={editingTestimonial?.display_order || 0}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, display_order: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select
                    value={editingTestimonial?.publish_state || 'published'}
                    onValueChange={(value) => setEditingTestimonial({ ...editingTestimonial, publish_state: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={editingTestimonial?.is_featured || false}
                  onCheckedChange={(checked) => setEditingTestimonial({ ...editingTestimonial, is_featured: checked })}
                />
                <Label>Featured (show on homepage)</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save Testimonial
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDelete}
          title="Delete Testimonial"
          description="Are you sure you want to delete this testimonial? This action cannot be undone."
          confirmText="Delete"
          variant="destructive"
        />
      </div>
    </div>
  );
};

export default TestimonialsManager;
