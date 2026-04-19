import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/ui/Button";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import DOMPurify from "dompurify";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/ui/Input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Mail, 
  Plus, 
  Pencil, 
  Trash2,
  Copy,
  Search,
  Save,
  X,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body_html: string;
  body_text: string;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const defaultTemplate: Partial<EmailTemplate> = {
  name: '',
  subject: '',
  body_html: '',
  body_text: '',
  category: 'general',
  is_active: true,
};

const categories = [
  { value: 'general', label: 'General' },
  { value: 'contact', label: 'Contact Form' },
  { value: 'quote', label: 'Quote Request' },
  { value: 'rfp', label: 'RFP' },
  { value: 'newsletter', label: 'Newsletter' },
];

const variablesList = [
  { variable: '{name}', description: 'Recipient name' },
  { variable: '{email}', description: 'Recipient email' },
  { variable: '{company}', description: 'Company name' },
  { variable: '{message}', description: 'Original message' },
  { variable: '{date}', description: 'Current date' },
  { variable: '{project_type}', description: 'Project type' },
];

const EmailTemplates = () => {
  const { toast } = useToast();
  const { isLoading: authLoading, isAdmin } = useAdminAuth();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Editor state
  const [isEditing, setIsEditing] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<Partial<EmailTemplate>>(defaultTemplate);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      loadTemplates();
    }
  }, [isAdmin]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast({
        variant: "destructive",
        title: "Failed to load templates",
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentTemplate.name || !currentTemplate.subject) {
      toast({
        variant: "destructive",
        title: "Validation error",
        description: "Name and subject are required.",
      });
      return;
    }

    setSaving(true);
    try {
      if (currentTemplate.id) {
        // Update existing
        const { error } = await supabase
          .from('email_templates')
          .update({
            name: currentTemplate.name,
            subject: currentTemplate.subject,
            body_html: currentTemplate.body_html,
            body_text: currentTemplate.body_text,
            category: currentTemplate.category,
            is_active: currentTemplate.is_active,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentTemplate.id);

        if (error) throw error;
        toast({ title: "Template updated successfully" });
      } else {
        // Create new
        const { error } = await supabase
          .from('email_templates')
          .insert({
            name: currentTemplate.name,
            subject: currentTemplate.subject,
            body_html: currentTemplate.body_html || '',
            body_text: currentTemplate.body_text || '',
            category: currentTemplate.category,
            is_active: currentTemplate.is_active,
          });

        if (error) throw error;
        toast({ title: "Template created successfully" });
      }

      loadTemplates();
      setIsEditing(false);
      setCurrentTemplate(defaultTemplate);
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        variant: "destructive",
        title: "Failed to save template",
        description: "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const { error } = await supabase
        .from('email_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTemplates(prev => prev.filter(t => t.id !== id));
      toast({ title: "Template deleted" });
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        variant: "destructive",
        title: "Failed to delete template",
      });
    }
  };

  const handleDuplicate = (template: EmailTemplate) => {
    setCurrentTemplate({
      ...template,
      id: undefined,
      name: `${template.name} (Copy)`,
    });
    setIsEditing(true);
  };

  const insertVariable = (variable: string) => {
    setCurrentTemplate(prev => ({
      ...prev,
      body_html: (prev.body_html || '') + variable,
      body_text: (prev.body_text || '') + variable,
    }));
  };

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (authLoading) return null;
  if (!isAdmin) return null;

  return (
    <AdminPageLayout
      title="Email Templates"
      description="Manage automated email templates for form submissions"
      icon={<Mail className="h-7 w-7 text-primary" />}
      actions={
        <Button
          onClick={() => {
            setCurrentTemplate(defaultTemplate);
            setIsEditing(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Template
        </Button>
      }
    >

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            All
          </Button>
          {categories.map(cat => (
            <Button
              key={cat.value}
              variant={selectedCategory === cat.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Templates List */}
      <div className="business-glass-card">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4 p-4 border-b border-border last:border-0">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="p-12 text-center">
            <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">
              No templates found
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Try adjusting your search." : "Create your first email template."}
            </p>
            <Button onClick={() => { setCurrentTemplate(defaultTemplate); setIsEditing(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium truncate">{template.name}</h4>
                    <Badge variant={template.is_active ? "default" : "secondary"}>
                      {template.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {template.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    Subject: {template.subject}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      setCurrentTemplate(template);
                      setPreviewOpen(true);
                    }}
                    title="Preview"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      setCurrentTemplate(template);
                      setIsEditing(true);
                    }}
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDuplicate(template)}
                    title="Duplicate"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(template.id)}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editor Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentTemplate.id ? 'Edit Template' : 'New Template'}
            </DialogTitle>
            <DialogDescription>
              Create or edit email templates. Use variables like {'{name}'} or {'{email}'} for dynamic content.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name *</Label>
                <Input
                  id="name"
                  value={currentTemplate.name || ''}
                  onChange={(e) => setCurrentTemplate(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Contact Form Auto-Reply"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={currentTemplate.category || 'general'}
                  onChange={(e) => setCurrentTemplate(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Email Subject *</Label>
              <Input
                id="subject"
                value={currentTemplate.subject || ''}
                onChange={(e) => setCurrentTemplate(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="e.g., Thank you for contacting Ascent Group"
              />
            </div>

            {/* Variables */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <Label className="mb-2 block">Available Variables</Label>
              <div className="flex flex-wrap gap-2">
                {variablesList.map(v => (
                  <Button
                    key={v.variable}
                    variant="outline"
                    size="sm"
                    onClick={() => insertVariable(v.variable)}
                    title={v.description}
                  >
                    {v.variable}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="body_html">Email Body (HTML)</Label>
              <Textarea
                id="body_html"
                value={currentTemplate.body_html || ''}
                onChange={(e) => setCurrentTemplate(prev => ({ ...prev, body_html: e.target.value }))}
                placeholder="<p>Dear {name},</p><p>Thank you for your inquiry...</p>"
                className="min-h-[200px] font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body_text">Email Body (Plain Text)</Label>
              <Textarea
                id="body_text"
                value={currentTemplate.body_text || ''}
                onChange={(e) => setCurrentTemplate(prev => ({ ...prev, body_text: e.target.value }))}
                placeholder="Dear {name},&#10;&#10;Thank you for your inquiry..."
                className="min-h-[120px]"
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="is_active"
                checked={currentTemplate.is_active ?? true}
                onCheckedChange={(checked) => setCurrentTemplate(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Template is active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Template Preview</DialogTitle>
            <DialogDescription>
              Preview how the email will look with sample data
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 border border-border rounded-lg bg-white">
              <div className="text-sm text-muted-foreground mb-2">
                <strong>Subject:</strong> {currentTemplate.subject?.replace(/{(\w+)}/g, '[Sample $1]')}
              </div>
              <hr className="my-4" />
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize((currentTemplate.body_html || '').replace(/{(\w+)}/g, '<span class="text-primary">[Sample $1]</span>'))
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageLayout>
  );
};

export default EmailTemplates;
