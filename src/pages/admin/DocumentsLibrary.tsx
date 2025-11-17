import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { UnifiedSidebar } from "@/components/admin/UnifiedSidebar";
import { Button } from "@/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Download, FileText, Calendar, Eye } from "lucide-react";
import { format } from "date-fns";

interface Document {
  id: string;
  title: string;
  description: string | null;
  category: string;
  file_url: string;
  file_name: string;
  file_size: number | null;
  file_type: string | null;
  version: string;
  is_active: boolean;
  requires_authentication: boolean;
  expiry_date: string | null;
  display_order: number;
  download_count: number;
  created_at: string;
}

const categoryLabels: Record<string, string> = {
  prequalification: "Pre-Qualification Package",
  insurance: "Insurance Certificates",
  "capability-statement": "Capability Statements",
  safety: "Safety Documentation",
  certifications: "Certifications",
  other: "Other"
};

export default function DocumentsLibrary() {
  const { isLoading, isAdmin } = useAdminAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "prequalification",
    file: null as File | null,
    version: "1.0",
    is_active: true,
    requires_authentication: false,
    expiry_date: "",
    display_order: 0
  });

  useEffect(() => {
    if (!isLoading && isAdmin) {
      fetchDocuments();
    }
  }, [isLoading, isAdmin]);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents_library')
        .select('*')
        .order('category')
        .order('display_order');

      if (error) throw error;
      setDocuments(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file && !editingDoc) {
      toast({ title: "Error", description: "Please select a file", variant: "destructive" });
      return;
    }

    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let file_url = editingDoc?.file_url || '';
      let file_name = editingDoc?.file_name || '';
      let file_size = editingDoc?.file_size || 0;
      let file_type = editingDoc?.file_type || '';

      if (formData.file) {
        file_url = await uploadFile(formData.file);
        file_name = formData.file.name;
        file_size = formData.file.size;
        file_type = formData.file.type;
      }

      const payload = {
        title: formData.title,
        description: formData.description || null,
        category: formData.category,
        file_url,
        file_name,
        file_size,
        file_type,
        version: formData.version,
        is_active: formData.is_active,
        requires_authentication: formData.requires_authentication,
        expiry_date: formData.expiry_date || null,
        display_order: formData.display_order,
        ...(editingDoc ? { updated_by: user.id } : { created_by: user.id })
      };

      if (editingDoc) {
        const { error } = await supabase
          .from('documents_library')
          .update(payload)
          .eq('id', editingDoc.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('documents_library').insert([payload]);
        if (error) throw error;
      }

      toast({ title: "Success", description: `Document ${editingDoc ? 'updated' : 'uploaded'} successfully` });
      setDialogOpen(false);
      resetForm();
      fetchDocuments();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, fileUrl: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
      const { error } = await supabase.from('documents_library').delete().eq('id', id);
      if (error) throw error;
      
      // Optionally delete file from storage
      const path = fileUrl.split('/documents/')[1];
      if (path) {
        await supabase.storage.from('documents').remove([path]);
      }
      
      toast({ title: "Success", description: "Document deleted successfully" });
      fetchDocuments();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const openEditDialog = (doc: Document) => {
    setEditingDoc(doc);
    setFormData({
      title: doc.title,
      description: doc.description || "",
      category: doc.category,
      file: null,
      version: doc.version,
      is_active: doc.is_active,
      requires_authentication: doc.requires_authentication,
      expiry_date: doc.expiry_date || "",
      display_order: doc.display_order
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingDoc(null);
    setFormData({
      title: "",
      description: "",
      category: "prequalification",
      file: null,
      version: "1.0",
      is_active: true,
      requires_authentication: false,
      expiry_date: "",
      display_order: 0
    });
  };

  if (isLoading || loading) {
    return (
      <div className="flex h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <UnifiedSidebar collapsed={false} onToggle={() => {}} />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Documents Library</h1>
              <p className="text-muted-foreground">Manage downloadable documents and resources</p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
              <DialogTrigger asChild>
                <Button><Plus className="w-4 h-4 mr-2" />Upload Document</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingDoc ? 'Edit' : 'Upload'} Document</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Title *</Label>
                    <Input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(categoryLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Version</Label>
                      <Input value={formData.version} onChange={(e) => setFormData({ ...formData, version: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <Label>File {editingDoc && '(leave empty to keep current file)'}</Label>
                    <Input type="file" onChange={handleFileSelect} accept=".pdf,.doc,.docx,.xls,.xlsx" />
                    {editingDoc && <p className="text-xs text-muted-foreground mt-1">Current: {editingDoc.file_name}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Expiry Date</Label>
                      <Input type="date" value={formData.expiry_date} onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })} />
                    </div>
                    <div>
                      <Label>Display Order</Label>
                      <Input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })} />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch checked={formData.is_active} onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })} />
                      <Label>Active</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch checked={formData.requires_authentication} onCheckedChange={(checked) => setFormData({ ...formData, requires_authentication: checked })} />
                      <Label>Requires Login</Label>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={uploading}>
                      {uploading ? 'Uploading...' : (editingDoc ? 'Update' : 'Upload')}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Documents ({documents.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Downloads</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No documents uploaded yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            {doc.title}
                          </div>
                        </TableCell>
                        <TableCell>{categoryLabels[doc.category]}</TableCell>
                        <TableCell>{doc.version}</TableCell>
                        <TableCell>{doc.download_count}</TableCell>
                        <TableCell>
                          {doc.expiry_date ? format(new Date(doc.expiry_date), 'MMM d, yyyy') : '-'}
                        </TableCell>
                        <TableCell>
                          {doc.is_active ? (
                            <Badge variant="success">Active</Badge>
                          ) : (
                            <Badge variant="inactive">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => window.open(doc.file_url, '_blank')}>
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => openEditDialog(doc)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(doc.id, doc.file_url)}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
